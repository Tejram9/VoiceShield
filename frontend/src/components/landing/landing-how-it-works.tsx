"use client";

import React from "react";
import {
  PhoneForwarded,
  Cpu,
  Gauge,
  ShieldAlert,
  ArrowRight,
  Server,
} from "lucide-react";

export function LandingHowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Telephony Stream Ingestion",
      category: "SIP Gateway",
      description:
        "VoiceShield prototype evaluation processes incoming telephony audio streams in volatile 6.0-second sliding buffers without persistent disk storage.",
      specs: "25ms window / 10ms hop · Volatile memory only",
      icon: <PhoneForwarded className="h-5 w-5 text-blue-600" />,
    },
    {
      step: "02",
      title: "Dual-Model Neural Scoring",
      category: "Acoustic AI",
      description:
        "Planned enterprise architecture: neural spoof detection runs locally on enterprise telephony gateways. Two parallel neural pipelines process audio frames: an acoustic spoof classifier and a speaker verification engine.",
      specs: "Spoof Classifier + Speaker Verification",
      icon: <Cpu className="h-5 w-5 text-indigo-600" />,
    },
    {
      step: "03",
      title: "Composite Risk Engine",
      category: "Decision Matrix",
      description:
        "The evaluation engine aggregates acoustic spoof probability, speaker mismatch distance, high-urgency financial keywords (e.g. 'wire transfer immediately'), and caller-ID attestation into a 0–100 risk score.",
      specs: "Acoustic + Biometric + Intent Telemetry",
      icon: <Gauge className="h-5 w-5 text-amber-600" />,
    },
    {
      step: "04",
      title: "Deterministic Action Mandate",
      category: "Simulated Policy 4.1",
      description:
        "If the composite risk crosses containment thresholds (Score > 75), VoiceShield is designed to trigger a simulated transaction hold, step-up Safe Word challenge, and simulated SOC incident dispatch.",
      specs: "Simulated Hold & Quarantine Workflow",
      icon: <ShieldAlert className="h-5 w-5 text-rose-600" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-2xs font-bold uppercase tracking-wider mb-3">
            In-Call Architecture
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How VoiceShield Protects Live Calls
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Designed to operate as an intelligent sidecar to enterprise PBX systems, scoring speech biometrics and conversation risk to trigger simulated transaction containment before unverified actions proceed.
          </p>
        </div>

        {/* 4-Step Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative p-6 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    {item.icon}
                  </div>
                  <span className="font-mono text-xl font-extrabold text-slate-300">
                    {item.step}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="text-3xs font-bold uppercase tracking-wider text-slate-500">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/70">
                <span className="text-2xs font-mono text-slate-500 block">
                  {item.specs}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline Summary Banner */}
        <div className="mt-12 p-5 rounded-xl bg-[#0B132B] text-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Server className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">
                Planned Architecture: Compatible with Enterprise PBX Platforms
              </span>
              <span className="text-2xs text-slate-400">
                Designed for future edge deployment alongside Asterisk, FreePBX, Kamailio, Cisco Unified CM, and enterprise SIP gateways.
              </span>
            </div>
          </div>
          <a
            href="#live-preview"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>See Live Console in Action</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
