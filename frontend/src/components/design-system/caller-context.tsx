"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Phone,
  Server,
  ShieldCheck,
  KeyRound,
  AlertTriangle,
  Fingerprint,
  ExternalLink,
} from "lucide-react";
import { ModalDialog } from "./modal-dialog";
import { cn } from "@/lib/utils";

export interface CallerContextProps {
  callerName: string;
  callerRole: string;
  callerNumber: string;
  telephonyTrunk?: string;
  carrier?: string;
  stirShaken?: string;
  trustStatus?: "VERIFIED_CONTACT" | "UNVERIFIED" | "SUSPECTED_SPOOF";
  biometricEnrolled?: boolean;
  safeWordConfigured?: boolean;
  sensitiveAction?: string;
  sensitiveActionRisk?: "NONE" | "ELEVATED" | "HIGH" | "CRITICAL" | "PROTECTED";
  className?: string;
}

export function CallerContext({
  callerName,
  callerRole,
  callerNumber,
  telephonyTrunk = "SIP-MUM-01 (Inbound Gateway)",
  carrier = "VoIP Interconnect",
  stirShaken = "B (Partial)",
  trustStatus = "VERIFIED_CONTACT",
  biometricEnrolled = true,
  safeWordConfigured = true,
  sensitiveAction = "Standard Administrative Inquiry",
  sensitiveActionRisk = "NONE",
  className,
}: CallerContextProps) {
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <div
      className={cn(
        "soc-panel p-4 font-sans text-xs flex flex-col justify-between space-y-4",
        className
      )}
    >
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-soc-700/60">
          <div className="flex items-center gap-2 text-soc-300 font-semibold tracking-tight text-[11px] font-mono uppercase">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Caller Identity &amp; Baseline</span>
          </div>
          <span
            className={cn(
              "text-[10px] px-2 py-0.5 rounded border uppercase font-mono font-bold tracking-wide",
              trustStatus === "VERIFIED_CONTACT"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : trustStatus === "SUSPECTED_SPOOF"
                ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                : "bg-soc-800 text-soc-400 border-soc-700"
            )}
          >
            {trustStatus === "VERIFIED_CONTACT"
              ? "Trusted Identity"
              : trustStatus === "SUSPECTED_SPOOF"
              ? "Suspected Spoof"
              : "Unverified Line"}
          </span>
        </div>

        {/* Primary Identity Presentation */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase text-soc-500 font-semibold">Claimed Inbound Identity</div>
          <div className="text-base font-bold text-white tracking-tight">
            {callerName}
          </div>
          <div className="text-soc-300 text-xs font-medium">{callerRole}</div>
          <div className="flex items-center gap-1.5 text-soc-400 text-xs pt-0.5 font-mono">
            <Phone className="w-3.5 h-3.5 text-soc-500" />
            <span>{callerNumber}</span>
          </div>
        </div>

        {/* Biometric Trust Baseline - Clean Structural Group */}
        <div className="pt-2 border-t border-soc-700/60 space-y-2">
          <div className="text-[10px] font-mono uppercase text-soc-400 font-semibold tracking-wider flex items-center justify-between">
            <span>Identity Vault Baseline</span>
            <span className="text-emerald-400 text-[9px] font-bold">VERIFIED</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-soc-300">
              <span className="flex items-center gap-1.5 text-soc-400">
                <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
                <span>Reference Voiceprint:</span>
              </span>
              <span className="font-mono text-soc-100 font-medium">
                {biometricEnrolled ? "Enrolled (30s)" : "Not Enrolled"}
              </span>
            </div>

            <div className="flex items-center justify-between text-soc-300">
              <span className="flex items-center gap-1.5 text-soc-400">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Pre-Shared Safe Word:</span>
              </span>
              <span className="font-mono text-soc-100 font-medium">
                {safeWordConfigured ? "Configured" : "None"}
              </span>
            </div>

            <div className="flex items-center justify-between text-soc-300">
              <span className="flex items-center gap-1.5 text-soc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Disbursement Limit:</span>
              </span>
              <span className="font-mono text-soc-100 font-medium">&le; $10,000</span>
            </div>
          </div>
        </div>

        {/* Telephony Routing & Ingress Context */}
        <div className="pt-2 border-t border-soc-700/60 space-y-2">
          <div className="text-[10px] font-mono uppercase text-soc-500 font-semibold tracking-wider">Telephony Ingress Attributes</div>
          <div className="space-y-1.5 text-xs text-soc-300">
            <div className="flex items-center justify-between">
              <span className="text-soc-400 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-soc-500" /> Trunk:
              </span>
              <span className="font-mono text-soc-200 text-[11px]">{telephonyTrunk}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-soc-400">Carrier Origin:</span>
              <span className="font-mono text-soc-200 text-[11px]">{carrier}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-soc-400">STIR/SHAKEN:</span>
              <span className="font-mono text-amber-400 font-semibold text-[11px]">{stirShaken}</span>
            </div>
          </div>
        </div>

        {/* Sensitive Action / Attempted Directive */}
        <div
          className={cn(
            "p-3 rounded border space-y-1 text-xs transition-colors",
            sensitiveActionRisk === "CRITICAL"
              ? "bg-rose-950/20 border-rose-500/40 text-rose-200"
              : sensitiveActionRisk === "HIGH"
              ? "bg-orange-950/20 border-orange-500/40 text-orange-200"
              : sensitiveActionRisk === "ELEVATED"
              ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
              : sensitiveActionRisk === "PROTECTED"
              ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
              : "bg-soc-900/50 border-soc-750 text-soc-300"
          )}
        >
          <div className="flex items-center gap-1.5 font-mono font-bold uppercase text-[10px]">
            {sensitiveActionRisk !== "NONE" && <AlertTriangle className="w-3 h-3 flex-shrink-0" />}
            <span>Attempted Directive:</span>
          </div>
          <p className="leading-snug text-[11px] font-sans">{sensitiveAction}</p>
        </div>
      </div>

      {/* Progressive Disclosure Action */}
      <button
        type="button"
        onClick={() => setProfileModalOpen(true)}
        className="w-full py-2 rounded bg-soc-800 hover:bg-soc-750 text-soc-300 hover:text-white border border-soc-700 text-xs font-mono font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <span>View Vault Profile</span>
        <ExternalLink className="w-3 h-3 text-soc-400" />
      </button>

      {/* Biometric Profile Modal Dialog */}
      <ModalDialog
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title={`Identity Vault: ${callerName}`}
        maxWidth="md"
      >
        <div className="space-y-4 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-soc-850 border border-soc-700 space-y-2">
            <div className="flex justify-between text-soc-400">
              <span>Full Name:</span>
              <strong className="text-white">{callerName}</strong>
            </div>
            <div className="flex justify-between text-soc-400">
              <span>Corporate Designation:</span>
              <span className="text-soc-200">{callerRole}</span>
            </div>
            <div className="flex justify-between text-soc-400">
              <span>Verified Hardware Number:</span>
              <strong className="text-emerald-400">{callerNumber}</strong>
            </div>
            <div className="flex justify-between text-soc-400">
              <span>Enrollment Timestamp:</span>
              <span className="text-soc-300">2026-01-15 09:30 UTC</span>
            </div>
            <div className="flex justify-between text-soc-400">
              <span>Reference Embedding Hash:</span>
              <span className="text-[10px] text-soc-300 font-mono">
                sha256:e8f2...b419 (192-dim ECAPA-TDNN)
              </span>
            </div>
            <div className="flex justify-between text-soc-400">
              <span>Cosine Acceptance Threshold:</span>
              <span className="text-soc-200">&ge; 0.75</span>
            </div>
            <div className="flex justify-between text-soc-400">
              <span>Pre-Shared Safe Word:</span>
              <span className="text-amber-400 font-bold">COBALT-ORION-77</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-soc-850/80 border border-soc-700 text-soc-300 text-[11px] leading-relaxed">
            <strong className="text-white block mb-1">Corporate Wire Policy 4.1:</strong>
            All wire releases exceeding $10,000 verbally initiated over telephone lines require pre-shared safe word confirmation. Voice biometric matching alone does not authorize override.
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
