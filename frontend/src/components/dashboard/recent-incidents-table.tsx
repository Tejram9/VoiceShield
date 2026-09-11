"use client";

import React from "react";
import { Incident } from "@/types/dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Clock } from "lucide-react";

interface RecentIncidentsTableProps {
  incidents: Incident[];
}

export function RecentIncidentsTable({ incidents }: RecentIncidentsTableProps) {
  const getStatusBadge = (status: Incident["status"]) => {
    switch (status) {
      case "OPEN":
        return (
          <Badge variant="HIGH" className="text-[10px] font-mono tracking-wider font-semibold border-rose-200 bg-rose-50 text-rose-700">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse mr-1.5" />
            OPEN
          </Badge>
        );
      case "UNDER_REVIEW":
        return (
          <Badge variant="MEDIUM" className="text-[10px] font-mono tracking-wider font-semibold border-amber-200 bg-amber-50 text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            IN REVIEW
          </Badge>
        );
      case "RESOLVED":
        return (
          <Badge variant="LOW" className="text-[10px] font-mono tracking-wider font-semibold border-emerald-200 bg-emerald-50 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            RESOLVED
          </Badge>
        );
      case "DISMISSED":
        return (
          <Badge variant="neutral" className="text-[10px] font-mono tracking-wider font-semibold border-slate-200 bg-slate-100 text-slate-600">
            DISMISSED
          </Badge>
        );
    }
  };

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all duration-300 shadow-sm">
      <CardHeader className="pb-3 pt-5 px-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            <CardTitle className="text-xs font-mono uppercase tracking-[0.1em] text-[#0F172A]">
              Incident History Telemetry
            </CardTitle>
          </div>
          <span className="text-[10px] font-mono font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Past 24 Hours
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-2 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[#64748B] uppercase tracking-[0.1em] font-mono text-[10px]">
              <th className="py-3 font-semibold">Incident ID</th>
              <th className="py-3 font-semibold">Timestamp</th>
              <th className="py-3 font-semibold">Caller Line</th>
              <th className="py-3 font-semibold">Risk Level</th>
              <th className="py-3 font-semibold">Primary Finding</th>
              <th className="py-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {incidents.map((incident) => (
              <tr key={incident.id} className="hover:bg-slate-50 transition-colors group">
                <td className="py-3 pr-2 font-mono font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                  {incident.id}
                </td>

                <td className="py-3 pr-2 text-[#64748B] font-mono text-[11px]">
                  {incident.timestamp}
                </td>

                <td className="py-3 pr-2 text-[#0F172A] font-medium">
                  {incident.caller}
                </td>

                <td className="py-3 pr-2">
                  <div className="flex items-center space-x-1.5">
                    <Badge variant={incident.riskLevel} className="text-[10px] font-mono font-bold px-2 py-0.5">
                      {incident.riskLevel}
                    </Badge>
                    <span className="text-[11px] text-[#64748B] font-mono">
                      ({incident.riskScore})
                    </span>
                  </div>
                </td>

                <td className="py-3 pr-2 text-[#475569]">
                  {incident.primaryFinding}
                </td>

                <td className="py-3 text-right">
                  {getStatusBadge(incident.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
