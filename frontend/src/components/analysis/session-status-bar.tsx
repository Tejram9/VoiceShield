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
  slate:   { dot: "bg-slate-400 shadow-sm animate-pulse",   text: "text-slate-700", border: "border-slate-200", bg: "bg-white shadow-sm" },
  amber:   { dot: "bg-amber-500 shadow-sm animate-pulse", text: "text-amber-800", border: "border-amber-200", bg: "bg-amber-50 shadow-sm" },
  emerald: { dot: "bg-emerald-500 shadow-sm animate-pulse", text: "text-emerald-800", border: "border-emerald-200", bg: "bg-emerald-50 shadow-sm" },
  rose:    { dot: "bg-red-500 shadow-sm animate-pulse", text: "text-red-800", border: "border-red-200", bg: "bg-red-50 shadow-sm" },
  blue:    { dot: "bg-blue-500 shadow-sm animate-pulse", text: "text-blue-800", border: "border-blue-200", bg: "bg-blue-50 shadow-sm" },
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
    <div className={`flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-xl border text-xs transition-all duration-150 ${cls.border} ${cls.bg}`}>
      {/* Operational State */}
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${cls.dot.split(" ")[0]}`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${cls.dot}`} />
        </span>
        <span className={`font-bold font-mono tracking-wider text-[11px] uppercase ${cls.text}`}>{label}</span>
      </div>

      <div className="flex items-center gap-4 text-xs text-[#64748B]">
        {/* Session ID */}
        {sessionId && (
          <div className="flex items-center gap-1.5">
            <span className="text-[#64748B] text-[10px] font-semibold uppercase tracking-wider">Session:</span>
            <span className="font-mono text-slate-800 font-semibold">{sessionId}</span>
          </div>
        )}

        {/* WebSocket State */}
        {connectionState !== "CONNECTED" && connectionState !== "DISCONNECTED" && (
          <div className="flex items-center gap-1.5">
            <span className="text-[#64748B] text-[10px] font-semibold uppercase tracking-wider">WS:</span>
            <span className="text-slate-800 font-mono font-medium">{connectionState}</span>
          </div>
        )}

        {/* Pipeline latency */}
        {pipelineLatencyMs !== null && (
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-[#64748B] text-[10px] font-semibold uppercase tracking-wider">Latency:</span>
            <span className="font-mono text-blue-600 font-semibold">{Math.round(pipelineLatencyMs)}ms</span>
          </div>
        )}

        {/* Last analyzed */}
        {lastAnalyzedAt && (
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-[#64748B] text-[10px] font-semibold uppercase tracking-wider">Updated:</span>
            <span className="font-mono text-[#64748B]">{lastAnalyzedAt}</span>
          </div>
        )}
      </div>
    </div>
  );
}
