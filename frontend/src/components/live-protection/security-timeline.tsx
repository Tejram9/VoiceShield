"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { TimelineEventData } from "@/lib/demo-state";
import { Clock } from "lucide-react";

export interface SecurityTimelineProps {
  events: TimelineEventData[];
  embedded?: boolean;
  className?: string;
}

export function SecurityTimeline({
  events,
  embedded = false,
  className,
}: SecurityTimelineProps) {
  const getDotColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-rose-500 ring-2 ring-rose-100";
      case "threat":
        return "bg-amber-500 ring-2 ring-amber-100";
      case "caution":
        return "bg-amber-400";
      case "contained":
        return "bg-indigo-500 ring-2 ring-indigo-100";
      default:
        return "bg-emerald-500";
    }
  };

  const getTitleColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-rose-600 font-bold";
      case "contained":
        return "text-indigo-600 font-bold";
      default:
        return "text-slate-800 font-semibold";
    }
  };

  const content = (
    <div className="flex flex-col gap-2.5">
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <Clock className="h-3 w-3 text-slate-400" />
        <h3 className="text-xs font-semibold text-slate-900 tracking-tight">
          Security Timeline
        </h3>
      </div>

      {/* Compact Timeline List */}
      <div className="flex flex-col relative pl-1">
        {events.map((event, idx) => {
          const isLast = idx === events.length - 1;

          return (
            <div key={idx} className="relative flex items-start gap-2 pb-2 last:pb-0 group">
              {/* Slender vertical connector track */}
              {!isLast && (
                <div className="absolute left-[3px] top-2 bottom-0 w-px bg-slate-200/70" />
              )}

              {/* Compact dot */}
              <div
                className={cn(
                  "h-1.5 w-1.5 rounded-full shrink-0 mt-1 z-10",
                  getDotColor(event.severity)
                )}
              />

              {/* Compact Event Row */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-2xs text-slate-400 shrink-0">
                    {event.time}
                  </span>
                  <span className={cn("text-xs leading-tight truncate", getTitleColor(event.severity))}>
                    {event.title}
                  </span>
                </div>
                <p className="text-2xs text-slate-400 leading-tight mt-0.5 truncate">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (embedded) {
    return <div className={cn("w-full pt-3 border-t border-slate-100", className)}>{content}</div>;
  }

  return (
    <div
      className={cn(
        "w-full bg-white border border-slate-200/70 rounded-xl p-3.5 flex flex-col gap-2.5 text-slate-800",
        className
      )}
    >
      {content}
    </div>
  );
}
