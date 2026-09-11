"use client";

import React, { useState } from "react";
import {
  Shield,
  LayoutDashboard,
  Radio,
  AlertTriangle,
  Users,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavTabId = "console" | "live-calls" | "incidents" | "contacts" | "settings";

interface NavGroup {
  groupName: string;
  items: {
    id: NavTabId;
    name: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupName: "MONITOR",
    items: [
      { id: "console", name: "Security Console", icon: LayoutDashboard },
      { id: "live-calls", name: "Live Calls", icon: Radio, badge: "1 Active" },
    ],
  },
  {
    groupName: "INVESTIGATE",
    items: [
      { id: "incidents", name: "Incidents", icon: AlertTriangle, badge: "4 New" },
      { id: "contacts", name: "Trusted Contacts", icon: Users },
    ],
  },
  {
    groupName: "ADMIN",
    items: [{ id: "settings", name: "Settings", icon: Settings }],
  },
];

interface SidebarProps {
  activeTab?: NavTabId;
  onSelectTab?: (tab: NavTabId) => void;
}

export function Sidebar({ activeTab = "console", onSelectTab }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (id: NavTabId) => {
    if (onSelectTab) {
      onSelectTab(id);
    }
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2.5 rounded-xl bg-white/90 backdrop-blur-xl border border-slate-200 text-[#0F172A] hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Clean Professional Light Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-60 bg-[#FAFAFA] border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 shadow-sm",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand & Navigation */}
        <div className="p-5">
          <div 
            onClick={() => handleSelect("console")}
            className="flex items-center space-x-3 pb-5 border-b border-slate-200 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-sm group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 relative z-10" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-[#0F172A] block leading-tight font-sans">
                VoiceShield
              </span>
              <span className="text-[10px] font-semibold text-blue-600 tracking-widest uppercase block">
                SOC DEFENSE v2.4
              </span>
            </div>
          </div>

          {/* Grouped Nav Items */}
          <nav className="mt-6 space-y-5" aria-label="Main Navigation">
            {NAV_GROUPS.map((group, groupIdx) => (
              <div
                key={group.groupName}
                className={cn(
                  "space-y-1",
                  groupIdx < NAV_GROUPS.length - 1 && "border-b border-slate-200 pb-4"
                )}
              >
                <span className="px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#64748B] block mb-1.5 font-sans">
                  {group.groupName}
                </span>

                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-left cursor-pointer group",
                        isActive
                          ? "bg-blue-50 text-blue-700 border-l-[3px] border-blue-600 pl-[9px] shadow-sm"
                          : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 hover:border-l-[3px] hover:border-slate-300 hover:pl-[9px]"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon
                          className={cn(
                            "w-4 h-4 transition-colors duration-150",
                            isActive
                              ? "text-blue-600"
                              : "text-[#64748B] group-hover:text-blue-600"
                          )}
                        />
                        <span className="tracking-wide font-sans">{item.name}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={cn(
                            "text-[9px] px-2 py-0.5 rounded-full font-mono font-bold border transition-colors",
                            isActive
                              ? "bg-blue-100 text-blue-700 border-blue-200"
                              : "bg-slate-100 text-[#64748B] border-slate-200 group-hover:border-slate-300"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Environment Pill Badge */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="flex items-center gap-2 font-medium">
              <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span className="text-[11px] uppercase tracking-wider text-[#64748B]">AI Engine</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-bold text-[10px] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ready (CUDA)</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
