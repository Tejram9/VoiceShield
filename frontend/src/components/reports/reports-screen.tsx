"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  Clock,
  TrendingUp,
  Download,
  Lock,
  ArrowRight,
  ExternalLink,
  Layers,
  Check,
} from "lucide-react";

export interface ReportsScreenProps {
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
  className?: string;
}

interface TrendWeek {
  week: string;
  totalCalls: number;
  interceptedClones: number;
  preventedLoss: string;
  label: string;
}

const TREND_WEEKS: TrendWeek[] = [
  {
    week: "Aug 22 - Aug 28",
    totalCalls: 98,
    interceptedClones: 1,
    preventedLoss: "$30,000",
    label: "W1",
  },
  {
    week: "Aug 29 - Sep 04",
    totalCalls: 104,
    interceptedClones: 1,
    preventedLoss: "$25,000",
    label: "W2",
  },
  {
    week: "Sep 05 - Sep 11",
    totalCalls: 112,
    interceptedClones: 2,
    preventedLoss: "$85,000",
    label: "W3",
  },
  {
    week: "Sep 12 - Sep 18 (Current)",
    totalCalls: 98,
    interceptedClones: 2,
    preventedLoss: "$45,000",
    label: "W4",
  },
];

export function ReportsScreen({
  activeTab = "reports",
  onNavigateTab,
  className,
}: ReportsScreenProps) {
  const [timeRange, setTimeRange] = useState<"30d" | "90d" | "7d">("30d");
  const [downloadedReport, setDownloadedReport] = useState(false);
  const [appliedActions, setAppliedActions] = useState<Record<string, boolean>>({
    "action-1": false,
    "action-2": true, // already active
    "action-3": false,
  });

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

  const handleExport = () => {
    setDownloadedReport(true);
    setTimeout(() => setDownloadedReport(false), 3000);
  };

  const toggleAction = (id: string) => {
    setAppliedActions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
                Reports &amp; Security Insights
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-slate-100 text-slate-700 border-slate-200">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Enterprise Telephony Telemetry</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Long-term threat trends, acoustic synthesis patterns, verification efficacy, and actionable security posture hardening.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Time Period Filter Pills */}
            <div className="flex items-center bg-white border border-slate-200/80 rounded-lg p-0.5 text-xs font-medium text-slate-600 shadow-xs">
              <button
                type="button"
                onClick={() => setTimeRange("7d")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  timeRange === "7d" ? "bg-slate-900 text-white font-semibold" : "hover:text-slate-900"
                )}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setTimeRange("30d")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  timeRange === "30d" ? "bg-slate-900 text-white font-semibold" : "hover:text-slate-900"
                )}
              >
                Last 30 Days
              </button>
              <button
                type="button"
                onClick={() => setTimeRange("90d")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  timeRange === "90d" ? "bg-slate-900 text-white font-semibold" : "hover:text-slate-900"
                )}
              >
                Quarter to Date
              </button>
            </div>

            {/* Export Report Button */}
            <button
              type="button"
              onClick={handleExport}
              className="py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-xs flex items-center gap-1.5"
            >
              {downloadedReport ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Report Exported</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                  <span>Export Briefing (PDF)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Executive Threat Posture Narrative (Concise, human-designed context) */}
        <div className="bg-white border border-slate-200/70 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="h-4.5 w-4.5 text-blue-600" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-2xs font-bold uppercase tracking-wider text-blue-700">
                30-DAY POSTURE SUMMARY
              </span>
              <p className="text-xs text-slate-800 leading-normal max-w-4xl">
                Across 412 monitored enterprise telephony calls, VoiceShield intercepted <strong>6 targeted synthetic voice impersonation attacks</strong>, preventing <strong>$185,000 USD</strong> in unauthorized capital disbursements. All legitimate executive sessions cleared verification without customer-facing disruption.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-4">
            <div className="flex flex-col text-left sm:text-right">
              <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">
                Capital Losses Prevented
              </span>
              <span className="text-base font-bold text-emerald-700 font-mono">
                $185,000 USD
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STAGE 1: UNDERSTAND TREND — THREAT TRAJECTORY & TIMING WINDOWS */}
        {/* Security Question: Are voice attacks increasing, and when do attackers strike? */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Threat Trajectory &amp; Vulnerability Windows
              </h2>
            </div>
            <span className="text-2xs font-semibold text-slate-500">
              Security Question: When are adversaries targeting our telephony channels?
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Timeline Bar Chart (Answering the temporal distribution question) */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <div className="flex items-center justify-between text-2xs text-slate-500 font-medium">
                <span>Inbound Monitored Calls vs. Intercepted Deepfakes</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-slate-200" />
                    <span>Monitored Calls</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
                    <span>Intercepted Clone</span>
                  </div>
                </div>
              </div>

              {/* Responsive SVG Histogram */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 flex flex-col gap-4">
                <div className="grid grid-cols-4 gap-3 items-end h-36 pt-2">
                  {TREND_WEEKS.map((w, idx) => (
                    <div key={w.label} className="flex flex-col items-center gap-2 h-full justify-end group">
                      {/* Bar stack */}
                      <div className="w-full max-w-[56px] flex flex-col items-center gap-1">
                        {/* Threat Indicator Tag */}
                        {w.interceptedClones > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-3xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            {w.interceptedClones} {w.interceptedClones === 1 ? "Attack" : "Attacks"}
                          </span>
                        )}
                        {/* Call Volume Bar */}
                        <div
                          className={cn(
                            "w-full rounded-t-md transition-all duration-300 relative",
                            idx === 3 ? "bg-slate-800" : "bg-slate-300 group-hover:bg-slate-400"
                          )}
                          style={{ height: `${(w.totalCalls / 120) * 80}px` }}
                        >
                          {/* Intercepted Clone Bar Accent */}
                          <div
                            className="w-full bg-rose-500 rounded-t-md absolute top-0 left-0"
                            style={{ height: `${w.interceptedClones * 8}px` }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <span className="text-2xs font-bold text-slate-800">{w.label}</span>
                        <span className="text-3xs text-slate-400">{w.totalCalls} calls</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-2xs text-slate-500">
                  <span>Aug 22 (W1: Baseline)</span>
                  <span>Sep 18 (W4: Active Threat Contained)</span>
                </div>
              </div>
            </div>

            {/* Strategic Timing Insights & Findings */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                  <span className="text-xs font-bold text-amber-900">
                    High-Risk Timing Concentration: Friday Market-Close
                  </span>
                </div>
                <p className="text-2xs text-amber-900/90 leading-relaxed">
                  <strong>83% of deepfake impersonations (5 of 6)</strong> occurred on Friday afternoons between <strong>14:45 and 16:30 local time</strong>. Attackers exploit end-of-week urgency, lower staffing on internal verification desks, and pending bank wire cutoffs.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-slate-900">
                  Attack Escalation Vector: Executive Clones
                </span>
                <p className="text-2xs text-slate-600 leading-relaxed">
                  While total call volume remained steady (~100 calls/week), attacker sophistication shifted from opportunistic vendor billing changes in Week 1 to targeted C-suite voice clones (CFO &amp; MD) in Weeks 3 and 4.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STAGE 2: IDENTIFY PATTERN — SYNTHESIS VECTORS & ATTACK PRETEXTS */}
        {/* Security Question: What acoustic tools and pretexts do adversaries deploy? */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Voice Synthesis Models Used by Attackers */}
          <div className="lg:col-span-6 bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-slate-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Adversary Voice-Cloning Vectors
                </h3>
              </div>
              <span className="text-2xs font-semibold text-slate-500">
                6 Intercepted Samples
              </span>
            </div>

            <p className="text-2xs text-slate-600 leading-normal">
              Acoustic forensics breakdown of synthetic speech artifacts identified by VoiceShield&apos;s dual-domain neural detector:
            </p>

            <div className="space-y-3">
              {/* Pattern 1 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Zero-Shot Neural Diffusion Clones (XTTS / Bark)
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-3xs font-semibold bg-rose-100 text-rose-800">
                      66% (4 Attacks)
                    </span>
                  </div>
                </div>
                <p className="text-2xs text-slate-600 leading-normal">
                  High-fidelity timbre cloned from public earnings calls (3-second reference). Flagged by VoiceShield due to phase discontinuities in high frequencies and unnatural micro-prosodic pauses.
                </p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: "66%" }} />
                </div>
              </div>

              {/* Pattern 2 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Real-Time Streaming Vocoders (RVC Low-Latency)
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-3xs font-semibold bg-amber-100 text-amber-800">
                      34% (2 Attacks)
                    </span>
                  </div>
                </div>
                <p className="text-2xs text-slate-600 leading-normal">
                  Live voice conversion software operated by threat actor in real-time. Flagged due to persistent 140ms algorithmic latency buffers and unnatural formant centroid drift under stress.
                </p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "34%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Deception Pretexts & Behavioral Tactics */}
          <div className="lg:col-span-6 bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Common Social Engineering Pretexts
                </h3>
              </div>
              <span className="text-2xs font-semibold text-slate-500">
                Tactic Breakdown
              </span>
            </div>

            <p className="text-2xs text-slate-600 leading-normal">
              Behavioral pretexts deployed in conjunction with cloned voice to compel rapid compliance:
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    1. Urgent Capital / Escrow Disbursement
                  </span>
                  <span className="text-2xs font-mono font-bold text-slate-700">58%</span>
                </div>
                <p className="text-2xs text-slate-600">
                  High-pressure demands citing &ldquo;closing before banking cutoffs&rdquo; or &ldquo;regulatory fine avoidance&rdquo; with explicit orders to bypass dual-sign procedures.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    2. Confidential M&amp;A / Executive Legal NDA
                  </span>
                  <span className="text-2xs font-mono font-bold text-slate-700">24%</span>
                </div>
                <p className="text-2xs text-slate-600">
                  Pretext claiming strict non-disclosure, instructing desk operators not to consult colleagues or loop in supervisor channels.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    3. Vendor Bank Account &amp; Routing Shift
                  </span>
                  <span className="text-2xs font-mono font-bold text-slate-700">18%</span>
                </div>
                <p className="text-2xs text-slate-600">
                  Impersonating approved cloud/logistics suppliers requesting remittance updates to fraudulent domestic escrow accounts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STAGE 3: REVIEW IMPACT — VERIFICATION OUTCOMES & CAPITAL PREVENTED */}
        {/* Security Question: How effectively did our secondary defense layers hold? */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Verification Outcomes &amp; Capital Protection Efficacy
              </h2>
            </div>
            <span className="text-2xs font-semibold text-slate-500">
              Security Question: How effectively did secondary challenges defend the enterprise?
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Method 1: Trusted Callback */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Trusted Cellular Callback
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-3xs font-bold bg-emerald-100 text-emerald-800">
                    100% BLOCKED
                  </span>
                </div>
                <p className="text-2xs text-slate-600 leading-normal">
                  Out-of-band cellular check severed 4 fraudulent calls. Spoofed caller could not receive return verification on executive hardware SIM.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-2xs text-slate-500 font-mono">
                <span>Attempted: 4</span>
                <span className="text-emerald-700 font-bold">Blocked: 4</span>
              </div>
            </div>

            {/* Method 2: Pre-Shared Safe Word */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Pre-Shared Safe Word Vault
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-3xs font-bold bg-emerald-100 text-emerald-800">
                    100% SUCCESS
                  </span>
                </div>
                <p className="text-2xs text-slate-600 leading-normal">
                  Authorized executives safely authorized 3 genuine urgent wire disbursements using hardware vault phrases. 0 adversaries possessed phrases.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-2xs text-slate-500 font-mono">
                <span>Authorized: 3</span>
                <span className="text-blue-700 font-bold">Zero Leaks</span>
              </div>
            </div>

            {/* Method 3: Containment Latency & False Positives */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Operational Precision
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-3xs font-bold bg-blue-100 text-blue-800">
                    ZERO FP
                  </span>
                </div>
                <p className="text-2xs text-slate-600 leading-normal">
                  Average automated detection-to-containment latency clocked at <strong>1.8 seconds</strong>. Zero false positive freezes on legitimate executive calls.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-2xs text-slate-500 font-mono">
                <span>Avg Latency: 1.8s</span>
                <span className="text-slate-700 font-bold">FP Rate: 0.0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STAGE 4: TAKE ACTION — PROACTIVE SOC HARDENING RECOMMENDATIONS */}
        {/* Security Question: What specific actions should the security team take now? */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Recommended Security Actions &amp; Policy Hardening
              </h2>
            </div>
            <span className="text-2xs font-semibold text-slate-500">
              Proactive Defenses Based on Observed Telephony Patterns
            </span>
          </div>

          <div className="space-y-3">
            {/* Action 1 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Mandate Safe Word Enclave for European Operations Signatories
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-3xs font-bold bg-amber-100 text-amber-800">
                      RECOMMENDED
                    </span>
                  </div>
                  <p className="text-2xs text-slate-600 leading-normal max-w-3xl">
                    Sarah Jenkins (VP Treasury Operations) currently possesses an incomplete calibration baseline (4.2 mins). Enrolling her in the physical safe word protocol mitigates risk during international transactions exceeding $25,000.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleNavigate("settings")}
                  className="py-1.5 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <span>Configure Identity</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Action 2 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-800 shrink-0 mt-0.5">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Enforce Strict STIR/SHAKEN Level A for Zurich Inbound PBX Gateway
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-3xs font-bold bg-emerald-100 text-emerald-800">
                      ACTIVE ENFORCEMENT
                    </span>
                  </div>
                  <p className="text-2xs text-slate-600 leading-normal max-w-3xl">
                    All 6 intercepted attacks originated from carriers lacking cryptographic Level A attestations. Automatically routing Level C calls claiming executive identity to verification hold eliminates 100% of external trunk spoofing.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => toggleAction("action-2")}
                  className={cn(
                    "py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5",
                    appliedActions["action-2"]
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  )}
                >
                  {appliedActions["action-2"] ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Rule Enforced</span>
                    </>
                  ) : (
                    <span>Enforce Rule</span>
                  )}
                </button>
              </div>
            </div>

            {/* Action 3 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-200 text-slate-700 shrink-0 mt-0.5">
                  <Lock className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Lower Automated Wire Freeze Threshold to $10,000 on Unverified Gateways
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-3xs font-bold bg-slate-200 text-slate-700">
                      OPTIONAL HARDENING
                    </span>
                  </div>
                  <p className="text-2xs text-slate-600 leading-normal max-w-3xl">
                    Policy 4.1 currently enforces out-of-band dual-sign verification on transfers above $25,000. Lowering the threshold to $10,000 blocks smaller probing transactions identified in recent intelligence bulletins.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => toggleAction("action-3")}
                  className={cn(
                    "py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5",
                    appliedActions["action-3"]
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-white text-slate-800 border border-slate-300 hover:bg-slate-100"
                  )}
                >
                  {appliedActions["action-3"] ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Threshold Applied</span>
                    </>
                  ) : (
                    <span>Apply $10,000 Threshold</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>VoiceShield Telephony Security Analytics Engine · Build v2.4</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleNavigate("overview")}
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors flex items-center gap-1"
            >
              <span>Protection Overview</span>
              <ArrowRight className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("call-history")}
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors flex items-center gap-1"
            >
              <span>Call History Archive</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
