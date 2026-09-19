"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Lock,
  PhoneOff,
  ShieldAlert,
  X,
  CheckCircle2,
} from "lucide-react";

export interface ContainmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  callerName?: string;
  amount?: string;
  onContainmentConfirmed?: (action: string) => void;
}

export function ContainmentDialog({
  isOpen,
  onClose,
  callerName = "Rahul Sharma",
  amount = "$45,000",
  onContainmentConfirmed,
}: ContainmentDialogProps) {
  const [selectedDirective, setSelectedDirective] = useState<
    "FREEZE_WIRE" | "SEVER_TRUNK" | "ESCALATE_SOC"
  >("FREEZE_WIRE");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecute = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setSuccessMessage(
        `Corporate Policy 4.1 enforced. Wire transfer of ${amount} frozen. Incident INC-2026-0042 logged.`
      );

      setTimeout(() => {
        onContainmentConfirmed?.(selectedDirective);
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-contain-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div
        className="w-full max-w-md bg-white border border-rose-200 rounded-2xl shadow-xl p-6 flex flex-col gap-4 text-slate-800 animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <h3 id="dialog-contain-title" className="text-base font-bold text-slate-900">
                Enforce Containment Directive
              </h3>
              <p className="text-xs text-slate-500">
                Corporate Fraud Prevention Policy 4.1
              </p>
            </div>
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

        {/* Target Details */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Impersonated Subject:</span>
            <span className="font-semibold text-slate-900">{callerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Attempted Wire Disbursement:</span>
            <span className="font-mono text-rose-600 font-bold">{`${amount} USD`}</span>
          </div>
        </div>

        {/* Directive Options */}
        <div className="flex flex-col gap-2">
          <label
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
              selectedDirective === "FREEZE_WIRE"
                ? "bg-rose-50/60 border-rose-300 text-slate-900"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            <input
              type="radio"
              name="directive"
              checked={selectedDirective === "FREEZE_WIRE"}
              onChange={() => setSelectedDirective("FREEZE_WIRE")}
              className="mt-0.5 text-rose-600 focus:ring-0"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Lock className="h-3.5 w-3.5 text-rose-600" />
                <span>Immediate Wire Freeze (Policy 4.1)</span>
              </div>
              <span className="text-2xs text-slate-500 mt-0.5">
                Lock disbursement queue and log cryptographic audit record.
              </span>
            </div>
          </label>

          <label
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
              selectedDirective === "SEVER_TRUNK"
                ? "bg-rose-50/60 border-rose-300 text-slate-900"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            <input
              type="radio"
              name="directive"
              checked={selectedDirective === "SEVER_TRUNK"}
              onChange={() => setSelectedDirective("SEVER_TRUNK")}
              className="mt-0.5 text-rose-600 focus:ring-0"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <PhoneOff className="h-3.5 w-3.5 text-amber-600" />
                <span>Sever Inbound SIP Telephony Trunk</span>
              </div>
              <span className="text-2xs text-slate-500 mt-0.5">
                Immediately terminate call audio and blacklist gateway route.
              </span>
            </div>
          </label>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-3 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExecute}
            disabled={isProcessing}
            className="py-2 px-4 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-colors disabled:opacity-50"
          >
            {isProcessing ? "Enforcing..." : "Enforce Directive"}
          </button>
        </div>
      </div>
    </div>
  );
}
