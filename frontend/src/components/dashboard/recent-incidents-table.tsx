"use client";

import React from "react";
import { Incident } from "@/types/dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecentIncidentsTableProps {
  incidents: Incident[];
}

export function RecentIncidentsTable({ incidents }: RecentIncidentsTableProps) {
  const getStatusBadge = (status: Incident["status"]) => {
    switch (status) {
      case "OPEN":
        return <Badge variant="HIGH" className="text-[9px] font-mono">OPEN</Badge>;
      case "UNDER_REVIEW":
        return <Badge variant="MEDIUM" className="text-[9px] font-mono">IN REVIEW</Badge>;
      case "RESOLVED":
        return <Badge variant="LOW" className="text-[9px] font-mono">RESOLVED</Badge>;
      case "DISMISSED":
        return <Badge variant="neutral" className="text-[9px] font-mono">DISMISSED</Badge>;
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900/90">
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            INCIDENT HISTORY CONTEXT
          </CardTitle>
          <span className="text-[10px] font-mono text-slate-400">Past 24 Hours</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[9px]">
              <th className="pb-2 font-semibold">Incident ID</th>
              <th className="pb-2 font-semibold">Time</th>
              <th className="pb-2 font-semibold">Caller Line</th>
              <th className="pb-2 font-semibold">Risk</th>
              <th className="pb-2 font-semibold">Primary Finding</th>
              <th className="pb-2 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {incidents.map((incident) => (
              <tr key={incident.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2 pr-2 font-bold text-slate-200">
                  {incident.id}
                </td>

                <td className="py-2 pr-2 text-slate-400 text-[10px]">
                  {incident.timestamp}
                </td>

                <td className="py-2 pr-2 text-slate-300">
                  {incident.caller}
                </td>

                <td className="py-2 pr-2">
                  <div className="flex items-center space-x-1">
                    <Badge variant={incident.riskLevel} className="text-[9px] font-mono font-bold px-1.5 py-0.2">
                      {incident.riskLevel}
                    </Badge>
                    <span className="text-[10px] text-slate-400">
                      ({incident.riskScore})
                    </span>
                  </div>
                </td>

                <td className="py-2 pr-2 text-slate-300 text-[10px] font-sans">
                  {incident.primaryFinding}
                </td>

                <td className="py-2 text-right">
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
