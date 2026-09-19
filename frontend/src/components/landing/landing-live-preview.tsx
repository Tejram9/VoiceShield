"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowRight,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PreviewScenario = "synthetic" | "routine" | "contained";

export function LandingLivePreview() {
  const [activeScenario, setActiveScenario] = useState<PreviewScenario>("synthetic");

  return (
    <section id="live-preview" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-2xs font-bold uppercase tracking-wider mb-2">
            In-Call Security Console Preview
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-2xs font-bold uppercase tracking-wider mb-3">
            SIMULATED DEMONSTRATION · SAMPLE TELEMETRY
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Live Protection in the Operations Room
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            See how security officers, finance teams, and executive assistants receive instant threat telemetry while a phone conversation is still active. All caller identities, biometric scores, call details, and transaction values are demonstration data.
          </p>

          {/* Scenario Selector Pills */}
          <div className="mt-6 flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveScenario("synthetic")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                activeScenario === "synthetic"
                  ? "bg-[#0B132B] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              Scenario A: Synthetic Clone Detected (Critical)
            </button>
            <button
              type="button"
              onClick={() => setActiveScenario("routine")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                activeScenario === "routine"
                  ? "bg-[#0B132B] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              Scenario B: Verified Executive Call (Safe)
            </button>
            <button
              type="button"
              onClick={() => setActiveScenario("contained")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                activeScenario === "contained"
                  ? "bg-[#0B132B] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              Scenario C: Wire Contained &amp; Quarantined
            </button>
          </div>
        </div>

        {/* Realistic Console Simulation Frame */}
        <div className="rounded-2xl border border-slate-300/80 bg-white shadow-lg overflow-hidden max-w-5xl mx-auto">
          {/* Top Console Bar */}
          <div className="bg-[#0B132B] px-4 sm:px-6 py-3 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs tracking-tight">Active Telephony Stream</span>
                <span className="text-3xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  SIP-LINE-04 · 02:17
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400 text-2xs">Target Identity:</span>
              <span className="font-semibold text-white">Rahul Sharma (Chief Financial Officer)</span>
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase",
                  activeScenario === "synthetic"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    : activeScenario === "routine"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                )}
              >
                {activeScenario === "synthetic" && "Critical Threat (92/100)"}
                {activeScenario === "routine" && "Safe Session (08/100)"}
                {activeScenario === "contained" && "Contained / Paused"}
              </span>
            </div>
          </div>

          {/* Console Body: 3-Column Preview */}
          <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 bg-slate-50/50">
            {/* Left: Caller Identity & Baseline */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex flex-col gap-3">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-500">
                  Claimed Caller Profile
                </span>
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                    RS
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">Rahul Sharma</span>
                    <span className="text-2xs text-slate-500">VP Finance / CFO</span>
                    <span className="text-3xs font-mono text-slate-400">+91 98201 44820</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5 text-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Enrolled Voiceprint:</span>
                    <span className="font-mono font-semibold text-emerald-700">Calibrated (0.84)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Acoustic Consistency:</span>
                    <span
                      className={cn(
                        "font-mono font-bold",
                        activeScenario === "synthetic"
                          ? "text-rose-600"
                          : activeScenario === "routine"
                          ? "text-emerald-700"
                          : "text-amber-600"
                      )}
                    >
                      {activeScenario === "synthetic" && "0.28 (MISMATCH)"}
                      {activeScenario === "routine" && "0.86 (MATCHED)"}
                      {activeScenario === "contained" && "0.28 (LOCKED)"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex flex-col gap-2">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-500">
                  Pre-Shared Verification
                </span>
                <div className="flex items-center justify-between text-2xs">
                  <span className="text-slate-600">Enterprise Safe Word:</span>
                  <span className="font-mono text-3xs font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                    ENROLLED · ROTATED 4D AGO
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Live Call Transcript & Audio Telemetry */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex flex-col gap-3 flex-1">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">In-Flight Speech Telemetry</span>
                  </div>
                  <span className="text-3xs font-mono text-slate-500">
                    {activeScenario === "synthetic" && "Acoustic & Spectral Inconsistencies Detected"}
                    {activeScenario === "routine" && "Natural Pitch & Harmonics Verified"}
                    {activeScenario === "contained" && "Telephony Stream Held by Directive"}
                  </span>
                </div>

                {/* Simulated Audio Waveform Visualizer Bar */}
                <div className="h-10 bg-slate-900 rounded-lg p-2 flex items-center justify-between gap-1 overflow-hidden">
                  {[24, 40, 18, 55, 78, 30, 92, 85, 45, 60, 35, 70, 48, 88, 62, 38, 20, 52, 68, 30, 45].map((val, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-1 rounded-full transition-all",
                        activeScenario === "synthetic"
                          ? "bg-rose-500"
                          : activeScenario === "routine"
                          ? "bg-emerald-400"
                          : "bg-indigo-400"
                      )}
                      style={{ height: `${val}%` }}
                    />
                  ))}
                </div>

                {/* Live Transcript Snippet */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex flex-col gap-1.5">
                  <span className="text-3xs font-bold uppercase tracking-wider text-slate-500">
                    Live Transcript · Urgency Extraction
                  </span>
                  {activeScenario === "synthetic" && (
                    <p className="text-2xs text-slate-700 leading-normal">
                      &quot;...we cannot wait for Monday&apos;s board approval. Transfer{" "}
                      <span className="bg-rose-100 text-rose-900 font-bold px-1 rounded">
                        $45,000 immediately
                      </span>{" "}
                      to vendor routing code 0842. I will send email confirmation once I land.&quot;
                    </p>
                  )}
                  {activeScenario === "routine" && (
                    <p className="text-2xs text-slate-700 leading-normal">
                      &quot;Good morning Priya. Following up on the Q3 financial audit summary. Can you confirm the balance statement is ready for our 2 PM sync?&quot;
                    </p>
                  )}
                  {activeScenario === "contained" && (
                    <p className="text-2xs text-slate-700 leading-normal">
                      &quot;[CALL CONFINED BY SECURITY DIRECTIVE] Wire disbursement #TX-9042 quarantined. Awaiting Safe Word authentication and out-of-band callback confirmation.&quot;
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Containment Directive & Actions */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <div
                className={cn(
                  "p-4 rounded-xl border flex flex-col gap-2.5 shadow-2xs",
                  activeScenario === "synthetic"
                    ? "bg-rose-50 border-rose-200 text-rose-900"
                    : activeScenario === "routine"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-indigo-50 border-indigo-200 text-indigo-900"
                )}
              >
                <div className="flex items-center gap-2">
                  {activeScenario === "synthetic" && <ShieldAlert className="h-4 w-4 text-rose-600" />}
                  {activeScenario === "routine" && <ShieldCheck className="h-4 w-4 text-emerald-600" />}
                  {activeScenario === "contained" && <Lock className="h-4 w-4 text-indigo-600" />}
                  <span className="text-xs font-bold">
                    {activeScenario === "synthetic" && "SIMULATED · POLICY 4.1"}
                    {activeScenario === "routine" && "Call Authorized"}
                    {activeScenario === "contained" && "Disbursement Held"}
                  </span>
                </div>
                <p className="text-3xs leading-normal">
                  {activeScenario === "synthetic" &&
                    "Simulated directive enforces a transaction hold. Designed to challenge caller with out-of-band verification immediately."}
                  {activeScenario === "routine" &&
                    "Acoustic biometrics and voiceprint match baseline. Normal conversation parameters active."}
                  {activeScenario === "contained" &&
                    "Simulated transaction hold active. Incident INC-2026-0042 dispatched to security officer queue."}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex flex-col gap-2">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-500">
                  Recommended Mitigation
                </span>
                <div className="flex flex-col gap-1.5">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-2xs flex items-center justify-between">
                    <span>Safe Word Challenge</span>
                    <span className="text-3xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      STEP-UP
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-2xs flex items-center justify-between">
                    <span>Out-of-Band Callback</span>
                    <span className="text-3xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      BYPASS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Console Footer Call to Action */}
          <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                <span>Simulate this deepfake-call scenario live in your browser.</span>
              </div>
              <span className="text-3xs text-slate-400">
                <strong>SIMULATED DEMONSTRATION · SAMPLE TELEMETRY:</strong> All identities, scores, call details, and transaction values are demonstration data.
              </span>
            </div>
            <a
              href="/live"
              className="px-4 py-2 rounded-lg bg-[#0B132B] hover:bg-blue-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Enter Interactive Live Console</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
