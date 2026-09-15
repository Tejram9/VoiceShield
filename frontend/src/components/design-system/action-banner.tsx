"use client";

import React, { useState } from "react";
import { SecurityRecommendationData } from "@/types/dashboard";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  PhoneCall,
  PauseCircle,
  PhoneOff,
  ExternalLink,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionBannerProps {
  recommendation: SecurityRecommendationData;
  onExecuteAction?: (actionType: string) => void;
  className?: string;
}

export function ActionBanner({
  recommendation,
  onExecuteAction,
  className,
}: ActionBannerProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const isCritical = recommendation.urgency === "CRITICAL" || recommendation.urgency === "HIGH";

  const handleAction = (actionType: string, label: string) => {
    setActiveAction(actionType);
    setFeedbackMessage(`Initiating ${label}...`);
    onExecuteAction?.(actionType);

    setTimeout(() => {
      setFeedbackMessage(`${label} protocol dispatched successfully.`);
      setTimeout(() => {
        setFeedbackMessage(null);
        setActiveAction(null);
      }, 2500);
    }, 1200);
  };

  const getSecondaryIcon = (actionType: string) => {
    switch (actionType) {
      case "SAFE_WORD":
        return <KeyRound className="w-3.5 h-3.5 text-amber-400" />;
      case "CALLBACK":
        return <PhoneCall className="w-3.5 h-3.5 text-blue-400" />;
      case "FREEZE_TX":
        return <PauseCircle className="w-3.5 h-3.5 text-orange-400" />;
      case "TERMINATE":
        return <PhoneOff className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Lock className="w-3.5 h-3.5 text-soc-300" />;
    }
  };

  return (
    <div
      className={cn(
        "soc-panel p-5 sm:p-6 relative overflow-hidden transition-all duration-200",
        isCritical
          ? "border-rose-500/40 bg-rose-950/15"
          : "border-emerald-500/40 bg-emerald-950/15",
        className
      )}
    >
      {/* Top Threat Guidance Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-soc-700/60">
        <div className="flex items-start sm:items-center space-x-3">
          <div
            className={cn(
              "p-2.5 rounded-lg border flex items-center justify-center flex-shrink-0",
              isCritical
                ? "bg-rose-500/15 border-rose-500/40 text-rose-400"
                : "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
            )}
          >
            {isCritical ? (
              <ShieldAlert className="w-5 h-5" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-soc-400 font-bold">
                Security Directive
              </span>
              <span
                className={cn(
                  "text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase",
                  isCritical ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"
                )}
              >
                {recommendation.urgency} PROTOCOL
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-soc-100 tracking-tight mt-0.5">
              {recommendation.title}
            </h3>
          </div>
        </div>

        {feedbackMessage && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-mono animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            {feedbackMessage}
          </div>
        )}
      </div>

      {/* Rationale / Explanation */}
      <div className="py-4">
        <p className="text-xs sm:text-sm text-soc-300 leading-relaxed max-w-3xl">
          {recommendation.description}
        </p>
        <div className="mt-2 text-[11px] font-mono text-soc-400">
          <span className="text-soc-500">Triggering Signals:</span>{" "}
          <strong className="text-soc-200">{recommendation.triggeringSignals}</strong>
        </div>
      </div>

      {/* Actions Area: Clear Hierarchy */}
      <div className="pt-2 space-y-3">
        <span className="text-[10px] font-mono uppercase text-soc-400 tracking-wider font-semibold block">
          Recommended Incident Containment Action:
        </span>

        {/* Primary Action Button (Prominent) */}
        <div>
          <button
            type="button"
            onClick={() =>
              handleAction(
                recommendation.primaryAction.actionType,
                recommendation.primaryAction.label
              )
            }
            disabled={activeAction !== null}
            className={cn(
              "w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-xs sm:text-sm tracking-wide shadow-panel flex items-center justify-center space-x-2 transition-all duration-150 cursor-pointer disabled:opacity-50",
              isCritical
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
            )}
          >
            <span>{recommendation.primaryAction.label}</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Secondary Alternative Actions (Grouped & De-emphasized) */}
        {recommendation.secondaryActions.length > 0 && (
          <div className="pt-3 border-t border-soc-700/50">
            <span className="text-[10px] font-mono text-soc-400 block mb-2">
              Alternative Escalation Options:
            </span>
            <div className="flex flex-wrap gap-2">
              {recommendation.secondaryActions.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => handleAction(sec.actionType, sec.label)}
                  disabled={activeAction !== null}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-soc-800 hover:bg-soc-750 border border-soc-700 hover:border-soc-600 text-soc-200 text-xs font-mono font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                  {getSecondaryIcon(sec.actionType)}
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
