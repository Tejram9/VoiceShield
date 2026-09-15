"use client";

/**
 * VoiceShield — Enterprise Cybersecurity Platform
 *
 * Real-Time Detection and Prevention of Voice Cloning Impersonation Attacks
 * Phase 1 Architecture: Public Experience + Master SOC Console Suite
 */

import React, { useState, Suspense } from "react";
import { EnterpriseSidebar, NavTabId } from "@/components/layout/enterprise-sidebar";
import { EnterpriseHeader } from "@/components/layout/enterprise-header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { LandingPage } from "@/components/landing/landing-page";

// Master Console Views
import { OverviewView } from "@/components/dashboard/overview-view";
import { LiveProtectionView } from "@/components/monitor/live-protection-view";
import { CallHistoryView } from "@/components/history/call-history-view";
import { ForensicsView } from "@/components/forensics/forensics-view";
import { IncidentsView } from "@/components/incidents/incidents-view";
import { ContactsView } from "@/components/contacts/contacts-view";
import { VerificationView } from "@/components/verification/verification-view";
import { ReportsView } from "@/components/reports/reports-view";
import { SystemHealthView } from "@/components/health/system-health-view";
import { SettingsView } from "@/components/settings/settings-view";

// Real session hook & types
import { useAnalysisSession } from "@/hooks/use-analysis-session";
import type { LiveCall, CallRecord, Incident, RiskLevel } from "@/types/dashboard";
import { MOCK_CALL_HISTORY, MOCK_RECENT_INCIDENTS } from "@/lib/mock-data";

export default function VoiceShieldApp() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-soc-950 text-white flex items-center justify-center font-mono text-xs">Loading VoiceShield Console...</div>}>
      <VoiceShieldAppContent />
    </Suspense>
  );
}

function VoiceShieldAppContent() {
  // Navigation Mode: "public" vs "console"
  const [viewMode, setViewMode] = useState<"public" | "console">("console");
  const [activeTab, setActiveTab] = useState<NavTabId>("live-monitor");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Inspected objects for Forensics & Incident dossier
  const [selectedCallForForensics, setSelectedCallForForensics] = useState<CallRecord>(
    MOCK_CALL_HISTORY[0]
  );
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    MOCK_RECENT_INCIDENTS[0]
  );

  // Live session orchestration (Web Audio + WebSocket)
  const {
    session,
    connectionState,
    riskAssessment,
    transcript,
    micState,
    micStats,
    startMicrophone,
    stopMicrophone,
    triggerAnalysis,
  } = useAnalysisSession();

  // Map real live session data
  const realLiveCall: LiveCall = {
    id: session?.session_id ?? "VS-2026-LIVE",
    sessionId: session?.session_id ?? "VS-2026-000241",
    callerName: session?.caller_name || "Rahul Sharma (Claimed)",
    callerNumber: session?.caller_number || "+91 98201 44521",
    callerRole: session?.caller_role || "Chief Financial Officer",
    duration: session ? `${session.duration_seconds}s` : "03:42",
    status: session?.status === "LIVE ANALYSIS" ? "LIVE ANALYSIS" : "LIVE ANALYSIS",
    verificationState: "CHALLENGED",
    overallRiskScore: riskAssessment?.risk_score ?? 88,
    riskLevel: (riskAssessment?.risk_level as RiskLevel) ?? "CRITICAL",
    startTime: session?.start_time ?? "18:24:10 UTC",
    telephonyTrunk: "Trunk SIP-NY-04 (Inbound Direct)",
  };

  const hasActiveThreat = realLiveCall.riskLevel === "CRITICAL" || realLiveCall.riskLevel === "HIGH";

  // Handle switching to forensic view from history or overview
  const handleInspectCallHistory = (call: CallRecord) => {
    setSelectedCallForForensics(call);
    setActiveTab("forensics");
  };

  // Handle switching to incident dossier from overview or list
  const handleInspectIncident = (inc: Incident) => {
    setSelectedIncident(inc);
    setActiveTab("incidents");
  };

  // Page titles and context
  const pageMeta: Record<NavTabId, { title: string; subtitle: string }> = {
    overview: {
      title: "Telephony Threat Posture & Overview",
      subtitle: "Situational awareness across corporate trunks, active threats, and macro fraud metrics",
    },
    "live-monitor": {
      title: "Live Call Protection Console",
      subtitle: "Near-real-time acoustic verification, conversational intent analysis, and policy containment",
    },
    history: {
      title: "Telephony Call Archive",
      subtitle: "Audited voice calls, forensic transcripts, and disposition logs",
    },
    forensics: {
      title: "Acoustic Forensic Deep Dive",
      subtitle: "Synchronized waveform scrubbing, semantic phrase categorization, and chain of custody",
    },
    incidents: {
      title: "Security Incident Dossiers",
      subtitle: "Incident management, containment kill-switches, and analyst investigations",
    },
    contacts: {
      title: "Trusted Identity Vault",
      subtitle: "Biometric voiceprint directory, pre-shared safe words, and enrollment wizard",
    },
    verification: {
      title: "Verification & Challenge Center",
      subtitle: "Real-time out-of-band caller challenges and emergency callback routing",
    },
    reports: {
      title: "Executive Threat Intelligence",
      subtitle: "Periodic threat vector distribution, prevented fraud loss, and audit reports",
    },
    health: {
      title: "AI Inference & Telephony Health",
      subtitle: "Neural model latencies, GPU VRAM allocation, and streaming telemetry",
    },
    settings: {
      title: "Security Engine Calibration",
      subtitle: "Risk fusion thresholds, volatile audio retention, and webhook alerting",
    },
  };

  // Render Public Landing Page
  if (viewMode === "public") {
    return (
      <LandingPage
        onEnterConsole={() => {
          setViewMode("console");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  // Render Authenticated Enterprise Security Console
  return (
    <div className="min-h-screen bg-soc-950 text-soc-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-blue-500/30 selection:text-white">
      {/* Enterprise Sidebar */}
      <EnterpriseSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSwitchToPublic={() => setViewMode("public")}
        isOpenMobile={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Workspace Container */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 relative z-10 pb-16 lg:pb-8">
        {/* Top Header */}
        <EnterpriseHeader
          connectionState={connectionState}
          hasActiveThreat={hasActiveThreat}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onSwitchToPublic={() => setViewMode("public")}
          onInspectThreat={() => setActiveTab("live-monitor")}
          pageTitle={pageMeta[activeTab].title}
          pageSubtitle={pageMeta[activeTab].subtitle}
        />

        {/* Primary Page Content Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === "overview" && (
            <OverviewView
              onInspectLiveCall={() => setActiveTab("live-monitor")}
              onInspectCallHistory={handleInspectCallHistory}
              onInspectIncident={handleInspectIncident}
            />
          )}

          {activeTab === "live-monitor" && (
            <LiveProtectionView
              connectionState={connectionState}
              micState={micState}
              micStats={micStats}
              transcript={transcript}
              onStartMicrophone={startMicrophone}
              onStopMicrophone={stopMicrophone}
              onTriggerAnalysis={triggerAnalysis}
              onEscalateIncident={() => setActiveTab("incidents")}
            />
          )}

          {activeTab === "history" && (
            <CallHistoryView
              onInspectCall={handleInspectCallHistory}
            />
          )}

          {activeTab === "forensics" && (
            <ForensicsView
              call={selectedCallForForensics}
              onBackToHistory={() => setActiveTab("history")}
            />
          )}

          {activeTab === "incidents" && (
            <IncidentsView
              initialIncident={selectedIncident}
            />
          )}

          {activeTab === "contacts" && (
            <ContactsView />
          )}

          {activeTab === "verification" && (
            <VerificationView />
          )}

          {activeTab === "reports" && (
            <ReportsView />
          )}

          {activeTab === "health" && (
            <SystemHealthView />
          )}

          {activeTab === "settings" && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hasActiveThreat={hasActiveThreat}
      />
    </div>
  );
}
