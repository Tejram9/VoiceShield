"use client";

/**
 * VoiceShield — Detection Assessment Panel (Risk Signal Breakdown)
 *
 * Renders the 4 core AI signals from the Risk Fusion Engine.
 * Accepts typed per-signal state from useAnalysisState rather than a
 * generic RiskSignal array that mixes backend and dashboard types.
 *
 * Two modes:
 *   1. Live mode (analysisState): shows real per-signal data when available
 *   2. Signals mode (signals[]): shows RiskSignal[] from REST assessment
 *
 * Truthful empty states:
 *   - "ANALYSIS PENDING" before first run
 *   - "REFERENCE UNAVAILABLE" for speaker when backend reports no reference
 *   - Raw scores shown without false precision claims
 */

import React from "react";
import type { RiskSignal } from "@/lib/api/types";
import type { AnalysisState } from "@/hooks/use-analysis-state";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRiskColorClasses } from "@/lib/utils";

interface RiskSignalBreakdownProps {
  /** Full analysis state — preferred when available */
  analysisState?: AnalysisState | null;
  /** Fallback: RiskSignal[] from REST risk assessment response */
  signals?: RiskSignal[];
}

export function RiskSignalBreakdown({ analysisState, signals = [] }: RiskSignalBreakdownProps) {
  const hasAnalysisState = !!analysisState;
  const hasSignals = signals.length > 0;

  // ── Render from REST RiskSignal[] (complete assessment) ────────────
  if (!hasAnalysisState && hasSignals) {
    return <SignalsList signals={signals} />;
  }

  // ── Render from live per-signal state ──────────────────────────────
  if (hasAnalysisState) {
    return <LiveSignalView state={analysisState} />;
  }

  // ── No data at all ─────────────────────────────────────────────────
  return (
    <Card className="border-slate-800 bg-slate-900/90">
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300">
          DETECTION ASSESSMENT (RISK FUSION ENGINE)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="p-4 text-center rounded bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-400">
          No risk signals evaluated yet. Execute an audio analysis cycle to compute Risk Fusion scores.
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Live per-signal view (from useAnalysisState)
// ---------------------------------------------------------------------------

function LiveSignalView({ state }: { state: AnalysisState }) {
  const { spoof, speaker, socialEngineering, riskAssessment } = state;

  // Map backend types to display rows
  const rows: {
    id: string;
    label: string;
    description: string;
    score: number | null;
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | null;
    interpretation: string;
    note?: string;
  }[] = [
    {
      id: "voice-integrity",
      label: "Voice Integrity",
      description: "Synthetic Audio Detection (Wav2Vec2)",
      score: spoof ? Math.round(spoof.spoofProbability * 100) : null,
      riskLevel: spoof
        ? spoof.spoofProbability >= 0.7 ? "HIGH"
          : spoof.spoofProbability >= 0.4 ? "MEDIUM"
          : "LOW"
        : null,
      interpretation: spoof
        ? spoof.spoofProbability >= 0.7
          ? "Strong synthetic-speech indicators detected."
          : spoof.spoofProbability >= 0.4
          ? "Moderate synthetic-speech indicators detected."
          : "Voice appears authentic. No significant synthetic indicators."
        : "ANALYSIS PENDING",
      note: spoof?.indicators.length
        ? `Indicators: ${spoof.indicators.slice(0, 2).join(", ")}`
        : undefined,
    },
    {
      id: "speaker-consistency",
      label: "Speaker Consistency",
      description: "Biometric Reference Comparison (ECAPA-TDNN)",
      score: speaker && speaker.status === "AVAILABLE"
        ? Math.round(speaker.similarityScore * 100)
        : null,
      riskLevel: speaker && speaker.status === "AVAILABLE"
        ? speaker.similarityScore < 0.5 ? "HIGH"
          : speaker.similarityScore < 0.75 ? "MEDIUM"
          : "LOW"
        : null,
      interpretation: !speaker
        ? "ANALYSIS PENDING"
        : speaker.status !== "AVAILABLE"
        ? "REFERENCE PROFILE UNAVAILABLE"
        : speaker.similarityScore < 0.5
        ? "Low similarity to reference profile — possible identity mismatch."
        : speaker.similarityScore < 0.75
        ? "Moderate similarity. Additional verification recommended."
        : "Voice embedding matches reference profile.",
      note: speaker && speaker.status !== "AVAILABLE" && speaker.status !== "NO_REFERENCE"
        ? `Status: ${speaker.status}`
        : undefined,
    },
    {
      id: "social-engineering",
      label: "Social Engineering",
      description: "Intent & Coercion Analysis (Rule-based NLP)",
      score: socialEngineering ? Math.round(socialEngineering.urgencyScore) : null,
      riskLevel: socialEngineering
        ? socialEngineering.urgencyScore >= 60 ? "HIGH"
          : socialEngineering.urgencyScore >= 30 ? "MEDIUM"
          : "LOW"
        : null,
      interpretation: socialEngineering
        ? socialEngineering.coercionDetected || socialEngineering.financialRequestDetected
          ? "Coercive patterns or financial request detected in transcript."
          : socialEngineering.urgencyScore >= 30
          ? "Elevated urgency signals detected."
          : "No significant social engineering indicators detected."
        : "ANALYSIS PENDING",
    },
    {
      id: "context-risk",
      label: "Context Risk",
      description: "Environmental Metadata (Context Engine)",
      score: riskAssessment
        ? riskAssessment.contributing_signals.find(s =>
            s.label.toLowerCase().includes("context")
          )?.raw_score ?? null
        : null,
      riskLevel: riskAssessment
        ? (riskAssessment.contributing_signals.find(s =>
            s.label.toLowerCase().includes("context")
          )?.risk_level ?? null)
        : null,
      interpretation: !riskAssessment
        ? "ANALYSIS PENDING"
        : "Context metadata evaluated.",
    },
  ];

  return (
    <Card className="border-slate-800 bg-slate-900/90">
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300">
            DETECTION ASSESSMENT (RISK FUSION ENGINE)
          </CardTitle>
          <span className="text-[10px] font-mono text-slate-400">
            4 Fused Signals
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        {rows.map((row) => {
          const riskStyles = row.riskLevel ? getRiskColorClasses(row.riskLevel) : null;
          const isPending = row.score === null;
          const isUnavailable = row.interpretation.includes("UNAVAILABLE");

          return (
            <div
              key={row.id}
              className="p-3 rounded bg-slate-950/80 border border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-white font-mono">
                    {row.label}
                  </span>
                  {isPending && (
                    <span className="text-[9px] font-mono text-slate-500 border border-slate-700 px-1.5 py-0.2 rounded">
                      PENDING
                    </span>
                  )}
                  {isUnavailable && !isPending && (
                    <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded">
                      UNAVAILABLE
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {row.riskLevel && riskStyles && (
                    <Badge variant={row.riskLevel} className="text-[10px] font-mono font-bold px-2 py-0.2">
                      {row.riskLevel}
                    </Badge>
                  )}
                  {row.score !== null ? (
                    <span className={`text-sm font-black font-mono ${riskStyles?.text ?? "text-slate-400"}`}>
                      {row.score}
                      <span className="text-[10px] text-slate-400 font-normal"> / 100</span>
                    </span>
                  ) : (
                    <span className="text-sm font-mono text-slate-600">—</span>
                  )}
                </div>
              </div>

              <p className="text-[10px] font-mono text-slate-400">{row.description}</p>

              <p className={`text-xs font-mono ${isPending || isUnavailable ? "text-slate-500 italic" : "text-slate-300"}`}>
                {isPending || isUnavailable ? row.interpretation : `"${row.interpretation}"`}
              </p>

              {row.note && (
                <p className="text-[10px] text-slate-500 font-mono leading-tight">{row.note}</p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// REST RiskSignal[] view (when analysisState not yet available)
// ---------------------------------------------------------------------------

function SignalsList({ signals }: { signals: RiskSignal[] }) {
  return (
    <Card className="border-slate-800 bg-slate-900/90">
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300">
            DETECTION ASSESSMENT (RISK FUSION ENGINE)
          </CardTitle>
          <span className="text-[10px] font-mono text-slate-400">
            {signals.length} Fused Signal{signals.length === 1 ? "" : "s"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        {signals.map((sig, idx) => {
          const riskStyles = getRiskColorClasses(sig.risk_level);
          return (
            <div
              key={sig.signal_id || `sig-${idx}`}
              className="p-3 rounded bg-slate-950/80 border border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-white font-mono">{sig.label}</span>
                  {sig.confidence_label && (
                    <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">
                      {sig.confidence_label}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={sig.risk_level} className="text-[10px] font-mono font-bold px-2 py-0.2">
                    {sig.risk_level}
                  </Badge>
                  <span className={`text-sm font-black font-mono ${riskStyles.text}`}>
                    {sig.raw_score}
                    <span className="text-[10px] text-slate-400 font-normal"> / 100</span>
                  </span>
                </div>
              </div>
              <p className="text-[10px] font-mono text-slate-400">{sig.description}</p>
              <p className="text-xs font-mono text-slate-300">&quot;{sig.explanation}&quot;</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
