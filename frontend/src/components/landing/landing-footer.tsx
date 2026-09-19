"use client";

import React from "react";
import { Shield, ArrowUp } from "lucide-react";

export function LandingFooter() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#0B132B] text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <Shield className="h-4.5 w-4.5 fill-white/20 stroke-white stroke-[2.2]" />
              </div>
              <span className="font-bold text-base text-white tracking-tight">
                VoiceShield
              </span>
            </div>
            <p className="text-2xs text-slate-400 leading-relaxed max-w-sm">
              Real-time voice-cloning impersonation defense and telephony security platform. Designed to protect corporate communications and financial transactions against synthetic speech manipulation.
            </p>
            <div className="flex items-center gap-2 pt-1 text-3xs text-slate-500 font-mono">
              <span>Prototype Evaluation</span>
              <span>·</span>
              <span>Smart India Hackathon 2026</span>
            </div>
          </div>

          {/* Product Console Navigation */}
          <div className="lg:col-span-3 flex flex-col gap-2.5">
            <span className="text-3xs font-bold uppercase tracking-wider text-slate-200">
              Security Console
            </span>
            <ul className="space-y-1.5 text-2xs">
              <li>
                <a href="/live" className="hover:text-white transition-colors">
                  Live Protection Screen
                </a>
              </li>
              <li>
                <a href="/call-history" className="hover:text-white transition-colors">
                  Call History &amp; Forensics
                </a>
              </li>
              <li>
                <a href="/verification" className="hover:text-white transition-colors">
                  Identity Verification Challenges
                </a>
              </li>
              <li>
                <a href="/incident" className="hover:text-white transition-colors">
                  Incident Dossier &amp; Case Forensics
                </a>
              </li>
              <li>
                <a href="/reports" className="hover:text-white transition-colors">
                  Security Reports &amp; Analytics
                </a>
              </li>
              <li>
                <a href="/trusted-identity" className="hover:text-white transition-colors">
                  Trusted Identity Management
                </a>
              </li>
            </ul>
          </div>

          {/* Security & Governance */}
          <div className="lg:col-span-3 flex flex-col gap-2.5">
            <span className="text-3xs font-bold uppercase tracking-wider text-slate-200">
              Security &amp; Privacy
            </span>
            <ul className="space-y-1.5 text-2xs">
              <li>
                <a href="/overview" className="hover:text-white transition-colors">
                  Protection Posture Overview
                </a>
              </li>
              <li>
                <a href="/security-privacy" className="hover:text-white transition-colors">
                  Security &amp; Privacy Architecture
                </a>
              </li>
              <li>
                <a href="/security-privacy" className="hover:text-white transition-colors">
                  Minimal Speech Storage Policy
                </a>
              </li>
              <li>
                <a href="/security-privacy" className="hover:text-white transition-colors">
                  Hardware Enclave Roadmap
                </a>
              </li>
              <li>
                <a href="/security-privacy" className="hover:text-white transition-colors">
                  Data Retention &amp; Right-to-Erasure
                </a>
              </li>
            </ul>
          </div>

          {/* Hackathon Specs */}
          <div className="lg:col-span-2 flex flex-col gap-2.5">
            <span className="text-3xs font-bold uppercase tracking-wider text-slate-200">
              Hackathon Context
            </span>
            <div className="flex flex-col gap-1.5 text-2xs text-slate-400">
              <span>Problem Statement: <strong>26104</strong></span>
              <span>Theme: AI / Cybersecurity</span>
              <span>Architecture: Edge PBX</span>
              <button
                type="button"
                onClick={scrollToTop}
                className="mt-3 inline-flex items-center gap-1.5 text-2xs font-semibold text-blue-400 hover:text-blue-300 self-start transition-colors"
              >
                <span>Back to top</span>
                <ArrowUp className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Legal & Prototype Disclaimer Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-3xs text-slate-500">
          <span>
            VoiceShield Prototype Evaluation Platform · Developed for Smart India Hackathon 2026 · All audio processing demonstrated in local memory buffers.
          </span>
          <span className="font-mono">v1.0.0-SIH26104</span>
        </div>
      </div>
    </footer>
  );
}
