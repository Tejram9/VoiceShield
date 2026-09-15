"use client";

import React, { useState } from "react";
import {
  Mic,
  MicOff,
  Clock,
  Zap,
  Sliders,
} from "lucide-react";
import { CallerContext } from "@/components/design-system/caller-context";
import { ThreatDecisionPanel } from "@/components/design-system/threat-decision-panel";
import { EventNarrative } from "@/components/design-system/event-narrative";
import { ActionDock } from "@/components/design-system/action-dock";
import { ConversationStream, DEFAULT_TRANSCRIPT_ENTRIES } from "@/components/design-system/conversation-stream";
import { DemoScenarioController, DemoStage } from "@/components/demo/demo-scenario-controller";
import { WaveformVisualizer } from "@/components/design-system/waveform-visualizer";
import { DEFAULT_SIGNALS } from "@/components/design-system/multi-signal-matrix";
import { DEFAULT_EVOLUTION_STEPS } from "@/components/design-system/threat-evolution-tracker";
import { ExtendedRiskLevel } from "@/components/design-system/risk-indicator";
import { ConnectionState } from "@/lib/websocket/analysis-socket";
import { MicrophoneState, MicrophoneStats } from "@/hooks/use-microphone";
import { cn } from "@/lib/utils";

interface LiveProtectionViewProps {
  connectionState?: ConnectionState;
  micState?: MicrophoneState;
  micStats?: MicrophoneStats;
  transcript?: string;
  onStartMicrophone?: () => Promise<void>;
  onStopMicrophone?: () => void;
  onTriggerAnalysis?: () => Promise<void>;
  onEscalateIncident?: () => void;
  className?: string;
}

export function LiveProtectionView({
  connectionState = "CONNECTED",
  micState = "IDLE",
  micStats,
  transcript = "",
  onStartMicrophone,
  onStopMicrophone,
  onTriggerAnalysis,
  onEscalateIncident,
  className,
}: LiveProtectionViewProps) {
  // Demo Stage Controller (Stage 1 to 5)
  const [currentStage, setCurrentStage] = useState<DemoStage>("STAGE_4_SYNTHETIC_CLONE");
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>("voice-authenticity");
  const [showDspDiagnostics, setShowDspDiagnostics] = useState(false);

  const isMicCapturing = micState === "CAPTURING";

  // Stage-based reactive data model
  const getStageData = () => {
    switch (currentStage) {
      case "STAGE_1_NORMAL":
        return {
          riskLevel: "LOW" as ExtendedRiskLevel,
          riskScore: 12,
          callerName: "Rahul Sharma",
          callerRole: "Chief Financial Officer",
          callerNumber: "+91 98201 44521",
          telephonyTrunk: "SIP-MUM-01 (Inbound Gateway)",
          carrier: "VoIP Gateway Mumbai",
          stirShaken: "B (Partial)",
          trustStatus: "VERIFIED_CONTACT" as const,
          biometricEnrolled: true,
          safeWordConfigured: true,
          sensitiveAction: "Routine Operational Inquiries (Pre-Audit Review)",
          sensitiveActionRisk: "NONE" as const,
          policyTriggered: null,
          headline: "Voice Signatures Normal — Inbound Monitoring Active",
          summary: "Acoustic characteristics, pitch variance, and speech cadence match trusted baseline. No synthetic vocoder artifacts detected.",
          reasons: [
            "Natural acoustic phase coherence across vocal frequency bands (no HiFi-GAN glitching)",
            "Speaker vocal tract resonances match Rahul Sharma's enrolled biometric baseline",
            "Conversation consists of routine administrative inquiry without coercion",
          ],
          signals: DEFAULT_SIGNALS.map((s) => ({
            ...s,
            severity: "LOW" as const,
            score: s.id === "voice-authenticity" ? 6 : s.id === "speaker-consistency" ? 8 : 12,
            statusText: "All parameters within natural verified limits",
            confidenceLabel: "Verified Natural Baseline",
          })),
          transcriptEntries: [DEFAULT_TRANSCRIPT_ENTRIES[0], DEFAULT_TRANSCRIPT_ENTRIES[1]],
          evolutionSteps: [
            {
              id: "step-1",
              time: "00:21",
              stageName: "Inbound Trunk Connected",
              riskLevel: "LOW" as const,
              score: 12,
              triggerCause: "Inbound SIP connection established from +91 98201 44521.",
              actionTriggered: "Passive acoustic stream monitoring active",
            },
            {
              id: "step-2",
              time: "00:34",
              stageName: "Audio Baseline Calibrated",
              riskLevel: "LOW" as const,
              score: 14,
              triggerCause: "Background noise within normal operational limits (SNR 38dB).",
              actionTriggered: "Voiceprint baseline comparison ready",
            },
          ],
          evolutionIndex: 1,
        };

      case "STAGE_2_URGENCY":
        return {
          riskLevel: "ELEVATED" as ExtendedRiskLevel,
          riskScore: 48,
          callerName: "Rahul Sharma",
          callerRole: "Chief Financial Officer",
          callerNumber: "+91 98201 44521",
          telephonyTrunk: "SIP-MUM-01 (Inbound Gateway)",
          carrier: "VoIP Gateway Mumbai",
          stirShaken: "B (Partial)",
          trustStatus: "VERIFIED_CONTACT" as const,
          biometricEnrolled: true,
          safeWordConfigured: true,
          sensitiveAction: "Emergency 20-Minute Disbursement Window Claimed",
          sensitiveActionRisk: "ELEVATED" as const,
          policyTriggered: null,
          headline: "Artificial Urgency Detected — Verification Recommended",
          summary: "Caller introduced high-pressure emergency deadline to accelerate off-ledger processing. Treasury desk advised to prompt safe word.",
          reasons: [
            "High-pressure artificial deadline phrasing ('twenty minutes or option expires')",
            "Psychological coercion pattern typical of business email compromise (BEC) escalation",
            "Verbal pressure applied to circumvent standard dual-control review windows",
          ],
          signals: DEFAULT_SIGNALS.map((s) => {
            if (s.id === "conversation-risk") {
              return {
                ...s,
                severity: "ELEVATED" as const,
                score: 55,
                statusText: "Artificial Urgency Phrasing Detected",
              };
            }
            return {
              ...s,
              severity: "LOW" as const,
              score: 14,
              statusText: "Within Natural Variance",
            };
          }),
          transcriptEntries: [
            DEFAULT_TRANSCRIPT_ENTRIES[0],
            DEFAULT_TRANSCRIPT_ENTRIES[1],
            {
              id: "tr-urgency",
              timestamp: "00:53",
              speaker: "CALLER" as const,
              text: "Rachel, I'm between meetings with our Zurich partners. We need an emergency release executed in the next twenty minutes or the option expires.",
              category: "URGENCY" as const,
              riskLevel: "ELEVATED" as const,
            },
          ],
          evolutionSteps: [
            DEFAULT_EVOLUTION_STEPS[0],
            {
              id: "step-urgency",
              time: "00:53",
              stageName: "Urgency Phrasing Intercepted",
              riskLevel: "ELEVATED" as const,
              score: 48,
              triggerCause: "Caller introduced emergency payment deadline ('twenty minutes').",
              actionTriggered: "Flagged for Treasury desk supervisor caution",
            },
          ],
          evolutionIndex: 1,
        };

      case "STAGE_3_SPEAKER_MISMATCH":
        return {
          riskLevel: "HIGH" as ExtendedRiskLevel,
          riskScore: 76,
          callerName: "Rahul Sharma (Claimed)",
          callerRole: "Chief Financial Officer",
          callerNumber: "+91 98201 44521",
          telephonyTrunk: "SIP-MUM-01 (Inbound Gateway)",
          carrier: "VoIP Interconnect",
          stirShaken: "B (Partial)",
          trustStatus: "SUSPECTED_SPOOF" as const,
          biometricEnrolled: true,
          safeWordConfigured: true,
          sensitiveAction: "⚠️ Emergency $45,000 Off-Ledger Wire Disbursement",
          sensitiveActionRisk: "HIGH" as const,
          policyTriggered: "Corporate Policy 4.1: Off-Ledger Wire Authorization Warning",
          headline: "Speaker Biometric Inconsistency — Identity Unconfirmed",
          summary: "Acoustic embedding deviates significantly from Rahul Sharma's enrolled biometric baseline. Caller demanded $45,000 off-ledger wire.",
          reasons: [
            "Speaker vocal tract embedding fails biometric match (cosine distance 0.54 vs 0.75 threshold)",
            "Sensitive $45,000 wire disbursement requested to off-ledger escrow account",
            "Vocal tone resembles executive, but biometric resonances indicate different vocal tract",
          ],
          signals: DEFAULT_SIGNALS.map((s) => {
            if (s.id === "speaker-consistency") {
              return {
                ...s,
                severity: "HIGH" as const,
                score: 76,
                statusText: "Biometric Divergence (Cosine 0.54 vs >=0.75)",
                confidenceLabel: "Cosine Similarity 0.54",
              };
            }
            if (s.id === "conversation-risk") {
              return {
                ...s,
                severity: "HIGH" as const,
                score: 72,
                statusText: "Off-Ledger Wire Transfer Directive",
              };
            }
            if (s.id === "context-risk") {
              return {
                ...s,
                severity: "ELEVATED" as const,
                score: 60,
                statusText: "Off-Ledger Routing Destination",
              };
            }
            return s;
          }),
          transcriptEntries: [
            DEFAULT_TRANSCRIPT_ENTRIES[0],
            DEFAULT_TRANSCRIPT_ENTRIES[1],
            DEFAULT_TRANSCRIPT_ENTRIES[2],
            DEFAULT_TRANSCRIPT_ENTRIES[3],
          ],
          evolutionSteps: [
            DEFAULT_EVOLUTION_STEPS[0],
            DEFAULT_EVOLUTION_STEPS[1],
            {
              id: "step-mismatch",
              time: "01:22",
              stageName: "Biometric Divergence Flagged",
              riskLevel: "HIGH" as const,
              score: 76,
              triggerCause: "Speaker embedding mismatched Rahul Sharma reference voiceprint (cosine 0.54).",
              actionTriggered: "Out-of-band trusted cellular callback recommended",
            },
          ],
          evolutionIndex: 2,
        };

      case "STAGE_4_SYNTHETIC_CLONE":
        return {
          riskLevel: "CRITICAL" as ExtendedRiskLevel,
          riskScore: 94,
          callerName: "Rahul Sharma (Claimed)",
          callerRole: "Chief Financial Officer",
          callerNumber: "+91 98201 44521",
          telephonyTrunk: "SIP-MUM-01 (Inbound Gateway)",
          carrier: "VoIP Interconnect",
          stirShaken: "B (Partial)",
          trustStatus: "SUSPECTED_SPOOF" as const,
          biometricEnrolled: true,
          safeWordConfigured: true,
          sensitiveAction: "🚨 Executive Override & Auth Bypass Directive — ACTIVE ATTACK",
          sensitiveActionRisk: "CRITICAL" as const,
          policyTriggered: "Corporate Policy 4.1: Mandatory Wire Freeze on Synthetic Clone Detection",
          headline: "Critical Threat: Synthetic Voice Clone & Impersonation Attack",
          summary: "Neural vocoder phase anomaly at 1.24kHz confirms AI synthetic speech. Biometric mismatch and authorization override demand detected.",
          reasons: [
            "Acoustic phase jitter at 1.24 kHz confirms neural vocoder synthesis (non-biological vocal tract)",
            "Speaker vocal tract embedding diverges from enrolled reference voiceprint",
            "Explicit demand to bypass dual-authorization controls under false executive authority",
            "Inbound call trunk lacks cryptographic carrier attestation (STIR/SHAKEN level B)",
          ],
          signals: DEFAULT_SIGNALS,
          transcriptEntries: DEFAULT_TRANSCRIPT_ENTRIES,
          evolutionSteps: DEFAULT_EVOLUTION_STEPS,
          evolutionIndex: 3,
        };

      case "STAGE_5_CONTAINED":
        return {
          riskLevel: "CRITICAL" as ExtendedRiskLevel,
          riskScore: 94,
          callerName: "Rahul Sharma (Impersonated)",
          callerRole: "Chief Financial Officer",
          callerNumber: "+91 98201 44521",
          telephonyTrunk: "SIP-MUM-01 (Inbound Gateway)",
          carrier: "VoIP Interconnect",
          stirShaken: "B (Partial)",
          trustStatus: "SUSPECTED_SPOOF" as const,
          biometricEnrolled: true,
          safeWordConfigured: true,
          sensitiveAction: "🔒 Wire Transfer Frozen — Out-of-Band Call Confirmed Impersonation",
          sensitiveActionRisk: "PROTECTED" as const,
          policyTriggered: "Policy 4.1 Enforced: Wire Frozen — Incident INC-2026-0042 Logged",
          headline: "Impersonation Attack Intercepted — Sensitive Action Protected",
          summary: "Independent cellular callback verified legitimate CFO was not on this call. $45,000 wire release paused. Security incident dossier generated.",
          reasons: [
            "Impersonation attack definitively confirmed via out-of-band cellular contact",
            "Legitimate CFO confirmed he is in transit and never placed this inbound call",
            "Zero fraud loss occurred; Treasury API wire release locked",
            "Cryptographic forensic recording and SHA-256 chain of custody generated",
          ],
          signals: DEFAULT_SIGNALS,
          transcriptEntries: [
            ...DEFAULT_TRANSCRIPT_ENTRIES,
            {
              id: "tr-contained",
              timestamp: "01:50",
              speaker: "OPERATOR" as const,
              text: "Action paused per Fraud Policy 4.1. Legitimate CFO verified via cellular line; confirmed impersonation attempt.",
              riskLevel: "CRITICAL" as const,
            },
          ],
          evolutionSteps: [
            ...DEFAULT_EVOLUTION_STEPS,
            {
              id: "step-contained",
              time: "01:50",
              stageName: "Threat Neutralized & Incident Logged",
              riskLevel: "CRITICAL" as const,
              score: 94,
              triggerCause: "Legitimate CFO confirmed attack via cellular line. Wire transfer locked.",
              actionTriggered: "Incident INC-2026-0042 created; evidentiary audio hashed",
            },
          ],
          evolutionIndex: 4,
        };
    }
  };

  const currentData = getStageData();

  return (
    <div className={cn("space-y-4 max-w-7xl mx-auto font-sans", className)}>
      {/* ── Demo Scenario Switcher for Judges (30-sec walkthrough) ─────── */}
      <DemoScenarioController
        currentStage={currentStage}
        onSelectStage={(stage) => setCurrentStage(stage)}
        onReset={() => setCurrentStage("STAGE_1_NORMAL")}
      />

      {/* ── 3-ZONE MASTER WORKSPACE (CALLER | LIVE CONVERSATION | THREAT DECISION) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* ── ZONE A: CALLER INTELLIGENCE & TRUST CONTEXT (Col 1 to 3) ── */}
        <div className="lg:col-span-3 flex flex-col">
          <CallerContext
            callerName={currentData.callerName}
            callerRole={currentData.callerRole}
            callerNumber={currentData.callerNumber}
            telephonyTrunk={currentData.telephonyTrunk}
            carrier={currentData.carrier}
            stirShaken={currentData.stirShaken}
            trustStatus={currentData.trustStatus}
            biometricEnrolled={currentData.biometricEnrolled}
            safeWordConfigured={currentData.safeWordConfigured}
            sensitiveAction={currentData.sensitiveAction}
            sensitiveActionRisk={currentData.sensitiveActionRisk}
            className="h-full"
          />
        </div>

        {/* ── ZONE B: LIVE CONVERSATION & ACOUSTIC STREAM (Col 4 to 8) ── */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          {/* Functional Telemetry Bar */}
          <div className="soc-panel p-2.5 font-mono text-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 text-soc-300 text-[11px]">
              <span className="flex items-center gap-1.5 text-white font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>01:42</span>
              </span>
              <span className="text-soc-600">•</span>
              <span>Latency: <strong className="text-emerald-400 font-medium">142ms</strong></span>
              <span className="text-soc-600">•</span>
              <span>
                Trunk: <strong className={connectionState === "CONNECTED" ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>{connectionState}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {onTriggerAnalysis && (
                <button
                  type="button"
                  onClick={() => onTriggerAnalysis()}
                  className="px-2 py-1 rounded bg-soc-800 hover:bg-soc-750 text-soc-200 border border-soc-700 text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                  title="Dispatch simulated audio chunk to model pipeline"
                >
                  <Zap className="w-3 h-3 text-blue-400" />
                  <span>Test Inference</span>
                </button>
              )}

              <button
                type="button"
                onClick={isMicCapturing ? onStopMicrophone : onStartMicrophone}
                className={cn(
                  "px-2.5 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer",
                  isMicCapturing
                    ? "bg-emerald-600 text-white"
                    : "bg-soc-800 hover:bg-soc-750 text-soc-200 border border-soc-700"
                )}
              >
                {isMicCapturing ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3 text-soc-400" />}
                <span>{isMicCapturing ? `Streaming (${micStats?.windowsDispatched ?? 0})` : "Live Mic"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDspDiagnostics((prev) => !prev)}
                className="p-1 rounded bg-soc-800 hover:bg-soc-750 text-soc-400 hover:text-white border border-soc-700 transition-colors cursor-pointer"
                title="Toggle Acoustic DSP Details"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Collapsible Audio DSP Progressive Disclosure */}
          {showDspDiagnostics && (
            <div className="p-3 rounded bg-soc-900 border border-soc-750 font-mono text-[11px] space-y-1.5 text-soc-300">
              <div className="flex items-center justify-between text-soc-400 font-semibold uppercase text-[9px]">
                <span>Acoustic Ingestion Diagnostics</span>
                <span className="text-emerald-400">NOMINAL</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div>Sample Rate: <strong className="text-white block">16,000 Hz</strong></div>
                <div>Bit Depth: <strong className="text-white block">16-bit PCM</strong></div>
                <div>Audio Clipping: <strong className="text-emerald-400 block">0.0%</strong></div>
                <div>Packet Drop: <strong className="text-emerald-400 block">0.0% (0 pkts)</strong></div>
              </div>
            </div>
          )}

          {/* Functional Waveform Visualizer */}
          <WaveformVisualizer
            isActive={true}
            hasThreat={currentData.riskLevel === "CRITICAL"}
            channelName={`Trunk SIP-MUM-01 • ${currentData.callerName}`}
            className="p-3"
          />

          {/* Spoken Semantic Transcript */}
          <div className="flex-1 flex flex-col min-h-0">
            <ConversationStream
              entries={currentData.transcriptEntries}
              liveText={transcript}
              isStreaming={isMicCapturing}
              className="flex-1"
            />
          </div>
        </div>

        {/* ── ZONE C: THREAT DECISION & MULTI-SIGNAL EVALUATION (Col 9 to 12) ── */}
        <div className="lg:col-span-4 flex flex-col">
          <ThreatDecisionPanel
            riskLevel={currentData.riskLevel}
            riskScore={currentData.riskScore}
            headline={currentData.headline}
            summary={currentData.summary}
            reasons={currentData.reasons}
            policyTriggered={currentData.policyTriggered}
            signals={currentData.signals}
            activeSignalId={selectedSignalId}
            onInspectSignal={(id) => setSelectedSignalId(id)}
            className="h-full"
          />
        </div>
      </div>

      {/* ── ZONE D: CHRONOLOGICAL SECURITY EVENT STREAM (Full Width) ── */}
      <EventNarrative
        steps={currentData.evolutionSteps}
        currentStepIndex={currentData.evolutionIndex}
      />

      {/* ── ZONE E: ACTIONABLE CONTAINMENT DOCK (Full Width Bottom Anchor) ── */}
      <ActionDock
        riskLevel={currentData.riskLevel}
        callerName={currentData.callerName}
        callerNumber={currentData.callerNumber}
        trustedCallbackNumber="+91 98201 44521"
        enrolledSafeWord="COBALT-ORION-77"
        onActionComplete={(type, outcome) => {
          if (type === "CALLBACK" && outcome === "success") {
            setCurrentStage("STAGE_5_CONTAINED");
          }
          if (type === "FREEZE_ACTION" && outcome === "success") {
            setCurrentStage("STAGE_5_CONTAINED");
          }
          if (type === "VIEW_INCIDENT") {
            onEscalateIncident?.();
          }
        }}
      />
    </div>
  );
}
