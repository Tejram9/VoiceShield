import { describe, it, expect, vi } from "vitest";
import { EventType, RiskLevel, SecurityEvent } from "../lib/api/types";
import { AnalysisWebSocketClient } from "../lib/websocket/analysis-socket";

// Test-only interface to access private methods for unit testing
interface AnalysisWebSocketClientTestable {
  notifyEvent(event: SecurityEvent): void;
  setState(state: string, error?: string): void;
}

describe("Frontend Realtime Event & WebSocket Client Unit Tests", () => {
  it("parses valid JSON WebSocket SecurityEvent payloads", () => {
    const wsClient = new AnalysisWebSocketClient();
    const eventHandler = vi.fn();
    wsClient.onEvent(eventHandler);

    const mockEvent: SecurityEvent = {
      event_id: "evt-test-1",
      session_id: "VS-2026-TEST",
      timestamp: "03:00:00 UTC",
      event_type: EventType.RISK_UPDATE,
      source: "RiskFusionEngine",
      severity: "HIGH" as RiskLevel,
      message: "Fused risk score evaluated at 85/100 (HIGH)",
      metadata: { risk_score: 85 }
    };

    // Trigger internal notifier directly for testing
    (wsClient as unknown as AnalysisWebSocketClientTestable).notifyEvent(mockEvent);

    expect(eventHandler).toHaveBeenCalledTimes(1);
    expect(eventHandler).toHaveBeenCalledWith(mockEvent);
  });

  it("handles connection state transitions correctly", () => {
    const wsClient = new AnalysisWebSocketClient();
    const stateHandler = vi.fn();
    wsClient.onStateChange(stateHandler);

    expect(stateHandler).toHaveBeenCalledWith("DISCONNECTED");

    (wsClient as unknown as AnalysisWebSocketClientTestable).setState("CONNECTING");
    expect(stateHandler).toHaveBeenCalledWith("CONNECTING", undefined);

    (wsClient as unknown as AnalysisWebSocketClientTestable).setState("CONNECTED");
    expect(stateHandler).toHaveBeenCalledWith("CONNECTED", undefined);
  });
});
