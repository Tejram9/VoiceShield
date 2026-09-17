import { describe, it, expect } from "vitest";
import {
  getDemoStageData,
  getNextStage,
  getPreviousStage,
  DEMO_STAGES,
} from "../lib/demo/demo-controller";
import {
  executeWireFreeze,
  executeKillSwitch,
  createContainmentDirective,
} from "../lib/containment/containment-workflow";
import {
  generateEmbeddingHash,
  maskSafeWord,
  verifySafeWordMatch,
  createEnrolledContact,
} from "../lib/biometrics/biometric-enrollment";
import {
  createVerificationChallenge,
  evaluateSafeWordChallenge,
  evaluateCallbackChallenge,
} from "../lib/verification/verification-workflow";

describe("Preserved Business Logic Test Suite", () => {
  describe("Demo Scenario State Machine (5 Stages)", () => {
    it("has exactly 5 stages in order", () => {
      expect(DEMO_STAGES).toHaveLength(5);
      expect(DEMO_STAGES[0].id).toBe("STAGE_1_NORMAL");
      expect(DEMO_STAGES[1].id).toBe("STAGE_2_URGENCY");
      expect(DEMO_STAGES[2].id).toBe("STAGE_3_SPEAKER_MISMATCH");
      expect(DEMO_STAGES[3].id).toBe("STAGE_4_SYNTHETIC_CLONE");
      expect(DEMO_STAGES[4].id).toBe("STAGE_5_CONTAINED");
    });

    it("transitions sequentially forward and backward", () => {
      expect(getNextStage("STAGE_1_NORMAL")).toBe("STAGE_2_URGENCY");
      expect(getNextStage("STAGE_2_URGENCY")).toBe("STAGE_3_SPEAKER_MISMATCH");
      expect(getNextStage("STAGE_3_SPEAKER_MISMATCH")).toBe("STAGE_4_SYNTHETIC_CLONE");
      expect(getNextStage("STAGE_4_SYNTHETIC_CLONE")).toBe("STAGE_5_CONTAINED");
      expect(getNextStage("STAGE_5_CONTAINED")).toBe("STAGE_5_CONTAINED");

      expect(getPreviousStage("STAGE_5_CONTAINED")).toBe("STAGE_4_SYNTHETIC_CLONE");
      expect(getPreviousStage("STAGE_1_NORMAL")).toBe("STAGE_1_NORMAL");
    });

    it("generates rich data for Stage 1 Normal", () => {
      const data = getDemoStageData("STAGE_1_NORMAL");
      expect(data.riskLevel).toBe("LOW");
      expect(data.riskScore).toBeLessThan(20);
      expect(data.trustStatus).toBe("VERIFIED_CONTACT");
      expect(data.sensitiveActionRisk).toBe("NONE");
    });

    it("generates critical alert data for Stage 4 Synthetic Clone", () => {
      const data = getDemoStageData("STAGE_4_SYNTHETIC_CLONE");
      expect(data.riskLevel).toBe("CRITICAL");
      expect(data.riskScore).toBe(94);
      expect(data.trustStatus).toBe("SUSPECTED_SPOOF");
      expect(data.sensitiveActionRisk).toBe("CRITICAL");
    });

    it("generates protected containment data for Stage 5 Contained", () => {
      const data = getDemoStageData("STAGE_5_CONTAINED");
      expect(data.sensitiveActionRisk).toBe("PROTECTED");
      expect(data.summary).toContain("Independent cellular callback verified");
    });
  });

  describe("Containment Workflows", () => {
    it("creates containment directive for wire freeze", () => {
      const directive = createContainmentDirective("FREEZE_ACTION", "call-01");
      expect(directive.actionType).toBe("FREEZE_ACTION");
      expect(directive.policy).toContain("4.1");
    });

    it("executes wire freeze and creates an incident dossier", () => {
      const result = executeWireFreeze("call-123", "Rahul Sharma", "$45,000");
      expect(result.success).toBe(true);
      expect(result.actionType).toBe("FREEZE_ACTION");
      expect(result.incidentCreated).toBeDefined();
      expect(result.incidentCreated?.status).toBe("CONTAINED");
      expect(result.incidentCreated?.caller).toBe("Rahul Sharma");
    });

    it("enforces emergency kill switch directives", () => {
      const result = executeKillSwitch("DROP_SIP_TRUNK", "trunk-01");
      expect(result.success).toBe(true);
      expect(result.message).toContain("DROP_SIP_TRUNK");
    });
  });

  describe("Biometric Enrollment & Safe Word Vault", () => {
    it("generates valid ECAPA-TDNN hash format", () => {
      const hash = generateEmbeddingHash();
      expect(hash).toMatch(/^ecapa_tdnn_[0-9a-f]{10}$/);
    });

    it("masks safe word strings", () => {
      expect(maskSafeWord("COBALT-ORION-77")).toBe("••••••••••••");
    });

    it("verifies safe word match case-insensitively", () => {
      expect(verifySafeWordMatch("cobalt-orion-77", "COBALT-ORION-77")).toBe(true);
      expect(verifySafeWordMatch("wrong-phrase", "COBALT-ORION-77")).toBe(false);
      expect(verifySafeWordMatch("", "COBALT-ORION-77")).toBe(false);
    });

    it("creates an enrolled contact record", () => {
      const contact = createEnrolledContact({
        name: "Test Executive",
        role: "VP Finance",
        phone: "+1 555 123 4567",
        safeWord: "SECRET-SAFEWORD-99",
      });
      expect(contact.id).toMatch(/^cnt-/);
      expect(contact.name).toBe("Test Executive");
      expect(contact.voiceprintStatus).toBe("VERIFIED");
      expect(contact.safeWordPlain).toBe("SECRET-SAFEWORD-99");
      expect(contact.embeddingHash).toMatch(/^ecapa_tdnn_/);
    });
  });

  describe("Verification Challenge Protocols", () => {
    it("creates a pending verification challenge", () => {
      const challenge = createVerificationChallenge({
        callerName: "Rahul Sharma",
        callerPhone: "+91 98201 44521",
        challengeType: "OUT_OF_BAND_CALLBACK",
      });
      expect(challenge.status).toBe("PENDING");
      expect(challenge.challengeType).toBe("OUT_OF_BAND_CALLBACK");
    });

    it("evaluates safe word challenge pass/fail", () => {
      const challenge = createVerificationChallenge({
        callerName: "Rahul Sharma",
        callerPhone: "+91 98201 44521",
        challengeType: "SAFE_WORD",
      });

      const passed = evaluateSafeWordChallenge(challenge, "COBALT-ORION-77", "COBALT-ORION-77");
      expect(passed.status).toBe("PASSED");

      const failed = evaluateSafeWordChallenge(challenge, "INCORRECT", "COBALT-ORION-77");
      expect(failed.status).toBe("FAILED");
    });

    it("evaluates out-of-band callback outcomes", () => {
      const challenge = createVerificationChallenge({
        callerName: "Rahul Sharma",
        callerPhone: "+91 98201 44521",
        challengeType: "OUT_OF_BAND_CALLBACK",
      });

      const confirmed = evaluateCallbackChallenge(challenge, "impersonation_confirmed");
      expect(confirmed.status).toBe("FAILED");
      expect(confirmed.operatorNotes).toContain("Impersonation flagged");
    });
  });
});
