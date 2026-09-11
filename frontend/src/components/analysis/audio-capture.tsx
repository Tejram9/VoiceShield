"use client";

/**
 * VoiceShield — AudioCapture Component
 *
 * Isolated audio capture control. Owns only microphone UI concerns:
 *   - Start / Stop controls
 *   - Permission request state
 *   - Audio level meter (12-bar VU)
 *   - Error display
 *
 * Does NOT own session state, WebSocket state, or analysis results.
 * All callbacks are provided by the parent (use-analysis-session hook via page).
 */

import React from "react";
import { Mic, MicOff, Square, Loader2 } from "lucide-react";
import type { MicrophoneState, MicrophoneStats } from "@/hooks/use-microphone";

interface AudioCaptureProps {
  micState: MicrophoneState;
  micStats: MicrophoneStats;
  onStart: () => Promise<void>;
  onStop: () => void;
  /** Optional: disable start if session not ready */
  disabled?: boolean;
}

export function AudioCapture({
  micState,
  micStats,
  onStart,
  onStop,
  disabled = false,
}: AudioCaptureProps) {
  const isActive   = micState === "CAPTURING";
  const isRequesting = micState === "MICROPHONE_INITIALIZING";
  const isStopping = micState === "STOPPING";
  const isError    = micState === "ERROR" || micState === "UNSUPPORTED" || micState === "MICROPHONE_PERMISSION_REQUIRED";
  const isIdle     = micState === "IDLE" || micState === "STOPPED";

  const levelBars  = Math.round(micStats.level * 12);

  const handleToggle = async () => {
    if (isActive) {
      onStop();
    } else if (!isRequesting && !isStopping && !disabled) {
      await onStart();
    }
  };

  return (
    <div className="space-y-2">
      {/* Control Row */}
      <div className="flex items-center gap-2">
        <button
          id="audio-capture-toggle"
          onClick={handleToggle}
          disabled={isRequesting || isStopping || disabled}
          aria-label={isActive ? "Stop microphone capture" : "Start microphone capture"}
          className={[
            "flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer duration-200",
            isActive
              ? "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 border-rose-500/40 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse"
              : isRequesting
              ? "bg-amber-600/40 border-amber-500/30 text-amber-200 cursor-wait"
              : isStopping
              ? "bg-slate-700/60 border-slate-600 text-slate-300 cursor-wait"
              : isError
              ? "bg-rose-950/60 border-rose-600/30 text-rose-300 cursor-not-allowed"
              : disabled
              ? "bg-slate-800/60 border-slate-700 text-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-emerald-500/40 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]",
          ].join(" ")}
        >
          {isActive ? (
            <>
              <Square className="w-3 h-3 fill-current" />
              <span>STOP MIC</span>
            </>
          ) : isRequesting ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>REQUESTING...</span>
            </>
          ) : isStopping ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>STOPPING...</span>
            </>
          ) : isError ? (
            <>
              <MicOff className="w-3 h-3" />
              <span>MIC UNAVAILABLE</span>
            </>
          ) : (
            <>
              <Mic className="w-3 h-3" />
              <span>START MIC</span>
            </>
          )}
        </button>

        {/* Active status badge */}
        {isActive && (
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>CAPTURING · {micStats.windowsDispatched} segments sent</span>
          </div>
        )}
      </div>

      {/* Audio Level Meter — only shown when active */}
      {isActive && (
        <div
          className="flex items-end gap-0.5"
          aria-label={`Audio level ${Math.round(micStats.level * 100)}%`}
          role="meter"
          aria-valuenow={Math.round(micStats.level * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={[
                "w-1 rounded-sm transition-all duration-75",
                i < levelBars
                  ? i < 6
                    ? "bg-emerald-400 h-3"
                    : i < 9
                    ? "bg-amber-400 h-4"
                    : "bg-rose-400 h-5"
                  : "bg-slate-700 h-2",
              ].join(" ")}
            />
          ))}
        </div>
      )}

      {/* Permission / unsupported error */}
      {isError && (
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-rose-950/60 border border-rose-600/30">
          <MicOff className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
          <span className="text-[11px] font-mono text-rose-300">
            {micState === "UNSUPPORTED"
              ? "Browser microphone API not supported."
              : micState === "MICROPHONE_PERMISSION_REQUIRED"
              ? "Microphone access denied. Check browser permissions, then try again."
              : "Microphone error. Check connection or try manual analysis."}
          </span>
        </div>
      )}

      {/* Disabled-session message */}
      {disabled && isIdle && (
        <p className="text-[10px] font-mono text-slate-500">
          Initialize a session before starting microphone capture.
        </p>
      )}
    </div>
  );
}
