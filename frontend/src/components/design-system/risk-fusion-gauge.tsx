"use client";

import React, { useState } from "react";
import { RiskLevel, RiskSignal } from "@/types/dashboard";
import { RiskBadge } from "./risk-badge";
import { ChevronDown, ChevronUp, Cpu, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskFusionGaugeProps {
  signals: RiskSignal[];
  finalScore: number;
  finalLevel: RiskLevel;
  className?: string;
}

export function RiskFusionGauge({
  signals,
  finalScore,
  finalLevel,
  className,
}: RiskFusionGaugeProps) {
  const [showFormula, setShowFormula] = useState(false);

  // SVG circular gauge geometry
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // ~339.29
  const scoreClamped = Math.min(100, Math.max(0, finalScore));
  const strokeDashoffset = circumference - (circumference * scoreClamped) / 100;

  const strokeColor = {
    LOW: "#10B981",
    MEDIUM: "#F59E0B",
    HIGH: "#F97316",
    CRITICAL: "#EF4444",
  }[finalLevel] || "#2563EB";

  return (
    <div
      className={cn(
        "rounded-xl bg-soc-800 border border-soc-700 p-5 sm:p-6 shadow-panel space-y-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-soc-700/60 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-soc-100 uppercase font-mono tracking-wider">
              Explainable Risk Fusion Engine
            </h3>
            <p className="text-[11px] text-soc-400">
              Transparent multi-signal weighted calculation
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowFormula(!showFormula)}
          className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
        >
          <span>{showFormula ? "Hide Weights" : "View Fusion Math"}</span>
          {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Grid: Left Circular Verdict & Right Signal Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Overall Risk Gauge (4 cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-soc-850/80 border border-soc-700/80 text-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 130 130">
              {/* Background Track */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="stroke-soc-700/50"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Foreground Animated Gauge */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke={strokeColor}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Centered Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-mono text-soc-100 tracking-tight">
                {finalScore}
              </span>
              <span className="text-[10px] font-mono font-medium text-soc-400 uppercase tracking-widest">
                / 100
              </span>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <span className="text-[10px] font-mono uppercase text-soc-400 tracking-widest block">
              Fused Threat Level
            </span>
            <RiskBadge level={finalLevel} score={finalScore} size="md" />
          </div>
        </div>

        {/* Right: Individual Signals with Weights & Contribution (7 cols) */}
        <div className="md:col-span-7 space-y-3">
          {signals.map((sig) => {
            const weightPercent = Math.round((sig.weight || 0.25) * 100);
            const contribution = Math.round(sig.score * (sig.weight || 0.25));

            const barColor = {
              LOW: "bg-emerald-500",
              MEDIUM: "bg-amber-500",
              HIGH: "bg-orange-500",
              CRITICAL: "bg-rose-500",
            }[sig.riskLevel] || "bg-blue-500";

            return (
              <div
                key={sig.id}
                className="p-2.5 rounded-lg bg-soc-850/60 border border-soc-700/50 hover:border-soc-600 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-soc-200">{sig.label}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-soc-750 text-soc-400">
                      weight {weightPercent}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 font-mono text-[11px]">
                    <span className="text-soc-100 font-bold">{sig.score}</span>
                    <span className="text-soc-400 text-[10px]">
                      (+{contribution} pts)
                    </span>
                  </div>
                </div>

                {/* Contribution Progress Bar */}
                <div className="h-1.5 w-full rounded-full bg-soc-700/60 overflow-hidden">
                  <div
                    style={{ width: `${sig.score}%` }}
                    className={cn("h-full rounded-full transition-all duration-500", barColor)}
                  />
                </div>

                <p className="text-[10px] text-soc-400 mt-1 truncate">
                  {sig.textInterpretation}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expandable Fusion Math Explanation */}
      {showFormula && (
        <div className="p-3.5 rounded-lg bg-soc-850 border border-indigo-500/30 text-xs font-mono text-soc-300 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Risk Fusion Formula &amp; Calibration Weights:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-soc-400">
            Final Score = (Voice Authenticity × 0.35) + (Speaker Match × 0.30) + (Intent Analysis × 0.25) + (Context Risk × 0.10)
          </p>
          <div className="text-[11px] text-soc-300 bg-soc-950 p-2 rounded border border-soc-700/80">
            ({signals[0]?.score ?? 84} × 0.35) + ({signals[1]?.score ?? 91} × 0.30) + ({signals[2]?.score ?? 86} × 0.25) + ({signals[3]?.score ?? 65} × 0.10) = <strong className="text-soc-100">{finalScore} ({finalLevel})</strong>
          </div>
          <p className="text-[10px] text-soc-400 italic">
            Weights are calibrated according to enterprise threat tolerance rules configured in Settings.
          </p>
        </div>
      )}
    </div>
  );
}
