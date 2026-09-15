"use client";

import React from "react";
import { Clock, Lock } from "lucide-react";
import { EvolutionStep } from "./threat-evolution-tracker";
import { cn } from "@/lib/utils";

export interface EventNarrativeProps {
  steps: EvolutionStep[];
  currentStepIndex?: number;
  className?: string;
}

export function EventNarrative({
  steps,
  currentStepIndex = steps.length - 1,
  className,
}: EventNarrativeProps) {
  return (
    <div
      className={cn(
        "soc-panel p-4 font-sans text-xs space-y-3",
        className
      )}
    >
      <div className="flex items-center justify-between pb-2.5 border-b border-soc-700/60">
        <div className="flex items-center gap-2 text-soc-300 font-semibold tracking-tight text-[11px] font-mono uppercase">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>Chronological Threat Narrative</span>
        </div>
        <span className="text-[10px] font-mono text-soc-400">
          {steps.length} Logged Milestone{steps.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          const isLatest = idx === currentStepIndex;
          const isCritical = step.riskLevel === "CRITICAL";
          const isHigh = step.riskLevel === "HIGH";
          const isElevated = step.riskLevel === "ELEVATED";

          return (
            <div
              key={step.id || idx}
              className={cn(
                "p-3 rounded border flex flex-col justify-between transition-colors space-y-2 relative",
                isLatest
                  ? isCritical
                    ? "bg-rose-950/20 border-rose-500/40"
                    : isHigh
                    ? "bg-orange-950/20 border-orange-500/35"
                    : isElevated
                    ? "bg-amber-950/20 border-amber-500/30"
                    : "bg-soc-800/80 border-soc-600"
                  : "bg-soc-900/40 border-soc-800 text-soc-400"
              )}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-semibold text-soc-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-soc-500" />
                    <span>{step.time}</span>
                  </span>
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded border text-[9px] font-bold uppercase tracking-wider",
                      isCritical
                        ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                        : isHigh
                        ? "bg-orange-500/15 text-orange-300 border-orange-500/30"
                        : isElevated
                        ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    )}
                  >
                    {step.riskLevel}
                  </span>
                </div>

                <div className="font-semibold text-white text-xs leading-snug">
                  {step.stageName}
                </div>

                <p className="text-soc-300 text-[11px] leading-relaxed font-normal">
                  {step.triggerCause}
                </p>
              </div>

              {step.actionTriggered && (
                <div className="pt-2 border-t border-soc-800 text-[10px] font-mono text-soc-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-blue-400 flex-shrink-0" />
                  <span className="truncate">{step.actionTriggered}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
