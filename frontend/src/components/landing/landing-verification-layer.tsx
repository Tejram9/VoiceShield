"use client";

import React from "react";
import {
  KeyRound,
  PhoneCall,
  Users,
  CheckCircle2,
} from "lucide-react";

export function LandingVerificationLayer() {
  const verificationMethods = [
    {
      title: "Pre-Shared Enterprise Safe Word",
      badge: "Cryptographic Hash",
      description:
        "High-trust executives enroll a private, out-of-band challenge phrase. If acoustic scoring detects anomaly, the receiver challenges the caller to verify the rotated phrase without exposing it in plaintext.",
      benefit: "Immediate in-call verbal proof without interrupting normal telephony.",
      icon: <KeyRound className="h-5 w-5 text-amber-600" />,
    },
    {
      title: "Trusted Out-of-Band Callback",
      badge: "Planned Architecture",
      description:
        "Planned enterprise capability: VoiceShield is designed to initiate a secondary cellular callback directly to the verified hardware SIM card on file, bypassing the active VoIP or SIP trunk session where the caller is connected.",
      benefit: "Designed to break session hijacking and man-in-the-middle PBX spoofing.",
      icon: <PhoneCall className="h-5 w-5 text-blue-600" />,
    },
    {
      title: "Dual-Authorization Custody · Planned",
      badge: "Planned Policy",
      description:
        "Planned enterprise control: For transactions exceeding defined risk thresholds, the architecture is designed to require concurrent sign-off from both the on-duty security officer and the financial controller before unholding.",
      benefit: "Designed to prevent unilateral employee coercion under urgency tactics.",
      icon: <Users className="h-5 w-5 text-purple-600" />,
    },
  ];

  return (
    <section id="verification" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-2xs font-bold uppercase tracking-wider mb-3">
            Multi-Tier Authentication Matrix
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The Verification Layer: Beyond Detection
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            AI detection algorithms are probabilities; security decisions require clear policy controls. VoiceShield couples real-time scoring with graduated out-of-band verification challenges and simulated containment workflows before high-consequence actions proceed.
          </p>
        </div>

        {/* 3 Verification Method Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {verificationMethods.map((method, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    {method.icon}
                  </div>
                  <span className="text-3xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {method.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {method.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-2xs text-slate-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium">{method.benefit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Graduated Escalation Flowchart */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Graduated Threat Escalation Flow
              </h3>
              <p className="text-2xs text-slate-500">
                How VoiceShield dynamically steps up security requirements as conversational risk increases.
              </p>
            </div>
            <span className="text-3xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-200 self-start sm:self-auto">
              Automated Policy Engine
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-3xs font-bold font-mono text-slate-400">STAGE 1</span>
                <span className="text-3xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Risk: 0-30</span>
              </div>
              <span className="font-bold text-slate-900">Passive Monitoring</span>
              <p className="text-2xs text-slate-600 leading-normal">
                Continuous acoustic feature extraction in memory. Natural conversation proceeds uninterrupted.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-3xs font-bold font-mono text-slate-400">STAGE 2</span>
                <span className="text-3xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Risk: 31-60</span>
              </div>
              <span className="font-bold text-slate-900">Elevated Advisory</span>
              <p className="text-2xs text-slate-600 leading-normal">
                Caller ID discrepancy or mild urgency detected. Operator dashboard displays yellow advisory caution.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-3xs font-bold font-mono text-slate-400">STAGE 3</span>
                <span className="text-3xs font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">Risk: 61-75</span>
              </div>
              <span className="font-bold text-slate-900">Safe Word Challenge</span>
              <p className="text-2xs text-slate-600 leading-normal">
                Speaker verification cosine mismatch. System prompts operator to challenge with pre-shared Safe Word.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-3xs font-bold font-mono text-rose-500">STAGE 4</span>
                <span className="text-3xs font-bold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded">Risk: 76-100</span>
              </div>
              <span className="font-bold text-rose-950">Containment Mandate</span>
              <p className="text-2xs text-rose-800 leading-normal">
                Synthetic speech signals detected + high urgency. Simulated Policy 4.1 triggers a transaction hold and prompts planned out-of-band verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
