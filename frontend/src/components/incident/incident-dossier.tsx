"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import {
  ShieldAlert,
  AlertTriangle,
  FileText,
  User,
  Download,
  Share2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lock,
  PhoneOff,
  Shield,
  Copy,
  Check,
} from "lucide-react";

export interface IncidentDossierProps {
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
  incidentId?: string;
  callerName?: string;
  callerRole?: string;
  callerPhone?: string;
  transferAmount?: string;
  className?: string;
}

export function IncidentDossier({
  activeTab = "reports",
  onNavigateTab,
  incidentId = "INC-2026-0042",
  callerName = "Rahul Sharma",
  callerRole = "Chief Financial Officer",
  callerPhone = "+91 98765 43210",
  transferAmount = "$45,000",
  className,
}: IncidentDossierProps) {
  // Collapsible technical / forensic disclosure states
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [activeEvidenceTab, setActiveEvidenceTab] = useState<"biometrics" | "transcript" | "telephony">("biometrics");

  const handleCopyId = () => {
    navigator.clipboard?.writeText(incidentId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className={cn("flex min-h-screen bg-slate-50 text-slate-900 antialiased font-sans", className)}>
      {/* 1. Left Executive Dark Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onNavigateTab}
        hasActiveThreat={false}
      />

      {/* 2. Main Workspace Canvas */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-7 gap-5 overflow-y-auto max-w-[1720px] mx-auto w-full">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Security Incident Dossier
            </h1>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-rose-50 text-rose-700 border-rose-200">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
                <span>CRITICAL SEVERITY</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                <span>CONTAINED</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Incident Reference Pill */}
            <button
              type="button"
              onClick={handleCopyId}
              className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-slate-200 text-xs font-mono text-slate-700 hover:bg-slate-50 transition-colors"
              title="Copy Incident ID"
            >
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold">{incidentId}</span>
              {copiedId ? (
                <Check className="h-3 w-3 text-emerald-600" />
              ) : (
                <Copy className="h-3 w-3 text-slate-400" />
              )}
            </button>

            {/* Officer In Charge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 hidden sm:flex">
              <div className="h-7 w-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-semibold text-xs">
                <User className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  Security Officer
                </span>
                <span className="text-2xs text-slate-400 leading-tight">
                  SIH SOC Operations
                </span>
              </div>
            </div>

            {/* Back to Live Call Navigation */}
            <button
              type="button"
              onClick={() => onNavigateTab?.("live-protection")}
              className="py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              Live Protection
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CASE FLOW STEPPER: INCIDENT → WHAT HAPPENED → WHY SERIOUS → EVIDENCE → ACTION → NEXT */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/70 rounded-xl px-4 sm:px-6 py-3 flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <div className="flex items-center gap-2 sm:gap-3 flex-nowrap font-medium text-slate-600">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold whitespace-nowrap">
              <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xs font-bold">
                ✓
              </span>
              <span>INCIDENT CREATED</span>
            </div>

            <span className="text-slate-300">→</span>

            <div className="flex items-center gap-1.5 text-emerald-700 font-bold whitespace-nowrap">
              <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xs font-bold">
                ✓
              </span>
              <span>WHAT HAPPENED</span>
            </div>

            <span className="text-slate-300">→</span>

            <div className="flex items-center gap-1.5 text-emerald-700 font-bold whitespace-nowrap">
              <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xs font-bold">
                ✓
              </span>
              <span>WHY SERIOUS</span>
            </div>

            <span className="text-slate-300">→</span>

            <div className="flex items-center gap-1.5 text-emerald-700 font-bold whitespace-nowrap">
              <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xs font-bold">
                ✓
              </span>
              <span>EVIDENCE</span>
            </div>

            <span className="text-slate-300">→</span>

            <div className="flex items-center gap-1.5 text-emerald-700 font-bold whitespace-nowrap">
              <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xs font-bold">
                ✓
              </span>
              <span>ACTION TAKEN</span>
            </div>

            <span className="text-slate-300">→</span>

            <div className="flex items-center gap-1.5 text-blue-700 font-bold whitespace-nowrap">
              <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xs font-bold">
                6
              </span>
              <span>NEXT STEPS</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-2xs text-slate-400 font-medium hidden md:inline">
              Case Status: Closed / Enforced
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2-COLUMN CASE FILE LAYOUT */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT COLUMN: CASE PARTICULARS & SUBJECT CONTEXT */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Case Particulars Card */}
            <div className="bg-white border border-slate-200/70 rounded-xl p-5 flex flex-col gap-4 text-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                  CASE PARTICULARS
                </span>
                <span className="text-2xs font-mono text-slate-400">
                  Ref: {incidentId}
                </span>
              </div>

              {/* Claimed vs Real Identity */}
              <div className="flex items-start gap-3 pt-1">
                <div className="h-11 w-11 rounded-full bg-rose-100 text-rose-700 font-bold text-sm flex items-center justify-center shrink-0 border border-rose-200">
                  RS
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      {callerName}
                    </h3>
                    <span className="px-1.5 py-0.2 rounded text-3xs font-semibold bg-rose-100 text-rose-800">
                      IMPERSONATED
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {callerRole}
                  </span>
                  <div className="text-xs font-mono text-slate-600 mt-1">
                    Caller ID: {callerPhone}
                  </div>
                </div>
              </div>

              {/* Intercepted Sensitive Action */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                  TARGETED SENSITIVE ACTION
                </span>
                <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>{`Emergency Wire Transfer: ${transferAmount} USD`}</span>
                  </div>
                  <p className="text-2xs text-amber-800 leading-relaxed">
                    Target account: Zurich Escrow Trust Ltd. Caller demanded immediate disbursement without standard 24-hour dual-approval oversight.
                  </p>
                  <div className="pt-1 flex items-center gap-1.5 text-2xs font-medium text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{`Direct loss prevented: ${transferAmount} USD`}</span>
                  </div>
                </div>
              </div>

              {/* Threat Classification */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                  THREAT CLASSIFICATION
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Attack Vector</span>
                    <span className="font-semibold text-slate-800">AI Voice Clone (Deepfake)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Social Engineering</span>
                    <span className="font-semibold text-slate-800">Urgency & Executive Coercion</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Telephony Routing</span>
                    <span className="font-semibold text-slate-800">Unverified SIP Trunk Spoofing</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Compliance Directive</span>
                    <span className="font-semibold text-slate-800">Policy 4.1 Enforced</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => onNavigateTab?.("verification")}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors text-center"
                >
                  View Verification Protocol Record
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.("live-protection")}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors text-center"
                >
                  Return to Live Monitoring
                </button>
              </div>
            </div>

            {/* Chain of Custody & Compliance Box */}
            <div className="bg-white border border-slate-200/70 rounded-xl p-5 flex flex-col gap-3 text-slate-800">
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                CHAIN OF CUSTODY
              </span>
              <div className="space-y-2 text-2xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-700">Audio Digest: </span>
                  <span className="font-mono text-3xs text-slate-500">sha256:7f83b1657ff1...440c</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Triage Operator: </span>
                  <span>Officer Vikram Sen (SIH-ID #8812)</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Enforcement Node: </span>
                  <span>VoiceShield Core Edge Mumbai-01</span>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* MAIN COLUMN: CASE FILE NARRATIVE, EVIDENCE & ACTIONS */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* =================================================================== */}
            {/* 1. WHAT HAPPENED & 2. WHY IS IT SERIOUS (HUMAN-READABLE SUMMARY) */}
            {/* =================================================================== */}
            <div className="bg-white border border-slate-200/70 rounded-xl p-6 flex flex-col gap-5 text-slate-800">
              <div className="flex flex-col gap-1.5">
                <span className="text-2xs font-semibold uppercase tracking-wider text-blue-600">
                  EXECUTIVE INCIDENT SUMMARY
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  What Happened?
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  On September 18, 2026, an inbound voice call spoofing the caller ID of Chief Financial Officer <span className="font-semibold text-slate-900">{callerName}</span> (+91 98765 43210) was routed to the treasury operations desk. The caller requested an immediate, off-ledger wire transfer of <span className="font-semibold text-slate-900">{transferAmount} USD</span> to an overseas escrow account, claiming standard dual-approval procedures had to be bypassed due to an emergency acquisition deadline.
                </p>
              </div>

              {/* Why is it serious */}
              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                  <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>Why is this incident serious?</span>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed">
                  This attack was not a crude phishing call. The perpetrator utilized an advanced AI voice cloning model (diffusion vocoder) conditioned on public keynote addresses by {callerName}. Concurrently, the caller applied sophisticated psychological coercion—demanding secrecy and rapid execution to prevent the treasury officer from consulting colleagues. Without automated acoustic and conversational detection, {transferAmount} USD would have been irreversibly lost.
                </p>
              </div>
            </div>

            {/* =================================================================== */}
            {/* 3. SECURITY TIMELINE (CHRONOLOGICAL CHAIN OF EVENTS) */}
            {/* =================================================================== */}
            <div className="bg-white border border-slate-200/70 rounded-xl p-6 flex flex-col gap-4 text-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                    CHRONOLOGY
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Security Incident Timeline
                  </h3>
                </div>
                <span className="text-2xs text-slate-400">Call Duration: 02:45</span>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {/* Event 1 */}
                <div className="relative flex items-start gap-3">
                  <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-slate-300 ring-4 ring-white" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-mono font-bold text-slate-600">00:00</span>
                      <span className="text-xs font-bold text-slate-800">Inbound Call Ingested</span>
                    </div>
                    <p className="text-2xs text-slate-500 leading-normal">
                      Inbound trunk connection accepted. Caller ID presented as Rahul Sharma (+91 98765 43210).
                    </p>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="relative flex items-start gap-3">
                  <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-amber-400 ring-4 ring-white" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-mono font-bold text-amber-700">00:45</span>
                      <span className="text-xs font-bold text-amber-900">Urgency Language Flagged</span>
                    </div>
                    <p className="text-2xs text-slate-600 leading-normal">
                      Natural language processor identified high-pressure coercion phrasing: &ldquo;Needs to be wired immediately before the market closes.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="relative flex items-start gap-3">
                  <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-rose-500 ring-4 ring-white" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-mono font-bold text-rose-700">01:15</span>
                      <span className="text-xs font-bold text-rose-900">Acoustic Biometric Divergence Detected</span>
                    </div>
                    <p className="text-2xs text-slate-600 leading-normal">
                      Acoustic embedding distance diverged from reference profile (cosine distance 0.54 vs. expected &ge; 0.75). Neural vocoder phase inconsistencies logged.
                    </p>
                  </div>
                </div>

                {/* Event 4 */}
                <div className="relative flex items-start gap-3">
                  <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-blue-500 ring-4 ring-white" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-mono font-bold text-blue-700">02:10</span>
                      <span className="text-xs font-bold text-blue-900">Independent Verification Protocol Initiated</span>
                    </div>
                    <p className="text-2xs text-slate-600 leading-normal">
                      Security officer launched out-of-band cellular callback protocol to verified executive cellular line.
                    </p>
                  </div>
                </div>

                {/* Event 5 */}
                <div className="relative flex items-start gap-3">
                  <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-mono font-bold text-emerald-700">02:30</span>
                      <span className="text-xs font-bold text-emerald-900">Attack Confirmed & Containment Triggered</span>
                    </div>
                    <p className="text-2xs text-slate-600 leading-normal">
                      Legitimate CFO Rahul Sharma reached on cellular phone confirmed he was boarding a commercial flight and placed no call. Wire transfer automatically frozen.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================================== */}
            {/* 4. WHAT EVIDENCE EXISTS? (TABBED EVIDENCE PACKAGES) */}
            {/* =================================================================== */}
            <div className="bg-white border border-slate-200/70 rounded-xl p-6 flex flex-col gap-4 text-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                    FORENSIC ARTIFACTS
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    What Evidence Exists?
                  </h3>
                </div>
                <span className="text-2xs text-slate-500 font-medium">3 Evidence Packages Attached</span>
              </div>

              {/* Evidence Tab Selectors */}
              <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveEvidenceTab("biometrics")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    activeEvidenceTab === "biometrics"
                      ? "bg-slate-900 text-white font-semibold"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  Evidence A: Acoustic Biometrics
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEvidenceTab("transcript")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    activeEvidenceTab === "transcript"
                      ? "bg-slate-900 text-white font-semibold"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  Evidence B: Coercive Transcript
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEvidenceTab("telephony")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    activeEvidenceTab === "telephony"
                      ? "bg-slate-900 text-white font-semibold"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  Evidence C: Telephony & Trunk
                </button>
              </div>

              {/* Evidence Content Area */}
              {activeEvidenceTab === "biometrics" && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Neural Vocoder & Biometric Analysis</span>
                    <span className="font-mono text-2xs text-rose-600 font-semibold">MISMATCH CONFIRMED</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    VoiceShield voiceprint extractor evaluated the speaker against the enrolled 512-dimensional ECAPA-TDNN reference vector of Rahul Sharma. The resulting cosine distance of 0.54 falls substantially below the enterprise authenticity threshold (0.75).
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="text-3xs font-semibold text-slate-400 uppercase">Cosine Similarity</span>
                      <div className="text-base font-mono font-bold text-rose-600">0.54</div>
                      <span className="text-3xs text-slate-500">Threshold: &ge; 0.75</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="text-3xs font-semibold text-slate-400 uppercase">Synthetic Probability</span>
                      <div className="text-base font-mono font-bold text-rose-600">92.4%</div>
                      <span className="text-3xs text-slate-500">Diffusion phase artifacts</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="text-3xs font-semibold text-slate-400 uppercase">Acoustic Confidence</span>
                      <div className="text-base font-mono font-bold text-slate-800">High (98%)</div>
                      <span className="text-3xs text-slate-500">Signal-to-Noise: 28 dB</span>
                    </div>
                  </div>
                </div>
              )}

              {activeEvidenceTab === "transcript" && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Spoken Dialogue Excerpt with Semantic Tags</span>
                    <span className="font-mono text-2xs text-amber-600 font-semibold">COERCION PATTERNS</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-700 leading-relaxed space-y-2">
                    <div>
                      <span className="text-slate-400">[00:48] Caller: </span>
                      <span>&ldquo;Listen, this is Rahul. I am between board meetings and we have a closing deadline with Zurich Escrow.</span>
                      <span className="ml-2 px-1.5 py-0.5 rounded text-3xs font-sans font-semibold bg-amber-100 text-amber-800">
                        URGENCY
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">[01:02] Caller: </span>
                      <span>I need you to wire the forty-five thousand dollars immediately without filing the 24-hour dual-sign notice. I will sign off retroactively.&rdquo;</span>
                      <span className="ml-2 px-1.5 py-0.5 rounded text-3xs font-sans font-semibold bg-rose-100 text-rose-800">
                        POLICY BYPASS DEMAND
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">[01:25] Caller: </span>
                      <span>&ldquo;Do not bother the comptroller about this; this is confidential M&amp;A business.&rdquo;</span>
                      <span className="ml-2 px-1.5 py-0.5 rounded text-3xs font-sans font-semibold bg-purple-100 text-purple-800">
                        ISOLATION TACTIC
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeEvidenceTab === "telephony" && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">SIP Trunk & Origin Telephony Headers</span>
                    <span className="font-mono text-2xs text-slate-600 font-semibold">SPOOFED CARRIER</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                      <span className="text-3xs font-semibold text-slate-400 uppercase">STIR/SHAKEN Attestation</span>
                      <div className="font-bold text-amber-700">Level C (Gateway Unverified)</div>
                      <p className="text-2xs text-slate-500">Carrier was unable to verify the signing party owns +91 98765 43210.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                      <span className="text-3xs font-semibold text-slate-400 uppercase">Ingress Gateway IP</span>
                      <div className="font-mono font-bold text-slate-800">198.51.100.84 (Unknown ASN)</div>
                      <p className="text-2xs text-slate-500">Trunk origin geographically inconsistent with Mumbai corporate offices.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* =================================================================== */}
            {/* 5. WHAT ACTION WAS TAKEN? (CONTAINMENT & POLICY ENFORCEMENT) */}
            {/* =================================================================== */}
            <div className="bg-white border border-slate-200/70 rounded-xl p-6 flex flex-col gap-4 text-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                    REMEDIATION
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    What Action Was Taken?
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Fully Enforced</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <Lock className="h-4 w-4 text-emerald-600" />
                    <span>1. Wire Transfer Frozen</span>
                  </div>
                  <p className="text-2xs text-emerald-800 leading-normal">
                    Automated webhook engaged banking gateway API; disbursement paused under Corporate Fraud Policy 4.1.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <PhoneOff className="h-4 w-4 text-slate-600" />
                    <span>2. Call Terminated</span>
                  </div>
                  <p className="text-2xs text-slate-600 leading-normal">
                    Inbound SIP connection severed gracefully; attacker audio feed captured for forensic archive.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Shield className="h-4 w-4 text-slate-600" />
                    <span>3. Ingress Blacklisted</span>
                  </div>
                  <p className="text-2xs text-slate-600 leading-normal">
                    SIP gateway IP 198.51.100.84 propagated to enterprise firewall blocklist across all regional branches.
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================================== */}
            {/* 6. CURRENT STATUS & WHAT SHOULD HAPPEN NEXT? */}
            {/* =================================================================== */}
            <div className="bg-white border border-slate-200/70 rounded-xl p-6 flex flex-col gap-5 text-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                    INCIDENT RESOLUTION
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Current Status & What Should Happen Next?
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                    STATUS: CONTAINED
                  </span>
                </div>
              </div>

              {/* Recommended Next Actions List */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-3">
                <span className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
                  RECOMMENDED NEXT ACTIONS:
                </span>
                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xs font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">Notify Executive Protection Desk</span>
                      <p className="text-2xs text-slate-500">
                        Alert Rahul Sharma and executive security regarding active synthetic voice cloning and spoofing targeting his identity.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xs font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">File Formal SOC Triage Report</span>
                      <p className="text-2xs text-slate-500">
                        Escalate evidence package to internal compliance and financial fraud investigation unit.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xs font-bold shrink-0 mt-0.5">
                      3
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">Export Cryptographically Signed Audit Bundle</span>
                      <p className="text-2xs text-slate-500">
                        Download forensic package for carrier fraud notification and law enforcement reporting.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progressive Disclosure: Collapsible Technical Policy & Raw Data */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTechnicalDetails((v) => !v)}
                  className="flex items-center gap-1.5 text-2xs font-medium text-slate-500 hover:text-slate-800 transition-colors py-1"
                >
                  <Lock className="h-3 w-3 text-slate-400" />
                  <span>Technical & Forensic Audit Metadata</span>
                  {showTechnicalDetails ? (
                    <ChevronUp className="h-3 w-3 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  )}
                </button>

                {showTechnicalDetails && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-900 text-slate-200 text-2xs font-mono space-y-2 animate-in fade-in duration-100">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-slate-400">
                      <span>AUDIT SIGNATURE: ECDSA-P256-SHA256</span>
                      <span>NODE: MUM-CORE-01</span>
                    </div>
                    <div>Event ID: {incidentId}</div>
                    <div>Classification: DEEPFAKE_SYNTHETIC_VOICE_FRAUD</div>
                    <div>Acoustic Feature Extractor: ECAPA-TDNN (512-dim embedding)</div>
                    <div>Cosine Distance: 0.5412 (Normal reference baseline: &ge; 0.7500)</div>
                    <div>Policy Rule Trigger: FRAUD_PREVENTION_RULE_4.1</div>
                    <div>Gateway Session: SIP/2.0 TLS 1.3 / SRTP AES-GCM-256</div>
                    <div className="text-slate-400 pt-1 border-t border-slate-800">
                      Logged to SOC immutable ledger at 2026-09-18T15:32:10.842Z
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => alert(`Exporting incident ${incidentId} dossier package (PDF & JSON audit trail)...`)}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export Case Dossier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => alert(`Alert notification sent to Executive Protection Desk for ${callerName}.`)}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="h-3.5 w-3.5 text-slate-500" />
                    <span>Notify Security Desk</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab?.("live-protection")}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-center"
                >
                  Return to Live Protection &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
