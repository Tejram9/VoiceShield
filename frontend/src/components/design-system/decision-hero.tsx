"use client";

import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  PhoneCall,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { RiskIndicator, ExtendedRiskLevel } from "./risk-indicator";
import { cn } from "@/lib/utils";

interface DecisionHeroProps {
  riskLevel: ExtendedRiskLevel;
  riskScore: number;
  callerName: string;
  callerNumber: string;
  callerRole?: string;
  claimedIdentityVerified?: boolean;
  policyTriggered?: string | null;
  headline?: string;
  summary?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: (actionId: string) => void;
  className?: string;
}

export function DecisionHero({
  riskLevel,
  riskScore,
  callerName,
  callerNumber,
  callerRole = "Corporate Contact",
  claimedIdentityVerified = false,
  policyTriggered,
  headline,
  summary,
  primaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  className,
}: DecisionHeroProps) {
  const isCritical = riskLevel === "CRITICAL";
  const isHigh = riskLevel === "HIGH";
  const isElevated = riskLevel === "ELEVATED" || riskLevel === "MEDIUM";
  const isLow = riskLevel === "LOW";
  const isThreat = isCritical || isHigh;

  // Derive human-centric copy following "Show the decision, then the evidence"
  const derivedHeadline =
    headline ||
    (isCritical
      ? "Potential Voice Impersonation Attack Detected"
      : isHigh
      ? "Caller Identity Suspicious — Verification Required"
      : isElevated
      ? "Elevated Conversational & Context Caution"
      : "Caller Verified — Normal Operating Parameters");

  const derivedSummary =
    summary ||
    (isCritical
      ? `Acoustic neural artifacts and speaker divergence detected for ${callerName}. Do not authorize sensitive transactions.`
      : isHigh
      ? `Discrepancies identified between claimed identity and voice characteristics. Execute independent verification protocol.`
      : isElevated
      ? `Urgent phrasing detected. Verify transaction details before proceeding with off-ledger approvals.`
      : `Voice characteristics match enrolled voiceprint for ${callerName}. No synthetic anomalies detected.`);

  const derivedPrimaryAction =
    primaryActionLabel ||
    (isThreat
      ? "Verify Caller via Trusted Callback"
      : isElevated
      ? "Request Pre-Shared Safe Word"
      : "Continue Monitored Call");

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 sm:p-6 transition-all relative overflow-hidden",
        isCritical && "bg-rose-950/20 border-rose-500/40",
        isHigh && "bg-orange-950/20 border-orange-500/35",
        isElevated && "bg-amber-950/15 border-amber-500/30",
        isLow && "bg-soc-800/80 border-soc-700",
        className
      )}
    >
      {/* Policy Trigger Banner if active */}
      {policyTriggered && (
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-semibold tracking-wide">
          <Lock className="w-3.5 h-3.5 text-rose-400" />
          <span>POLICY ENFORCED: {policyTriggered}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: What is happening + Why */}
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <RiskIndicator level={riskLevel} score={riskScore} size="md" />
            <span className="text-xs font-mono text-soc-400">
              Session Caller: <strong className="text-soc-200">{callerName}</strong> ({callerRole} · {callerNumber})
            </span>
            {claimedIdentityVerified ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3 h-3" /> Biometrics Matched
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400">
                <AlertTriangle className="w-3 h-3" /> Unverified Identity
              </span>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-white">
              {derivedHeadline}
            </h2>
            <p className="text-xs sm:text-sm text-soc-300 leading-relaxed">
              {derivedSummary}
            </p>
          </div>
        </div>

        {/* Right: What should I do? (Clear actionable containment) */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 flex-shrink-0">
          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onPrimaryAction}
            className={cn(
              "px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md",
              isCritical
                ? "bg-rose-600 hover:bg-rose-500 text-white"
                : isHigh
                ? "bg-orange-600 hover:bg-orange-500 text-white"
                : isElevated
                ? "bg-amber-600 hover:bg-amber-500 text-white"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            )}
          >
            {isThreat ? <PhoneCall className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{derivedPrimaryAction}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary Quick Action Links */}
          {isThreat && (
            <div className="flex items-center gap-2 text-xs font-mono text-soc-400">
              <button
                type="button"
                onClick={() => onSecondaryAction?.("safe-word")}
                className="hover:text-soc-200 underline decoration-soc-600 underline-offset-4 cursor-pointer"
              >
                Safe Word Challenge
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => onSecondaryAction?.("freeze-tx")}
                className="hover:text-rose-300 underline decoration-rose-800 underline-offset-4 cursor-pointer"
              >
                Freeze Wire Transfer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
