/**
 * VoiceShield Frontend — WebSocket Event Parser
 *
 * Provides a type-safe parser that converts raw WebSocket message strings
 * into typed AnalysisEvent discriminated union values.
 *
 * All unknown or malformed events are rejected safely — no runtime crashes,
 * no `any` propagation into application state.
 */

import type { AnalysisEvent, AnalysisEventType } from "../../types/websocket";
import { KNOWN_EVENT_TYPES } from "../../types/websocket";

/**
 * Parse a raw WebSocket message string into a typed AnalysisEvent.
 *
 * Returns `null` for:
 *  - Non-JSON messages (e.g. heartbeat "pong")
 *  - Objects missing required envelope fields
 *  - Objects with an unknown event_type
 *
 * Never throws. Logs malformed events to console.warn for debugging.
 */
export function parseAnalysisEvent(raw: string): AnalysisEvent | null {
  // Fast path: heartbeat frames are not JSON events
  if (raw === "pong" || raw === "ping") return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.warn("[VoiceShield] WebSocket: received non-JSON message:", raw.slice(0, 120));
    return null;
  }

  if (!isRecord(parsed)) {
    console.warn("[VoiceShield] WebSocket: event is not an object:", parsed);
    return null;
  }

  // Validate required envelope fields
  const { event_id, session_id, event_type, source, severity, message } = parsed;

  if (
    typeof event_id !== "string" ||
    typeof session_id !== "string" ||
    typeof event_type !== "string" ||
    typeof source !== "string" ||
    typeof severity !== "string" ||
    typeof message !== "string"
  ) {
    console.warn("[VoiceShield] WebSocket: event missing required envelope fields:", parsed);
    return null;
  }

  if (!KNOWN_EVENT_TYPES.has(event_type)) {
    console.warn("[VoiceShield] WebSocket: unknown event_type received:", event_type);
    return null;
  }

  // The discriminant and required envelope fields are validated above.
  // The double-cast through unknown is intentional: the runtime validation above
  // guarantees structural correctness, but TypeScript cannot verify it statically.
  return parsed as unknown as AnalysisEvent;
}

/**
 * Type guard: unknown → Record<string, unknown>
 */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Type predicate — narrow an AnalysisEvent to a specific event_type.
 *
 * @example
 * if (isEventType(event, "ASR_UPDATED")) {
 *   console.log(event.metadata.text); // ✅ fully typed
 * }
 */
export function isEventType<T extends AnalysisEventType>(
  event: AnalysisEvent,
  type: T
): event is Extract<AnalysisEvent, { event_type: T }> {
  return event.event_type === type;
}
