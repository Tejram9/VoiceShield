"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Wifi,
  WifiOff,
  ShieldAlert,
  Clock,
  Menu,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { ConnectionState } from "@/lib/websocket/analysis-socket";
import { cn } from "@/lib/utils";

interface EnterpriseHeaderProps {
  connectionState?: ConnectionState;
  hasActiveThreat?: boolean;
  onOpenMobileNav?: () => void;
  onSwitchToPublic?: () => void;
  onInspectThreat?: () => void;
  pageTitle?: string;
  pageSubtitle?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  severity: "CRITICAL" | "HIGH" | "INFO";
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Critical Voice Clone Threat Intercepted",
    desc: "Active caller claiming to be Rahul Sharma exhibited synthetic vocoder artifacts.",
    time: "2m ago",
    severity: "CRITICAL",
  },
  {
    id: "notif-2",
    title: "Urgent Financial Coercion Flagged",
    desc: "Inbound call demanded off-ledger $45,000 wire with executive bypass.",
    time: "4m ago",
    severity: "HIGH",
  },
  {
    id: "notif-3",
    title: "ECAPA-TDNN Biometric Model Healthy",
    desc: "Model inference latency 42ms on CUDA GPU worker-01.",
    time: "20m ago",
    severity: "INFO",
  },
];

export function EnterpriseHeader({
  connectionState = "CONNECTED",
  hasActiveThreat = true,
  onOpenMobileNav,
  onSwitchToPublic,
  onInspectThreat,
  pageTitle = "VoiceShield Security Console",
  pageSubtitle = "AI-Powered Real-Time Detection and Prevention of Voice Cloning Impersonation Attacks",
}: EnterpriseHeaderProps) {
  const [timeUtc, setTimeUtc] = useState<string>("");
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeUtc(now.toTimeString().split(" ")[0] + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isConnected = connectionState === "CONNECTED";

  return (
    <header className="sticky top-0 z-30 bg-soc-900/90 backdrop-blur-md border-b border-soc-700/80 px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Nav Toggle & Context Title */}
        <div className="flex items-center space-x-3">
          {onOpenMobileNav && (
            <button
              type="button"
              onClick={onOpenMobileNav}
              className="lg:hidden p-2 rounded-lg bg-soc-800 text-soc-300 hover:text-soc-100 hover:bg-soc-750 border border-soc-700 cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-sm sm:text-base font-bold font-mono text-soc-100 tracking-tight">
                {pageTitle}
              </h1>

              {/* Security Posture Indicator */}
              {hasActiveThreat ? (
                <button
                  type="button"
                  onClick={onInspectThreat}
                  className="hidden sm:inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-rose-950/40 border border-rose-500/40 text-rose-300 text-[10px] font-mono font-bold uppercase cursor-pointer hover:bg-rose-950/60 transition-colors"
                >
                  <ShieldAlert className="w-3 h-3 text-rose-400" />
                  <span>ALERT: THREAT IN PROGRESS</span>
                </button>
              ) : (
                <span className="hidden sm:inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>POSTURE: GUARDED</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-soc-400 hidden md:block truncate max-w-lg">
              {pageSubtitle}
            </p>
          </div>
        </div>

        {/* Right: Telemetry & Controls */}
        <div className="flex items-center space-x-3">
          {/* Public Website Button */}
          {onSwitchToPublic && (
            <button
              type="button"
              onClick={onSwitchToPublic}
              className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-soc-800 hover:bg-soc-750 border border-soc-700 text-soc-300 hover:text-soc-100 text-xs font-mono transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Public Site</span>
            </button>
          )}

          {/* Live UTC Clock */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-soc-850 border border-soc-750 text-soc-400 text-[11px] font-mono">
            <Clock className="w-3 h-3 text-soc-500" />
            <span>{timeUtc || "00:00:00 UTC"}</span>
          </div>

          {/* WebSocket Connection Status */}
          <div
            className={cn(
              "inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border",
              isConnected
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            )}
          >
            {isConnected ? (
              <Wifi className="w-3 h-3 text-emerald-400" />
            ) : (
              <WifiOff className="w-3 h-3 text-rose-400 animate-pulse" />
            )}
            <span className="hidden sm:inline">
              {isConnected ? "WS CONNECTED" : "OFFLINE"}
            </span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-soc-800 hover:bg-soc-750 border border-soc-700 text-soc-300 hover:text-soc-100 transition-colors cursor-pointer"
              aria-label="View security notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-soc-900" />
              )}
            </button>

            {/* Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-soc-800 border border-soc-700 shadow-2xl p-4 space-y-3 z-50 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-soc-700">
                  <span className="text-xs font-mono font-bold text-soc-100 uppercase tracking-wider">
                    Security Alerts ({notifications.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setNotifications([])}
                    className="text-[10px] font-mono text-soc-400 hover:text-soc-200 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-soc-400 font-mono">
                      No unread alerts
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "p-2.5 rounded-lg border text-xs space-y-1 transition-colors",
                          n.severity === "CRITICAL"
                            ? "bg-rose-950/20 border-rose-500/40 text-rose-200"
                            : n.severity === "HIGH"
                            ? "bg-orange-950/20 border-orange-500/40 text-orange-200"
                            : "bg-soc-850 border-soc-700 text-soc-300"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px]">{n.title}</span>
                          <span className="text-[10px] font-mono opacity-70">{n.time}</span>
                        </div>
                        <p className="text-[11px] opacity-80 leading-relaxed">{n.desc}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
