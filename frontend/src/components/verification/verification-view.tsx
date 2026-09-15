"use client";

import React, { useState } from "react";
import { VerificationChallenge } from "@/types/dashboard";
import {
  ShieldCheck,
  KeyRound,
  PhoneCall,
  Smartphone,
  CheckCircle2,
  Send,
  Lock,
  UserCheck,
  Clock,
  XCircle,
} from "lucide-react";

interface VerificationCenterChallenge extends VerificationChallenge {
  resolutionNotes?: string;
  verifiedIdentity?: string;
}

export function VerificationView() {
  const [challenges, setChallenges] = useState<VerificationCenterChallenge[]>([
    {
      id: "CHL-2026-0891",
      timestamp: "Today, 18:25 UTC",
      callerName: "Rahul Sharma (Claimed)",
      callerPhone: "+91 98201 44521",
      challengeType: "OUT_OF_BAND_CALLBACK",
      status: "PASSED",
      riskLevel: "CRITICAL",
      operatorNotes: "Cellular callback to +91 98201 99999 confirmed legitimate CFO did not initiate inbound call. Attack thwarted.",
      respondedAt: "18:26 UTC",
      verifiedIdentity: "Rahul Sharma (Real CFO - Confirmed in Transit)",
    },
    {
      id: "CHL-2026-0884",
      timestamp: "Today, 15:10 UTC",
      callerName: "Sarah Lin",
      callerPhone: "+1 (555) 902-8811",
      challengeType: "SAFE_WORD",
      status: "PASSED",
      riskLevel: "LOW",
      operatorNotes: "Spoken safe word verified accurately against pre-shared hash in Trusted Vault. Dual-authorization approved.",
      respondedAt: "15:11 UTC",
      verifiedIdentity: "Sarah Lin (CFO)",
    },
    {
      id: "CHL-2026-0879",
      timestamp: "Yesterday, 21:40 UTC",
      callerName: "Unknown Inbound",
      callerPhone: "+1 (555) 334-0099",
      challengeType: "SAFE_WORD",
      status: "FAILED",
      riskLevel: "HIGH",
      operatorNotes: "Caller stated incorrect phrase twice and disconnected when prompted for supervisor callback.",
      respondedAt: "21:42 UTC",
    },
    {
      id: "CHL-2026-0865",
      timestamp: "Yesterday, 14:05 UTC",
      callerName: "Vendor Treasury Desk",
      callerPhone: "+44 20 7946 0912",
      challengeType: "STEP_UP_MFA",
      status: "EXPIRED",
      riskLevel: "MEDIUM",
      operatorNotes: "FIDO2 security key prompt timed out after 60 seconds without biometric tap.",
      respondedAt: "14:06 UTC",
    },
  ]);

  const [targetNumber, setTargetNumber] = useState("+91 98201 44521");
  const [callerNameInput, setCallerNameInput] = useState("Rahul Sharma (Claimed)");
  const [challengeType, setChallengeType] = useState<VerificationChallenge["challengeType"]>("OUT_OF_BAND_CALLBACK");
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const handleDispatchChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveMessage("Initiating cryptographic out-of-band challenge across isolated PSTN/Cellular line...");

    setTimeout(() => {
      const newChal: VerificationCenterChallenge = {
        id: `CHL-2026-${Math.floor(Math.random() * 900) + 100}`,
        timestamp: "Just now",
        callerName: callerNameInput,
        callerPhone: targetNumber,
        challengeType,
        status: "PENDING",
        riskLevel: "HIGH",
        operatorNotes: `Manual ${challengeType.replace("_", " ")} protocol triggered by Treasury desk operator.`,
      };

      setChallenges([newChal, ...challenges]);
      setActiveMessage(`${challengeType.replace("_", " ")} protocol successfully transmitted.`);
      setTimeout(() => setActiveMessage(null), 3000);
    }, 1200);
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case "SAFE_WORD":
        return <KeyRound className="w-4 h-4 text-amber-400" />;
      case "OUT_OF_BAND_CALLBACK":
        return <PhoneCall className="w-4 h-4 text-blue-400" />;
      default:
        return <Smartphone className="w-4 h-4 text-purple-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PASSED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-500/40 px-2.5 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> VERIFIED
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-rose-300 bg-rose-950/40 border border-rose-500/40 px-2.5 py-0.5 rounded">
            <XCircle className="w-3 h-3 text-rose-400" /> FAILED
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-soc-400 bg-soc-850 border border-soc-700 px-2.5 py-0.5 rounded">
            <Clock className="w-3 h-3" /> EXPIRED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-300 bg-amber-950/40 border border-amber-500/40 px-2.5 py-0.5 rounded">
            <Clock className="w-3 h-3 text-amber-400" /> IN PROGRESS
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header & Guidance Banner */}
      <div className="soc-panel p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-mono text-soc-100 tracking-tight">
                Out-of-Band Verification Center
              </h2>
              <p className="text-xs text-soc-400 font-mono">
                Cryptographic caller identity challenges, isolated callbacks, and dual-custody verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-soc-300">
            <span className="px-2.5 py-1 rounded bg-soc-800 border border-soc-700">
              Pass Rate: <strong className="text-emerald-400">92.4%</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-soc-800 border border-soc-700">
              Avg Challenge Latency: <strong className="text-soc-100">18.2s</strong>
            </span>
          </div>
        </div>

        {/* Guiding Principles Strip */}
        <div className="p-3.5 rounded-lg bg-soc-800/60 border border-soc-700/60 text-xs font-mono text-soc-300 space-y-1 leading-relaxed">
          <strong className="text-soc-100 block">Operator Guidance Protocol:</strong>
          VoiceShield prioritizes user empowerment over panic. When voice suspicion or urgency is flagged, do not accuse the caller. Calmly initiate an isolated cellular callback or request the pre-shared safe word. A genuine executive will gladly comply; an attacker relying on voice conversion tools will hang up.
        </div>
      </div>

      {/* Main Grid: Challenge Dispatcher (5 cols) + Verification Ledger (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Dispatch Out-of-Band Challenge */}
        <div className="lg:col-span-5 soc-panel p-4 sm:p-5 space-y-4">
          <div className="border-b border-soc-700/80 pb-3">
            <h3 className="text-sm font-bold text-soc-100 font-mono uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Issue Immediate Challenge</span>
            </h3>
            <p className="text-[11px] text-soc-400 font-mono">
              Execute an independent verification channel while maintaining the inbound call on standby
            </p>
          </div>

          <form onSubmit={handleDispatchChallenge} className="space-y-3.5 text-xs font-mono">
            <div>
              <label className="text-[11px] text-soc-300 block mb-1">Claimed Identity / Contact:</label>
              <input
                type="text"
                value={callerNameInput}
                onChange={(e) => setCallerNameInput(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-soc-800 border border-soc-700 text-soc-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-soc-300 block mb-1">Target Phone Number (or Enrolled Hardware Line):</label>
              <input
                type="text"
                value={targetNumber}
                onChange={(e) => setTargetNumber(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-soc-800 border border-soc-700 text-soc-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-soc-300 block mb-1">Preferred Verification Channel:</label>
              <select
                value={challengeType}
                onChange={(e) => setChallengeType(e.target.value as VerificationChallenge["challengeType"])}
                className="w-full px-3 py-2 rounded-lg bg-soc-800 border border-soc-700 text-soc-100 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="OUT_OF_BAND_CALLBACK">Preferred: Direct Hardware Line Callback (PSTN)</option>
                <option value="SAFE_WORD">Pre-Shared Verbal Safe Word (Vault Verification)</option>
                <option value="STEP_UP_MFA">Step-Up Push MFA (FIDO2 / Hardware Token)</option>
              </select>
            </div>

            {activeMessage && (
              <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/40 text-[11px] text-blue-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>{activeMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Transmit Isolated Challenge</span>
            </button>
          </form>
        </div>

        {/* Right: Active & Historical Challenges Log */}
        <div className="lg:col-span-7 soc-panel p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-soc-700/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-soc-100 font-mono uppercase tracking-wider">
                Verification Ledger &amp; Outcomes
              </h3>
              <p className="text-[11px] font-mono text-soc-400">
                Audited record of challenge dispatches and biometric resolutions
              </p>
            </div>
            <span className="text-[11px] font-mono text-soc-400">
              {challenges.length} Records Logged
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {challenges.map((chal) => (
              <div
                key={chal.id}
                className="p-3.5 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {getChallengeIcon(chal.challengeType)}
                    <span className="font-bold text-soc-100">{chal.callerName}</span>
                    <span className="text-[10px] text-soc-400">({chal.callerPhone})</span>
                  </div>

                  {getStatusBadge(chal.status)}
                </div>

                <p className="text-soc-300 text-[11px] leading-relaxed">
                  {chal.operatorNotes}
                </p>

                {chal.verifiedIdentity && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px]">
                    <UserCheck className="w-3 h-3 text-emerald-400" />
                    <span>Identity Verified: {chal.verifiedIdentity}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-soc-500 pt-2 border-t border-soc-700/40">
                  <span>ID: {chal.id} • Initiated: {chal.timestamp}</span>
                  {chal.respondedAt && <span>Resolved: {chal.respondedAt}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
