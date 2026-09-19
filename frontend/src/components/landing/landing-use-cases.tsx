"use client";

import React from "react";
import {
  Landmark,
  Headphones,
  UserCheck,
  Building2,
  ArrowRight,
} from "lucide-react";

export function LandingUseCases() {
  const useCases = [
    {
      title: "Corporate Treasury & Emergency Wire Transfers",
      target: "Chief Financial Officers & Treasury Teams",
      attackVector:
        "Fraudsters clone executive voices using audio from earnings webcasts or media interviews, calling treasury managers to demand emergency confidential disbursements to fraudulent offshore accounts.",
      defense:
        "VoiceShield flags acoustic, spectral, and prosodic inconsistencies in the synthetic voice and triggers a simulated Policy 4.1 hold, designed to halt wire releases until Safe Word or planned out-of-band callback confirmation.",
      icon: <Landmark className="h-5 w-5 text-blue-600" />,
      caseTag: "Business Email & Voice Compromise (BEC/BVC)",
    },
    {
      title: "IT Helpdesk & MFA Device Reset Bypass",
      target: "Corporate Helpdesk Technicians & Sysadmins",
      attackVector:
        "Attackers call IT support impersonating remote employees or department heads, using emotional urgency ('locked out right before executive presentation') to request MFA token re-registration or password resets.",
      defense:
        "Biometric mismatch triggers an automated challenge requiring the caller to answer their pre-shared internal identity phrase before administrative credentials can be altered.",
      icon: <Headphones className="h-5 w-5 text-indigo-600" />,
      caseTag: "Identity Takeover & Session Hijacking",
    },
    {
      title: "Private Banking & High-Net-Worth Wealth Offices",
      target: "Wealth Managers & Family Office Fiduciaries",
      attackVector:
        "Criminal syndicates clone the voices of family principals, generating realistic distress calls that demand urgent account liquidations or wire transfers for non-existent medical or legal emergencies.",
      defense:
        "Planned out-of-band cellular callback is designed to place a parallel verification call directly to the principal's physical hardware phone, dispelling the impersonation attempt outside the compromised channel.",
      icon: <UserCheck className="h-5 w-5 text-purple-600" />,
      caseTag: "Distress Impersonation & VIP Extortion",
    },
    {
      title: "Supply Chain & Vendor Payment Routing Updates",
      target: "Accounts Payable & Procurement Officers",
      attackVector:
        "An attacker impersonates a key vendor's accounts receivable director over telephony, claiming a sudden banking switch and demanding immediate wire redirection for an imminent delivery.",
      defense:
        "Acoustic scoring detects synthetic vocal generation. In planned enterprise deployments, this is designed to integrate with ERP workflows to flag the vendor queue and require four-eyes supervisor verification before payment release.",
      icon: <Building2 className="h-5 w-5 text-emerald-600" />,
      caseTag: "Vendor Account Compromise (VAC)",
    },
  ];

  return (
    <section id="use-cases" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-2xs font-bold uppercase tracking-wider mb-3">
            Real-World Threat Defense
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Targeted Enterprise Use Cases
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Voice-cloning attacks focus on high-consequence telephone workflows where urgency and authority bypass conventional IT controls. VoiceShield hardens these vulnerable channels.
          </p>
        </div>

        {/* 4 Use Case Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((uc, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    {uc.icon}
                  </div>
                  <span className="text-3xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {uc.caseTag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {uc.title}
                </h3>
                <span className="text-2xs font-semibold text-slate-500 block mb-3">
                  Target: {uc.target}
                </span>

                <div className="flex flex-col gap-3 text-xs mb-4">
                  <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200/70 text-rose-900">
                    <span className="font-bold text-2xs uppercase tracking-wider block mb-0.5 text-rose-700">
                      The Threat Attack
                    </span>
                    <p className="text-2xs leading-relaxed">{uc.attackVector}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/70 text-emerald-950">
                    <span className="font-bold text-2xs uppercase tracking-wider block mb-0.5 text-emerald-700">
                      VoiceShield In-Call Mitigation
                    </span>
                    <p className="text-2xs leading-relaxed">{uc.defense}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-2xs">
                <span className="text-slate-400">Security Objective</span>
                <a
                  href="/call-history"
                  className="font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                >
                  <span>Review Threat Forensics</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
