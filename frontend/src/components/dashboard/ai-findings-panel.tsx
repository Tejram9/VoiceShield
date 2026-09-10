"use client";

/**
 * VoiceShield — Detection Events & Security Findings Stream
 *
 * Renders the real-time findings feed from the AI analysis pipeline.
 * Accepts two clearly typed inputs:
 *   1. SecurityFinding[] — typed findings from SECURITY_FINDING events
 *   2. SecurityEvent[]   — raw AI pipeline events (all types)
 *
 * Security findings are shown with higher visual prominence.
 * General pipeline events are shown with subdued style.
 *
 * Newest entries first. All timestamps from backend are shown as-is.
 * Empty state is honest — no fake findings.
 */

import React from "react";
import type { SecurityFinding, SecurityEvent } from "@/lib/api/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Activity } from "lucide-react";

type DisplayItem =
  | { kind: "finding"; data: SecurityFinding }
  | { kind: "event"; data: SecurityEvent };

interface AIFindingsPanelProps {
  /** Typed SecurityFinding objects from SECURITY_FINDING events */
  findings: SecurityFinding[];
  /** All raw SecurityEvent objects for the general events feed */
  events: SecurityEvent[];
}

export function AIFindingsPanel({ findings, events }: AIFindingsPanelProps) {
  // Merge findings and events into a single chronological stream
  // Findings take visual priority, events fill context
  const items: DisplayItem[] = [
    ...findings.map((f): DisplayItem => ({ kind: "finding", data: f })),
    // Show pipeline events that are NOT ANALYSIS_STARTED (too noisy)
    ...events
      .filter((e) =>
        e.event_type !== "ANALYSIS_STARTED" &&
        e.event_type !== "ANALYSIS_COMPLETED"
      )
      .map((e): DisplayItem => ({ kind: "event", data: e })),
  ];

  const totalCount = items.length;

  return (
    <Card className="border-slate-800 bg-slate-900/90">
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300">
            DETECTION EVENTS & SECURITY FINDINGS STREAM
          </CardTitle>
          <span className="text-[10px] font-mono text-slate-400">
            {findings.length > 0 && (
              <span className="text-rose-400 font-bold mr-1.5">{findings.length} Finding{findings.length === 1 ? "" : "s"}</span>
            )}
            {totalCount - findings.length > 0 && (
              <span>{totalCount - findings.length} Event{totalCount - findings.length === 1 ? "" : "s"}</span>
            )}
            {totalCount === 0 && "No Events"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-1.5 pt-0 max-h-80 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-4 text-center rounded bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-400">
            No security findings or detection events recorded yet for this session.
          </div>
        ) : (
          items.map((item, idx) => {
            if (item.kind === "finding") {
              return <FindingRow key={`f-${item.data.finding_id}`} finding={item.data} />;
            }
            return <EventRow key={`e-${item.data.event_id || idx}`} event={item.data} />;
          })
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Finding row — higher visual prominence (from SECURITY_FINDING events)
// ---------------------------------------------------------------------------

function FindingRow({ finding }: { finding: SecurityFinding }) {
  return (
    <div className="p-2.5 rounded bg-slate-950/90 border border-slate-700 space-y-1">
      <div className="flex items-center justify-between font-mono text-[10px]">
        <div className="flex items-center space-x-2">
          <Shield className="w-3 h-3 text-rose-400 flex-shrink-0" />
          <span className="text-slate-400 font-semibold">{finding.timestamp}</span>
          <span className="text-rose-300 font-bold uppercase">
            {finding.category.replace(/_/g, " ")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant={finding.severity} className="text-[9px] font-mono font-bold px-1.5 py-0.2">
            {finding.severity}
          </Badge>
          {finding.confidence > 0 && (
            <span className="text-slate-500">{Math.round(finding.confidence * 100)}%</span>
          )}
        </div>
      </div>
      <p className="text-xs font-semibold text-white font-mono">{finding.title}</p>
      <p className="text-[11px] text-slate-400 leading-tight">{finding.details}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Event row — subdued style for general pipeline events
// ---------------------------------------------------------------------------

function EventRow({ event }: { event: SecurityEvent }) {
  const displaySource = event.source?.replace(/Real|Provider|TDNN|ECAPA/g, "").trim() || event.source;
  const displayType = event.event_type
    .replace(/_/g, " ")
    .replace("UPDATED", "")
    .replace("ANALYSIS", "")
    .trim();

  return (
    <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80 space-y-0.5">
      <div className="flex items-center justify-between font-mono text-[10px]">
        <div className="flex items-center space-x-1.5">
          <Activity className="w-2.5 h-2.5 text-slate-500 flex-shrink-0" />
          <span className="text-slate-500">{event.timestamp}</span>
          <span className="text-slate-400 font-semibold uppercase">{displaySource}</span>
          <span className="text-slate-600 uppercase text-[9px]">{displayType}</span>
        </div>
        <Badge variant={event.severity} className="text-[9px] font-mono font-bold px-1.5 py-0.2 opacity-80">
          {event.severity}
        </Badge>
      </div>
      <p className="text-[11px] text-slate-400 leading-tight pl-4">{event.message}</p>
    </div>
  );
}
