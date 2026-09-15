"use client";

import React, { useState } from "react";
import { AIFinding, RiskLevel } from "@/types/dashboard";
import { Clock, ShieldAlert, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThreatTimelineProps {
  events: AIFinding[];
  className?: string;
  onSelectEvent?: (event: AIFinding) => void;
}

export function ThreatTimeline({
  events,
  className,
  onSelectEvent,
}: ThreatTimelineProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const getSeverityIcon = (level: RiskLevel) => {
    switch (level) {
      case "CRITICAL":
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      case "HIGH":
        return <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />;
      case "MEDIUM":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const getSeverityDotClass = (level: RiskLevel) => {
    switch (level) {
      case "CRITICAL":
        return "bg-rose-500 border-rose-400 ring-2 ring-rose-500/20";
      case "HIGH":
        return "bg-orange-500 border-orange-400";
      case "MEDIUM":
        return "bg-amber-500 border-amber-400";
      default:
        return "bg-emerald-500 border-emerald-400";
    }
  };

  return (
    <div
      className={cn(
        "soc-panel p-5 space-y-4",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-soc-700/60 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-soc-100 uppercase font-mono tracking-wider">
              Chronological Threat Timeline
            </h4>
            <p className="text-[11px] text-soc-400">
              Sequence of audio events &amp; risk elevations
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-soc-750 text-soc-300">
          {events.length} Events Detected
        </span>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-soc-700">
        {events.map((evt) => {
          const isSelected = selectedId === evt.id;

          return (
            <div
              key={evt.id}
              onClick={() => {
                setSelectedId(isSelected ? null : evt.id);
                onSelectEvent?.(evt);
              }}
              className={cn(
                "relative group cursor-pointer transition-all duration-150 p-2.5 rounded-lg border",
                isSelected
                  ? "bg-soc-750 border-soc-600 shadow-subtle"
                  : "bg-soc-850/70 border-soc-700/60 hover:bg-soc-750/70 hover:border-soc-600"
              )}
            >
              {/* Timeline Indicator Dot */}
              <div
                className={cn(
                  "absolute -left-[1.85rem] top-3.5 w-3 h-3 rounded-full border-2 transition-transform group-hover:scale-125",
                  getSeverityDotClass(evt.severity)
                )}
              />

              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] font-bold text-soc-200">
                      {evt.timestamp}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-soc-950 text-soc-400 border border-soc-700/50">
                      {evt.signalSource}
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-soc-100 group-hover:text-blue-400 transition-colors">
                    {evt.title}
                  </h5>
                </div>

                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  {getSeverityIcon(evt.severity)}
                  <ChevronRight
                    className={cn(
                      "w-3.5 h-3.5 text-soc-500 transition-transform duration-150",
                      isSelected && "rotate-90 text-soc-200"
                    )}
                  />
                </div>
              </div>

              {/* Expandable Details */}
              {isSelected && (
                <div className="mt-2.5 pt-2.5 border-t border-soc-700/60 text-[11px] text-soc-300 space-y-1 animate-in fade-in duration-150 font-mono">
                  <p className="text-soc-300 leading-relaxed">{evt.details}</p>
                  <div className="flex items-center space-x-2 text-[10px] text-soc-400 pt-1">
                    <span>Severity: <strong className="text-soc-200">{evt.severity}</strong></span>
                    <span>•</span>
                    <span>Action: Forensic Snapshot Saved</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
