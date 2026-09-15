"use client";

import React from "react";
import {
  Clock,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface EvolutionStep {
  id: string;
  time: string;
  stageName: string;
  riskLevel: "LOW" | "ELEVATED" | "MEDIUM" | "HIGH" | "CRITICAL";
  score: number;
  triggerCause: string;
  actionTriggered: string;
  isActive?: boolean;
}

interface ThreatEvolutionTrackerProps {
  steps?: EvolutionStep[];
  currentStepIndex?: number;
  className?: string;
}

export const DEFAULT_EVOLUTION_STEPS: EvolutionStep[] = [
  {
    id: "step-1",
    time: "00:12",
    stageName: "Call Initiated",
    riskLevel: "LOW",
    score: 12,
    triggerCause: "Inbound SIP connection established. Voice baseline clean.",
    actionTriggered: "Passive stream monitoring active",
  },
  {
    id: "step-2",
    time: "00:34",
    stageName: "Urgency Detected",
    riskLevel: "ELEVATED",
    score: 45,
    triggerCause: "Caller demanded immediate off-ledger wire disbursement.",
    actionTriggered: "Flagged for Treasury desk supervisor caution",
  },
  {
    id: "step-3",
    time: "01:05",
    stageName: "Biometric Divergence",
    riskLevel: "HIGH",
    score: 72,
    triggerCause: "Speaker embedding mismatched Rahul Sharma reference voiceprint.",
    actionTriggered: "Safe word verbal challenge recommended",
  },
  {
    id: "step-4",
    time: "01:24",
    stageName: "Synthetic Artifact Confirmed",
    riskLevel: "CRITICAL",
    score: 94,
    triggerCause: "AASIST detected 1.24kHz vocoder phase glitch + auth bypass directive.",
    actionTriggered: "Policy POL-204 Enforced: Wire Freeze & Trusted Callback Required",
    isActive: true,
  },
];

export function ThreatEvolutionTracker({
  steps = DEFAULT_EVOLUTION_STEPS,
  currentStepIndex = 3,
  className,
}: ThreatEvolutionTrackerProps) {
  const getRiskColor = (lvl: string) => {
    switch (lvl) {
      case "CRITICAL":
        return "text-rose-400 border-rose-500/40 bg-rose-950/30";
      case "HIGH":
        return "text-orange-400 border-orange-500/40 bg-orange-950/30";
      case "ELEVATED":
      case "MEDIUM":
        return "text-amber-400 border-amber-500/30 bg-amber-950/30";
      default:
        return "text-emerald-400 border-emerald-500/30 bg-emerald-950/30";
    }
  };

  return (
    <div className={cn("rounded-2xl bg-soc-800 border border-soc-700 p-5 shadow-panel space-y-4", className)}>
      <div className="flex items-center justify-between pb-3 border-b border-soc-700">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold font-mono text-white tracking-tight">
            Dynamic Threat Risk Trajectory
          </h3>
        </div>
        <span className="text-[11px] font-mono text-soc-400">
          Chronological cause-and-effect transition ledger
        </span>
      </div>

      {/* Horizontal / Wrapped Step Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        {steps.map((step, idx) => {
          const isCurrent = idx === currentStepIndex || step.isActive;
          const isPassed = idx < currentStepIndex;

          return (
            <div
              key={step.id}
              className={cn(
                "p-3.5 rounded-xl border transition-all space-y-2 relative flex flex-col justify-between",
                isCurrent
                  ? "bg-soc-850 border-soc-500 ring-1 ring-soc-500/50 shadow-md"
                  : isPassed
                  ? "bg-soc-850/60 border-soc-700/80 opacity-90"
                  : "bg-soc-900/40 border-soc-750 opacity-60"
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-soc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-soc-500" />
                    {step.time}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                      getRiskColor(step.riskLevel)
                    )}
                  >
                    {step.riskLevel} ({step.score})
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white tracking-tight pt-1">
                  {step.stageName}
                </h4>

                <p className="text-[11px] text-soc-300 leading-snug">
                  {step.triggerCause}
                </p>
              </div>

              <div className="pt-2 border-t border-soc-700/60 mt-2 text-[10px] text-soc-400">
                <span className="text-soc-500 font-bold block">ACTION TRIGGERED:</span>
                <span className="text-soc-300 font-semibold">{step.actionTriggered}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
