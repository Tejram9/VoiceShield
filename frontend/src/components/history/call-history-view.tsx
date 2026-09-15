"use client";

import React, { useState } from "react";
import { MOCK_CALL_HISTORY } from "@/lib/mock-data";
import { CallRecord } from "@/types/dashboard";
import { RiskIndicator } from "@/components/design-system/risk-indicator";
import {
  History,
  Search,
  FileSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CallHistoryViewProps {
  onInspectCall: (call: CallRecord) => void;
}

export function CallHistoryView({ onInspectCall }: CallHistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("ALL");

  const filteredCalls = MOCK_CALL_HISTORY.filter((call) => {
    const matchesSearch =
      call.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.callerNumber.includes(searchTerm) ||
      call.primaryTrigger.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.sessionId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = riskFilter === "ALL" || call.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Control Bar */}
      <div className="soc-panel p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-mono text-soc-100 tracking-tight">
                Telephony Call Archive &amp; Forensics Log
              </h2>
              <p className="text-xs text-soc-400 font-mono">
                Audited voice recordings, biometric checks, and threat mitigation outcomes
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-soc-500" />
            <input
              type="text"
              placeholder="Search caller, ID, trigger..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-soc-800 border border-soc-700 text-xs font-mono text-soc-100 placeholder-soc-500 focus:outline-none focus:border-blue-500 w-44 sm:w-60"
            />
          </div>

          <div className="flex items-center space-x-1 p-1 rounded-lg bg-soc-800 border border-soc-700 text-[10px] font-mono">
            {(["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRiskFilter(r)}
                className={cn(
                  "px-2 py-0.5 rounded font-bold transition-colors cursor-pointer",
                  riskFilter === r ? "bg-blue-600 text-white" : "text-soc-400 hover:text-white"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calls Table Card */}
      <div className="soc-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-soc-800/80 border-b border-soc-700 text-soc-400 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Session / Caller</th>
                <th className="py-3.5 px-4 font-semibold">Risk Level</th>
                <th className="py-3.5 px-4 font-semibold">Primary Detection Reason</th>
                <th className="py-3.5 px-4 font-semibold">Duration</th>
                <th className="py-3.5 px-4 font-semibold">Outcome / Action</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soc-700/60">
              {filteredCalls.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-soc-400 text-xs font-mono">
                    No call records match the specified filters.
                  </td>
                </tr>
              ) : (
                filteredCalls.map((call) => (
                  <tr
                    key={call.id}
                    className="hover:bg-soc-800/60 transition-colors group cursor-pointer"
                    onClick={() => onInspectCall(call)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-soc-100 group-hover:text-blue-400 transition-colors">
                          {call.callerName}
                        </span>
                        <div className="text-[10px] text-soc-400">
                          {call.callerNumber} • {call.timestamp}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <RiskIndicator level={call.riskLevel} score={call.riskScore} size="sm" />
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-soc-300 font-sans text-xs line-clamp-1">
                        {call.primaryTrigger}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-soc-400">
                      {call.duration}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold border",
                          call.disposition === "INTERCEPTED"
                            ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                            : call.disposition === "CHALLENGED_VERIFIED"
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        )}
                      >
                        {call.disposition.replace("_", " ")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspectCall(call);
                        }}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-soc-800 hover:bg-soc-750 text-soc-200 border border-soc-700 transition-colors text-[11px] cursor-pointer"
                      >
                        <FileSearch className="w-3.5 h-3.5 text-blue-400" />
                        <span>Forensics</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
