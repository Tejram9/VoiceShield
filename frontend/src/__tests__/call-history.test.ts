import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { CallHistoryScreen, CALL_HISTORY_DATA } from "../components/call-history/call-history-screen";

const h = React.createElement;

describe("VoiceShield Call History Screen", () => {
  it("renders header, controls, and table columns", () => {
    const html = renderToString(h(CallHistoryScreen));

    // Header
    expect(html).toContain("Call History");
    expect(html).toContain("Recorded Sessions");

    // Controls
    expect(html).toContain("Search by caller, number, reason, or incident ID...");
    expect(html).toContain("Risk Level:");
    expect(html).toContain("All Calls");
    expect(html).toContain("LOW");
    expect(html).toContain("ELEVATED");
    expect(html).toContain("HIGH");
    expect(html).toContain("CRITICAL");

    // Table Headers
    expect(html).toContain("Caller");
    expect(html).toContain("Date / Time");
    expect(html).toContain("Duration");
    expect(html).toContain("Risk Level");
    expect(html).toContain("Main Detection Reason");
    expect(html).toContain("Verification / Outcome");
    expect(html).toContain("Action Taken");

    // Key call records
    expect(html).toContain("Rahul Sharma");
    expect(html).toContain("Chief Financial Officer");
    expect(html).toContain("Acoustic divergence &amp; urgent $45k wire bypass request");
    expect(html).toContain("Wire frozen &amp; incident logged (INC-2026-0042)");

    expect(html).toContain("Sarah Jenkins");
    expect(html).toContain("VP Operations");

    expect(html).toContain("Priya Nair");
    expect(html).toContain("Managing Director");

    expect(html).toContain("Unknown Inbound");
    expect(html).toContain("Synthetic vocoder phase jitter on credit line inquiry");
  });

  it("contains curated historical dataset with correct risk levels", () => {
    expect(CALL_HISTORY_DATA.length).toBeGreaterThanOrEqual(7);

    const criticalCalls = CALL_HISTORY_DATA.filter((c) => c.riskLevel === "CRITICAL");
    expect(criticalCalls.length).toBeGreaterThanOrEqual(1);
    expect(criticalCalls[0].callerName).toBe("Rahul Sharma");
    expect(criticalCalls[0].incidentId).toBe("INC-2026-0042");

    const highCalls = CALL_HISTORY_DATA.filter((c) => c.riskLevel === "HIGH");
    expect(highCalls.length).toBeGreaterThanOrEqual(1);

    const elevatedCalls = CALL_HISTORY_DATA.filter((c) => c.riskLevel === "ELEVATED");
    expect(elevatedCalls.length).toBeGreaterThanOrEqual(2);

    const lowCalls = CALL_HISTORY_DATA.filter((c) => c.riskLevel === "LOW");
    expect(lowCalls.length).toBeGreaterThanOrEqual(3);
  });
});
