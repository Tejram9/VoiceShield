"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { SignalItemData } from "@/lib/demo-state";
import {
  Activity,
  Mic,
  Fingerprint,
  MessageSquare,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface KeySignalsProps {
  signals: SignalItemData[];
  className?: string;
}

export function KeySignals({ signals, className }: KeySignalsProps) {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const getSignalIcon = (id: string) => {
    switch (id) {
      case "voice-authenticity":
        return <Mic className="h-4 w-4" />;
      case "speaker-consistency":
        return <Fingerprint className="h-4 w-4" />;
      case "conversation-analysis":
        return <MessageSquare className="h-4 w-4" />;
      case "context-analysis":
        return <ShieldAlert className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getIconContainerStyle = (type: string) => {
    switch (type) {
      case "critical":
      case "threat":
        return "bg-rose-50 text-rose-600";
      case "caution":
        return "bg-amber-50 text-amber-600";
      default:
        return "bg-emerald-50 text-emerald-600";
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "critical":
      case "threat":
        return "text-rose-600 font-bold";
      case "caution":
        return "text-amber-600 font-bold";
      default:
        return "text-emerald-600 font-semibold";
    }
  };

  return (
    <div
      className={cn(
        "w-full bg-white border border-slate-200/70 rounded-xl p-5 flex flex-col gap-3.5 text-slate-800",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-slate-400" />
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Key Signals
        </h3>
      </div>

      {/* Signals List */}
      <div className="flex flex-col gap-3.5">
        {signals.map((sig) => (
          <div
            key={sig.id}
            className="flex items-center justify-between gap-3 pb-2.5 border-b border-slate-100 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                  getIconContainerStyle(sig.statusType)
                )}
              >
                {getSignalIcon(sig.id)}
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 leading-tight truncate">
                  {sig.name}
                </span>
                <span className="text-2xs text-slate-500 leading-snug truncate">
                  {sig.description}
                </span>
              </div>
            </div>

            <span className={cn("text-xs shrink-0 tracking-wide", getBadgeStyle(sig.statusType))}>
              {sig.status}
            </span>
          </div>
        ))}
      </div>

      {/* Progressive Disclosure: Advanced Evidence */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="w-full flex items-center justify-between text-2xs font-mono font-medium text-slate-500 hover:text-slate-800 transition-colors py-1"
        >
          <span className="flex items-center gap-1.5">
            <span>&lt;&gt;</span>
            <span>Advanced Evidence</span>
          </span>
          {showAdvanced ? (
            <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-2 text-2xs font-mono text-slate-600 animate-in fade-in duration-100">
            {signals.map((sig) => (
              <div key={sig.id} className="flex items-center justify-between gap-2">
                <span className="text-slate-400">{sig.name}:</span>
                <span className="text-slate-900 font-semibold truncate">
                  {sig.technicalMetric}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
