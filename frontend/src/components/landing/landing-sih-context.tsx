"use client";

import React from "react";
import {
  Cpu,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

export function LandingSihContext() {
  return (
    <section id="sih-context" className="py-16 md:py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-2xs font-bold uppercase tracking-wider mb-3">
            National Hackathon Challenge
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Smart India Hackathon 2026 Context
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Engineered to address Problem Statement <strong>26104</strong>: Real-time detection and mitigation of synthetic voice cloning and deepfake impersonation across enterprise and public telephony.
          </p>
        </div>

        {/* 2-Column Overview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Left: The National & Global Problem */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-rose-100 text-rose-700">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    The Telephony Fraud Crisis
                  </h3>
                  <span className="text-2xs font-semibold text-rose-700">
                    Expanding Threat Landscape in India &amp; Worldwide
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                In India and internationally, cybercrime syndicates are weaponizing cheap generative voice cloning tools to perpetrate digital arrest scams, urgent family emergency frauds, and corporate executive impersonation.
              </p>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <span>
                    <strong>Digital Arrest &amp; Police Impersonation:</strong> Scammers clone voices of high-ranking enforcement officials to intimidate citizens into transferring savings.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <span>
                    <strong>Corporate CFO Wire Hijacking:</strong> Earnings calls provide abundant voice data to clone corporate executives and order false vendor payments.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <span>
                    <strong>VoIP Attestation Gaps:</strong> Caller-ID attestation helps establish calling-party information, but does not by itself verify whether the spoken voice is authentic or synthetic.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-2xs text-slate-500">
              <span className="font-mono">SIH Problem Statement: 26104</span>
              <span className="font-semibold text-slate-700">Cybersecurity / Speech AI</span>
            </div>
          </div>

          {/* Right: The VoiceShield Innovation Architecture */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-[#0B132B] text-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    VoiceShield Technical Innovation
                  </h3>
                  <span className="text-2xs font-semibold text-blue-400">
                    Real-Time Edge Architecture
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Rather than relying on expensive cloud GPUs or invasive recording storage, VoiceShield introduces a lightweight in-memory inference pipeline designed for future integration alongside enterprise PBX systems.
              </p>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Edge Hardware Viability</span>
                    <span className="text-2xs text-slate-400">
                      Prototype evaluation target: sub-50ms inference on standard enterprise CPU/edge acceleration without requiring massive GPU infrastructure.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Interoperable Telephony SIP Gateway</span>
                    <span className="text-2xs text-slate-400">
                      Planned standardized RTP sidecar integration for Asterisk, FreePBX, and Kamailio telephony networks.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Minimal Raw-Audio Retention · Prototype</span>
                    <span className="text-2xs text-slate-400">
                      Designed around privacy-by-design principles with lossy derived vectors, ephemeral memory buffers, and planned enclave baseline zeroization.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-2xs text-slate-400">
              <span>Prototype Evaluation Ready</span>
              <span className="font-mono text-emerald-400">Smart India Hackathon 2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
