"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import {
  Shield,
  ShieldCheck,
  Lock,
  Server,
  Clock,
  Users,
  Trash2,
  Download,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export interface SecurityPrivacyScreenProps {
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
  className?: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  status: "AUTHORIZED" | "SIMULATED · ENFORCED" | "VERIFIED";
}

const AUDIT_ACTIVITY_LOG: AuditLogEntry[] = [
  {
    id: "DEMO-AUD-9042",
    timestamp: "Today, 15:32",
    actor: "VoiceShield Engine (Simulated)",
    actorRole: "Edge Policy Enforcement",
    action: "Quarantined 15s conditional incident audio snippet under Policy 4.1",
    resource: "Simulated Case: INC-2026-0042 (Synthetic Voice Test)",
    status: "SIMULATED · ENFORCED",
  },
  {
    id: "DEMO-AUD-9041",
    timestamp: "Today, 14:15",
    actor: "SOC Officer #104 (Demo)",
    actorRole: "Security Operations",
    action: "Pre-shared Safe Word challenged and verified for vendor disbursement",
    resource: "Demo Identity: Sarah Jenkins (VP Operations)",
    status: "VERIFIED",
  },
  {
    id: "DEMO-AUD-9039",
    timestamp: "Today, 09:12",
    actor: "Key Management Service (Demo)",
    actorRole: "Cryptographic Subsystem",
    action: "Periodic enclave integrity sync & voiceprint hash zeroization check",
    resource: "Simulated Hardware Security Module (Enclave Vault)",
    status: "AUTHORIZED",
  },
  {
    id: "DEMO-AUD-9034",
    timestamp: "Yesterday, 16:45",
    actor: "SecOps Admin (demo@enterprise.internal)",
    actorRole: "System Administrator",
    action: "Updated executive reference profile biometric threshold to 0.75 cosine",
    resource: "Demo Enclave Profile: Priya Nair (CEO Test)",
    status: "AUTHORIZED",
  },
];

export function SecurityPrivacyScreen({
  activeTab = "settings",
  onNavigateTab,
  className,
}: SecurityPrivacyScreenProps) {
  // Progressive disclosure accordions for technical/SIH details
  const [showTechnicalProcessing, setShowTechnicalProcessing] = useState(false);
  const [showTechnicalEnclave, setShowTechnicalEnclave] = useState(false);
  const [showTechnicalRetention, setShowTechnicalRetention] = useState(false);
  const [showTechnicalRBAC, setShowTechnicalRBAC] = useState(false);

  // User and Enterprise Privacy Controls State
  const [retentionPreset, setRetentionPreset] = useState<"standard" | "ephemeral" | "compliance">("standard");
  const [allowIncidentQuarantine, setAllowIncidentQuarantine] = useState(true);
  const [requireDualSignForensics, setRequireDualSignForensics] = useState(true);
  const [strictLocalEdgeOnly, setStrictLocalEdgeOnly] = useState(true);

  // Interactive Action Feedback
  const [purgedIdentity, setPurgedIdentity] = useState<string | null>(null);
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [exportedGdprArchive, setExportedGdprArchive] = useState(false);

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const handleNavigate = (tab: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
      return;
    }
    if (typeof window !== "undefined") {
      if (tab === "live-protection") window.location.href = "/";
      else if (tab === "call-history") window.location.href = "/call-history";
      else if (tab === "verification") window.location.href = "/verification";
      else if (tab === "reports" || tab === "incident") window.location.href = "/reports";
      else if (tab === "settings") window.location.href = "/settings";
      else if (tab === "overview") window.location.href = "/overview";
    }
  };

  const handleExportGdpr = () => {
    setExportedGdprArchive(true);
    setTimeout(() => setExportedGdprArchive(false), 3000);
  };

  const confirmPurge = () => {
    setPurgedIdentity("Rahul Sharma");
    setIsPurgeModalOpen(false);
    setTimeout(() => setPurgedIdentity(null), 5000);
  };

  return (
    <div className={cn("flex min-h-screen bg-slate-50 text-slate-900 antialiased font-sans", className)}>
      {/* 1. Left Executive Dark Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleNavigate}
        hasActiveThreat={true}
      />

      {/* 2. Main Workspace Canvas */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-7 gap-5 overflow-y-auto max-w-[1720px] mx-auto w-full">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Security &amp; Privacy
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span>Privacy-Preserving Architecture · Prototype Evaluation</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Transparent privacy principles, minimal raw-audio retention, edge-processing architecture, and configurable controls.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleExportGdpr}
              className="py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-xs flex items-center gap-1.5"
            >
              {exportedGdprArchive ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Compliance Package Exported</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                  <span>Export Privacy &amp; Compliance Package</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Confirmation Banner */}
        {purgedIdentity && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              Prototype simulation: Reference profile for demo identity <strong>{purgedIdentity}</strong> has been cleared. (In planned enterprise deployments, this triggers a hardware security enclave zeroization workflow).
            </span>
          </div>
        )}

        {/* Architecture Scope: Prototype vs Planned Capabilities */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                Architecture Scope: Current Prototype vs. Planned Capabilities
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded text-3xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
              Transparency Notice
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-50/80 border border-slate-200/80 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-900">
                  Active in Current Prototype
                </span>
              </div>
              <ul className="text-2xs text-slate-600 space-y-1 list-disc list-inside">
                <li>Real-time in-memory acoustic feature scoring (sliding-window analysis)</li>
                <li>Simulated multi-tier verification workflows (Trusted Callback, Safe Word, Step-up)</li>
                <li>Configurable operational retention rules and local audit logging</li>
                <li>Granular role-based access permission simulation</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50/80 border border-slate-200/80 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-900">
                  Designed / Planned Enterprise Capabilities
                </span>
              </div>
              <ul className="text-2xs text-slate-600 space-y-1 list-disc list-inside">
                <li>Hardware-enclave key sealing architecture (planned roadmap capability)</li>
                <li>Direct carrier SIP trunk caller verification (planned integration)</li>
                <li>Cryptographic media sanitization policies (planned automated workflow)</li>
                <li>Dual-custody hardware key enforcement for forensic review (planned policy)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PILLAR 1: WHAT DATA */}
        {/* Feature-only vs raw audio storage */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Cpu className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  1. What Data: Feature-Only Extraction vs. Raw Audio
                </h2>
                <span className="text-2xs text-slate-500">
                  In the current prototype, VoiceShield processes derived acoustic features in real time and does not persist conversational call recordings during standard operation.
                </span>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-center">
              Designed for Minimal Raw-Audio Retention
            </span>
          </div>

          {/* Normal User Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="font-bold text-slate-900">What We Extract (Acoustic Features)</span>
              </div>
              <p className="text-2xs text-slate-600 leading-relaxed">
                Incoming audio is converted in temporary memory into acoustic features (such as pitch, harmonics, and tone). The prototype records derived feature representations rather than conversational speech transcripts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-bold text-slate-900">What We Avoid Storing (Minimal Speech Storage)</span>
              </div>
              <p className="text-2xs text-slate-600 leading-relaxed">
                In standard operation and throughout this prototype, raw audio frames are processed in temporary memory and are not persisted to disk. Conversational recordings, voicemail logs, and full transcripts are not permanently stored.
              </p>
            </div>
          </div>

          {/* Progressive Disclosure: Technical Forensic Specifications */}
          <div className="border border-slate-200/70 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowTechnicalProcessing((prev) => !prev)}
              className="w-full px-4 py-2.5 bg-slate-50/80 hover:bg-slate-100/80 text-left flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-600">
                  Technical Details / Architecture: Feature Extractor Pipeline (SIH / SOC Audit)
                </span>
              </div>
              {showTechnicalProcessing ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {showTechnicalProcessing && (
              <div className="p-4 bg-white border-t border-slate-200/70 flex flex-col gap-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-2xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">Embedding Architecture</span>
                    <span className="text-slate-600">ECAPA-TDNN (512-dim L2-normalized vector)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">Spectral Resolution</span>
                    <span className="text-slate-600">80-channel log Mel-filterbank (25ms window / 10ms hop)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">Vector Representation</span>
                    <span className="text-slate-600">Derived acoustic feature vector; lossy projection with non-invertible phase discard</span>
                  </div>
                </div>
                <p className="text-3xs text-slate-500 leading-normal">
                  * Architecture Verification: Feature extraction aligns with ISO/IEC 19794-13 voice biometric interchange principles. Transcripts generated for live urgency analysis remain in volatile memory buffers and are cleared upon session termination.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PILLAR 2: WHERE IT IS PROCESSED */}
        {/* On-device/edge processing & hardware enclave */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Server className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  2. Where It Is Processed: Edge Gateways &amp; Enclave Boundary
                </h2>
                <span className="text-2xs text-slate-500">
                  Inference is engineered to run within enterprise network boundaries rather than consumer cloud endpoints.
                </span>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-center">
              Edge-Processing Architecture
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-slate-700" />
                <span className="font-bold text-slate-900">Edge PBX Gateway Inference</span>
              </div>
              <p className="text-2xs text-slate-600 leading-relaxed">
                Planned enterprise architecture: neural spoof detection runs locally on enterprise telephony gateways. The prototype evaluation target is sub-50ms inference on suitable local edge hardware.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="font-bold text-slate-900">Hardware-Enclave Storage</span>
              </div>
              <p className="text-2xs text-slate-600 leading-relaxed">
                Planned architecture: Executive reference voiceprints are designed to reside within isolated hardware security enclaves, ensuring baseline profiles are protected from general software or external network access.
              </p>
            </div>
          </div>

          {/* Progressive Disclosure: Enclave Boundary Audit Details */}
          <div className="border border-slate-200/70 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowTechnicalEnclave((prev) => !prev)}
              className="w-full px-4 py-2.5 bg-slate-50/80 hover:bg-slate-100/80 text-left flex items-center justify-between transition-colors"
            >
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-600">
                Technical Details / Architecture: Cryptographic Boundary &amp; Key Lifecycle (SIH / SOC Audit)
              </span>
              {showTechnicalEnclave ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {showTechnicalEnclave && (
              <div className="p-4 bg-white border-t border-slate-200/70 flex flex-col gap-2 text-2xs text-slate-600">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-800 block">Enclave Cryptography</span>
                    <span>AES-256-GCM authenticated payload encryption (Planned FIPS 140-3 HSM architecture)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-800 block">In-Flight Transport</span>
                    <span>mTLS 1.3 with Curve25519 forward secrecy between SIP gateways</span>
                  </div>
                </div>
                <p className="text-3xs text-slate-500 pt-1">
                  Private root keys are scheduled for rotation every 90 days in planned enterprise deployments. Voice baseline matching occurs within a memory-isolated execution boundary (Intel SGX / ARM TrustZone).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PILLAR 3: HOW LONG IT IS RETAINED */}
        {/* Retention policy, ephemeral buffers, & forensic hold */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Clock className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  3. How Long It Is Retained: Configurable Retention Rules
                </h2>
                <span className="text-2xs text-slate-500">
                  Configurable lifecycle policies govern temporary memory buffers, operational metadata, and incident evidence.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-center">
              <span className="text-2xs text-slate-500 font-medium">Policy:</span>
              <span className="px-2.5 py-0.5 rounded-md text-2xs font-bold bg-slate-100 text-slate-800 border border-slate-200 uppercase">
                {retentionPreset} Mode
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Stage A */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Routine Call Audio</span>
                <span className="text-2xs font-mono font-bold text-emerald-700">6.0s (Prototype Buffer)</span>
              </div>
              <p className="text-2xs text-slate-600 leading-normal">
                Sliding-window acoustic buffer lives temporarily in volatile memory during real-time scoring. Memory buffers are cleared immediately after scoring, avoiding persistent disk storage.
              </p>
            </div>

            {/* Stage B */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Operational Telemetry</span>
                <span className="text-2xs font-mono font-bold text-blue-700">30 Days (Configurable)</span>
              </div>
              <p className="text-2xs text-slate-600 leading-normal">
                High-level metadata: call timestamp, masked caller ID, verification outcome, and risk score. No conversational audio is kept. Automatically purged based on policy.
              </p>
            </div>

            {/* Stage C */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Confirmed Threat Forensics</span>
                <span className="text-2xs font-mono font-bold text-rose-700">90 Days (Planned Policy)</span>
              </div>
              <p className="text-2xs text-slate-600 leading-normal">
                Planned capability: an authorized 15-second acoustic snippet may be quarantined for confirmed attacks under organizational policy. In this prototype, audio retention is simulated or disabled.
              </p>
            </div>
          </div>

          {/* Retention Preset Selector */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">
                Enterprise Telemetry Retention Lifespan
              </span>
              <span className="text-2xs text-slate-500">
                Adjust organizational retention rules to align with internal compliance and privacy frameworks.
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 text-xs shadow-xs shrink-0">
              <button
                type="button"
                onClick={() => setRetentionPreset("ephemeral")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors text-2xs font-semibold",
                  retentionPreset === "ephemeral"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                Strict Ephemeral (7 Days)
              </button>
              <button
                type="button"
                onClick={() => setRetentionPreset("standard")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors text-2xs font-semibold",
                  retentionPreset === "standard"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                Standard Enterprise (30 Days)
              </button>
              <button
                type="button"
                onClick={() => setRetentionPreset("compliance")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors text-2xs font-semibold",
                  retentionPreset === "compliance"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                High Compliance (90 Days)
              </button>
            </div>
          </div>

          {/* Progressive Disclosure: Automated Data Shredding Policy */}
          <div className="border border-slate-200/70 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowTechnicalRetention((prev) => !prev)}
              className="w-full px-4 py-2.5 bg-slate-50/80 hover:bg-slate-100/80 text-left flex items-center justify-between transition-colors"
            >
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-600">
                Technical Details / Architecture: Sanitization &amp; Shredding Standards (SIH / SOC Audit)
              </span>
              {showTechnicalRetention ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {showTechnicalRetention && (
              <div className="p-4 bg-white border-t border-slate-200/70 text-2xs text-slate-600 leading-normal">
                <p>
                  At expiration of the retention window, forensic artifacts undergo automated sanitization aligned with <strong>NIST SP 800-88 Rev. 1 cryptographic erasure guidelines</strong>. DEKs are deleted from hardware keyrings, rendering historical blocks mathematically unrecoverable.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PILLAR 4: WHO CAN ACCESS IT */}
        {/* RBAC permissions & immutable SOC audit activity log */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Users className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  4. Who Can Access It: Strict Role Permissions &amp; Audit Trail
                </h2>
                <span className="text-2xs text-slate-500">
                  Granular least-privilege access enforcement and append-only administrative logging.
                </span>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 self-start sm:self-center">
              Dual-Sign Policy · Planned
            </span>
          </div>

          {/* Role-Based Permissions Table */}
          <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-3xs uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3.5">Enterprise Role</th>
                  <th className="py-2.5 px-3.5">Risk Scores</th>
                  <th className="py-2.5 px-3.5">Incident Forensics</th>
                  <th className="py-2.5 px-3.5">Biometric Enrollment</th>
                  <th className="py-2.5 px-3.5">Safe Word Rotation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-2xs text-slate-700">
                <tr>
                  <td className="py-2.5 px-3.5 font-bold text-slate-900">Standard Call Participant</td>
                  <td className="py-2.5 px-3.5 text-emerald-700 font-semibold">Self-Session Only</td>
                  <td className="py-2.5 px-3.5 text-slate-400">No Access</td>
                  <td className="py-2.5 px-3.5 text-slate-400">No Access</td>
                  <td className="py-2.5 px-3.5 text-slate-400">No Access</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3.5 font-bold text-slate-900">Tier-1 SOC Operator</td>
                  <td className="py-2.5 px-3.5 text-emerald-700 font-semibold">Read All Signals</td>
                  <td className="py-2.5 px-3.5 text-amber-700 font-semibold">Metadata Only</td>
                  <td className="py-2.5 px-3.5 text-slate-400">No Access</td>
                  <td className="py-2.5 px-3.5 text-slate-400">No Access</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3.5 font-bold text-slate-900">Security Officer / SIH Admin</td>
                  <td className="py-2.5 px-3.5 text-emerald-700 font-semibold">Full Access</td>
                  <td className="py-2.5 px-3.5 text-emerald-700 font-semibold">Dual-Sign Required</td>
                  <td className="py-2.5 px-3.5 text-emerald-700 font-semibold">Enroll &amp; Recalibrate</td>
                  <td className="py-2.5 px-3.5 text-emerald-700 font-semibold">Hardware Key Vault</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Immutable Audit Activity Feed */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  Recent Security &amp; Privacy Audit Activity
                </span>
                <span className="px-1.5 py-0.2 rounded text-3xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  Simulated Demo Log
                </span>
              </div>
              <span className="text-3xs text-slate-400">
                Demonstration activity feed · 4 simulated events
              </span>
            </div>

            <div className="space-y-2">
              {AUDIT_ACTIVITY_LOG.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-2xs"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-3xs font-semibold text-slate-400">[{entry.id}]</span>
                      <span className="font-mono font-bold text-slate-600">{entry.timestamp}</span>
                      <span className="font-bold text-slate-900">{entry.actor}</span>
                      <span className="text-3xs text-slate-400">({entry.actorRole})</span>
                    </div>
                    <span className="text-slate-600">{entry.action}</span>
                    <span className="text-3xs font-mono text-slate-500">{entry.resource}</span>
                  </div>

                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-3xs font-bold self-start sm:self-center shrink-0",
                      entry.status === "SIMULATED · ENFORCED"
                        ? "bg-rose-100 text-rose-800"
                        : entry.status === "VERIFIED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-700"
                    )}
                  >
                    {entry.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Progressive Disclosure: Dual-Sign Custody Technical Policy */}
          <div className="border border-slate-200/70 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowTechnicalRBAC((prev) => !prev)}
              className="w-full px-4 py-2.5 bg-slate-50/80 hover:bg-slate-100/80 text-left flex items-center justify-between transition-colors"
            >
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-600">
                Technical Details / Architecture: Access Verification Policy (SIH / SOC Audit)
              </span>
              {showTechnicalRBAC ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {showTechnicalRBAC && (
              <div className="p-4 bg-white border-t border-slate-200/70 text-2xs text-slate-600 leading-normal">
                <p>
                  Access to decrypted forensic audio snippets requires concurrent approval from both the <strong>On-Duty SOC Supervisor</strong> and the <strong>Designated Enterprise Privacy Officer</strong> via FIDO2 WebAuthn hardware keys.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PILLAR 5: WHAT THE USER CAN CONTROL */}
        {/* Biometric baseline purge, forensic quarantine toggle, & privacy rights */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                <Trash2 className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  5. What You Can Control: Privacy Preferences &amp; Biometric Rights
                </h2>
                <span className="text-2xs text-slate-500">
                  Granular toggles to govern data retention, forensic quarantines, and right-to-erasure workflows.
                </span>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-center">
              Privacy-Preserving Design
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Control 1: Forensic Quarantining Toggle */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-slate-900">
                  Preserve Evidence Snippet on Confirmed Threat Containment (Planned Policy)
                </span>
                <p className="text-2xs text-slate-600 leading-normal max-w-3xl">
                  When VoiceShield pauses a high-risk transaction under Policy 4.1, evidence preservation may be enabled according to authorized organizational policy. In the current prototype, audio retention is simulated or disabled.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAllowIncidentQuarantine((prev) => !prev)}
                className={cn(
                  "py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 shrink-0 self-end sm:self-center",
                  allowIncidentQuarantine
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                )}
              >
                {allowIncidentQuarantine ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Preservation Policy · Planned</span>
                  </>
                ) : (
                  <span>Preservation Disabled</span>
                )}
              </button>
            </div>

            {/* Control 2: Dual-Sign Requirement Toggle */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-slate-900">
                  Dual-Authorization Requirement for Forensic Audio Playback (Planned Policy)
                </span>
                <p className="text-2xs text-slate-600 leading-normal max-w-3xl">
                  Planned capability: require two independent security officer approvals before quarantined forensic audio waveforms can be reviewed in security investigations.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRequireDualSignForensics((prev) => !prev)}
                className={cn(
                  "py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 shrink-0 self-end sm:self-center",
                  requireDualSignForensics
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                )}
              >
                {requireDualSignForensics ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Dual-Sign Policy · Planned</span>
                  </>
                ) : (
                  <span>Single Sign-off Allowed</span>
                )}
              </button>
            </div>

            {/* Control 3: Strict Edge Isolation */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-slate-900">
                  Local Edge Telephony Air-Gap Mode
                </span>
                <p className="text-2xs text-slate-600 leading-normal max-w-3xl">
                  Configure telephony gateways to run in local edge telephony air-gap mode, blocking external telemetry pings and cloud sync.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStrictLocalEdgeOnly((prev) => !prev)}
                className={cn(
                  "py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 shrink-0 self-end sm:self-center",
                  strictLocalEdgeOnly
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                )}
              >
                {strictLocalEdgeOnly ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Air-Gap Mode · Configurable</span>
                  </>
                ) : (
                  <span>Standard Network Mode</span>
                )}
              </button>
            </div>

            {/* Control 4: Right to Erasure / Biometric Baseline Purge */}
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">
                    Purge Biometric Voice Baseline (Right-to-Erasure Workflow)
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-3xs font-bold bg-rose-200 text-rose-800">
                    IRREVERSIBLE ACTION
                  </span>
                </div>
                <p className="text-2xs text-rose-900 leading-normal max-w-3xl">
                  Demonstration workflow: In planned enterprise deployments, this requests zeroization of an executive&apos;s reference baseline from the hardware security enclave. In this prototype, clearing the baseline resets local verification profiles.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPurgeModalOpen(true)}
                className="py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 shrink-0 self-end sm:self-center"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Purge Voice Baseline</span>
              </button>
            </div>

            {/* Control 5: Active Prototype Session & Sign Out */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">
                    Active Console Session
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-3xs font-bold bg-blue-100 text-blue-800">
                    {user?.roleTitle || "Security Officer"}
                  </span>
                </div>
                <p className="text-2xs text-slate-600 leading-normal max-w-3xl">
                  Logged in as {user?.name || "Vikram Malhotra"} ({user?.email || "officer@voiceshield.internal"}). Terminating your prototype session clears stored authentication tokens and returns you to the login screen.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 shrink-0 self-end sm:self-center"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out of Session</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Navigation Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>VoiceShield Telephony Security &amp; Privacy Architecture · Designed for Enterprise Telephony Defense</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleNavigate("overview")}
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors flex items-center gap-1"
            >
              <span>Protection Overview</span>
              <ArrowRight className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("trusted-identity")}
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors flex items-center gap-1"
            >
              <span>Trusted Identities</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Biometric Purge */}
      {isPurgeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-rose-100 text-rose-700">
                <Trash2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-slate-900">
                  Confirm Biometric Hash Purge
                </h3>
                <span className="text-2xs text-slate-500">
                  Right-to-Erasure Workflow
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-normal">
              Simulate reference profile purge for demo profile <strong>Rahul Sharma (Demo CFO)</strong>? In planned enterprise deployments, this permanently zeroizes the voice baseline in the hardware security enclave. In this prototype, it resets local matching state.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsPurgeModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPurge}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs"
              >
                Simulate Zeroize &amp; Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
