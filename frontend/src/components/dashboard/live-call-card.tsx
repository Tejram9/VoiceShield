"use client";

/**
 * VoiceShield — Live Call Session Workspace Card
 *
 * Primary operational workspace for an active security analysis session.
 * Renders caller metadata, risk score, ASR transcript, mic controls, and status.
 *
 * All live values arrive through typed props — no data fetching here.
 * This is a pure display component.
 */

import React, { useState } from "react";
import { LiveCall } from "@/types/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Radio,
  PhoneCall,
  Clock,
  User,
  ShieldAlert,
  Play,
  Loader2,
  FileText,
  Mic,
  MicOff,
  Square,
} from "lucide-react";
import { getRiskColorClasses } from "@/lib/utils";
import type { ConnectionState } from "@/lib/websocket/analysis-socket";
import type { MicrophoneState, MicrophoneStats } from "@/hooks/use-microphone";
import type { AnalysisStatus } from "@/types/analysis";

interface LiveCallCardProps {
  call: LiveCall;
  connectionState?: ConnectionState;
  analysisStatus?: AnalysisStatus;
  transcript?: string;
  micState?: MicrophoneState;
  micStats?: MicrophoneStats;
  isInitializing?: boolean;
  /** Session error (session-level, not analysis-level) */
  sessionError?: string | null;
  onTriggerAnalysis?: () => Promise<void>;
  onStartMicrophone?: () => Promise<void>;
  onStopMicrophone?: () => void;
  onResetSession?: () => Promise<void>;
}

export function LiveCallCard({
  call,
  connectionState = "DISCONNECTED",
  analysisStatus = "IDLE",
  transcript = "",
  micState = "IDLE",
  micStats = { level: 0, totalSamples: 0, windowsDispatched: 0, secondsBuffered: 0 },
  isInitializing = false,
  sessionError = null,
  onTriggerAnalysis,
  onStartMicrophone,
  onStopMicrophone,
  onResetSession,
}: LiveCallCardProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const riskStyles = getRiskColorClasses(call.riskLevel);

  const isMicActive = micState === "CAPTURING";
  const isMicRequesting = micState === "MICROPHONE_INITIALIZING";
  const isMicStopping = micState === "STOPPING";
  const isMicError = micState === "ERROR" || micState === "UNSUPPORTED" || micState === "MICROPHONE_PERMISSION_REQUIRED";
  const isSessionReady = !!call.sessionId && call.sessionId !== "VS-2026-INIT" && !isInitializing;

  const handleRunAnalysis = async () => {
    if (!onTriggerAnalysis || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      await onTriggerAnalysis();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMicToggle = async () => {
    if (isMicActive) {
      onStopMicrophone?.();
    } else if (!isMicRequesting && !isMicStopping && isSessionReady) {
      await onStartMicrophone?.();
    }
  };

  const levelBars = Math.round(micStats.level * 12);

  // Derive transcript placeholder based on real state
  const transcriptPlaceholder = (): string => {
    if (isInitializing) return "Initializing session...";
    if (connectionState === "CONNECTING" || connectionState === "RECONNECTING")
      return "Establishing secure analysis channel...";
    if (!isSessionReady) return "Initialize a call session to begin analysis.";
    if (isMicActive) return "Listening... speak to begin live transcription.";
    if (analysisStatus === "PROCESSING") return "Processing audio window...";
    return "Waiting for audio. Start mic capture or click \"Run AI Analysis\".";
  };

  return (
    <Card className="border-slate-800 bg-slate-900/90 relative overflow-hidden">
      {/* Semantic risk-level top bar */}
      <div className={`h-1 w-full ${riskStyles.bg}`} />

      <CardContent className="p-5 space-y-4">
        {/* ── Session Header ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-slate-800 border border-slate-700 text-rose-400">
              {isInitializing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              ) : (
                <Radio className="w-3.5 h-3.5 animate-pulse text-rose-400" />
              )}
            </div>
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              CURRENT CALL SESSION
            </span>
            {isInitializing ? (
              <span className="font-mono text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                INITIALIZING...
              </span>
            ) : (
              <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {call.sessionId}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* WebSocket Connection Badge */}
            <div className="flex items-center space-x-1.5 font-mono text-[10px]">
              <span className="text-slate-400 uppercase">WS:</span>
              <span
                className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                  connectionState === "CONNECTED"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : connectionState === "CONNECTING" || connectionState === "RECONNECTING"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                {connectionState}
              </span>
            </div>

            {/* Mic Toggle */}
            <button
              id="mic-toggle-btn"
              onClick={handleMicToggle}
              disabled={isMicRequesting || isMicStopping || !isSessionReady}
              aria-label={isMicActive ? "Stop microphone capture" : "Start microphone capture"}
              className={[
                "flex items-center space-x-1.5 px-3 py-1 font-mono text-xs font-bold rounded transition border shadow-sm",
                isMicActive
                  ? "bg-rose-600 hover:bg-rose-500 border-rose-400/30 text-white"
                  : isMicRequesting
                  ? "bg-amber-600/50 border-amber-400/30 text-amber-200 cursor-wait"
                  : isMicStopping
                  ? "bg-slate-700 border-slate-600 text-slate-300 cursor-wait"
                  : isMicError
                  ? "bg-rose-800/50 border-rose-600/30 text-rose-300 cursor-not-allowed"
                  : !isSessionReady
                  ? "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-700 hover:bg-emerald-600 border-emerald-400/30 text-white",
              ].join(" ")}
            >
              {isMicActive ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Mic</span>
                </>
              ) : isMicRequesting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Requesting...</span>
                </>
              ) : isMicStopping ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Stopping...</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>Live Mic</span>
                </>
              )}
            </button>

            {/* Manual Analysis Trigger */}
            {!isMicActive && onTriggerAnalysis && isSessionReady && (
              <button
                id="run-analysis-btn"
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || analysisStatus === "PROCESSING"}
                className="flex items-center space-x-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-mono text-xs font-bold rounded transition border border-blue-400/30 shadow-sm"
              >
                {isAnalyzing || analysisStatus === "PROCESSING" ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Analysis</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ── Session / Mic Error Banners ─────────────────────────────── */}
        {sessionError && (
          <div className="px-3 py-2 rounded-md bg-rose-950/60 border border-rose-600/30 text-[11px] font-mono text-rose-300 flex items-center justify-between gap-2">
            <span>⚠ {sessionError}</span>
            {onResetSession && (
              <button
                onClick={onResetSession}
                className="px-2 py-0.5 text-[10px] font-bold border border-rose-500/30 rounded hover:bg-rose-500/20 transition"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {isMicActive && (
          <div className="flex items-center justify-between px-3 py-2 rounded-md bg-emerald-950/60 border border-emerald-600/30">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-emerald-300 uppercase tracking-wide">
                CAPTURING AUDIO
              </span>
              <span className="text-[10px] font-mono text-emerald-500">
                Streaming 4s window / 1s hop · {micStats.windowsDispatched} windows sent
              </span>
            </div>
            <div
              className="flex items-center space-x-0.5"
              role="meter"
              aria-valuenow={Math.round(micStats.level * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Audio level ${Math.round(micStats.level * 100)}%`}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-sm transition-all duration-75 ${
                    i < levelBars
                      ? i < 6
                        ? "bg-emerald-400 h-3"
                        : i < 9
                        ? "bg-amber-400 h-4"
                        : "bg-rose-400 h-5"
                      : "bg-slate-700 h-2"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {isMicError && (
          <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-rose-950/60 border border-rose-600/30">
            <MicOff className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            <span className="text-[11px] font-mono text-rose-300">
              {micState === "UNSUPPORTED"
                ? "Browser microphone API not supported. Use manual analysis."
                : micState === "MICROPHONE_PERMISSION_REQUIRED"
                ? "Microphone access denied. Check browser permissions, then try again."
                : "Microphone error. Check connection or try manual analysis."}
            </span>
          </div>
        )}

        {/* ── Caller Identity Grid ────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-md bg-slate-950/80 border border-slate-800/80">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center">
              <User className="w-3 h-3 mr-1 text-slate-400" />
              Caller Identity
            </span>
            <p className="text-sm font-semibold text-white">
              {call.callerName || <span className="text-slate-500 italic">—</span>}
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              {call.callerRole || <span className="text-slate-500 italic">—</span>}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center">
              <PhoneCall className="w-3 h-3 mr-1 text-slate-400" />
              Inbound Line
            </span>
            <p className="text-sm font-mono font-semibold text-slate-200">
              {call.callerNumber || <span className="text-slate-500 italic">—</span>}
            </p>
            <span className="text-[10px] font-mono text-rose-400 font-semibold inline-block bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">
              Verification: {call.verificationState}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center">
              <Clock className="w-3 h-3 mr-1 text-slate-400" />
              Session Start
            </span>
            <p className="text-sm font-mono font-extrabold text-blue-400">
              {call.startTime || "—"}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">{call.status}</p>
          </div>
        </div>

        {/* ── Risk Score ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 rounded-md bg-slate-950 border border-slate-800 gap-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded ${riskStyles.badge} border flex items-center justify-center`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 block">
                Security Risk Level (Risk Fusion Engine)
              </span>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-lg font-bold text-white tracking-tight">Assessment:</span>
                {isInitializing ? (
                  <span className="text-xs font-mono text-slate-500 italic">Initializing...</span>
                ) : analysisStatus === "IDLE" && call.overallRiskScore === 0 ? (
                  <span className="text-xs font-mono text-slate-500 italic">PENDING ANALYSIS</span>
                ) : (
                  <Badge variant={call.riskLevel} className="text-xs font-black font-mono px-2.5 py-0.5">
                    {call.riskLevel}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end justify-center sm:border-l sm:border-slate-800 sm:pl-5">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
              Overall Fused Risk Score
            </span>
            {isInitializing ? (
              <span className="text-sm font-mono text-slate-500 italic">—</span>
            ) : analysisStatus === "IDLE" && call.overallRiskScore === 0 ? (
              <span className="text-sm font-mono text-slate-500 italic">ANALYSIS PENDING</span>
            ) : (
              <div className="flex items-baseline space-x-1">
                <span className={`text-3xl font-black font-mono tracking-tight ${riskStyles.text}`}>
                  {call.overallRiskScore}
                </span>
                <span className="text-xs font-mono text-slate-400">/ 100</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Live ASR Transcript ─────────────────────────────────────── */}
        <div className="p-3 rounded-md bg-slate-950/90 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 flex items-center">
              <FileText className="w-3 h-3 mr-1 text-blue-400" />
              Live Speech Transcript (faster-whisper base)
            </span>
            {analysisStatus === "PROCESSING" && (
              <span className="text-[10px] font-mono text-amber-400 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1 animate-ping" />
                {isMicActive ? "Transcribing live audio..." : "Transcribing..."}
              </span>
            )}
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono min-h-[44px] max-h-28 overflow-y-auto leading-relaxed">
            {transcript ? (
              <p className="text-slate-100">{transcript}</p>
            ) : (
              <p className="text-slate-400 italic">{transcriptPlaceholder()}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
