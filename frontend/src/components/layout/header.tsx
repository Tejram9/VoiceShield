"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Wifi, WifiOff } from "lucide-react";
import { ConnectionState } from "@/lib/websocket/analysis-socket";

interface HeaderProps {
  connectionState?: ConnectionState;
  sessionId?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  level: "HIGH" | "MEDIUM" | "INFO";
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Critical Voice Clone Risk Detected",
    desc: "Session Alex Turner (+1 555-234-8901) triggered high synthetic probability.",
    time: "2m ago",
    level: "HIGH",
  },
  {
    id: "notif-2",
    title: "Urgent Wire Transfer Intent",
    desc: "Coercive financial request patterns flagged by ASR semantic engine.",
    time: "5m ago",
    level: "HIGH",
  },
  {
    id: "notif-3",
    title: "AI Inference Engine Online",
    desc: "faster-whisper and SpeechBrain ECAPA-TDNN loaded on CUDA GPU.",
    time: "15m ago",
    level: "INFO",
  },
];

export function Header({ connectionState = "CONNECTED", sessionId }: HeaderProps) {
  const isConnected = connectionState === "CONNECTED";
  const isConnecting = connectionState === "CONNECTING" || connectionState === "RECONNECTING";

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-6 py-3.5 shadow-sm relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left Title & Status */}
        <div className="flex items-center space-x-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#0F172A] font-sans">
                VoiceShield Security Console
              </h1>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
                Live Protection
              </span>
            </div>
            <p className="text-xs text-[#64748B] hidden md:block mt-0.5 font-sans">
              Real-time deepfake audio detection &amp; voice impersonation prevention
            </p>
          </div>
        </div>

        {/* Right System Indicators */}
        <div className="flex items-center space-x-3">
          {/* Connection Status Indicator */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 ${
              isConnected
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm"
                : isConnecting
                ? "bg-amber-50 border-amber-200 text-amber-700 shadow-sm"
                : "bg-red-50 border-red-200 text-red-700 shadow-sm animate-pulse"
            }`}
          >
            {isConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono tracking-wide text-[11px]">PROTECTION ONLINE</span>
              </>
            ) : isConnecting ? (
              <>
                <Wifi className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span className="font-mono tracking-wide text-[11px]">CONNECTING...</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-red-600" />
                <span className="font-mono tracking-wide text-[11px] font-bold">DISCONNECTED</span>
              </>
            )}
          </div>

          {sessionId && (
            <span className="hidden lg:inline-flex items-center font-mono text-xs text-slate-700 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 shadow-inner">
              ID: {sessionId.slice(0, 14)}
            </span>
          )}

          {/* Notifications Button & Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="relative p-2.5 rounded-xl bg-white border border-slate-200 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
              aria-label="Toggle notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-mono font-bold text-white flex items-center justify-center shadow-sm animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-xl p-5 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-[#0F172A]">Security Alerts</span>
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
                      {notifications.length} Unread
                    </span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={clearNotifications}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-[#64748B] text-center py-4">No active alerts at this time.</p>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${
                            item.level === "HIGH" ? "text-red-600" : "text-blue-600"
                          }`}>
                            {item.title}
                          </span>
                          <span className="text-[10px] font-mono text-[#64748B]">{item.time}</span>
                        </div>
                        <p className="text-xs text-[#64748B] leading-relaxed">{item.desc}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Analyst Profile & Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center space-x-2.5 pl-2.5 border-l border-slate-200 focus:outline-none cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-sm font-mono font-bold text-xs ring-2 ring-blue-500/30 ring-offset-2 ring-offset-white">
                SO
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-[#0F172A] leading-tight font-sans">Security Officer</p>
                <p className="text-[10px] font-mono text-blue-600 leading-tight">ACTIVE DUTY</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-5 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-mono font-bold text-sm shadow-sm ring-2 ring-blue-400/30">
                    SO
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">Lead Security Analyst</h4>
                    <p className="text-[11px] text-[#64748B]">Enterprise SOC Tier 1</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#64748B]">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-[#64748B]">Protection Engine:</span>
                    <span className="text-emerald-700 font-mono font-bold">ACTIVE (CUDA)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-[#64748B]">Latency:</span>
                    <span className="font-mono text-blue-600 font-semibold">12ms</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#64748B]">Role:</span>
                    <span className="text-blue-600 font-bold">Incident Commander</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
