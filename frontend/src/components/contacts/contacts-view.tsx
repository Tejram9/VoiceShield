"use client";

import React, { useState } from "react";
import { TrustedContact } from "@/types/dashboard";
import { ModalDialog } from "@/components/design-system/modal-dialog";
import {
  Users,
  Plus,
  Mic,
  Eye,
  EyeOff,
  CheckCircle2,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ContactsView() {
  const [contacts, setContacts] = useState<TrustedContact[]>([
    {
      id: "cnt-1",
      name: "Rahul Sharma",
      role: "Chief Financial Officer",
      phone: "+91 98201 44521",
      enrolledDate: "2026-01-15",
      sampleDuration: "30.0s (Calibrated)",
      voiceprintStatus: "VERIFIED",
      embeddingHash: "ecapa_tdnn_94e2b810af",
      safeWordMasked: "••••••••••••",
      safeWordPlain: "COBALT-ORION-77",
      emergencyCallback: "+91 98201 44521",
      verificationPolicy: "Strict Out-of-Band Callback mandatory for off-ledger wires > $10,000",
    },
    {
      id: "cnt-2",
      name: "Arjun Mehta",
      role: "Chief Operating Officer",
      phone: "+91 98111 22334",
      enrolledDate: "2026-02-01",
      sampleDuration: "30.0s (Calibrated)",
      voiceprintStatus: "VERIFIED",
      embeddingHash: "ecapa_tdnn_f1a49938c0",
      safeWordMasked: "••••••••••••",
      safeWordPlain: "NORTHERN-LIGHTS-42",
      emergencyCallback: "+91 98111 99887",
      verificationPolicy: "Safe Word Challenge required for treasury adjustments",
    },
    {
      id: "cnt-3",
      name: "Rachel Vance",
      role: "VP Treasury & Risk",
      phone: "+1 (555) 604-1188",
      enrolledDate: "2026-02-18",
      sampleDuration: "30.0s (Calibrated)",
      voiceprintStatus: "VERIFIED",
      embeddingHash: "ecapa_tdnn_83d0471b9e",
      safeWordMasked: "••••••••••••",
      safeWordPlain: "TITAN-ECHO-19",
      emergencyCallback: "+1 (555) 604-1188",
      verificationPolicy: "Dual-operator approval for SWIFT wire requests",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [revealedSafeWordId, setRevealedSafeWordId] = useState<string | null>(null);

  // Enrollment Wizard Modal State
  const [showEnrollWizard, setShowEnrollWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newSafeWord, setNewSafeWord] = useState("");
  const [newCallback, setNewCallback] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingSuccess, setRecordingSuccess] = useState(false);

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    const interval = setInterval(() => {
      setRecordingSeconds((prev) => {
        if (prev >= 10) {
          clearInterval(interval);
          setIsRecording(false);
          setRecordingSuccess(true);
          return 10;
        }
        return prev + 1;
      });
    }, 400);
  };

  const handleFinishEnrollment = () => {
    const newContact: TrustedContact = {
      id: `cnt-${Date.now()}`,
      name: newName,
      role: newRole,
      phone: newPhone,
      enrolledDate: "Today",
      sampleDuration: "30.0s (Calibrated)",
      voiceprintStatus: "VERIFIED",
      embeddingHash: `ecapa_tdnn_${Math.random().toString(16).slice(2, 12)}`,
      safeWordMasked: "••••••••••••",
      safeWordPlain: newSafeWord || "ALPHA-SUMMIT-99",
      emergencyCallback: newCallback || newPhone,
      verificationPolicy: "Strict Out-of-Band Callback for transactions > $10,000",
    };

    setContacts([newContact, ...contacts]);
    setShowEnrollWizard(false);
    setWizardStep(1);
    setNewName("");
    setNewRole("");
    setNewPhone("");
    setNewSafeWord("");
    setNewCallback("");
    setRecordingSuccess(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header & Controls */}
      <div className="soc-panel p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-mono text-soc-100 tracking-tight">
                Trusted Identity Vault &amp; Voiceprints
              </h2>
              <p className="text-xs text-soc-400 font-mono">
                Cryptographic directory of enrolled executive voiceprints, safe words, and verification policies
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setWizardStep(1);
              setShowEnrollWizard(true);
            }}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-sm self-start md:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Trusted Executive</span>
          </button>
        </div>

        {/* Why this setting exists explanation */}
        <div className="p-3.5 rounded-lg bg-soc-800/60 border border-soc-700/60 text-xs font-mono text-soc-300 space-y-1 leading-relaxed">
          <strong className="text-soc-100 block">Why the Trusted Vault Exists:</strong>
          VoiceShield compares live inbound audio against these cryptographically signed reference voiceprints (SpeechBrain ECAPA-TDNN 192-dim x-vectors). When voice similarity or conversation risk diverges, the system enforces the contact&apos;s specific policy (e.g. mandatory cellular callback or safe word challenge).
        </div>
      </div>

      {/* Directory Table Card */}
      <div className="soc-panel overflow-hidden">
        <div className="p-4 border-b border-soc-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-soc-500" />
            <input
              type="text"
              placeholder="Search executive, role, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-soc-800 border border-soc-700 text-xs text-soc-100 placeholder-soc-500 focus:outline-none focus:border-blue-500 w-52 sm:w-64"
            />
          </div>
          <span className="text-soc-400 text-[11px]">
            {filteredContacts.length} Enrolled Profiles
          </span>
        </div>

        <div className="divide-y divide-soc-700/60 font-mono text-xs">
          {filteredContacts.map((c) => {
            const isRevealed = revealedSafeWordId === c.id;

            return (
              <div key={c.id} className="p-4 sm:p-5 hover:bg-soc-800/40 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-soc-800 border border-soc-700 flex items-center justify-center text-soc-200 font-bold">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-soc-100 text-sm">{c.name}</span>
                        <span className="px-2 py-0.5 rounded bg-soc-800 text-soc-300 border border-soc-700 text-[10px]">
                          {c.role}
                        </span>
                      </div>
                      <span className="text-soc-400 text-xs">{c.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-start sm:self-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {c.voiceprintStatus} ({c.sampleDuration})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-soc-300 text-xs">
                  <div className="p-3 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-1">
                    <span className="text-[10px] text-soc-500 uppercase font-bold block">Biometric Embedding Hash</span>
                    <span className="text-soc-200 font-mono">{c.embeddingHash}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-soc-500 uppercase font-bold">Pre-Shared Safe Word</span>
                      <button
                        type="button"
                        onClick={() => setRevealedSafeWordId(isRevealed ? null : c.id)}
                        className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                      >
                        {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{isRevealed ? "Hide" : "Reveal"}</span>
                      </button>
                    </div>
                    <span className="font-bold text-amber-400">
                      {isRevealed ? c.safeWordPlain : c.safeWordMasked}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-1">
                    <span className="text-[10px] text-soc-500 uppercase font-bold block">Enforced Policy</span>
                    <span className="text-soc-200 leading-snug">{c.verificationPolicy}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3-STEP BIOMETRIC ENROLLMENT WIZARD MODAL ───────────────────── */}
      <ModalDialog
        isOpen={showEnrollWizard}
        onClose={() => setShowEnrollWizard(false)}
        title="Biometric Voiceprint Enrollment Wizard"
        maxWidth="xl"
      >
        <div className="space-y-5 font-mono text-xs">
          {/* Step Indicator */}
          <div className="flex items-center justify-between border-b border-soc-700 pb-3">
            {[
              { num: 1, label: "Identity" },
              { num: 2, label: "Voice Sample" },
              { num: 3, label: "Policy & Safe Word" },
            ].map((s) => (
              <div key={s.num} className="flex items-center space-x-2">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px]",
                    wizardStep === s.num
                      ? "bg-blue-600 text-white"
                      : wizardStep > s.num
                      ? "bg-emerald-600 text-white"
                      : "bg-soc-750 text-soc-400"
                  )}
                >
                  {wizardStep > s.num ? "✓" : s.num}
                </div>
                <span className={wizardStep === s.num ? "text-white font-bold" : "text-soc-400"}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Executive Info */}
          {wizardStep === 1 && (
            <div className="space-y-3">
              <div>
                <label className="text-soc-300 block mb-1">Executive Full Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Vikram Malhotra"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-soc-850 border border-soc-700 text-white"
                />
              </div>

              <div>
                <label className="text-soc-300 block mb-1">Organizational Role:</label>
                <input
                  type="text"
                  placeholder="e.g. Chief Executive Officer"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-soc-850 border border-soc-700 text-white"
                />
              </div>

              <div>
                <label className="text-soc-300 block mb-1">Verified Corporate Mobile Phone:</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98201 00000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-soc-850 border border-soc-700 text-white"
                />
              </div>

              <button
                type="button"
                disabled={!newName || !newPhone}
                onClick={() => setWizardStep(2)}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold transition-colors mt-2 cursor-pointer"
              >
                Proceed to Voice Recording Step
              </button>
            </div>
          )}

          {/* Step 2: Live Voice Sample Recording */}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-soc-850 border border-soc-700 space-y-2">
                <span className="text-[11px] text-soc-400 block font-bold">Standard Calibration Script:</span>
                <p className="text-soc-100 italic leading-relaxed text-xs">
                  &ldquo;I hereby authorize VoiceShield to generate a reference biometric embedding of my vocal tract. This cryptographic voiceprint will authenticate sensitive authorizations and prevent impersonation attacks.&rdquo;
                </p>
              </div>

              <div className="p-5 rounded-xl bg-soc-850 border border-soc-700 text-center space-y-3">
                <button
                  type="button"
                  disabled={isRecording || recordingSuccess}
                  onClick={handleStartRecording}
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center mx-auto transition-all cursor-pointer",
                    isRecording
                      ? "bg-rose-600 text-white animate-pulse"
                      : recordingSuccess
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-500"
                  )}
                >
                  <Mic className="w-6 h-6" />
                </button>

                <div>
                  <span className="font-bold text-white block">
                    {isRecording
                      ? `Recording Audio (${recordingSeconds}s / 10s)...`
                      : recordingSuccess
                      ? "Voice Sample Successfully Calibrated (192-dim x-vector)"
                      : "Click to Record Calibration Audio"}
                  </span>
                  <span className="text-[11px] text-soc-400">
                    Input Quality: 16kHz Mono · Ambient Noise: -54 dB
                  </span>
                </div>
              </div>

              <div className="flex justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="px-4 py-2 rounded-lg bg-soc-750 text-soc-300 hover:text-white cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!recordingSuccess}
                  onClick={() => setWizardStep(3)}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold cursor-pointer"
                >
                  Continue to Safe Word &amp; Policy
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Policy & Safe Word */}
          {wizardStep === 3 && (
            <div className="space-y-3">
              <div>
                <label className="text-soc-300 block mb-1">Pre-Shared Verbal Safe Word:</label>
                <input
                  type="text"
                  placeholder="e.g. TITAN-ORION-99"
                  value={newSafeWord}
                  onChange={(e) => setNewSafeWord(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-soc-850 border border-soc-700 text-white font-mono uppercase"
                />
              </div>

              <div>
                <label className="text-soc-300 block mb-1">Emergency Out-of-Band Callback Device:</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98201 00000"
                  value={newCallback}
                  onChange={(e) => setNewCallback(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-soc-850 border border-soc-700 text-white"
                />
              </div>

              <div className="flex justify-between gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-4 py-2 rounded-lg bg-soc-750 text-soc-300 hover:text-white cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinishEnrollment}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                >
                  Save &amp; Activate Enrolled Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </ModalDialog>
    </div>
  );
}
