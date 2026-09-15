"use client";

import React, { useState } from "react";
import { MOCK_CALL_HISTORY } from "@/lib/mock-data";
import { CallRecord } from "@/types/dashboard";
import { RiskIndicator } from "@/components/design-system/risk-indicator";
import {
  Play,
  Pause,
  Download,
  Lock,
  Activity,
  ArrowLeft,
  Clock,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ForensicsViewProps {
  call?: CallRecord;
  onBackToHistory?: () => void;
  className?: string;
}

export function ForensicsView({
  call = MOCK_CALL_HISTORY[0],
  onBackToHistory,
  className,
}: ForensicsViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(38); // percentage
  const [playbackSpeed, setPlaybackSpeed] = useState<"1.0x" | "0.5x">("1.0x");
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [exportSuccess, setExportSuccess] = useState(false);

  const transcriptItems = call.transcriptHighlights || [
    {
      time: "00:12",
      speaker: "AGENT" as const,
      text: "Executive Treasury Desk, Rachel Vance speaking. How can I help?",
      risk: "LOW" as const,
    },
    {
      time: "00:18",
      speaker: "CALLER" as const,
      text: "Rachel, it's Rahul Sharma. I'm in closed-door sessions with our European partners.",
      category: "IDENTITY_CLAIM" as const,
      risk: "LOW" as const,
    },
    {
      time: "00:34",
      speaker: "CALLER" as const,
      text: "We need an emergency $45,000 wire released to our Zurich escrow account immediately.",
      category: "FINANCIAL_REQUEST" as const,
      risk: "HIGH" as const,
    },
    {
      time: "00:52",
      speaker: "AGENT" as const,
      text: "Mr. Sharma, standard protocol requires a verbal safe word for off-ledger wires.",
      risk: "LOW" as const,
    },
    {
      time: "01:05",
      speaker: "CALLER" as const,
      text: "I don't have time for safe words! The deal collapses if the funds aren't cleared by 5 PM.",
      category: "URGENCY" as const,
      risk: "CRITICAL" as const,
    },
    {
      time: "01:24",
      speaker: "CALLER" as const,
      text: "Bypass the dual authorization and mark it as my personal executive override.",
      category: "AUTH_BYPASS" as const,
      risk: "CRITICAL" as const,
    },
  ];

  const filteredTranscript = transcriptItems.filter((item) => {
    if (activeFilter === "ALL") return true;
    return item.category === activeFilter;
  });

  const handleExport = () => {
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2500);
  };

  const getCategoryBadge = (cat?: string) => {
    switch (cat) {
      case "IDENTITY_CLAIM":
        return <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-mono font-bold">IDENTITY CLAIM</span>;
      case "URGENCY":
        return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold">URGENCY PRESSURE</span>;
      case "FINANCIAL_REQUEST":
        return <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-mono font-bold">FINANCIAL DIRECTIVE</span>;
      case "AUTH_BYPASS":
        return <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[9px] font-mono font-bold">AUTH BYPASS</span>;
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-6 max-w-7xl mx-auto font-sans", className)}>
      {/* ── Top Header & Forensic Session ID ──────────────────────────── */}
      <div className="soc-panel p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          {onBackToHistory && (
            <button
              type="button"
              onClick={onBackToHistory}
              className="p-2 rounded-lg bg-soc-800 hover:bg-soc-750 text-soc-300 hover:text-soc-100 border border-soc-700 transition-colors cursor-pointer"
              aria-label="Back to call history"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-soc-400 font-bold">
                AUDITED FORENSIC DOSSIER
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-soc-800 text-soc-300 border border-soc-700">
                {call.sessionId}
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-bold font-mono text-soc-100 tracking-tight mt-0.5">
              {call.callerName} — {call.duration} Inbound Recording
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <RiskIndicator level={call.riskLevel} score={call.riskScore} size="md" />

          <button
            type="button"
            onClick={handleExport}
            className="px-3.5 py-2 rounded-lg bg-soc-800 hover:bg-soc-750 text-soc-100 font-mono text-xs font-bold border border-soc-700 transition-colors flex items-center space-x-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>{exportSuccess ? "Evidence Exported" : "Export Evidence Bundle"}</span>
          </button>
        </div>
      </div>

      {/* ── Level 1 & 2: Final Decision & Operational Summary ─────────── */}
      <div className="soc-panel p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-soc-700/80 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>FINAL FORENSIC DISPOSITION: CONFIRMED IMPERSONATION ATTACK</span>
          </div>
          <span className="text-xs font-mono text-soc-400">
            Disposed by: Lead SOC Analyst David Zhao (Containment Enforced)
          </span>
        </div>

        {/* 4 Signals Diagnostic Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-1">
            <span className="text-[10px] text-soc-500 uppercase font-bold">1. Voice Authenticity</span>
            <div className="text-rose-400 font-bold">High Concern (94/100)</div>
            <p className="text-[11px] text-soc-300">Phase glitch at 1.24kHz confirms HiFi-GAN neural vocoder</p>
          </div>

          <div className="p-3 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-1">
            <span className="text-[10px] text-soc-500 uppercase font-bold">2. Speaker Consistency</span>
            <div className="text-rose-400 font-bold">Mismatch (88/100)</div>
            <p className="text-[11px] text-soc-300">Cosine distance 0.42 deviates from enrolled Rahul Sharma profile</p>
          </div>

          <div className="p-3 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-1">
            <span className="text-[10px] text-soc-500 uppercase font-bold">3. Conversation Intent</span>
            <div className="text-rose-400 font-bold">Critical Coercion (85/100)</div>
            <p className="text-[11px] text-soc-300">Demanded $45k wire and attempted dual-authorization bypass</p>
          </div>

          <div className="p-3 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-1">
            <span className="text-[10px] text-soc-500 uppercase font-bold">4. Telephony &amp; Context</span>
            <div className="text-amber-400 font-bold">Elevated (48/100)</div>
            <p className="text-[11px] text-soc-300">Unattested SIP carrier gateway with carrier route anomaly</p>
          </div>
        </div>
      </div>

      {/* ── Synchronized Audio Scrubber & Waveform Canvas ─────────────── */}
      <div className="soc-panel p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div className="font-mono text-xs">
              <span className="text-soc-100 font-bold">01:05</span>
              <span className="text-soc-500"> / {call.duration}</span>
            </div>
            <div className="inline-flex p-0.5 rounded-lg bg-soc-800 border border-soc-700 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setPlaybackSpeed("1.0x")}
                className={cn("px-2 py-0.5 rounded font-bold cursor-pointer", playbackSpeed === "1.0x" ? "bg-blue-600 text-white" : "text-soc-400 hover:text-white")}
              >
                1.0x
              </button>
              <button
                type="button"
                onClick={() => setPlaybackSpeed("0.5x")}
                className={cn("px-2 py-0.5 rounded font-bold cursor-pointer", playbackSpeed === "0.5x" ? "bg-blue-600 text-white" : "text-soc-400 hover:text-white")}
              >
                0.5x Forensic Slow
              </button>
            </div>
          </div>

          <span className="text-xs font-mono text-soc-400">
            Playback Stream: Inbound PCM-S16LE 16kHz
          </span>
        </div>

        {/* Waveform Scrubber Track with Threat Markers */}
        <div className="space-y-2 font-mono text-[10px]">
          <div
            className="h-14 rounded-lg bg-soc-900 border border-soc-700 p-2 relative overflow-hidden flex items-center cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              setPlaybackProgress(Math.round((clickX / rect.width) * 100));
            }}
          >
            {/* Simulated Audio Bars */}
            <div className="w-full flex items-center justify-between gap-1 opacity-70">
              {Array.from({ length: 70 }).map((_, i) => {
                const height = 15 + Math.sin(i * 0.4) * 35 + Math.cos(i * 0.8) * 20;
                const isThreatSegment = i >= 20 && i <= 35; // threat highlighted
                return (
                  <div
                    key={i}
                    style={{ height: `${Math.max(10, Math.min(95, height))}%` }}
                    className={cn(
                      "w-1 rounded-full transition-all",
                      isThreatSegment ? "bg-rose-500" : "bg-soc-600"
                    )}
                  />
                );
              })}
            </div>

            {/* Playhead Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500 shadow-sm transition-all"
              style={{ left: `${playbackProgress}%` }}
            >
              <div className="w-2 h-2 rounded-full bg-blue-400 -translate-x-[3px] -translate-y-[2px]" />
            </div>
          </div>

          <div className="flex justify-between text-soc-400">
            <span>00:00 (Call Start)</span>
            <span className="text-rose-400 font-bold">00:34 - 01:24 (Impersonation Threat Window)</span>
            <span>{call.duration} (Terminated)</span>
          </div>
        </div>
      </div>

      {/* ── Detailed Forensic Evidence Grid ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Categorized Semantic Phrase Timeline (7 cols) */}
        <div className="lg:col-span-7 soc-panel p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-soc-700/80 pb-3 gap-2">
            <div>
              <h3 className="text-sm font-bold font-mono text-soc-100 tracking-tight">
                Categorized Semantic Phrase Log
              </h3>
              <p className="text-[11px] font-mono text-soc-400">
                Extracted threat phrases correlated with audio timestamps
              </p>
            </div>

            <div className="flex items-center space-x-1 text-[10px] font-mono bg-soc-800 p-1 rounded-lg border border-soc-700">
              {["ALL", "FINANCIAL_REQUEST", "URGENCY", "AUTH_BYPASS"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "px-2 py-0.5 rounded font-bold transition-colors cursor-pointer",
                    activeFilter === f ? "bg-blue-600 text-white" : "text-soc-400 hover:text-white"
                  )}
                >
                  {f === "ALL" ? "ALL" : f.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {filteredTranscript.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-3 rounded-lg border space-y-1.5",
                  item.risk === "CRITICAL"
                    ? "bg-rose-950/20 border-rose-500/30"
                    : item.risk === "HIGH"
                    ? "bg-orange-950/20 border-orange-500/30"
                    : "bg-soc-800/60 border-soc-700/60"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-soc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-soc-500" />
                      {item.time}
                    </span>
                    <span className="text-[10px] font-bold text-soc-300">
                      [{item.speaker}]
                    </span>
                  </div>
                  {getCategoryBadge(item.category)}
                </div>

                <p className="text-soc-100 text-xs leading-relaxed">
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Technical Evidence & Chain of Custody (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Acoustic Anomaly Card */}
          <div className="soc-panel p-4 sm:p-5 space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-soc-100 border-b border-soc-700/80 pb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Acoustic Spectrum Diagnostics</span>
            </h3>

            <div className="space-y-2.5">
              <div className="flex justify-between text-soc-300 pb-2 border-b border-soc-700/60">
                <span>Neural Vocoder Artifact:</span>
                <span className="font-bold text-rose-400">HiFi-GAN Synth Glitch</span>
              </div>

              <div className="flex justify-between text-soc-300 pb-2 border-b border-soc-700/60">
                <span>Spectral Glitch Peak:</span>
                <span className="font-bold text-soc-100">1,240 Hz Phase Discontinuity</span>
              </div>

              <div className="flex justify-between text-soc-300 pb-2 border-b border-soc-700/60">
                <span>ECAPA-TDNN Cosine Distance:</span>
                <span className="font-bold text-rose-400">0.42 (Threshold &gt;= 0.75)</span>
              </div>

              <div className="flex justify-between text-soc-300 pb-2 border-b border-soc-700/60">
                <span>Natural Pitch Micro-Jitter:</span>
                <span className="font-bold text-amber-400">Sub-Biological Variance</span>
              </div>

              <div className="flex justify-between text-soc-300">
                <span>STIR/SHAKEN Attestation:</span>
                <span className="font-bold text-amber-400">Level C (Unattested Gateway)</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Chain of Custody */}
          <div className="soc-panel p-4 sm:p-5 space-y-3 font-mono text-xs">
            <h3 className="text-sm font-bold text-soc-100 border-b border-soc-700/80 pb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Tamper-Proof Chain of Custody</span>
            </h3>

            <div className="space-y-2 text-[11px] text-soc-300">
              <div className="flex justify-between text-soc-400">
                <span>UTC Timestamp:</span>
                <span className="text-soc-200">2026-09-14 18:24:10 UTC</span>
              </div>

              <div className="flex justify-between text-soc-400">
                <span>Forensic Hash Algorithm:</span>
                <span className="text-emerald-400">SHA-256 (FIPS 180-4)</span>
              </div>

              <div className="pt-1.5">
                <span className="text-soc-500 block mb-1">Payload SHA-256 Digest:</span>
                <div className="p-2 rounded-lg bg-soc-800 border border-soc-700 text-[10px] break-all font-bold text-soc-200">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-400 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Audio recording &amp; transcript cryptographically verified.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
