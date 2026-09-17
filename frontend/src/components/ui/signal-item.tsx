import React from "react";
import { cn } from "@/lib/utils";
import { RiskBadge } from "./risk-status";
import type { RiskLevel } from "@/types/dashboard";

export interface SignalItemProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  label: string;
  score: number;
  weight?: number;
  riskLevel: RiskLevel;
  confidenceLabel?: string;
  description?: string;
  textInterpretation?: string;
  technicalDetails?: string[];
}

export function SignalItem({
  label,
  score,
  weight,
  riskLevel,
  confidenceLabel,
  description,
  textInterpretation,
  technicalDetails,
  className,
  ...props
}: SignalItemProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-3.5 rounded-md bg-surface-1 border border-border-default hover:border-border-strong transition-colors",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-content-primary">{label}</span>
          {weight !== undefined && (
            <span className="text-2xs font-mono text-content-muted">
              {`wt: ${(weight * 100).toFixed(0)}%`}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xs font-mono text-content-muted">
            {`${score}/100`}
          </span>
          {confidenceLabel && (
            <span className="text-2xs font-mono text-content-muted hidden sm:inline">
              {confidenceLabel}
            </span>
          )}
          <RiskBadge level={riskLevel} size="sm" />
        </div>
      </div>

      {description && (
        <p className="text-xs text-content-secondary">{description}</p>
      )}

      {textInterpretation && (
        <div className="bg-surface-2 p-2 rounded text-xs text-content-primary border-l-2 border-border-strong">
          {textInterpretation}
        </div>
      )}

      {technicalDetails && technicalDetails.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {technicalDetails.map((detail, idx) => (
            <span
              key={idx}
              className="text-2xs font-mono px-2 py-0.5 rounded bg-surface-base text-content-muted border border-border-subtle"
            >
              {detail}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export interface SignalListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SignalList({ className, children, ...props }: SignalListProps) {
  return (
    <div className={cn("flex flex-col gap-2.5 w-full", className)} {...props}>
      {children}
    </div>
  );
}
