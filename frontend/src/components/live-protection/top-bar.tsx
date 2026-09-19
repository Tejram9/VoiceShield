"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { DemoStage, DemoStageMeta } from "@/lib/demo-state";
import {
  Phone,
  BarChart2,
  Bell,
  User,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

export interface TopBarProps {
  currentStage: DemoStage;
  stages: DemoStageMeta[];
  onSelectStage: (stage: DemoStage) => void;
  callDuration: string;
  audioQuality?: string;
  isContained?: boolean;
  className?: string;
}

export function TopBar({
  currentStage,
  stages,
  onSelectStage,
  callDuration = "02:17",
  audioQuality = "Good",
  isContained = false,
  className,
}: TopBarProps) {
  return (
    <div className={cn("flex flex-col gap-3.5 w-full", className)}>
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
        {/* Title + Protection Status Pill */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Live Protection
          </h1>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
              isContained
                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isContained ? "bg-indigo-600" : "bg-emerald-500 animate-pulse"
              )}
            />
            <span>{isContained ? "Threat Contained" : "Protection Active"}</span>
          </span>
        </div>

        {/* Right Header Area: Clearly Secondary SIH Demo Switcher & Officer Profile */}
        <div className="flex items-center gap-3.5 flex-wrap">
          {/* Secondary SIH Demo Evaluator Tool */}
          <div className="flex items-center gap-1.5 bg-slate-100/70 px-2 py-0.5 rounded-md border border-slate-200/50 text-2xs text-slate-400">
            <SlidersHorizontal className="h-3 w-3 text-slate-400" />
            <span className="text-2xs text-slate-400 hidden xl:inline font-normal">
              Demo:
            </span>
            <div className="flex items-center gap-0.5">
              {stages.map((stage) => {
                const isActive = stage.id === currentStage;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => onSelectStage(stage.id)}
                    className={cn(
                      "px-1.5 py-0.5 rounded text-2xs transition-colors whitespace-nowrap",
                      isActive
                        ? "bg-white text-slate-800 font-semibold border border-slate-200/60"
                        : "text-slate-500 hover:text-slate-800"
                    )}
                    title={stage.description}
                  >
                    {stage.shortTitle}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notification Bell */}
          <button
            type="button"
            className="relative p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* Security Officer Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200/60">
            <div className="h-7 w-7 rounded-full bg-slate-200/80 text-slate-600 flex items-center justify-center font-semibold text-xs shrink-0">
              <User className="h-3.5 w-3.5 text-slate-600" />
            </div>
            <div className="flex flex-col text-left hidden sm:flex">
              <span className="text-xs font-semibold text-slate-800 leading-tight">
                Security Officer
              </span>
              <span className="text-2xs text-slate-400 leading-tight">
                SIH Operations
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400 hidden sm:inline" />
          </div>
        </div>
      </div>

      {/* Live Call Monitoring Strip - Subtle, calm, integrated with soft border and no heavy shadow */}
      <div className="w-full bg-white border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Live Call Status & Ticking Duration */}
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-white shrink-0",
              isContained ? "bg-indigo-600" : "bg-emerald-500"
            )}
          >
            <Phone className="h-3.5 w-3.5 fill-white stroke-none" />
          </div>

          <div className="flex flex-col">
            <span className="text-2xs font-mono uppercase tracking-wider text-slate-400 font-medium leading-none">
              {isContained ? "SESSION FROZEN" : "LIVE CALL"}
            </span>
            <span className="text-sm font-bold tracking-tight text-slate-900 font-mono leading-tight mt-0.5">
              {callDuration}
            </span>
          </div>
        </div>

        {/* Right: Audio Quality Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200/60">
          <BarChart2 className="h-3 w-3 text-emerald-600" />
          <div className="flex items-center gap-1.5 text-left">
            <span className="text-2xs uppercase tracking-wider text-slate-400 font-medium">
              AUDIO QUALITY
            </span>
            <span className="text-xs font-semibold text-slate-800">
              {audioQuality}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
