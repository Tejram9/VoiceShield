"use client";

/**
 * VoiceShield — Production Browser Microphone Capture Hook
 *
 * Architecture:
 *   navigator.mediaDevices.getUserMedia (ideal 16kHz mono)
 *     ↓
 *   MediaStreamAudioSourceNode
 *     ↓
 *   AudioWorkletNode (/audio-processor.worklet.js)
 *     ↓
 *   Hardware Resampling (if ctx.sampleRate !== 16000, resample to 16kHz)
 *     ↓
 *   RollingAudioBuffer (4.0s analysis window = 64,000 samples, 1.0s stride hop = 16,000 samples)
 *     ↓
 *   onAudioWindow callback fires every 1.0s with a 4.0s Float32Array
 *
 * Privacy & Security:
 *  - Explicit user opt-in required to start capture.
 *  - MediaStream tracks closed immediately on stop.
 *  - AudioContext closed cleanly; no memory/stream leaks.
 *  - No audio stored in localStorage, IndexedDB, or printed to console.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AUDIO_SAMPLE_RATE,
  ANALYSIS_WINDOW_SECONDS,
  ANALYSIS_HOP_SECONDS,
  WORKLET_BUFFER_SIZE,
} from "../lib/audio/constants";
import {
  RollingAudioBuffer,
  resampleTo16k,
} from "../lib/audio/pcm";

export type MicrophoneState =
  | "IDLE"
  | "MICROPHONE_PERMISSION_REQUIRED"
  | "MICROPHONE_INITIALIZING"
  | "CAPTURING"
  | "STOPPING"
  | "STOPPED"
  | "ERROR"
  | "UNSUPPORTED";

export interface MicrophoneStats {
  /** Current audio RMS level 0.0–1.0 for UI meter */
  level: number;
  /** Total normalized 16kHz samples captured since session start */
  totalSamples: number;
  /** Number of 4.0s analysis windows dispatched */
  windowsDispatched: number;
  /** Number of seconds of audio currently buffered */
  secondsBuffered: number;
}

export interface UseMicrophoneOptions {
  /** Target sample rate (canonical: 16000) */
  sampleRate?: number;
  /** Analysis window duration in seconds (canonical: 4) */
  windowSeconds?: number;
  /** Stride between window dispatches in seconds (canonical: 1) */
  strideSeconds?: number;
  /** Called each time a new 4.0s analysis window is ready */
  onAudioWindow: (pcmFloat32: Float32Array, durationMs: number) => void;
  /** Called when mic state changes */
  onStateChange?: (state: MicrophoneState, error?: string) => void;
}

export interface UseMicrophoneReturn {
  micState: MicrophoneState;
  micStats: MicrophoneStats;
  startMicrophone: () => Promise<void>;
  stopMicrophone: () => void;
}

const WORKLET_PATH = "/audio-processor.worklet.js";
const WORKLET_NAME = "voiceshield-processor";

export function useMicrophone({
  sampleRate = AUDIO_SAMPLE_RATE,
  windowSeconds = ANALYSIS_WINDOW_SECONDS,
  strideSeconds = ANALYSIS_HOP_SECONDS,
  onAudioWindow,
  onStateChange,
}: UseMicrophoneOptions): UseMicrophoneReturn {
  const [micState, setMicState] = useState<MicrophoneState>("IDLE");
  const [micStats, setMicStats] = useState<MicrophoneStats>({
    level: 0,
    totalSamples: 0,
    windowsDispatched: 0,
    secondsBuffered: 0,
  });

  // Native Web Audio and MediaStream references
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Rolling 4.0s window / 1.0s hop audio buffer
  const rollingBufferRef = useRef<RollingAudioBuffer>(
    new RollingAudioBuffer(windowSeconds * sampleRate, strideSeconds * sampleRate)
  );

  const windowsDispatchedRef = useRef<number>(0);
  const totalSamplesRef = useRef<number>(0);

  const setState = useCallback(
    (state: MicrophoneState, error?: string) => {
      setMicState(state);
      onStateChange?.(state, error);
    },
    [onStateChange]
  );

  /**
   * Process raw Float32 chunks arriving from the AudioWorklet.
   */
  const processChunk = useCallback(
    (chunk: Float32Array, inputSampleRate: number) => {
      if (!chunk || chunk.length === 0) return;

      // 1. Resample to 16,000 Hz if the AudioContext was forced to hardware rate (e.g. 48kHz)
      const normalizedSamples =
        inputSampleRate !== sampleRate
          ? resampleTo16k(chunk, inputSampleRate, sampleRate)
          : chunk;

      // 2. Compute audio level (RMS) for the meter
      let sumSq = 0;
      for (let i = 0; i < normalizedSamples.length; i++) {
        sumSq += normalizedSamples[i] * normalizedSamples[i];
      }
      const rms = Math.sqrt(sumSq / normalizedSamples.length);
      const level = Math.min(1, rms * 8);

      // 3. Append to rolling buffer
      const rb = rollingBufferRef.current;
      rb.write(normalizedSamples);
      totalSamplesRef.current += normalizedSamples.length;

      // 4. Check if a 4.0s window is ready
      while (rb.hasWindow()) {
        const windowSamples = rb.nextWindow();
        if (windowSamples) {
          windowsDispatchedRef.current++;
          onAudioWindow(windowSamples, windowSeconds * 1000);
        }
      }

      const stats = rb.getStats();
      setMicStats({
        level,
        totalSamples: totalSamplesRef.current,
        windowsDispatched: windowsDispatchedRef.current,
        secondsBuffered: stats.secondsBuffered,
      });
    },
    [onAudioWindow, sampleRate, windowSeconds]
  );

  /**
   * Cleanly tear down all audio resources and stop microphone streaming.
   */
  const stopMicrophone = useCallback(() => {
    setState("STOPPING");

    if (workletNodeRef.current) {
      try {
        workletNodeRef.current.port.onmessage = null;
        workletNodeRef.current.disconnect();
        workletNodeRef.current.port.close();
      } catch {
        // Safe tear down
      }
      workletNodeRef.current = null;
    }

    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch {
        // Safe tear down
      }
      sourceNodeRef.current = null;
    }

    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // Safe stop
        }
      });
      streamRef.current = null;
    }

    // Reset buffer and metrics
    rollingBufferRef.current.clear();
    windowsDispatchedRef.current = 0;
    totalSamplesRef.current = 0;
    setMicStats({
      level: 0,
      totalSamples: 0,
      windowsDispatched: 0,
      secondsBuffered: 0,
    });

    setState("STOPPED");
  }, [setState]);

  /**
   * Request microphone permission and initiate the capture pipeline.
   */
  const startMicrophone = useCallback(async () => {
    if (micState === "CAPTURING" || micState === "MICROPHONE_INITIALIZING") {
      return;
    }

    // 1. Detect unsupported browser environment
    if (
      typeof window === "undefined" ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia ||
      typeof AudioContext === "undefined"
    ) {
      setState("UNSUPPORTED", "Browser does not support Web Audio / getUserMedia APIs.");
      return;
    }

    setState("MICROPHONE_INITIALIZING");

    try {
      // 2. Request user microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: { ideal: sampleRate },
          channelCount: { ideal: 1 },
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Listen for hardware disconnect
      stream.getAudioTracks().forEach((track) => {
        track.onended = () => {
          stopMicrophone();
          setState("ERROR", "Microphone disconnected by operating system.");
        };
      });

      // 3. Create AudioContext with fallback
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      let ctx: AudioContext;
      try {
        ctx = new AudioCtx({ sampleRate });
      } catch {
        // If sampleRate option is unsupported by browser implementation
        ctx = new AudioCtx();
      }
      audioCtxRef.current = ctx;

      // Resume context if suspended by browser autoplay policy
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // 4. Load AudioWorklet module
      await ctx.audioWorklet.addModule(WORKLET_PATH);

      // 5. Connect stream -> source -> worklet
      const source = ctx.createMediaStreamSource(stream);
      sourceNodeRef.current = source;

      const workletNode = new AudioWorkletNode(ctx, WORKLET_NAME, {
        processorOptions: { bufferSize: WORKLET_BUFFER_SIZE },
        numberOfInputs: 1,
        numberOfOutputs: 0,
        channelCount: 1,
        channelInterpretation: "speakers",
      });
      workletNodeRef.current = workletNode;

      const ctxSampleRate = ctx.sampleRate;
      workletNode.port.onmessage = (evt: MessageEvent) => {
        if (evt.data?.type === "audio-chunk" && evt.data.samples instanceof Float32Array) {
          processChunk(evt.data.samples, ctxSampleRate);
        }
      };

      source.connect(workletNode);
      setState("CAPTURING");
    } catch (err: unknown) {
      stopMicrophone();

      const errMsg = err instanceof Error ? err.message : String(err);
      const errName = err instanceof Error ? err.name : "";

      if (errName === "NotAllowedError" || errMsg.includes("Permission denied")) {
        setState("MICROPHONE_PERMISSION_REQUIRED", "Microphone access was denied. Please allow microphone permission in your browser.");
      } else if (errName === "NotFoundError" || errMsg.includes("DevicesNotFoundError")) {
        setState("ERROR", "No audio input device detected. Please connect a microphone.");
      } else {
        setState("ERROR", `Failed to start microphone: ${errMsg}`);
      }
    }
  }, [micState, sampleRate, setState, stopMicrophone, processChunk]);

  // Clean teardown on unmount
  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, [stopMicrophone]);

  return {
    micState,
    micStats,
    startMicrophone,
    stopMicrophone,
  };
}
