"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Search, ShieldAlert, Clock, Eye, X } from "lucide-react";
import { MOCK_RECENT_INCIDENTS } from "@/lib/mock-data";
import type { Incident } from "@/types/dashboard";

export function IncidentsView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const filteredIncidents = MOCK_RECENT_INCIDENTS.filter((inc) => {
    const matchesSearch =
      inc.caller.toLowerCase().includes(search.toLowerCase()) ||
      inc.primaryFinding.toLowerCase().includes(search.toLowerCase()) ||
      inc.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || inc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-200 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">Security Incident Dossiers</h2>
              <p className="text-xs text-[#64748B]">
                Audited voice impersonation attempts, synthetic speech triggers &amp; forensics
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search incidents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-44 sm:w-56 font-mono"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-full border border-slate-200">
            {(["ALL", "OPEN", "UNDER_REVIEW", "RESOLVED"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incidents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIncidents.map((inc) => {
          return (
            <Card
              key={inc.id}
              className="border border-slate-200 bg-white hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer rounded-2xl shadow-sm"
              onClick={() => setSelectedIncident(inc)}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    {inc.id}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Badge variant={inc.riskLevel} className="text-[10px] font-mono">
                      {inc.riskLevel} ({inc.riskScore})
                    </Badge>
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {inc.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] tracking-tight">{inc.caller}</h4>
                  <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                    {inc.primaryFinding}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-[#64748B] font-mono">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Detected {inc.timestamp}
                  </span>
                  <span className="text-blue-600 font-semibold flex items-center gap-1 hover:text-blue-700 transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                    Inspect Details
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Forensic Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-slate-200 bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setSelectedIncident(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-rose-100 border border-rose-200 text-rose-600">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Forensic Audit Dossier</h3>
                <span className="font-mono text-xs text-blue-600">{selectedIncident.id}</span>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-[#64748B] font-mono">Suspect Caller:</span>
                <span className="text-[#0F172A] font-semibold">{selectedIncident.caller}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-[#64748B] font-mono">Threat Level:</span>
                <span className="text-rose-600 font-mono font-bold">{selectedIncident.riskLevel} (Score: {selectedIncident.riskScore}/100)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-[#64748B] font-mono">Detection Mechanism:</span>
                <span className="text-blue-700 font-mono text-[11px]">Wav2Vec2 Spoof Classifier + ECAPA-TDNN</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#64748B] font-mono">Audit Status:</span>
                <span className="text-amber-700 font-mono font-semibold">{selectedIncident.status}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#64748B]">Analysis Summary</span>
              <p className="text-xs text-[#475569] leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                {selectedIncident.primaryFinding}. Deep acoustic phase anomaly detected with high confidence vocoder artifacts.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
