"use client";

/**
 * VoiceShield Frontend — Analysis State Reducer Hook
 *
 * Single source of truth for all AI pipeline state derived from WebSocket events.
 * Consumes the discriminated-union AnalysisEvent and maps each event type to
 * precise typed state fields — no duck-typing, no metadata field guessing.
 *
 * Separation of concerns:
 *   - This hook owns ALL event-to-state mapping logic.
 *   - UI components consume the clean state object, never raw events.
 *   - The session hook and WebSocket hook delegate to this hook.
 *
 * State is intentionally flat and observable — one field per AI signal.
 */

import { useReducer, useCallback } from "react";
import type { SecurityFinding, SecurityEvent, RiskAssessment } from "../lib/api/types";
import { EventType } from "../lib/api/types";
import type { AnalysisStatus } from "../types/analysis";

// ---------------------------------------------------------------------------
// Per-signal state shapes (derived from actual backend metadata contracts)
// ---------------------------------------------------------------------------

export interface ASRState {
  text: string;
  language: string;
  confidence: number;
  latencyMs: number | null;
  updatedAt: string;
}

export interface SpeakerState {
  /** 0.0 = total mismatch, 1.0 = exact match */
  similarityScore: number;
  /** "AVAILABLE" | "NO_REFERENCE" | "ERROR" — from backend speaker provider */
  status: string;
  latencyMs: number | null;
  updatedAt: string;
}

export interface SpoofState {
  /** 0.0 = authentic, 1.0 = synthetic */
  spoofProbability: number;
  authenticityConfidence: number;
  indicators: string[];
  latencyMs: number | null;
  updatedAt: string;
}

export interface SocialEngineeringState {
  urgencyScore: number;
  coercionDetected: boolean;
  financialRequestDetected: boolean;
  credentialRequestDetected: boolean;
  findingsCount: number;
  latencyMs: number | null;
  updatedAt: string;
}

export interface PipelineLatency {
  asrMs: number | null;
  speakerMs: number | null;
  spoofMs: number | null;
  socialEngMs: number | null;
  totalMs: number | null;
}

// ---------------------------------------------------------------------------
// Full analysis state
// ---------------------------------------------------------------------------

export interface AnalysisState {
  /** null = no analysis run yet */
  asr: ASRState | null;
  /** null = no analysis run yet */
  speaker: SpeakerState | null;
  /** null = no analysis run yet */
  spoof: SpoofState | null;
  /** null = no analysis run yet */
  socialEngineering: SocialEngineeringState | null;
  /** Latest fused risk assessment from RiskFusionEngine */
  riskAssessment: RiskAssessment | null;
  /** Typed security findings (populated by SECURITY_FINDING events) */
  findings: SecurityFinding[];
  /** All raw WebSocket events for the events feed (newest first, max 50) */
  events: SecurityEvent[];
  /** Running transcript — accumulated across all ASR_UPDATED events */
  transcript: string;
  /** Current analysis cycle status */
  analysisStatus: AnalysisStatus;
  /** Last event timestamp received */
  lastAnalyzedAt: string | null;
  /** Most recent full pipeline timing from ANALYSIS_COMPLETED */
  pipelineLatency: PipelineLatency;
  /** Any analysis-level error message (from ANALYSIS_ERROR events) */
  analysisError: string | null;
}

export const INITIAL_ANALYSIS_STATE: AnalysisState = {
  asr: null,
  speaker: null,
  spoof: null,
  socialEngineering: null,
  riskAssessment: null,
  findings: [],
  events: [],
  transcript: "",
  analysisStatus: "IDLE",
  lastAnalyzedAt: null,
  pipelineLatency: {
    asrMs: null,
    speakerMs: null,
    spoofMs: null,
    socialEngMs: null,
    totalMs: null,
  },
  analysisError: null,
};

// ---------------------------------------------------------------------------
// Action types
// ---------------------------------------------------------------------------

type AnalysisAction =
  | { type: "EVENT_RECEIVED"; event: SecurityEvent }
  | { type: "RESET" }
  | { type: "SET_RISK_ASSESSMENT"; assessment: RiskAssessment };

// ---------------------------------------------------------------------------
// Reducer — all event-to-state mapping lives here
// ---------------------------------------------------------------------------

function analysisReducer(state: AnalysisState, action: AnalysisAction): AnalysisState {
  switch (action.type) {
    case "RESET":
      return { ...INITIAL_ANALYSIS_STATE };

    case "SET_RISK_ASSESSMENT":
      return {
        ...state,
        riskAssessment: action.assessment,
        findings: action.assessment.contributing_signals
          ? state.findings
          : state.findings,
      };

    case "EVENT_RECEIVED": {
      const evt = action.event;
      const meta = evt.metadata ?? {};

      // Always append to raw events feed (newest first, cap at 50)
      const updatedEvents: SecurityEvent[] = [evt, ...state.events.slice(0, 49)];

      switch (evt.event_type) {
        case EventType.ANALYSIS_STARTED:
          return {
            ...state,
            events: updatedEvents,
            analysisStatus: "PROCESSING",
            analysisError: null,
            lastAnalyzedAt: evt.timestamp,
          };

        case EventType.ASR_UPDATED: {
          const text = typeof meta.text === "string" ? meta.text : "";
          const language = typeof meta.language === "string" ? meta.language : "en";
          const confidence = typeof meta.confidence === "number" ? meta.confidence : 0;
          const latencyMs = typeof meta.latency_ms === "number" ? meta.latency_ms : null;
          return {
            ...state,
            events: updatedEvents,
            lastAnalyzedAt: evt.timestamp,
            asr: {
              text,
              language,
              confidence,
              latencyMs,
              updatedAt: evt.timestamp,
            },
            // Accumulate transcript (append with space separator)
            transcript: state.transcript
              ? `${state.transcript} ${text}`.trim()
              : text,
          };
        }

        case EventType.SPEAKER_ANALYSIS_UPDATED: {
          const similarityScore =
            typeof meta.similarity_score === "number" ? meta.similarity_score : 0;
          const spkStatus =
            typeof meta.status === "string" ? meta.status : "UNKNOWN";
          const latencyMs = typeof meta.latency_ms === "number" ? meta.latency_ms : null;
          return {
            ...state,
            events: updatedEvents,
            lastAnalyzedAt: evt.timestamp,
            speaker: {
              similarityScore,
              status: spkStatus,
              latencyMs,
              updatedAt: evt.timestamp,
            },
          };
        }

        case EventType.SPOOF_ANALYSIS_UPDATED: {
          const spoofProbability =
            typeof meta.spoof_probability === "number" ? meta.spoof_probability : 0;
          const authenticityConfidence =
            typeof meta.authenticity_confidence === "number"
              ? meta.authenticity_confidence
              : 0;
          const rawIndicators = Array.isArray(meta.indicators) ? meta.indicators : [];
          const indicators = rawIndicators.filter(
            (v): v is string => typeof v === "string"
          );
          const latencyMs = typeof meta.latency_ms === "number" ? meta.latency_ms : null;
          return {
            ...state,
            events: updatedEvents,
            lastAnalyzedAt: evt.timestamp,
            spoof: {
              spoofProbability,
              authenticityConfidence,
              indicators,
              latencyMs,
              updatedAt: evt.timestamp,
            },
          };
        }

        case EventType.SOCIAL_ENGINEERING_UPDATED: {
          const urgencyScore =
            typeof meta.urgency_score === "number" ? meta.urgency_score : 0;
          const findingsCount =
            typeof meta.findings_count === "number" ? meta.findings_count : 0;
          const latencyMs = typeof meta.latency_ms === "number" ? meta.latency_ms : null;
          return {
            ...state,
            events: updatedEvents,
            lastAnalyzedAt: evt.timestamp,
            socialEngineering: {
              urgencyScore,
              coercionDetected: Boolean(meta.coercion_detected),
              financialRequestDetected: Boolean(meta.financial_request_detected),
              credentialRequestDetected: Boolean(meta.credential_request_detected),
              findingsCount,
              latencyMs,
              updatedAt: evt.timestamp,
            },
          };
        }

        case EventType.SECURITY_FINDING: {
          const finding: SecurityFinding = {
            finding_id: evt.event_id,
            title: evt.message.split(":")[0]?.trim() || "Security Finding",
            category:
              typeof meta.category === "string" ? meta.category : "SECURITY_INDICATOR",
            severity: evt.severity,
            confidence:
              typeof meta.confidence === "number" ? meta.confidence : 0.85,
            timestamp: evt.timestamp,
            details: evt.message,
          };
          // Deduplicate by finding_id
          const dedupedFindings = [
            finding,
            ...state.findings.filter((f) => f.finding_id !== finding.finding_id),
          ];
          return {
            ...state,
            events: updatedEvents,
            lastAnalyzedAt: evt.timestamp,
            findings: dedupedFindings,
          };
        }

        case EventType.RISK_UPDATE: {
          const riskScore =
            typeof meta.risk_score === "number" ? meta.risk_score : 0;
          const explanation =
            typeof meta.explanation === "string" ? meta.explanation : "";
          const latencyMs =
            typeof meta.pipeline_latency_ms === "number"
              ? meta.pipeline_latency_ms
              : null;

          // Build a minimal RiskAssessment from the RISK_UPDATE event
          // (the full assessment from REST response is more complete, but this
          //  keeps the UI updated in real-time as events arrive)
          const partialAssessment: RiskAssessment = state.riskAssessment
            ? {
                ...state.riskAssessment,
                risk_score: riskScore,
                risk_level: evt.severity,
                explanation,
              }
            : {
                risk_score: riskScore,
                risk_level: evt.severity,
                contributing_signals: [],
                explanation,
                recommended_action: "MONITOR",
              };

          return {
            ...state,
            events: updatedEvents,
            lastAnalyzedAt: evt.timestamp,
            riskAssessment: partialAssessment,
            // Update pipeline latency total from RISK_UPDATE
            pipelineLatency: {
              ...state.pipelineLatency,
              totalMs: latencyMs,
            },
          };
        }

        case EventType.ANALYSIS_COMPLETED: {
          const asrMs =
            typeof meta.asr_latency_ms === "number" ? meta.asr_latency_ms : null;
          const speakerMs =
            typeof meta.speaker_latency_ms === "number"
              ? meta.speaker_latency_ms
              : null;
          const spoofMs =
            typeof meta.spoof_latency_ms === "number" ? meta.spoof_latency_ms : null;
          const socialEngMs =
            typeof meta.social_eng_latency_ms === "number"
              ? meta.social_eng_latency_ms
              : null;
          const totalMs =
            typeof meta.total_pipeline_ms === "number"
              ? meta.total_pipeline_ms
              : null;

          return {
            ...state,
            events: updatedEvents,
            lastAnalyzedAt: evt.timestamp,
            analysisStatus: "COMPLETED",
            pipelineLatency: {
              asrMs,
              speakerMs,
              spoofMs,
              socialEngMs,
              totalMs,
            },
          };
        }

        case EventType.ANALYSIS_ERROR:
          return {
            ...state,
            events: updatedEvents,
            lastAnalyzedAt: evt.timestamp,
            analysisStatus: "ERROR",
            analysisError: evt.message || "Analysis pipeline encountered an error.",
          };

        default:
          // Unknown event types — append to events feed, no state mutation
          return { ...state, events: updatedEvents };
      }
    }

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Hook interface
// ---------------------------------------------------------------------------

export interface UseAnalysisStateReturn {
  state: AnalysisState;
  /** Process a raw SecurityEvent from the WebSocket — maps to typed state */
  processEvent: (event: SecurityEvent) => void;
  /** Override risk assessment from REST response (more complete than WS event) */
  setRiskAssessment: (assessment: RiskAssessment) => void;
  /** Clear all analysis state (new session) */
  reset: () => void;
}

/**
 * useAnalysisState — typed analysis state reducer.
 *
 * Feed SecurityEvent objects from the WebSocket into processEvent().
 * Read the clean state fields in UI components — never parse metadata there.
 */
export function useAnalysisState(): UseAnalysisStateReturn {
  const [state, dispatch] = useReducer(analysisReducer, INITIAL_ANALYSIS_STATE);

  const processEvent = useCallback((event: SecurityEvent) => {
    dispatch({ type: "EVENT_RECEIVED", event });
  }, []);

  const setRiskAssessment = useCallback((assessment: RiskAssessment) => {
    dispatch({ type: "SET_RISK_ASSESSMENT", assessment });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return { state, processEvent, setRiskAssessment, reset };
}
