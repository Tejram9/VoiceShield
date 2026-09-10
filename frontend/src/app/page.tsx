"use client";

/**
 * VoiceShield — Security Console Dashboard (Main Page)
 *
 * Top-level composition layer. Owns no analysis logic — delegates entirely
 * to useAnalysisSession which coordinates:
 *   - REST session creation & state fetching
 *   - WebSocket real-time event stream
 *   - useAnalysisState reducer (typed per-signal AI state)
 *   - Microphone capture → encode → analyze loop
 *
 * Data flow:
 *   useAnalysisSession → analysisState → components
 *   useAnalysisSession → session → LiveCallCard metadata
 *
 * MOCK DATA USAGE:
 *   MOCK_RECENT_INCIDENTS — used ONLY by RecentIncidentsTable for static
 *   historical context display (represents DB-backed records not yet implemented).
 *   All live analysis state comes exclusively from the backend AI pipeline.
 */

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { LiveCallCard } from "@/components/dashboard/live-call-card";
import { RiskSignalBreakdown } from "@/components/dashboard/risk-signal-breakdown";
import { AIFindingsPanel } from "@/components/dashboard/ai-findings-panel";
import { SecurityRecommendation } from "@/components/dashboard/security-recommendation";
import { RecentIncidentsTable } from "@/components/dashboard/recent-incidents-table";
import { SessionStatusBar } from "@/components/analysis/session-status-bar";
import { useAnalysisSession } from "@/hooks/use-analysis-session";
import type { LiveCall } from "@/types/dashboard";
import { MOCK_RECENT_INCIDENTS } from "@/lib/mock-data";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function SecurityConsoleDashboard() {
  const {
    session,
    isInitializing,
    sessionError,
    connectionState,
    connectionError,
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

  // Build LiveCall from real session — no hardcoded fallback values for analysis data
  const liveCallData: LiveCall = {
    id: session?.session_id ?? "—",
    sessionId: session?.session_id ?? "—",
    callerName: session?.caller_name ?? "",
    callerNumber: session?.caller_number ?? "",
    callerRole: session?.caller_role ?? "",
    duration: session ? `${session.duration_seconds}s` : "—",
    status: session?.status ?? "LIVE ANALYSIS",
    verificationState: session?.verification_state ?? "NOT VERIFIED",
    // Risk score and level come from the live state reducer, not hardcoded
    overallRiskScore: riskAssessment?.risk_score ?? 0,
    riskLevel: riskAssessment?.risk_level ?? "LOW",
    startTime: session?.start_time ?? "—",
  };

  const hasConnectionError = connectionError && (
    connectionState === "ERROR" || connectionState === "DISCONNECTED"
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace */}
      <div className="flex-1 lg:ml-56 flex flex-col min-w-0">
        {/* Top System Bar */}
        <Header connectionState={connectionState} sessionId={session?.session_id} />

        {/* Primary Security Operations Workspace */}
        <main className="flex-1 p-4 sm:p-5 space-y-4 max-w-7xl w-full mx-auto">

          {/* ── Connection Error Banner ─────────────────────────────── */}
          {hasConnectionError && (
            <div
              role="alert"
              className="p-3.5 rounded-md bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-3 text-rose-300 font-mono text-xs"
            >
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>ANALYSIS CHANNEL OFFLINE — {connectionError}</span>
              </div>
              <button
                id="reconnect-ws-btn"
                onClick={reconnectWebSocket}
                className="flex items-center space-x-1 px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 rounded border border-rose-500/40 text-rose-200 font-bold transition"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
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
            className="grid grid-cols-1 lg:grid-cols-3 gap-4"
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

          {/* ── LEVEL 4: Detection Events Feed ─────────────────────── */}
          <section aria-label="Detection Events Feed">
            <AIFindingsPanel
              findings={analysisState.findings}
              events={analysisState.events}
            />
          </section>

          {/* ── LEVEL 5: Historical Incident Context (static demo data) */}
          <section aria-label="Incident Context History">
            <RecentIncidentsTable incidents={MOCK_RECENT_INCIDENTS} />
          </section>
        </main>
      </div>
    </div>
  );
}
