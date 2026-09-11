import * as React from "react";
import { cn, getRiskColorClasses } from "@/lib/utils";
import { RiskLevel } from "@/types/dashboard";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "active" | "neutral" | RiskLevel;
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  let variantClasses = "bg-slate-100 text-[#64748B] border-slate-200";

  if (variant === "LOW" || variant === "MEDIUM" || variant === "HIGH") {
    const riskStyles = getRiskColorClasses(variant);
    variantClasses = `${riskStyles.badge} border ${riskStyles.glow}`;
  } else if (variant === "active") {
    variantClasses = "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm animate-pulse";
  } else if (variant === "outline") {
    variantClasses = "bg-transparent text-[#64748B] border border-slate-300 hover:border-slate-400";
  } else if (variant === "neutral") {
    variantClasses = "bg-slate-100 text-[#64748B] border border-slate-200";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/40",
        variantClasses,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

