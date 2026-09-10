"use client";

/**
 * VoiceShield — Security Recommendation Panel
 *
 * Displays the required action derived from the backend RiskFusionEngine assessment.
 * Action title, urgency, and description come from the backend recommended_action field.
 *
 * Action buttons are operational indicators only in this phase — they show the
 * recommended workflow without connecting to an external ticketing system.
 *
 * Empty state: "WAITING FOR ANALYSIS" — no fake recommendation shown.
 */

import React from "react";
import type { RiskAssessment } from "@/lib/api/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CheckCircle, PhoneCall, ShieldCheck, Clock } from "lucide-react";

interface SecurityRecommendationProps {
  assessment?: RiskAssessment | null;
}

function mapActionTitle(action: string, riskLevel: string): string {
  if (action === "TERMINATE_CALL") return "TERMINATE CALL IMMEDIATELY";
  if (action === "INDEPENDENT_VERIFICATION" || riskLevel === "HIGH")
    return "INDEPENDENT VERIFICATION REQUIRED";
  if (action === "MONITOR" || riskLevel === "MEDIUM")
    return "MONITOR CONVERSATION & CHALLENGE IDENTITY";
  return "NO IMMEDIATE ACTION REQUIRED";
}

export function SecurityRecommendation({ assessment }: SecurityRecommendationProps) {
  // Empty state — no analysis run yet
  if (!assessment) {
    return (
      <Card className="bg-slate-900/90 border-slate-800 h-full">
        <CardContent className="p-4 h-full flex flex-col items-center justify-center space-y-2 min-h-[120px]">
          <div className="p-2 rounded border bg-slate-800 border-slate-700 text-slate-500">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-xs font-mono text-slate-500 text-center">
            WAITING FOR ANALYSIS
          </p>
          <p className="text-[10px] font-mono text-slate-600 text-center">
            Required action will appear after the first AI analysis cycle completes.
          </p>
        </CardContent>
      </Card>
    );
  }

  const riskLevel = assessment.risk_level;
  const action = assessment.recommended_action || "NONE";
  const explanation = assessment.explanation || "All evaluated voice parameters within expected parameters.";
  const actionTitle = mapActionTitle(action, riskLevel);
  const isHighRisk = riskLevel === "HIGH";
  const isMediumRisk = riskLevel === "MEDIUM";

  return (
    <Card className={`bg-slate-900/90 ${isHighRisk ? "border-rose-500/40" : "border-slate-800"}`}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2">
            <div
              className={`p-1 rounded border ${
                isHighRisk
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  : isMediumRisk
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              }`}
            >
              {isHighRisk ? (
                <ShieldAlert className="w-4 h-4" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
            </div>
            <span
              className={`text-xs font-mono font-bold uppercase tracking-wider ${
                isHighRisk ? "text-rose-400" : isMediumRisk ? "text-amber-400" : "text-emerald-400"
              }`}
            >
              REQUIRED ACTION
            </span>
          </div>
          <Badge
            variant={riskLevel}
            className="text-[10px] font-mono font-bold px-2 py-0.2"
          >
            {riskLevel} RISK PROTOCOL
          </Badge>
        </div>

        {/* Action */}
        <div>
          <h3 className="text-sm font-bold text-white font-mono">{actionTitle}</h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800 font-mono">
            {explanation}
          </p>
        </div>

        {/* Action buttons — operational indicators, not wired workflows */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            id="verify-caller-btn"
            aria-label="Initiate caller verification workflow"
            disabled
            title="Caller verification workflow — connect to identity management system"
            className={[
              "flex items-center space-x-1.5 px-3 py-1.5 rounded border text-xs font-bold font-mono uppercase transition",
              "opacity-60 cursor-not-allowed",
              isHighRisk
                ? "bg-rose-600/20 border-rose-500/30 text-rose-300"
                : "bg-slate-800 border-slate-700 text-slate-300",
            ].join(" ")}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>VERIFY CALLER</span>
          </button>

          <button
            type="button"
            id="start-callback-btn"
            aria-label="Initiate callback sequence"
            disabled
            title="Callback sequence — connect to telephony system"
            className="flex items-center space-x-1.5 px-3 py-1.5 opacity-60 cursor-not-allowed rounded border border-slate-700 bg-slate-800 text-slate-400 text-xs font-bold font-mono uppercase transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>START CALLBACK</span>
          </button>

          <span className="text-[9px] font-mono text-slate-600 block w-full">
            Workflow integrations — not yet connected to ticketing or telephony systems
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
