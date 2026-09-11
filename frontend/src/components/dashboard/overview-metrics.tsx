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
        return <Radio className="w-3.5 h-3.5 text-emerald-600" />;
      case "calls-analyzed":
        return <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />;
      case "high-risk-calls":
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />;
      case "open-incidents":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card
          key={metric.id}
          className={cn(
            "rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all duration-300 shadow-sm hover:-translate-y-0.5",
            metric.status === "danger" && "border-rose-200 bg-rose-50/40",
            metric.status === "warning" && "border-amber-200 bg-amber-50/40",
            metric.status === "active" && "border-emerald-200 bg-emerald-50/40"
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-medium uppercase tracking-[0.1em] text-[#64748B]">
                {metric.label}
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                {getMetricIcon(metric.id)}
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono tracking-tight text-[#0F172A]">
                {metric.value}
              </span>
              <span className="text-[10px] font-mono text-[#64748B] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {metric.subtext}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
