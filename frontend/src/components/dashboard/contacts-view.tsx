"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Plus, Mic, CheckCircle2, X, UploadCloud, Search } from "lucide-react";

interface TrustedContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  enrolledDate: string;
  sampleDuration: string;
  voiceprintStatus: "VERIFIED" | "PENDING_ENROLLMENT" | "REQUIRES_UPDATE";
  embeddingHash: string;
}

const INITIAL_CONTACTS: TrustedContact[] = [
  {
    id: "cnt-1",
    name: "Alex Turner",
    role: "Executive Director",
    phone: "+1 (555) 234-8901",
    enrolledDate: "Aug 14, 2026",
    sampleDuration: "30.4s",
    voiceprintStatus: "VERIFIED",
    embeddingHash: "ecapa_tdnn_9f82ab11",
  },
  {
    id: "cnt-2",
    name: "Sarah Lin",
    role: "Chief Financial Officer",
    phone: "+1 (555) 902-8811",
    enrolledDate: "Jul 28, 2026",
    sampleDuration: "45.0s",
    voiceprintStatus: "VERIFIED",
    embeddingHash: "ecapa_tdnn_33cc092b",
  },
  {
    id: "cnt-3",
    name: "Marcus Wright",
    role: "Lead Legal Counsel",
    phone: "+1 (555) 334-0099",
    enrolledDate: "Sep 01, 2026",
    sampleDuration: "24.2s",
    voiceprintStatus: "VERIFIED",
    embeddingHash: "ecapa_tdnn_7811ef44",
  },
  {
    id: "cnt-4",
    name: "Elena Rostova",
    role: "VP Global Operations",
    phone: "+1 (555) 678-1234",
    enrolledDate: "Pending",
    sampleDuration: "0.0s",
    voiceprintStatus: "PENDING_ENROLLMENT",
    embeddingHash: "unregistered",
  },
];

export function ContactsView() {
  const [contacts, setContacts] = useState<TrustedContact[]>(INITIAL_CONTACTS);
  const [search, setSearch] = useState("");
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  // New enrollment form state
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newRole || !newPhone) return;

    setIsEnrolling(true);
    setTimeout(() => {
      const newContact: TrustedContact = {
        id: `cnt-${Date.now()}`,
        name: newName,
        role: newRole,
        phone: newPhone,
        enrolledDate: "Today",
        sampleDuration: "15.0s",
        voiceprintStatus: "VERIFIED",
        embeddingHash: `ecapa_tdnn_${Math.random().toString(16).slice(2, 10)}`,
      };
      setContacts([newContact, ...contacts]);
      setIsEnrolling(false);
      setEnrollSuccess(true);
      setTimeout(() => {
        setEnrollSuccess(false);
        setShowEnrollModal(false);
        setNewName("");
        setNewRole("");
        setNewPhone("");
      }, 1200);
    }, 1000);
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">Trusted Biometric Directory</h2>
              <p className="text-xs text-[#64748B]">
                Enrolled biometric voiceprints used for real-time ECAPA-TDNN speaker verification
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-44 sm:w-56 font-mono"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowEnrollModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer min-h-[44px] hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Voiceprint</span>
          </button>
        </div>
      </div>

      {/* Contacts Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredContacts.map((contact) => {
          const isVerified = contact.voiceprintStatus === "VERIFIED";

          return (
            <Card
              key={contact.id}
              className="border border-slate-200 bg-white hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 rounded-2xl shadow-sm"
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {contact.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A] tracking-tight">{contact.name}</h4>
                      <p className="text-xs text-[#64748B]">{contact.role}</p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border ${
                      isVerified
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {isVerified ? <CheckCircle2 className="w-3 h-3" /> : null}
                    {contact.voiceprintStatus.replace("_", " ")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] block">Registered Line:</span>
                    <span className="font-mono text-[#0F172A] font-medium">{contact.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] block">Enrolled Date:</span>
                    <span className="text-[#475569] font-medium">{contact.enrolledDate}</span>
                  </div>
                  <div className="col-span-2 pt-1.5 border-t border-slate-200">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] block">ECAPA-TDNN Embedding:</span>
                    <span className="font-mono text-[11px] text-blue-700 font-semibold">{contact.embeddingHash}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Voice Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowEnrollModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Enroll Biometric Profile</h3>
                <p className="text-xs text-[#64748B]">Capture 16kHz audio sample for speaker baseline</p>
              </div>
            </div>

            {enrollSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#0F172A]">Voiceprint Successfully Enrolled</h4>
                <p className="text-xs text-[#64748B] font-mono">192-dim ECAPA-TDNN embedding generated and stored.</p>
              </div>
            ) : (
              <form onSubmit={handleEnroll} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Sterling"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 mb-1">Executive Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VP Treasury & Finance"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-blue-300 text-center space-y-1.5 cursor-pointer hover:border-blue-500 hover:bg-slate-100 transition-all">
                  <UploadCloud className="w-5 h-5 text-blue-600 mx-auto" />
                  <p className="text-xs font-semibold text-[#0F172A]">Upload 16kHz WAV Sample or Record via Mic</p>
                  <p className="text-[10px] text-[#64748B] font-mono">Minimum 10 seconds of clear speech required</p>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEnrollModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 cursor-pointer min-h-[44px] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isEnrolling}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-sm disabled:opacity-50 cursor-pointer min-h-[44px] transition-all"
                  >
                    {isEnrolling ? "Generating Embedding..." : "Generate Voiceprint"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
