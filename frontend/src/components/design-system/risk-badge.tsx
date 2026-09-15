"use client";

import React from "react";
import { RiskLevel } from "@/types/dashboard";
import { ShieldCheck, AlertTriangle, ShieldAlert, OctagonAlert, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  showIcon?: boolean;
  showScore?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RiskBadge({
  level,
  score,
  showIcon = true,
  showScore = true,
  size = "md",
  className,
}: RiskBadgeProps) {
  const config = {
    LOW: {
      label: "VERIFIED SAFE",
      bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      dotBg: "bg-emerald-500",
      icon: ShieldCheck,
    },
    MEDIUM: {
      label: "ELEVATED CAUTION",
      bg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      dotBg: "bg-amber-500",
      icon: AlertTriangle,
    },
    HIGH: {
      label: "SUSPICIOUS IMPERSONATION",
      bg: "bg-orange-500/10 text-orange-400 border-orange-500/30",
      dotBg: "bg-orange-500",
      icon: ShieldAlert,
    },
    CRITICAL: {
      label: "CRITICAL VOICE CLONE",
      bg: "bg-rose-500/15 text-rose-400 border-rose-500/40",
      dotBg: "bg-rose-500",
      icon: OctagonAlert,
    },
  }[level] || {
    label: "NORMAL",
    bg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    dotBg: "bg-blue-500",
    icon: Shield,
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5 gap-1.5",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3.5 py-1.5 gap-2 font-medium",
  }[size];

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-mono font-semibold tracking-wider uppercase transition-colors shadow-sm",
        config.bg,
        sizeClasses,
        className
      )}
    >
      {showIcon && <Icon className={cn(iconSizes, "flex-shrink-0")} />}
      <span>{config.label}</span>
      {showScore && score !== undefined && (
        <span className="ml-1 px-1.5 py-0.2 rounded bg-black/30 font-mono text-[11px] font-bold">
          {score}/100
        </span>
      )}
    </span>
  );
}
