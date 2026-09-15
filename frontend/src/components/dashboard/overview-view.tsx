"use client";

import React, { useState } from "react";
import {
  MOCK_OVERVIEW_METRICS,
  MOCK_LIVE_CALL,
  MOCK_CALL_HISTORY,
  MOCK_THREAT_DISTRIBUTION,
} from "@/lib/mock-data";
import { MetricCard } from "@/components/design-system/metric-card";
import { RiskIndicator } from "@/components/design-system/risk-indicator";
import {
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  History,
  Layers,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CallRecord, Incident } from "@/types/dashboard";

interface OverviewViewProps {
  onInspectLiveCall: () => void;
  onInspectCallHistory: (call: CallRecord) => void;
  onInspectIncident?: (incident: Incident) => void;
  className?: string;
}

export function OverviewView({
  onInspectLiveCall,
  onInspectCallHistory,
  className,
}: OverviewViewProps) {
  const [filterRisk, setFilterRisk] = useState<string>("ALL");

  const hasActiveThreat = MOCK_LIVE_CALL.riskLevel === "CRITICAL" || MOCK_LIVE_CALL.riskLevel === "HIGH";

  const filteredRecentCalls = MOCK_CALL_HISTORY.filter((call) => {
    if (filterRisk === "ALL") return true;
    return call.riskLevel === filterRisk;
  });

  return (
    <div className={cn("space-y-6 max-w-7xl mx-auto font-sans", className)}>
      {/* ── 1. TOP: PROTECTION STATUS BAR ─────────────────────────────── */}
      <div className="soc-panel p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold font-mono text-soc-100 tracking-tight">
                Telephony Protection State: Guarded
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20" />
            </div>
            <p className="text-xs text-soc-400 font-mono">
              4 Monitored Trunks · Whisper ASR + ECAPA-TDNN Models Operational
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-soc-300">
          <span className="px-2.5 py-1 rounded bg-soc-800 border border-soc-700">
            Session Latency: <strong className="text-emerald-400">142ms</strong>
          </span>
          <span className="px-2.5 py-1 rounded bg-soc-800 border border-soc-700">
            Zero-Trust Vault: <strong className="text-soc-100">Active</strong>
          </span>
        </div>
      </div>

      {/* ── 2. PRIMARY: ACTIVE THREAT / ACTIVE CALL (NOW) ─────────────── */}
      {hasActiveThreat ? (
        <div className="soc-panel border-rose-500/40 bg-rose-950/15 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-400 flex-shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold">
                    ACTIVE CALL: POTENTIAL IMPERSONATION ATTACK IN PROGRESS
                  </span>
                </div>
                <h3 className="text-base font-bold text-soc-100 tracking-tight font-mono">
                  Rahul Sharma (Claimed) (+91 98201 44521)
                </h3>
                <p className="text-xs text-soc-300 leading-relaxed max-w-2xl font-mono">
                  Synthetic voice clone detected on Trunk SIP-MUM-01. Caller attempted unauthorized $45,000 wire disbursement with dual-custody bypass directive.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 flex-shrink-0 self-start md:self-center">
              <RiskIndicator level={MOCK_LIVE_CALL.riskLevel} score={MOCK_LIVE_CALL.overallRiskScore} size="lg" />
              <button
                type="button"
                onClick={onInspectLiveCall}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Enter Live Protection Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="soc-panel p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Radio className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-mono text-soc-200">
              No active threat sessions detected on corporate trunks.
            </span>
          </div>
          <button
            type="button"
            onClick={onInspectLiveCall}
            className="text-xs font-mono text-blue-400 hover:underline cursor-pointer"
          >
            Open Live Protection &rarr;
          </button>
        </div>
      )}

      {/* ── 3. IMPORTANT METRICS (NOW & IMPACT) ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_OVERVIEW_METRICS.map((metric) => (
          <MetricCard key={metric.id} {...metric} />
        ))}
      </div>

      {/* ── 4. SECONDARY & INSIGHTS: RECENT CALLS & THREAT DISTRIBUTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Telephony Calls (8 cols) */}
        <div className="lg:col-span-8 soc-panel p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-soc-700/80 pb-3 gap-2">
            <div>
              <h3 className="text-sm font-bold font-mono text-soc-100 tracking-tight flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                <span>Recent Inbound Audited Calls</span>
              </h3>
              <p className="text-[11px] font-mono text-soc-400">
                Audited voice recordings, biometric checks, and threat dispositions
              </p>
            </div>

            {/* Risk Filter */}
            <div className="flex items-center space-x-1 p-1 rounded-lg bg-soc-800 border border-soc-700 text-[10px] font-mono">
              {(["ALL", "CRITICAL", "HIGH", "LOW"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFilterRisk(lvl)}
                  className={cn(
                    "px-2 py-0.5 rounded font-bold transition-colors cursor-pointer",
                    filterRisk === lvl ? "bg-blue-600 text-white" : "text-soc-400 hover:text-white"
                  )}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {filteredRecentCalls.slice(0, 4).map((call) => (
              <div
                key={call.id}
                className="p-3 rounded-lg bg-soc-800/60 border border-soc-700/60 hover:border-soc-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-soc-100 text-xs">{call.callerName}</span>
                    <span className="text-[11px] text-soc-400">({call.callerNumber})</span>
                  </div>
                  <p className="text-[11px] text-soc-300">
                    Trigger: <strong className="text-soc-200">{call.primaryTrigger}</strong> · Duration: {call.duration}
                  </p>
                </div>

                <div className="flex items-center space-x-3 self-start sm:self-center">
                  <RiskIndicator level={call.riskLevel} score={call.riskScore} size="sm" />
                  <button
                    type="button"
                    onClick={() => onInspectCallHistory(call)}
                    className="px-3 py-1.5 rounded-lg bg-soc-750 hover:bg-soc-700 text-soc-200 hover:text-white text-xs font-bold border border-soc-650 transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Forensics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Threat Vector Distribution (4 cols) */}
        <div className="lg:col-span-4 soc-panel p-4 sm:p-5 space-y-4 font-mono text-xs">
          <div className="border-b border-soc-700 pb-3">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Threat Vector Insights</span>
            </h3>
            <p className="text-[11px] text-soc-400">
              Impersonation attack distribution across active corporate lines
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {MOCK_THREAT_DISTRIBUTION.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-soc-200 font-bold">{item.category}</span>
                  <span className="text-soc-400">{item.percentage}% ({item.count})</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-soc-850 overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%` }}
                    className={cn(
                      "h-full rounded-full transition-all",
                      idx === 0
                        ? "bg-rose-500"
                        : idx === 1
                        ? "bg-purple-500"
                        : idx === 2
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
