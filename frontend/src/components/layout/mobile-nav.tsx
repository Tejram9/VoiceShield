"use client";

import React from "react";
import {
  LayoutDashboard,
  Radio,
  AlertTriangle,
  Users,
  Settings,
} from "lucide-react";
import { NavTabId } from "./enterprise-sidebar";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  hasActiveThreat?: boolean;
}

export function MobileNav({
  activeTab,
  onSelectTab,
  hasActiveThreat = true,
}: MobileNavProps) {
  const items = [
    { id: "overview" as NavTabId, name: "Dashboard", icon: LayoutDashboard },
    {
      id: "live-monitor" as NavTabId,
      name: "Live Call",
      icon: Radio,
      alert: hasActiveThreat,
    },
    { id: "incidents" as NavTabId, name: "Incidents", icon: AlertTriangle },
    { id: "contacts" as NavTabId, name: "Vault", icon: Users },
    { id: "settings" as NavTabId, name: "Settings", icon: Settings },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-soc-900/95 backdrop-blur-xl border-t border-soc-700 px-2 py-1.5 flex items-center justify-around shadow-2xl"
    >
      {items.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={cn(
              "relative flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-mono font-medium transition-colors cursor-pointer",
              isActive
                ? "text-blue-400 font-bold"
                : "text-soc-400 hover:text-soc-200"
            )}
          >
            <div className="relative">
              <Icon className="w-4 h-4 mb-0.5" />
              {item.alert && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-soc-900" />
              )}
            </div>
            <span>{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
