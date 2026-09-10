/**
 * VoiceShield Frontend — Analysis & Connection State Types
 *
 * Canonical state definitions that drive the production UI and hooks.
 * No UI rendering logic belongs here.
 */

// ---------------------------------------------------------------------------
// Connection & Analysis State
// ---------------------------------------------------------------------------

/**
 * Full lifecycle of a VoiceShield analysis session from the frontend's view.
 * These states drive UI, not just the WebSocket connection.
 */
export type AnalysisConnectionState =
  | "INITIALIZING_SESSION"  // Creating session via REST POST
  | "CONNECTING"            // WebSocket handshake in progress
  | "CONNECTED"             // WebSocket open, idle
  | "WAITING_FOR_AUDIO"     // Session ready, no audio submitted yet
  | "ANALYZING"             // Audio segment submitted, pipeline running
  | "RECEIVING_FINDINGS"    // SECURITY_FINDING events arriving
  | "RISK_UPDATED"          // RISK_UPDATE event received
  | "COMPLETED"             // ANALYSIS_COMPLETED received for latest segment
  | "CONNECTION_LOST"       // Unexpected WebSocket disconnect
  | "FAILED";               // Unrecoverable error (max reconnects exceeded, etc.)

/** Narrower status scoped to a single analysis cycle */
export type AnalysisStatus = "IDLE" | "PROCESSING" | "COMPLETED" | "ERROR";

// ---------------------------------------------------------------------------
// Structured Error System
// ---------------------------------------------------------------------------

/**
 * Exhaustive list of error categories the frontend must distinguish.
 * Each code maps to a user-displayable message and a recovery strategy.
 */
export const VoiceShieldErrorCode = {
  // Infrastructure
  BACKEND_UNAVAILABLE:       "BACKEND_UNAVAILABLE",
  NETWORK_FAILURE:           "NETWORK_FAILURE",
  HTTP_ERROR:                "HTTP_ERROR",
  // Session
  INVALID_SESSION:           "INVALID_SESSION",
  SESSION_INIT_FAILED:       "SESSION_INIT_FAILED",
  // WebSocket
  WEBSOCKET_DISCONNECTED:    "WEBSOCKET_DISCONNECTED",
  WEBSOCKET_ERROR:           "WEBSOCKET_ERROR",
  WEBSOCKET_MAX_RETRIES:     "WEBSOCKET_MAX_RETRIES",
  // Analysis pipeline
  AI_PROVIDER_UNAVAILABLE:   "AI_PROVIDER_UNAVAILABLE",
  ANALYSIS_FAILED:           "ANALYSIS_FAILED",
  AUDIO_PROCESSING_FAILED:   "AUDIO_PROCESSING_FAILED",
  // Data
  MALFORMED_RESPONSE:        "MALFORMED_RESPONSE",
  MALFORMED_EVENT:           "MALFORMED_EVENT",
  // Audio capture
  MIC_PERMISSION_DENIED:     "MIC_PERMISSION_DENIED",
  MIC_NOT_FOUND:             "MIC_NOT_FOUND",
  MIC_UNSUPPORTED:           "MIC_UNSUPPORTED",
} as const;

export type VoiceShieldErrorCode =
  (typeof VoiceShieldErrorCode)[keyof typeof VoiceShieldErrorCode];

/**
 * Structured error — never expose raw backend stack traces or credentials.
 * The `detail` field is for internal logging only; `userMessage` is safe to display.
 */
export class VoiceShieldError extends Error {
  readonly code: VoiceShieldErrorCode;
  /** Safe, non-technical message for the UI */
  readonly userMessage: string;
  /** Whether the error is likely transient and a retry makes sense */
  readonly recoverable: boolean;
  /** Original error or HTTP status, for internal logging only */
  readonly detail?: unknown;

  constructor(opts: {
    code: VoiceShieldErrorCode;
    userMessage: string;
    recoverable: boolean;
    detail?: unknown;
    message?: string;
  }) {
    super(opts.message ?? opts.userMessage);
    this.name = "VoiceShieldError";
    this.code = opts.code;
    this.userMessage = opts.userMessage;
    this.recoverable = opts.recoverable;
    this.detail = opts.detail;
  }
}

/** Factory helpers for common error cases */
export const VoiceShieldErrors = {
  backendUnavailable: (detail?: unknown) =>
    new VoiceShieldError({
      code: VoiceShieldErrorCode.BACKEND_UNAVAILABLE,
      userMessage: "VoiceShield backend is not reachable. Ensure the FastAPI server is running.",
      recoverable: true,
      detail,
    }),

  networkFailure: (detail?: unknown) =>
    new VoiceShieldError({
      code: VoiceShieldErrorCode.NETWORK_FAILURE,
      userMessage: "Network connection lost. Check your connection and retry.",
      recoverable: true,
      detail,
    }),

  httpError: (status: number, detail?: unknown) =>
    new VoiceShieldError({
      code: VoiceShieldErrorCode.HTTP_ERROR,
      userMessage: `Backend returned an error (HTTP ${status}). Check backend logs.`,
      recoverable: status >= 500,
      detail,
      message: `HTTP ${status}`,
    }),

  invalidSession: (sessionId: string) =>
    new VoiceShieldError({
      code: VoiceShieldErrorCode.INVALID_SESSION,
      userMessage: `Session ${sessionId} was not found or has expired.`,
      recoverable: true,
    }),

  analysisFailed: (detail?: unknown) =>
    new VoiceShieldError({
      code: VoiceShieldErrorCode.ANALYSIS_FAILED,
      userMessage: "AI analysis pipeline encountered an error. Results may be incomplete.",
      recoverable: true,
      detail,
    }),

  malformedResponse: (detail?: unknown) =>
    new VoiceShieldError({
      code: VoiceShieldErrorCode.MALFORMED_RESPONSE,
      userMessage: "Received an unexpected response format from the backend.",
      recoverable: false,
      detail,
    }),

  malformedEvent: (detail?: unknown) =>
    new VoiceShieldError({
      code: VoiceShieldErrorCode.MALFORMED_EVENT,
      userMessage: "Received an unrecognised event from the analysis stream.",
      recoverable: true,
      detail,
    }),

  websocketDisconnected: () =>
    new VoiceShieldError({
      code: VoiceShieldErrorCode.WEBSOCKET_DISCONNECTED,
      userMessage: "Real-time event stream disconnected. Attempting to reconnect.",
      recoverable: true,
    }),

  websocketMaxRetries: (attempts: number) =>
    new VoiceShieldError({
      code: VoiceShieldErrorCode.WEBSOCKET_MAX_RETRIES,
      userMessage: `Could not reconnect after ${attempts} attempts. Refresh the page to retry.`,
      recoverable: false,
    }),

  audioProcessingFailed: (detail?: unknown) =>
    new VoiceShieldError({
      code: VoiceShieldErrorCode.AUDIO_PROCESSING_FAILED,
      userMessage: "Failed to encode audio for analysis.",
      recoverable: true,
      detail,
    }),
} as const;
