"use client";

import React, { useState } from "react";
import {
  Settings,
  Sliders,
  Bell,
  CheckCircle2,
  Save,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsView() {
  const [criticalThreshold, setCriticalThreshold] = useState<number>(85);
  const [highThreshold, setHighThreshold] = useState<number>(70);
  const [mediumThreshold, setMediumThreshold] = useState<number>(40);

  const [voiceWeight, setVoiceWeight] = useState<number>(35);
  const [speakerWeight, setSpeakerWeight] = useState<number>(30);
  const [intentWeight, setIntentWeight] = useState<number>(25);
  const [contextWeight, setContextWeight] = useState<number>(10);

  const [retentionMode, setRetentionMode] = useState<"volatile" | "7day" | "30day">("volatile");
  const [redactPii, setRedactPii] = useState<boolean>(true);
  const [webhookUrl, setWebhookUrl] = useState<string>("https://hooks.slack.com/services/T00/B00/XXXX");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="soc-panel p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-mono text-soc-100 tracking-tight">
              Security Calibration &amp; Privacy Center
            </h2>
            <p className="text-xs text-soc-400 font-mono">
              Configure risk fusion thresholds, zero-retention privacy guarantees, and SIEM alerting webhooks
            </p>
          </div>
        </div>

        {saved && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings Successfully Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 font-mono text-xs">
        {/* Section 1: Risk Fusion Thresholds */}
        <div className="soc-panel p-4 sm:p-5 space-y-4">
          <div className="border-b border-soc-700/80 pb-3">
            <h3 className="text-sm font-bold text-soc-100 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>1. Risk Fusion Cutoff Thresholds</span>
            </h3>
            <p className="text-[11px] text-soc-400 font-mono">
              Mathematical score boundaries (0–100) triggering automated containment protocols
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-3.5 rounded-lg bg-soc-800/60 border border-rose-500/30 space-y-2">
              <div className="flex justify-between">
                <span className="text-rose-400 font-bold uppercase">CRITICAL Cutoff</span>
                <span className="text-soc-100 font-bold bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                  &ge; {criticalThreshold}
                </span>
              </div>
              <input
                type="range"
                min={75}
                max={95}
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <p className="text-[10px] text-soc-400 leading-snug">
                Scores &ge; {criticalThreshold} demand immediate wire freeze &amp; safe word challenge.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-soc-800/60 border border-orange-500/30 space-y-2">
              <div className="flex justify-between">
                <span className="text-orange-400 font-bold uppercase">HIGH Cutoff</span>
                <span className="text-soc-100 font-bold bg-orange-500/20 px-2 py-0.5 rounded border border-orange-500/30">
                  &ge; {highThreshold}
                </span>
              </div>
              <input
                type="range"
                min={60}
                max={80}
                value={highThreshold}
                onChange={(e) => setHighThreshold(Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
              />
              <p className="text-[10px] text-soc-400 leading-snug">
                Scores &ge; {highThreshold} require mandatory out-of-band cellular callback.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-soc-800/60 border border-amber-500/30 space-y-2">
              <div className="flex justify-between">
                <span className="text-amber-400 font-bold uppercase">ELEVATED Cutoff</span>
                <span className="text-soc-100 font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                  &ge; {mediumThreshold}
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={55}
                value={mediumThreshold}
                onChange={(e) => setMediumThreshold(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <p className="text-[10px] text-soc-400 leading-snug">
                Scores &ge; {mediumThreshold} trigger desk supervisor warning prompts.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Multi-Signal Weight Multipliers */}
        <div className="soc-panel p-4 sm:p-5 space-y-4">
          <div className="border-b border-soc-700/80 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-soc-100 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>2. Multi-Signal Fusion Weight Multipliers</span>
              </h3>
              <p className="text-[11px] text-soc-400 font-mono">
                Calibrate relative model contributions to composite risk score (Total: {voiceWeight + speakerWeight + intentWeight + contextWeight}%)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-3.5 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-2">
              <div className="flex justify-between">
                <span className="text-soc-200 font-bold">Voice Authenticity (Acoustic Glitch):</span>
                <span className="text-soc-100 font-bold">{voiceWeight}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={50}
                value={voiceWeight}
                onChange={(e) => setVoiceWeight(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-2">
              <div className="flex justify-between">
                <span className="text-soc-200 font-bold">Speaker Consistency (ECAPA Biometrics):</span>
                <span className="text-soc-100 font-bold">{speakerWeight}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={50}
                value={speakerWeight}
                onChange={(e) => setSpeakerWeight(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-2">
              <div className="flex justify-between">
                <span className="text-soc-200 font-bold">Conversation Intent (Urgency &amp; NLP):</span>
                <span className="text-soc-100 font-bold">{intentWeight}%</span>
              </div>
              <input
                type="range"
                min={15}
                max={40}
                value={intentWeight}
                onChange={(e) => setIntentWeight(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-2">
              <div className="flex justify-between">
                <span className="text-soc-200 font-bold">Telephony &amp; Network Context:</span>
                <span className="text-soc-100 font-bold">{contextWeight}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={25}
                value={contextWeight}
                onChange={(e) => setContextWeight(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Privacy & Zero-Retention Security */}
        <div className="soc-panel p-4 sm:p-5 space-y-4">
          <div className="border-b border-soc-700/80 pb-3">
            <h3 className="text-sm font-bold text-soc-100 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>3. Zero-Retention Voice Privacy &amp; Data Governance</span>
            </h3>
            <p className="text-[11px] text-soc-400 font-mono">
              Voice data is sensitive. Ensure corporate privacy compliance and encrypted storage lifecycle
            </p>
          </div>

          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "volatile" as const,
                  title: "Volatile Ephemeral RAM Only",
                  desc: "Audio chunks exist only in volatile server memory during inference and are destroyed immediately post-session.",
                },
                {
                  id: "7day" as const,
                  title: "7-Day Encrypted Retention",
                  desc: "Audio encrypted with customer KMS key for 7 days to facilitate forensic dispute resolution.",
                },
                {
                  id: "30day" as const,
                  title: "30-Day Compliance Escrow",
                  desc: "Full forensic recordings sealed for regulated banking compliance audits.",
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setRetentionMode(opt.id)}
                  className={cn(
                    "p-3.5 rounded-lg border transition-all cursor-pointer space-y-1.5",
                    retentionMode === opt.id
                      ? "bg-soc-750 border-blue-500/60 ring-1 ring-blue-500/40 shadow-sm"
                      : "bg-soc-800/60 border-soc-700/60 hover:border-soc-600"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-soc-100 text-xs">{opt.title}</span>
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <p className="text-[10px] text-soc-300 leading-relaxed">{opt.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-soc-800/60 border border-soc-700/60">
              <div className="space-y-0.5">
                <span className="font-bold text-soc-100 block">Automatic PII Masking in Transcripts</span>
                <span className="text-[11px] text-soc-400 font-mono">
                  Automatically redact credit card numbers, bank account IBANs, and passwords from forensic transcripts
                </span>
              </div>
              <input
                type="checkbox"
                checked={redactPii}
                onChange={(e) => setRedactPii(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 4: SIEM Alerting Webhook */}
        <div className="soc-panel p-4 sm:p-5 space-y-3">
          <div className="border-b border-soc-700/80 pb-3">
            <h3 className="text-sm font-bold text-soc-100 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>4. Real-Time SIEM / Incident Alerting Webhook</span>
            </h3>
            <p className="text-[11px] text-soc-400 font-mono">
              Forward High &amp; Critical threat events directly into corporate Slack, Splunk, or PagerDuty
            </p>
          </div>

          <div>
            <label className="text-[11px] text-soc-300 block mb-1">Webhook Endpoint URL:</label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-soc-800 border border-soc-700 text-soc-100 focus:outline-none focus:border-blue-500 text-xs"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save All Security Calibrations</span>
          </button>
        </div>
      </form>
    </div>
  );
}
