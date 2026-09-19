import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { IncidentDossier } from "../components/incident/incident-dossier";

const h = React.createElement;

describe("VoiceShield Incident Dossier Screen", () => {
  it("renders case file header, incident metadata, and 6-stage UX flow", () => {
    const html = renderToString(
      h(IncidentDossier, {
        incidentId: "INC-2026-0042",
        callerName: "Rahul Sharma",
        callerRole: "Chief Financial Officer",
        callerPhone: "+91 98765 43210",
        transferAmount: "$45,000",
      })
    );

    // Header & Badges
    expect(html).toContain("Security Incident Dossier");
    expect(html).toContain("CRITICAL SEVERITY");
    expect(html).toContain("CONTAINED");
    expect(html).toContain("INC-2026-0042");

    // UX Stepper: Incident Created -> What Happened -> Why Serious -> Evidence -> Action -> Next Steps
    expect(html).toContain("INCIDENT CREATED");
    expect(html).toContain("WHAT HAPPENED");
    expect(html).toContain("WHY SERIOUS");
    expect(html).toContain("EVIDENCE");
    expect(html).toContain("ACTION TAKEN");
    expect(html).toContain("NEXT STEPS");

    // Case Particulars (Left Column)
    expect(html).toContain("CASE PARTICULARS");
    expect(html).toContain("Rahul Sharma");
    expect(html).toContain("IMPERSONATED");
    expect(html).toContain("Chief Financial Officer");
    expect(html).toContain("+91 98765 43210");
    expect(html).toContain("Emergency Wire Transfer: $45,000 USD");
    expect(html).toContain("Direct loss prevented: $45,000 USD");
    expect(html).toContain("AI Voice Clone (Deepfake)");
    expect(html).toContain("Policy 4.1 Enforced");
    expect(html).toContain("CHAIN OF CUSTODY");

    // Section 1 & 2: What Happened? and Why is it serious?
    expect(html).toContain("What Happened?");
    expect(html).toContain("Why is this incident serious?");
    expect(html).toContain("advanced AI voice cloning model");

    // Section 3: Chronological Security Timeline
    expect(html).toContain("Security Incident Timeline");
    expect(html).toContain("Inbound Call Ingested");
    expect(html).toContain("Urgency Language Flagged");
    expect(html).toContain("Acoustic Biometric Divergence Detected");
    expect(html).toContain("Independent Verification Protocol Initiated");
    expect(html).toContain("Attack Confirmed &amp; Containment Triggered");

    // Section 4: Evidence Packages
    expect(html).toContain("What Evidence Exists?");
    expect(html).toContain("Evidence A: Acoustic Biometrics");
    expect(html).toContain("Evidence B: Coercive Transcript");
    expect(html).toContain("Evidence C: Telephony &amp; Trunk");
    expect(html).toContain("Neural Vocoder &amp; Biometric Analysis");
    expect(html).toContain("0.54");
    expect(html).toContain("92.4%");

    // Section 5: What Action Was Taken?
    expect(html).toContain("What Action Was Taken?");
    expect(html).toContain("1. Wire Transfer Frozen");
    expect(html).toContain("2. Call Terminated");
    expect(html).toContain("3. Ingress Blacklisted");

    // Section 6: Resolution & Next Actions
    expect(html).toContain("Current Status &amp; What Should Happen Next?");
    expect(html).toContain("Notify Executive Protection Desk");
    expect(html).toContain("File Formal SOC Triage Report");
    expect(html).toContain("Export Cryptographically Signed Audit Bundle");

    // Action Buttons
    expect(html).toContain("Export Case Dossier");
    expect(html).toContain("Notify Security Desk");
    expect(html).toContain("Return to Live Protection");
  });

  it("renders with custom incident parameters", () => {
    const html = renderToString(
      h(IncidentDossier, {
        incidentId: "INC-2026-0099",
        callerName: "Priya Nair",
        callerRole: "Managing Director",
        callerPhone: "+91 91234 56789",
        transferAmount: "$80,000",
      })
    );

    expect(html).toContain("INC-2026-0099");
    expect(html).toContain("Priya Nair");
    expect(html).toContain("Managing Director");
    expect(html).toContain("+91 91234 56789");
    expect(html).toContain("Emergency Wire Transfer: $80,000 USD");
    expect(html).toContain("Direct loss prevented: $80,000 USD");
  });
});
