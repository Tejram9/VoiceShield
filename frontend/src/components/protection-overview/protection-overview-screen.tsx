"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  ExternalLink,
  Lock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export interface ProtectionOverviewScreenProps {
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
  className?: string;
}

export function ProtectionOverviewScreen({
  activeTab = "overview",
  onNavigateTab,
  className,
}: ProtectionOverviewScreenProps) {
  const handleNavigate = (tab: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
      return;
    }
    if (typeof window !== "undefined") {
      if (tab === "live-protection") window.location.href = "/";
      else if (tab === "call-history") window.location.href = "/call-history";
      else if (tab === "verification") window.location.href = "/verification";
      else if (tab === "reports" || tab === "incident") window.location.href = "/reports";
      else if (tab === "settings") window.location.href = "/trusted-identity";
      else if (tab === "overview") window.location.href = "/overview";
    }
  };

  return (
    <div className={cn("flex min-h-screen bg-slate-50 text-slate-900 antialiased font-sans", className)}>
      {/* 1. Left Executive Dark Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleNavigate}
        hasActiveThreat={true}
      />

      {/* 2. Main Workspace Canvas */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-7 gap-5 overflow-y-auto max-w-[1720px] mx-auto w-full">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Protection Overview
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Protection Active · Real-time Defense Online</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              High-level posture of voice impersonation defenses, active threat interceptions, and recent security events.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Security Officer Profile */}
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

            {/* Quick Navigation to Live Protection */}
            <button
              type="button"
              onClick={() => handleNavigate("live-protection")}
              className="py-2 px-3.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
            >
              Live Protection Console &rarr;
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. PROTECTION STATUS: IS VOICESHIELD PROTECTING THE ENVIRONMENT? */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-bold uppercase tracking-wider text-emerald-700">
                    PROTECTION STATUS
                  </span>
                  <span className="text-2xs text-slate-300">·</span>
                  <span className="text-2xs font-medium text-slate-500">
                    All Enclaves Operational
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  VoiceShield Active Defense Is Protecting Enterprise Telephony
                </h2>
                <p className="text-xs text-slate-600 leading-normal max-w-3xl">
                  Inbound SIP trunks are screened in real-time through the neural deepfake detection pipeline. Acoustic harmonics, vocal tract biometric embeddings, and social engineering urgency models are actively monitoring incoming communications.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <span className="px-2.5 py-1 rounded-md text-2xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                Latency: 28ms Edge Inference
              </span>
            </div>
          </div>

          {/* Calm, Informative Protection Metrics (Secondary to security status) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col gap-1">
              <span className="text-3xs font-semibold uppercase tracking-wider text-slate-400">
                Telephony Gateway Screening
              </span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">3/3 Trunks Active</span>
              </div>
              <span className="text-3xs text-slate-500">Mumbai, Zurich &amp; London PBX Gateways</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col gap-1">
              <span className="text-3xs font-semibold uppercase tracking-wider text-slate-400">
                Executive Voice Baselines
              </span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">4 Active Reference Profiles</span>
              </div>
              <span className="text-3xs text-slate-500">ECAPA-TDNN 512-dim Enrolled Enclave</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col gap-1">
              <span className="text-3xs font-semibold uppercase tracking-wider text-slate-400">
                Disbursement Policy
              </span>
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">Policy 4.1 Enforced</span>
              </div>
              <span className="text-3xs text-slate-500">Mandatory out-of-band hold on &gt; $10,000</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col gap-1">
              <span className="text-3xs font-semibold uppercase tracking-wider text-slate-400">
                Capital Losses Prevented
              </span>
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700">$45,000 USD Protected</span>
              </div>
              <span className="text-3xs text-slate-500">Zero unauthorized disbursements</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. ACTIVE THREATS: ARE THERE ACTIVE THREATS RIGHT NOW? */}
        {/* ========================================================================= */}
        <div className="bg-white border border-rose-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
                <span>1 ACTIVE INTERCEPTION UNDER CONTAINMENT</span>
              </span>
              <span className="text-2xs text-slate-400 hidden sm:inline">
                Detected 14 mins ago · Immediate Action Enforced
              </span>
            </div>
            <span className="text-2xs font-mono font-semibold text-rose-700">
              Case Ref: INC-2026-0042
            </span>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    Executive Impersonation Attempt: Claiming CFO Rahul Sharma
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-3xs font-semibold bg-rose-200/80 text-rose-800">
                    AI VOICE CLONE
                  </span>
                </div>
                <p className="text-xs text-rose-900 leading-normal">
                  Inbound trunk spoofing +91 98765 43210 demanded an emergency $45,000 wire transfer to Zurich Escrow Trust while exhibiting synthetic vocoder phase discontinuities and acoustic divergence (cosine distance 0.54 vs. expected &ge; 0.75).
                </p>
                <div className="flex items-center gap-2 text-2xs text-rose-700 pt-0.5">
                  <span className="font-semibold">Protective State:</span>
                  <span>Wire transfer frozen under Policy 4.1 · Attacker SIP trunk severed · Awaiting formal SOC sign-off.</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => handleNavigate("reports")}
                className="py-2 px-3.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
              >
                <span>Review Incident Dossier</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("verification")}
                className="py-2 px-3 rounded-lg bg-white border border-rose-200 text-rose-800 hover:bg-rose-50 text-xs font-medium transition-colors whitespace-nowrap"
              >
                View Verification Record
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2-COLUMN SPLIT: RECENT ACTIVITY (LEFT) vs INCIDENTS & INSIGHTS (RIGHT) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ----------------------------------------------------------------------- */}
          {/* 3. RECENT SECURITY ACTIVITY (WHAT HAPPENED RECENTLY?) */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Recent Security Activity
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavigate("call-history")}
                  className="text-2xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                >
                  <span>View All Call History</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {/* Chronological Activity Feed */}
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
                {/* Event 1 */}
                <div className="relative flex items-start gap-3">
                  <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-rose-500 ring-4 ring-white" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-mono font-bold text-slate-600">15:32</span>
                      <span className="font-bold text-slate-900">Wire Disbursement Frozen ($45,000 USD)</span>
                    </div>
                    <p className="text-2xs text-slate-600 leading-normal">
                      Automated webhook engaged banking gateway API under Policy 4.1 after cellular callback challenge failed.
                    </p>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="relative flex items-start gap-3">
                  <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-rose-500 ring-4 ring-white" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-mono font-bold text-slate-600">15:30</span>
                      <span className="font-bold text-slate-900">Acoustic Divergence Detected on Inbound Trunk 04</span>
                    </div>
                    <p className="text-2xs text-slate-600 leading-normal">
                      Caller claiming to be Rahul Sharma flagged with 92.4% synthetic clone probability.
                    </p>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="relative flex items-start gap-3">
                  <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-amber-400 ring-4 ring-white" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-mono font-bold text-slate-600">14:15</span>
                      <span className="font-bold text-slate-900">Pre-Shared Safe Word Confirmed</span>
                    </div>
                    <p className="text-2xs text-slate-600 leading-normal">
                      Sarah Jenkins vendor disbursement call cleared after pre-shared vault phrase match.
                    </p>
                  </div>
                </div>

                {/* Event 4 */}
                <div className="relative flex items-start gap-3">
                  <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-mono font-bold text-slate-600">11:40</span>
                      <span className="font-bold text-slate-900">Executive Baseline Voiceprint Verified</span>
                    </div>
                    <p className="text-2xs text-slate-600 leading-normal">
                      Priya Nair inbound consultation matched 512-dim acoustic baseline (99% confidence).
                    </p>
                  </div>
                </div>

                {/* Event 5 */}
                <div className="relative flex items-start gap-3">
                  <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-slate-300 ring-4 ring-white" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-mono font-bold text-slate-600">09:12</span>
                      <span className="font-bold text-slate-900">Voice Enclave Synchronized</span>
                    </div>
                    <p className="text-2xs text-slate-500 leading-normal">
                      Corporate directory voiceprint hashes verified against secure hardware vault.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* 4. INCIDENTS NEEDING ATTENTION & 5. SECURITY TREND INSIGHTS (RIGHT) */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {/* 4. INCIDENTS NEEDING ATTENTION */}
            <div className="bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Incidents Needing Attention
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  1 Awaiting Sign-off
                </span>
              </div>

              <div className="space-y-3">
                {/* Incident 1 */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">INC-2026-0042</span>
                      <span className="px-1.5 py-0.2 rounded text-3xs font-semibold bg-rose-100 text-rose-800">
                        CRITICAL · CONTAINED
                      </span>
                    </div>
                    <span className="text-2xs text-slate-400">14 mins ago</span>
                  </div>

                  <p className="text-2xs text-slate-600 leading-normal">
                    Attempted $45,000 executive wire transfer bypass using synthetic voice clone. Requires final SOC operator sign-off and executive protection desk notification.
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-3xs text-amber-700 font-semibold">
                      Action Needed: File Formal SOC Report
                    </span>
                    <button
                      type="button"
                      onClick={() => handleNavigate("reports")}
                      className="text-2xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                    >
                      <span>Open Dossier</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Incident 2 (Resolved Reference) */}
                <div className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-200/60 flex flex-col gap-1.5 opacity-80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-800">INC-2026-0041</span>
                      <span className="px-1.5 py-0.2 rounded text-3xs font-semibold bg-slate-200 text-slate-700">
                        RESOLVED
                      </span>
                    </div>
                    <span className="text-2xs text-slate-400">Yesterday</span>
                  </div>
                  <p className="text-2xs text-slate-500 leading-normal">
                    SIP Trunk Gateway 02 brute-force VoIP probing blocked and origin subnet blacklisted.
                  </p>
                </div>
              </div>
            </div>

            {/* 5. OVERALL SECURITY TREND INSIGHTS */}
            <div className="bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-3.5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Security Trend Insights
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 flex flex-col gap-1">
                  <span className="text-2xs font-bold text-blue-900">
                    AI Voice Cloning Vector
                  </span>
                  <p className="text-2xs text-blue-800 leading-relaxed">
                    2 synthetic voice conversion attacks intercepted this week. Zero unauthorized capital disbursements occurred due to mandatory Policy 4.1 out-of-band verification.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
                  <span className="text-2xs font-bold text-slate-800">
                    Social Engineering Patterns
                  </span>
                  <p className="text-2xs text-slate-600 leading-relaxed">
                    100% of executive impersonation attempts combined voice conversion with high-pressure time limits (&ldquo;market close&rdquo;) and colleague isolation demands.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
                  <span className="text-2xs font-bold text-slate-800">
                    Telephony Carrier Integrity
                  </span>
                  <p className="text-2xs text-slate-600 leading-relaxed">
                    88% of legitimate corporate calls arrived with STIR/SHAKEN Level A carrier attestation. All detected spoofing attempts arrived via unverified Level C gateways.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
