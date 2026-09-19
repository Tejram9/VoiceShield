"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import {
  Search,
  Calendar,
  ArrowUpDown,
  ChevronRight,
  X,
  ShieldAlert,
  User,
  Clock,
  ExternalLink,
} from "lucide-react";

export type CallRiskLevel = "ALL" | "LOW" | "ELEVATED" | "HIGH" | "CRITICAL";

export interface HistoricalCall {
  id: string;
  callerName: string;
  callerRole: string;
  callerPhone: string;
  initials: string;
  timestamp: string;
  dateCategory: "today" | "yesterday" | "earlier";
  duration: string;
  durationSeconds: number;
  riskLevel: "LOW" | "ELEVATED" | "HIGH" | "CRITICAL";
  riskScore: number; // 0-100 for sorting
  mainReason: string;
  verificationMethod: string;
  verificationOutcome: string;
  actionTaken: string;
  transcriptSnippet?: string;
  audioMetrics?: {
    cosineSimilarity: number;
    syntheticProbability: number;
    snr: string;
  };
  telephonyAttestation?: string;
  incidentId?: string;
}

export const CALL_HISTORY_DATA: HistoricalCall[] = [
  {
    id: "CALL-2026-0107",
    callerName: "Rahul Sharma",
    callerRole: "Chief Financial Officer",
    callerPhone: "+91 98765 43210",
    initials: "RS",
    timestamp: "Today, 15:30",
    dateCategory: "today",
    duration: "02:45",
    durationSeconds: 165,
    riskLevel: "CRITICAL",
    riskScore: 96,
    mainReason: "Acoustic divergence & urgent $45k wire bypass request",
    verificationMethod: "Trusted Cellular Callback",
    verificationOutcome: "Verification Failed (CFO unreachable on line)",
    actionTaken: "Wire frozen & incident logged (INC-2026-0042)",
    transcriptSnippet: "Needs to be wired immediately before the market closes. Do not bother filing standard dual-sign notice.",
    audioMetrics: {
      cosineSimilarity: 0.54,
      syntheticProbability: 92.4,
      snr: "28 dB",
    },
    telephonyAttestation: "STIR/SHAKEN Level C (Gateway Unverified)",
    incidentId: "INC-2026-0042",
  },
  {
    id: "CALL-2026-0106",
    callerName: "Sarah Jenkins",
    callerRole: "VP Operations",
    callerPhone: "+1 (555) 019-2834",
    initials: "SJ",
    timestamp: "Today, 14:15",
    dateCategory: "today",
    duration: "03:20",
    durationSeconds: 200,
    riskLevel: "ELEVATED",
    riskScore: 68,
    mainReason: "Urgency language regarding vendor shipment payment",
    verificationMethod: "Pre-Shared Safe Word",
    verificationOutcome: "Safe Word Confirmed",
    actionTaken: "Call permitted with audit tag",
    transcriptSnippet: "We need the customs clearance disbursement cleared in the next 2 hours or the shipment is delayed.",
    audioMetrics: {
      cosineSimilarity: 0.81,
      syntheticProbability: 12.0,
      snr: "32 dB",
    },
    telephonyAttestation: "STIR/SHAKEN Level A (Carrier Verified)",
  },
  {
    id: "CALL-2026-0105",
    callerName: "Priya Nair",
    callerRole: "Managing Director",
    callerPhone: "+91 91234 56789",
    initials: "PN",
    timestamp: "Today, 11:40",
    dateCategory: "today",
    duration: "05:12",
    durationSeconds: 312,
    riskLevel: "LOW",
    riskScore: 12,
    mainReason: "Natural voiceprint baseline match; zero anomalies",
    verificationMethod: "Biometric Baseline",
    verificationOutcome: "Biometric Verified",
    actionTaken: "Standard session completed",
    transcriptSnippet: "Reviewing Q3 performance metrics with the executive team. Forward the board slides when ready.",
    audioMetrics: {
      cosineSimilarity: 0.89,
      syntheticProbability: 2.1,
      snr: "35 dB",
    },
    telephonyAttestation: "STIR/SHAKEN Level A (Carrier Verified)",
  },
  {
    id: "CALL-2026-0104",
    callerName: "Unknown Inbound",
    callerRole: "Unregistered External Line",
    callerPhone: "+44 20 7946 0991",
    initials: "UI",
    timestamp: "Yesterday, 18:22",
    dateCategory: "yesterday",
    duration: "01:10",
    durationSeconds: 70,
    riskLevel: "HIGH",
    riskScore: 84,
    mainReason: "Synthetic vocoder phase jitter on credit line inquiry",
    verificationMethod: "Hardware Push MFA",
    verificationOutcome: "Push Prompt Rejected",
    actionTaken: "Call severed by security policy",
    transcriptSnippet: "Requesting immediate password unlock and credit line limit increase for Treasury account 9042.",
    audioMetrics: {
      cosineSimilarity: 0.62,
      syntheticProbability: 88.5,
      snr: "24 dB",
    },
    telephonyAttestation: "STIR/SHAKEN Level C (Untrusted International Trunk)",
  },
  {
    id: "CALL-2026-0103",
    callerName: "Vikram Malhotra",
    callerRole: "Chief Legal Officer",
    callerPhone: "+91 98111 22334",
    initials: "VM",
    timestamp: "Yesterday, 16:05",
    dateCategory: "yesterday",
    duration: "04:45",
    durationSeconds: 285,
    riskLevel: "LOW",
    riskScore: 15,
    mainReason: "Acoustic harmonics consistent with reference profile",
    verificationMethod: "Biometric Baseline",
    verificationOutcome: "Biometric Verified",
    actionTaken: "Standard legal consultation",
    transcriptSnippet: "The revised acquisition agreements look clean. Proceed with filing regulatory disclosures.",
    audioMetrics: {
      cosineSimilarity: 0.92,
      syntheticProbability: 1.8,
      snr: "36 dB",
    },
    telephonyAttestation: "STIR/SHAKEN Level A (Carrier Verified)",
  },
  {
    id: "CALL-2026-0102",
    callerName: "Apex Cloud Services",
    callerRole: "Enterprise Vendor Billing",
    callerPhone: "+1 (800) 555-0199",
    initials: "AC",
    timestamp: "Sep 16, 09:30",
    dateCategory: "earlier",
    duration: "02:18",
    durationSeconds: 138,
    riskLevel: "ELEVATED",
    riskScore: 62,
    mainReason: "Unscheduled request to update bank routing numbers",
    verificationMethod: "Verified Vendor Callback",
    verificationOutcome: "Vendor Callback Confirmed Change",
    actionTaken: "Routing hold released after callback",
    transcriptSnippet: "Our remittance account has migrated to JP Morgan. Please update your vendor profile before the next billing cycle.",
    audioMetrics: {
      cosineSimilarity: 0.77,
      syntheticProbability: 14.5,
      snr: "30 dB",
    },
    telephonyAttestation: "STIR/SHAKEN Level B (Enterprise Trunk)",
  },
  {
    id: "CALL-2026-0101",
    callerName: "Anita Desai",
    callerRole: "Head of People & HR",
    callerPhone: "+91 97654 32100",
    initials: "AD",
    timestamp: "Sep 15, 14:00",
    dateCategory: "earlier",
    duration: "06:30",
    durationSeconds: 390,
    riskLevel: "LOW",
    riskScore: 8,
    mainReason: "Routine internal payroll check-in; verified baseline",
    verificationMethod: "Biometric Baseline",
    verificationOutcome: "Biometric Verified",
    actionTaken: "Standard session completed",
    transcriptSnippet: "Confirmed final headcount bonus calculations for the engineering and security departments.",
    audioMetrics: {
      cosineSimilarity: 0.94,
      syntheticProbability: 0.9,
      snr: "38 dB",
    },
    telephonyAttestation: "STIR/SHAKEN Level A (Internal PBX)",
  },
];

export interface CallHistoryScreenProps {
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
  className?: string;
}

export function CallHistoryScreen({
  activeTab = "call-history",
  onNavigateTab,
  className,
}: CallHistoryScreenProps) {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRisk, setSelectedRisk] = useState<CallRiskLevel>("ALL");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "yesterday" | "earlier">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest-risk" | "duration">("newest");

  // Selected Call for Deep Inspection Drawer
  const [selectedCall, setSelectedCall] = useState<HistoricalCall | null>(null);

  // Filter & Sort Logic
  const filteredCalls = useMemo(() => {
    return CALL_HISTORY_DATA.filter((call) => {
      // Risk filter
      if (selectedRisk !== "ALL" && call.riskLevel !== selectedRisk) {
        return false;
      }
      // Date filter
      if (dateFilter !== "all" && call.dateCategory !== dateFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = call.callerName.toLowerCase().includes(q);
        const matchesRole = call.callerRole.toLowerCase().includes(q);
        const matchesPhone = call.callerPhone.toLowerCase().includes(q);
        const matchesReason = call.mainReason.toLowerCase().includes(q);
        const matchesId = call.id.toLowerCase().includes(q);
        const matchesIncident = call.incidentId?.toLowerCase().includes(q);
        if (!matchesName && !matchesRole && !matchesPhone && !matchesReason && !matchesId && !matchesIncident) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "highest-risk") {
        return b.riskScore - a.riskScore;
      }
      if (sortBy === "duration") {
        return b.durationSeconds - a.durationSeconds;
      }
      if (sortBy === "oldest") {
        return a.id.localeCompare(b.id);
      }
      // default: newest
      return b.id.localeCompare(a.id);
    });
  }, [searchQuery, selectedRisk, dateFilter, sortBy]);

  const getRiskBadge = (level: HistoricalCall["riskLevel"]) => {
    switch (level) {
      case "CRITICAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
            <span>CRITICAL</span>
          </span>
        );
      case "HIGH":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
            <span>HIGH</span>
          </span>
        );
      case "ELEVATED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span>ELEVATED</span>
          </span>
        );
      case "LOW":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span>LOW</span>
          </span>
        );
    }
  };

  return (
    <div className={cn("flex min-h-screen bg-slate-50 text-slate-900 antialiased font-sans", className)}>
      {/* 1. Left Executive Dark Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onNavigateTab}
        hasActiveThreat={true}
      />

      {/* 2. Main Workspace Canvas */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-7 gap-5 overflow-y-auto max-w-[1720px] mx-auto w-full">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Call History
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-slate-100 text-slate-700 border-slate-200">
              {CALL_HISTORY_DATA.length} Recorded Sessions
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Officer Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 hidden sm:flex">
              <div className="h-7 w-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-semibold text-xs">
                <User className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  Security Officer
                </span>
                <span className="text-2xs text-slate-400 leading-tight">
                  SIH SOC Operations
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab?.("live-protection")}
              className="py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              Live Protection
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CONTROLS: SEARCH, RISK FILTERS, DATE FILTER, SORTING */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/70 rounded-xl p-4 flex flex-col gap-3.5">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by caller, number, reason, or incident ID..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Date Filter & Sorting Controls */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Date Filter Dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 h-10 text-xs text-slate-700">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-2xs font-semibold text-slate-400 uppercase hidden sm:inline">Date:</span>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="earlier">Earlier</option>
                </select>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 h-10 text-xs text-slate-700">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-2xs font-semibold text-slate-400 uppercase hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest-risk">Highest Risk</option>
                  <option value="duration">Longest Duration</option>
                </select>
              </div>
            </div>
          </div>

          {/* Risk Level Filter Tabs */}
          <div className="flex items-center gap-1.5 border-t border-slate-100 pt-3 overflow-x-auto text-xs">
            <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 mr-2 shrink-0">
              Risk Level:
            </span>
            {(["ALL", "LOW", "ELEVATED", "HIGH", "CRITICAL"] as CallRiskLevel[]).map((level) => {
              const count =
                level === "ALL"
                  ? CALL_HISTORY_DATA.length
                  : CALL_HISTORY_DATA.filter((c) => c.riskLevel === level).length;
              const isSelected = selectedRisk === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSelectedRisk(level)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5",
                    isSelected
                      ? "bg-slate-900 text-white font-semibold shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <span>{level === "ALL" ? "All Calls" : level}</span>
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-3xs font-bold",
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-slate-200/80 text-slate-600"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FAST SCANNING TABLE: CALLER | DATE/TIME | DURATION | RISK | REASON | OUTCOME | ACTION */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/70 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-2xs font-semibold uppercase tracking-wider text-slate-500 select-none">
                  <th className="py-3 px-4 sm:px-5">Caller</th>
                  <th className="py-3 px-3">Date / Time</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Risk Level</th>
                  <th className="py-3 px-4">Main Detection Reason</th>
                  <th className="py-3 px-4">Verification / Outcome</th>
                  <th className="py-3 px-4">Action Taken</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCalls.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="h-6 w-6 text-slate-300" />
                        <span className="text-sm font-semibold text-slate-700">No matching calls found</span>
                        <p className="text-2xs text-slate-400">
                          Try adjusting your search query or relaxing your risk filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCalls.map((call) => (
                    <tr
                      key={call.id}
                      onClick={() => setSelectedCall(call)}
                      className={cn(
                        "hover:bg-slate-50/90 transition-colors cursor-pointer group",
                        selectedCall?.id === call.id && "bg-blue-50/40"
                      )}
                    >
                      {/* 1. Caller */}
                      <td className="py-3.5 px-4 sm:px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border",
                              call.riskLevel === "CRITICAL" || call.riskLevel === "HIGH"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : call.riskLevel === "ELEVATED"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            )}
                          >
                            {call.initials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                              {call.callerName}
                            </span>
                            <span className="text-2xs text-slate-500 truncate">
                              {call.callerRole}
                            </span>
                            <span className="text-3xs font-mono text-slate-400">
                              {call.callerPhone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Date / Time */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="text-xs text-slate-800 font-medium">
                          {call.timestamp}
                        </span>
                      </td>

                      {/* 3. Duration */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono text-xs text-slate-600">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{call.duration}</span>
                        </div>
                      </td>

                      {/* 4. Risk Level */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {getRiskBadge(call.riskLevel)}
                      </td>

                      {/* 5. Main Detection Reason */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-xs text-slate-800 font-normal leading-snug line-clamp-2">
                          {call.mainReason}
                        </p>
                      </td>

                      {/* 6. Verification / Outcome */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-800">
                            {call.verificationMethod}
                          </span>
                          <span
                            className={cn(
                              "text-2xs font-medium",
                              call.verificationOutcome.includes("Failed") || call.verificationOutcome.includes("Rejected")
                                ? "text-rose-600 font-bold"
                                : "text-slate-500"
                            )}
                          >
                            {call.verificationOutcome}
                          </span>
                        </div>
                      </td>

                      {/* 7. Action Taken */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="text-xs text-slate-700 font-medium">
                          {call.actionTaken}
                        </span>
                      </td>

                      {/* 8. Details Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCall(call);
                          }}
                          className="inline-flex items-center gap-1 text-2xs font-semibold text-blue-600 hover:text-blue-800 group-hover:translate-x-0.5 transition-all"
                        >
                          <span>View</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="py-3 px-5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
            <span>
              Showing {filteredCalls.length} of {CALL_HISTORY_DATA.length} recorded calls
            </span>
            <span className="text-slate-400">
              Click any call row to open forensic analysis drawer
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PROGRESSIVE DISCLOSURE: CALL DETAIL INSPECTION DRAWER */}
      {/* ========================================================================= */}
      {selectedCall && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
          onClick={() => setSelectedCall(null)}
        >
          <div
            className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 overflow-y-auto animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    CALL FILE: {selectedCall.id}
                  </span>
                  {getRiskBadge(selectedCall.riskLevel)}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCall(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Close details"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Caller Header Card */}
              <div className="flex items-start gap-3.5 pt-1">
                <div className="h-12 w-12 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {selectedCall.initials}
                </div>
                <div className="flex flex-col min-w-0">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    {selectedCall.callerName}
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedCall.callerRole}
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-2xs font-mono text-slate-500">
                    <span>{selectedCall.callerPhone}</span>
                    <span>·</span>
                    <span>{selectedCall.timestamp}</span>
                    <span>·</span>
                    <span>{selectedCall.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col gap-5 overflow-y-auto text-xs text-slate-800">
              {/* 1. Main Detection Reason */}
              <div className="flex flex-col gap-1.5">
                <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                  DETECTION SUMMARY
                </span>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 leading-relaxed font-medium">
                  {selectedCall.mainReason}
                </div>
              </div>

              {/* 2. Spoken Transcript Snippet */}
              {selectedCall.transcriptSnippet && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                    FLAGGED SPOKEN SNIPPET
                  </span>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 leading-relaxed">
                    &ldquo;{selectedCall.transcriptSnippet}&rdquo;
                  </div>
                </div>
              )}

              {/* 3. Forensic Audio Telemetry */}
              {selectedCall.audioMetrics && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                    ACOUSTIC BIOMETRIC TELEMETRY
                  </span>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-3xs uppercase font-semibold text-slate-400">Cosine Match</span>
                      <div
                        className={cn(
                          "text-base font-mono font-bold",
                          selectedCall.audioMetrics.cosineSimilarity < 0.75
                            ? "text-rose-600"
                            : "text-emerald-700"
                        )}
                      >
                        {selectedCall.audioMetrics.cosineSimilarity}
                      </div>
                      <span className="text-3xs text-slate-400">Baseline &ge; 0.75</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-3xs uppercase font-semibold text-slate-400">Synthetic Vocoder</span>
                      <div
                        className={cn(
                          "text-base font-mono font-bold",
                          selectedCall.audioMetrics.syntheticProbability > 50
                            ? "text-rose-600"
                            : "text-slate-700"
                        )}
                      >
                        {selectedCall.audioMetrics.syntheticProbability}%
                      </div>
                      <span className="text-3xs text-slate-400">AI probability</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-3xs uppercase font-semibold text-slate-400">Signal Ratio</span>
                      <div className="text-base font-mono font-bold text-slate-800">
                        {selectedCall.audioMetrics.snr}
                      </div>
                      <span className="text-3xs text-slate-400">High clarity</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Telephony & Verification Record */}
              <div className="flex flex-col gap-1.5">
                <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                  CARRIER & VERIFICATION RECORD
                </span>
                <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Method Used:</span>
                    <span className="font-semibold text-slate-800">{selectedCall.verificationMethod}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Resolution:</span>
                    <span
                      className={cn(
                        "font-semibold",
                        selectedCall.verificationOutcome.includes("Failed") || selectedCall.verificationOutcome.includes("Rejected")
                          ? "text-rose-600"
                          : "text-emerald-700"
                      )}
                    >
                      {selectedCall.verificationOutcome}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Action Taken:</span>
                    <span className="font-semibold text-slate-800">{selectedCall.actionTaken}</span>
                  </div>
                  {selectedCall.telephonyAttestation && (
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Trunk Attestation:</span>
                      <span className="font-mono text-2xs text-slate-700">{selectedCall.telephonyAttestation}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Link to Incident Dossier if this call created an incident */}
              {selectedCall.incidentId && (
                <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                    <ShieldAlert className="h-4 w-4 text-rose-600" />
                    <span>Security Incident Generated</span>
                  </div>
                  <p className="text-2xs text-rose-800 leading-normal">
                    This call was formally escalated to SOC containment. Complete forensic artifacts and chain of custody are archived under case file {selectedCall.incidentId}.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigateTab?.("reports")}
                    className="mt-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <span>Open Incident Dossier ({selectedCall.incidentId})</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedCall(null)}
                className="py-2 px-4 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Close Drawer
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab?.("live-protection")}
                className="py-2 px-4 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
              >
                Return to Live Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
