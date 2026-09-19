import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  TrustedIdentityScreen,
  INITIAL_TRUSTED_IDENTITIES,
} from "../components/trusted-identity/trusted-identity-screen";

const h = React.createElement;

describe("VoiceShield Trusted Identity Screen", () => {
  it("renders header, controls, and executive identity cards", () => {
    const html = renderToString(h(TrustedIdentityScreen));

    // Header & Primary Action
    expect(html).toContain("Trusted Identities");
    expect(html).toContain("Add Trusted Identity");
    expect(html).toContain("Registered Baselines");

    // Controls
    expect(html).toContain("Search identities by name, role, phone, or policy...");
    expect(html).toContain("All");
    expect(html).toContain("Active");
    expect(html).toContain("Needs Calibration");

    // UX Priority 1: Trusted Person
    expect(html).toContain("Rahul Sharma");
    expect(html).toContain("Chief Financial Officer");
    expect(html).toContain("+91 98765 43210");
    expect(html).toContain("Cellular");

    expect(html).toContain("Priya Nair");
    expect(html).toContain("Managing Director &amp; CEO");

    // UX Priority 2: Voice Baseline
    expect(html).toContain("Voice Baseline Health");
    expect(html).toContain("Enrolled &amp; Active");
    expect(html).toContain("14.5 mins");
    expect(html).toContain("Sep 12, 2026 (6 days ago)");

    // UX Priority 3: Verification Rules & Policy
    expect(html).toContain("Verification Policy &amp; Safe Word");
    expect(html).toContain("COBALT-ORION-77");
    expect(html).toContain("wire transfers &gt; $10,000");

    // Primary Action Buttons
    expect(html).toContain("View Profile");
    expect(html).toContain("Recalibrate Voice");
    expect(html).toContain("Configure Verification");
  });

  it("contains complete enterprise baseline dataset", () => {
    expect(INITIAL_TRUSTED_IDENTITIES.length).toBeGreaterThanOrEqual(4);

    const rahul = INITIAL_TRUSTED_IDENTITIES.find((i) => i.name === "Rahul Sharma");
    expect(rahul).toBeDefined();
    expect(rahul?.voiceStatus).toBe("ENROLLED");
    expect(rahul?.safeWordVaultCode).toBe("COBALT-ORION-77");
    expect(rahul?.allowedMethods).toContain("callback");
    expect(rahul?.allowedMethods).toContain("safeword");
    expect(rahul?.allowedMethods).toContain("mfa");

    const sarah = INITIAL_TRUSTED_IDENTITIES.find((i) => i.name === "Sarah Jenkins");
    expect(sarah).toBeDefined();
    expect(sarah?.voiceStatus).toBe("PENDING_CALIBRATION");
  });
});
