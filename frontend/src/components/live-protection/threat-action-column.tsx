"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Shield,
  FileText,
  ChevronRight,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

export interface ThreatActionColumnProps {
  riskLevel?: "LOW" | "ELEVATED" | "HIGH" | "CRITICAL" | "CONTAINED";
  headline?: string;
  explanation?: string;
  whyRiskyBullets?: string[];
  recommendedAction?: {
    type: "continue" | "verify" | "pause" | "contained";
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText?: string;
  };
  onVerifyCaller?: () => void;
  onPauseAction?: () => void;
  onViewTechnicalDetails?: () => void;
  className?: string;
}

export function ThreatActionColumn({
  riskLevel = "HIGH",
  headline = "Potential impersonation detected.",
  explanation = "The current call shows speaker inconsistency and a sensitive financial request.",
  whyRiskyBullets = [
    "Voice authenticity concern: Neural vocoder phase discontinuities at 1.24kHz",
    "Speaker consistency mismatch: ECAPA-TDNN embedding diverges from Rahul Sharma",
    "Coercive social engineering: Demanded complete confidentiality and isolation",
  ],
  recommendedAction = {
    type: "pause",
    title: "RECOMMENDED ACTION",
    subtitle: "PROTECTIVE ACTION RECOMMENDED",
    description: "Verify the caller independently before continuing the sensitive action.",
    primaryButtonText: "Verify Caller",
    secondaryButtonText: "Pause Action",
  },
  onVerifyCaller,
  onPauseAction,
  onViewTechnicalDetails,
  className,
}: ThreatActionColumnProps) {
  const [showWhyDetails, setShowWhyDetails] = useState<boolean>(false);

  const getRiskColorTheme = (level: string) => {
    switch (level) {
      case "CRITICAL":
      case "HIGH":
        return {
          badgeText: "text-rose-600",
          cardBorder: "border-rose-100",
          headlineText: "text-rose-600",
          actionBtn: "bg-rose-600 hover:bg-rose-700 text-white shadow-xs",
        };
      case "ELEVATED":
        return {
          badgeText: "text-amber-600",
          cardBorder: "border-amber-100",
          headlineText: "text-amber-700",
          actionBtn: "bg-amber-600 hover:bg-amber-700 text-white shadow-xs",
        };
      case "CONTAINED":
        return {
          badgeText: "text-indigo-600",
          cardBorder: "border-indigo-100",
          headlineText: "text-indigo-600",
          actionBtn: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs",
        };
      default:
        return {
          badgeText: "text-emerald-600",
          cardBorder: "border-emerald-100",
          headlineText: "text-emerald-700",
          actionBtn: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs",
        };
    }
  };

  const theme = getRiskColorTheme(riskLevel);

  return (
    <div className={cn("w-full bg-white border border-slate-200/70 rounded-xl divide-y divide-slate-100", className)}>
      {/* ========================================================================= */}
      {/* SECTION 1: CURRENT RISK */}
      {/* ========================================================================= */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className={cn("h-4 w-4", theme.badgeText)} />
          <span
            className={cn(
              "text-2xs font-bold uppercase tracking-wider",
              theme.badgeText
            )}
          >
            CURRENT RISK
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className={cn("text-3xl font-extrabold tracking-tight", theme.headlineText)}>
            {riskLevel}
          </span>
          <span className={cn("text-xs font-bold", theme.headlineText)}>
            {headline}
          </span>
          <p className="text-xs text-slate-500 leading-normal">
            {explanation}
          </p>
        </div>

        {/* Why is this risky? Accordion Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowWhyDetails((v) => !v)}
            className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200/60 bg-slate-50/80 hover:bg-slate-100 text-xs text-slate-700 font-medium transition-colors"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              <span>Why is this risky?</span>
            </div>
            {showWhyDetails ? (
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            )}
          </button>

          {showWhyDetails && (
            <ul className="mt-2 p-3 rounded-lg bg-slate-50/80 border border-slate-200/60 flex flex-col gap-1.5 list-none m-0 animate-in fade-in duration-100 text-2xs text-slate-600 leading-relaxed">
              {whyRiskyBullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: RECOMMENDED ACTION */}
      {/* ========================================================================= */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <Shield className="h-4 w-4 text-slate-400" />
          <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
            {recommendedAction.title}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span
            className={cn(
              "text-2xs font-bold uppercase tracking-wider",
              riskLevel === "LOW" ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {recommendedAction.subtitle}
          </span>
          <p className="text-xs text-slate-600 leading-normal">
            {recommendedAction.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onVerifyCaller}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors text-center",
              theme.actionBtn
            )}
          >
            {recommendedAction.primaryButtonText}
          </button>

          {recommendedAction.secondaryButtonText && (
            <button
              type="button"
              onClick={onPauseAction}
              className="py-2 px-3 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              {recommendedAction.secondaryButtonText}
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: TECHNICAL EVIDENCE (Compact integrated footer row) */}
      {/* ========================================================================= */}
      <div className="px-5 py-3 flex items-center justify-between gap-3 bg-slate-50/50 rounded-b-xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-slate-900 leading-tight">
              Technical Evidence
            </span>
            <span className="text-2xs text-slate-500 leading-tight truncate">
              Voice forensics & biometric telemetry
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewTechnicalDetails}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 shrink-0 transition-colors"
        >
          <span>View Details</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
