"use client";

/**
 * VoiceShield Frontend — Master Security Console & Enterprise Suite
 *
 * Provides real-time voice clone detection, deepfake audio forensics,
 * active telephony trunk monitoring, incident investigations,
 * trusted voice enrollment, and security threshold management.
 */

import React, { useState } from "react";
import { Sidebar, NavTabId } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { LiveCallCard } from "@/components/dashboard/live-call-card";
import { RiskSignalBreakdown } from "@/components/dashboard/risk-signal-breakdown";
import { AIFindingsPanel } from "@/components/dashboard/ai-findings-panel";
import { SecurityRecommendation } from "@/components/dashboard/security-recommendation";
import { RecentIncidentsTable } from "@/components/dashboard/recent-incidents-table";
import { SessionStatusBar } from "@/components/analysis/session-status-bar";
import { LiveCallsView } from "@/components/dashboard/live-calls-view";
import { IncidentsView } from "@/components/dashboard/incidents-view";
import { ContactsView } from "@/components/dashboard/contacts-view";
import { SettingsView } from "@/components/dashboard/settings-view";
import { useAnalysisSession } from "@/hooks/use-analysis-session";
import type { LiveCall } from "@/types/dashboard";
import { MOCK_RECENT_INCIDENTS } from "@/lib/mock-data";
import { AlertTriangle, RefreshCw, Sparkles, HelpCircle } from "lucide-react";

export default function SecurityConsoleDashboard() {
  const [activeTab, setActiveTab] = useState<NavTabId>("console");
  const [viewMode, setViewMode] = useState<"simple" | "forensics">("simple");
  const [showGuide, setShowGuide] = useState(false);

  const {
    session,
    isInitializing,
    sessionError,
    connectionState,
    connectionError,
    backpressureStats,
    analysisState,
    riskAssessment,
    transcript,
    analysisStatus,
    micState,
    micStats,
    startMicrophone,
    stopMicrophone,
    triggerAnalysis,
    reconnectWebSocket,
    resetSession,
  } = useAnalysisSession();

  // Build LiveCall from real session
  const liveCallData: LiveCall = {
    id: session?.session_id ?? "—",
    sessionId: session?.session_id ?? "—",
    callerName: session?.caller_name ?? "",
    callerNumber: session?.caller_number ?? "",
    callerRole: session?.caller_role ?? "",
    duration: session ? `${session.duration_seconds}s` : "—",
    status: session?.status ?? "LIVE ANALYSIS",
    verificationState: session?.verification_state ?? "NOT VERIFIED",
    overallRiskScore: riskAssessment?.risk_score ?? 0,
    riskLevel: riskAssessment?.risk_level ?? "LOW",
    startTime: session?.start_time ?? "—",
  };

  const hasConnectionError = connectionError && (
    connectionState === "ERROR" || connectionState === "DISCONNECTED"
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex font-sans relative overflow-x-hidden selection:bg-blue-500/20 selection:text-blue-900">
      {/* Background Radar Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-radar-grid pointer-events-none opacity-40 z-0" aria-hidden="true" />

      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Workspace */}
      <div className="flex-1 lg:ml-60 flex flex-col min-w-0 relative z-10">
        {/* Top System Bar */}
        <Header connectionState={connectionState} sessionId={session?.session_id} />

        {/* Primary Security Operations Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl w-full mx-auto">

          {/* ── View Switcher & Quick Helper Bar (Shown on Security Console) ──── */}
          {activeTab === "console" && (
            <>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">View Mode:</span>
                    <div className="inline-flex bg-slate-100 p-1 rounded-full border border-slate-200 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setViewMode("simple")}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                          viewMode === "simple"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/60"
                        }`}
                      >
                        Simple Overview
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("forensics")}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                          viewMode === "forensics"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/60"
                        }`}
                      >
                        Technical Forensics
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGuide(!showGuide)}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition-colors font-semibold self-end lg:self-center cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>{showGuide ? "Hide Quick Guide" : "How It Works"}</span>
                </button>
              </div>

              {/* ── Simple 3-Step Quick Guide Banner ─────────────────────── */}
              {showGuide && (
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-4 w-full">
                      <div className="flex items-center gap-2.5">
                        <span className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 shadow-sm">
                          <Sparkles className="w-4 h-4" />
                        </span>
                        <h2 className="text-sm sm:text-base font-bold text-[#0F172A] tracking-tight">
                          Protecting Your Calls with VoiceShield in 3 Simple Steps
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-none hover:border-slate-300 transition-colors">
                          <span className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold flex items-center justify-center mb-2.5 font-mono shadow-sm">
                            1
                          </span>
                          <p className="text-xs font-bold text-[#0F172A]">Start Protection</p>
                          <p className="text-[11px] text-[#64748B] mt-1.5 leading-relaxed">
                            Click <strong className="text-blue-600">Start Call Protection</strong> to monitor live audio, or <strong className="text-blue-600">Run AI Test</strong> for an instant sample.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-none hover:border-slate-300 transition-colors">
                          <span className="w-7 h-7 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-bold flex items-center justify-center mb-2.5 font-mono shadow-sm">
                            2
                          </span>
                          <p className="text-xs font-bold text-[#0F172A]">Continuous AI Screening</p>
                          <p className="text-[11px] text-[#64748B] mt-1.5 leading-relaxed">
                            VoiceShield scans for synthetic audio, deepfake clones, and coercive urgent money requests.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-none hover:border-slate-300 transition-colors">
                          <span className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center mb-2.5 font-mono shadow-sm">
                            3
                          </span>
                          <p className="text-xs font-bold text-[#0F172A]">Instant Safety Verdict</p>
                          <p className="text-[11px] text-[#64748B] mt-1.5 leading-relaxed">
                            Check the safety verdict card to verify authenticity before approving wire transfers or sensitive actions.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Connection Error Banner ─────────────────────────────── */}
              {hasConnectionError && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-red-50 border border-red-200 border-l-4 border-l-red-500 shadow-sm flex items-center justify-between gap-3 text-red-800 text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 animate-pulse" />
                    <span className="font-semibold tracking-wide">AI Analysis Channel Disconnected — {connectionError}</span>
                  </div>
                  <button
                    id="reconnect-ws-btn"
                    onClick={reconnectWebSocket}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    <span>Reconnect</span>
                  </button>
                </div>
              )}

              {/* ── Session Status Bar ─────────────────────────────────── */}
              <SessionStatusBar
                sessionId={session?.session_id ?? null}
                connectionState={connectionState}
                analysisStatus={analysisStatus}
                isInitializing={isInitializing}
                pipelineLatencyMs={analysisState.pipelineLatency.totalMs}
                lastAnalyzedAt={analysisState.lastAnalyzedAt}
                micState={micState}
                backpressureState={backpressureStats?.status}
              />

              {/* ── LEVEL 1: Live Call Session Workspace ──────────────── */}
              <section aria-label="Current Call Session Workspace">
                <LiveCallCard
                  call={liveCallData}
                  connectionState={connectionState}
                  analysisStatus={analysisStatus}
                  transcript={transcript}
                  micState={micState}
                  micStats={micStats}
                  isInitializing={isInitializing}
                  sessionError={sessionError}
                  onTriggerAnalysis={triggerAnalysis}
                  onStartMicrophone={startMicrophone}
                  onStopMicrophone={stopMicrophone}
                  onResetSession={resetSession}
                />
              </section>

              {/* ── LEVEL 2 & 3: Signal Assessment + Required Action ──── */}
              <section
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                aria-label="Signal Assessment and Required Action"
              >
                <div className="lg:col-span-2">
                  <RiskSignalBreakdown
                    analysisState={analysisState}
                    signals={riskAssessment?.contributing_signals ?? []}
                  />
                </div>
                <div className="lg:col-span-1 flex flex-col justify-between">
                  <SecurityRecommendation assessment={riskAssessment} />
                </div>
              </section>

              {/* ── Technical Forensics Deep Dive Panels ─────────────── */}
              {viewMode === "forensics" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <section aria-label="Detection Events Feed">
                    <AIFindingsPanel
                      findings={analysisState.findings}
                      events={analysisState.events}
                    />
                  </section>
                  <section aria-label="Incident Context History">
                    <RecentIncidentsTable incidents={MOCK_RECENT_INCIDENTS} />
                  </section>
                </div>
              )}
            </>
          )}

          {/* ── Tab: Live Calls View ───────────────────────────────── */}
          {activeTab === "live-calls" && (
            <LiveCallsView
              currentCall={liveCallData}
              onInspectCall={() => setActiveTab("console")}
            />
          )}

          {/* ── Tab: Incidents Investigation View ──────────────────── */}
          {activeTab === "incidents" && <IncidentsView />}

          {/* ── Tab: Trusted Voice Enrollment & Directory ───────────── */}
          {activeTab === "contacts" && <ContactsView />}

          {/* ── Tab: Security Settings & Engine Configuration ──────── */}
          {activeTab === "settings" && <SettingsView />}

        </main>
      </div>
    </div>
  );
}
