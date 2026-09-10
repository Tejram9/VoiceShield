import * as React from "react";
import { cn, getRiskColorClasses } from "@/lib/utils";
import { RiskLevel } from "@/types/dashboard";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "active" | "neutral" | RiskLevel;
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  let variantClasses = "bg-slate-800 text-slate-300 border-slate-700";

  if (variant === "LOW" || variant === "MEDIUM" || variant === "HIGH") {
    const riskStyles = getRiskColorClasses(variant);
    variantClasses = `${riskStyles.badge} border ${riskStyles.glow}`;
  } else if (variant === "active") {
    variantClasses = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse";
  } else if (variant === "outline") {
    variantClasses = "bg-transparent text-slate-300 border border-slate-700";
  } else if (variant === "neutral") {
    variantClasses = "bg-slate-800/80 text-slate-300 border border-slate-700/60";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900",
        variantClasses,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
