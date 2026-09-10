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

interface NavGroup {
  groupName: string;
  items: {
    name: string;
    icon: React.ElementType;
    active?: boolean;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupName: "MONITOR",
    items: [
      { name: "Security Console", icon: LayoutDashboard, active: true },
      { name: "Live Calls", icon: Radio },
    ],
  },
  {
    groupName: "INVESTIGATE",
    items: [
      { name: "Incidents", icon: AlertTriangle },
      { name: "Trusted Contacts", icon: Users },
    ],
  },
  {
    groupName: "ADMIN",
    items: [{ name: "Settings", icon: Settings }],
  },
];

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
      >
        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Quiet Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-56 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand & Navigation */}
        <div className="p-4">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-800 px-1">
            <div className="p-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white block leading-none">
                VoiceShield
              </span>
              <span className="text-[9px] font-mono text-slate-400 tracking-wider uppercase">
                Enterprise Ops
              </span>
            </div>
          </div>

          {/* Grouped Nav Items */}
          <nav className="mt-4 space-y-4" aria-label="Main Navigation">
            {NAV_GROUPS.map((group) => (
              <div key={group.groupName} className="space-y-1">
                <span className="px-2 text-[9px] font-mono font-semibold uppercase tracking-wider text-slate-400 block">
                  {group.groupName}
                </span>

                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        if (mobileOpen) setMobileOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors text-left focus:outline-none focus:ring-1 focus:ring-blue-500",
                        item.active
                          ? "bg-slate-800 text-white font-semibold border-l-2 border-blue-500"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                      )}
                      aria-current={item.active ? "page" : undefined}
                    >
                      <Icon
                        className={cn(
                          "w-3.5 h-3.5",
                          item.active ? "text-blue-400" : "text-slate-400"
                        )}
                      />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Environment</span>
            <span className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
              Prototype
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
