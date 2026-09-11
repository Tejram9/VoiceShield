"use client";

/**
 * VoiceShield — Detection Events & Security Findings Stream
 *
 * Implements SplitSmart Soft-Professional Fintech Design:
 * - Level 1 White Card with diffused ambient shadow
 * - High-contrast functional signaling for security findings
 */

import React from "react";
import type { SecurityFinding, SecurityEvent } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Shield, Activity } from "lucide-react";

type DisplayItem =
  | { kind: "finding"; data: SecurityFinding }
  | { kind: "event"; data: SecurityEvent };

interface AIFindingsPanelProps {
  findings: SecurityFinding[];
  events: SecurityEvent[];
}

export function AIFindingsPanel({ findings, events }: AIFindingsPanelProps) {
  const items: DisplayItem[] = [
    ...findings.map((f): DisplayItem => ({ kind: "finding", data: f })),
    ...events
      .filter((e) =>
        e.event_type !== "ANALYSIS_STARTED" &&
        e.event_type !== "ANALYSIS_COMPLETED"
      )
      .map((e): DisplayItem => ({ kind: "event", data: e })),
  ];

  const totalCount = items.length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-6 pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#0F172A] tracking-tight font-sans">
            Real-Time AI Findings &amp; Detection Feed
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5 font-sans">
            Live chronological stream of security evaluations and threat anomalies
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {findings.length > 0 && (
            <span className="text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 font-mono font-bold text-[10px]">
              {findings.length} Finding{findings.length === 1 ? "" : "s"}
            </span>
          )}
          <span className="bg-slate-100 text-slate-700 px-3 py-0.5 rounded-full border border-slate-200 font-mono text-[10px] font-bold">
            {totalCount} Total Event{totalCount === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-6 max-h-80 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#64748B] font-mono">
            NO_FINDINGS_RECORDED // No detection anomalies or security alerts logged for this session.
          </div>
        ) : (
          items.map((item, idx) => {
            if (item.kind === "finding") {
              return <FindingRow key={`f-${item.data.finding_id}`} finding={item.data} />;
            }
            return <EventRow key={`e-${item.data.event_id || idx}`} event={item.data} />;
          })
        )}
      </div>
    </div>
  );
}

function FindingRow({ finding }: { finding: SecurityFinding }) {
  return (
    <div className="p-4 rounded-xl bg-red-50/40 border border-red-200 border-l-4 border-l-red-500 space-y-1.5 hover:border-red-300 transition-all duration-150">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span className="text-[#64748B] text-[11px] font-mono">{finding.timestamp}</span>
          <span className="text-red-700 font-mono font-bold uppercase text-[11px] tracking-wide">
            {finding.category.replace(/_/g, " ")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={finding.severity} className="text-[10px] font-bold px-2.5 py-0.5">
            {finding.severity}
          </Badge>
          {finding.confidence > 0 && (
            <span className="text-[#64748B] text-xs font-mono font-semibold">{Math.round(finding.confidence * 100)}% conf</span>
          )}
        </div>
      </div>
      <p className="text-sm font-bold text-[#0F172A] font-sans">{finding.title}</p>
      <p className="text-xs text-[#475569] leading-relaxed font-sans">{finding.details}</p>
    </div>
  );
}

function EventRow({ event }: { event: SecurityEvent }) {
  const displaySource = event.source?.replace(/Real|Provider|TDNN|ECAPA/g, "").trim() || event.source;
  const displayType = event.event_type
    .replace(/_/g, " ")
    .replace("UPDATED", "")
    .replace("ANALYSIS", "")
    .trim();

  return (
    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 hover:border-slate-300 transition-all duration-150">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Activity className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span className="text-[#64748B] text-[11px] font-mono">{event.timestamp}</span>
          <span className="text-blue-700 font-mono font-bold text-xs">{displaySource}</span>
          <span className="text-[#64748B] text-[10px] uppercase font-mono">{displayType}</span>
        </div>
        <Badge variant={event.severity} className="text-[9px] font-bold px-2 py-0.5">
          {event.severity}
        </Badge>
      </div>
      <p className="text-xs text-[#475569] leading-relaxed pl-5.5 font-sans">{event.message}</p>
    </div>
  );
}

