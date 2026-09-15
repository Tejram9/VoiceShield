"use client";

import React from "react";
import { MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type EventCategory =
  | "IDENTITY_CLAIM"
  | "URGENCY"
  | "FINANCIAL_REQUEST"
  | "OTP_CREDENTIAL"
  | "VERIFICATION_BYPASS"
  | "THREAT_PRESSURE"
  | "SENSITIVE_INFO"
  | "SUSPICIOUS_INSTRUCTION";

export interface TranscriptEntry {
  id: string;
  timestamp: string;
  speaker: "CALLER" | "OPERATOR" | "SYSTEM";
  text: string;
  category?: EventCategory;
  riskLevel?: "LOW" | "ELEVATED" | "HIGH" | "CRITICAL";
}

interface ConversationStreamProps {
  entries?: TranscriptEntry[];
  liveText?: string;
  isStreaming?: boolean;
  className?: string;
}

export const DEFAULT_TRANSCRIPT_ENTRIES: TranscriptEntry[] = [
  {
    id: "tr-1",
    timestamp: "00:12",
    speaker: "OPERATOR",
    text: "Executive Treasury Desk, Rachel Vance speaking. How can I assist?",
    riskLevel: "LOW",
  },
  {
    id: "tr-2",
    timestamp: "00:18",
    speaker: "CALLER",
    text: "Rachel, it's Rahul Sharma. I'm currently in closed-door sessions with our Zurich acquisition partners.",
    category: "IDENTITY_CLAIM",
    riskLevel: "LOW",
  },
  {
    id: "tr-3",
    timestamp: "00:34",
    speaker: "CALLER",
    text: "We need an emergency $45,000 wire released to our Zurich escrow routing account immediately to secure the option.",
    category: "FINANCIAL_REQUEST",
    riskLevel: "HIGH",
  },
  {
    id: "tr-4",
    timestamp: "00:52",
    speaker: "OPERATOR",
    text: "Mr. Sharma, corporate treasury policy requires verbal pre-shared safe word confirmation for all off-ledger disbursements above $10,000.",
    riskLevel: "LOW",
  },
  {
    id: "tr-5",
    timestamp: "01:05",
    speaker: "CALLER",
    text: "I don't have access to my safe words in this conference room! The window closes in twenty minutes or we lose the acquisition.",
    category: "URGENCY",
    riskLevel: "CRITICAL",
  },
  {
    id: "tr-6",
    timestamp: "01:24",
    speaker: "CALLER",
    text: "Bypass the dual authorization and mark it under my personal executive override code immediately.",
    category: "VERIFICATION_BYPASS",
    riskLevel: "CRITICAL",
  },
];

export function ConversationStream({
  entries = DEFAULT_TRANSCRIPT_ENTRIES,
  liveText = "",
  isStreaming = false,
  className,
}: ConversationStreamProps) {
  const getSemanticMarker = (category?: EventCategory) => {
    switch (category) {
      case "IDENTITY_CLAIM":
        return (
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded border bg-purple-500/10 text-purple-300 border-purple-500/30">
            [IDENTITY CLAIM]
          </span>
        );
      case "URGENCY":
        return (
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded border bg-amber-500/10 text-amber-300 border-amber-500/30">
            [URGENCY]
          </span>
        );
      case "FINANCIAL_REQUEST":
        return (
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded border bg-rose-500/10 text-rose-300 border-rose-500/30">
            [FINANCIAL]
          </span>
        );
      case "OTP_CREDENTIAL":
        return (
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded border bg-rose-500/10 text-rose-300 border-rose-500/30">
            [OTP]
          </span>
        );
      case "VERIFICATION_BYPASS":
        return (
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded border bg-orange-500/10 text-orange-300 border-orange-500/30">
            [BYPASS]
          </span>
        );
      case "THREAT_PRESSURE":
        return (
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded border bg-rose-500/10 text-rose-300 border-rose-500/30">
            [COERCION]
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("soc-panel p-4 space-y-3 flex flex-col font-sans", className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-soc-700/60">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
          <div>
            <h3 className="text-xs font-mono font-semibold text-white tracking-tight">
              Live Spoken Conversation Transcript
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-soc-400">
          {isStreaming && (
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              LIVE INGESTION
            </span>
          )}
          <span>ASR + Intent Scoring</span>
        </div>
      </div>

      {/* Transcript Log */}
      <div className="space-y-2.5 flex-1 max-h-[360px] overflow-y-auto pr-1 divide-y divide-soc-800/80">
        {entries.map((entry, idx) => {
          const isCaller = entry.speaker === "CALLER";
          const isThreat = entry.riskLevel === "CRITICAL" || entry.riskLevel === "HIGH";

          return (
            <div
              key={entry.id || idx}
              className={cn(
                "pt-2.5 first:pt-0 space-y-1 transition-colors",
                isThreat ? "text-soc-100" : "text-soc-200"
              )}
            >
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[10px] text-soc-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-soc-600" />
                    {entry.timestamp}
                  </span>
                  <span
                    className={cn(
                      "font-semibold uppercase tracking-wider text-[10px]",
                      isCaller ? "text-purple-300" : "text-blue-300"
                    )}
                  >
                    {isCaller ? "Caller (Rahul Sharma)" : "Operator (Rachel Vance)"}
                  </span>
                </div>

                {entry.category && getSemanticMarker(entry.category)}
              </div>

              <p
                className={cn(
                  "text-xs leading-relaxed pl-4 border-l-2",
                  isThreat
                    ? "border-rose-500/60 text-white font-normal"
                    : isCaller
                    ? "border-soc-700 text-soc-200"
                    : "border-soc-800 text-soc-300"
                )}
              >
                &ldquo;{entry.text}&rdquo;
              </p>
            </div>
          );
        })}

        {/* Live Incoming Speech Stream Buffer */}
        {liveText && (
          <div className="pt-2.5 space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono text-blue-300 font-semibold uppercase">
              <span>Incoming Speech Buffer:</span>
            </div>
            <p className="text-xs text-soc-100 italic pl-4 border-l-2 border-blue-500/50">
              &ldquo;{liveText}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
