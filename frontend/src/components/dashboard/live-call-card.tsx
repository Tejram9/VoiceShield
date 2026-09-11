"use client";

/**
 * VoiceShield — Primary Live Call Workspace Card (Hero Component)
 *
 * Cybersecurity Operations Center (SOC) Aesthetic:
 * - Glassmorphism card with subtle animated border gradient
 * - 200px Circular SVG Progress Ring Risk Gauge
 * - 3-Column Elegant Stat Cards with colored circular icon backgrounds
 * - Terminal aesthetic Live Transcript Box with cyan glow & blinking cursor
 * - Glowing primary action controls with state-aware animations
 */

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  PhoneCall,
  Mic,
  Square,
  Play,
  Loader2,
  Radio,
  Terminal,
  ShieldAlert,
  ShieldCheck,
  Clock,
  User,
  AlertTriangle,
} from "lucide-react";
import type { LiveCall } from "@/types/dashboard";
import type { ConnectionState } from "@/lib/websocket/analysis-socket";
import type { AnalysisStatus } from "@/types/analysis";
import type { MicrophoneState, MicrophoneStats } from "@/hooks/use-microphone";
import type { AnalyzeSegmentRequest } from "@/lib/api/types";

interface LiveCallCardProps {
  call: LiveCall;
  connectionState: ConnectionState;
  analysisStatus: AnalysisStatus;
  transcript?: string;
  micState: MicrophoneState;
  micStats: MicrophoneStats;
  isInitializing?: boolean;
  sessionError?: string | null;
  onTriggerAnalysis?: (payload?: AnalyzeSegmentRequest) => Promise<void>;
  onStartMicrophone?: () => Promise<void>;
  onStopMicrophone?: () => void;
  onResetSession?: () => Promise<void>;
}

export function LiveCallCard({
  call,
  connectionState,
  analysisStatus,
  transcript = "",
  micState,
  micStats,
  isInitializing = false,
  sessionError = null,
  onTriggerAnalysis,
  onStartMicrophone,
  onStopMicrophone,
  onResetSession,
}: LiveCallCardProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const isConnected = connectionState === "CONNECTED";
  const isSessionReady = isConnected && !isInitializing;
  const isMicActive = micState === "CAPTURING";
  const isMicRequesting = micState === "MICROPHONE_PERMISSION_REQUIRED" || micState === "MICROPHONE_INITIALIZING";
  const isMicStopping = micState === "STOPPING";
  const isMicError = micState === "ERROR" || micState === "UNSUPPORTED";

  const handleMicToggle = async () => {
    if (isMicActive) {
      onStopMicrophone?.();
    } else {
      await onStartMicrophone?.();
    }
  };

  const handleRunAnalysis = async () => {
    if (!onTriggerAnalysis || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      await onTriggerAnalysis();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isPending = (analysisStatus === "IDLE" || isInitializing) && call.overallRiskScore === 0;

  // SVG Progress Ring Geometry (200px diameter)
  const radius = 78;
  const circumference = 2 * Math.PI * radius; // ~490.09
  const scorePercent = Math.min(100, Math.max(0, call.overallRiskScore));
  const strokeDashoffset = circumference - (circumference * scorePercent) / 100;

  const transcriptPlaceholder = () => {
    if (isMicActive) return "STREAM ACTIVE // Capturing live PCM audio stream... Real-time speech recognition transcript will appear here.";
    if (analysisStatus === "PROCESSING") return "INFERENCE RUNNING // Transcribing and screening voice segments with faster-whisper and ECAPA-TDNN...";
    return "FEED IDLE // Awaiting audio stream. Click 'Start Call Protection' or 'Run AI Test' to evaluate caller audio.";
  };

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative rounded-2xl bg-white p-6 sm:p-7 space-y-6">

        {/* ── Top Header with Title, Status & Hero Action Buttons ─────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl border transition-all duration-150 flex-shrink-0 ${
              isMicActive
                ? "bg-emerald-50 border-emerald-300 text-emerald-600 shadow-sm animate-pulse"
                : isInitializing
                ? "bg-amber-50 border-amber-300 text-amber-600"
                : "bg-blue-50 border-blue-200 text-blue-600 shadow-sm"
            }`}>
              {isInitializing ? (
                <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
              ) : isMicActive ? (
                <Radio className="w-6 h-6 text-emerald-600 animate-pulse" />
              ) : (
                <PhoneCall className="w-6 h-6 text-blue-600" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight font-sans">
                  {call.callerName || "Direct Call Trunk"}
                </h2>
                <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {call.sessionId}
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-[#64748B] border border-slate-200">
                  {call.verificationState}
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-1 font-sans">
                Active Telephony Session • Biometric &amp; Audio Forensics Protection
              </p>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Mic Button */}
            <button
              id="mic-toggle-btn"
              onClick={handleMicToggle}
              disabled={isMicRequesting || isMicStopping || !isSessionReady}
              aria-label={isMicActive ? "Stop microphone capture" : "Start microphone capture"}
              className={[
                "flex items-center space-x-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-h-[44px]",
                isMicActive
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400/50 animate-pulse"
                  : isMicRequesting
                  ? "bg-amber-50 border border-amber-300 text-amber-800 cursor-wait"
                  : isMicStopping
                  ? "bg-slate-100 border border-slate-200 text-slate-500 cursor-wait"
                  : isMicError
                  ? "bg-red-50 border border-red-200 text-red-700 cursor-not-allowed"
                  : !isSessionReady
                  ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 shadow-sm hover:border-slate-400 hover:scale-[1.02]",
              ].join(" ")}
            >
              {isMicActive ? (
                <>
                  <Square className="w-4 h-4 fill-current text-white" />
                  <span>Stop Protection</span>
                </>
              ) : isMicRequesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                  <span>Requesting Mic...</span>
                </>
              ) : isMicStopping ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Stopping...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-blue-600" />
                  <span>Start Call Protection</span>
                </>
              )}
            </button>

            {/* Run Analysis Button */}
            {!isMicActive && onTriggerAnalysis && isSessionReady && (
              <button
                id="run-analysis-btn"
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || analysisStatus === "PROCESSING"}
                className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:scale-[1.02] transition-all duration-150 cursor-pointer min-h-[44px]"
              >
                {isAnalyzing || analysisStatus === "PROCESSING" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-white fill-current transition-transform group-hover:scale-110" />
                    <span>Run AI Test</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ── Network / Session Error Notices ─────────────────────────── */}
        {sessionError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 border-l-4 border-l-red-500 text-xs text-red-800 flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{sessionError}</span>
            </div>
            {onResetSession && (
              <button
                onClick={onResetSession}
                className="underline text-red-700 hover:text-red-900 font-bold text-xs cursor-pointer"
              >
                Reset Session
              </button>
            )}
          </div>
        )}

        {isMicError && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 text-xs text-amber-800 flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Microphone capture issue: {micState === "UNSUPPORTED" ? "Browser audio unsupported" : "Verify browser microphone permissions"}
              </span>
            </div>
          </div>
        )}

        {/* ── Caller Identity / Inbound Line / Session Stat Cards ──────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stat Card 1: Caller Identity */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-none flex items-center space-x-3.5 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#64748B] block">
                Caller Identity
              </span>
              <p className="text-sm font-bold text-[#0F172A] truncate mt-0.5">
                {call.callerName || "Direct Call Trunk"}
              </p>
              <span className="text-[11px] text-[#64748B] block truncate">
                {call.callerRole || "Executive Channel"}
              </span>
            </div>
          </div>

          {/* Stat Card 2: Inbound Line */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-none flex items-center space-x-3.5 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-full bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700 flex-shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#64748B] block">
                Inbound Line
              </span>
              <p className="font-mono text-sm font-semibold text-blue-700 truncate mt-0.5">
                {call.callerNumber || "+1 (555) 234-8901"}
              </p>
              <span className="text-[11px] text-[#64748B] block truncate">
                Routing: SIP / Direct Trunk
              </span>
            </div>
          </div>

          {/* Stat Card 3: Session Duration */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-none flex items-center space-x-3.5 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#64748B] block">
                Session Duration
              </span>
              <p className="font-mono text-sm font-semibold text-emerald-700 truncate mt-0.5">
                {call.duration || "00:00"}
              </p>
              <span className="text-[11px] font-mono text-[#64748B] block truncate">
                Started: {call.startTime || "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* ── HERO RISK GAUGE: 200px Circular SVG Progress Ring Section ──── */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative overflow-hidden">
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Column: Shield Icon Badge & Verdict Explanation */}
            <div className="flex-1 space-y-3 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3.5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                  isPending
                    ? "bg-blue-100 border-blue-200 text-blue-600 shadow-sm"
                    : call.riskLevel === "HIGH"
                    ? "bg-red-100 border-red-200 text-red-600 shadow-sm"
                    : call.riskLevel === "MEDIUM"
                    ? "bg-amber-100 border-amber-200 text-amber-600 shadow-sm"
                    : "bg-emerald-100 border-emerald-200 text-emerald-600 shadow-sm"
                }`}>
                  {isPending ? (
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  ) : call.riskLevel === "LOW" ? (
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <ShieldAlert className="w-6 h-6 text-red-600 animate-pulse" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#64748B] block">
                    Risk Fusion Engine Verdict
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight font-sans">
                    {isPending
                      ? "Ready to Monitor Call"
                      : call.riskLevel === "LOW"
                      ? "Authentic Caller Verified"
                      : call.riskLevel === "MEDIUM"
                      ? "Suspicious Voice Patterns Detected"
                      : "Critical Voice Clone Alert"}
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-xl font-sans">
                {isPending
                  ? "Awaiting active voice segment. Click 'Start Call Protection' to capture live speech, or 'Run AI Test' to evaluate simulated deepfake vectors."
                  : call.riskLevel === "LOW"
                  ? "Acoustic spectrum, vocal tract consistency, and conversational semantics confirm natural human speech. No synthetic vocoder artifacts detected."
                  : call.riskLevel === "MEDIUM"
                  ? "Elevated acoustic variance or unusual urgency patterns detected. Secondary verification protocol recommended before sharing credentials."
                  : "High-confidence synthetic voice generation detected. Frequency phase discontinuities and coercive speech markers indicate an active impersonation attack."}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[#64748B] shadow-none">
                  WAV2VEC2: ACTIVE
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[#64748B] shadow-none">
                  ECAPA-TDNN: 512-DIM
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[#64748B] shadow-none">
                  WHISPER ASR: ONLINE
                </span>
              </div>
            </div>

            {/* Right Column: 200px Circular SVG Progress Ring */}
            <div className="flex flex-col items-center justify-center flex-shrink-0">
              <div className="relative w-[200px] h-[200px] flex items-center justify-center">
                <svg
                  className="w-full h-full -rotate-90 transform"
                  viewBox="0 0 200 200"
                  aria-label={`Risk score: ${call.overallRiskScore} percent`}
                >
                  <defs>
                    {/* High Risk Gradient */}
                    <linearGradient id="highRiskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#DC2626" />
                    </linearGradient>
                    {/* Medium Risk Gradient */}
                    <linearGradient id="mediumRiskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                    {/* Low Risk Gradient */}
                    <linearGradient id="lowRiskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>

                  {/* Background Track Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    className="stroke-slate-200"
                    strokeWidth="10"
                    fill="transparent"
                  />

                  {/* Rotating Dashed Circle when PENDING */}
                  {isPending ? (
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      stroke="#3B82F6"
                      strokeWidth="10"
                      strokeDasharray="14 10"
                      fill="transparent"
                      className="animate-spin-slow opacity-60"
                      strokeLinecap="round"
                    />
                  ) : (
                    /* Active Progress Ring Fill */
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      stroke={
                        call.riskLevel === "HIGH"
                          ? "url(#highRiskGradient)"
                          : call.riskLevel === "MEDIUM"
                          ? "url(#mediumRiskGradient)"
                          : "url(#lowRiskGradient)"
                      }
                      strokeWidth="12"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  )}
                </svg>

                {/* Center Score & Badge Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                  {isPending ? (
                    <>
                      <span className="font-mono text-2xl font-bold text-slate-500 tracking-wider animate-pulse">
                        READY
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#64748B] mt-0.5">
                        Awaiting Audio
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-mono text-4xl font-extrabold text-[#0F172A] tracking-tight">
                        {call.overallRiskScore}%
                      </span>
                      <Badge
                        variant={call.riskLevel}
                        className="text-[10px] font-bold px-2.5 py-0.5 mt-1"
                      >
                        {call.riskLevel} THREAT
                      </Badge>
                      <span className="text-[9px] font-mono text-[#64748B] uppercase tracking-widest mt-1">
                        Risk Score
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Terminal Aesthetic Live Transcript Box ───────────────────── */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 relative overflow-hidden space-y-3">
          <div className="relative flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-2 font-mono tracking-wide">
              <Terminal className="w-4 h-4 text-blue-600" />
              LIVE_CONVERSATION_STREAM // TRANSCRIBE_V2
            </span>

            {/* Audio Spectrum Meter when mic is capturing */}
            {isMicActive ? (
              <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-mono font-bold text-emerald-700">STREAMING</span>
                <div
                  className="flex items-center space-x-1 pl-1"
                  role="meter"
                  aria-valuenow={Math.round(micStats.level * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-75 ${
                        i < Math.min(8, Math.round(micStats.level * 12))
                          ? i < 4
                            ? "bg-emerald-500 h-3"
                            : i < 6
                            ? "bg-amber-500 h-3.5"
                            : "bg-red-500 h-4"
                          : "bg-slate-300 h-1.5"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : analysisStatus === "PROCESSING" ? (
              <span className="text-xs font-mono font-semibold text-amber-800 flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>INFERENCE_PROCESSING...</span>
              </span>
            ) : null}
          </div>

          <div className="relative p-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 min-h-[72px] max-h-40 overflow-y-auto leading-relaxed font-mono">
            {transcript ? (
              <p className="text-slate-900 font-mono leading-relaxed">
                {transcript}
                <span className="inline-block w-2 h-4 ml-1.5 bg-blue-600 animate-cursor-blink align-middle" />
              </p>
            ) : (
              <p className="text-slate-400 font-mono leading-relaxed">
                {transcriptPlaceholder()}
                <span className="inline-block w-2 h-4 ml-1.5 bg-blue-400/50 animate-cursor-blink align-middle" />
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

