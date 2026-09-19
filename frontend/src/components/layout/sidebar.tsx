"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  Shield,
  Mic,
  Clock,
  ShieldCheck,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

export interface SidebarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  hasActiveThreat?: boolean;
  className?: string;
}

export function Sidebar({
  activeTab = "live-protection",
  onSelectTab,
  hasActiveThreat = true,
  className,
}: SidebarProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const navItems = [
    {
      id: "live-protection",
      label: "Live Protection",
      icon: <Mic className="h-4 w-4" />,
      hasBadge: hasActiveThreat,
    },
    {
      id: "call-history",
      label: "Call History",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: "verification",
      label: "Verification",
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      id: "reports",
      label: "Reports",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <aside
      className={cn(
        "w-60 bg-[#0B132B] text-slate-200 flex flex-col justify-between p-4 shrink-0 select-none",
        className
      )}
    >
      {/* Top Brand Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Shield className="h-5 w-5 fill-white/20 stroke-white stroke-[2.2]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-base tracking-tight text-white leading-tight">
              VoiceShield
            </span>
            <span className="text-2xs text-slate-400 tracking-wide font-normal">
              Trust Every Voice
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col gap-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = item.id === activeTab;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab?.(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left",
                  isActive
                    ? "bg-[#1E293B] text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]/50"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? "text-blue-400" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.hasBadge && (
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Active Profile & System Status */}
      <div className="flex flex-col gap-3 pt-3 border-t border-slate-800/80">
        {/* User Session Info with Logout */}
        <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-md bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold text-2xs flex items-center justify-center shrink-0">
              {user?.avatarInitials || "SO"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white leading-tight truncate">
                {user?.name || "Security Officer"}
              </span>
              <span className="text-3xs text-slate-400 leading-tight truncate">
                {user?.roleTitle || "Security Officer"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-300 hover:bg-slate-800 transition-colors shrink-0"
            title="Sign out of prototype session"
            aria-label="Logout"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* System Online Status */}
        <div className="px-1 flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white leading-none">
              System Online
            </span>
            <span className="text-2xs text-slate-400 leading-tight mt-0.5">
              AI Protection Active
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
