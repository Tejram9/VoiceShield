"use client";

import React from "react";
import {
  Shield,
  LayoutDashboard,
  Radio,
  History,
  FileSearch,
  AlertTriangle,
  Users,
  ShieldCheck,
  BarChart3,
  Cpu,
  Settings,
  Globe,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavTabId =
  | "overview"
  | "live-monitor"
  | "history"
  | "forensics"
  | "incidents"
  | "contacts"
  | "verification"
  | "reports"
  | "health"
  | "settings";

interface NavGroup {
  groupName: string;
  items: {
    id: NavTabId;
    name: string;
    icon: React.ElementType;
    badge?: string;
    badgeType?: "critical" | "warning" | "live" | "neutral";
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupName: "ACTIVE DEFENSE",
    items: [
      {
        id: "live-monitor",
        name: "Live Protection",
        icon: Radio,
        badge: "ACTIVE CALL",
        badgeType: "live",
      },
      { id: "verification", name: "Verification Center", icon: ShieldCheck },
      { id: "overview", name: "Operations Posture", icon: LayoutDashboard },
    ],
  },
  {
    groupName: "INVESTIGATION & FORENSICS",
    items: [
      {
        id: "incidents",
        name: "Incident Dossiers",
        icon: AlertTriangle,
        badge: "Action Req",
        badgeType: "critical",
      },
      { id: "forensics", name: "Acoustic Forensics", icon: FileSearch },
      { id: "history", name: "Call Archive", icon: History },
    ],
  },
  {
    groupName: "TRUST & IDENTITY",
    items: [
      { id: "contacts", name: "Identity Vault", icon: Users },
    ],
  },
  {
    groupName: "GOVERNANCE & SYSTEM",
    items: [
      { id: "reports", name: "Executive Threat Reports", icon: BarChart3 },
      { id: "health", name: "AI Engine Health", icon: Cpu },
      { id: "settings", name: "Security Calibration", icon: Settings },
    ],
  },
];

interface EnterpriseSidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  onSwitchToPublic?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function EnterpriseSidebar({
  activeTab,
  onSelectTab,
  onSwitchToPublic,
  isOpenMobile = false,
  onCloseMobile,
}: EnterpriseSidebarProps) {
  const handleSelect = (id: NavTabId) => {
    onSelectTab(id);
    onCloseMobile?.();
  };

  const getBadgeClass = (type?: string) => {
    switch (type) {
      case "live":
        return "bg-rose-950/40 text-rose-300 border-rose-500/30";
      case "critical":
        return "bg-rose-950/40 text-rose-300 border-rose-500/30";
      case "warning":
        return "bg-amber-950/40 text-amber-300 border-amber-500/30";
      default:
        return "bg-soc-750 text-soc-300 border-soc-700";
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-soc-900 border-r border-soc-700/80 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand & Nav List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Brand */}
          <div
            onClick={() => handleSelect("overview")}
            className="flex items-center space-x-3 pb-4 border-b border-soc-700/80 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 border border-blue-500/50 flex items-center justify-center text-white flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-mono text-sm font-black tracking-wider text-soc-100 uppercase">
                  VoiceShield
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold">
                  SOC
                </span>
              </div>
              <p className="text-[10px] text-soc-400 font-mono tracking-tight">
                AI Impersonation Defense
              </p>
            </div>
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-5" aria-label="Main Navigation">
            {NAV_GROUPS.map((group) => (
              <div key={group.groupName} className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-soc-500 uppercase px-2.5">
                  {group.groupName}
                </span>

                <div className="space-y-1 pt-1">
                  {group.items.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer group",
                          isActive
                            ? "bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm font-semibold"
                            : "text-soc-300 hover:text-soc-100 hover:bg-soc-800 border border-transparent"
                        )}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <Icon
                            className={cn(
                              "w-4 h-4 flex-shrink-0 transition-colors",
                              isActive
                                ? "text-blue-400"
                                : "text-soc-400 group-hover:text-soc-200"
                            )}
                          />
                          <span className="truncate">{item.name}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={cn(
                              "text-[9px] font-mono px-1.5 py-0.5 rounded border font-bold uppercase",
                              getBadgeClass(item.badgeType)
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Tenant Profile & Public Switcher */}
        <div className="p-3 border-t border-soc-700 bg-soc-850/60 space-y-2.5">
          {/* Public Website Switcher */}
          {onSwitchToPublic && (
            <button
              type="button"
              onClick={onSwitchToPublic}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-soc-800 hover:bg-soc-750 border border-soc-700 text-soc-300 hover:text-soc-100 text-xs font-mono transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Public Product Site</span>
              </div>
              <ChevronRight className="w-3 h-3 text-soc-500" />
            </button>
          )}

          {/* Tenant Context */}
          <div className="p-2.5 rounded-lg bg-soc-800/80 border border-soc-700/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-soc-400 uppercase tracking-wider block">
                Enterprise Tenant
              </span>
              <p className="text-xs font-semibold text-soc-200 truncate">
                Apex Global Bank
              </p>
              <span className="text-[9px] font-mono text-emerald-400">
                Tier-1 Treasury Trunk
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20" />
          </div>
        </div>
      </aside>
    </>
  );
}
