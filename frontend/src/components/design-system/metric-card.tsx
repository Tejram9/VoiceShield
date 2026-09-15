"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
    isPositive: boolean;
  };
  status?: "normal" | "active" | "warning" | "danger" | "critical";
  icon?: React.ElementType;
  className?: string;
}

export function MetricCard({
  label,
  value,
  subtext,
  trend,
  status = "normal",
  icon: Icon,
  className,
}: MetricCardProps) {
  const statusBorderClass = {
    normal: "border-soc-700/80 hover:border-soc-600",
    active: "border-blue-500/40 hover:border-blue-500/70",
    warning: "border-amber-500/40 hover:border-amber-500/70",
    danger: "border-orange-500/40 hover:border-orange-500/70",
    critical: "border-rose-500/40 hover:border-rose-500/70",
  }[status];

  const statusAccentLine = {
    normal: "bg-soc-600",
    active: "bg-blue-500",
    warning: "bg-amber-500",
    danger: "bg-orange-500",
    critical: "bg-rose-500",
  }[status];

  return (
    <div
      className={cn(
        "relative rounded-xl bg-soc-800/90 border p-5 shadow-panel transition-all duration-200 group overflow-hidden",
        statusBorderClass,
        className
      )}
    >
      {/* Top Accent Strip */}
      <div className={cn("absolute top-0 left-0 right-0 h-0.5", statusAccentLine)} />

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-medium tracking-wider text-soc-400 uppercase">
            {label}
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-soc-100">
              {value}
            </span>
          </div>
        </div>

        {Icon && (
          <div className="p-2.5 rounded-lg bg-soc-750/80 border border-soc-700/60 text-soc-300 group-hover:text-soc-100 transition-colors">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-3 pt-3 border-t border-soc-700/50 flex items-center justify-between text-xs">
          {subtext && <span className="text-soc-400 truncate">{subtext}</span>}
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold",
                trend.isPositive ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {trend.direction === "up" ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : trend.direction === "down" ? (
                <ArrowDownRight className="w-3.5 h-3.5" />
              ) : (
                <Minus className="w-3.5 h-3.5" />
              )}
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
