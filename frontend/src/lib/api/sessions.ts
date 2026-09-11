/**
 * VoiceShield Frontend — Session API Functions
 *
 * Named session-specific functions that wrap the raw HTTP client.
 * These are the intended public API surface for session operations.
 *
 * All field names exactly match the backend Pydantic models.
 * Source of truth: docs/API_CONTRACT.md
 */

import { apiGet, apiPost } from "./client";
import type {
  AnalysisSession,
  AnalyzeSegmentRequest,
  CreateSessionRequest,
  CreateSessionResponse,
  RiskAssessment,
} from "./types";

/**
 * Create a new VoiceShield security analysis session.
 * POST /api/v1/analysis/sessions
 *
 * The backend generates a session_id in the format VS-{year}-{hex} if
 * session_id is omitted from the request.
 */
export async function createAnalysisSession(
  params: CreateSessionRequest = {}
): Promise<CreateSessionResponse> {
  return apiPost<CreateSessionResponse>("/analysis/sessions", params);
}

/**
 * Retrieve the current state of a security session.
 * GET /api/v1/analysis/sessions/{session_id}
 *
 * Returns latest risk assessment, event history, and session metadata.
 * Throws VoiceShieldError with code INVALID_SESSION if not found (HTTP 404).
 */
export async function getAnalysisSession(
  sessionId: string
): Promise<AnalysisSession> {
  return apiGet<AnalysisSession>(
    `/analysis/sessions/${encodeURIComponent(sessionId)}`
  );
}

/**
 * Submit an audio segment for real AI pipeline analysis.
 * POST /api/v1/analysis/sessions/{session_id}/analyze
 *
 * The backend accepts optional audio_base64 (base64-encoded PCM-S16LE).
 * If omitted, the pipeline runs on synthetic/silence audio.
 *
 * Returns a RiskAssessment with contributing_signals and recommended_action.
 * Also broadcasts SecurityEvent stream over the session's WebSocket.
 */
export async function analyzeAudioSegment(
  sessionId: string,
  payload: AnalyzeSegmentRequest = {}
): Promise<RiskAssessment> {
  return apiPost<RiskAssessment>(
    `/analysis/sessions/${encodeURIComponent(sessionId)}/analyze`,
    {
      sample_rate: 16000,
      duration_ms: 4000.0,
      format: "pcm_s16le",
      ...payload,
    }
  );
}
