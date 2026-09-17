import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: "sm" | "md" | "full";
}

export function Skeleton({
  width,
  height,
  rounded = "md",
  className,
  style,
  ...props
}: SkeletonProps) {
  const roundedStyles = {
    sm: "rounded-sm",
    md: "rounded-md",
    full: "rounded-full",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-surface-2",
        roundedStyles[rounded],
        className
      )}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-md border border-dashed border-border-default bg-surface-base/50 gap-3",
        className
      )}
      {...props}
    >
      {icon && <div className="text-content-muted">{icon}</div>}
      <div className="flex flex-col gap-1 max-w-sm">
        <h4 className="text-sm font-semibold text-content-primary">{title}</h4>
        {description && (
          <p className="text-xs text-content-secondary leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Button variant="secondary" size="xs" onClick={action.onClick} className="mt-1">
          {action.label}
        </Button>
      )}
    </div>
  );
}

export interface ErrorBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  code?: string;
  onRetry?: () => void;
}

export function ErrorBanner({
  title = "System Anomaly Encountered",
  message,
  code,
  onRetry,
  className,
  ...props
}: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded bg-risk-critical-subtle border border-risk-critical-border text-xs",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-red-300">{title}</span>
          {code && (
            <span className="font-mono text-2xs px-1.5 py-0.2 rounded bg-surface-base text-red-400 border border-risk-critical-border">
              {code}
            </span>
          )}
        </div>
        <p className="text-content-secondary leading-normal">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="xs" onClick={onRetry} className="border-risk-critical-border hover:bg-risk-critical-subtle text-red-300 shrink-0">
          Retry
        </Button>
      )}
    </div>
  );
}
