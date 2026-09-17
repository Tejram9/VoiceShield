import React from "react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/dashboard";

export type ExtendedRiskLevel = RiskLevel | "SAFE" | "CONTAINED" | "UNKNOWN";

export interface RiskBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  level: ExtendedRiskLevel;
  size?: "sm" | "md";
  showDot?: boolean;
}

export function RiskBadge({
  level,
  size = "md",
  showDot = true,
  className,
  ...props
}: RiskBadgeProps) {
  const normalizedLevel = level.toUpperCase() as ExtendedRiskLevel;

  const levelConfigs: Record<
    ExtendedRiskLevel,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    LOW: {
      label: "LOW RISK",
      bg: "bg-risk-safe-subtle",
      text: "text-risk-safe",
      border: "border-risk-safe-border",
      dot: "bg-risk-safe",
    },
    SAFE: {
      label: "SAFE / VERIFIED",
      bg: "bg-risk-safe-subtle",
      text: "text-risk-safe",
      border: "border-risk-safe-border",
      dot: "bg-risk-safe",
    },
    MEDIUM: {
      label: "CAUTION",
      bg: "bg-risk-caution-subtle",
      text: "text-amber-400",
      border: "border-risk-caution-border",
      dot: "bg-risk-caution",
    },
    ELEVATED: {
      label: "ELEVATED",
      bg: "bg-risk-caution-subtle",
      text: "text-amber-400",
      border: "border-risk-caution-border",
      dot: "bg-risk-caution",
    },
    HIGH: {
      label: "HIGH THREAT",
      bg: "bg-risk-threat-subtle",
      text: "text-orange-400",
      border: "border-risk-threat-border",
      dot: "bg-risk-threat",
    },
    CRITICAL: {
      label: "CRITICAL SPOOF",
      bg: "bg-risk-critical-subtle",
      text: "text-red-400",
      border: "border-risk-critical-border",
      dot: "bg-risk-critical",
    },
    CONTAINED: {
      label: "CONTAINED",
      bg: "bg-risk-contained-subtle",
      text: "text-indigo-400",
      border: "border-risk-contained-border",
      dot: "bg-risk-contained",
    },
    UNKNOWN: {
      label: "UNEVALUATED",
      bg: "bg-surface-2",
      text: "text-content-muted",
      border: "border-border-default",
      dot: "bg-content-muted",
    },
  };

  const config = levelConfigs[normalizedLevel] || levelConfigs.UNKNOWN;

  const sizeStyles = {
    sm: "px-2 py-0.5 text-2xs gap-1.5 rounded-sm",
    md: "px-2.5 py-1 text-xs gap-2 rounded",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono font-medium border uppercase tracking-wider select-none shrink-0",
        config.bg,
        config.text,
        config.border,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {showDot && <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dot)} />}
      <span>{config.label}</span>
    </span>
  );
}

export interface RiskScoreBarProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number; // 0 to 100
  showValue?: boolean;
  label?: string;
  size?: "sm" | "md";
}

export function RiskScoreBar({
  score,
  showValue = true,
  label = "Composite Threat Score",
  size = "md",
  className,
  ...props
}: RiskScoreBarProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  // Determine semantic color based on strict score thresholds
  const getColor = (s: number) => {
    if (s >= 80) return "bg-risk-critical";
    if (s >= 60) return "bg-risk-threat";
    if (s >= 35) return "bg-risk-caution";
    return "bg-risk-safe";
  };

  const getTextColor = (s: number) => {
    if (s >= 80) return "text-risk-critical";
    if (s >= 60) return "text-risk-threat";
    if (s >= 35) return "text-amber-400";
    return "text-risk-safe";
  };

  const barHeight = size === "sm" ? "h-1.5" : "h-2";

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)} {...props}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-content-secondary">{label}</span>
        {showValue && (
          <span className={cn("font-mono font-semibold", getTextColor(clampedScore))}>
            {clampedScore}
            <span className="text-content-muted font-normal text-2xs"> / 100</span>
          </span>
        )}
      </div>
      <div className={cn("w-full bg-surface-2 rounded-full overflow-hidden border border-border-subtle", barHeight)}>
        <div
          className={cn("h-full transition-all duration-300 ease-out", getColor(clampedScore))}
          style={{ width: `${clampedScore}%` }}
        />
      </div>
    </div>
  );
}

export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: "active" | "live" | "idle" | "warning" | "error" | "offline" | "contained";
  label?: string;
  size?: "sm" | "md";
}

export function StatusDot({ status, label, size = "md", className, ...props }: StatusDotProps) {
  const statusStyles = {
    active: "bg-risk-safe",
    live: "bg-risk-safe",
    idle: "bg-content-muted",
    warning: "bg-risk-caution",
    error: "bg-risk-critical",
    offline: "bg-content-subtle",
    contained: "bg-risk-contained",
  };

  const dotSize = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";

  return (
    <span className={cn("inline-flex items-center gap-2 select-none", className)} {...props}>
      <span className={cn("rounded-full shrink-0", dotSize, statusStyles[status])} />
      {label && <span className="text-xs font-medium text-content-secondary">{label}</span>}
    </span>
  );
}
