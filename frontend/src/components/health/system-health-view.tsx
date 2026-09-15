"use client";

import React from "react";
import {
  Cpu,
  Activity,
  CheckCircle2,
  Zap,
  HardDrive,
  Clock,
} from "lucide-react";

export function SystemHealthView() {
  const models = [
    {
      name: "SpeechBrain ECAPA-TDNN v1.4",
      purpose: "Biometric Speaker Embedding (192-dim)",
      latency: "42 ms",
      vram: "1.2 GB VRAM",
      device: "NVIDIA RTX 4090 (CUDA 12.4)",
      status: "OPTIMAL",
    },
    {
      name: "faster-whisper (CTranslate2 Int8)",
      purpose: "Real-Time Sub-Second ASR Transcription",
      latency: "98 ms",
      vram: "2.1 GB VRAM",
      device: "NVIDIA RTX 4090 (CUDA 12.4)",
      status: "OPTIMAL",
    },
    {
      name: "AASIST Vocoder Artifact Detector",
      purpose: "Spectral Phase & Synthetic Glitch Forensics",
      latency: "35 ms",
      vram: "0.8 GB VRAM",
      device: "NVIDIA RTX 4090 (CUDA 12.4)",
      status: "OPTIMAL",
    },
    {
      name: "RoBERTa-Coercion Intent Engine",
      purpose: "Semantic Urgency & Financial Directive Scoring",
      latency: "28 ms",
      vram: "0.6 GB VRAM",
      device: "NVIDIA RTX 4090 (CUDA 12.4)",
      status: "OPTIMAL",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="soc-panel p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-mono text-soc-100 tracking-tight">
              AI Inference Pipeline &amp; Telephony Health
            </h2>
            <p className="text-xs text-soc-400 font-mono">
              Real-time telemetry for neural models, GPU load, and WebSocket streaming buffers
            </p>
          </div>
        </div>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>ALL INFERENCE PIPELINES OPERATIONAL</span>
        </div>
      </div>

      {/* Infrastructure Telemetry Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="soc-panel p-4 sm:p-5 space-y-1 font-mono text-xs">
          <div className="flex items-center justify-between text-soc-400">
            <span>GPU Utilization</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-soc-100">28.4%</div>
          <span className="text-[10px] text-soc-500">4.7 / 24 GB VRAM allocated</span>
        </div>

        <div className="soc-panel p-4 sm:p-5 space-y-1 font-mono text-xs">
          <div className="flex items-center justify-between text-soc-400">
            <span>Cumulative Latency</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">145 ms</div>
          <span className="text-[10px] text-soc-500">Target SLA &lt; 250 ms</span>
        </div>

        <div className="soc-panel p-4 sm:p-5 space-y-1 font-mono text-xs">
          <div className="flex items-center justify-between text-soc-400">
            <span>WebSocket Queue Depth</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-soc-100">0 Chunks</div>
          <span className="text-[10px] text-emerald-400">Zero backpressure drops</span>
        </div>

        <div className="soc-panel p-4 sm:p-5 space-y-1 font-mono text-xs">
          <div className="flex items-center justify-between text-soc-400">
            <span>Audio Retention Buffer</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-soc-100">Volatile Only</div>
          <span className="text-[10px] text-soc-500">Zero-day disk persistence</span>
        </div>
      </div>

      {/* Active Model Stack Cards */}
      <div className="soc-panel p-4 sm:p-5 space-y-4">
        <div className="border-b border-soc-700/80 pb-3">
          <h3 className="text-sm font-bold text-soc-100 font-mono uppercase tracking-wider">
            Neural Detection Models In Memory
          </h3>
          <p className="text-[11px] text-soc-400 font-mono">
            Loaded models screening each 16kHz PCM frame via streaming inference workers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map((mod) => (
            <div
              key={mod.name}
              className="p-3.5 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-2 text-xs font-mono"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-soc-100">{mod.name}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  {mod.status}
                </span>
              </div>
              <p className="text-[11px] text-soc-400">{mod.purpose}</p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-soc-700/50 text-[10px]">
                <div>
                  <span className="text-soc-500 block">Latency:</span>
                  <span className="text-soc-200 font-bold">{mod.latency}</span>
                </div>
                <div>
                  <span className="text-soc-500 block">Memory:</span>
                  <span className="text-soc-200 font-bold">{mod.vram}</span>
                </div>
                <div>
                  <span className="text-soc-500 block">Host:</span>
                  <span className="text-soc-200 truncate block">CUDA GPU</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
