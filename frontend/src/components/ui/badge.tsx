import * as React from "react";
import { cn, getRiskColorClasses } from "@/lib/utils";
import { RiskLevel } from "@/types/dashboard";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "active" | "neutral" | RiskLevel;
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  let variantClasses = "bg-soc-800 text-soc-300 border-soc-700";

  if (variant === "LOW" || variant === "MEDIUM" || variant === "HIGH" || variant === "CRITICAL") {
    const riskStyles = getRiskColorClasses(variant);
    variantClasses = `${riskStyles.badge} border`;
  } else if (variant === "active") {
    variantClasses = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
  } else if (variant === "outline") {
    variantClasses = "bg-transparent text-soc-300 border border-soc-700 hover:border-soc-600";
  } else if (variant === "neutral") {
    variantClasses = "bg-soc-800 text-soc-300 border border-soc-700";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide uppercase transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500/40",
        variantClasses,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

