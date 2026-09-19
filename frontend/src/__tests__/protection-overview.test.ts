import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ProtectionOverviewScreen } from "../components/protection-overview/protection-overview-screen";

const h = React.createElement;

describe("VoiceShield Protection Overview Screen", () => {
  it("renders header with protection active status", () => {
    const html = renderToString(h(ProtectionOverviewScreen));

    expect(html).toContain("Protection Overview");
    expect(html).toContain("Protection Active");
    expect(html).toContain("Real-time Defense Online");
    expect(html).toContain("Live Protection Console");
  });

  it("answers Question 1: Is VoiceShield protecting the environment? (Protection Status)", () => {
    const html = renderToString(h(ProtectionOverviewScreen));

    expect(html).toContain("PROTECTION STATUS");
    expect(html).toContain("All Enclaves Operational");
    expect(html).toContain("VoiceShield Active Defense Is Protecting Enterprise Telephony");
    expect(html).toContain("3/3 Trunks Active");
    expect(html).toContain("4 Active Reference Profiles");
    expect(html).toContain("Policy 4.1 Enforced");
    expect(html).toContain("$45,000 USD Protected");
  });

  it("answers Question 2: Are there active threats right now? (Active Threats)", () => {
    const html = renderToString(h(ProtectionOverviewScreen));

    expect(html).toContain("1 ACTIVE INTERCEPTION UNDER CONTAINMENT");
    expect(html).toContain("INC-2026-0042");
    expect(html).toContain("Rahul Sharma");
    expect(html).toContain("AI VOICE CLONE");
    expect(html).toContain("Review Incident Dossier");
    expect(html).toContain("View Verification Record");
  });

  it("answers Question 3: What happened recently? (Recent Security Activity)", () => {
    const html = renderToString(h(ProtectionOverviewScreen));

    expect(html).toContain("Recent Security Activity");
    expect(html).toContain("View All Call History");
    expect(html).toContain("15:32");
    expect(html).toContain("Wire Disbursement Frozen ($45,000 USD)");
    expect(html).toContain("15:30");
    expect(html).toContain("Acoustic Divergence Detected on Inbound Trunk 04");
    expect(html).toContain("14:15");
    expect(html).toContain("Pre-Shared Safe Word Confirmed");
    expect(html).toContain("11:40");
    expect(html).toContain("Executive Baseline Voiceprint Verified");
    expect(html).toContain("09:12");
    expect(html).toContain("Voice Enclave Synchronized");
  });

  it("answers Question 4: What incidents need attention? (Incidents Needing Attention)", () => {
    const html = renderToString(h(ProtectionOverviewScreen));

    expect(html).toContain("Incidents Needing Attention");
    expect(html).toContain("1 Awaiting Sign-off");
    expect(html).toContain("INC-2026-0042");
    expect(html).toContain("Action Needed: File Formal SOC Report");
    expect(html).toContain("Open Dossier");
    expect(html).toContain("INC-2026-0041");
    expect(html).toContain("RESOLVED");
  });

  it("answers Question 5: What is the overall security trend? (Security Trend Insights)", () => {
    const html = renderToString(h(ProtectionOverviewScreen));

    expect(html).toContain("Security Trend Insights");
    expect(html).toContain("AI Voice Cloning Vector");
    expect(html).toContain("Social Engineering Patterns");
    expect(html).toContain("Telephony Carrier Integrity");
    expect(html).toContain("STIR/SHAKEN Level A");
  });
});
