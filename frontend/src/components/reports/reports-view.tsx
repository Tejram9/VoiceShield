"use client";

import React, { useState } from "react";
import { MOCK_THREAT_DISTRIBUTION } from "@/lib/mock-data";
import {
  BarChart3,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ReportsView() {
  const [reportRange, setReportRange] = useState<"7d" | "30d" | "90d">("30d");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="soc-panel p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-mono text-soc-100 tracking-tight">
                Executive Threat Analytics &amp; Compliance Audit
              </h2>
              <p className="text-xs text-soc-400 font-mono">
                Quarterly risk reports, prevented fraud values, and model detection efficacy
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-1 p-1 rounded-lg bg-soc-800 border border-soc-700 text-xs font-mono">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReportRange(r)}
                className={cn(
                  "px-2.5 py-1 rounded font-bold transition-colors cursor-pointer",
                  reportRange === r ? "bg-blue-600 text-white" : "text-soc-400 hover:text-white"
                )}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-lg bg-soc-800 hover:bg-soc-750 border border-soc-700 text-xs font-mono font-bold text-soc-100 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>{downloadSuccess ? "Report Exported" : "Export CSV"}</span>
          </button>
        </div>
      </div>

      {/* Top Executive Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="soc-panel p-4 sm:p-5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-soc-400">Total Scanned Audio Hours</span>
          <div className="text-2xl font-bold font-mono text-soc-100">418.5 hrs</div>
          <span className="text-[10px] font-mono text-emerald-400">+8.2% vs prior period</span>
        </div>

        <div className="soc-panel p-4 sm:p-5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-soc-400">Impersonation Attack Attempts</span>
          <div className="text-2xl font-bold font-mono text-rose-400">18 Incidents</div>
          <span className="text-[10px] font-mono text-soc-400">100% Intercepted</span>
        </div>

        <div className="soc-panel p-4 sm:p-5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-soc-400">Average Detection Latency</span>
          <div className="text-2xl font-bold font-mono text-soc-100">142 ms</div>
          <span className="text-[10px] font-mono text-emerald-400">Sub-second neural response</span>
        </div>

        <div className="soc-panel p-4 sm:p-5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-soc-400">Thwarted Financial Loss</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">$620,000</div>
          <span className="text-[10px] font-mono text-soc-400">Dual-custody preserved</span>
        </div>
      </div>

      {/* Charts & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Threat Vector Breakdown */}
        <div className="lg:col-span-6 soc-panel p-4 sm:p-5 space-y-5">
          <div className="border-b border-soc-700/80 pb-3">
            <h3 className="text-sm font-bold text-soc-100 font-mono uppercase tracking-wider">
              Attack Methodologies &amp; Threat Vectors
            </h3>
            <p className="text-[11px] text-soc-400 font-mono">
              Distribution of incoming voice fraud techniques observed across corporate PBX trunks
            </p>
          </div>

          <div className="space-y-4">
            {MOCK_THREAT_DISTRIBUTION.map((item) => (
              <div key={item.category} className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-soc-200">{item.category}</span>
                  <span className="text-soc-100 font-bold">{item.percentage}% ({item.count} attacks)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-soc-850 overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Outcome Disposition */}
        <div className="lg:col-span-6 soc-panel p-4 sm:p-5 space-y-5">
          <div className="border-b border-soc-700/80 pb-3">
            <h3 className="text-sm font-bold text-soc-100 font-mono uppercase tracking-wider">
              Incident Containment Outcomes
            </h3>
            <p className="text-[11px] text-soc-400 font-mono">
              Resolution metrics for flagged high-risk telephony streams
            </p>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3.5 rounded-lg bg-soc-800/60 border border-soc-700/60 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-soc-100">Call Intercepted &amp; Wire Frozen</span>
                <p className="text-[11px] text-soc-400">Out-of-band safe word failed; call terminated.</p>
              </div>
              <span className="text-rose-400 font-bold text-sm">65% (12 calls)</span>
            </div>

            <div className="p-3.5 rounded-lg bg-soc-800/60 border border-soc-700/60 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-soc-100">Challenged &amp; Authenticated</span>
                <p className="text-[11px] text-soc-400">Caller successfully passed secondary callback verification.</p>
              </div>
              <span className="text-emerald-400 font-bold text-sm">25% (4 calls)</span>
            </div>

            <div className="p-3.5 rounded-lg bg-soc-800/60 border border-soc-700/60 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-soc-100">False Positive (Environmental Noise)</span>
                <p className="text-[11px] text-soc-400">Airport acoustics; re-calibrated baseline profile.</p>
              </div>
              <span className="text-soc-400 font-bold text-sm">10% (2 calls)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
