"use client";

import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Lock,
  Activity,
} from "lucide-react";

export function LandingHero() {
  return (
    <section id="hero" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Hackathon & Security Scope Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700 mb-6">
          <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Smart India Hackathon 2026 · Problem Statement 26104</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-500 font-normal">Real-Time Telephony Defense</span>
        </div>

        {/* Primary Impact Heading */}
        <div className="flex flex-col gap-3 max-w-4xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Trusted Voice <span className="text-rose-600 font-mono">≠</span> Trusted Identity.
          </h1>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-blue-700">
            Detect. Verify. Prevent.
          </p>
        </div>

        {/* 10-Second Value Explanation */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
          Modern generative AI clones executive voices in seconds. VoiceShield is designed to operate inside live enterprise calls to detect synthetic acoustic artifacts, evaluate caller mismatch, and trigger out-of-band verification <strong>before fraudulent wire disbursements or credential compromise occur.</strong>
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <a
            href="/live"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#0B132B] hover:bg-blue-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
          >
            <span>Launch Live Protection Console</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-2xs flex items-center justify-center gap-2"
          >
            <span>Explore In-Call Architecture</span>
          </a>
        </div>

        {/* The 3 Pillars Visual Card Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl text-left">
          {/* Pillar 1: Detect */}
          <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <span className="text-2xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Acoustic Analysis
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">1. Detect</h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                In-memory sliding-window analysis evaluates acoustic, spectral, prosodic, and speaker-consistency signals in real time.
              </p>
            </div>
            <div className="mt-auto pt-3 border-t border-slate-100 flex items-center gap-2 text-2xs text-slate-500 font-mono">
              <Activity className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>Prototype evaluation target: sub-50ms</span>
            </div>
          </div>

          {/* Pillar 2: Verify */}
          <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <span className="text-2xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Out-of-Band Policy
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">2. Verify</h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Automated step-up challenges trigger dynamically: pre-shared enterprise Safe Words, planned trusted device callbacks, and designed supervisor dual-custody approval.
              </p>
            </div>
            <div className="mt-auto pt-3 border-t border-slate-100 flex items-center gap-2 text-2xs text-slate-500 font-mono">
              <Lock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span>Multi-tier challenge matrix</span>
            </div>
          </div>

          {/* Pillar 3: Prevent */}
          <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <span className="text-2xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Action Mandate
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">3. Prevent</h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Designed Policy 4.1 enforces a simulated transaction hold on unverified disbursements and creates an incident dossier for SOC investigation.
              </p>
            </div>
            <div className="mt-auto pt-3 border-t border-slate-100 flex items-center gap-2 text-2xs text-slate-500 font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Designed to trigger a transaction hold</span>
            </div>
          </div>
        </div>

        {/* Calm Telemetry Trust Strip */}
        <div className="mt-10 py-3.5 px-5 rounded-xl bg-white border border-slate-200/70 shadow-2xs max-w-4xl w-full flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span><strong>Minimal Raw-Audio Retention · Prototype</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span><strong>Edge Telephony Architecture:</strong> Designed for on-prem PBX deployment</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span><strong>Simulated Policy:</strong> Designed to trigger transaction holds</span>
          </div>
        </div>
      </div>
    </section>
  );
}
