"use client";

import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
  Loader2,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ExtendedRiskLevel =
  | "LOW"
  | "MEDIUM"
  | "ELEVATED"
  | "HIGH"
  | "CRITICAL"
  | "UNKNOWN"
  | "ANALYZING"
  | "INSUFFICIENT_SIGNAL";

interface RiskIndicatorProps {
  level: ExtendedRiskLevel;
  score?: number;
  showExplanation?: boolean;
  explanation?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RiskIndicator({
  level,
  score,
  showExplanation = false,
  explanation,
  size = "md",
  className,
}: RiskIndicatorProps) {
  const normalizedLevel = level === "MEDIUM" ? "ELEVATED" : level;

  const metadata: Record<
    string,
    {
      title: string;
      defaultExplanation: string;
      colorClass: string;
      borderClass: string;
      bgClass: string;
      dotClass: string;
      icon: React.ElementType;
    }
  > = {
    LOW: {
      title: "Low Risk",
      defaultExplanation: "Audio and conversational patterns match trusted baseline.",
      colorClass: "text-emerald-400",
      borderClass: "border-emerald-500/30",
      bgClass: "bg-emerald-950/30",
      dotClass: "bg-emerald-500",
      icon: ShieldCheck,
    },
    ELEVATED: {
      title: "Elevated Risk",
      defaultExplanation: "Heightened caution advised. Conversation or telephony context warrants review.",
      colorClass: "text-amber-400",
      borderClass: "border-amber-500/30",
      bgClass: "bg-amber-950/30",
      dotClass: "bg-amber-500",
      icon: AlertTriangle,
    },
    HIGH: {
      title: "High Risk",
      defaultExplanation: "Potential voice impersonation detected. Mandatory independent verification required.",
      colorClass: "text-orange-400",
      borderClass: "border-orange-500/30",
      bgClass: "bg-orange-950/30",
      dotClass: "bg-orange-500",
      icon: AlertTriangle,
    },
    CRITICAL: {
      title: "Critical Risk",
      defaultExplanation: "Synthetic voice cloning or severe coercion detected. Immediate containment enforced.",
      colorClass: "text-rose-400",
      borderClass: "border-rose-500/40",
      bgClass: "bg-rose-950/35",
      dotClass: "bg-rose-500",
      icon: AlertOctagon,
    },
    ANALYZING: {
      title: "Analyzing Audio",
      defaultExplanation: "Ingesting voice frames. Multi-signal neural evaluation in progress.",
      colorClass: "text-blue-400",
      borderClass: "border-blue-500/30",
      bgClass: "bg-blue-950/30",
      dotClass: "bg-blue-500",
      icon: Loader2,
    },
    INSUFFICIENT_SIGNAL: {
      title: "Insufficient Signal",
      defaultExplanation: "Awaiting sustained vocal audio frames to generate confident assessment.",
      colorClass: "text-slate-400",
      borderClass: "border-slate-600/40",
      bgClass: "bg-slate-900/40",
      dotClass: "bg-slate-500",
      icon: HelpCircle,
    },
    UNKNOWN: {
      title: "Unassessed",
      defaultExplanation: "Standby mode. Audio monitoring pending connection.",
      colorClass: "text-slate-400",
      borderClass: "border-slate-700",
      bgClass: "bg-slate-900/20",
      dotClass: "bg-slate-600",
      icon: Shield,
    },
  };

  const current = metadata[normalizedLevel] || metadata.UNKNOWN;
  const Icon = current.icon;
  const isSpinning = normalizedLevel === "ANALYZING";

  return (
    <div className={cn("inline-flex flex-col gap-1", className)}>
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border font-mono font-medium transition-all select-none",
          current.bgClass,
          current.borderClass,
          current.colorClass,
          size === "sm" && "px-2 py-0.5 text-xs",
          size === "md" && "px-3 py-1.5 text-xs",
          size === "lg" && "px-4 py-2 text-sm font-semibold"
        )}
      >
        <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", current.dotClass)} />
        <Icon className={cn("flex-shrink-0", size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4", isSpinning && "animate-spin")} />
        <span className="tracking-wide uppercase font-semibold">{current.title}</span>
        {score !== undefined && (
          <span className="ml-1 pl-1.5 border-l border-current/30 text-[11px] opacity-90">
            {score}/100
          </span>
        )}
      </div>

      {showExplanation && (
        <p className="text-[11px] text-soc-400 leading-snug mt-0.5">
          {explanation || current.defaultExplanation}
        </p>
      )}
    </div>
  );
}
