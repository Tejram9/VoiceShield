"use client";

import React, { useState } from "react";
import { MOCK_RECENT_INCIDENTS } from "@/lib/mock-data";
import { Incident } from "@/types/dashboard";
import {
  AlertTriangle,
  Search,
  Lock,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IncidentsViewProps {
  initialIncident?: Incident | null;
  className?: string;
}

export function IncidentsView({ initialIncident = null, className }: IncidentsViewProps) {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_RECENT_INCIDENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    initialIncident || incidents[0]
  );
  const [newNote, setNewNote] = useState("");
  const [containmentMessage, setContainmentMessage] = useState<string | null>(null);

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.caller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.primaryFinding.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || inc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedIncident) return;

    const noteItem = {
      id: `n-${Date.now()}`,
      author: "David Zhao",
      role: "Lead SOC Analyst",
      timestamp: "Just now",
      content: newNote.trim(),
    };

    const updated = {
      ...selectedIncident,
      notes: [noteItem, ...(selectedIncident.notes || [])],
    };

    setSelectedIncident(updated);
    setIncidents(incidents.map((i) => (i.id === updated.id ? updated : i)));
    setNewNote("");
  };

  const handleStatusChange = (newStatus: Incident["status"]) => {
    if (!selectedIncident) return;
    const updated = { ...selectedIncident, status: newStatus };
    setSelectedIncident(updated);
    setIncidents(incidents.map((i) => (i.id === updated.id ? updated : i)));
  };

  const triggerKillSwitch = (actionName: string) => {
    setContainmentMessage(`Kill-Switch Enforced: ${actionName}`);
    if (selectedIncident) {
      const updated: Incident = {
        ...selectedIncident,
        status: "CONTAINED",
        containmentAction: actionName,
      };
      setSelectedIncident(updated);
      setIncidents(incidents.map((i) => (i.id === updated.id ? updated : i)));
    }
    setTimeout(() => setContainmentMessage(null), 3000);
  };

  const getStatusBadge = (status: Incident["status"]) => {
    switch (status) {
      case "OPEN":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">OPEN</span>;
      case "INVESTIGATING":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">INVESTIGATING</span>;
      case "CONTAINED":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">CONTAINED</span>;
      case "RESOLVED":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">RESOLVED</span>;
      case "FALSE_POSITIVE":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-soc-750 text-soc-400 border border-soc-700">FALSE POSITIVE</span>;
    }
  };

  return (
    <div className={cn("space-y-6 max-w-7xl mx-auto font-sans", className)}>
      {/* Header & Controls Bar */}
      <div className="soc-panel p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-mono text-soc-100 tracking-tight">
              Security Operations Incident Center
            </h2>
            <p className="text-xs text-soc-400 font-mono">
              Audited voice cloning investigations, containment actions, and forensic evidence files
            </p>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-soc-500" />
            <input
              type="text"
              placeholder="Search incident, caller, finding..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-soc-800 border border-soc-700 text-xs font-mono text-soc-100 placeholder-soc-500 focus:outline-none focus:border-blue-500 w-52 sm:w-64"
            />
          </div>

          <div className="flex items-center space-x-1 p-1 rounded-lg bg-soc-800 border border-soc-700 text-[10px] font-mono">
            {(["ALL", "OPEN", "INVESTIGATING", "CONTAINED", "RESOLVED"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-2 py-0.5 rounded font-bold transition-colors cursor-pointer",
                  statusFilter === s ? "bg-blue-600 text-white" : "text-soc-400 hover:text-white"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Incident Queue (4 cols) + Active Dossier (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Incident Queue */}
        <div className="lg:col-span-4 soc-panel p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-soc-700/80">
            <span className="text-xs font-mono font-bold uppercase text-soc-300">
              Active Security Cases ({filteredIncidents.length})
            </span>
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredIncidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-all cursor-pointer font-mono text-xs space-y-2",
                    isSelected
                      ? "bg-soc-750 border-blue-500/60 ring-1 ring-blue-500/40 shadow-sm"
                      : "bg-soc-800/60 border-soc-700/60 hover:bg-soc-800 hover:border-soc-600"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-soc-100 tracking-tight">{inc.id}</span>
                    {getStatusBadge(inc.status)}
                  </div>

                  <div>
                    <span className="text-soc-200 font-bold block">{inc.caller}</span>
                    <span className="text-[11px] text-soc-400">{inc.callerNumber}</span>
                  </div>

                  <p className="text-[11px] text-soc-300 line-clamp-2 leading-relaxed">
                    {inc.primaryFinding}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-soc-500 pt-1 border-t border-soc-700/60">
                    <span>{inc.timestamp}</span>
                    <span className="font-bold text-soc-300">Score: {inc.riskScore}/100</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Dossier Detail */}
        {selectedIncident && (
          <div className="lg:col-span-8 soc-panel p-5 sm:p-6 space-y-5 font-mono text-xs">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-soc-700/80">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-soc-100">{selectedIncident.id}</span>
                  <span>•</span>
                  <span className="text-soc-400">{selectedIncident.timestamp}</span>
                  {getStatusBadge(selectedIncident.status)}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-soc-100 mt-1">
                  {selectedIncident.primaryFinding}
                </h3>
              </div>

              {/* Status Update Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-soc-400">Disposition:</span>
                <select
                  value={selectedIncident.status}
                  onChange={(e) => handleStatusChange(e.target.value as Incident["status"])}
                  className="px-2.5 py-1.5 rounded-lg bg-soc-800 border border-soc-700 text-soc-100 text-xs font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="INVESTIGATING">INVESTIGATING</option>
                  <option value="CONTAINED">CONTAINED</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="FALSE_POSITIVE">FALSE POSITIVE</option>
                </select>
              </div>
            </div>

            {/* Notification alert if kill-switch clicked */}
            {containmentMessage && (
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <Lock className="w-4 h-4 text-rose-400" />
                <span>{containmentMessage}</span>
              </div>
            )}

            {/* ── Operational Containment Kill-Switches ────────────────── */}
            <div className="p-4 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-soc-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-400" />
                <span>Enforce Immediate Containment Kill-Switches</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => triggerKillSwitch("Treasury Disbursement Freeze")}
                  className="px-3 py-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-left cursor-pointer transition-colors font-bold"
                >
                  Freeze Wires
                </button>
                <button
                  type="button"
                  onClick={() => triggerKillSwitch("Permanent SIP CLI Blacklist")}
                  className="px-3 py-2 rounded-lg bg-soc-800 hover:bg-soc-750 text-soc-300 border border-soc-700 text-left cursor-pointer transition-colors"
                >
                  Block Number
                </button>
                <button
                  type="button"
                  onClick={() => triggerKillSwitch("Revoke Compromised Voiceprint")}
                  className="px-3 py-2 rounded-lg bg-soc-800 hover:bg-soc-750 text-soc-300 border border-soc-700 text-left cursor-pointer transition-colors"
                >
                  Revoke Voiceprint
                </button>
                <button
                  type="button"
                  onClick={() => triggerKillSwitch("Escalate to Corporate Fraud Desk")}
                  className="px-3 py-2 rounded-lg bg-soc-800 hover:bg-soc-750 text-soc-300 border border-soc-700 text-left cursor-pointer transition-colors"
                >
                  Escalate CISO
                </button>
              </div>
            </div>

            {/* Evidence & Case Summary */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-soc-400">Incident Narrative &amp; Evidence</span>
              <p className="text-soc-200 text-xs sm:text-sm leading-relaxed p-4 rounded-lg bg-soc-800/60 border border-soc-700/60">
                {selectedIncident.summary || "High-confidence synthetic audio clone detected on corporate SIP trunk. Caller impersonated Chief Financial Officer Rahul Sharma and demanded immediate $45,000 disbursement while attempting to bypass safe word confirmation."}
              </p>
            </div>

            {/* Technical Forensic Attributes */}
            {selectedIncident.evidence && (
              <div className="p-4 rounded-lg bg-soc-800/60 border border-soc-700/60 space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase text-soc-400">Forensic Anomaly Log</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-soc-300 pt-1">
                  <div>• Vocoder Anomaly: <strong className="text-rose-400">{selectedIncident.evidence.vocoderDiscrepancies}</strong></div>
                  <div>• Biometric Distance: <strong className="text-rose-400">{selectedIncident.evidence.biometricScore}/100</strong></div>
                  <div>• Carrier Geolocation: <strong className="text-soc-200">{selectedIncident.evidence.callerIpLocation}</strong></div>
                  <div>• Route Attestation: <strong className="text-amber-400">{selectedIncident.evidence.carrierName}</strong></div>
                </div>
              </div>
            )}

            {/* Analyst Investigation Notes Feed */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase text-soc-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Analyst Investigation Notes</span>
              </span>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add analyst observation or containment record..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-lg bg-soc-800 border border-soc-700 text-soc-100 placeholder-soc-500 focus:outline-none focus:border-blue-500 text-xs"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold transition-colors cursor-pointer"
                >
                  Post Note
                </button>
              </form>

              <div className="space-y-2 pt-2">
                {(selectedIncident.notes || [
                  {
                    id: "n-1",
                    author: "David Zhao",
                    role: "Lead SOC Analyst",
                    timestamp: "Today, 18:28 UTC",
                    content: "Confirmed real executive was in transit and never called. Audio phase analysis confirms neural voice conversion. Treasury wire locked.",
                  },
                ]).map((note) => (
                  <div key={note.id} className="p-3 rounded-lg bg-soc-800/50 border border-soc-700/60 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-soc-200">{note.author} ({note.role})</span>
                      <span className="text-soc-500">{note.timestamp}</span>
                    </div>
                    <p className="text-soc-300 text-xs">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
