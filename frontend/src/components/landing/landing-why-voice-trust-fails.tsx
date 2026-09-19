"use client";

import React from "react";
import {
  XCircle,
  CheckCircle2,
  PhoneOff,
  Ear,
  FileClock,
  KeyRound,
} from "lucide-react";

export function LandingWhyVoiceTrustFails() {
  const comparisonItems = [
    {
      factor: "Caller ID / Phone Number Attestation",
      icon: <PhoneOff className="h-5 w-5 text-slate-700" />,
      conventional:
        "Treated as an authoritative identity proof. Readily spoofed using VoIP trunk providers or compromised SIP endpoints.",
      voiceshield:
        "Treated as unverified transport metadata. Evaluates true caller voice biometrics and acoustic artifact consistency.",
    },
    {
      factor: "Auditory Perception & Human Ear",
      icon: <Ear className="h-5 w-5 text-slate-700" />,
      conventional:
        "Humans trust familiar vocal timbre and cadence. Modern neural text-to-speech models readily fool human listeners by closely replicating authentic pitch, inflection, and conversational cadence.",
      voiceshield:
        "Neural spoof detector evaluates acoustic, spectral, prosodic, and speaker-consistency signals in incoming audio frames.",
    },
    {
      factor: "Detection Timing & Threat Remediation",
      icon: <FileClock className="h-5 w-5 text-slate-700" />,
      conventional:
        "Post-call logging and recording analysis. Alert triggers hours or days after fraudulent wire transfers have cleared.",
      voiceshield:
        "In-session evaluation with a prototype sub-50ms inference target. Designed to trigger a simulated transaction hold while the caller is still on the line.",
    },
    {
      factor: "Verification & Step-Up Security",
      icon: <KeyRound className="h-5 w-5 text-slate-700" />,
      conventional:
        "Static knowledge questions (mother's maiden name, employee ID), which attackers easily harvest from public social profiles or breach dumps.",
      voiceshield:
        "Pre-shared enterprise Safe Words and planned out-of-band device callbacks designed to verify caller identity outside the active call channel.",
    },
  ];

  return (
    <section id="why-trust-fails" className="py-16 md:py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 text-2xs font-bold uppercase tracking-wider mb-3">
            The Threat Reality
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Existing Voice Trust Fails
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Enterprise communication was built on the assumption that a familiar voice represents a verified person. Generative AI fundamentally broke that trust model.
          </p>
        </div>

        {/* Structured Comparison Grid */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-12 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-700">
            <div className="md:col-span-4 p-4 uppercase tracking-wider text-2xs text-slate-500">
              Security Vector
            </div>
            <div className="md:col-span-4 p-4 uppercase tracking-wider text-2xs text-rose-700 bg-rose-50/70 border-l border-slate-200 flex items-center gap-1.5">
              <XCircle className="h-4 w-4 text-rose-600" />
              <span>Conventional Telephony Defense</span>
            </div>
            <div className="md:col-span-4 p-4 uppercase tracking-wider text-2xs text-emerald-800 bg-emerald-50/70 border-l border-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>VoiceShield In-Call Defense</span>
            </div>
          </div>

          <div className="divide-y divide-slate-200 bg-white">
            {comparisonItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 text-xs">
                {/* Vector Title */}
                <div className="md:col-span-4 p-5 bg-slate-50/50 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-sm">{item.factor}</span>
                    <span className="text-3xs text-slate-400 mt-0.5">Vulnerability Analysis</span>
                  </div>
                </div>

                {/* Conventional */}
                <div className="md:col-span-4 p-5 border-l border-slate-200/80 bg-rose-50/20 flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-slate-600 text-2xs leading-relaxed">
                    {item.conventional}
                  </p>
                </div>

                {/* VoiceShield */}
                <div className="md:col-span-4 p-5 border-l border-slate-200/80 bg-emerald-50/20 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-slate-800 text-2xs font-medium leading-relaxed">
                    {item.voiceshield}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Qualitative Threat Landscape Statement */}
        <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded text-3xs font-bold uppercase bg-slate-200 text-slate-800">
              Threat Landscape
            </span>
            <p className="text-2xs sm:text-xs">
              Synthetic voice cloning and digital arrest impersonation represent an escalating threat to enterprise treasury, executive communications, and public telephony.
            </p>
          </div>
          <span className="text-3xs text-slate-400 shrink-0 font-mono">
            Acoustic &amp; Biometric Defense Analysis
          </span>
        </div>
      </div>
    </section>
  );
}
