"use client";

/**
 * VoiceShield — Session Status Bar
 *
 * Compact operational status strip displayed inside the live call workspace.
 * Shows: session lifecycle state, session ID, connection status, last pipeline
 * latency. Does not control any state — display only.
 */

import React from "react";
import type { ConnectionState, BackpressureState } from "@/lib/websocket/analysis-socket";
import type { AnalysisStatus } from "@/types/analysis";
import type { MicrophoneState } from "@/hooks/use-microphone";

interface SessionStatusBarProps {
  sessionId: string | null;
  connectionState: ConnectionState;
  analysisStatus: AnalysisStatus;
  isInitializing: boolean;
  pipelineLatencyMs: number | null;
  lastAnalyzedAt: string | null;
  micState?: MicrophoneState;
  backpressureState?: BackpressureState;
}

/** Map the combined (connection + analysis + mic) state to a truthful human label. */
function deriveOperationalLabel(
  sessionId: string | null,
  connectionState: ConnectionState,
  analysisStatus: AnalysisStatus,
  isInitializing: boolean,
  micState?: MicrophoneState,
  backpressureState?: BackpressureState
): { label: string; color: "slate" | "amber" | "emerald" | "rose" | "blue" } {
  if (!sessionId || isInitializing) return { label: "INITIALIZING SESSION", color: "amber" };
  if (connectionState === "CONNECTING")   return { label: "CONNECTING WS", color: "amber" };
  if (connectionState === "RECONNECTING") return { label: "RECONNECTING WS", color: "amber" };
  if (connectionState === "ERROR")        return { label: "CONNECTION FAILED", color: "rose" };
  if (connectionState === "DISCONNECTED") return { label: "DISCONNECTED", color: "rose" };

  if (micState === "MICROPHONE_PERMISSION_REQUIRED") return { label: "MIC PERMISSION REQUIRED", color: "amber" };
  if (micState === "MICROPHONE_INITIALIZING") return { label: "INITIALIZING MIC", color: "amber" };
  if (micState === "STOPPING") return { label: "STOPPING MIC", color: "amber" };
  if (micState === "ERROR") return { label: "MIC ERROR", color: "rose" };
  if (micState === "UNSUPPORTED") return { label: "MIC UNSUPPORTED", color: "rose" };

  if (backpressureState === "DEGRADED") return { label: "DEGRADED (BACKPRESSURE)", color: "amber" };

  if (analysisStatus === "PROCESSING") {
    return micState === "CAPTURING"
      ? { label: "CAPTURING · ANALYZING", color: "blue" }
      : { label: "ANALYZING", color: "blue" };
  }
  if (analysisStatus === "ERROR") return { label: "ANALYSIS ERROR", color: "rose" };

  if (micState === "CAPTURING") return { label: "CAPTURING AUDIO", color: "emerald" };
  if (analysisStatus === "COMPLETED") return { label: "ANALYSIS READY", color: "emerald" };
  if (connectionState === "CONNECTED") return { label: "CONNECTED · READY", color: "slate" };

  return { label: "IDLE", color: "slate" };
}

const COLOR_CLASSES: Record<
  "slate" | "amber" | "emerald" | "rose" | "blue",
  { dot: string; text: string; border: string; bg: string }
> = {
  slate:   { dot: "bg-slate-400",   text: "text-slate-400",   border: "border-slate-700",   bg: "bg-slate-800/40" },
  amber:   { dot: "bg-amber-400 animate-pulse",  text: "text-amber-400",   border: "border-amber-500/30", bg: "bg-amber-500/5"  },
  emerald: { dot: "bg-emerald-400 animate-pulse", text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/5" },
  rose:    { dot: "bg-rose-400",    text: "text-rose-400",    border: "border-rose-500/30",  bg: "bg-rose-500/5"   },
  blue:    { dot: "bg-blue-400 animate-pulse",   text: "text-blue-400",    border: "border-blue-500/30",  bg: "bg-blue-500/5"   },
};

export function SessionStatusBar({
  sessionId,
  connectionState,
  analysisStatus,
  isInitializing,
  pipelineLatencyMs,
  lastAnalyzedAt,
  micState,
  backpressureState,
}: SessionStatusBarProps) {
  const { label, color } = deriveOperationalLabel(
    sessionId,
    connectionState,
    analysisStatus,
    isInitializing,
    micState,
    backpressureState
  );
  const cls = COLOR_CLASSES[color];

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2 rounded border text-[10px] font-mono ${cls.border} ${cls.bg}`}>
      {/* Operational State */}
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${cls.dot}`} />
        <span className={`font-bold uppercase ${cls.text}`}>{label}</span>
      </div>

      {/* Session ID */}
      {sessionId && (
        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-slate-500">SESSION</span>
          <span className="text-slate-300 font-semibold">{sessionId}</span>
        </div>
      )}

      {/* WebSocket State — only shown if not already reflected in label */}
      {connectionState !== "CONNECTED" && connectionState !== "DISCONNECTED" && (
        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-slate-500">WS</span>
          <span className="text-slate-300">{connectionState}</span>
        </div>
      )}

      {/* Last analyzed */}
      {lastAnalyzedAt && (
        <div className="text-slate-500">
          Last: <span className="text-slate-400">{lastAnalyzedAt}</span>
        </div>
      )}

      {/* Pipeline latency */}
      {pipelineLatencyMs !== null && (
        <div className="text-slate-500">
          Pipeline: <span className="text-slate-400">{Math.round(pipelineLatencyMs)}ms</span>
        </div>
      )}
    </div>
  );
}
