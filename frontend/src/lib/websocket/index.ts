/**
 * VoiceShield Frontend — WebSocket Library (barrel export)
 */
export { AnalysisWebSocketClient } from "./analysis-socket";
export type { ConnectionState } from "./analysis-socket";
export { parseAnalysisEvent, isEventType } from "./events";
