import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { SecurityPrivacyScreen } from "../components/security-privacy/security-privacy-screen";

const h = React.createElement;

describe("VoiceShield Security & Privacy Screen", () => {
  it("renders header, trust badge, and privacy export action", () => {
    const html = renderToString(h(SecurityPrivacyScreen));

    expect(html).toContain("Security &amp; Privacy");
    expect(html).toContain("Privacy-Preserving Architecture · Prototype Evaluation");
    expect(html).toContain("Export Privacy &amp; Compliance Package");
  });

  it("distinguishes current prototype vs. planned capabilities", () => {
    const html = renderToString(h(SecurityPrivacyScreen));

    expect(html).toContain("Architecture Scope: Current Prototype vs. Planned Capabilities");
    expect(html).toContain("Active in Current Prototype");
    expect(html).toContain("Real-time in-memory acoustic feature scoring");
    expect(html).toContain("Designed / Planned Enterprise Capabilities");
    expect(html).toContain("Hardware-enclave key sealing architecture (planned roadmap capability)");
  });

  it("answers Pillar 1: What Data (Feature-Only vs. Raw Audio)", () => {
    const html = renderToString(h(SecurityPrivacyScreen));

    expect(html).toContain("1. What Data: Feature-Only Extraction vs. Raw Audio");
    expect(html).toContain("In the current prototype, VoiceShield processes derived acoustic features in real time and does not persist conversational call recordings during standard operation.");
    expect(html).toContain("Designed for Minimal Raw-Audio Retention");
    expect(html).toContain("What We Extract (Acoustic Features)");
    expect(html).toContain("The prototype records derived feature representations rather than conversational speech transcripts.");
    expect(html).toContain("What We Avoid Storing (Minimal Speech Storage)");
    expect(html).toContain("In standard operation and throughout this prototype, raw audio frames are processed in temporary memory and are not persisted to disk.");
    expect(html).toContain("Technical Details / Architecture: Feature Extractor Pipeline (SIH / SOC Audit)");
    // Technical terms hidden behind expandable accordion by default
    expect(html).not.toContain("ECAPA-TDNN");
    expect(html).not.toContain("80-channel log Mel-filterbank");
  });

  it("answers Pillar 2: Where It Is Processed (Edge Gateways & Enclave Boundary)", () => {
    const html = renderToString(h(SecurityPrivacyScreen));

    expect(html).toContain("2. Where It Is Processed: Edge Gateways &amp; Enclave Boundary");
    expect(html).toContain("Edge-Processing Architecture");
    expect(html).toContain("Edge PBX Gateway Inference");
    expect(html).toContain("Planned enterprise architecture: neural spoof detection runs locally on enterprise telephony gateways. The prototype evaluation target is sub-50ms inference on suitable local edge hardware.");
    expect(html).toContain("Hardware-Enclave Storage");
    expect(html).toContain("Technical Details / Architecture: Cryptographic Boundary &amp; Key Lifecycle (SIH / SOC Audit)");
    // Technical details hidden behind expandable accordion by default
    expect(html).not.toContain("mTLS 1.3 with Curve25519");
  });

  it("answers Pillar 3: How Long It Is Retained (Lifecycle & Retention Presets)", () => {
    const html = renderToString(h(SecurityPrivacyScreen));

    expect(html).toContain("3. How Long It Is Retained: Configurable Retention Rules");
    expect(html).toContain("Routine Call Audio");
    expect(html).toContain("6.0s (Prototype Buffer)");
    expect(html).toContain("Operational Telemetry");
    expect(html).toContain("30 Days (Configurable)");
    expect(html).toContain("Confirmed Threat Forensics");
    expect(html).toContain("90 Days (Planned Policy)");
    expect(html).toContain("Standard Enterprise (30 Days)");
  });

  it("answers Pillar 4: Who Can Access It (RBAC Permissions & Audit Log)", () => {
    const html = renderToString(h(SecurityPrivacyScreen));

    expect(html).toContain("4. Who Can Access It: Strict Role Permissions &amp; Audit Trail");
    expect(html).toContain("Dual-Sign Policy · Planned");
    expect(html).not.toContain("Dual-Sign Custody Enforced");
    expect(html).toContain("Standard Call Participant");
    expect(html).toContain("Tier-1 SOC Operator");
    expect(html).toContain("Security Officer / SIH Admin");
    expect(html).toContain("Recent Security &amp; Privacy Audit Activity");
    expect(html).toContain("Simulated Demo Log");
    expect(html).toContain("DEMO-AUD-9042");
    expect(html).toContain("SIMULATED · ENFORCED");
    expect(html).not.toContain(">ENFORCED<");
    expect(html).toContain("Simulated Case: INC-2026-0042");
    expect(html).toContain("Technical Details / Architecture: Access Verification Policy (SIH / SOC Audit)");
  });

  it("answers Pillar 5: What The User Can Control (Privacy Preferences & Biometric Rights)", () => {
    const html = renderToString(h(SecurityPrivacyScreen));

    expect(html).toContain("5. What You Can Control: Privacy Preferences &amp; Biometric Rights");
    expect(html).toContain("Privacy-Preserving Design");
    expect(html).toContain("Preserve Evidence Snippet on Confirmed Threat Containment (Planned Policy)");
    expect(html).toContain("Preservation Policy · Planned");
    expect(html).not.toContain("Preservation Policy Active");
    expect(html).toContain("Dual-Authorization Requirement for Forensic Audio Playback (Planned Policy)");
    expect(html).toContain("Dual-Sign Policy · Planned");
    expect(html).toContain("Local Edge Telephony Air-Gap Mode");
    expect(html).toContain("Air-Gap Mode · Configurable");
    expect(html).not.toContain("Air-Gap Active");
    expect(html).toContain("Purge Biometric Voice Baseline (Right-to-Erasure Workflow)");
  });
});
