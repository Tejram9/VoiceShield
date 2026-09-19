"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { TimelineEventData } from "@/lib/demo-state";
import { SecurityTimeline } from "./security-timeline";
import {
  Phone,
  CheckCircle2,
  AlertTriangle,
  User,
} from "lucide-react";

export interface CallerCardProps {
  name?: string;
  initials?: string;
  role?: string;
  phone?: string;
  isTrustedContact?: boolean;
  isVerifiedNumber?: boolean;
  hasSensitiveAction?: boolean;
  sensitiveActionText?: string;
  timelineEvents?: TimelineEventData[];
  className?: string;
}

export function CallerCard({
  name = "Rahul Sharma",
  initials = "RS",
  role = "Chief Financial Officer",
  phone = "+91 98765 43210",
  isTrustedContact = true,
  isVerifiedNumber = true,
  hasSensitiveAction = true,
  sensitiveActionText = "Financial request",
  timelineEvents,
  className,
}: CallerCardProps) {
  return (
    <div
      className={cn(
        "w-full bg-white border border-slate-200/70 rounded-xl p-5 flex flex-col gap-4 text-slate-800",
        className
      )}
    >
      {/* Header Label */}
      <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
        CALLER
      </span>

      {/* Identity Block */}
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
          {initials}
        </div>

        <div className="flex flex-col min-w-0">
          <h2 className="text-base font-bold text-slate-900 tracking-tight leading-snug truncate">
            {name}
          </h2>
          <span className="text-xs text-slate-500 font-medium leading-normal">
            {role}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 mt-1">
            <Phone className="h-3 w-3 text-slate-400" />
            <span>{phone}</span>
          </div>
          {/* Streamlined Trust Badge directly on identity */}
          <div className="flex items-center gap-1 text-2xs text-emerald-700 font-medium mt-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
            <span>{isTrustedContact ? "Trusted Contact" : "Unverified Identity"}</span>
          </div>
        </div>
      </div>

      {/* Current Context Checklist */}
      <div className="pt-3.5 border-t border-slate-100 flex flex-col gap-2.5">
        <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
          CURRENT CONTEXT
        </span>

        <div className="flex flex-col gap-2">
          {/* Row 1: Known contact */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <User className="h-3.5 w-3.5 text-slate-400" />
              <span>Known contact</span>
            </div>
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          </div>

          {/* Row 2: Verified number */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <span>Verified number</span>
            </div>
            {isVerifiedNumber ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            )}
          </div>

          {/* Row 3: Sensitive Action */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <AlertTriangle
                  className={cn(
                    "h-3.5 w-3.5",
                    hasSensitiveAction ? "text-amber-500" : "text-slate-400"
                  )}
                />
                <span className={hasSensitiveAction ? "font-medium text-slate-900" : ""}>
                  Sensitive action
                </span>
              </div>
              {hasSensitiveAction ? (
                <div className="h-4 w-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-2xs shrink-0">
                  !
                </div>
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              )}
            </div>
            {hasSensitiveAction && (
              <span className="text-2xs text-amber-600 font-medium pl-5.5">
                {sensitiveActionText}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Integrated Compact Security Timeline */}
      {timelineEvents && timelineEvents.length > 0 && (
        <SecurityTimeline embedded events={timelineEvents} />
      )}
    </div>
  );
}
