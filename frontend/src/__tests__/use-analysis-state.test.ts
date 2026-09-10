import { describe, it, expect } from "vitest";
import { analysisReducer, INITIAL_ANALYSIS_STATE } from "../hooks/use-analysis-state";
import type { SecurityEvent } from "../lib/api/types";
import { EventType } from "../lib/api/types";

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function makeEvent(
  overrides: Partial<SecurityEvent> & { event_type: EventType }
): SecurityEvent {
  return {
    event_id: `evt-${Math.random().toString(36).slice(2, 8)}`,
    session_id: "VS-2026-TEST",
    timestamp: "03:00:00 UTC",
    source: "TestProvider",
    severity: "LOW",
    message: "Test event",
    confidence: 0.9,
    metadata: {},
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe("useAnalysisState — event reducer", () => {
  it("starts with INITIAL_ANALYSIS_STATE", () => {
    const state = analysisReducer(INITIAL_ANALYSIS_STATE, { type: "RESET" });
    expect(state).toEqual(INITIAL_ANALYSIS_STATE);
  });

  it("ANALYSIS_STARTED → analysisStatus = PROCESSING", () => {
    const state = analysisReducer(INITIAL_ANALYSIS_STATE, {
      type: "EVENT_RECEIVED",
      event: makeEvent({ event_type: EventType.ANALYSIS_STARTED, metadata: { segment_id: "seg-001", duration_ms: 4000 } }),
    });
    expect(state.analysisStatus).toBe("PROCESSING");
    expect(state.analysisError).toBeNull();
  });

  it("ASR_UPDATED → asr state populated + transcript accumulated", () => {
    let state = analysisReducer(INITIAL_ANALYSIS_STATE, {
      type: "EVENT_RECEIVED",
      event: makeEvent({
        event_type: EventType.ASR_UPDATED,
        metadata: { text: "Hello world", language: "en", confidence: 0.95, latency_ms: 320 },
      }),
    });
    expect(state.asr?.text).toBe("Hello world");
    expect(state.asr?.language).toBe("en");
    expect(state.asr?.confidence).toBe(0.95);
    expect(state.transcript).toBe("Hello world");

    state = analysisReducer(state, {
      type: "EVENT_RECEIVED",
      event: makeEvent({
        event_type: EventType.ASR_UPDATED,
        metadata: { text: "from the backend", language: "en", confidence: 0.9, latency_ms: 280 },
      }),
    });
    expect(state.transcript).toBe("Hello world from the backend");
  });

  it("SPEAKER_ANALYSIS_UPDATED → speaker state populated", () => {
    const state = analysisReducer(INITIAL_ANALYSIS_STATE, {
      type: "EVENT_RECEIVED",
      event: makeEvent({
        event_type: EventType.SPEAKER_ANALYSIS_UPDATED,
        severity: "HIGH",
        metadata: { similarity_score: 0.38, status: "AVAILABLE", latency_ms: 450 },
      }),
    });
    expect(state.speaker?.similarityScore).toBe(0.38);
    expect(state.speaker?.status).toBe("AVAILABLE");
    expect(state.speaker?.latencyMs).toBe(450);
  });

  it("SPOOF_ANALYSIS_UPDATED → spoof state populated", () => {
    const state = analysisReducer(INITIAL_ANALYSIS_STATE, {
      type: "EVENT_RECEIVED",
      event: makeEvent({
        event_type: EventType.SPOOF_ANALYSIS_UPDATED,
        severity: "HIGH",
        metadata: {
          spoof_probability: 0.82,
          authenticity_confidence: 0.18,
          indicators: ["vocoder_phase", "spectral_anomaly"],
          latency_ms: 610,
        },
      }),
    });
    expect(state.spoof?.spoofProbability).toBe(0.82);
    expect(state.spoof?.indicators).toEqual(["vocoder_phase", "spectral_anomaly"]);
    expect(state.spoof?.latencyMs).toBe(610);
  });

  it("SOCIAL_ENGINEERING_UPDATED → socialEngineering state populated", () => {
    const state = analysisReducer(INITIAL_ANALYSIS_STATE, {
      type: "EVENT_RECEIVED",
      event: makeEvent({
        event_type: EventType.SOCIAL_ENGINEERING_UPDATED,
        severity: "HIGH",
        metadata: {
          urgency_score: 78,
          findings_count: 2,
          coercion_detected: true,
          financial_request_detected: true,
          credential_request_detected: false,
          latency_ms: 95,
        },
      }),
    });
    expect(state.socialEngineering?.urgencyScore).toBe(78);
    expect(state.socialEngineering?.coercionDetected).toBe(true);
    expect(state.socialEngineering?.financialRequestDetected).toBe(true);
    expect(state.socialEngineering?.credentialRequestDetected).toBe(false);
  });

  it("SECURITY_FINDING → finding added to findings array", () => {
    const evt = makeEvent({
      event_type: EventType.SECURITY_FINDING,
      severity: "HIGH",
      event_id: "evt-find-001",
      message: "FINANCIAL_REQUEST: Urgent wire transfer demand detected",
      metadata: { category: "FINANCIAL_REQUEST", confidence: 0.92 },
    });
    const state = analysisReducer(INITIAL_ANALYSIS_STATE, {
      type: "EVENT_RECEIVED",
      event: evt,
    });
    expect(state.findings).toHaveLength(1);
    expect(state.findings[0].finding_id).toBe("evt-find-001");
    expect(state.findings[0].category).toBe("FINANCIAL_REQUEST");
    expect(state.findings[0].severity).toBe("HIGH");
  });

  it("SECURITY_FINDING deduplication — same event_id not added twice", () => {
    const evt = makeEvent({
      event_type: EventType.SECURITY_FINDING,
      event_id: "evt-dup-001",
      metadata: { category: "AUTHORITY_CLAIM", confidence: 0.75 },
    });
    let state = analysisReducer(INITIAL_ANALYSIS_STATE, {
      type: "EVENT_RECEIVED",
      event: evt,
    });
    state = analysisReducer(state, {
      type: "EVENT_RECEIVED",
      event: evt,
    });
    expect(state.findings).toHaveLength(1);
  });

  it("RISK_UPDATE → riskAssessment updated in real-time", () => {
    const state = analysisReducer(INITIAL_ANALYSIS_STATE, {
      type: "EVENT_RECEIVED",
      event: makeEvent({
        event_type: EventType.RISK_UPDATE,
        severity: "HIGH",
        metadata: {
          risk_score: 84,
          explanation: "High synthetic voice probability combined with urgency signals.",
          pipeline_latency_ms: 1240,
        },
      }),
    });
    expect(state.riskAssessment?.risk_score).toBe(84);
    expect(state.riskAssessment?.risk_level).toBe("HIGH");
    expect(state.pipelineLatency.totalMs).toBe(1240);
  });

  it("ANALYSIS_COMPLETED → analysisStatus = COMPLETED, latencies stored", () => {
    const state = analysisReducer(INITIAL_ANALYSIS_STATE, {
      type: "EVENT_RECEIVED",
      event: makeEvent({
        event_type: EventType.ANALYSIS_COMPLETED,
        metadata: {
          asr_latency_ms: 320,
          speaker_latency_ms: 450,
          spoof_latency_ms: 610,
          social_eng_latency_ms: 95,
          total_pipeline_ms: 1240,
        },
      }),
    });
    expect(state.analysisStatus).toBe("COMPLETED");
    expect(state.pipelineLatency.asrMs).toBe(320);
    expect(state.pipelineLatency.spoofMs).toBe(610);
    expect(state.pipelineLatency.totalMs).toBe(1240);
  });

  it("ANALYSIS_ERROR → analysisStatus = ERROR, analysisError set", () => {
    const state = analysisReducer(INITIAL_ANALYSIS_STATE, {
      type: "EVENT_RECEIVED",
      event: makeEvent({
        event_type: EventType.ANALYSIS_ERROR,
        severity: "HIGH",
        message: "ASR model failed to process audio segment.",
        metadata: { failed_stage: "ASR", error_type: "MODEL_FAILURE" },
      }),
    });
    expect(state.analysisStatus).toBe("ERROR");
    expect(state.analysisError).toBe("ASR model failed to process audio segment.");
  });

  it("reset clears all state back to initial", () => {
    let state = analysisReducer(INITIAL_ANALYSIS_STATE, {
      type: "EVENT_RECEIVED",
      event: makeEvent({
        event_type: EventType.RISK_UPDATE,
        severity: "HIGH",
        metadata: { risk_score: 87, explanation: "High risk", pipeline_latency_ms: 1000 },
      }),
    });
    expect(state.riskAssessment?.risk_score).toBe(87);

    state = analysisReducer(state, { type: "RESET" });
    expect(state).toEqual(INITIAL_ANALYSIS_STATE);
  });

  it("no fake data — clean initial state before any events", () => {
    expect(INITIAL_ANALYSIS_STATE.spoof).toBeNull();
    expect(INITIAL_ANALYSIS_STATE.speaker).toBeNull();
    expect(INITIAL_ANALYSIS_STATE.asr).toBeNull();
    expect(INITIAL_ANALYSIS_STATE.riskAssessment).toBeNull();
    expect(INITIAL_ANALYSIS_STATE.findings).toHaveLength(0);
    expect(INITIAL_ANALYSIS_STATE.transcript).toBe("");
  });

  it("events feed capped at 50", () => {
    let state = INITIAL_ANALYSIS_STATE;
    for (let i = 0; i < 60; i++) {
      state = analysisReducer(state, {
        type: "EVENT_RECEIVED",
        event: makeEvent({
          event_type: EventType.ANALYSIS_COMPLETED,
          event_id: `evt-${i}`,
          metadata: { total_pipeline_ms: i * 10 },
        }),
      });
    }
    expect(state.events.length).toBeLessThanOrEqual(50);
  });
});
