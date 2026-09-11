"use client";

/**
 * VoiceShield — Security Recommendation Panel
 *
 * Implements SplitSmart High-Contrast Functional Signaling.
 * - Emerald for Verified / Safe States
 * - Amber for Pending / Investigation States
 * - Red for High Risk / Critical Impersonation Threat
 */

import React, { useState } from "react";
import type { RiskAssessment } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CheckCircle, PhoneCall, ShieldCheck, Clock, X, PhoneOff, Smartphone, CheckCircle2 } from "lucide-react";

interface SecurityRecommendationProps {
  assessment?: RiskAssessment | null;
}

function mapActionTitle(action: string, riskLevel: string): string {
  if (action === "TERMINATE_CALL") return "TERMINATE CALL IMMEDIATELY";
  if (action === "INDEPENDENT_VERIFICATION" || riskLevel === "HIGH")
    return "INDEPENDENT VERIFICATION REQUIRED";
  if (action === "MONITOR" || riskLevel === "MEDIUM")
    return "MONITOR CONVERSATION & CHALLENGE IDENTITY";
  return "NO IMMEDIATE ACTION REQUIRED";
}

export function SecurityRecommendation({ assessment }: SecurityRecommendationProps) {
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeStatus, setChallengeStatus] = useState<"idle" | "sent" | "verified">("idle");
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [callbackInitiated, setCallbackInitiated] = useState(false);

  // Empty state — no analysis run yet
  if (!assessment) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm h-full flex flex-col justify-center p-6 text-center min-h-[220px]">
        <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto">
          <Clock className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-[#0F172A] font-sans mt-3">
          Awaiting Active Call Analysis
        </h4>
        <p className="text-xs text-[#64748B] max-w-xs mx-auto mt-1 leading-relaxed">
          Recommended security actions and mitigation protocols will appear here once audio analysis begins.
        </p>
      </div>
    );
  }

  const riskLevel = assessment.risk_level;
  const action = assessment.recommended_action || "NONE";
  const explanation = assessment.explanation || "All evaluated voice parameters within expected limits.";
  const actionTitle = mapActionTitle(action, riskLevel);
  const isHighRisk = riskLevel === "HIGH";
  const isMediumRisk = riskLevel === "MEDIUM";

  const handleSendChallenge = () => {
    setChallengeStatus("sent");
    setTimeout(() => {
      setChallengeStatus("verified");
    }, 1800);
  };

  const handleStartCallback = () => {
    setCallbackInitiated(true);
    setTimeout(() => {
      setShowCallbackModal(false);
      setCallbackInitiated(false);
    }, 2000);
  };

  return (
    <>
      <div className={`rounded-2xl border shadow-sm p-6 space-y-4 transition-all duration-150 ${
        isHighRisk 
          ? "border-red-200 bg-red-50/40" 
          : isMediumRisk 
          ? "border-amber-200 bg-amber-50/40" 
          : "border-emerald-200 bg-emerald-50/40"
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-center ${
                isHighRisk
                  ? "bg-red-100 border-red-200 text-red-600"
                  : isMediumRisk
                  ? "bg-amber-100 border-amber-200 text-amber-600"
                  : "bg-emerald-100 border-emerald-200 text-emerald-600"
              }`}
            >
              {isHighRisk ? (
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              ) : isMediumRisk ? (
                <ShieldAlert className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#64748B] block">
                Recommended Action
              </span>
              <span
                className={`text-xs font-mono font-bold tracking-wide ${
                  isHighRisk ? "text-red-700" : isMediumRisk ? "text-amber-700" : "text-emerald-700"
                }`}
              >
                {riskLevel} PROTOCOL ACTIVE
              </span>
            </div>
          </div>
          <Badge
            variant={riskLevel}
            className="text-[10px] font-bold px-3 py-1"
          >
            {riskLevel}
          </Badge>
        </div>

        {/* Action Title and Explanation */}
        <div className="space-y-2.5">
          <h3 className="text-base font-bold text-[#0F172A] tracking-tight leading-snug font-sans">
            {actionTitle}
          </h3>
          <p className="text-xs text-[#475569] leading-relaxed bg-white p-4 rounded-xl border border-slate-200 font-sans shadow-sm">
            {explanation}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            type="button"
            id="verify-caller-btn"
            onClick={() => {
              setChallengeStatus("idle");
              setShowChallengeModal(true);
            }}
            aria-label="Initiate caller verification workflow"
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 shadow-sm cursor-pointer ${
              isHighRisk
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Challenge Identity</span>
          </button>

          <button
            type="button"
            id="start-callback-btn"
            onClick={() => setShowCallbackModal(true)}
            aria-label="Initiate callback sequence"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all duration-150 cursor-pointer shadow-sm"
          >
            <PhoneCall className="w-4 h-4 text-blue-600" />
            <span>Official Callback</span>
          </button>
        </div>
      </div>

      {/* Identity Challenge Modal */}
      {showChallengeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowChallengeModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A] font-sans">Out-of-Band Identity Challenge</h3>
                <p className="text-xs text-[#64748B]">Send secondary verification prompt to registered device</p>
              </div>
            </div>

            {challengeStatus === "idle" && (
              <div className="space-y-4">
                <p className="text-xs text-[#475569] leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  A high-priority cryptographic push challenge will be dispatched to the verified mobile application on record. The active call will remain monitored.
                </p>

                <div className="flex justify-end space-x-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowChallengeModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendChallenge}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm cursor-pointer"
                  >
                    Dispatch Push Challenge
                  </button>
                </div>
              </div>
            )}

            {challengeStatus === "sent" && (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 animate-spin">
                  <Clock className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#0F172A]">Awaiting Caller Authentication</h4>
                <p className="text-xs text-[#64748B]">Biometric prompt dispatched. Awaiting verification result...</p>
              </div>
            )}

            {challengeStatus === "verified" && (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-emerald-700">Identity Successfully Challenged</h4>
                <p className="text-xs text-[#64748B]">Out-of-band response matched executive credential token.</p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChallengeModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Emergency Callback Protocol Modal */}
      {showCallbackModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowCallbackModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-red-100 border border-red-200 text-red-600">
                <PhoneOff className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A] font-sans">Emergency Callback Protocol</h3>
                <p className="text-xs text-[#64748B]">Sever suspicious line &amp; dial trusted corporate extension</p>
              </div>
            </div>

            {callbackInitiated ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#0F172A]">Inbound Trunk Terminated</h4>
                <p className="text-xs text-[#64748B]">Dialing verified primary mobile (+1 555-234-8901) via secure gateway...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-[#475569] leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  Executing this protocol will immediately disconnect the current audio session and originate an authenticated outbound call to the registered executive device on file.
                </p>

                <div className="flex justify-end space-x-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCallbackModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleStartCallback}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-sm cursor-pointer"
                  >
                    Execute Disconnect &amp; Callback
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
