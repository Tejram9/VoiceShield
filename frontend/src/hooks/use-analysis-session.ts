"use client";

/**
 * VoiceShield Frontend — Master Analysis Session Hook
 *
 * Orchestrates the full session lifecycle:
 *   1. Session creation (REST POST)
 *   2. Session state fetch (REST GET)
 *   3. WebSocket connection (real-time events)
 *   4. Event dispatch → useAnalysisState reducer
 *   5. Microphone capture → encode → analyze REST POST
 *
 * This hook delegates ALL event-to-state mapping to useAnalysisState.
 * It does NOT parse metadata fields or guess event structures.
 *
 * Exposed state is typed — no `any`, no string casts in the UI.
 */

import { useEffect, useState, useCallback, useRef } from "react";
import type {
  AnalysisSession,
  AnalyzeSegmentRequest,
  RiskAssessment,
} from "../lib/api/types";
import { createSession, getSession, analyzeSegment } from "../lib/api/client";
import {
  AnalysisWebSocketClient,
} from "../lib/websocket/analysis-socket";
import type { ConnectionState, BackpressureStats } from "../lib/websocket/analysis-socket";
import {
  useMicrophone,
} from "./use-microphone";
import type { MicrophoneState, MicrophoneStats } from "./use-microphone";
import {
  float32ToBase64Pcm16,
  hasSignificantAudio,
} from "../lib/audio/encoding";
import { useAnalysisState } from "./use-analysis-state";
import type { AnalysisState } from "./use-analysis-state";
import type { AnalysisStatus } from "../types/analysis";
import { VoiceShieldError } from "../types/analysis";

export interface UseAnalysisSessionReturn {
  // Session metadata
  session: AnalysisSession | null;
  isInitializing: boolean;
  sessionError: string | null;

  // Connection
  connectionState: ConnectionState;
  connectionError: string | null;

  // Backpressure
  backpressureStats: BackpressureStats;

  // All AI analysis state (typed per-signal)
  analysisState: AnalysisState;

  // Convenience accessors (derived from analysisState)
  riskAssessment: RiskAssessment | null;
  transcript: string;
  analysisStatus: AnalysisStatus;

  // Microphone
  micState: MicrophoneState;
  micStats: MicrophoneStats;

  // Actions
  startMicrophone: () => Promise<void>;
  stopMicrophone: () => void;
  triggerAnalysis: (payload?: AnalyzeSegmentRequest) => Promise<void>;
  reconnectWebSocket: () => void;
  resetSession: () => Promise<void>;
}

export function useAnalysisSession(initialSessionId?: string): UseAnalysisSessionReturn {
  const [session, setSession] = useState<AnalysisSession | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const [connectionState, setConnectionState] = useState<ConnectionState>("DISCONNECTED");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [backpressureStats, setBackpressureStats] = useState<BackpressureStats>({
    chunksProduced: 0,
    chunksSent: 0,
    chunksProcessed: 0,
    chunksDropped: 0,
    queueDepth: 0,
    status: "NORMAL",
  });

  // Stable ref for async callbacks (avoids stale closure)
  const sessionRef = useRef<AnalysisSession | null>(null);
  const sequenceRef = useRef<number>(0);

  // Typed analysis state reducer — all event-to-state mapping lives here
  const { state: analysisState, processEvent, setRiskAssessment, reset: resetAnalysisState } =
    useAnalysisState();

  // Single stable WebSocket client
  const socketClientRef = useRef<AnalysisWebSocketClient | null>(null);
  if (!socketClientRef.current) {
    socketClientRef.current = new AnalysisWebSocketClient();
  }

  // ---------------------------------------------------------------------------
  // WebSocket event handler — delegates to the state reducer
  // ---------------------------------------------------------------------------
  const handleWebSocketEvent = useCallback(
    (evt: Parameters<typeof processEvent>[0]) => {
      processEvent(evt);
    },
    [processEvent]
  );

  const handleStateChange = useCallback(
    (state: ConnectionState, errMessage?: string) => {
      setConnectionState(state);
      if (errMessage) {
        setConnectionError(errMessage);
      } else if (state === "CONNECTED") {
        setConnectionError(null);
      }
    },
    []
  );

  // Bind WebSocket listeners once
  useEffect(() => {
    const ws = socketClientRef.current;
    if (!ws) return;
    const unbindEvent = ws.onEvent(handleWebSocketEvent);
    const unbindState = ws.onStateChange(handleStateChange);
    const unbindBackpressure = ws.onBackpressureChange(setBackpressureStats);
    return () => {
      unbindEvent();
      unbindState();
      unbindBackpressure();
    };
  }, [handleWebSocketEvent, handleStateChange]);

  // ---------------------------------------------------------------------------
  // Session initialization
  // ---------------------------------------------------------------------------
  const initializeSession = useCallback(
    async (customSessionId?: string) => {
      setIsInitializing(true);
      setSessionError(null);
      sequenceRef.current = 0;
      resetAnalysisState();

      try {
        const resp = await createSession({
          session_id: customSessionId || initialSessionId,
        });

        const fetchedSession = await getSession(resp.session_id);
        setSession(fetchedSession);
        sessionRef.current = fetchedSession;

        // Seed analysis state from existing session assessment if present
        if (fetchedSession.latest_assessment) {
          setRiskAssessment(fetchedSession.latest_assessment);
        }

        // Connect WebSocket
        socketClientRef.current?.connect(fetchedSession.session_id);
      } catch (err: unknown) {
        const userMsg =
          err instanceof VoiceShieldError
            ? err.userMessage
            : err instanceof Error
            ? err.message
            : "Failed to initialize security analysis session.";
        setSessionError(userMsg);
        setConnectionState("ERROR");
      } finally {
        setIsInitializing(false);
      }
    },
    [initialSessionId, resetAnalysisState, setRiskAssessment]
  );

  // ---------------------------------------------------------------------------
  // Audio segment analysis trigger (REST path)
  // ---------------------------------------------------------------------------
  const triggerAnalysis = useCallback(
    async (payload: AnalyzeSegmentRequest = {}) => {
      const sessionSnap = sessionRef.current;
      if (!sessionSnap) {
        setSessionError("No active session. Initialize a session first.");
        return;
      }

      try {
        const assessment = await analyzeSegment(sessionSnap.session_id, {
          sample_rate: 16000,
          duration_ms: 4000.0,
          format: "pcm_s16le",
          ...payload,
        });

        // REST response gives the complete RiskAssessment with all signals
        setRiskAssessment(assessment);
      } catch (err: unknown) {
        const userMsg =
          err instanceof VoiceShieldError
            ? err.userMessage
            : err instanceof Error
            ? err.message
            : "Analysis request failed.";
        setSessionError(userMsg);
      }
    },
    [setRiskAssessment]
  );

  // ---------------------------------------------------------------------------
  // Microphone → encode → WebSocket streaming loop
  // ---------------------------------------------------------------------------
  const handleAudioWindow = useCallback(
    async (pcmFloat32: Float32Array, durationMs: number) => {
      const currentSession = sessionRef.current;
      if (!currentSession) return;
      if (!hasSignificantAudio(pcmFloat32)) return;

      const audioBase64 = float32ToBase64Pcm16(pcmFloat32);
      const seq = sequenceRef.current++;

      const wsClient = socketClientRef.current;
      if (wsClient && wsClient.getState() === "CONNECTED") {
        // Stream via WebSocket transport envelope
        wsClient.sendAudioChunk({
          type: "audio_chunk",
          session_id: currentSession.session_id,
          sequence: seq,
          sample_rate: 16000,
          channels: 1,
          format: "pcm_s16le",
          duration_ms: durationMs,
          audio_base64: audioBase64,
        });
      } else {
        // Fallback to REST transport if WebSocket is connecting/reconnecting
        await triggerAnalysis({
          sample_rate: 16000,
          duration_ms: durationMs,
          format: "pcm_s16le",
          audio_base64: audioBase64,
        });
      }
    },
    [triggerAnalysis]
  );

  const { micState, micStats, startMicrophone, stopMicrophone } = useMicrophone({
    sampleRate: 16000,
    windowSeconds: 4,
    strideSeconds: 1,
    onAudioWindow: handleAudioWindow,
  });

  // ---------------------------------------------------------------------------
  // WebSocket reconnect
  // ---------------------------------------------------------------------------
  const reconnectWebSocket = useCallback(() => {
    const s = sessionRef.current;
    if (s && socketClientRef.current) {
      socketClientRef.current.connect(s.session_id);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Reset — clear state and create a new session
  // ---------------------------------------------------------------------------
  const resetSession = useCallback(async () => {
    socketClientRef.current?.disconnect();
    setSession(null);
    sessionRef.current = null;
    sequenceRef.current = 0;
    resetAnalysisState();
    await initializeSession();
  }, [initializeSession, resetAnalysisState]);

  // ---------------------------------------------------------------------------
  // Mount: initialize session; Unmount: close WebSocket
  // ---------------------------------------------------------------------------
  useEffect(() => {
    initializeSession(initialSessionId);
    return () => {
      socketClientRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // ---------------------------------------------------------------------------
  // Derived convenience accessors
  // ---------------------------------------------------------------------------
  return {
    session,
    isInitializing,
    sessionError,
    connectionState,
    connectionError,
    backpressureStats,
    analysisState,
    riskAssessment: analysisState.riskAssessment,
    transcript: analysisState.transcript,
    analysisStatus: analysisState.analysisStatus,
    micState,
    micStats,
    startMicrophone,
    stopMicrophone,
    triggerAnalysis,
    reconnectWebSocket,
    resetSession,
  };
}
