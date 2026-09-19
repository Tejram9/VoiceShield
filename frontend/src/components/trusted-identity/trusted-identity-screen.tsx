"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Mic,
  Plus,
  Search,
  SlidersHorizontal,
  Phone,
  PhoneCall,
  Smartphone,
  KeyRound,
  X,
  Check,
  RotateCcw,
} from "lucide-react";

export interface TrustedIdentity {
  id: string;
  name: string;
  role: string;
  department: string;
  initials: string;
  clearanceLevel: string;
  phoneNumbers: Array<{
    number: string;
    type: "Cellular" | "Direct Desk" | "PBX";
    isVerified: boolean;
  }>;
  voiceStatus: "ENROLLED" | "PENDING_CALIBRATION" | "NEEDS_RECALIBRATION";
  audioDurationMinutes: number;
  confidenceScore: number;
  lastCalibrationDate: string;
  safeWordStatus: "ACTIVE" | "PENDING_ROTATION" | "UNSET";
  safeWordVaultCode: string;
  allowedMethods: Array<"callback" | "safeword" | "mfa">;
  sensitiveActionPolicy: string;
  policyThresholdAmount: string;
  biometricDetails?: {
    vectorModel: string;
    pitchRange: string;
    formantCentroid: string;
    sampleClarity: string;
  };
}

export const INITIAL_TRUSTED_IDENTITIES: TrustedIdentity[] = [
  {
    id: "ID-EXEC-001",
    name: "Rahul Sharma",
    role: "Chief Financial Officer",
    department: "Corporate Treasury & Finance",
    initials: "RS",
    clearanceLevel: "Level 4 Signatory",
    phoneNumbers: [
      { number: "+91 98765 43210", type: "Cellular", isVerified: true },
      { number: "+91 22 6123 4501", type: "Direct Desk", isVerified: true },
    ],
    voiceStatus: "ENROLLED",
    audioDurationMinutes: 14.5,
    confidenceScore: 98,
    lastCalibrationDate: "Sep 12, 2026 (6 days ago)",
    safeWordStatus: "ACTIVE",
    safeWordVaultCode: "COBALT-ORION-77",
    allowedMethods: ["callback", "safeword", "mfa"],
    sensitiveActionPolicy: "Mandatory out-of-band verification for wire transfers > $10,000 or dual-sign overrides.",
    policyThresholdAmount: "$10,000",
    biometricDetails: {
      vectorModel: "ECAPA-TDNN (512-dim embedding)",
      pitchRange: "98 Hz – 165 Hz (Fundamental F0)",
      formantCentroid: "F1: 520 Hz / F2: 1,680 Hz",
      sampleClarity: "High SNR (34 dB, Studio Mastered)",
    },
  },
  {
    id: "ID-EXEC-002",
    name: "Priya Nair",
    role: "Managing Director & CEO",
    department: "Executive Office",
    initials: "PN",
    clearanceLevel: "Level 5 Signatory",
    phoneNumbers: [
      { number: "+91 91234 56789", type: "Cellular", isVerified: true },
      { number: "+91 22 6123 4500", type: "Direct Desk", isVerified: true },
    ],
    voiceStatus: "ENROLLED",
    audioDurationMinutes: 18.2,
    confidenceScore: 99,
    lastCalibrationDate: "Sep 04, 2026",
    safeWordStatus: "ACTIVE",
    safeWordVaultCode: "AMBER-VALIANT-92",
    allowedMethods: ["callback", "mfa"],
    sensitiveActionPolicy: "Mandatory verification for board authorizations, public disclosures, and asset transfers.",
    policyThresholdAmount: "$25,000",
    biometricDetails: {
      vectorModel: "ECAPA-TDNN (512-dim embedding)",
      pitchRange: "180 Hz – 245 Hz (Fundamental F0)",
      formantCentroid: "F1: 610 Hz / F2: 1,940 Hz",
      sampleClarity: "High SNR (36 dB, Baseline Enrolled)",
    },
  },
  {
    id: "ID-EXEC-003",
    name: "Vikram Malhotra",
    role: "Chief Legal Officer",
    department: "Legal & Regulatory Compliance",
    initials: "VM",
    clearanceLevel: "Level 4 Signatory",
    phoneNumbers: [
      { number: "+91 98111 22334", type: "Cellular", isVerified: true },
    ],
    voiceStatus: "ENROLLED",
    audioDurationMinutes: 11.0,
    confidenceScore: 95,
    lastCalibrationDate: "Aug 28, 2026",
    safeWordStatus: "ACTIVE",
    safeWordVaultCode: "SILVER-AEGIS-44",
    allowedMethods: ["callback", "safeword"],
    sensitiveActionPolicy: "Mandatory verification for litigation settlements and subpoena disclosures.",
    policyThresholdAmount: "$50,000",
    biometricDetails: {
      vectorModel: "ECAPA-TDNN (512-dim embedding)",
      pitchRange: "105 Hz – 175 Hz (Fundamental F0)",
      formantCentroid: "F1: 490 Hz / F2: 1,590 Hz",
      sampleClarity: "High SNR (31 dB, Executive Suite)",
    },
  },
  {
    id: "ID-EXEC-004",
    name: "Sarah Jenkins",
    role: "VP Treasury Operations",
    department: "Global Cash & Disbursements",
    initials: "SJ",
    clearanceLevel: "Level 3 Signatory",
    phoneNumbers: [
      { number: "+1 (555) 019-2834", type: "Cellular", isVerified: true },
    ],
    voiceStatus: "PENDING_CALIBRATION",
    audioDurationMinutes: 4.2,
    confidenceScore: 78,
    lastCalibrationDate: "Yesterday, 14:15 (Partial Ingestion)",
    safeWordStatus: "ACTIVE",
    safeWordVaultCode: "TITAN-ECHO-19",
    allowedMethods: ["safeword", "callback"],
    sensitiveActionPolicy: "Mandatory verification for international payments exceeding $25,000.",
    policyThresholdAmount: "$25,000",
    biometricDetails: {
      vectorModel: "ECAPA-TDNN (Incomplete enrollment)",
      pitchRange: "160 Hz – 220 Hz (Preliminary)",
      formantCentroid: "F1: 580 Hz / F2: 1,820 Hz",
      sampleClarity: "Moderate SNR (25 dB, Additional 6 mins recommended)",
    },
  },
];

export interface TrustedIdentityScreenProps {
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
  className?: string;
}

export function TrustedIdentityScreen({
  activeTab = "settings",
  onNavigateTab,
  className,
}: TrustedIdentityScreenProps) {
  const [identities, setIdentities] = useState<TrustedIdentity[]>(INITIAL_TRUSTED_IDENTITIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ENROLLED" | "PENDING">("ALL");

  // Interactive Modal & Drawer States
  const [inspectingIdentity, setInspectingIdentity] = useState<TrustedIdentity | null>(null);
  const [calibratingIdentity, setCalibratingIdentity] = useState<TrustedIdentity | null>(null);
  const [configuringIdentity, setConfiguringIdentity] = useState<TrustedIdentity | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Identity Form State
  const [newIdentityName, setNewIdentityName] = useState("");
  const [newIdentityRole, setNewIdentityRole] = useState("");
  const [newIdentityPhone, setNewIdentityPhone] = useState("");
  const [newIdentitySafeWord, setNewIdentitySafeWord] = useState("");
  const [newIdentityThreshold, setNewIdentityThreshold] = useState("$10,000");

  // Calibration Flow State
  const [calibrationStep, setCalibrationStep] = useState<"read" | "processing" | "done">("read");

  const filteredIdentities = useMemo(() => {
    return identities.filter((item) => {
      if (statusFilter === "ENROLLED" && item.voiceStatus !== "ENROLLED") return false;
      if (statusFilter === "PENDING" && item.voiceStatus === "ENROLLED") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesRole = item.role.toLowerCase().includes(q);
        const matchesDept = item.department.toLowerCase().includes(q);
        const matchesPhone = item.phoneNumbers.some((p) => p.number.includes(q));
        const matchesPolicy = item.sensitiveActionPolicy.toLowerCase().includes(q);
        return matchesName || matchesRole || matchesDept || matchesPhone || matchesPolicy;
      }
      return true;
    });
  }, [identities, statusFilter, searchQuery]);

  const handleStartCalibration = (identity: TrustedIdentity) => {
    setCalibratingIdentity(identity);
    setCalibrationStep("read");
  };

  const handleCompleteCalibration = () => {
    setCalibrationStep("processing");
    setTimeout(() => {
      if (calibratingIdentity) {
        setIdentities((prev) =>
          prev.map((item) =>
            item.id === calibratingIdentity.id
              ? {
                  ...item,
                  voiceStatus: "ENROLLED",
                  audioDurationMinutes: 15.0,
                  confidenceScore: 98,
                  lastCalibrationDate: "Just now (Calibrated)",
                }
              : item
          )
        );
      }
      setCalibrationStep("done");
    }, 1200);
  };

  const handleAddIdentitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdentityName.trim() || !newIdentityPhone.trim()) return;

    const initials = newIdentityName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const created: TrustedIdentity = {
      id: `ID-EXEC-00${identities.length + 1}`,
      name: newIdentityName.trim(),
      role: newIdentityRole.trim() || "Executive Signatory",
      department: "Corporate Management",
      initials: initials || "EX",
      clearanceLevel: "Level 3 Signatory",
      phoneNumbers: [
        {
          number: newIdentityPhone.trim(),
          type: "Cellular",
          isVerified: true,
        },
      ],
      voiceStatus: "PENDING_CALIBRATION",
      audioDurationMinutes: 0,
      confidenceScore: 0,
      lastCalibrationDate: "Pending Initial Enrollment",
      safeWordStatus: "ACTIVE",
      safeWordVaultCode: newIdentitySafeWord.trim().toUpperCase() || "SHIELD-VAULT-01",
      allowedMethods: ["callback", "safeword"],
      sensitiveActionPolicy: `Mandatory verification for transactions exceeding ${newIdentityThreshold}.`,
      policyThresholdAmount: newIdentityThreshold,
      biometricDetails: {
        vectorModel: "Awaiting audio enrollment",
        pitchRange: "Not calibrated",
        formantCentroid: "Not calibrated",
        sampleClarity: "Pending calibration session",
      },
    };

    setIdentities((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewIdentityName("");
    setNewIdentityRole("");
    setNewIdentityPhone("");
    setNewIdentitySafeWord("");
  };

  return (
    <div className={cn("flex min-h-screen bg-slate-50 text-slate-900 antialiased font-sans", className)}>
      {/* 1. Left Executive Dark Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onNavigateTab}
        hasActiveThreat={false}
      />

      {/* 2. Main Workspace Canvas */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-7 gap-5 overflow-y-auto max-w-[1720px] mx-auto w-full">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Trusted Identities
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-200">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                <span>{identities.length} Registered Baselines</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Executive speaker reference voiceprints and out-of-band verification rules used by VoiceShield real-time defense.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Primary Action: Add Trusted Identity */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="py-2 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Add Trusted Identity</span>
            </button>

            {/* Live Protection Navigation */}
            <button
              type="button"
              onClick={() => onNavigateTab?.("live-protection")}
              className="py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              Live Protection
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SEARCH & FILTER CONTROLS */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/70 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search identities by name, role, phone, or policy..."
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
              Baseline Status:
            </span>
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-medium transition-colors",
                statusFilter === "ALL"
                  ? "bg-slate-900 text-white font-semibold"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              All ({identities.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("ENROLLED")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-medium transition-colors",
                statusFilter === "ENROLLED"
                  ? "bg-slate-900 text-white font-semibold"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              Active ({identities.filter((i) => i.voiceStatus === "ENROLLED").length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("PENDING")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-medium transition-colors",
                statusFilter === "PENDING"
                  ? "bg-slate-900 text-white font-semibold"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              Needs Calibration ({identities.filter((i) => i.voiceStatus !== "ENROLLED").length})
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* IDENTITIES LIST: TRUSTED PERSON → VOICE BASELINE → VERIFICATION RULES */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-4">
          {filteredIdentities.map((identity) => (
            <div
              key={identity.id}
              className="bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-5 hover:border-slate-300 transition-colors"
            >
              {/* 3-Column Structured Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* ------------------------------------------------------------- */}
                {/* 1. TRUSTED PERSON (Name, Role, Verified Numbers, Clearance) */}
                {/* ------------------------------------------------------------- */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {identity.initials}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-bold text-slate-900 tracking-tight">
                          {identity.name}
                        </h2>
                        <span className="px-2 py-0.2 rounded-full text-3xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {identity.clearanceLevel}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {identity.role}
                      </span>
                      <span className="text-2xs text-slate-400">
                        {identity.department}
                      </span>
                    </div>
                  </div>

                  {/* Verified Phone Numbers */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                    <span className="text-3xs font-semibold uppercase tracking-wider text-slate-400">
                      Verified Communication Lines
                    </span>
                    <div className="space-y-1">
                      {identity.phoneNumbers.map((phone, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs font-mono text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"
                        >
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span>{phone.number}</span>
                          </div>
                          <span className="text-3xs font-sans text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            <span>{phone.type}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* 2. VOICE BASELINE (Calibration Status, Audio Duration, Health) */}
                {/* ------------------------------------------------------------- */}
                <div className="lg:col-span-4 flex flex-col gap-3 lg:border-l lg:border-slate-100 lg:pl-5">
                  <div className="flex items-center justify-between">
                    <span className="text-3xs font-semibold uppercase tracking-wider text-slate-400">
                      Voice Baseline Health
                    </span>
                    {identity.voiceStatus === "ENROLLED" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        <span>Enrolled &amp; Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="h-3 w-3 text-amber-600" />
                        <span>Calibration Pending</span>
                      </span>
                    )}
                  </div>

                  {/* Metrics Box */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Calibrated Audio Length:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {`${identity.audioDurationMinutes} mins`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Acoustic Confidence:</span>
                      <span
                        className={cn(
                          "font-mono font-bold",
                          identity.confidenceScore >= 90
                            ? "text-emerald-700"
                            : "text-amber-700"
                        )}
                      >
                        {`${identity.confidenceScore}% match accuracy`}
                      </span>
                    </div>

                    <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-2xs text-slate-500">
                      <span>Last Calibration:</span>
                      <span className="font-medium text-slate-700">
                        {identity.lastCalibrationDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* 3. VERIFICATION RULES (Safe Word, Methods, Sensitive Action Policy) */}
                {/* ------------------------------------------------------------- */}
                <div className="lg:col-span-4 flex flex-col gap-3 lg:border-l lg:border-slate-100 lg:pl-5">
                  <span className="text-3xs font-semibold uppercase tracking-wider text-slate-400">
                    Verification Policy &amp; Safe Word
                  </span>

                  {/* Safe Word & Allowed Methods */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <KeyRound className="h-3.5 w-3.5 text-slate-400" />
                        <span>Pre-Shared Safe Word:</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 text-2xs">
                        {identity.safeWordVaultCode}
                      </span>
                    </div>

                    {/* Sensitive Action Policy */}
                    <div className="p-2.5 rounded-md bg-amber-50/60 border border-amber-200/60 flex flex-col gap-1">
                      <span className="text-3xs font-bold uppercase text-amber-800">
                        Enforced Policy Trigger
                      </span>
                      <p className="text-2xs text-amber-900 leading-normal">
                        {identity.sensitiveActionPolicy}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xs text-slate-400 font-mono">
                    ID: {identity.id}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Primary Action 1: View Profile */}
                  <button
                    type="button"
                    onClick={() => setInspectingIdentity(identity)}
                    className="py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <User className="h-3.5 w-3.5 text-slate-500" />
                    <span>View Profile</span>
                  </button>

                  {/* Primary Action 2: Enroll / Recalibrate Voice */}
                  <button
                    type="button"
                    onClick={() => handleStartCalibration(identity)}
                    className="py-2 px-3 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                  >
                    <Mic className="h-3.5 w-3.5 text-blue-600" />
                    <span>{identity.voiceStatus === "ENROLLED" ? "Recalibrate Voice" : "Enroll Voice Baseline"}</span>
                  </button>

                  {/* Primary Action 3: Configure Verification */}
                  <button
                    type="button"
                    onClick={() => setConfiguringIdentity(identity)}
                    className="py-2 px-3 rounded-lg text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-slate-600" />
                    <span>Configure Verification</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD TRUSTED IDENTITY */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Add Trusted Identity</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddIdentitySubmit} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-700">Executive Full Name</label>
                <input
                  type="text"
                  required
                  value={newIdentityName}
                  onChange={(e) => setNewIdentityName(e.target.value)}
                  placeholder="e.g. Vikram Sen"
                  className="h-9 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-700">Corporate Title &amp; Role</label>
                <input
                  type="text"
                  required
                  value={newIdentityRole}
                  onChange={(e) => setNewIdentityRole(e.target.value)}
                  placeholder="e.g. Chief Operating Officer"
                  className="h-9 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-700">Verified Cellular Phone Line</label>
                <input
                  type="text"
                  required
                  value={newIdentityPhone}
                  onChange={(e) => setNewIdentityPhone(e.target.value)}
                  placeholder="+91 98000 11223"
                  className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-mono focus:outline-none focus:border-blue-500"
                />
                <span className="text-3xs text-slate-400">Used for independent out-of-band callback verification.</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">Pre-Shared Safe Word</label>
                  <input
                    type="text"
                    value={newIdentitySafeWord}
                    onChange={(e) => setNewIdentitySafeWord(e.target.value)}
                    placeholder="e.g. ORION-GOLD-55"
                    className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-mono uppercase focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">Policy Trigger Threshold</label>
                  <input
                    type="text"
                    value={newIdentityThreshold}
                    onChange={(e) => setNewIdentityThreshold(e.target.value)}
                    placeholder="$10,000"
                    className="h-9 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2 px-4 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
                >
                  Save &amp; Enroll Baseline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ENROLL / RECALIBRATE VOICE BASELINE */}
      {/* ========================================================================= */}
      {calibratingIdentity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Mic className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Voice Baseline Calibration</h3>
                  <span className="text-2xs text-slate-500">{calibratingIdentity.name} ({calibratingIdentity.role})</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCalibratingIdentity(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {calibrationStep === "read" && (
              <div className="flex flex-col gap-4 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  Please prompt the executive to read the following reference phrase over a clear corporate line to calibrate acoustic harmonics and fundamental vocal tract frequencies:
                </p>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-serif italic text-sm leading-relaxed text-center">
                  &ldquo;I authorize VoiceShield to generate an acoustic voice baseline for executive verification under enterprise corporate security policy.&rdquo;
                </div>

                <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200/60 flex items-center justify-between text-2xs text-blue-900">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Microphone Signal Clarity: 34 dB (Excellent)</span>
                  </div>
                  <span className="font-mono font-semibold">ECAPA-TDNN Active</span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCalibratingIdentity(null)}
                    className="py-2 px-4 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCompleteCalibration}
                    className="py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Record &amp; Synthesize Baseline</span>
                  </button>
                </div>
              </div>
            )}

            {calibrationStep === "processing" && (
              <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
                <RotateCcw className="h-8 w-8 text-blue-600 animate-spin" />
                <span className="text-sm font-bold text-slate-900">Extracting 512-dim Acoustic Vectors...</span>
                <p className="text-2xs text-slate-500 max-w-xs">
                  Computing Mel-frequency cepstral coefficients and registering vocal tract invariants.
                </p>
              </div>
            )}

            {calibrationStep === "done" && (
              <div className="py-6 flex flex-col items-center justify-center gap-3 text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Voice Baseline Calibrated</h4>
                <p className="text-xs text-slate-600 max-w-xs">
                  Acoustic reference profile successfully generated and committed to the VoiceShield enclave.
                </p>
                <button
                  type="button"
                  onClick={() => setCalibratingIdentity(null)}
                  className="mt-2 py-2 px-6 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CONFIGURE VERIFICATION POLICY */}
      {/* ========================================================================= */}
      {configuringIdentity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Configure Verification Rules</h3>
                  <span className="text-2xs text-slate-500">{configuringIdentity.name}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConfiguringIdentity(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-2">
                <span className="font-semibold text-slate-800">Allowed Out-Of-Band Methods:</span>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <PhoneCall className="h-4 w-4 text-blue-600" />
                      <span>Trusted Cellular Callback</span>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-amber-600" />
                      <span>Pre-Shared Safe Word Challenge</span>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-purple-600" />
                      <span>Hardware Push MFA (FIDO2)</span>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-800">Trigger Threshold</label>
                <input
                  type="text"
                  defaultValue={configuringIdentity.policyThresholdAmount}
                  className="h-9 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
                <span className="text-3xs text-slate-400">Transactions exceeding this value enforce mandatory verification.</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfiguringIdentity(null)}
                  className="py-2 px-4 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setConfiguringIdentity(null)}
                  className="py-2 px-4 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
                >
                  Save Policy Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER: VIEW PROFILE & BIOMETRIC TELEMETRY (PROGRESSIVE DISCLOSURE) */}
      {/* ========================================================================= */}
      {inspectingIdentity && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs transition-opacity"
          onClick={() => setInspectingIdentity(null)}
        >
          <div
            className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 overflow-y-auto animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  EXECUTIVE PROFILE: {inspectingIdentity.id}
                </span>
                <button
                  type="button"
                  onClick={() => setInspectingIdentity(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-12 w-12 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {inspectingIdentity.initials}
                </div>
                <div className="flex flex-col">
                  <h2 className="text-base font-bold text-slate-900">{inspectingIdentity.name}</h2>
                  <span className="text-xs text-slate-500 font-medium">{inspectingIdentity.role}</span>
                  <span className="text-2xs text-slate-400">{inspectingIdentity.department}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col gap-5 overflow-y-auto text-xs">
              {/* Progressive Disclosure: Biometric Details */}
              <div className="flex flex-col gap-2">
                <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                  Acoustic Biometric Telemetry
                </span>
                {inspectingIdentity.biometricDetails ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Vector Architecture:</span>
                      <span className="font-semibold text-slate-800">{inspectingIdentity.biometricDetails.vectorModel}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Fundamental Pitch (F0):</span>
                      <span className="font-mono text-slate-800">{inspectingIdentity.biometricDetails.pitchRange}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Formant Centroids:</span>
                      <span className="font-mono text-slate-800">{inspectingIdentity.biometricDetails.formantCentroid}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Audio Reference Clarity:</span>
                      <span className="text-slate-800 font-medium">{inspectingIdentity.biometricDetails.sampleClarity}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500">No biometric telemetry registered.</p>
                )}
              </div>

              {/* Policy Summary */}
              <div className="flex flex-col gap-2">
                <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                  Active Protection Policy
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Safe Word Vault Code:</span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {inspectingIdentity.safeWordVaultCode}
                    </span>
                  </div>
                  <p className="text-2xs text-slate-600 pt-1">
                    {inspectingIdentity.sensitiveActionPolicy}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setInspectingIdentity(null)}
                className="py-2 px-4 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
