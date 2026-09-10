/**
 * VoiceShield — Analysis State Reducer Tests
 *
 * Tests the useAnalysisState hook's event-to-state mapping.
 * All 8 WebSocket event types are exercised.
 * No mocks required — tests the pure reducer function directly.
 */

import { renderHook, act } from "@testing-library/react";
import { useAnalysisState, INITIAL_ANALYSIS_STATE } from "@/hooks/use-analysis-state";
import type { SecurityEvent } from "@/lib/api/types";
import { EventType } from "@/lib/api/types";

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
    const { result } = renderHook(() => useAnalysisState());
    expect(result.current.state).toEqual(INITIAL_ANALYSIS_STATE);
  });

  it("ANALYSIS_STARTED → analysisStatus = PROCESSING", () => {
    const { result } = renderHook(() => useAnalysisState());
    act(() => {
      result.current.processEvent(
        makeEvent({ event_type: EventType.ANALYSIS_STARTED, metadata: { segment_id: "seg-001", duration_ms: 4000 } })
      );
    });
    expect(result.current.state.analysisStatus).toBe("PROCESSING");
    expect(result.current.state.analysisError).toBeNull();
  });

  it("ASR_UPDATED → asr state populated + transcript accumulated", () => {
    const { result } = renderHook(() => useAnalysisState());

    act(() => {
      result.current.processEvent(
        makeEvent({
          event_type: EventType.ASR_UPDATED,
          metadata: { text: "Hello world", language: "en", confidence: 0.95, latency_ms: 320 },
        })
      );
    });
    expect(result.current.state.asr?.text).toBe("Hello world");
    expect(result.current.state.asr?.language).toBe("en");
    expect(result.current.state.asr?.confidence).toBe(0.95);
    expect(result.current.state.transcript).toBe("Hello world");

    act(() => {
      result.current.processEvent(
        makeEvent({
          event_type: EventType.ASR_UPDATED,
          metadata: { text: "from the backend", language: "en", confidence: 0.9, latency_ms: 280 },
        })
      );
    });
    expect(result.current.state.transcript).toBe("Hello world from the backend");
  });

  it("SPEAKER_ANALYSIS_UPDATED → speaker state populated", () => {
    const { result } = renderHook(() => useAnalysisState());
    act(() => {
      result.current.processEvent(
        makeEvent({
          event_type: EventType.SPEAKER_ANALYSIS_UPDATED,
          severity: "HIGH",
          metadata: { similarity_score: 0.38, status: "AVAILABLE", latency_ms: 450 },
        })
      );
    });
    expect(result.current.state.speaker?.similarityScore).toBe(0.38);
    expect(result.current.state.speaker?.status).toBe("AVAILABLE");
    expect(result.current.state.speaker?.latencyMs).toBe(450);
  });

  it("SPOOF_ANALYSIS_UPDATED → spoof state populated", () => {
    const { result } = renderHook(() => useAnalysisState());
    act(() => {
      result.current.processEvent(
        makeEvent({
          event_type: EventType.SPOOF_ANALYSIS_UPDATED,
          severity: "HIGH",
          metadata: {
            spoof_probability: 0.82,
            authenticity_confidence: 0.18,
            indicators: ["vocoder_phase", "spectral_anomaly"],
            latency_ms: 610,
          },
        })
      );
    });
    expect(result.current.state.spoof?.spoofProbability).toBe(0.82);
    expect(result.current.state.spoof?.indicators).toEqual(["vocoder_phase", "spectral_anomaly"]);
    expect(result.current.state.spoof?.latencyMs).toBe(610);
  });

  it("SOCIAL_ENGINEERING_UPDATED → socialEngineering state populated", () => {
    const { result } = renderHook(() => useAnalysisState());
    act(() => {
      result.current.processEvent(
        makeEvent({
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
        })
      );
    });
    expect(result.current.state.socialEngineering?.urgencyScore).toBe(78);
    expect(result.current.state.socialEngineering?.coercionDetected).toBe(true);
    expect(result.current.state.socialEngineering?.financialRequestDetected).toBe(true);
    expect(result.current.state.socialEngineering?.credentialRequestDetected).toBe(false);
  });

  it("SECURITY_FINDING → finding added to findings array", () => {
    const { result } = renderHook(() => useAnalysisState());
    const evt = makeEvent({
      event_type: EventType.SECURITY_FINDING,
      severity: "HIGH",
      event_id: "evt-find-001",
      message: "FINANCIAL_REQUEST: Urgent wire transfer demand detected",
      metadata: { category: "FINANCIAL_REQUEST", confidence: 0.92 },
    });
    act(() => {
      result.current.processEvent(evt);
    });
    expect(result.current.state.findings).toHaveLength(1);
    expect(result.current.state.findings[0].finding_id).toBe("evt-find-001");
    expect(result.current.state.findings[0].category).toBe("FINANCIAL_REQUEST");
    expect(result.current.state.findings[0].severity).toBe("HIGH");
  });

  it("SECURITY_FINDING deduplication — same event_id not added twice", () => {
    const { result } = renderHook(() => useAnalysisState());
    const evt = makeEvent({
      event_type: EventType.SECURITY_FINDING,
      event_id: "evt-dup-001",
      metadata: { category: "AUTHORITY_CLAIM", confidence: 0.75 },
    });
    act(() => {
      result.current.processEvent(evt);
      result.current.processEvent(evt);
    });
    expect(result.current.state.findings).toHaveLength(1);
  });

  it("RISK_UPDATE → riskAssessment updated in real-time", () => {
    const { result } = renderHook(() => useAnalysisState());
    act(() => {
      result.current.processEvent(
        makeEvent({
          event_type: EventType.RISK_UPDATE,
          severity: "HIGH",
          metadata: {
            risk_score: 84,
            explanation: "High synthetic voice probability combined with urgency signals.",
            pipeline_latency_ms: 1240,
          },
        })
      );
    });
    expect(result.current.state.riskAssessment?.risk_score).toBe(84);
    expect(result.current.state.riskAssessment?.risk_level).toBe("HIGH");
    expect(result.current.state.pipelineLatency.totalMs).toBe(1240);
  });

  it("ANALYSIS_COMPLETED → analysisStatus = COMPLETED, latencies stored", () => {
    const { result } = renderHook(() => useAnalysisState());
    act(() => {
      result.current.processEvent(
        makeEvent({
          event_type: EventType.ANALYSIS_COMPLETED,
          metadata: {
            asr_latency_ms: 320,
            speaker_latency_ms: 450,
            spoof_latency_ms: 610,
            social_eng_latency_ms: 95,
            total_pipeline_ms: 1240,
          },
        })
      );
    });
    expect(result.current.state.analysisStatus).toBe("COMPLETED");
    expect(result.current.state.pipelineLatency.asrMs).toBe(320);
    expect(result.current.state.pipelineLatency.spoofMs).toBe(610);
    expect(result.current.state.pipelineLatency.totalMs).toBe(1240);
  });

  it("ANALYSIS_ERROR → analysisStatus = ERROR, analysisError set", () => {
    const { result } = renderHook(() => useAnalysisState());
    act(() => {
      result.current.processEvent(
        makeEvent({
          event_type: EventType.ANALYSIS_ERROR,
          severity: "HIGH",
          message: "ASR model failed to process audio segment.",
          metadata: { failed_stage: "ASR", error_type: "MODEL_FAILURE" },
        })
      );
    });
    expect(result.current.state.analysisStatus).toBe("ERROR");
    expect(result.current.state.analysisError).toBe("ASR model failed to process audio segment.");
  });

  it("reset() clears all state back to initial", () => {
    const { result } = renderHook(() => useAnalysisState());
    act(() => {
      result.current.processEvent(
        makeEvent({
          event_type: EventType.RISK_UPDATE,
          severity: "HIGH",
          metadata: { risk_score: 87, explanation: "High risk", pipeline_latency_ms: 1000 },
        })
      );
    });
    expect(result.current.state.riskAssessment?.risk_score).toBe(87);

    act(() => {
      result.current.reset();
    });
    expect(result.current.state).toEqual(INITIAL_ANALYSIS_STATE);
  });

  it("no fake data — no score when backend provides none", () => {
    const { result } = renderHook(() => useAnalysisState());
    // Fresh state — no events sent
    expect(result.current.state.spoof).toBeNull();
    expect(result.current.state.speaker).toBeNull();
    expect(result.current.state.asr).toBeNull();
    expect(result.current.state.riskAssessment).toBeNull();
    expect(result.current.state.findings).toHaveLength(0);
    expect(result.current.state.transcript).toBe("");
  });

  it("events feed capped at 50", () => {
    const { result } = renderHook(() => useAnalysisState());
    act(() => {
      for (let i = 0; i < 60; i++) {
        result.current.processEvent(
          makeEvent({
            event_type: EventType.ANALYSIS_COMPLETED,
            event_id: `evt-${i}`,
            metadata: { total_pipeline_ms: i * 10 },
          })
        );
      }
    });
    expect(result.current.state.events.length).toBeLessThanOrEqual(50);
  });
});
