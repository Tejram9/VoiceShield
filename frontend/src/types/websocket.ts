/**
 * VoiceShield Frontend — Discriminated Union WebSocket Event Types
 *
 * Every event type the backend can broadcast is represented here as a
 * distinct interface so TypeScript can narrow payload fields by event_type.
 *
 * Source of truth: docs/API_CONTRACT.md § 2. WebSocket Real-Time Event Stream
 * Backend schema: backend/app/schemas/events.py
 *
 * Base envelope fields (common to ALL events):
 *   event_id   — unique event identifier
 *   session_id — owning session
 *   timestamp  — human-readable UTC string from backend
 *   event_type — discriminant field
 *   source     — originating AI component
 *   severity   — LOW | MEDIUM | HIGH
 *   message    — human-readable description (safe to display)
 *   confidence — optional 0.0–1.0
 *   metadata   — event-type-specific payload (typed per variant below)
 */

import type { RiskLevel, RiskSignal } from "../lib/api/types";

// ---------------------------------------------------------------------------
// Shared envelope
// ---------------------------------------------------------------------------

interface BaseEvent {
  event_id: string;
  session_id: string;
  timestamp: string;
  source: string;
  severity: RiskLevel;
  message: string;
  confidence?: number;
}

// ---------------------------------------------------------------------------
// Per-event metadata shapes (from actual backend SecurityEvent.metadata)
// ---------------------------------------------------------------------------

export interface AnalysisStartedMeta {
  segment_id: string;
  duration_ms: number;
  sample_rate: number;
}

export interface AsrUpdatedMeta {
  text: string;
  language: string;
  confidence: number;
  duration_ms: number;
  latency_ms?: number;
}

export interface SpeakerAnalysisUpdatedMeta {
  similarity_score: number;
  verification_state: string;
  model_name: string;
  latency_ms?: number;
}

export interface SpoofAnalysisUpdatedMeta {
  spoof_probability: number;
  authenticity_confidence: number;
  indicators: string[];
  model_name: string;
  latency_ms?: number;
}

export interface SocialEngineeringUpdatedMeta {
  urgency_score: number;
  coercion_detected: boolean;
  financial_request_detected: boolean;
  credential_request_detected: boolean;
  latency_ms?: number;
}

export interface SecurityFindingMeta {
  category: string;
  confidence: number;
  evidence?: string;
}

export interface RiskUpdateMeta {
  risk_score: number;
  explanation: string;
  contributing_signals?: RiskSignal[];
  pipeline_latency_ms?: number;
}

export interface AnalysisCompletedMeta {
  total_latency_ms: number;
  stage_latencies?: Record<string, number>;
  risk_score: number;
}

export interface AnalysisErrorMeta {
  failed_stage?: string;
  error_type?: string;
}

// ---------------------------------------------------------------------------
// Discriminated union — one interface per event_type
// ---------------------------------------------------------------------------

export interface AnalysisStartedEvent extends BaseEvent {
  event_type: "ANALYSIS_STARTED";
  metadata: AnalysisStartedMeta;
}

export interface AsrUpdatedEvent extends BaseEvent {
  event_type: "ASR_UPDATED";
  metadata: AsrUpdatedMeta;
}

export interface SpeakerAnalysisUpdatedEvent extends BaseEvent {
  event_type: "SPEAKER_ANALYSIS_UPDATED";
  metadata: SpeakerAnalysisUpdatedMeta;
}

export interface SpoofAnalysisUpdatedEvent extends BaseEvent {
  event_type: "SPOOF_ANALYSIS_UPDATED";
  metadata: SpoofAnalysisUpdatedMeta;
}

export interface SocialEngineeringUpdatedEvent extends BaseEvent {
  event_type: "SOCIAL_ENGINEERING_UPDATED";
  metadata: SocialEngineeringUpdatedMeta;
}

export interface SecurityFindingEvent extends BaseEvent {
  event_type: "SECURITY_FINDING";
  metadata: SecurityFindingMeta;
}

export interface RiskUpdateEvent extends BaseEvent {
  event_type: "RISK_UPDATE";
  metadata: RiskUpdateMeta;
}

export interface AnalysisCompletedEvent extends BaseEvent {
  event_type: "ANALYSIS_COMPLETED";
  metadata: AnalysisCompletedMeta;
}

export interface AnalysisErrorEvent extends BaseEvent {
  event_type: "ANALYSIS_ERROR";
  metadata: AnalysisErrorMeta;
}

/**
 * The full discriminated union.
 * Switching on `event.event_type` narrows all metadata fields.
 *
 * @example
 * function handle(event: AnalysisEvent) {
 *   if (event.event_type === "ASR_UPDATED") {
 *     console.log(event.metadata.text); // ✅ typed
 *   }
 * }
 */
export type AnalysisEvent =
  | AnalysisStartedEvent
  | AsrUpdatedEvent
  | SpeakerAnalysisUpdatedEvent
  | SpoofAnalysisUpdatedEvent
  | SocialEngineeringUpdatedEvent
  | SecurityFindingEvent
  | RiskUpdateEvent
  | AnalysisCompletedEvent
  | AnalysisErrorEvent;

/** All valid event_type discriminants */
export type AnalysisEventType = AnalysisEvent["event_type"];

export const KNOWN_EVENT_TYPES = new Set<string>([
  "ANALYSIS_STARTED",
  "ASR_UPDATED",
  "SPEAKER_ANALYSIS_UPDATED",
  "SPOOF_ANALYSIS_UPDATED",
  "SOCIAL_ENGINEERING_UPDATED",
  "SECURITY_FINDING",
  "RISK_UPDATE",
  "ANALYSIS_COMPLETED",
  "ANALYSIS_ERROR",
]);

// ---------------------------------------------------------------------------
// Client -> Server Upstream Message Schemas (Prompt 11 Audio Streaming)
// ---------------------------------------------------------------------------

export interface AudioChunkMessage {
  type: "audio_chunk";
  session_id: string;
  sequence: number;
  sample_rate: number;
  channels: number;
  format: "pcm_s16le" | "wav";
  duration_ms: number;
  audio_base64: string;
}
