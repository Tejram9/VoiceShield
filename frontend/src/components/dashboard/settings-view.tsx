"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, Sliders, Cpu, BellRing, Save, CheckCircle2, Radio } from "lucide-react";

export function SettingsView() {
  const [highThreshold, setHighThreshold] = useState<number>(75);
  const [mediumThreshold, setMediumThreshold] = useState<number>(40);
  const [windowSeconds, setWindowSeconds] = useState<number>(4);
  const [hopSeconds, setHopSeconds] = useState<number>(1);
  const [webhookUrl, setWebhookUrl] = useState<string>("https://hooks.slack.com/services/T000/B000/XXXX");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">Security Engine Calibration</h2>
              <p className="text-xs text-[#64748B]">
                Calibrate risk fusion thresholds, AI models, and enterprise alerting triggers
              </p>
            </div>
          </div>
        </div>

        {saved && (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Settings Successfully Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Risk Thresholds Card */}
        <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <CardTitle className="text-sm font-mono uppercase tracking-[0.1em] text-[#0F172A]">Risk Fusion Thresholds</CardTitle>
            </div>
            <CardDescription className="text-xs text-[#64748B]">
              Determine when calls transition between LOW, MEDIUM, and HIGH threat protocols
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-700">HIGH Risk Threshold</span>
                  <span className="font-mono text-xs font-bold text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded">{highThreshold}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={95}
                  value={highThreshold}
                  onChange={(e) => setHighThreshold(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <p className="text-[11px] text-[#64748B] font-mono">
                  Scores &ge; {highThreshold} immediately suggest emergency termination.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-700">MEDIUM Risk Threshold</span>
                  <span className="font-mono text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded">{mediumThreshold}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={60}
                  value={mediumThreshold}
                  onChange={(e) => setMediumThreshold(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <p className="text-[11px] text-[#64748B] font-mono">
                  Scores &ge; {mediumThreshold} prompt active caller challenge.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Inference Providers Card */}
        <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <CardTitle className="text-sm font-mono uppercase tracking-[0.1em] text-[#0F172A]">Active AI Inference Engines</CardTitle>
            </div>
            <CardDescription className="text-xs text-[#64748B]">
              Hardware-accelerated neural networks running in the local runtime
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#0F172A]">faster-whisper</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[11px] text-[#64748B]">ASR &amp; Semantic Intent</p>
                <span className="inline-block text-[10px] text-emerald-700 font-mono font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">CUDA Active</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#0F172A]">SpeechBrain ECAPA</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[11px] text-[#64748B]">192-dim Voiceprint Match</p>
                <span className="inline-block text-[10px] text-emerald-700 font-mono font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">CUDA Active</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#0F172A]">Wav2Vec2 Spoof</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[11px] text-[#64748B]">Deepfake Vocoder Detector</p>
                <span className="inline-block text-[10px] text-emerald-700 font-mono font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">CUDA Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audio Pipeline Settings */}
        <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-blue-600" />
              <CardTitle className="text-sm font-mono uppercase tracking-[0.1em] text-[#0F172A]">Streaming Audio Parameters</CardTitle>
            </div>
            <CardDescription className="text-xs text-[#64748B]">
              Browser AudioWorklet rolling buffer settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-700">Analysis Window Duration</label>
                <select
                  value={windowSeconds}
                  onChange={(e) => setWindowSeconds(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0F172A] font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={3} className="bg-white text-[#0F172A]">3.0 seconds</option>
                  <option value={4} className="bg-white text-[#0F172A]">4.0 seconds (Canonical)</option>
                  <option value={5} className="bg-white text-[#0F172A]">5.0 seconds</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-700">Stride Hop Duration</label>
                <select
                  value={hopSeconds}
                  onChange={(e) => setHopSeconds(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0F172A] font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={0.5} className="bg-white text-[#0F172A]">0.5 seconds (Ultra-low latency)</option>
                  <option value={1} className="bg-white text-[#0F172A]">1.0 seconds (Standard)</option>
                  <option value={2} className="bg-white text-[#0F172A]">2.0 seconds</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Webhook & Incident Dispatch */}
        <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BellRing className="w-4 h-4 text-amber-600" />
              <CardTitle className="text-sm font-mono uppercase tracking-[0.1em] text-[#0F172A]">Enterprise Alert Dispatch</CardTitle>
            </div>
            <CardDescription className="text-xs text-[#64748B]">
              Webhook destination for real-time SIEM / SOAR incident dispatch
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 mb-1">Webhook URL</label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-domain.com/api/security-webhook"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0F172A] font-mono placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer min-h-[44px] hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
