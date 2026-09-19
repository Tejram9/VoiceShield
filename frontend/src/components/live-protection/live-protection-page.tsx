"use client";

import React, { useState, useEffect } from "react";
import { formatDuration } from "@/lib/utils";
import {
  DemoStage,
  DEMO_STAGES,
  getDemoStageData,
} from "@/lib/demo-state";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "./top-bar";
import { CallerCard } from "./caller-card";
import { LiveCallCenter } from "./live-call-center";
import { KeySignals } from "./key-signals";
import { ThreatActionColumn } from "./threat-action-column";
import { VerificationDialog } from "./verification-dialog";
import { ContainmentDialog } from "./containment-dialog";
import { VerificationScreen } from "@/components/verification";
import { IncidentDossier } from "@/components/incident";

export function LiveProtectionPage() {
  // Default to STAGE_3_SPEAKER_MISMATCH / STAGE_4_SYNTHETIC_CLONE to match the exact state in the reference image!
  const [currentStage, setCurrentStage] = useState<DemoStage>("STAGE_4_SYNTHETIC_CLONE");
  const [activeNavTab, setActiveNavTab] = useState<string>("live-protection");

  const stageData = getDemoStageData(currentStage);

  // Live duration timer
  const [callSeconds, setCallSeconds] = useState<number>(stageData.liveCall.durationSeconds);
  const isContained = currentStage === "STAGE_5_CONTAINED";

  // Modals state
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isContainmentOpen, setIsContainmentOpen] = useState(false);

  useEffect(() => {
    setCallSeconds(stageData.liveCall.durationSeconds);
  }, [currentStage, stageData.liveCall.durationSeconds]);

  useEffect(() => {
    if (isContained) return;

    const timer = setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isContained]);

  const handleVerificationResolved = (passed: boolean) => {
    if (!passed) {
      // Impersonation confirmed -> escalate to contained
      setCurrentStage("STAGE_5_CONTAINED");
    }
  };

  const handleContainmentConfirmed = () => {
    setCurrentStage("STAGE_5_CONTAINED");
  };

  if (activeNavTab === "verification") {
    return (
      <VerificationScreen
        activeTab="verification"
        onNavigateTab={setActiveNavTab}
        callerName={stageData.caller.name}
        callerRole={stageData.caller.role}
        callerPhone={stageData.caller.phone}
        transferAmount="$45,000"
        onVerificationComplete={(passed) => {
          if (!passed) {
            setCurrentStage("STAGE_5_CONTAINED");
          }
        }}
      />
    );
  }

  if (activeNavTab === "reports" || activeNavTab === "incident") {
    return (
      <IncidentDossier
        activeTab="reports"
        onNavigateTab={setActiveNavTab}
        callerName={stageData.caller.name}
        callerRole={stageData.caller.role}
        callerPhone={stageData.caller.phone}
        transferAmount="$45,000"
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
      {/* 1. Left Dark Executive Sidebar */}
      <Sidebar
        activeTab={activeNavTab}
        onSelectTab={setActiveNavTab}
        hasActiveThreat={stageData.riskLevel === "HIGH" || stageData.riskLevel === "CRITICAL"}
      />

      {/* 2. Main Workspace Canvas */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-7 gap-5 overflow-y-auto max-w-[1720px] mx-auto w-full">
        {/* Top Call Banner & Scenario Controller */}
        <TopBar
          currentStage={currentStage}
          stages={DEMO_STAGES}
          onSelectStage={setCurrentStage}
          callDuration={formatDuration(callSeconds)}
          audioQuality={stageData.liveCall.audioQuality}
          isContained={isContained}
        />

        {/* 3-Column Operational Layout - Visual Center on Live Conversation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-start">
          {/* ------------------------------------------------------------- */}
          {/* LEFT COLUMN: CALLER IDENTITY & INTEGRATED COMPACT TIMELINE */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <CallerCard
              name={stageData.caller.name}
              initials={stageData.caller.initials}
              role={stageData.caller.role}
              phone={stageData.caller.phone}
              isTrustedContact={stageData.caller.isTrustedContact}
              isVerifiedNumber={stageData.caller.isVerifiedNumber}
              hasSensitiveAction={stageData.caller.hasSensitiveAction}
              sensitiveActionText={stageData.caller.sensitiveActionText}
              timelineEvents={stageData.timeline}
            />
          </div>

          {/* ------------------------------------------------------------- */}
          {/* CENTER COLUMN: LIVE CONVERSATION (THE VISUAL CENTER) & SIGNALS */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <LiveCallCenter
              speakerName={stageData.liveCall.speakerName}
              speakerTimestamp={stageData.liveCall.speakerTimestamp}
              transcriptText={stageData.liveCall.transcriptText}
              semanticTags={stageData.liveCall.semanticTags}
              isLive={!isContained}
            />

            <KeySignals signals={stageData.signals} />
          </div>

          {/* ------------------------------------------------------------- */}
          {/* RIGHT COLUMN: CURRENT RISK & UNIFIED ACTION PANEL */}
          {/* ------------------------------------------------------------- */}
          <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-5">
            <ThreatActionColumn
              riskLevel={stageData.riskLevel}
              headline={stageData.riskHeadline}
              explanation={stageData.riskExplanation}
              whyRiskyBullets={stageData.whyRiskyBullets}
              recommendedAction={stageData.recommendedAction}
              onVerifyCaller={() => {
                if (isContained) {
                  setActiveNavTab("reports");
                } else {
                  setIsVerificationOpen(true);
                }
              }}
              onPauseAction={() => setIsContainmentOpen(true)}
              onViewTechnicalDetails={() => setIsVerificationOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Verification Protocol Modal */}
      <VerificationDialog
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        callerName={stageData.caller.name}
        callerRole={stageData.caller.role}
        callerPhone={stageData.caller.phone}
        onVerificationResolved={handleVerificationResolved}
      />

      {/* Containment Directive Modal */}
      <ContainmentDialog
        isOpen={isContainmentOpen}
        onClose={() => setIsContainmentOpen(false)}
        callerName={stageData.caller.name}
        amount="$45,000"
        onContainmentConfirmed={handleContainmentConfirmed}
      />
    </div>
  );
}
