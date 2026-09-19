"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import {
  PhoneCall,
  KeyRound,
  Smartphone,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  User,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  Lock,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  SlidersHorizontal,
  Bell,
} from "lucide-react";

export type VerificationMethod = "callback" | "safeword" | "mfa";
export type VerificationStep = "reason" | "method" | "progress" | "result";
export type VerificationOutcome = "pending" | "passed" | "failed";

export interface VerificationScreenProps {
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
  callerName?: string;
  callerRole?: string;
  callerPhone?: string;
  transferAmount?: string;
  onVerificationComplete?: (passed: boolean) => void;
  className?: string;
}

export function VerificationScreen({
  activeTab = "verification",
  onNavigateTab,
  callerName = "Rahul Sharma",
  callerRole = "Chief Financial Officer",
  callerPhone = "+91 98765 43210",
  transferAmount = "$45,000",
  onVerificationComplete,
  className,
}: VerificationScreenProps) {
  // Primary Progressive Flow State
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod>("callback");
  const [currentStep, setCurrentStep] = useState<VerificationStep>("reason");
  const [outcome, setOutcome] = useState<VerificationOutcome>("pending");
  const [outcomeMessage, setOutcomeMessage] = useState<string>("");

  // Collapsible policy details state
  const [showPolicyDetails, setShowPolicyDetails] = useState<boolean>(false);
  const [showResultPolicyDetails, setShowResultPolicyDetails] = useState<boolean>(false);

  // Safe word state
  const [safeWordInput, setSafeWordInput] = useState<string>("");
  const expectedSafeWord = "COBALT-ORION-77";

  // Simulate starting verification
  const handleStartVerification = () => {
    setCurrentStep("progress");
    setOutcome("pending");
  };

  // Resolve verification outcome
  const handleResolve = (passed: boolean, message: string) => {
    setOutcome(passed ? "passed" : "failed");
    setOutcomeMessage(message);
    setCurrentStep("result");
    onVerificationComplete?.(passed);
  };

  const handleSafeWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!safeWordInput.trim()) return;

    if (safeWordInput.trim().toUpperCase() === expectedSafeWord) {
      handleResolve(
        true,
        "Pre-shared corporate safe word accurately matched Corporate Identity Vault record."
      );
    } else {
      handleResolve(
        false,
        "Invalid safe word provided. Caller failed cryptographic identity challenge."
      );
    }
  };

  const handleReset = () => {
    setCurrentStep("reason");
    setOutcome("pending");
    setOutcomeMessage("");
    setSafeWordInput("");
    setSelectedMethod("callback");
  };

  return (
    <div className={cn("flex min-h-screen bg-slate-50 text-slate-900 antialiased font-sans", className)}>
      {/* 1. Executive Dark Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onNavigateTab}
        hasActiveThreat={true}
      />

      {/* 2. Main Workspace Canvas */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-7 gap-5 overflow-y-auto max-w-[1720px] mx-auto w-full">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Caller Verification
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>Independent Protocol Active</span>
            </span>
          </div>

          <div className="flex items-center gap-3.5 flex-wrap">
            {/* Secondary Scenario Label */}
            <div className="flex items-center gap-1.5 bg-slate-100/70 px-2 py-0.5 rounded-md border border-slate-200/50 text-2xs text-slate-400">
              <SlidersHorizontal className="h-3 w-3 text-slate-400" />
              <span className="text-slate-400">Incident INC-2026-0042</span>
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {/* Security Officer Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200/60">
              <div className="h-7 w-7 rounded-full bg-slate-200/80 text-slate-600 flex items-center justify-center font-semibold text-xs shrink-0">
                <User className="h-3.5 w-3.5 text-slate-600" />
              </div>
              <div className="flex flex-col text-left hidden sm:flex">
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  Security Officer
                </span>
                <span className="text-2xs text-slate-400 leading-tight">
                  SIH Operations
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400 hidden sm:inline" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PROMINENT TOP CONTEXT: WHY VERIFICATION IS REQUIRED */}
        {/* ========================================================================= */}
        <div className="w-full bg-white border border-slate-200/70 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200/70 shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-2xs font-bold uppercase tracking-wider text-amber-700">
                  WHY VERIFICATION IS REQUIRED
                </span>
                <span className="text-2xs text-slate-300">·</span>
                <span className="text-2xs font-medium text-slate-500">
                  Suspicious Activity Detected
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug">
                {`Inbound call claiming to be ${callerName} (${callerRole}) requested an urgent ${transferAmount} wire transfer while exhibiting vocal tract inconsistencies.`}
              </h2>
              <p className="text-xs text-slate-500 leading-normal">
                Independent out-of-band identity confirmation is required before this transaction can proceed.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5-STAGE PROGRESSION STEPPER: WHY → METHOD → VERIFY → RESULT → NEXT ACTION */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/70 rounded-xl px-4 sm:px-6 py-3 flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <div className="flex items-center gap-2 sm:gap-3.5 flex-nowrap">
            {/* 1. WHY */}
            <div className={cn("flex items-center gap-1.5 whitespace-nowrap font-medium", currentStep === "reason" ? "text-blue-600 font-bold" : "text-emerald-700")}>
              <span className={cn("h-5 w-5 rounded-full flex items-center justify-center text-2xs", currentStep === "reason" ? "bg-blue-100 text-blue-700 font-bold" : "bg-emerald-100 text-emerald-700 font-bold")}>
                {currentStep !== "reason" ? "✓" : "1"}
              </span>
              <span>WHY</span>
            </div>

            <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />

            {/* 2. METHOD */}
            <div className={cn("flex items-center gap-1.5 whitespace-nowrap font-medium", currentStep === "method" ? "text-blue-600 font-bold" : currentStep === "progress" || currentStep === "result" ? "text-emerald-700" : "text-slate-400")}>
              <span className={cn("h-5 w-5 rounded-full flex items-center justify-center text-2xs", currentStep === "method" ? "bg-blue-100 text-blue-700 font-bold" : currentStep === "progress" || currentStep === "result" ? "bg-emerald-100 text-emerald-700 font-bold" : "bg-slate-100 text-slate-500")}>
                {currentStep === "progress" || currentStep === "result" ? "✓" : "2"}
              </span>
              <span>METHOD</span>
            </div>

            <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />

            {/* 3. VERIFY */}
            <div className={cn("flex items-center gap-1.5 whitespace-nowrap font-medium", currentStep === "progress" ? "text-blue-600 font-bold" : currentStep === "result" ? "text-emerald-700" : "text-slate-400")}>
              <span className={cn("h-5 w-5 rounded-full flex items-center justify-center text-2xs", currentStep === "progress" ? "bg-blue-100 text-blue-700 font-bold" : currentStep === "result" ? "bg-emerald-100 text-emerald-700 font-bold" : "bg-slate-100 text-slate-500")}>
                {currentStep === "result" ? "✓" : "3"}
              </span>
              <span>VERIFY</span>
            </div>

            <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />

            {/* 4. RESULT */}
            <div className={cn("flex items-center gap-1.5 whitespace-nowrap font-medium", currentStep === "result" ? (outcome === "failed" ? "text-rose-600 font-bold" : "text-emerald-600 font-bold") : "text-slate-400")}>
              <span className={cn("h-5 w-5 rounded-full flex items-center justify-center text-2xs", currentStep === "result" ? (outcome === "failed" ? "bg-rose-100 text-rose-700 font-bold" : "bg-emerald-100 text-emerald-700 font-bold") : "bg-slate-100 text-slate-500")}>
                4
              </span>
              <span>RESULT</span>
            </div>

            <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />

            {/* 5. NEXT ACTION */}
            <div className={cn("flex items-center gap-1.5 whitespace-nowrap font-medium", currentStep === "result" ? "text-slate-900 font-bold" : "text-slate-400")}>
              <span className={cn("h-5 w-5 rounded-full flex items-center justify-center text-2xs", currentStep === "result" ? "bg-slate-900 text-white font-bold" : "bg-slate-100 text-slate-500")}>
                5
              </span>
              <span>NEXT ACTION</span>
            </div>
          </div>

          {currentStep !== "reason" && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-2xs font-medium text-slate-500 hover:text-slate-800 transition-colors shrink-0 ml-4"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Restart Protocol</span>
            </button>
          )}
        </div>

        {/* Operational Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: CALLER IDENTITY & CONTEXT */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white border border-slate-200/70 rounded-xl p-5 flex flex-col gap-4 text-slate-800">
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                SUBJECT UNDER VERIFICATION
              </span>

              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  RS
                </div>

                <div className="flex flex-col min-w-0">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                    {callerName}
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">
                    {callerRole}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 mt-1">
                    <span>Inbound: {callerPhone}</span>
                  </div>
                </div>
              </div>

              {/* Stated Transaction */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                  REQUESTED SENSITIVE ACTION
                </span>
                <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/70 flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-amber-900">
                      {`Emergency Wire Transfer: ${transferAmount} USD`}
                    </span>
                    <span className="text-2xs text-amber-700 leading-normal mt-0.5">
                      Destination: Zurich Escrow Account · Requested immediate bypass of standard dual-approval window.
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary/Collapsible Policy Details */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPolicyDetails((v) => !v)}
                  className="w-full flex items-center justify-between text-2xs font-medium text-slate-500 hover:text-slate-800 transition-colors py-1.5"
                >
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3 w-3 text-slate-400" />
                    <span>Policy & Compliance Details</span>
                  </span>
                  {showPolicyDetails ? (
                    <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </button>

                {showPolicyDetails && (
                  <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200/60 flex flex-col gap-1.5 text-2xs text-slate-600 leading-relaxed animate-in fade-in duration-100">
                    <span className="font-semibold text-slate-800">
                      Corporate Fraud Prevention Policy 4.1
                    </span>
                    <p>
                      Off-ledger disbursements exceeding $10,000 triggered by inbound telephony require mandatory out-of-band identity verification before release.
                    </p>
                    <div className="pt-1 text-slate-400 font-mono text-3xs">
                      Telephony Trunk: SIP-GW-04 · Carrier Attestation: Level B
                    </div>
                  </div>
                )}
              </div>

              {/* Return to Call Action */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onNavigateTab?.("live-protection")}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/70 transition-colors text-center"
                >
                  Return to Live Call
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MAIN COLUMN: WORKFLOW STEP CONTENT */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* =================================================================== */}
            {/* STEP 1: WHY VERIFICATION IS REQUIRED */}
            {/* =================================================================== */}
            {currentStep === "reason" && (
              <div className="bg-white border border-slate-200/70 rounded-xl p-6 flex flex-col gap-5 text-slate-800 animate-in fade-in duration-150">
                <div className="flex flex-col gap-1.5">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-rose-600">
                    STEP 1: ANOMALY FINDINGS
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Why Verification Is Required
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    VoiceShield real-time speech and behavioral models flagged active anomalies during this call that require independent confirmation prior to executing executive transactions.
                  </p>
                </div>

                {/* Trigger Findings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                      <ShieldAlert className="h-4 w-4 text-rose-600" />
                      <span>Speaker Inconsistency Detected</span>
                    </div>
                    <p className="text-2xs text-rose-700 leading-normal">
                      The vocal tract acoustic harmonics of the current speaker diverge from Rahul Sharma&apos;s enrolled biometric reference profile (cosine distance 0.54 vs. expected &ge; 0.75).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span>Coercive Isolation & Urgency</span>
                    </div>
                    <p className="text-2xs text-amber-700 leading-normal">
                      Spoken transcript analysis identified high-pressure phrasing demanding rapid fund disbursement (&ldquo;immediately&rdquo;) with explicit instructions to isolate from colleagues.
                    </p>
                  </div>
                </div>

                {/* Action to proceed */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-2xs text-slate-500">
                    Recommended course: Out-of-band identity verification protocol.
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep("method")}
                    className="py-2.5 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <span>Choose Verification Method</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* STEP 2: RECOMMENDED VERIFICATION METHOD */}
            {/* =================================================================== */}
            {currentStep === "method" && (
              <div className="bg-white border border-slate-200/70 rounded-xl p-6 flex flex-col gap-5 text-slate-800 animate-in fade-in duration-150">
                <div className="flex flex-col gap-1.5">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-blue-600">
                    STEP 2: METHOD SELECTION
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Select Verification Method
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Prioritize out-of-band contact to isolate telephony spoofing. Select from the organization&apos;s verified authorization channels below:
                  </p>
                </div>

                {/* The 3 Core Methods (Prioritizing Trusted Callback, Safe Word, MFA) */}
                <div className="flex flex-col gap-3">
                  {/* Method 1: Trusted Cellular Callback (RECOMMENDED) */}
                  <label
                    onClick={() => setSelectedMethod("callback")}
                    className={cn(
                      "flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all",
                      selectedMethod === "callback"
                        ? "bg-blue-50/60 border-blue-300 ring-1 ring-blue-300 text-slate-900"
                        : "bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    <input
                      type="radio"
                      name="verification_method"
                      checked={selectedMethod === "callback"}
                      onChange={() => setSelectedMethod("callback")}
                      className="mt-1 text-blue-600 focus:ring-0"
                    />
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <PhoneCall className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-900">
                          1. Trusted Cellular Callback
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Recommended
                        </span>
                      </div>
                      <p className="text-2xs text-slate-600 leading-relaxed">
                        Initiates an independent cellular voice call to Rahul Sharma&apos;s registered executive device (<span className="font-mono font-semibold text-slate-900">{callerPhone}</span>) via an isolated telephony circuit. Completely bypasses inbound carrier spoofing.
                      </p>
                    </div>
                  </label>

                  {/* Method 2: Pre-Shared Safe Word */}
                  <label
                    onClick={() => setSelectedMethod("safeword")}
                    className={cn(
                      "flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all",
                      selectedMethod === "safeword"
                        ? "bg-blue-50/60 border-blue-300 ring-1 ring-blue-300 text-slate-900"
                        : "bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    <input
                      type="radio"
                      name="verification_method"
                      checked={selectedMethod === "safeword"}
                      onChange={() => setSelectedMethod("safeword")}
                      className="mt-1 text-blue-600 focus:ring-0"
                    />
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-slate-700" />
                        <span className="text-xs font-bold text-slate-900">
                          2. Pre-Shared Safe Word Challenge
                        </span>
                      </div>
                      <p className="text-2xs text-slate-600 leading-relaxed">
                        Prompt the caller verbally for their confidential emergency verification token stored encrypted in the Corporate Vault. Useful when cellular connectivity is limited.
                      </p>
                    </div>
                  </label>

                  {/* Method 3: Enterprise Step-Up MFA */}
                  <label
                    onClick={() => setSelectedMethod("mfa")}
                    className={cn(
                      "flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all",
                      selectedMethod === "mfa"
                        ? "bg-blue-50/60 border-blue-300 ring-1 ring-blue-300 text-slate-900"
                        : "bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    <input
                      type="radio"
                      name="verification_method"
                      checked={selectedMethod === "mfa"}
                      onChange={() => setSelectedMethod("mfa")}
                      className="mt-1 text-blue-600 focus:ring-0"
                    />
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-slate-700" />
                        <span className="text-xs font-bold text-slate-900">
                          3. Enterprise Step-Up MFA
                        </span>
                      </div>
                      <p className="text-2xs text-slate-600 leading-relaxed">
                        Dispatches a cryptographic FIDO2 push prompt to the executive&apos;s registered mobile device requiring hardware biometric confirmation.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep("reason")}
                    className="py-2 px-3 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleStartVerification}
                    className="py-2.5 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <span>Initiate Verification</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* STEP 3: VERIFICATION IN PROGRESS */}
            {/* =================================================================== */}
            {currentStep === "progress" && (
              <div className="bg-white border border-slate-200/70 rounded-xl p-6 flex flex-col gap-5 text-slate-800 animate-in fade-in duration-150">
                <div className="flex flex-col gap-1">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-amber-600">
                    STEP 3: VERIFY IN PROGRESS
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {selectedMethod === "callback" && "Trusted Cellular Callback in Progress"}
                    {selectedMethod === "safeword" && "Verbal Safe Word Challenge"}
                    {selectedMethod === "mfa" && "FIDO2 Biometric MFA Challenge Dispatched"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Executing independent verification channel. Awaiting subject confirmation.
                  </p>
                </div>

                {/* Progress Interface depending on method */}
                {selectedMethod === "callback" && (
                  <div className="flex flex-col gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center animate-pulse">
                          <PhoneCall className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900">
                            Dialing: Rahul Sharma ({callerPhone})
                          </span>
                          <span className="text-2xs text-slate-500">
                            Isolated GSM/PSTN Cellular Line · Carrier Attestation A
                          </span>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        Line Ringing...
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-200/70 flex flex-col gap-2">
                      <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                        Log Callback Result:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleResolve(
                              true,
                              "Legitimate CFO answered callback on registered personal cellular line and confirmed he initiated this emergency transaction."
                            )
                          }
                          className="py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-900 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>Legitimate Executive (Verified)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleResolve(
                              false,
                              "Legitimate CFO Rahul Sharma reached on cellular line states he is currently boarding a flight and NEVER placed this call."
                            )
                          }
                          className="py-3 px-4 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-900 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                        >
                          <ShieldAlert className="h-4 w-4 text-rose-600" />
                          <span>Impersonation Attack Confirmed</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === "safeword" && (
                  <form onSubmit={handleSafeWordSubmit} className="flex flex-col gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-slate-800">
                        Prompt caller verbally for their emergency token:
                      </span>
                      <span className="text-2xs text-slate-500">
                        Vault record for Rahul Sharma: <span className="font-mono font-bold text-slate-700">COBALT-ORION-77</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={safeWordInput}
                        onChange={(e) => setSafeWordInput(e.target.value)}
                        placeholder="Enter stated token (e.g. COBALT-ORION-77)"
                        className="flex-1 h-10 px-3.5 rounded-lg bg-white border border-slate-300 text-xs font-mono font-semibold focus:border-blue-500 focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="h-10 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        Submit Token
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-2xs text-slate-400 pt-1">
                      <span>Case-insensitive cryptographic token comparison.</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleResolve(
                            false,
                            "Caller hesitated, became combative, and refused or failed to provide the pre-shared safe word."
                          )
                        }
                        className="text-rose-600 hover:underline font-medium"
                      >
                        Caller Refused / Failed Token &rarr;
                      </button>
                    </div>
                  </form>
                )}

                {selectedMethod === "mfa" && (
                  <div className="flex flex-col gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900">
                            FIDO2 Push Prompt Dispatched
                          </span>
                          <span className="text-2xs text-slate-500">
                            Hardware Key: YubiKey 5C NFC (Rahul Sharma)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-2xs font-mono text-slate-400">
                        <Clock className="h-3.5 w-3.5 animate-spin" />
                        <span>Awaiting Biometric...</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/70 flex flex-col gap-2">
                      <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                        Simulate MFA Response:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleResolve(
                              true,
                              "Hardware biometric token approved directly on registered executive mobile device."
                            )
                          }
                          className="py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-900 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>Biometric Approved</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleResolve(
                              false,
                              "Hardware biometric push prompt rejected or timed out on registered executive device."
                            )
                          }
                          className="py-3 px-4 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-900 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                        >
                          <ShieldAlert className="h-4 w-4 text-rose-600" />
                          <span>Prompt Denied / Timed Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =================================================================== */}
            {/* STEP 4: VERIFICATION RESULT & NEXT ACTION */}
            {/* =================================================================== */}
            {currentStep === "result" && (
              <div className="bg-white border border-slate-200/70 rounded-xl p-6 flex flex-col gap-5 text-slate-800 animate-in fade-in duration-150">
                <div className="flex flex-col gap-1">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                    STEP 4: PROTOCOL RESULT
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {outcome === "passed" ? "Identity Verified Successfully" : "Verification Complete"}
                  </h3>
                </div>

                {/* Outcome Banner - Simplified & Human-Designed */}
                {outcome === "passed" ? (
                  <div className="p-5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex flex-col gap-2.5">
                    <div className="flex items-start gap-2.5 text-slate-900">
                      <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-0.5">
                        <h4 className="text-sm font-bold text-emerald-950 leading-snug">
                          Verification passed. Caller identity independently confirmed.
                        </h4>
                        <p className="text-xs font-medium text-emerald-800 leading-normal">
                          Sensitive action is authorized to continue.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-rose-50/80 border border-rose-200/80 flex flex-col gap-2.5">
                    <div className="flex items-start gap-2.5 text-slate-900">
                      <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-0.5">
                        <h4 className="text-sm font-bold text-rose-950 leading-snug">
                          Verification failed. The caller could not be independently confirmed.
                        </h4>
                        <p className="text-xs font-medium text-rose-800 leading-normal">
                          Sensitive action has been paused.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Technical Policy & Audit Details (Secondary & Collapsible) */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowResultPolicyDetails((v) => !v)}
                    className="flex items-center gap-1.5 text-2xs font-medium text-slate-500 hover:text-slate-800 transition-colors py-1"
                  >
                    <Lock className="h-3 w-3 text-slate-400" />
                    <span>Technical policy & audit details</span>
                    {showResultPolicyDetails ? (
                      <ChevronUp className="h-3 w-3 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-3 w-3 text-slate-400" />
                    )}
                  </button>

                  {showResultPolicyDetails && (
                    <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200/60 flex flex-col gap-1.5 text-2xs text-slate-600 animate-in fade-in duration-100">
                      <div>
                        <span className="font-semibold text-slate-800">Operational Log: </span>
                        <span>{outcomeMessage}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">Directive Enforced: </span>
                        <span>{outcome === "passed" ? "Release Wire Freeze (Policy 4.1 Clearance)" : "Enforce Wire Freeze (Policy 4.1)"}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">Telephony Action: </span>
                        <span>{outcome === "passed" ? "Maintain Carrier Trunk" : "Sever Telephony Trunk & Blacklist IP Route"}</span>
                      </div>
                      <div className="text-slate-400 font-mono text-3xs pt-0.5">
                        Token: {outcome === "passed" ? "AUTH-2026-VERIFIED-9812" : "INC-2026-0042"} · Logged to SOC Audit Archive
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Next Action & Secondary Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  {/* Secondary Action: Try another verification method */}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors text-center"
                  >
                    Try another verification method
                  </button>

                  {/* Primary Action: View Incident */}
                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => onNavigateTab?.("reports")}
                      className="w-full sm:w-auto py-2.5 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs text-center"
                    >
                      View Incident
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
