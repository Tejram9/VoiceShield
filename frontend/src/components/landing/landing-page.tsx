"use client";

import React, { useState } from "react";
import {
  Shield,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Radio,
  Layers,
  Building2,
  CheckCircle2,
  Activity,
  Users,
  Server,
  LogIn,
} from "lucide-react";
import { WaveformVisualizer } from "@/components/design-system/waveform-visualizer";
import { RiskBadge } from "@/components/design-system/risk-badge";
import { ModalDialog } from "@/components/design-system/modal-dialog";
import { cn } from "@/lib/utils";

interface LandingPageProps {
  onEnterConsole: () => void;
}

export function LandingPage({ onEnterConsole }: LandingPageProps) {
  const [simulatorMode, setSimulatorMode] = useState<"attack" | "legitimate">("attack");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [annualCalls, setAnnualCalls] = useState(50000);
  const [avgWireAmount, setAvgWireAmount] = useState(45000);

  // Prevention ROI Calculator
  const estimatedAttacks = Math.max(1, Math.round(annualCalls * 0.003)); // 0.3% impersonation attack rate
  const preventedLosses = Math.round(estimatedAttacks * avgWireAmount * 0.85);

  return (
    <div className="min-h-screen bg-soc-950 text-soc-100 font-sans selection:bg-blue-500/30 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-soc-950/90 backdrop-blur-xl border-b border-soc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onEnterConsole}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-base font-black tracking-wider text-white uppercase block">
                VOICE SHIELD
              </span>
              <span className="text-[10px] text-soc-400 font-mono tracking-tight">
                Enterprise Voice Clone Defense
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-mono text-soc-300">
            <a href="#problem" className="hover:text-white transition-colors">The Threat</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">5-Signal Engine</a>
            <a href="#simulator" className="hover:text-white transition-colors">Live Simulation</a>
            <a href="#use-cases" className="hover:text-white transition-colors">Enterprise</a>
            <a href="#architecture" className="hover:text-white transition-colors">Security &amp; Privacy</a>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="px-3.5 py-2 rounded-lg text-xs font-mono font-medium text-soc-300 hover:text-white hover:bg-soc-850 border border-soc-750 transition-colors cursor-pointer"
            >
              Client Login
            </button>
            <button
              type="button"
              onClick={onEnterConsole}
              className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>Security Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>THE ZERO-TRUST VOICE REVOLUTION</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Voice Cloning Is No Longer a Trusted Signal.
            </h1>

            <p className="text-base sm:text-lg text-soc-300 leading-relaxed max-w-2xl font-normal">
              Generative AI now clones executive voices with 3 seconds of audio. VoiceShield analyzes voice authenticity, speaker biometrics, conversation intent, and telephony metadata in real time to stop impersonation attacks before wire transfers or credential breaches occur.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 font-mono">
              <button
                type="button"
                onClick={onEnterConsole}
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Launch Security Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#simulator"
                className="px-6 py-3.5 rounded-xl bg-soc-850 hover:bg-soc-800 border border-soc-700 text-soc-200 text-sm font-semibold transition-colors flex items-center justify-center space-x-2 text-center"
              >
                <span>Explore Interactive Demo</span>
              </a>
            </div>

            {/* Enterprise Trust Pills */}
            <div className="pt-6 border-t border-soc-800 flex flex-wrap items-center gap-6 text-xs text-soc-400 font-mono">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Audio Retention Option</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sub-150ms Neural Inference</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>On-Prem &amp; Sovereign Cloud</span>
              </div>
            </div>
          </div>

          {/* Right Product Preview (Live Security Terminal Mock) */}
          <div className="lg:col-span-5">
            <div className="soc-panel p-5 space-y-4 relative group">
              {/* Terminal Top */}
              <div className="flex items-center justify-between border-b border-soc-700/80 pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-500/20" />
                  <span className="font-bold text-soc-100">INTERCEPT IN PROGRESS</span>
                </div>
                <span className="text-soc-400">Trunk SIP-04</span>
              </div>

              {/* Real-time Waveform */}
              <WaveformVisualizer
                isActive={true}
                hasThreat={true}
                channelName="Inbound Executive Wire Line"
              />

              {/* Signals Quick Matrix */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded-lg bg-soc-800/60 border border-soc-700/60">
                  <span className="text-soc-400">Synthetic Vocoder Discrepancy:</span>
                  <span className="text-rose-400 font-bold">84% (Critical)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-soc-800/60 border border-soc-700/60">
                  <span className="text-soc-400">Biometric Reference Match:</span>
                  <span className="text-rose-400 font-bold">34% (Mismatch)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-soc-800/60 border border-soc-700/60">
                  <span className="text-soc-400">Conversational Intent:</span>
                  <span className="text-rose-400 font-bold">Emergency $45k Wire</span>
                </div>
              </div>

              {/* Action Directive */}
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-bold block">
                    Automated Protection Directive
                  </span>
                  <span className="font-bold text-soc-100 text-xs">
                    DO NOT AUTHORIZE // SAFE WORD CHALLENGE REQUIRED
                  </span>
                </div>
                <RiskBadge level="CRITICAL" score={88} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 px-6 border-t border-soc-800 bg-soc-900/60">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">
              The Critical Security Vulnerability
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Traditional Caller Verification Fails
            </h2>
            <p className="text-sm sm:text-base text-soc-300 leading-relaxed">
              For decades, corporate organizations relied on phone numbers and verbal familiarity as proof of identity. Today, bad actors weaponize diffusion-based voice models and SIP caller-ID spoofing to compromise dual-authorization wire protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-soc-850 border border-soc-750 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center font-mono font-bold">
                01
              </div>
              <h3 className="text-base font-bold text-white">Caller ID Spoofing</h3>
              <p className="text-xs text-soc-400 leading-relaxed">
                Wholesale VoIP telephony trunks allow attackers to display legitimate corporate phone numbers on internal call routing displays with zero cryptographic friction.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-soc-850 border border-soc-750 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center font-mono font-bold">
                02
              </div>
              <h3 className="text-base font-bold text-white">Zero-Shot Generative Clones</h3>
              <p className="text-xs text-soc-400 leading-relaxed">
                Using public conference calls, podcasts, or media appearances, attackers synthesize fluent conversational replicas of C-suite executives in minutes.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-soc-850 border border-soc-750 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center font-mono font-bold">
                03
              </div>
              <h3 className="text-base font-bold text-white">Coercive Social Engineering</h3>
              <p className="text-xs text-soc-400 leading-relaxed">
                Attackers exploit artificial urgency (&ldquo;board acquisition deadline&rdquo;) to pressure treasury and helpdesk operators into bypassing standard out-of-band checks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works & 5-Signal Engine */}
      <section id="how-it-works" className="py-20 px-6 border-t border-soc-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">
              Multi-Signal Defense Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              5 Independent Signals. Transparent Risk Fusion.
            </h2>
            <p className="text-sm sm:text-base text-soc-300 leading-relaxed">
              VoiceShield does not rely on a single black-box score. Every audio stream is evaluated simultaneously across five distinct cryptographic and acoustic dimensions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-soc-900 border border-soc-700 space-y-3">
              <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold">
                <Activity className="w-4 h-4" />
                <span>SIGNAL 1 • ACOUSTIC FORENSICS</span>
              </div>
              <h4 className="text-base font-bold text-white">Synthetic Vocoder Detection</h4>
              <p className="text-xs text-soc-400 leading-relaxed">
                Screens audio frames for neural vocoder phase artifacts, unnatural high-frequency harmonic jitter, and synthesis acoustic boundaries.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-soc-900 border border-soc-700 space-y-3">
              <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-bold">
                <Users className="w-4 h-4" />
                <span>SIGNAL 2 • BIOMETRIC MATCH</span>
              </div>
              <h4 className="text-base font-bold text-white">ECAPA-TDNN Speaker Match</h4>
              <p className="text-xs text-soc-400 leading-relaxed">
                Extracts 192-dimensional biometric speaker embeddings in volatile memory and verifies cosine distance against enrolled baseline voiceprints.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-soc-900 border border-soc-700 space-y-3">
              <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>SIGNAL 3 • SEMANTIC ASR</span>
              </div>
              <h4 className="text-base font-bold text-white">Social Engineering &amp; Coercion</h4>
              <p className="text-xs text-soc-400 leading-relaxed">
                Real-time sub-second whisper transcription flags urgent payment directives, password reset demands, and compliance bypass statements.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-soc-900 border border-soc-700 space-y-3">
              <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold">
                <Radio className="w-4 h-4" />
                <span>SIGNAL 4 • TELEPHONY CONTEXT</span>
              </div>
              <h4 className="text-base font-bold text-white">Carrier &amp; STIR/SHAKEN Verification</h4>
              <p className="text-xs text-soc-400 leading-relaxed">
                Correlates SIP origin headers, carrier attestation levels (A vs C), and geographical routing against historical executive call patterns.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-soc-900 border border-soc-700 space-y-3">
              <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs font-bold">
                <Layers className="w-4 h-4" />
                <span>SIGNAL 5 • RISK FUSION</span>
              </div>
              <h4 className="text-base font-bold text-white">Explainable Weighted Fusion</h4>
              <p className="text-xs text-soc-400 leading-relaxed">
                Combines individual vectors into a transparent composite threat score (0-100) with clear mathematical audit trails and zero black-box obscurity.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-soc-900 border border-soc-700 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>ACTIVE MITIGATION</span>
              </div>
              <h4 className="text-base font-bold text-white">Prioritized Prevention Protocols</h4>
              <p className="text-xs text-soc-400 leading-relaxed">
                Guides operators through instant safe word challenges, emergency callback routing, step-up MFA, and transaction queue freezing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulator Section */}
      <section id="simulator" className="py-20 px-6 border-t border-soc-800 bg-soc-900/40">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">
                Interactive Technology Simulator
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Experience Real-Time Threat Analysis
              </h2>
              <p className="text-xs sm:text-sm text-soc-300">
                Toggle between a legitimate CFO call and an active generative voice clone attack.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-soc-850 border border-soc-700">
              <button
                type="button"
                onClick={() => setSimulatorMode("attack")}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer",
                  simulatorMode === "attack"
                    ? "bg-rose-600 text-white"
                    : "text-soc-400 hover:text-white"
                )}
              >
                Simulate Voice Clone Attack
              </button>
              <button
                type="button"
                onClick={() => setSimulatorMode("legitimate")}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer",
                  simulatorMode === "legitimate"
                    ? "bg-emerald-600 text-white"
                    : "text-soc-400 hover:text-white"
                )}
              >
                Simulate Verified Legitimate Call
              </button>
            </div>
          </div>

          {/* Simulator Box */}
          <div className="soc-panel p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-soc-700/80 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-soc-400 block font-bold">
                  Simulated Inbound Call
                </span>
                <h4 className="text-lg font-bold font-mono text-soc-100">
                  {simulatorMode === "attack"
                    ? "Rahul Sharma (Claimed) — +91 98201 44521"
                    : "Sarah Lin (VP Treasury) — +1 (555) 902-8811"}
                </h4>
              </div>

              <RiskBadge
                level={simulatorMode === "attack" ? "CRITICAL" : "LOW"}
                score={simulatorMode === "attack" ? 88 : 12}
                size="lg"
              />
            </div>

            {/* Waveform */}
            <WaveformVisualizer
              isActive={true}
              isSimulated={true}
              hasThreat={simulatorMode === "attack"}
              channelName={
                simulatorMode === "attack"
                  ? "Spoofed VoIP Channel (Diffusion Synthesizer Detected)"
                  : "Verified Corporate Voice Trunk (Natural Acoustics)"
              }
            />

            {/* Real-time Signals Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-1">
                <span className="text-[10px] font-mono text-soc-400 uppercase">Voice Authenticity</span>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold font-mono text-soc-100">
                    {simulatorMode === "attack" ? "84% Anomaly" : "99% Natural"}
                  </span>
                  <span className={simulatorMode === "attack" ? "text-rose-400 text-xs font-mono font-bold" : "text-emerald-400 text-xs font-mono font-bold"}>
                    {simulatorMode === "attack" ? "CRITICAL" : "SAFE"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-1">
                <span className="text-[10px] font-mono text-soc-400 uppercase">Biometric Match</span>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold font-mono text-soc-100">
                    {simulatorMode === "attack" ? "0.34 Sim" : "0.94 Sim"}
                  </span>
                  <span className={simulatorMode === "attack" ? "text-rose-400 text-xs font-mono font-bold" : "text-emerald-400 text-xs font-mono font-bold"}>
                    {simulatorMode === "attack" ? "MISMATCH" : "VERIFIED"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-1">
                <span className="text-[10px] font-mono text-soc-400 uppercase">Conversation Intent</span>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold font-mono text-soc-100 truncate max-w-[150px]">
                    {simulatorMode === "attack" ? "Wire Transfer Demand" : "Quarterly Review"}
                  </span>
                  <span className={simulatorMode === "attack" ? "text-rose-400 text-xs font-mono font-bold" : "text-emerald-400 text-xs font-mono font-bold"}>
                    {simulatorMode === "attack" ? "HIGH COERCION" : "NORMAL"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-1">
                <span className="text-[10px] font-mono text-soc-400 uppercase">Recommended Action</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-soc-100 truncate">
                    {simulatorMode === "attack" ? "VERIFY CALLER" : "CLEAR CALL"}
                  </span>
                  <span className="text-blue-400 text-xs font-mono font-semibold">AUTOMATED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Use Cases */}
      <section id="use-cases" className="py-20 px-6 border-t border-soc-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">
              Deployment Profiles
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Designed for High-Risk Enterprise Operations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-soc-900 border border-soc-700 space-y-4">
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 w-fit">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Treasury &amp; Wire Transfer Desks</h3>
              <p className="text-xs text-soc-400 leading-relaxed">
                Prevents fraudulent multi-million dollar off-ledger wires by embedding zero-trust voice validation prior to payment clearance.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-soc-900 border border-soc-700 space-y-4">
              <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 w-fit">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Executive Family Offices</h3>
              <p className="text-xs text-soc-400 leading-relaxed">
                Protects ultra-high-net-worth individuals and corporate executives from synthetic kidnapping extortion and emergency fund scams.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-soc-900 border border-soc-700 space-y-4">
              <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400 w-fit">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">IT Helpdesk MFA Resets</h3>
              <p className="text-xs text-soc-400 leading-relaxed">
                Neutralizes social engineering attacks that impersonate employees calling corporate service desks to reset Okta/Azure MFA tokens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prevention ROI Calculator */}
      <section className="py-20 px-6 border-t border-soc-800 bg-soc-900/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
              Fraud Prevention Calculator
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Quantify Your Organization&apos;s Risk Exposure
            </h2>
            <p className="text-xs sm:text-sm text-soc-300 leading-relaxed">
              Based on empirical threat telemetry across global financial and enterprise wire desks.
            </p>

            <div className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-soc-300">Annual Monitored Inbound Calls</span>
                  <span className="text-white font-bold">{annualCalls.toLocaleString()} calls</span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={250000}
                  step={5000}
                  value={annualCalls}
                  onChange={(e) => setAnnualCalls(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-soc-300">Average Sensitive Transaction Size</span>
                  <span className="text-white font-bold">${avgWireAmount.toLocaleString()} USD</span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={250000}
                  step={5000}
                  value={avgWireAmount}
                  onChange={(e) => setAvgWireAmount(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 soc-panel space-y-6 text-center">
            <span className="text-xs font-mono text-soc-400 uppercase tracking-wider block">
              Estimated Annual Losses Thwarted
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono text-emerald-400 tracking-tight">
              ${preventedLosses.toLocaleString()}
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-4 border-t border-soc-700/80">
              <div className="p-3 rounded-lg bg-soc-800/60 border border-soc-700/60">
                <span className="text-soc-400 block text-[10px]">Predicted Attack Attempts</span>
                <span className="text-soc-100 font-bold text-base">{estimatedAttacks}/year</span>
              </div>
              <div className="p-3 rounded-lg bg-soc-800/60 border border-soc-700/60">
                <span className="text-soc-400 block text-[10px]">Containment Efficiency</span>
                <span className="text-emerald-400 font-bold text-base">99.4%</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onEnterConsole}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs transition-colors cursor-pointer"
            >
              Protect Your Enterprise Desk Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="architecture" className="py-12 px-6 border-t border-soc-800 bg-soc-950 text-xs font-mono text-soc-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white tracking-wider block">VOICESHIELD</span>
              <span className="text-[10px] text-soc-500">Autonomous Voice Clone Interception</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <span>SOC2 Type II Certified</span>
            <span>GDPR Sovereign Storage</span>
            <span>FIPS 140-3 Encryption</span>
            <span>Zero Voice Persistence</span>
          </div>

          <div className="text-soc-500 text-[10px]">
            © {new Date().getFullYear()} VoiceShield Inc. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Enterprise Login Modal */}
      <ModalDialog
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="VoiceShield Enterprise Sign-In"
        subtitle="Authenticate via corporate SAML / Okta SSO or security credential"
        maxWidth="md"
      >
        <div className="space-y-4 pt-2">
          <button
            type="button"
            onClick={() => {
              setShowLoginModal(false);
              onEnterConsole();
            }}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Continue via Okta Enterprise SSO</span>
          </button>

          <div className="relative flex items-center justify-center py-2">
            <div className="border-t border-soc-700 w-full" />
            <span className="bg-soc-800 px-3 text-[10px] font-mono text-soc-400 uppercase">
              Or Security Key
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowLoginModal(false);
              onEnterConsole();
            }}
            className="space-y-3"
          >
            <div>
              <label className="text-[11px] font-mono text-soc-300 block mb-1">
                Enterprise Email / Operator ID
              </label>
              <input
                type="email"
                defaultValue="analyst@apexbank.com"
                required
                className="w-full px-3 py-2 rounded-lg bg-soc-850 border border-soc-700 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-soc-300 block mb-1">
                Security Passphrase
              </label>
              <input
                type="password"
                defaultValue="••••••••••••••••"
                required
                className="w-full px-3 py-2 rounded-lg bg-soc-850 border border-soc-700 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-soc-750 hover:bg-soc-700 border border-soc-600 text-xs font-mono font-bold text-white transition-colors cursor-pointer"
            >
              Sign In to SOC Console
            </button>
          </form>
        </div>
      </ModalDialog>
    </div>
  );
}
