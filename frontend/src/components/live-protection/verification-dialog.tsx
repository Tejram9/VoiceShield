"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  ShieldAlert,
  PhoneCall,
  KeyRound,
  Smartphone,
  X,
  CheckCircle2,
} from "lucide-react";

export interface VerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  callerName?: string;
  callerRole?: string;
  callerPhone?: string;
  onVerificationResolved?: (passed: boolean) => void;
}

export function VerificationDialog({
  isOpen,
  onClose,
  callerName = "Rahul Sharma",
  callerRole = "Chief Financial Officer",
  callerPhone = "+91 98765 43210",
  onVerificationResolved,
}: VerificationDialogProps) {
  const [activeTab, setActiveTab] = useState<"callback" | "safeword" | "mfa">("callback");
  const [safeWordInput, setSafeWordInput] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  if (!isOpen) return null;

  const expectedSafeWord = "COBALT-ORION-77";

  const handleCallbackOutcome = (legitimate: boolean) => {
    if (legitimate) {
      setStatusMessage({
        type: "success",
        text: "Cellular callback confirmed: Legitimate CFO verified placed call.",
      });
      setTimeout(() => {
        onVerificationResolved?.(true);
        onClose();
      }, 1200);
    } else {
      setStatusMessage({
        type: "error",
        text: "Attack confirmed: Legitimate CFO states he is in transit and never placed this call.",
      });
      setTimeout(() => {
        onVerificationResolved?.(false);
        onClose();
      }, 1500);
    }
  };

  const handleSafeWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!safeWordInput.trim()) return;

    if (safeWordInput.trim().toUpperCase() === expectedSafeWord) {
      setStatusMessage({
        type: "success",
        text: "Safe word verified accurately against Corporate Identity Vault.",
      });
      setTimeout(() => {
        onVerificationResolved?.(true);
        onClose();
      }, 1200);
    } else {
      setStatusMessage({
        type: "error",
        text: "Invalid safe word! Caller failed cryptographic challenge.",
      });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-verify-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div
        className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 flex flex-col gap-4 text-slate-800 animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 id="dialog-verify-title" className="text-base font-bold text-slate-900">
                Independent Caller Verification
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verifying <span className="font-semibold text-slate-800">{callerName}</span> ({callerRole}) · <span className="font-mono">{callerPhone}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Protocol Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => { setActiveTab("callback"); setStatusMessage(null); }}
            className={cn(
              "flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors",
              activeTab === "callback"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>Callback</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("safeword"); setStatusMessage(null); }}
            className={cn(
              "flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors",
              activeTab === "safeword"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>Safe Word</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("mfa"); setStatusMessage(null); }}
            className={cn(
              "flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors",
              activeTab === "mfa"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Step-Up MFA</span>
          </button>
        </div>

        {/* Feedback Message */}
        {statusMessage && (
          <div
            className={cn(
              "p-3 rounded-lg text-xs font-medium border flex items-center gap-2",
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            )}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Tab Body */}
        <div className="py-2">
          {activeTab === "callback" && (
            <div className="flex flex-col gap-3.5">
              <p className="text-xs text-slate-600 leading-relaxed">
                Initiate an encrypted cellular callback to Rahul Sharma&apos;s registered executive device (<span className="font-mono font-semibold text-slate-900">{callerPhone}</span>) via an isolated telephony circuit.
              </p>

              <div className="flex flex-col gap-2 pt-1">
                <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                  Log Verification Response:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCallbackOutcome(true)}
                    className="py-2.5 px-3 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Legitimate CFO</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCallbackOutcome(false)}
                    className="py-2.5 px-3 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShieldAlert className="h-4 w-4 text-rose-600" />
                    <span>Impersonation Attack</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "safeword" && (
            <form onSubmit={handleSafeWordSubmit} className="flex flex-col gap-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Prompt the caller verbally for the pre-shared emergency verification token configured in the Corporate Vault.
              </p>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="safeword-token"
                  className="text-2xs font-semibold uppercase tracking-wider text-slate-400"
                >
                  Enter Stated Token (Vault Token: COBALT-ORION-77)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="safeword-token"
                    type="text"
                    value={safeWordInput}
                    onChange={(e) => setSafeWordInput(e.target.value)}
                    placeholder="e.g. COBALT-ORION-77"
                    className="flex-1 h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-medium focus:bg-white focus:border-blue-500 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === "mfa" && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Dispatch an enterprise FIDO2 biometric authentication prompt to the registered hardware authenticator.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleCallbackOutcome(true)}
                  className="py-2 px-3 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-xs"
                >
                  Simulate Push Approval
                </button>
                <button
                  type="button"
                  onClick={() => handleCallbackOutcome(false)}
                  className="py-2 px-3 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs hover:bg-slate-200 transition-colors"
                >
                  Simulate Denial
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Close Protocol
          </button>
        </div>
      </div>
    </div>
  );
}
