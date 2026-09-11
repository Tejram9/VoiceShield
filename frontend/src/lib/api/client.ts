/**
 * VoiceShield Frontend — HTTP API Client
 *
 * Low-level typed HTTP client wrapping native fetch().
 * - All URLs derive from lib/config.ts (no hardcoded hosts)
 * - Structured VoiceShieldError thrown for every failure category
 * - No `any` anywhere
 * - Timeout: 30s default
 */

import { API_V1_URL } from "../config";
import {
  VoiceShieldError,
  VoiceShieldErrors,
  VoiceShieldErrorCode,
} from "../../types/analysis";
import type {
  AnalysisSession,
  CreateSessionRequest,
  CreateSessionResponse,
  AnalyzeSegmentRequest,
  RiskAssessment,
} from "./types";

const DEFAULT_TIMEOUT_MS = 30_000;

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new VoiceShieldError({
        code: VoiceShieldErrorCode.NETWORK_FAILURE,
        userMessage: `Request timed out after ${timeoutMs / 1000}s.`,
        recoverable: true,
        detail: err,
      });
    }
    // Network-level failure (offline, DNS, etc.)
    throw VoiceShieldErrors.networkFailure(err);
  } finally {
    clearTimeout(timer);
  }
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail: unknown = response.statusText;
    try {
      const body = await response.json() as Record<string, unknown>;
      if (body && typeof body.detail !== "undefined") detail = body.detail;
    } catch {
      // keep statusText fallback
    }

    if (response.status === 404) {
      throw new VoiceShieldError({
        code: VoiceShieldErrorCode.INVALID_SESSION,
        userMessage: `The requested session was not found (HTTP 404).`,
        recoverable: true,
        detail,
      });
    }
    if (response.status >= 500) {
      throw VoiceShieldErrors.backendUnavailable(detail);
    }
    throw VoiceShieldErrors.httpError(response.status, detail);
  }

  try {
    return (await response.json()) as T;
  } catch (err: unknown) {
    throw VoiceShieldErrors.malformedResponse(err);
  }
}

// ---------------------------------------------------------------------------
// Generic helpers (used by sessions.ts)
// ---------------------------------------------------------------------------

export async function apiGet<T>(path: string): Promise<T> {
  const url = `${API_V1_URL}${path}`;
  const response = await fetchWithTimeout(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  return parseJsonResponse<T>(response);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const url = `${API_V1_URL}${path}`;
  const response = await fetchWithTimeout(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  return parseJsonResponse<T>(response);
}

// ---------------------------------------------------------------------------
// Named session functions (kept for backward compatibility)
// New code should prefer lib/api/sessions.ts
// ---------------------------------------------------------------------------

export async function createSession(
  params: CreateSessionRequest = {}
): Promise<CreateSessionResponse> {
  return apiPost<CreateSessionResponse>("/analysis/sessions", params);
}

export async function getSession(sessionId: string): Promise<AnalysisSession> {
  return apiGet<AnalysisSession>(
    `/analysis/sessions/${encodeURIComponent(sessionId)}`
  );
}

export async function analyzeSegment(
  sessionId: string,
  payload: AnalyzeSegmentRequest = {}
): Promise<RiskAssessment> {
  return apiPost<RiskAssessment>(
    `/analysis/sessions/${encodeURIComponent(sessionId)}/analyze`,
    payload
  );
}
