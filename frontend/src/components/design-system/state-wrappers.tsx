"use client";

import React from "react";
import { Loader2, ShieldOff, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingState({
  title = "Analyzing Telephony Stream...",
  description = "Extracting acoustic features and running neural spoof inference.",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-soc-800/80 border border-soc-700 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-panel",
        className
      )}
    >
      <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
        <Loader2 className="w-7 h-7 animate-spin" />
        <div className="absolute inset-0 rounded-2xl border border-blue-400/40 animate-ping opacity-30" />
      </div>
      <div className="space-y-1.5 max-w-sm">
        <h4 className="text-sm sm:text-base font-bold text-soc-100 font-mono tracking-tight">
          {title}
        </h4>
        <p className="text-xs text-soc-400 leading-relaxed">{description}</p>
      </div>
      <div className="flex items-center space-x-1.5 text-[11px] font-mono text-soc-500 pt-2">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        <span>faster-whisper + ECAPA-TDNN active</span>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = ShieldOff,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-soc-850/60 border border-dashed border-soc-700 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3.5",
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-soc-800 border border-soc-700 flex items-center justify-center text-soc-400">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-bold text-soc-100 tracking-tight">{title}</h4>
        <p className="text-xs text-soc-400 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 px-4 py-2 rounded-lg bg-soc-750 hover:bg-soc-700 border border-soc-600 text-xs font-mono font-semibold text-soc-100 transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorBanner({
  title = "Telemetry Stream Disconnected",
  message,
  onRetry,
  className,
}: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl bg-rose-950/30 border border-rose-500/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-panel",
        className
      )}
    >
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 flex-shrink-0">
          <AlertTriangle className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <h5 className="font-bold font-mono text-rose-200 tracking-tight">{title}</h5>
          <p className="text-rose-300/80 mt-0.5 leading-relaxed">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono font-semibold text-xs transition-colors self-start sm:self-center cursor-pointer shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}

interface SuccessToastProps {
  title: string;
  description?: string;
  className?: string;
}

export function SuccessToast({ title, description, className }: SuccessToastProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-emerald-950/30 border border-emerald-500/40 p-3.5 flex items-center space-x-3 text-xs shadow-panel animate-in fade-in duration-200",
        className
      )}
    >
      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 flex-shrink-0">
        <CheckCircle2 className="w-4 h-4" />
      </div>
      <div>
        <h5 className="font-bold text-emerald-200 tracking-tight">{title}</h5>
        {description && <p className="text-emerald-300/80 text-[11px]">{description}</p>}
      </div>
    </div>
  );
}
