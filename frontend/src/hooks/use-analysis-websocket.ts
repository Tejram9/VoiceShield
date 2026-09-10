"use client";

/**
 * VoiceShield Frontend — Dedicated WebSocket Hook
 *
 * Manages the WebSocket connection lifecycle independently of session state
 * and UI rendering. This hook is the single authoritative source for:
 *
 *   - Connection state (DISCONNECTED → CONNECTING → CONNECTED → ...)
 *   - Discriminated union events (AnalysisEvent)
 *   - Reconnection behavior
 *   - Heartbeat handling
 *
 * Lifecycle:
 *   1. Call connect(sessionId) to establish the WebSocket
 *   2. Subscribe to latestEvent or events for typed event data
 *   3. Call disconnect() or let the component unmount to clean up
 *
 * This hook does NOT manage session creation (use-analysis-session.ts does that).
 * This hook does NOT render any UI.
 * This hook does NOT depend on React Router or Next.js navigation.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnalysisWebSocketClient } from "../lib/websocket/analysis-socket";
import type { ConnectionState } from "../lib/websocket/analysis-socket";
import { parseAnalysisEvent } from "../lib/websocket/events";
import type { AnalysisEvent } from "../types/websocket";
import type { SecurityEvent } from "../lib/api/types";

const MAX_EVENTS_HISTORY = 50;

export interface UseAnalysisWebSocketReturn {
  /** Current WebSocket connection state */
  connectionState: ConnectionState;
  /** Human-readable connection error message, if any */
  connectionError: string | null;
  /** Most recently received typed event (null until first event arrives) */
  latestEvent: AnalysisEvent | null;
  /**
   * Rolling history of the last 50 typed events (newest first).
   * Each entry is a discriminated AnalysisEvent — switch on event_type to narrow.
   */
  events: AnalysisEvent[];
  /** Connect (or reconnect) the WebSocket to the given session */
  connect: (sessionId: string) => void;
  /** Gracefully close the WebSocket */
  disconnect: () => void;
}

export function useAnalysisWebSocket(): UseAnalysisWebSocketReturn {
  const [connectionState, setConnectionState] = useState<ConnectionState>("DISCONNECTED");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [latestEvent, setLatestEvent] = useState<AnalysisEvent | null>(null);
  const [events, setEvents] = useState<AnalysisEvent[]>([]);

  // Single stable WebSocket client instance for this hook's lifetime
  const clientRef = useRef<AnalysisWebSocketClient | null>(null);
  if (!clientRef.current) {
    clientRef.current = new AnalysisWebSocketClient();
  }

  useEffect(() => {
    const client = clientRef.current;
    if (!client) return;

    /**
     * The existing AnalysisWebSocketClient emits raw SecurityEvent objects.
     * We parse them through parseAnalysisEvent to get the typed discriminated union.
     * Events that fail validation (unknown type, missing fields) are silently dropped.
     */
    const unbindEvent = client.onEvent((rawEvent: SecurityEvent) => {
      // Re-serialize and re-parse through the safe discriminated-union parser
      // to get proper narrowed typing. The double-parse overhead is negligible
      // (single small JSON object) and ensures the type guarantee.
      const parsed = parseAnalysisEvent(JSON.stringify(rawEvent));
      if (!parsed) return;

      setLatestEvent(parsed);
      setEvents((prev) => [parsed, ...prev.slice(0, MAX_EVENTS_HISTORY - 1)]);
    });

    const unbindState = client.onStateChange((state: ConnectionState, err?: string) => {
      setConnectionState(state);
      if (err) {
        setConnectionError(err);
      } else if (state === "CONNECTED") {
        setConnectionError(null);
      }
    });

    return () => {
      unbindEvent();
      unbindState();
    };
  }, []); // bind once — client is stable ref

  const connect = useCallback((sessionId: string) => {
    clientRef.current?.connect(sessionId);
  }, []);

  const disconnect = useCallback(() => {
    clientRef.current?.disconnect();
    setLatestEvent(null);
    setEvents([]);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clientRef.current?.disconnect();
    };
  }, []);

  return {
    connectionState,
    connectionError,
    latestEvent,
    events,
    connect,
    disconnect,
  };
}
