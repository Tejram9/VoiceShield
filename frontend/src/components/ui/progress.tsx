import * as React from "react";
import { cn, getRiskColorClasses } from "@/lib/utils";
import { RiskLevel } from "@/types/dashboard";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  riskLevel?: RiskLevel;
  indicatorClassName?: string;
}

export function Progress({
  value,
  max = 100,
  riskLevel,
  className,
  indicatorClassName,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  let barColorClass = "bg-blue-500";
  if (riskLevel) {
    barColorClass = getRiskColorClasses(riskLevel).bg;
  }

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-slate-800", className)}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 transition-all duration-500 ease-out", barColorClass, indicatorClassName)}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
}
