import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { VerificationScreen } from "../components/verification/verification-screen";

const h = React.createElement;

describe("VoiceShield Verification Screen", () => {
  it("renders header, caller identity, prominent why verification top card, and 5-stage stepper", () => {
    const html = renderToString(
      h(VerificationScreen, {
        callerName: "Rahul Sharma",
        callerRole: "Chief Financial Officer",
        callerPhone: "+91 98765 43210",
        transferAmount: "$45,000",
      })
    );

    // Header & Sidebar
    expect(html).toContain("Caller Verification");
    expect(html).toContain("Independent Protocol Active");
    expect(html).toContain("VoiceShield");
    expect(html).toContain("Live Protection");
    expect(html).toContain("Verification");

    // Prominent Top Context: Why verification is required
    expect(html).toContain("WHY VERIFICATION IS REQUIRED");
    expect(html).toContain("Suspicious Activity Detected");
    expect(html).toContain("Inbound call claiming to be Rahul Sharma");
    expect(html).toContain("exhibiting vocal tract inconsistencies");

    // 5-Stage Stepper: WHY → METHOD → VERIFY → RESULT → NEXT ACTION
    expect(html).toContain("WHY");
    expect(html).toContain("METHOD");
    expect(html).toContain("VERIFY");
    expect(html).toContain("RESULT");
    expect(html).toContain("NEXT ACTION");

    // Left Context Column
    expect(html).toContain("SUBJECT UNDER VERIFICATION");
    expect(html).toContain("Rahul Sharma");
    expect(html).toContain("Chief Financial Officer");
    expect(html).toContain("+91 98765 43210");
    expect(html).toContain("Emergency Wire Transfer: $45,000 USD");
    expect(html).toContain("Policy &amp; Compliance Details");
    expect(html).toContain("Return to Live Call");

    // Step 1: Why Verification is Required findings
    expect(html).toContain("Why Verification Is Required");
    expect(html).toContain("Speaker Inconsistency Detected");
    expect(html).toContain("Coercive Isolation &amp; Urgency");
    expect(html).toContain("Choose Verification Method");
  });

  it("renders with custom caller and transfer parameters", () => {
    const html = renderToString(
      h(VerificationScreen, {
        callerName: "Sarah Lin",
        callerRole: "VP Treasury",
        callerPhone: "+1 (555) 019-2834",
        transferAmount: "$120,000",
      })
    );

    expect(html).toContain("Sarah Lin");
    expect(html).toContain("VP Treasury");
    expect(html).toContain("+1 (555) 019-2834");
    expect(html).toContain("Emergency Wire Transfer: $120,000 USD");
    expect(html).toContain("Inbound call claiming to be Sarah Lin (VP Treasury) requested an urgent $120,000 wire transfer");
  });
});
