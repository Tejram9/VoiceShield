"use client";

import React from "react";
import {
  Cpu,
  Server,
  Trash2,
  Clock,
  ArrowRight,
  FileCheck2,
} from "lucide-react";

export function LandingPrivacyDesign() {
  const privacyPillars = [
    {
      title: "Minimal Speech Storage",
      subtitle: "Minimal Raw-Audio Retention · Prototype",
      description:
        "In standard operation and throughout this prototype, raw audio frames are processed in temporary volatile memory and are not persisted to disk. Conversational recordings, voicemail logs, and full transcripts are not permanently stored.",
      badge: "Volatile Memory Processing",
      icon: <Clock className="h-5 w-5 text-emerald-600" />,
    },
    {
      title: "Derived Feature Extraction",
      subtitle: "Acoustic Features, Not Recordings",
      description:
        "Audio is transformed into lossy acoustic feature representations (pitch, harmonics, spectral envelope). The system processes derived feature representations rather than conversational speech transcripts.",
      badge: "Derived Feature Extraction",
      icon: <Cpu className="h-5 w-5 text-blue-600" />,
    },
    {
      title: "Edge Boundary Isolation",
      subtitle: "Confined to Internal Telephony",
      description:
        "Planned architecture: neural spoof scoring is engineered to execute locally on enterprise PBX gateways, keeping voice data confined within enterprise network perimeters rather than third-party consumer cloud APIs.",
      badge: "Edge Architecture",
      icon: <Server className="h-5 w-5 text-indigo-600" />,
    },
    {
      title: "Right-to-Erasure & Zeroization",
      subtitle: "Planned Enclave Lifecycles",
      description:
        "Demonstration workflow: in this prototype, clearing reference voiceprints resets local matching state. In planned enterprise deployments, this triggers hardware security enclave zeroization workflows.",
      badge: "Erasure Workflow",
      icon: <Trash2 className="h-5 w-5 text-rose-600" />,
    },
  ];

  return (
    <section id="privacy" className="py-16 md:py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-2xs font-bold uppercase tracking-wider mb-3">
            Privacy-Preserving Architecture
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Security Without Mass Surveillance
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Enterprise voice security must never compromise employee confidentiality or regulatory compliance. VoiceShield protects communications without hoarding personal voice recordings.
          </p>
        </div>

        {/* 4 Privacy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {privacyPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    {pillar.icon}
                  </div>
                  <span className="text-3xs font-bold uppercase tracking-wider text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {pillar.title}
                </h3>
                <span className="text-2xs font-semibold text-blue-700 block mb-2">
                  {pillar.subtitle}
                </span>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Privacy Architecture Linkout Banner */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">
                Inspect the Full 5-Pillar Security &amp; Privacy Architecture
              </span>
              <span className="text-2xs text-slate-500">
                Detailed documentation covering What Data, Where Processed, Retention Rules, RBAC Permissions, and Right-to-Erasure Controls.
              </span>
            </div>
          </div>

          <a
            href="/security-privacy"
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View Security &amp; Privacy Center</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
