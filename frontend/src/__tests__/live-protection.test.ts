import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  LiveProtectionPage,
  TopBar,
  CallerCard,
  SecurityTimeline,
  LiveCallCenter,
  KeySignals,
  ThreatActionColumn,
  VerificationDialog,
  ContainmentDialog,
} from "../components/live-protection";
import { Sidebar } from "../components/layout/sidebar";
import { DEMO_STAGES, getDemoStageData } from "../lib/demo-state";

const h = React.createElement;

describe("VoiceShield Reference-Inspired Live Protection Screen", () => {
  describe("Sidebar Navigation", () => {
    it("renders brand, navigation items, and system online indicator", () => {
      const html = renderToString(
        h(Sidebar, { activeTab: "live-protection", hasActiveThreat: true })
      );

      expect(html).toContain("VoiceShield");
      expect(html).toContain("Trust Every Voice");
      expect(html).toContain("Live Protection");
      expect(html).toContain("Call History");
      expect(html).toContain("Verification");
      expect(html).toContain("Reports");
      expect(html).toContain("Settings");
      expect(html).toContain("System Online");
      expect(html).toContain("AI Protection Active");
    });
  });

  describe("TopBar Header", () => {
    it("renders call status, protected badge, audio quality, and demo switcher", () => {
      const html = renderToString(
        h(TopBar, {
          currentStage: "STAGE_4_SYNTHETIC_CLONE",
          stages: DEMO_STAGES,
          onSelectStage: () => {},
          callDuration: "02:17",
          audioQuality: "Good",
        })
      );

      expect(html).toContain("Live Protection");
      expect(html).toContain("Protection Active");
      expect(html).toContain("LIVE CALL");
      expect(html).toContain("02:17");
      expect(html).toContain("AUDIO QUALITY");
      expect(html).toContain("Good");
      expect(html).toContain("Security Officer");
      expect(html).toContain("SIH Operations");
      expect(html).toContain("Normal");
      expect(html).toContain("High Risk");
      expect(html).toContain("Contained");
    });
  });

  describe("CallerCard (Left Column)", () => {
    it("renders caller identity, initials avatar, trusted contact, and sensitive context checklist", () => {
      const stageData = getDemoStageData("STAGE_4_SYNTHETIC_CLONE");
      const html = renderToString(
        h(CallerCard, {
          name: stageData.caller.name,
          initials: stageData.caller.initials,
          role: stageData.caller.role,
          phone: stageData.caller.phone,
          isTrustedContact: stageData.caller.isTrustedContact,
          isVerifiedNumber: stageData.caller.isVerifiedNumber,
          hasSensitiveAction: stageData.caller.hasSensitiveAction,
          sensitiveActionText: stageData.caller.sensitiveActionText,
        })
      );

      expect(html).toContain("CALLER");
      expect(html).toContain("RS");
      expect(html).toContain("Rahul Sharma");
      expect(html).toContain("Chief Financial Officer");
      expect(html).toContain("+91 98765 43210");
      expect(html).toContain("Trusted Contact");
      expect(html).toContain("Verified number");
      expect(html).toContain("CURRENT CONTEXT");
      expect(html).toContain("Known contact");
      expect(html).toContain("Sensitive action");
      expect(html).toContain("Financial request");
    });
  });

  describe("SecurityTimeline (Left Column)", () => {
    it("renders chronological events with severity indicators matching reference", () => {
      const stageData = getDemoStageData("STAGE_4_SYNTHETIC_CLONE");
      const html = renderToString(
        h(SecurityTimeline, { events: stageData.timeline })
      );

      expect(html).toContain("Security Timeline");
      expect(html).toContain("01:44");
      expect(html).toContain("Risk increased to HIGH");
      expect(html).toContain("01:31");
      expect(html).toContain("Speaker Inconsistency detected");
      expect(html).toContain("01:17");
      expect(html).toContain("Financial request detected");
      expect(html).toContain("00:55");
      expect(html).toContain("Urgency language detected");
      expect(html).toContain("00:20");
      expect(html).toContain("Caller identified");
    });
  });

  describe("LiveCallCenter (Center Column)", () => {
    it("renders acoustic waveform, verbatim quote, and semantic chips", () => {
      const stageData = getDemoStageData("STAGE_4_SYNTHETIC_CLONE");
      const html = renderToString(
        h(LiveCallCenter, {
          speakerName: stageData.liveCall.speakerName,
          speakerTimestamp: stageData.liveCall.speakerTimestamp,
          transcriptText: stageData.liveCall.transcriptText,
          semanticTags: stageData.liveCall.semanticTags,
          isLive: true,
        })
      );

      expect(html).toContain("LIVE");
      expect(html).toContain("CALLER");
      expect(html).toContain("01:08");
      expect(html).toContain("We need to complete the payment immediately");
      expect(html).toContain("URGENCY");
      expect(html).toContain("FINANCIAL REQUEST");
      expect(html).toContain("ISOLATION");
      expect(html).toContain("Audio analysis in progress...");
    });
  });

  describe("KeySignals (Center Column)", () => {
    it("renders all four core signals with status badges and progressive disclosure", () => {
      const stageData = getDemoStageData("STAGE_4_SYNTHETIC_CLONE");
      const html = renderToString(
        h(KeySignals, { signals: stageData.signals })
      );

      expect(html).toContain("Key Signals");
      expect(html).toContain("Voice Authenticity");
      expect(html).toContain("Concern");
      expect(html).toContain("Speaker Consistency");
      expect(html).toContain("Mismatch");
      expect(html).toContain("Conversation Analysis");
      expect(html).toContain("High");
      expect(html).toContain("Context Analysis");
      expect(html).toContain("Elevated");
      expect(html).toContain("Advanced Evidence");
    });
  });

  describe("ThreatActionColumn (Right Column)", () => {
    it("renders Current Risk, Recommended Action buttons, and protocol cards", () => {
      const stageData = getDemoStageData("STAGE_4_SYNTHETIC_CLONE");
      const html = renderToString(
        h(ThreatActionColumn, {
          riskLevel: stageData.riskLevel,
          headline: stageData.riskHeadline,
          explanation: stageData.riskExplanation,
          whyRiskyBullets: stageData.whyRiskyBullets,
          recommendedAction: stageData.recommendedAction,
        })
      );

      expect(html).toContain("CURRENT RISK");
      expect(html).toContain("HIGH");
      expect(html).toContain("Potential impersonation detected.");
      expect(html).toContain("The current call shows speaker inconsistency and a sensitive financial request.");
      expect(html).toContain("Why is this risky?");
      expect(html).toContain("RECOMMENDED ACTION");
      expect(html).toContain("PROTECTIVE ACTION RECOMMENDED");
      expect(html).toContain("Verify Caller");
      expect(html).toContain("Pause Action");
      expect(html).toContain("Technical Evidence");
      expect(html).toContain("View Details");
    });
  });

  describe("Dialogs: VerificationDialog & ContainmentDialog", () => {
    it("renders verification dialog with Callback, Safe Word, and MFA", () => {
      const html = renderToString(
        h(VerificationDialog, {
          isOpen: true,
          onClose: () => {},
          callerName: "Rahul Sharma",
          callerRole: "Chief Financial Officer",
          callerPhone: "+91 98765 43210",
        })
      );

      expect(html).toContain("Independent Caller Verification");
      expect(html).toContain("Callback");
      expect(html).toContain("Safe Word");
      expect(html).toContain("Step-Up MFA");
      expect(html).toContain("Rahul Sharma");
    });

    it("renders containment dialog with Policy 4.1 wire freeze", () => {
      const html = renderToString(
        h(ContainmentDialog, {
          isOpen: true,
          onClose: () => {},
          callerName: "Rahul Sharma",
          amount: "$45,000",
        })
      );

      expect(html).toContain("Enforce Containment Directive");
      expect(html).toContain("Immediate Wire Freeze (Policy 4.1)");
      expect(html).toContain("Sever Inbound SIP Telephony Trunk");
      expect(html).toContain("$45,000 USD");
    });
  });

  describe("Master LiveProtectionPage", () => {
    it("renders full three-column workspace layout", () => {
      const html = renderToString(h(LiveProtectionPage));

      expect(html).toContain("VoiceShield");
      expect(html).toContain("Live Protection");
      expect(html).toContain("LIVE CALL");
      expect(html).toContain("CALLER");
      expect(html).toContain("Rahul Sharma");
      expect(html).toContain("Security Timeline");
      expect(html).toContain("Key Signals");
      expect(html).toContain("CURRENT RISK");
      expect(html).toContain("RECOMMENDED ACTION");
    });
  });
});
