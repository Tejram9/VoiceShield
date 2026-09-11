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
 * Low / Safe: Verified Green (#10B981) with emerald glow
 * Medium / Warning: Amber (#F59E0B) with golden glow
 * High / Threat: Threat Red (#EF4444) with crimson glow
 */
export function getRiskColorClasses(level: RiskLevel) {
  switch (level) {
    case "LOW":
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-none",
        text: "text-emerald-600",
        bg: "bg-emerald-500",
        border: "border-emerald-200",
        ring: "ring-emerald-200",
        glow: "shadow-sm",
      };
    case "MEDIUM":
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200 shadow-none",
        text: "text-amber-600",
        bg: "bg-amber-500",
        border: "border-amber-200",
        ring: "ring-amber-200",
        glow: "shadow-sm",
      };
    case "HIGH":
      return {
        badge: "bg-red-50 text-red-700 border-red-200 shadow-none",
        text: "text-red-600",
        bg: "bg-red-500",
        border: "border-red-200",
        ring: "ring-red-200",
        glow: "shadow-sm",
      };
    default:
      return {
        badge: "bg-blue-50 text-blue-700 border-blue-200 shadow-none",
        text: "text-blue-600",
        bg: "bg-blue-500",
        border: "border-blue-200",
        ring: "ring-blue-200",
        glow: "shadow-sm",
      };
  }
}

