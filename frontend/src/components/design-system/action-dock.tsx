"use client";

import React, { useState } from "react";
import {
  PhoneCall,
  KeyRound,
  Lock,
  CheckCircle2,
  XCircle,
  Smartphone,
} from "lucide-react";
import { ModalDialog } from "./modal-dialog";
import { ExtendedRiskLevel } from "./risk-indicator";
import { cn } from "@/lib/utils";

export interface ActionDockProps {
  riskLevel: ExtendedRiskLevel;
  callerName: string;
  callerNumber?: string;
  trustedCallbackNumber?: string;
  enrolledSafeWord?: string;
  onActionComplete?: (actionType: string, outcome: "success" | "failure") => void;
  className?: string;
}

export function ActionDock({
  riskLevel,
  callerName,
  callerNumber,
  trustedCallbackNumber = "+1 (555) 234-8901",
  enrolledSafeWord = "COBALT-ORION-77",
  onActionComplete,
  className,
}: ActionDockProps) {
  const [activeModal, setActiveModal] = useState<"callback" | "safeword" | "freeze" | "mfa" | null>(null);

  // Callback State
  const [callbackState, setCallbackState] = useState<"idle" | "dialing" | "connected" | "confirmed">("idle");

  // Safe Word State
  const [safeWordInput, setSafeWordInput] = useState("");
  const [safeWordVerdict, setSafeWordVerdict] = useState<"idle" | "verifying" | "passed" | "failed">("idle");

  // Action states
  const [actionPaused, setActionPaused] = useState(false);

  const isCritical = riskLevel === "CRITICAL";
  const isHigh = riskLevel === "HIGH";
  const isElevated = riskLevel === "ELEVATED" || riskLevel === "MEDIUM";

  const handleStartCallback = () => {
    setCallbackState("dialing");
    setTimeout(() => {
      setCallbackState("connected");
      onActionComplete?.("CALLBACK", "success");
    }, 1800);
  };

  const handleVerifySafeWord = (e: React.FormEvent) => {
    e.preventDefault();
    setSafeWordVerdict("verifying");
    setTimeout(() => {
      if (safeWordInput.trim().toUpperCase() === enrolledSafeWord.toUpperCase()) {
        setSafeWordVerdict("passed");
        onActionComplete?.("SAFE_WORD", "success");
      } else {
        setSafeWordVerdict("failed");
        onActionComplete?.("SAFE_WORD", "failure");
      }
    }, 1200);
  };

  const handleFreezeAction = () => {
    setActionPaused(true);
    onActionComplete?.("FREEZE_ACTION", "success");
  };

  // Determine primary action config based on risk level
  const getPrimaryActionConfig = () => {
    if (actionPaused) {
      return {
        badge: "CONTAINMENT ENFORCED",
        badgeColor: "bg-emerald-950/40 text-emerald-300 border-emerald-500/40",
        headline: "Sensitive Wire Transfer Frozen & Fraud Deflected",
        guidance: "Corporate Treasury funds safeguarded. Impersonation attack intercepted before authorization release.",
        buttonText: "Incident Logged — View Forensics",
        buttonAction: () => onActionComplete?.("VIEW_INCIDENT", "success"),
        buttonClass: "bg-emerald-600 hover:bg-emerald-500 text-white",
      };
    }

    if (isCritical) {
      return {
        badge: "CRITICAL PROTECTIVE DIRECTIVE",
        badgeColor: "bg-rose-950/40 text-rose-300 border-rose-500/50",
        headline: "Potential Voice Clone: Intercept Sensitive Wire Transfer",
        guidance: "Do not execute verbal authorization or release funds. Corporate Policy 4.1 requires immediate wire pause.",
        buttonText: "PAUSE SENSITIVE ACTION & FREEZE WIRE",
        buttonAction: handleFreezeAction,
        buttonClass: "bg-rose-600 hover:bg-rose-500 text-white font-black shadow-md",
      };
    }

    if (isHigh) {
      return {
        badge: "INDEPENDENT VERIFICATION REQUIRED",
        badgeColor: "bg-orange-950/40 text-orange-300 border-orange-500/40",
        headline: "Biometric Divergence: Do Not Rely on Inbound Voice Alone",
        guidance: "Speaker vocal characteristics diverge from enrolled baseline. Execute out-of-band cellular contact.",
        buttonText: "Initiate Trusted Cellular Callback",
        buttonAction: () => {
          setCallbackState("idle");
          setActiveModal("callback");
        },
        buttonClass: "bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-sm",
      };
    }

    if (isElevated) {
      return {
        badge: "IDENTITY VERIFICATION RECOMMENDED",
        badgeColor: "bg-amber-950/40 text-amber-300 border-amber-500/40",
        headline: "Conversational Urgency Flagged: Prompt Safe Word",
        guidance: "Caller introduced emergency payment constraints. Request pre-shared safe word before proceeding.",
        buttonText: "Challenge Pre-Shared Safe Word",
        buttonAction: () => {
          setSafeWordInput("");
          setSafeWordVerdict("idle");
          setActiveModal("safeword");
        },
        buttonClass: "bg-amber-600 hover:bg-amber-500 text-white font-bold",
      };
    }

    return {
      badge: "ROUTINE MONITORING",
      badgeColor: "bg-emerald-950/40 text-emerald-300 border-emerald-500/30",
      headline: "No Action Required — Standard Inbound Call",
      guidance: "Acoustic and conversational signals remain within baseline parameters. Continue standard procedures.",
      buttonText: "Continue Monitoring",
      buttonAction: () => onActionComplete?.("CONTINUE", "success"),
      buttonClass: "bg-soc-750 hover:bg-soc-700 text-soc-200 border border-soc-650",
    };
  };

  const primary = getPrimaryActionConfig();

  return (
    <div className={cn("soc-panel p-4 space-y-3 font-sans text-xs", className)}>
      {/* ── 1. DOMINANT RECOMMENDED ACTION (High-Emphasis Banner) ── */}
      <div
        className={cn(
          "p-4 rounded border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors",
          isCritical && !actionPaused
            ? "bg-rose-950/20 border-rose-500/40"
            : isHigh
            ? "bg-orange-950/20 border-orange-500/35"
            : isElevated
            ? "bg-amber-950/20 border-amber-500/30"
            : actionPaused
            ? "bg-emerald-950/20 border-emerald-500/30"
            : "bg-soc-900/50 border-soc-750"
        )}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={cn("text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold tracking-wider", primary.badgeColor)}>
              {primary.badge}
            </span>
            <span className="text-[10px] font-mono text-soc-400 uppercase">Recommended Action</span>
          </div>
          <h4 className="text-sm font-bold text-white tracking-tight">
            {primary.headline}
          </h4>
          <p className="text-xs text-soc-300 max-w-2xl leading-relaxed font-normal">
            {primary.guidance}
          </p>
        </div>

        <button
          type="button"
          onClick={primary.buttonAction}
          className={cn(
            "px-4 py-2.5 rounded text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 self-start sm:self-center",
            primary.buttonClass
          )}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{primary.buttonText}</span>
        </button>
      </div>

      {/* ── 2. SECONDARY OUT-OF-BAND PROTOCOLS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-soc-700/50">
        <span className="text-[10px] font-mono uppercase text-soc-500 font-semibold tracking-wider">
          Secondary Out-of-Band Channels:
        </span>

        <div className="flex flex-wrap items-center gap-2 font-mono">
          {/* Out-of-Band Callback */}
          <button
            type="button"
            onClick={() => {
              setCallbackState("idle");
              setActiveModal("callback");
            }}
            className="px-2.5 py-1.5 rounded bg-soc-800 hover:bg-soc-750 text-soc-300 hover:text-white border border-soc-700 text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <PhoneCall className="w-3 h-3 text-blue-400" />
            <span>Trusted Cellular Callback</span>
          </button>

          {/* Safe Word Challenge */}
          <button
            type="button"
            onClick={() => {
              setSafeWordInput("");
              setSafeWordVerdict("idle");
              setActiveModal("safeword");
            }}
            className="px-2.5 py-1.5 rounded bg-soc-800 hover:bg-soc-750 text-soc-300 hover:text-white border border-soc-700 text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <KeyRound className="w-3 h-3 text-amber-400" />
            <span>Prompt Safe Word</span>
          </button>

          {/* Hardware Push MFA */}
          <button
            type="button"
            onClick={() => setActiveModal("mfa")}
            className="px-2.5 py-1.5 rounded bg-soc-800 hover:bg-soc-750 text-soc-300 hover:text-white border border-soc-700 text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Smartphone className="w-3 h-3 text-purple-400" />
            <span>Dispatch Push MFA</span>
          </button>

          {/* Freeze Action */}
          {!actionPaused && (
            <button
              type="button"
              onClick={() => setActiveModal("freeze")}
              className="px-2.5 py-1.5 rounded bg-soc-800 hover:bg-rose-950/40 text-soc-300 hover:text-rose-300 border border-soc-700 hover:border-rose-500/40 text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3 h-3 text-rose-400" />
              <span>Freeze Wire</span>
            </button>
          )}
        </div>
      </div>

      {/* ── MODAL 1: Out-of-Band Callback ──────────────────────────────── */}
      <ModalDialog
        isOpen={activeModal === "callback"}
        onClose={() => setActiveModal(null)}
        title="Trusted Cellular Callback Execution"
        maxWidth="lg"
      >
        <div className="space-y-4 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-soc-850 border border-soc-700 text-soc-300 leading-relaxed">
            <span className="text-soc-100 font-semibold block mb-1">Zero-Trust Security Protocol:</span>
            Do not trust the current incoming call trunk. Initiating an independent outbound call to the executive&apos;s verified device bypasses VoIP spoofing.
          </div>

          <div className="p-4 rounded-xl bg-soc-850 border border-soc-700 space-y-2">
            <div className="flex justify-between text-soc-400">
              <span>Target Identity:</span>
              <strong className="text-white">{callerName}</strong>
            </div>
            {callerNumber && (
              <div className="flex justify-between text-soc-400">
                <span>Suspected Inbound Line:</span>
                <span className="text-soc-200">{callerNumber}</span>
              </div>
            )}
            <div className="flex justify-between text-soc-400">
              <span>Verified Hardware Number:</span>
              <strong className="text-emerald-400">{trustedCallbackNumber}</strong>
            </div>
            <div className="flex justify-between text-soc-400">
              <span>Routing Carrier:</span>
              <span className="text-soc-200">Isolated Cellular PSTN (Encrypted)</span>
            </div>
          </div>

          {callbackState === "idle" && (
            <button
              type="button"
              onClick={handleStartCallback}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Initiate Outbound Cellular Call</span>
            </button>
          )}

          {callbackState === "dialing" && (
            <div className="p-4 rounded-xl bg-blue-950/25 border border-blue-500/30 text-center space-y-2 text-blue-300">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-400 animate-ping" />
              <p className="font-bold">Dialing Verified Mobile Device...</p>
            </div>
          )}

          {callbackState === "connected" && (
            <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/40 text-center space-y-3 text-emerald-300">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="font-bold">Cellular Call Answered by Legitimate Executive</p>
              <p className="text-xs text-soc-300">
                Executive confirmed they are NOT placing the current inbound call. Impersonation attack confirmed.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleFreezeAction();
                  setActiveModal(null);
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors cursor-pointer"
              >
                Terminate Fraudulent Inbound Trunk &amp; Freeze Wire
              </button>
            </div>
          )}
        </div>
      </ModalDialog>

      {/* ── MODAL 2: Safe Word Challenge ───────────────────────────────── */}
      <ModalDialog
        isOpen={activeModal === "safeword"}
        onClose={() => setActiveModal(null)}
        title="Pre-Shared Safe Word Verification"
        maxWidth="md"
      >
        <div className="space-y-4 font-mono text-xs">
          <p className="text-soc-300 leading-relaxed">
            Instruct the caller to speak their pre-shared verbal pass-phrase. Compare the spoken phrase against the encrypted vault entry.
          </p>

          <form onSubmit={handleVerifySafeWord} className="space-y-3">
            <div>
              <label className="text-soc-400 block mb-1 text-[11px]">Caller&apos;s Stated Safe Word:</label>
              <input
                type="text"
                placeholder="e.g. COBALT-ORION-77"
                value={safeWordInput}
                onChange={(e) => setSafeWordInput(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-soc-850 border border-soc-700 text-white font-mono uppercase focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={safeWordVerdict === "verifying"}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors cursor-pointer"
            >
              {safeWordVerdict === "verifying" ? "Cryptographically Validating..." : "Validate Safe Word"}
            </button>
          </form>

          {safeWordVerdict === "passed" && (
            <div className="p-3 rounded-xl bg-emerald-950/25 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Safe Word Matches Enrolled Vault Entry. Caller Verified.</span>
            </div>
          )}

          {safeWordVerdict === "failed" && (
            <div className="p-3 rounded-xl bg-rose-950/25 border border-rose-500/40 text-rose-300 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>Incorrect Safe Word. Caller Failed Identity Challenge.</span>
            </div>
          )}
        </div>
      </ModalDialog>

      {/* ── MODAL 3: Freeze Sensitive Actions ──────────────────────────── */}
      <ModalDialog
        isOpen={activeModal === "freeze"}
        onClose={() => setActiveModal(null)}
        title="Immediate Financial &amp; Policy Containment Lock"
        maxWidth="md"
      >
        <div className="space-y-4 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 leading-relaxed">
            <strong className="block font-bold text-white mb-1">Emergency Wire Lockout:</strong>
            Locking this session immediately transmits an automated freeze signal to the Treasury Ledger API and flags caller CLI in the firewall.
          </div>

          <button
            type="button"
            onClick={() => {
              handleFreezeAction();
              setActiveModal(null);
            }}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors cursor-pointer"
          >
            Enforce Immediate Wire &amp; Credential Freeze
          </button>
        </div>
      </ModalDialog>

      {/* ── MODAL 4: Push MFA ──────────────────────────────────────────── */}
      <ModalDialog
        isOpen={activeModal === "mfa"}
        onClose={() => setActiveModal(null)}
        title="Step-Up Push MFA Challenge"
        maxWidth="md"
      >
        <div className="space-y-4 font-mono text-xs text-soc-300">
          <p>
            Transmitting cryptographic push prompt to {callerName}&apos;s enrolled enterprise security token.
          </p>
          <div className="p-3.5 rounded-xl bg-soc-850 border border-soc-700 text-center space-y-2">
            <Smartphone className="w-6 h-6 text-purple-400 mx-auto animate-pulse" />
            <span className="font-bold text-white block">Awaiting Biometric Tap on Hardware Token...</span>
            <span className="text-[11px] text-soc-500 block">Timeout: 45 seconds</span>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
