import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  LandingPage,
  LandingNavbar,
  LandingHero,
  LandingHowItWorks,
  LandingLivePreview,
  LandingWhyVoiceTrustFails,
  LandingVerificationLayer,
  LandingPrivacyDesign,
  LandingUseCases,
  LandingSihContext,
  LandingCta,
  LandingFooter,
} from "../components/landing";

const h = React.createElement;

describe("VoiceShield Public Landing Page", () => {
  it("renders master landing page with all 10 core sections", () => {
    const html = renderToString(h(LandingPage));

    // 1. Brand & Header
    expect(html).toContain("VoiceShield");
    expect(html).toContain("Telephony AI Defense");

    // 2. Hero
    expect(html).toContain("Trusted Voice");
    expect(html).toContain("≠");
    expect(html).toContain("Trusted Identity");
    expect(html).toContain("Detect. Verify. Prevent.");

    // 3. How It Works
    expect(html).toContain("How VoiceShield Protects Live Calls");
    expect(html).toContain("Telephony Stream Ingestion");
    expect(html).toContain("Dual-Model Neural Scoring");
    expect(html).toContain("Composite Risk Engine");
    expect(html).toContain("Deterministic Action Mandate");

    // 4. Live Protection Preview
    expect(html).toContain("Live Protection in the Operations Room");
    expect(html).toContain("Active Telephony Stream");
    expect(html).toContain("Rahul Sharma (Chief Financial Officer)");

    // 5. Why Existing Voice Trust Fails
    expect(html).toContain("Why Existing Voice Trust Fails");
    expect(html).toContain("Caller ID / Phone Number Attestation");
    expect(html).toContain("Conventional Telephony Defense");
    expect(html).toContain("VoiceShield In-Call Defense");

    // 6. Verification Layer
    expect(html).toContain("The Verification Layer: Beyond Detection");
    expect(html).toContain("Pre-Shared Enterprise Safe Word");
    expect(html).toContain("Trusted Out-of-Band Callback");
    expect(html).toContain("Dual-Authorization Custody");

    // 7. Privacy by Design
    expect(html).toContain("Security Without Mass Surveillance");
    expect(html).toContain("Minimal Speech Storage");
    expect(html).toContain("Minimal Raw-Audio Retention · Prototype");
    expect(html).toContain("Volatile Memory Processing");

    // 8. Targeted Use Cases
    expect(html).toContain("Targeted Enterprise Use Cases");
    expect(html).toContain("Corporate Treasury &amp; Emergency Wire Transfers");
    expect(html).toContain("IT Helpdesk &amp; MFA Device Reset Bypass");
    expect(html).toContain("Private Banking &amp; High-Net-Worth Wealth Offices");

    // 9. SIH Context
    expect(html).toContain("Smart India Hackathon 2026 Context");
    expect(html).toContain("26104");
    expect(html).toContain("The Telephony Fraud Crisis");

    // 10. CTA & Footer
    expect(html).toContain("Experience VoiceShield In Action");
    expect(html).toContain("Launch Live Protection Console");
    expect(html).toContain("Security Console");
    expect(html).toContain("v1.0.0-SIH26104");
  });

  it("renders Hero with fast 10-second value scan and SIH badge", () => {
    const html = renderToString(h(LandingHero));

    expect(html).toContain("Smart India Hackathon 2026 · Problem Statement 26104");
    expect(html).toContain("Trusted Voice");
    expect(html).toContain("Trusted Identity");
    expect(html).toContain("Detect. Verify. Prevent.");
    expect(html).toContain("Modern generative AI clones executive voices in seconds");
    expect(html).toContain("Prototype evaluation target: sub-50ms");
    expect(html).toContain("Minimal Raw-Audio Retention · Prototype");
  });

  it("renders Live Preview with scenario details and realistic console telemetry", () => {
    const html = renderToString(h(LandingLivePreview));

    expect(html).toContain("In-Call Security Console Preview");
    expect(html).toContain("SIMULATED DEMONSTRATION · SAMPLE TELEMETRY");
    expect(html).toContain("demonstration data");
    expect(html).toContain("Simulate this deepfake-call scenario live in your browser.");
    expect(html).toContain("Scenario A: Synthetic Clone Detected (Critical)");
    expect(html).toContain("Claimed Caller Profile");
    expect(html).toContain("Rahul Sharma");
    expect(html).toContain("Enrolled Voiceprint");
    expect(html).toContain("Enter Interactive Live Console");
  });

  it("renders Why Voice Trust Fails with side-by-side vectors", () => {
    const html = renderToString(h(LandingWhyVoiceTrustFails));

    expect(html).toContain("Auditory Perception &amp; Human Ear");
    expect(html).toContain("Detection Timing &amp; Threat Remediation");
    expect(html).toContain("Conventional Telephony Defense");
    expect(html).toContain("VoiceShield In-Call Defense");
  });

  it("renders Verification Layer with multi-tier protocols and escalation flow", () => {
    const html = renderToString(h(LandingVerificationLayer));

    expect(html).toContain("Pre-Shared Enterprise Safe Word");
    expect(html).toContain("Trusted Out-of-Band Callback");
    expect(html).toContain("Dual-Authorization Custody");
    expect(html).toContain("Graduated Threat Escalation Flow");
    expect(html).toContain("Passive Monitoring");
    expect(html).toContain("Elevated Advisory");
    expect(html).toContain("Safe Word Challenge");
    expect(html).toContain("Containment Mandate");
  });

  it("renders Privacy by Design with strict memory and feature extraction assertions", () => {
    const html = renderToString(h(LandingPrivacyDesign));

    expect(html).toContain("Minimal Speech Storage");
    expect(html).toContain("In standard operation and throughout this prototype, raw audio frames are processed in temporary volatile memory and are not persisted to disk.");
    expect(html).toContain("Derived Feature Extraction");
    expect(html).toContain("View Security &amp; Privacy Center");
  });

  it("renders Navbar and How It Works subcomponents", () => {
    const navHtml = renderToString(h(LandingNavbar));
    expect(navHtml).toContain("VoiceShield");
    expect(navHtml).toContain("Launch Live Console");

    const worksHtml = renderToString(h(LandingHowItWorks));
    expect(worksHtml).toContain("How VoiceShield Protects Live Calls");
    expect(worksHtml).toContain("Dual-Model Neural Scoring");
  });

  it("renders Use Cases, SIH Context, and CTA subcomponents", () => {
    const ucHtml = renderToString(h(LandingUseCases));
    expect(ucHtml).toContain("Targeted Enterprise Use Cases");
    expect(ucHtml).toContain("Corporate Treasury &amp; Emergency Wire Transfers");

    const sihHtml = renderToString(h(LandingSihContext));
    expect(sihHtml).toContain("Smart India Hackathon 2026 Context");
    expect(sihHtml).toContain("26104");

    const ctaHtml = renderToString(h(LandingCta));
    expect(ctaHtml).toContain("Experience VoiceShield In Action");
    expect(ctaHtml).toContain("Launch Live Protection Console");
  });

  it("renders Footer with links to all 8 implemented product screens", () => {
    const html = renderToString(h(LandingFooter));

    expect(html).toContain("/live");
    expect(html).toContain("/call-history");
    expect(html).toContain("/verification");
    expect(html).toContain("/incident");
    expect(html).toContain("/reports");
    expect(html).toContain("/trusted-identity");
    expect(html).toContain("/overview");
    expect(html).toContain("/security-privacy");
    expect(html).toContain("Smart India Hackathon 2026");
  });
});
