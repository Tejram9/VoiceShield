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
 * Returns semantic color styles for risk levels using Cybersecurity Dark SOC palette.
 * Low / Safe: Verified Emerald (#10B981)
 * Medium / Caution: Amber (#F59E0B)
 * High / Threat: Orange-Red (#F97316)
 * Critical / Impersonation: Crimson (#EF4444)
 */
export function getRiskColorClasses(level: RiskLevel) {
  switch (level) {
    case "LOW":
      return {
        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        text: "text-emerald-400",
        bg: "bg-emerald-500",
        border: "border-emerald-500/30",
        ring: "ring-emerald-500/30",
        glow: "shadow-subtle",
        label: "VERIFIED / LOW RISK",
      };
    case "MEDIUM":
      return {
        badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        text: "text-amber-400",
        bg: "bg-amber-500",
        border: "border-amber-500/30",
        ring: "ring-amber-500/30",
        glow: "shadow-subtle",
        label: "ELEVATED CAUTION",
      };
    case "HIGH":
      return {
        badge: "bg-orange-500/10 text-orange-400 border-orange-500/30",
        text: "text-orange-400",
        bg: "bg-orange-500",
        border: "border-orange-500/30",
        ring: "ring-orange-500/30",
        glow: "shadow-subtle",
        label: "HIGH IMPERSONATION THREAT",
      };
    case "CRITICAL":
      return {
        badge: "bg-rose-500/15 text-rose-400 border-rose-500/40",
        text: "text-rose-400",
        bg: "bg-rose-500",
        border: "border-rose-500/40",
        ring: "ring-rose-500/40",
        glow: "shadow-subtle",
        label: "CRITICAL VOICE CLONE ATTACK",
      };
    default:
      return {
        badge: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        text: "text-blue-400",
        bg: "bg-blue-500",
        border: "border-blue-500/30",
        ring: "ring-blue-500/30",
        glow: "shadow-subtle",
        label: "INITIALIZING",
      };
  }
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
