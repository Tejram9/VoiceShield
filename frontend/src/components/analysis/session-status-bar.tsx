"use client";

/**
 * VoiceShield — Session Status Bar
 *
 * Compact operational status strip displayed inside the live call workspace.
 * Uses SplitSmart high-contrast functional signaling tokens.
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
  slate:   { dot: "bg-soc-400",   text: "text-soc-300", border: "border-soc-700/80", bg: "soc-panel" },
  amber:   { dot: "bg-amber-400", text: "text-amber-300", border: "border-amber-500/40", bg: "soc-panel bg-amber-950/15" },
  emerald: { dot: "bg-emerald-400", text: "text-emerald-300", border: "border-emerald-500/40", bg: "soc-panel bg-emerald-950/15" },
  rose:    { dot: "bg-rose-400", text: "text-rose-300", border: "border-rose-500/40", bg: "soc-panel bg-rose-950/15" },
  blue:    { dot: "bg-blue-400", text: "text-blue-300", border: "border-blue-500/40", bg: "soc-panel bg-blue-950/15" },
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
    <div className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-lg border text-xs transition-all duration-150 ${cls.border} ${cls.bg}`}>
      {/* Operational State */}
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2 w-2">
          <span className={`relative inline-flex rounded-full h-2 w-2 ${cls.dot}`} />
        </span>
        <span className={`font-bold font-mono tracking-wider text-[11px] uppercase ${cls.text}`}>{label}</span>
      </div>

      <div className="flex items-center gap-4 text-xs text-soc-400">
        {/* Session ID */}
        {sessionId && (
          <div className="flex items-center gap-1.5">
            <span className="text-soc-500 text-[10px] font-semibold uppercase tracking-wider">Session:</span>
            <span className="font-mono text-soc-200 font-semibold">{sessionId}</span>
          </div>
        )}

        {/* WebSocket State */}
        {connectionState !== "CONNECTED" && connectionState !== "DISCONNECTED" && (
          <div className="flex items-center gap-1.5">
            <span className="text-soc-500 text-[10px] font-semibold uppercase tracking-wider">WS:</span>
            <span className="text-soc-200 font-mono font-medium">{connectionState}</span>
          </div>
        )}

        {/* Pipeline latency */}
        {pipelineLatencyMs !== null && (
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-soc-500 text-[10px] font-semibold uppercase tracking-wider">Latency:</span>
            <span className="font-mono text-blue-400 font-semibold">{Math.round(pipelineLatencyMs)}ms</span>
          </div>
        )}

        {/* Last analyzed */}
        {lastAnalyzedAt && (
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-soc-500 text-[10px] font-semibold uppercase tracking-wider">Updated:</span>
            <span className="font-mono text-soc-400">{lastAnalyzedAt}</span>
          </div>
        )}
      </div>
    </div>
  );
}
