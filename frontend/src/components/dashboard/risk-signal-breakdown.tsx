"use client";

/**
 * VoiceShield — Detection Assessment Panel (Risk Signal Breakdown)
 *
 * Cybersecurity Operations Center (SOC) Aesthetic:
 * - Glassmorphism card with 16px radius and dark gradient
 * - 4 Signal cards with 3px colored left border accents matching threat status
 * - 32px mini circular SVG progress ring on each card
 * - Proper glowing pill chips with icons for status
 * - Shimmer skeleton loading effect for pending analysis states
 * - Lift on hover (-2px translateY) with expanded depth shadow
 */

import React from "react";
import type { RiskSignal } from "@/lib/api/types";
import type { AnalysisState } from "@/hooks/use-analysis-state";
import { Badge } from "@/components/ui/badge";
import { getRiskColorClasses } from "@/lib/utils";
import { AudioWaveform, Fingerprint, ShieldAlert, Compass } from "lucide-react";

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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="pb-4 border-b border-slate-200">
        <h3 className="text-base font-bold text-[#0F172A] tracking-tight font-sans">
          AI Risk Signals &amp; Multi-Factor Analysis
        </h3>
      </div>
      <div className="pt-4">
        <div className="p-5 text-center rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#64748B] font-mono">
          NO_SIGNALS_EVALUATED // Execute an audio analysis cycle to compute Risk Fusion vectors.
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mini Circular Progress Ring (32px diameter)
// ---------------------------------------------------------------------------
function MiniProgressRing({
  score,
  riskLevel,
}: {
  score: number | null;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | null;
}) {
  const r = 12;
  const c = 2 * Math.PI * r; // ~75.4
  const isPending = score === null;
  const offset = isPending ? 0 : c - (c * Math.min(100, Math.max(0, score))) / 100;

  const strokeColor =
    riskLevel === "HIGH"
      ? "#EF4444"
      : riskLevel === "MEDIUM"
      ? "#F59E0B"
      : riskLevel === "LOW"
      ? "#10B981"
      : "#3B82F6";

  return (
    <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 32 32">
        {/* Background Track */}
        <circle
          cx="16"
          cy="16"
          r={r}
          className="stroke-slate-200"
          strokeWidth="3"
          fill="transparent"
        />
        {isPending ? (
          <circle
            cx="16"
            cy="16"
            r={r}
            stroke="#3B82F6"
            strokeWidth="3"
            strokeDasharray="6 4"
            fill="transparent"
            className="animate-spin-slow opacity-60"
            strokeLinecap="round"
          />
        ) : (
          <circle
            cx="16"
            cy="16"
            r={r}
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500 ease-out"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold text-[#0F172A]">
        {score !== null ? (
          <span>{score}</span>
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        )}
      </div>
    </div>
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
    sublabel: string;
    description: string;
    icon: React.ElementType;
    score: number | null;
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | null;
    interpretation: string;
    note?: string;
  }[] = [
    {
      id: "voice-integrity",
      label: "Voice Clone & Deepfake Check",
      sublabel: "Acoustic Phase & Vocoder Forensics (Wav2Vec2)",
      description: "Screens spectral anomalies and synthetic speech vocoder artifacts",
      icon: AudioWaveform,
      score: spoof ? Math.round(spoof.spoofProbability * 100) : null,
      riskLevel: spoof
        ? spoof.spoofProbability >= 0.7 ? "HIGH"
          : spoof.spoofProbability >= 0.4 ? "MEDIUM"
          : "LOW"
        : null,
      interpretation: spoof
        ? spoof.spoofProbability >= 0.7
          ? "Strong synthetic speech markers detected — high probability of AI voice clone."
          : spoof.spoofProbability >= 0.4
          ? "Moderate acoustic anomalies detected — review with caution."
          : "Natural human voice frequencies detected. No deepfake clone markers."
        : "Awaiting audio window...",
      note: spoof?.indicators.length
        ? `Indicators: ${spoof.indicators.slice(0, 2).join(", ")}`
        : undefined,
    },
    {
      id: "speaker-consistency",
      label: "Caller Biometric Match",
      sublabel: "Voiceprint Embedding Verification (ECAPA-TDNN)",
      description: "Matches speaker biometric embedding against enrolled trusted profile",
      icon: Fingerprint,
      score: speaker && speaker.status === "AVAILABLE"
        ? Math.round(speaker.similarityScore * 100)
        : null,
      riskLevel: speaker && speaker.status === "AVAILABLE"
        ? speaker.similarityScore < 0.5 ? "HIGH"
          : speaker.similarityScore < 0.75 ? "MEDIUM"
          : "LOW"
        : null,
      interpretation: !speaker
        ? "Awaiting audio window..."
        : speaker.status !== "AVAILABLE"
        ? "No reference voiceprint on file for this caller."
        : speaker.similarityScore < 0.5
        ? "Low voice similarity to reference profile — possible impersonator."
        : speaker.similarityScore < 0.75
        ? "Moderate voice similarity. Secondary challenge recommended."
        : "Voiceprint positively matches stored reference profile.",
      note: speaker && speaker.status !== "AVAILABLE" && speaker.status !== "NO_REFERENCE"
        ? `Status: ${speaker.status}`
        : undefined,
    },
    {
      id: "social-engineering",
      label: "Scam & Coercion Intent",
      sublabel: "Conversational Urgency & Pressure (NLP)",
      description: "Monitors transcript for high-pressure financial demands and coercion",
      icon: ShieldAlert,
      score: socialEngineering ? Math.round(socialEngineering.urgencyScore) : null,
      riskLevel: socialEngineering
        ? socialEngineering.urgencyScore >= 60 ? "HIGH"
          : socialEngineering.urgencyScore >= 30 ? "MEDIUM"
          : "LOW"
        : null,
      interpretation: socialEngineering
        ? socialEngineering.coercionDetected || socialEngineering.financialRequestDetected
          ? "High pressure or urgent transfer demands detected in conversation."
          : socialEngineering.urgencyScore >= 30
          ? "Elevated urgency cues detected in speech."
          : "Normal conversational tone. No aggressive pressure tactics detected."
        : "Awaiting speech transcript...",
    },
    {
      id: "context-risk",
      label: "Call Routing & Timing",
      sublabel: "Call Environment Context & Line Integrity",
      description: "Checks unusual line origin, VoIP forwarding, and off-hours timestamps",
      icon: Compass,
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
        ? "Awaiting session context..."
        : "Line routing and call timestamp within normal parameters.",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#0F172A] tracking-tight font-sans">
            AI Risk Signals &amp; Multi-Factor Analysis
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5 font-sans">
            Continuous multi-modal screening by the Risk Fusion Engine
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          4 CORE VECTORS
        </span>
      </div>

      {/* Signal Cards */}
      <div className="space-y-4 p-6">
        {rows.map((row) => {
          const riskStyles = row.riskLevel ? getRiskColorClasses(row.riskLevel) : null;
          const Icon = row.icon;
          const isPending = row.score === null;

          // Colored left accent border based on status
          const leftBorderClass =
            row.riskLevel === "HIGH"
              ? "border-l-4 border-l-red-500"
              : row.riskLevel === "MEDIUM"
              ? "border-l-4 border-l-amber-500"
              : row.riskLevel === "LOW"
              ? "border-l-4 border-l-emerald-500"
              : "border-l-4 border-l-blue-500";

          return (
            <div
              key={row.id}
              className={`p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 ${leftBorderClass} space-y-3 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md transition-all duration-150`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-[#0F172A] tracking-tight block font-sans truncate">
                      {row.label}
                    </span>
                    <span className="text-[11px] text-[#64748B] block truncate font-sans">
                      {row.sublabel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                  {row.riskLevel && riskStyles ? (
                    <Badge variant={row.riskLevel} className="text-[10px] font-bold px-2.5 py-0.5">
                      {row.riskLevel}
                    </Badge>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 text-[#64748B]">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      PENDING
                    </span>
                  )}

                  {/* 32px Mini Progress Ring */}
                  <MiniProgressRing score={row.score} riskLevel={row.riskLevel} />
                </div>
              </div>

              {/* Progress Bar with fill when active */}
              {row.score !== null ? (
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${riskStyles?.bg ?? "bg-blue-600"} transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(4, row.score))}%` }}
                  />
                </div>
              ) : null}

              {/* Interpretation or Skeleton */}
              {isPending ? (
                <div className="flex items-center gap-2 pt-0.5">
                  <div className="h-2 w-48 rounded-full bg-slate-200 animate-pulse" />
                  <span className="text-[10px] font-mono text-[#64748B]">ANALYSIS_PENDING</span>
                </div>
              ) : (
                <p className="text-xs text-[#475569] font-sans leading-relaxed">
                  {row.interpretation}
                </p>
              )}

              {row.note && (
                <p className="text-[10px] text-blue-700 font-mono leading-tight bg-blue-50 px-2 py-1 rounded border border-blue-200 w-fit">
                  {row.note}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// REST RiskSignal[] view (when analysisState not yet available)
// ---------------------------------------------------------------------------

function SignalsList({ signals }: { signals: RiskSignal[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-6 pb-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] font-sans">
          DETECTION ASSESSMENT (RISK FUSION ENGINE)
        </h3>
        <span className="text-[10px] font-mono font-semibold text-[#64748B]">
          {signals.length} Fused Vector{signals.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="space-y-3.5 p-6">
        {signals.map((sig, idx) => {
          const leftBorderClass =
            sig.risk_level === "HIGH"
              ? "border-l-4 border-l-red-500"
              : sig.risk_level === "MEDIUM"
              ? "border-l-4 border-l-amber-500"
              : "border-l-4 border-l-emerald-500";

          return (
            <div
              key={sig.signal_id || `sig-${idx}`}
              className={`p-4 rounded-xl bg-slate-50 border border-slate-200 ${leftBorderClass} space-y-2 hover:-translate-y-0.5 transition-all duration-150`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#0F172A] font-sans">{sig.label}</span>
                  {sig.confidence_label && (
                    <span className="text-[9px] font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                      {sig.confidence_label}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={sig.risk_level} className="text-[10px] font-bold px-2.5 py-0.5">
                    {sig.risk_level}
                  </Badge>
                  <MiniProgressRing score={sig.raw_score} riskLevel={sig.risk_level} />
                </div>
              </div>
              <p className="text-[11px] text-[#64748B] font-sans">{sig.description}</p>
              <p className="text-xs text-slate-700 font-mono">&quot;{sig.explanation}&quot;</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

