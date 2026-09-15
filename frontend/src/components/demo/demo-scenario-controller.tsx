"use client";

import React from "react";
import {
  RotateCcw,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type DemoStage =
  | "STAGE_1_NORMAL"
  | "STAGE_2_URGENCY"
  | "STAGE_3_SPEAKER_MISMATCH"
  | "STAGE_4_SYNTHETIC_CLONE"
  | "STAGE_5_CONTAINED";

interface DemoScenarioControllerProps {
  currentStage: DemoStage;
  onSelectStage: (stage: DemoStage) => void;
  onReset: () => void;
  className?: string;
}

const STAGES: { id: DemoStage; step: number; title: string; risk: string; badgeColor: string }[] = [
  {
    id: "STAGE_1_NORMAL",
    step: 1,
    title: "1. Normal",
    risk: "LOW",
    badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
  {
    id: "STAGE_2_URGENCY",
    step: 2,
    title: "2. Urgency Detected",
    risk: "ELEVATED",
    badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  {
    id: "STAGE_3_SPEAKER_MISMATCH",
    step: 3,
    title: "3. Speaker Mismatch",
    risk: "HIGH",
    badgeColor: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  },
  {
    id: "STAGE_4_SYNTHETIC_CLONE",
    step: 4,
    title: "4. Synthetic Clone",
    risk: "CRITICAL",
    badgeColor: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  },
  {
    id: "STAGE_5_CONTAINED",
    step: 5,
    title: "5. Contained",
    risk: "RESOLVED",
    badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  },
];

export function DemoScenarioController({
  currentStage,
  onSelectStage,
  onReset,
  className,
}: DemoScenarioControllerProps) {
  return (
    <div
      className={cn(
        "soc-panel p-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 font-sans text-xs",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded bg-soc-800 border border-soc-700 text-soc-300 flex-shrink-0">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <div>
          <div className="flex items-center gap-2 font-mono">
            <span className="font-semibold text-white text-xs">
              Live Threat Progression Walkthrough
            </span>
            <span className="px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[9px] font-bold">
              30-SEC DEMO
            </span>
          </div>
          <p className="text-[11px] text-soc-400 font-sans">
            Simulate the end-to-end impersonation lifecycle: from baseline trust to automated wire containment
          </p>
        </div>
      </div>

      {/* Stage Selection Buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        {STAGES.map((s) => {
          const isSelected = currentStage === s.id;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectStage(s.id)}
              className={cn(
                "px-2.5 py-1 rounded border font-mono text-[11px] transition-colors cursor-pointer flex items-center gap-1.5",
                isSelected
                  ? "bg-soc-750 text-white border-soc-500 font-semibold"
                  : "bg-soc-850 text-soc-400 border-soc-700 hover:text-soc-200 hover:bg-soc-800"
              )}
            >
              <span>{s.title}</span>
              <span className={cn("text-[9px] px-1 py-0.2 rounded border uppercase font-bold", s.badgeColor)}>
                {s.risk}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onReset}
          className="p-1.5 rounded bg-soc-800 hover:bg-soc-750 text-soc-400 hover:text-white border border-soc-700 transition-colors cursor-pointer"
          title="Reset Simulation"
          aria-label="Reset simulation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
