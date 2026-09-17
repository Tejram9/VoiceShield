import React from "react";
import { cn } from "@/lib/utils";

export interface TimelineEntryProps extends React.HTMLAttributes<HTMLDivElement> {
  time: string;
  title: string;
  severity?: "normal" | "caution" | "threat" | "critical" | "contained";
  description?: string;
  actionTaken?: string;
  isLast?: boolean;
}

export function TimelineEntry({
  time,
  title,
  severity = "normal",
  description,
  actionTaken,
  isLast = false,
  className,
  ...props
}: TimelineEntryProps) {
  const markerColors = {
    normal: "bg-surface-2 border-border-default",
    caution: "bg-risk-caution border-amber-600",
    threat: "bg-risk-threat border-orange-600",
    critical: "bg-risk-critical border-red-600",
    contained: "bg-risk-contained border-indigo-600",
  };

  return (
    <div className={cn("relative flex gap-3.5", className)} {...props}>
      {/* Left indicator column with vertical track line */}
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full border shrink-0 mt-1.5 z-10",
            markerColors[severity]
          )}
        />
        {!isLast && <div className="w-px flex-1 bg-border-default my-1" />}
      </div>

      {/* Content column */}
      <div className={cn("flex flex-col gap-1 pb-4 flex-1", isLast && "pb-1")}>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-content-muted">{time}</span>
          <span className="text-xs font-semibold text-content-primary">{title}</span>
        </div>

        {description && (
          <p className="text-xs text-content-secondary leading-relaxed">{description}</p>
        )}

        {actionTaken && (
          <div className="mt-1 inline-flex items-center gap-1.5 text-2xs font-mono px-2 py-0.5 rounded bg-surface-2 text-content-primary border border-border-subtle w-fit">
            <span className="text-content-muted">Action:</span>
            <span>{actionTaken}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Timeline({ className, children, ...props }: TimelineProps) {
  return (
    <div className={cn("flex flex-col w-full", className)} {...props}>
      {children}
    </div>
  );
}
