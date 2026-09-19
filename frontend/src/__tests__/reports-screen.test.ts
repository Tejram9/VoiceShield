import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ReportsScreen } from "../components/reports/reports-screen";

const h = React.createElement;

describe("VoiceShield Reports & Security Insights Screen", () => {
  it("renders header, period filter, and 30-day posture narrative", () => {
    const html = renderToString(h(ReportsScreen));

    expect(html).toContain("Reports &amp; Security Insights");
    expect(html).toContain("Enterprise Telephony Telemetry");
    expect(html).toContain("Last 30 Days");
    expect(html).toContain("Export Briefing (PDF)");

    // Posture Narrative & Capital Figure
    expect(html).toContain("30-DAY POSTURE SUMMARY");
    expect(html).toContain("6 targeted synthetic voice impersonation attacks");
    expect(html).toContain("$185,000 USD");
  });

  it("answers Stage 1: Threat Trajectory & Vulnerability Windows (Understand Trend)", () => {
    const html = renderToString(h(ReportsScreen));

    expect(html).toContain("Threat Trajectory &amp; Vulnerability Windows");
    expect(html).toContain("Security Question: When are adversaries targeting our telephony channels?");
    expect(html).toContain("Monitored Calls");
    expect(html).toContain("Intercepted Clone");
    expect(html).toContain("High-Risk Timing Concentration: Friday Market-Close");
    expect(html).toContain("83% of deepfake impersonations");
  });

  it("answers Stage 2: Synthesis Vectors & Attack Pretexts (Identify Pattern)", () => {
    const html = renderToString(h(ReportsScreen));

    expect(html).toContain("Adversary Voice-Cloning Vectors");
    expect(html).toContain("Zero-Shot Neural Diffusion Clones (XTTS / Bark)");
    expect(html).toContain("66% (4 Attacks)");
    expect(html).toContain("Real-Time Streaming Vocoders (RVC Low-Latency)");
    expect(html).toContain("34% (2 Attacks)");

    // Social Engineering Pretexts
    expect(html).toContain("Common Social Engineering Pretexts");
    expect(html).toContain("Urgent Capital / Escrow Disbursement");
    expect(html).toContain("58%");
    expect(html).toContain("Confidential M&amp;A / Executive Legal NDA");
    expect(html).toContain("Vendor Bank Account &amp; Routing Shift");
  });

  it("answers Stage 3: Verification Outcomes & Prevention Efficacy (Review Impact)", () => {
    const html = renderToString(h(ReportsScreen));

    expect(html).toContain("Verification Outcomes &amp; Capital Protection Efficacy");
    expect(html).toContain("Security Question: How effectively did secondary challenges defend the enterprise?");
    expect(html).toContain("Trusted Cellular Callback");
    expect(html).toContain("100% BLOCKED");
    expect(html).toContain("Pre-Shared Safe Word Vault");
    expect(html).toContain("100% SUCCESS");
    expect(html).toContain("Operational Precision");
    expect(html).toContain("1.8 seconds");
    expect(html).toContain("FP Rate: 0.0%");
  });

  it("answers Stage 4: Proactive Hardening Actions (Take Action)", () => {
    const html = renderToString(h(ReportsScreen));

    expect(html).toContain("Recommended Security Actions &amp; Policy Hardening");
    expect(html).toContain("Mandate Safe Word Enclave for European Operations Signatories");
    expect(html).toContain("Enforce Strict STIR/SHAKEN Level A for Zurich Inbound PBX Gateway");
    expect(html).toContain("Lower Automated Wire Freeze Threshold to $10,000 on Unverified Gateways");
    expect(html).toContain("Configure Identity");
  });
});
