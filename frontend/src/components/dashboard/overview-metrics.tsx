"use client";

import React from "react";
import { OverviewMetric } from "@/types/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Radio, CheckCircle2, ShieldAlert, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewMetricsProps {
  metrics: OverviewMetric[];
}

export function OverviewMetrics({ metrics }: OverviewMetricsProps) {
  const getMetricIcon = (id: string) => {
    switch (id) {
      case "active-calls":
        return <Radio className="w-3.5 h-3.5 text-emerald-400" />;
      case "calls-analyzed":
        return <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />;
      case "high-risk-calls":
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      case "open-incidents":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map((metric) => (
        <Card
          key={metric.id}
          className={cn(
            "bg-slate-900/80 border-slate-800 transition-colors",
            metric.status === "danger" && "border-rose-500/30 bg-rose-950/10",
            metric.status === "warning" && "border-amber-500/30 bg-amber-950/10",
            metric.status === "active" && "border-emerald-500/30 bg-emerald-950/10"
          )}
        >
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                {metric.label}
              </span>
              <div className="p-1 rounded bg-slate-800 border border-slate-700/60">
                {getMetricIcon(metric.id)}
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold font-mono tracking-tight text-white">
                {metric.value}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {metric.subtext}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
