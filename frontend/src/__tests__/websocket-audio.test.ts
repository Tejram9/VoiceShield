import { describe, it, expect } from "vitest";
import { AnalysisWebSocketClient } from "../lib/websocket/analysis-socket";
import type { AudioChunkMessage } from "../types/websocket";
import { EventType, RiskLevel, SecurityEvent } from "../lib/api/types";
import { MAX_QUEUE_DEPTH } from "../lib/audio/constants";

// Helper to expose internal methods for testing
interface TestableClient {
  socket: { send: (data: string) => void; readyState: number; close: () => void } | null;
  notifyEvent(event: SecurityEvent): void;
  setState(state: string, error?: string): void;
  handleAnalysisResponse(): void;
}

function createMockChunk(seq: number): AudioChunkMessage {
  return {
    type: "audio_chunk",
    session_id: "VS-2026-TEST",
    sequence: seq,
    sample_rate: 16000,
    channels: 1,
    format: "pcm_s16le",
    duration_ms: 4000,
    audio_base64: "AAAA",
  };
}

describe("WebSocket Audio Streaming & Backpressure Tests", () => {
  it("enforces backpressure: sheds windows when queue exceeds MAX_QUEUE_DEPTH", () => {
    const client = new AnalysisWebSocketClient();
    const testClient = client as unknown as TestableClient;

    // Simulate open socket
    const sentMessages: string[] = [];
    testClient.socket = {
      readyState: 1, // WebSocket.OPEN
      send: (data: string) => { sentMessages.push(data); },
      close: () => {},
    };
    testClient.setState("CONNECTED");

    const backpressureStates: string[] = [];
    client.onBackpressureChange((stats) => {
      backpressureStates.push(stats.status);
    });

    // 1. Send up to MAX_QUEUE_DEPTH chunks (e.g. 3 chunks)
    for (let i = 0; i < MAX_QUEUE_DEPTH; i++) {
      const sent = client.sendAudioChunk(createMockChunk(i));
      expect(sent).toBe(true);
    }
    expect(sentMessages.length).toBe(MAX_QUEUE_DEPTH);
    expect(client.getBackpressureStats().queueDepth).toBe(MAX_QUEUE_DEPTH);
    expect(client.getBackpressureStats().status).toBe("NORMAL");

    // 2. Sending when queue is full must drop chunk and enter DEGRADED status
    const sentWhenFull = client.sendAudioChunk(createMockChunk(MAX_QUEUE_DEPTH));
    expect(sentWhenFull).toBe(false);
    expect(sentMessages.length).toBe(MAX_QUEUE_DEPTH); // Not sent
    expect(client.getBackpressureStats().chunksDropped).toBe(1);
    expect(client.getBackpressureStats().status).toBe("DEGRADED");

    // 3. Receive an ANALYSIS_COMPLETED event -> relieves in-flight queue depth
    const completedEvent: SecurityEvent = {
      event_id: "evt-comp-1",
      session_id: "VS-2026-TEST",
      timestamp: "03:00:01 UTC",
      event_type: EventType.ANALYSIS_COMPLETED,
      source: "AnalysisOrchestrator",
      severity: "LOW" as RiskLevel,
      message: "Pipeline completed",
      metadata: {},
    };
    testClient.notifyEvent(completedEvent);
    testClient.handleAnalysisResponse();

    expect(client.getBackpressureStats().queueDepth).toBe(MAX_QUEUE_DEPTH - 1);
    expect(client.getBackpressureStats().status).toBe("NORMAL");

    // 4. Now sending another chunk succeeds
    const sentAfterRecovery = client.sendAudioChunk(createMockChunk(4));
    expect(sentAfterRecovery).toBe(true);
    expect(sentMessages.length).toBe(MAX_QUEUE_DEPTH + 1);
  });

  it("does not send audio chunks when disconnected", () => {
    const client = new AnalysisWebSocketClient();
    const sent = client.sendAudioChunk(createMockChunk(0));
    expect(sent).toBe(false);
    expect(client.getBackpressureStats().chunksDropped).toBe(1);
  });

  it("clears backpressure and tracking stats on reconnect/connect", () => {
    const client = new AnalysisWebSocketClient();
    const testClient = client as unknown as TestableClient;

    testClient.socket = {
      readyState: 1,
      send: () => {},
      close: () => {},
    };
    testClient.setState("CONNECTED");

    client.sendAudioChunk(createMockChunk(0));
    expect(client.getBackpressureStats().chunksSent).toBe(1);

    client.disconnect();
    expect(client.getBackpressureStats().queueDepth).toBe(0);
  });
});
