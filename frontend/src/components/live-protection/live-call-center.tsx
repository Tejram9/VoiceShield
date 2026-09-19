"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Volume2, ChevronRight, Activity } from "lucide-react";

export interface LiveCallCenterProps {
  speakerName?: string;
  speakerTimestamp?: string;
  transcriptText?: string;
  semanticTags?: Array<{ label: string; type: "urgency" | "financial" | "isolation" | "normal" }>;
  isLive?: boolean;
  className?: string;
}

export function LiveCallCenter({
  speakerName = "CALLER",
  speakerTimestamp = "01:08",
  transcriptText = "“We need to complete the payment immediately. Please don’t involve anyone else.”",
  semanticTags = [
    { label: "URGENCY", type: "urgency" },
    { label: "FINANCIAL REQUEST", type: "financial" },
    { label: "ISOLATION", type: "isolation" },
  ],
  isLive = true,
  className,
}: LiveCallCenterProps) {
  // Waveform bars simulation
  const barCount = 42;
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: barCount }, (_, i) => {
      const x = (i - barCount / 2) / (barCount / 4);
      return Math.max(10, Math.floor(Math.exp(-0.5 * x * x) * 60 + 10));
    })
  );

  useEffect(() => {
    if (!isLive) return;

    let frameId: number;
    let tick = 0;

    const animate = () => {
      tick += 0.08;
      setBars((prev) =>
        prev.map((_, i) => {
          const centerDist = Math.abs(i - barCount / 2) / (barCount / 2);
          const baseHeight = Math.max(0.1, 1 - centerDist * 0.85);
          const wave = Math.sin(tick * 1.5 + i * 0.3) * 0.4 + 0.6;
          return Math.max(12, Math.min(80, Math.floor(baseHeight * wave * 70 + 10)));
        })
      );
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isLive]);

  const getTagStyle = (type: string) => {
    switch (type) {
      case "urgency":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "financial":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "isolation":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div
      className={cn(
        "w-full bg-white border border-slate-200/70 rounded-xl p-6 flex flex-col justify-between gap-5",
        className
      )}
    >
      {/* Live Audio Stream Header & Waveform */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
            LIVE AUDIO STREAM
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-2xs font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200/80">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            LIVE
          </span>
        </div>

        {/* Calm Acoustic Soundwave */}
        <div
          className="h-10 w-full flex items-center justify-center gap-[3px] py-1 bg-slate-50/60 rounded-lg px-2 border border-slate-100/80"
          aria-label="Acoustic Voice Frequency Stream"
        >
          {bars.map((height, idx) => (
            <div
              key={idx}
              className="w-1.5 bg-blue-400/80 rounded-full transition-all duration-75 ease-out"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>

      {/* Spoken Turn Box - The Hero Centerpiece of the Screen */}
      <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <div className="p-1 rounded-md bg-blue-50 text-blue-600">
              <Volume2 className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs uppercase tracking-wider text-slate-700 font-bold">{speakerName}</span>
          </div>
          <span className="font-mono text-xs text-slate-400 font-medium">
            {speakerTimestamp}
          </span>
        </div>

        {/* Verbatim Quote - Prominent High-Contrast Visual Focal Point */}
        <p className="text-lg sm:text-xl font-medium text-slate-900 leading-relaxed tracking-tight pl-0.5">
          {transcriptText}
        </p>

        {/* Semantic Analytical Badges */}
        {semanticTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {semanticTags.map((tag, idx) => (
              <span
                key={idx}
                className={cn(
                  "px-2.5 py-1 rounded-md text-2xs font-bold tracking-wide border uppercase",
                  getTagStyle(tag.type)
                )}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Telemetry Status Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
          <span className="text-2xs font-medium">Audio analysis in progress...</span>
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
      </div>
    </div>
  );
}
