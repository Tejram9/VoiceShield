"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Mic,
  Fingerprint,
  MessageSquareWarning,
  Server,
  Info,
} from "lucide-react";
import { ExtendedRiskLevel } from "./risk-indicator";
import { SignalStatus } from "./multi-signal-matrix";
import { cn } from "@/lib/utils";

export interface ThreatDecisionPanelProps {
  riskLevel: ExtendedRiskLevel;
  riskScore?: number;
  headline: string;
  summary: string;
  reasons?: string[];
  policyTriggered?: string | null;
  signals: SignalStatus[];
  activeSignalId?: string | null;
  onInspectSignal?: (id: string) => void;
  className?: string;
}

export function ThreatDecisionPanel({
  riskLevel,
  headline,
  summary,
  reasons = [],
  policyTriggered,
  signals,
  activeSignalId,
  onInspectSignal,
  className,
}: ThreatDecisionPanelProps) {
  const [internalExpandedId, setInternalExpandedId] = useState<string | null>(null);
  const expandedId = activeSignalId !== undefined ? activeSignalId : internalExpandedId;

  const handleToggleSignal = (id: string) => {
    const next = expandedId === id ? null : id;
    setInternalExpandedId(next);
    if (next) onInspectSignal?.(next);
  };

  const getSignalIcon = (id: string) => {
    switch (id) {
      case "voice-authenticity":
        return Mic;
      case "speaker-consistency":
        return Fingerprint;
      case "conversation-risk":
        return MessageSquareWarning;
      default:
        return Server;
    }
  };

  const isCritical = riskLevel === "CRITICAL";
  const isHigh = riskLevel === "HIGH";
  const isElevated = riskLevel === "ELEVATED" || riskLevel === "MEDIUM";

  return (
    <div
      className={cn(
        "soc-panel p-4 font-sans text-xs flex flex-col justify-between space-y-4",
        className
      )}
    >
      <div className="space-y-4">
        {/* Header with Authoritative State Badge */}
        <div className="flex items-center justify-between pb-2.5 border-b border-soc-700/60">
          <div className="flex items-center gap-2 text-soc-300 font-semibold tracking-tight text-[11px] font-mono uppercase">
            {isCritical ? (
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            ) : isHigh ? (
              <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
            ) : isElevated ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>Threat Decision &amp; Assessment</span>
          </div>

          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-[10px] font-mono font-bold uppercase tracking-wide",
              isCritical
                ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                : isHigh
                ? "bg-orange-500/15 border-orange-500/30 text-orange-300"
                : isElevated
                ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                isCritical
                  ? "bg-rose-500"
                  : isHigh
                  ? "bg-orange-500"
                  : isElevated
                  ? "bg-amber-500"
                  : "bg-emerald-400"
              )}
            />
            <span>{isCritical ? "CRITICAL RISK" : isHigh ? "HIGH RISK" : isElevated ? "ELEVATED RISK" : "LOW RISK"}</span>
          </span>
        </div>

        {/* Verdict Headline & Summary */}
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
            {headline}
          </h3>
          <p className="text-soc-300 text-xs leading-relaxed font-normal">
            {summary}
          </p>
        </div>

        {/* Bulleted Rationale: Why Did the System Arrive at This Conclusion? */}
        {reasons && reasons.length > 0 && (
          <div className="p-3 rounded bg-soc-900/50 border border-soc-800 space-y-1.5">
            <div className="text-[10px] font-mono uppercase text-soc-400 font-semibold tracking-wider">
              Primary Concern Factors (Why?):
            </div>
            <ul className="space-y-1 text-xs text-soc-200">
              {reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-snug">
                  <span className="text-soc-500 select-none mt-0.5 font-mono">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Corporate Policy Notice */}
        {policyTriggered && (
          <div className="p-2.5 rounded bg-rose-950/20 border border-rose-500/30 text-xs text-rose-300 space-y-0.5">
            <span className="font-mono font-bold text-[10px] uppercase tracking-wider block text-rose-400">
              Policy Triggered:
            </span>
            <p className="leading-snug">{policyTriggered}</p>
          </div>
        )}

        {/* 4-Pillar Signal Matrix Rows */}
        <div className="pt-2 border-t border-soc-700/60 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-soc-500 font-semibold tracking-wider">
            <span>Multi-Signal Fusion Signals</span>
            <span>Diagnostic Detail</span>
          </div>

          <div className="space-y-1">
            {signals.map((sig) => {
              const Icon = getSignalIcon(sig.id);
              const isSigExpanded = expandedId === sig.id;
              const isSigCritical = sig.severity === "CRITICAL";
              const isSigHigh = sig.severity === "HIGH";
              const isSigElevated = sig.severity === "ELEVATED";

              return (
                <div key={sig.id} className="rounded border border-soc-750/80 overflow-hidden bg-soc-900/40">
                  <button
                    type="button"
                    onClick={() => handleToggleSignal(sig.id)}
                    className="w-full px-3 py-2 flex items-center justify-between gap-2 hover:bg-soc-800/50 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon
                        className={cn(
                          "w-3.5 h-3.5 flex-shrink-0",
                          isSigCritical
                            ? "text-rose-400"
                            : isSigHigh
                            ? "text-orange-400"
                            : isSigElevated
                            ? "text-amber-400"
                            : "text-blue-400"
                        )}
                      />
                      <span className="font-medium text-white truncate text-xs font-sans">
                        {sig.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={cn(
                          "text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase",
                          isSigCritical
                            ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                            : isSigHigh
                            ? "bg-orange-500/15 text-orange-300 border-orange-500/30"
                            : isSigElevated
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                        )}
                      >
                        {sig.severity}
                      </span>
                      {isSigExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-soc-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-soc-400" />
                      )}
                    </div>
                  </button>

                  {/* Inline Progressive Disclosure Drawer */}
                  {isSigExpanded && (
                    <div className="p-3 bg-soc-850/90 border-t border-soc-750 text-xs space-y-2 text-soc-300 font-sans">
                      <p className="text-white font-medium text-xs">{sig.summary}</p>
                      <div className="space-y-1">
                        <div>
                          <strong className="text-soc-400 uppercase text-[9px] font-mono block">Detected Pattern:</strong>
                          <span className="text-soc-200 text-xs">{sig.whatWasDetected}</span>
                        </div>
                        <div>
                          <strong className="text-soc-400 uppercase text-[9px] font-mono block">Diagnostic Rationale:</strong>
                          <span className="text-soc-200 text-xs">{sig.whyItMatters}</span>
                        </div>
                      </div>

                      {sig.technicalDetails && sig.technicalDetails.length > 0 && (
                        <div className="pt-2 border-t border-soc-800">
                          <span className="text-[9px] text-soc-500 uppercase font-mono font-semibold block mb-1">
                            Model Pipeline Metrics:
                          </span>
                          <div className="flex flex-wrap gap-1 font-mono">
                            {sig.technicalDetails.map((td, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-soc-900 border border-soc-700 text-[10px] text-soc-300"
                              >
                                {td}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer distinction note */}
      <div className="pt-2 border-t border-soc-700/60 flex items-center gap-1.5 text-[10px] text-soc-400 font-mono">
        <Info className="w-3 h-3 text-soc-500 flex-shrink-0" />
        <span>Multi-factor fusion balances voice authenticity against speaker biometric baseline.</span>
      </div>
    </div>
  );
}
