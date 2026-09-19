"use client";

import React from "react";
import { ArrowRight, ShieldCheck, FileText, Lock } from "lucide-react";

export function LandingCta() {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B132B] text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-2xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Interactive Security Demonstration</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl leading-tight">
            Experience VoiceShield In Action.
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Simulate a live deepfake executive call scenario in your browser. Inspect real-time neural acoustic scoring, trigger Safe Word challenges, and test simulated Policy 4.1 wire containment.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href="/live"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              <span>Launch Live Protection Console</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/overview"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <span>View Protection Overview</span>
            </a>
          </div>

          {/* Secondary Quick Links */}
          <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl text-left">
            <a
              href="/verification"
              className="p-3 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 transition-colors flex items-center gap-2.5 text-xs text-slate-300"
            >
              <Lock className="h-4 w-4 text-blue-400 shrink-0" />
              <div>
                <span className="font-semibold block text-white">Verification Engine</span>
                <span className="text-3xs text-slate-400">Challenge protocols</span>
              </div>
            </a>

            <a
              href="/incident"
              className="p-3 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 transition-colors flex items-center gap-2.5 text-xs text-slate-300"
            >
              <FileText className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold block text-white">Incident Dossier</span>
                <span className="text-3xs text-slate-400">Forensics &amp; telemetry</span>
              </div>
            </a>

            <a
              href="/security-privacy"
              className="p-3 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 transition-colors flex items-center gap-2.5 text-xs text-slate-300"
            >
              <ShieldCheck className="h-4 w-4 text-purple-400 shrink-0" />
              <div>
                <span className="font-semibold block text-white">Security &amp; Privacy</span>
                <span className="text-3xs text-slate-400">Minimal raw-audio retention</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
