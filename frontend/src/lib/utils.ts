import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { RiskLevel } from "@/types/dashboard";

/**
 * Combines Tailwind CSS class names with clsx and twMerge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns semantic color styles for risk levels (LOW, MEDIUM, HIGH).
 */
export function getRiskColorClasses(level: RiskLevel) {
  switch (level) {
    case "LOW":
      return {
        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        text: "text-emerald-400",
        bg: "bg-emerald-500",
        border: "border-emerald-500/30",
        ring: "ring-emerald-500/20",
        glow: "shadow-[0_0_12px_rgba(16,185,129,0.25)]",
      };
    case "MEDIUM":
      return {
        badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        text: "text-amber-400",
        bg: "bg-amber-500",
        border: "border-amber-500/30",
        ring: "ring-amber-500/20",
        glow: "shadow-[0_0_12px_rgba(245,158,11,0.25)]",
      };
    case "HIGH":
      return {
        badge: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        text: "text-rose-400",
        bg: "bg-rose-500",
        border: "border-rose-500/30",
        ring: "ring-rose-500/20",
        glow: "shadow-[0_0_16px_rgba(244,63,94,0.3)]",
      };
    default:
      return {
        badge: "bg-slate-500/10 text-slate-400 border-slate-500/30",
        text: "text-slate-400",
        bg: "bg-slate-500",
        border: "border-slate-500/30",
        ring: "ring-slate-500/20",
        glow: "",
      };
  }
}
