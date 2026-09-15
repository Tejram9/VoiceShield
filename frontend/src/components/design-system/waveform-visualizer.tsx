"use client";

import React, { useEffect, useState } from "react";
import { Volume2, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WaveformVisualizerProps {
  isActive?: boolean;
  isSimulated?: boolean;
  hasThreat?: boolean;
  sampleRate?: string;
  channelName?: string;
  className?: string;
}

export function WaveformVisualizer({
  isActive = true,
  isSimulated = false,
  hasThreat = false,
  sampleRate = "16,000 Hz • 16-bit PCM",
  channelName = "Ch-01 Inbound Voice Trunk",
  className,
}: WaveformVisualizerProps) {
  // 48 discrete spectral analysis bars
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: 48 }, (_, i) => {
      // Natural speech formant shape (higher energy in mid frequencies 300-2500Hz)
      const formant = Math.sin((i / 48) * Math.PI) * 45 + 15;
      return Math.round(formant);
    })
  );

  useEffect(() => {
    if (!isActive) {
      setBars(Array.from({ length: 48 }, () => 8));
      return;
    }

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map((_, i) => {
          // Subtle speech cadence variance
          const formantEnvelope = Math.sin((i / 48) * Math.PI) * 50;
          const cadence = Math.sin(Date.now() / 320 + i * 0.25) * 18;
          const ambientNoise = (Math.random() - 0.5) * 12;
          const val = Math.round(formantEnvelope + cadence + ambientNoise + 15);
          return Math.max(8, Math.min(88, val));
        })
      );
    }, 140);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div
      className={cn(
        "soc-panel p-3.5 space-y-2.5 font-sans relative",
        hasThreat ? "border-rose-500/40" : "border-soc-700/80",
        className
      )}
    >
      {/* Top Telemetry Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-soc-700/60 text-xs">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "w-2 h-2 rounded-full flex-shrink-0",
              isActive
                ? hasThreat
                  ? "bg-rose-500"
                  : "bg-emerald-400"
                : "bg-soc-600"
            )}
          />
          <span className="font-mono font-medium text-soc-200 text-[11px] truncate max-w-xs">
            {channelName}
          </span>
          {isSimulated && (
            <span className="px-1.5 py-0.2 rounded bg-soc-800 text-soc-400 text-[9px] font-mono uppercase border border-soc-700">
              Simulated Stream
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-soc-400">
          <span className="flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-soc-500" />
            <span className="text-soc-300">-18.4 dBFS</span>
          </span>
          <span>•</span>
          <span>{sampleRate}</span>
        </div>
      </div>

      {/* Functional Spectral Waveform Track */}
      <div className="h-16 sm:h-20 flex items-end justify-between gap-[2px] sm:gap-1 pt-2 pb-1 px-1 bg-soc-900/40 rounded border border-soc-800">
        {bars.map((height, idx) => {
          // Synthetic vocoder glitch zone marker (1.24kHz to 1.8kHz range)
          const isGlitchZone = hasThreat && idx >= 14 && idx <= 20;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col justify-end items-center h-full group relative"
            >
              <div
                style={{ height: `${height}%` }}
                className={cn(
                  "w-full rounded-t-[1px] transition-all duration-120 ease-out",
                  !isActive
                    ? "bg-soc-750"
                    : isGlitchZone
                    ? "bg-rose-500"
                    : hasThreat
                    ? "bg-rose-400/40"
                    : "bg-soc-400 hover:bg-blue-400"
                )}
              />
              {/* Forensic hover disclosure */}
              <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-6 px-1.5 py-0.5 bg-soc-950 border border-soc-700 rounded text-[9px] font-mono text-soc-200 z-10 whitespace-nowrap transition-opacity">
                {Math.round((idx / 48) * 8000)} Hz: {height}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Frequency Axis & Inspection Verdict */}
      <div className="flex items-center justify-between text-[10px] font-mono text-soc-400 pt-0.5">
        <div className="flex items-center gap-2">
          <span>0.0 kHz</span>
          <span className="text-soc-600">┈┈</span>
          <span>1.24 kHz</span>
          <span className="text-soc-600">┈┈</span>
          <span>Nyquist 8.0 kHz</span>
        </div>

        {hasThreat ? (
          <span className="text-rose-400 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-400 flex-shrink-0" />
            <span>Spectral Phase Anomaly at 1.24 kHz (Neural Vocoder)</span>
          </span>
        ) : (
          <span className="text-emerald-400/90 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <span>Acoustic Phase Coherent • Natural Baseline</span>
          </span>
        )}
      </div>
    </div>
  );
}
