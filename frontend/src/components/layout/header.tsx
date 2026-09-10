"use client";

import React from "react";
import { User, Bell, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConnectionState } from "@/lib/websocket/analysis-socket";

interface HeaderProps {
  connectionState?: ConnectionState;
  sessionId?: string;
}

export function Header({ connectionState = "CONNECTED", sessionId }: HeaderProps) {
  const isConnected = connectionState === "CONNECTED";
  const isConnecting = connectionState === "CONNECTING" || connectionState === "RECONNECTING";

  return (
    <header className="sticky top-0 z-30 bg-slate-950/95 border-b border-slate-800 px-5 py-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {/* Left Title & Subtitle */}
        <div className="flex items-center space-x-3">
          <h1 className="text-base font-bold tracking-tight text-white">
            Security Console
          </h1>
          <span className="text-[11px] text-slate-400 font-mono hidden md:inline border-l border-slate-800 pl-3">
            Real-Time Voice Impersonation &amp; Social Engineering Operations
          </span>
        </div>

        {/* Right System Indicators */}
        <div className="flex items-center space-x-2.5">
          {/* Truthful Connection & System Status Indicator */}
          <div
            className={`inline-flex items-center px-2 py-0.5 rounded border text-[11px] font-mono ${
              isConnected
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : isConnecting
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}
          >
            {isConnected ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                <span>SYSTEM ONLINE</span>
              </>
            ) : isConnecting ? (
              <>
                <Wifi className="w-3 h-3 mr-1 animate-spin text-amber-400" />
                <span>CONNECTING...</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 mr-1 text-rose-400" />
                <span>DISCONNECTED</span>
              </>
            )}
          </div>

          <Badge variant="neutral" className="font-mono text-[10px] uppercase">
            {sessionId ? `SESSION: ${sessionId.slice(0, 12)}` : "REAL AI RUNTIME"}
          </Badge>

          {/* Notifications Button */}
          <button
            type="button"
            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>

          {/* Analyst Pill */}
          <div className="flex items-center space-x-1.5 pl-2 border-l border-slate-800">
            <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <User className="w-3 h-3" />
            </div>
            <span className="text-xs font-semibold text-slate-200 hidden sm:inline">
              SecOps Analyst
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
