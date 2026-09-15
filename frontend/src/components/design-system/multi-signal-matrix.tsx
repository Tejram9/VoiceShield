"use client";

import React, { useState } from "react";
import {
  Mic,
  Fingerprint,
  MessageSquareWarning,
  Server,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SignalStatus {
  id: "voice-authenticity" | "speaker-consistency" | "conversation-risk" | "context-risk";
  name: string;
  categoryTag: string;
  statusText: string;
  severity: "LOW" | "ELEVATED" | "HIGH" | "CRITICAL" | "ANALYZING" | "UNKNOWN";
  score: number; // 0 - 100
  confidenceLabel: string;
  summary: string;
  whatWasDetected: string;
  whyItMatters: string;
  decisionImpact: string;
  technicalDetails: string[];
}

interface MultiSignalMatrixProps {
  signals?: SignalStatus[];
  activeSignalId?: string | null;
  onInspectSignal?: (signalId: string) => void;
  className?: string;
}

export const DEFAULT_SIGNALS: SignalStatus[] = [
  {
    id: "voice-authenticity",
    name: "Voice Authenticity",
    categoryTag: "ACOUSTIC INTEGRITY",
    statusText: "Neural Vocoder Glitch Detected",
    severity: "CRITICAL",
    score: 94,
    confidenceLabel: "High Confidence (94%)",
    summary: "Synthetic speech artifacts and phase discontinuities characteristic of neural voice synthesis.",
    whatWasDetected: "Acoustic phase jitter at 1.24 kHz, frame rate quantization typical of HiFi-GAN neural vocoders, and unnatural pitch transitions.",
    whyItMatters: "Even if a voice resembles an executive, synthetic speech models produce spectral micro-anomalies that natural human vocal tracts physically cannot generate.",
    decisionImpact: "Elevated risk score by +45 points. Primary trigger for Impersonation Attack classification.",
    technicalDetails: [
      "Model: AASIST / Wav2Vec2 Synthetic Classifier",
      "Phase discontinuity index: 0.88 (threshold: 0.25)",
      "Vocal tract spectral resonance variance: non-biological",
    ],
  },
  {
    id: "speaker-consistency",
    name: "Speaker Consistency",
    categoryTag: "BIOMETRIC VERIFICATION",
    statusText: "Biometric Divergence from Enrolled Voiceprint",
    severity: "CRITICAL",
    score: 88,
    confidenceLabel: "Cosine Similarity 0.42",
    summary: "Acoustic embeddings deviate significantly from the enrolled reference voiceprint in the Trusted Vault.",
    whatWasDetected: "Cosine distance of 0.42 between current live speech chunks and Rahul Sharma's 192-dimensional reference embedding (acceptance threshold >= 0.75).",
    whyItMatters: "The caller claims to be Rahul Sharma, but their biometric acoustic fingerprint does not match Rahul Sharma's authenticated voice signature.",
    decisionImpact: "Elevated risk score by +35 points. Demands immediate independent identity challenge.",
    technicalDetails: [
      "Model: SpeechBrain ECAPA-TDNN (192-dim x-vector)",
      "Reference sample: 30.0s clean calibration (enrolled 2026-01-15)",
      "Biometric deviation score: 88/100",
    ],
  },
  {
    id: "conversation-risk",
    name: "Conversation Risk",
    categoryTag: "SEMANTIC & NLP INTENT",
    statusText: "Urgent Wire Directive & Authorization Bypass",
    severity: "CRITICAL",
    score: 85,
    confidenceLabel: "Intent Model Flagged",
    summary: "Caller applied psychological urgency and requested unauthorized bypass of standard financial dual-custody.",
    whatWasDetected: "Detected intent patterns: [FINANCIAL_REQUEST: $45,000], [URGENCY: 5 PM deadline], [AUTH_BYPASS: skip safe words].",
    whyItMatters: "Social engineering tactics frequently utilize artificial urgency to force victims to abandon dual-authorization protocols before verification can take place.",
    decisionImpact: "Elevated risk score by +20 points. Auto-triggered Treasury Wire Lock policy POL-204.",
    technicalDetails: [
      "ASR: faster-whisper (CTranslate2 Int8)",
      "NLP Classifier: RoBERTa Social Engineering Intent Engine",
      "Key phrase matched: 'Bypass the dual authorization'",
    ],
  },
  {
    id: "context-risk",
    name: "Caller & Context Risk",
    categoryTag: "TELEPHONY METADATA",
    statusText: "Unattested VoIP Gateway Routing",
    severity: "ELEVATED",
    score: 48,
    confidenceLabel: "STIR/SHAKEN: C-Attestation",
    summary: "Call originated from an unverified VoIP trunk with mismatched carrier geolocation.",
    whatWasDetected: "Inbound SIP trunk NY-04 with STIR/SHAKEN Level C (unattested). Carrier IP indicates transit node mismatch with executive's expected location.",
    whyItMatters: "Spoofed Caller ID (CLI) is trivially easy to forge over SIP trunks. Metadata confirms number display is untrustworthy.",
    decisionImpact: "Added +10 baseline uncertainty weight to composite risk calculation.",
    technicalDetails: [
      "SIP Carrier: Wholesale Gateway NY-04",
      "STIR/SHAKEN Verification: Level C (Gateway unattested)",
      "Caller ID Header: +1 (555) 234-8901 (Potential CLI Spoof)",
    ],
  },
];

export function MultiSignalMatrix({
  signals = DEFAULT_SIGNALS,
  activeSignalId,
  onInspectSignal,
  className,
}: MultiSignalMatrixProps) {
  const [internalExpandedId, setInternalExpandedId] = useState<string | null>("voice-authenticity");
  const expandedSignalId = activeSignalId !== undefined ? activeSignalId : internalExpandedId;

  const handleToggleExpand = (id: string) => {
    const next = expandedSignalId === id ? null : id;
    setInternalExpandedId(next);
    if (next) {
      onInspectSignal?.(next);
    }
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

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-rose-400 bg-rose-950/40 border border-rose-500/40 px-2 py-0.5 rounded">
            <AlertOctagon className="w-3 h-3" /> CRITICAL
          </span>
        );
      case "HIGH":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-orange-400 bg-orange-950/40 border border-orange-500/40 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3" /> HIGH
          </span>
        );
      case "ELEVATED":
      case "MEDIUM":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3" /> ELEVATED
          </span>
        );
      case "LOW":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3" /> LOW
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-soc-400 bg-soc-850 px-2 py-0.5 rounded">
            <HelpCircle className="w-3 h-3" /> PENDING
          </span>
        );
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Informative distinction banner explaining Authenticity vs Consistency */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-soc-850/80 border border-soc-700/80 text-xs font-mono text-soc-300">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-soc-100 font-semibold">Important Security Principle: </strong>
          <span>
            Voice Similarity and Voice Authenticity are conceptually distinct. A synthetic voice clone can closely match a trusted person&apos;s speech tone while still exhibiting neural vocoder glitches.
          </span>
        </div>
      </div>

      {/* 4 Signals Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {signals.map((sig) => {
          const Icon = getSignalIcon(sig.id);
          const isExpanded = expandedSignalId === sig.id;
          const isCritical = sig.severity === "CRITICAL";
          const isHigh = sig.severity === "HIGH";

          return (
            <div
              key={sig.id}
              className={cn(
                "rounded-xl border p-4 transition-all flex flex-col justify-between cursor-pointer",
                isExpanded
                  ? "bg-soc-800 border-soc-600 shadow-md ring-1 ring-soc-600"
                  : "bg-soc-800/80 border-soc-700 hover:border-soc-650 hover:bg-soc-800"
              )}
              onClick={() => handleToggleExpand(sig.id)}
            >
              <div className="space-y-2.5">
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "p-1.5 rounded-lg border",
                        isCritical
                          ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                          : isHigh
                          ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                          : "bg-soc-750 border-soc-700 text-soc-300"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-mono text-white tracking-tight">
                        {sig.name}
                      </h4>
                      <span className="text-[10px] font-mono text-soc-500 block uppercase">
                        {sig.categoryTag}
                      </span>
                    </div>
                  </div>
                  {getSeverityBadge(sig.severity)}
                </div>

                {/* Status snippet */}
                <p className="text-xs text-soc-200 font-medium line-clamp-2 leading-relaxed">
                  {sig.statusText}
                </p>
              </div>

              {/* Footer details trigger */}
              <div className="pt-3 border-t border-soc-700/60 mt-3 flex items-center justify-between text-[11px] font-mono text-soc-400">
                <span>{sig.confidenceLabel}</span>
                <span className="inline-flex items-center gap-1 text-soc-300 hover:text-white">
                  {isExpanded ? "Close" : "Inspect"}
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Signal Deep Evidence Drawer (Progressive Disclosure) */}
      {expandedSignalId && (
        <div className="p-5 rounded-xl bg-soc-800 border border-soc-650 shadow-panel space-y-4 animate-in fade-in duration-150">
          {(() => {
            const activeSig = signals.find((s) => s.id === expandedSignalId);
            if (!activeSig) return null;

            return (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-soc-700 gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-soc-400 font-bold">
                      SIGNAL EVIDENCE AUDIT
                    </span>
                    <h3 className="text-base font-bold font-mono text-white">
                      {activeSig.name} — Detailed Diagnostic Rationale
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(activeSig.severity)}
                    <span className="text-xs font-mono font-bold text-soc-200 bg-soc-850 px-2 py-1 rounded border border-soc-700">
                      Impact Weight: {activeSig.score}/100
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-3.5 rounded-lg bg-soc-850 border border-soc-700/80 space-y-1">
                    <span className="text-[10px] uppercase text-soc-400 font-bold block">1. What Was Detected?</span>
                    <p className="text-soc-200 leading-relaxed">{activeSig.whatWasDetected}</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-soc-850 border border-soc-700/80 space-y-1">
                    <span className="text-[10px] uppercase text-soc-400 font-bold block">2. Why It Matters?</span>
                    <p className="text-soc-200 leading-relaxed">{activeSig.whyItMatters}</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-soc-850 border border-soc-700/80 space-y-1">
                    <span className="text-[10px] uppercase text-soc-400 font-bold block">3. Decision Impact</span>
                    <p className="text-soc-200 leading-relaxed">{activeSig.decisionImpact}</p>
                  </div>
                </div>

                {/* Technical Diagnostics */}
                {activeSig.technicalDetails && activeSig.technicalDetails.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-soc-400 block mb-1.5">
                      Model Pipeline Diagnostics
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeSig.technicalDetails.map((td, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded bg-soc-850 border border-soc-700 text-[11px] font-mono text-soc-300"
                        >
                          {td}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
