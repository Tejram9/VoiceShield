"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, PhoneCall, Filter, User, Clock, ArrowRight } from "lucide-react";
import type { LiveCall } from "@/types/dashboard";

interface LiveCallsViewProps {
  currentCall: LiveCall;
  onInspectCall: () => void;
}

interface TelephonyChannel {
  id: string;
  channelName: string;
  callerName: string;
  callerNumber: string;
  duration: string;
  status: "ACTIVE" | "STANDBY" | "MONITORING";
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  isCurrentSession?: boolean;
}

export function LiveCallsView({ currentCall, onInspectCall }: LiveCallsViewProps) {
  const [filter, setFilter] = useState<string>("ALL");

  const channels: TelephonyChannel[] = [
    {
      id: currentCall.sessionId || "channel-01",
      channelName: "Channel 01 — Primary Voice Trunk",
      callerName: currentCall.callerName || "Alex Turner",
      callerNumber: currentCall.callerNumber || "+1 (555) 234-8901",
      duration: currentCall.duration || "02:45",
      status: "ACTIVE",
      riskScore: currentCall.overallRiskScore,
      riskLevel: currentCall.riskLevel,
      isCurrentSession: true,
    },
    {
      id: "channel-02",
      channelName: "Channel 02 — Executive Wire Desk",
      callerName: "Sarah Lin (CFO)",
      callerNumber: "+1 (555) 902-8811",
      duration: "06:12",
      status: "MONITORING",
      riskScore: 14,
      riskLevel: "LOW",
    },
    {
      id: "channel-03",
      channelName: "Channel 03 — IT Helpdesk Trunk",
      callerName: "Marcus Wright (Legal)",
      callerNumber: "+1 (555) 334-0099",
      duration: "01:05",
      status: "MONITORING",
      riskScore: 48,
      riskLevel: "MEDIUM",
    },
  ];

  const filteredChannels = channels.filter((c) => {
    if (filter === "ALL") return true;
    return c.riskLevel === filter;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">Active Telephony Trunks</h2>
              <p className="text-xs text-[#64748B]">
                Real-time audio streams monitored by the AI spoof detection pipeline
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#64748B] flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                filter === lvl
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-[#64748B] hover:text-slate-900 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Trunks Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredChannels.map((ch) => {
          const isHigh = ch.riskLevel === "HIGH";
          const isMed = ch.riskLevel === "MEDIUM";

          return (
            <Card
              key={ch.id}
              className={`transition-all duration-300 hover:-translate-y-0.5 shadow-sm rounded-2xl bg-white ${
                ch.isCurrentSession 
                  ? "border-blue-500 shadow-md ring-1 ring-blue-500/30" 
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Channel Details */}
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-center ${
                      isHigh
                        ? "bg-rose-100 border-rose-200 text-rose-600"
                        : isMed
                        ? "bg-amber-100 border-amber-200 text-amber-600"
                        : "bg-emerald-100 border-emerald-200 text-emerald-600"
                    }`}
                  >
                    <PhoneCall className="w-5 h-5" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-sm font-bold text-[#0F172A]">{ch.channelName}</span>
                      {ch.isCurrentSession && (
                        <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          Active Console
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                          ch.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-[#64748B] border-slate-200"
                        }`}
                      >
                        {ch.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B]">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#64748B]" />
                        <strong className="text-[#0F172A] font-medium">{ch.callerName}</strong> ({ch.callerNumber})
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                        <span className="font-mono">Duration: {ch.duration}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Risk Score & Actions */}
                <div className="flex items-center justify-between md:justify-end space-x-5 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#64748B] block">
                      Assessed Threat
                    </span>
                    <div className="flex items-baseline space-x-1.5">
                      <span
                        className={`text-2xl font-bold font-mono ${
                          isHigh ? "text-rose-600" : isMed ? "text-amber-600" : "text-emerald-600"
                        }`}
                      >
                        {ch.riskScore}
                      </span>
                      <span className="text-xs text-[#64748B] font-mono">/ 100</span>
                      <Badge variant={ch.riskLevel} className="text-[10px] font-mono ml-1">
                        {ch.riskLevel}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={onInspectCall}
                      className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
                    >
                      <span>Inspect Live</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
