import { SecurityEvent } from "../api/types";
import { WS_BASE_URL } from "../config";
import type { AudioChunkMessage } from "../../types/websocket";
import { MAX_QUEUE_DEPTH } from "../audio/constants";

export type ConnectionState =
  | "DISCONNECTED"
  | "CONNECTING"
  | "CONNECTED"
  | "RECONNECTING"
  | "ERROR";

export type BackpressureState = "NORMAL" | "DEGRADED";

export interface BackpressureStats {
  chunksProduced: number;
  chunksSent: number;
  chunksProcessed: number;
  chunksDropped: number;
  queueDepth: number;
  status: BackpressureState;
}

export type EventCallback = (event: SecurityEvent) => void;
export type StateCallback = (state: ConnectionState, error?: string) => void;
export type BackpressureCallback = (stats: BackpressureStats) => void;

export class AnalysisWebSocketClient {
  private socket: WebSocket | null = null;
  private sessionId: string | null = null;
  private state: ConnectionState = "DISCONNECTED";
  private eventListeners: Set<EventCallback> = new Set();
  private stateListeners: Set<StateCallback> = new Set();
  private backpressureListeners: Set<BackpressureCallback> = new Set();

  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private isIntentionallyClosed = false;

  // Backpressure & telemetry tracking
  private chunksProduced = 0;
  private chunksSent = 0;
  private chunksProcessed = 0;
  private chunksDropped = 0;
  private backpressureState: BackpressureState = "NORMAL";

  public connect(sessionId: string): void {
    if (
      this.socket &&
      this.sessionId === sessionId &&
      (this.state === "CONNECTED" || this.state === "CONNECTING")
    ) {
      return;
    }

    this.disconnect();
    this.sessionId = sessionId;
    this.isIntentionallyClosed = false;
    this.reconnectAttempts = 0;
    this.resetStats();
    this.establishConnection();
  }

  private establishConnection(): void {
    if (!this.sessionId) return;

    this.setState(this.reconnectAttempts > 0 ? "RECONNECTING" : "CONNECTING");
    const wsUrl = `${WS_BASE_URL}/ws/sessions/${encodeURIComponent(this.sessionId)}`;

    try {
      this.socket = new WebSocket(wsUrl);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      this.setState("ERROR", `Failed to initialize WebSocket: ${errMsg}`);
      this.scheduleReconnect();
      return;
    }

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.setState("CONNECTED");
      this.startHeartbeat();
    };

    this.socket.onmessage = (event: MessageEvent) => {
      const dataStr = event.data;
      if (dataStr === "pong") {
        return;
      }

      try {
        const payload: SecurityEvent = JSON.parse(dataStr);
        if (payload && payload.event_type) {
          // Track chunk completion for client backpressure relief
          if (
            payload.event_type === "ANALYSIS_COMPLETED" ||
            payload.event_type === "ANALYSIS_ERROR"
          ) {
            this.handleAnalysisResponse();
          }

          this.notifyEvent(payload);
        }
      } catch {
        console.warn("Received non-JSON WebSocket message:", dataStr);
      }
    };

    this.socket.onerror = (evt: Event) => {
      console.error("WebSocket transport error:", evt);
      this.setState("ERROR", "WebSocket connection error");
    };

    this.socket.onclose = () => {
      this.stopHeartbeat();
      this.socket = null;

      if (!this.isIntentionallyClosed) {
        this.scheduleReconnect();
      } else {
        this.setState("DISCONNECTED");
      }
    };
  }

  /**
   * Send an audio chunk envelope upstream to the backend analysis pipeline.
   * Enforces client-side backpressure:
   * - If queue depth > MAX_QUEUE_DEPTH (3), drops stale window and marks DEGRADED.
   * - Never logs raw audio or base64 data to console (defensive privacy).
   */
  public sendAudioChunk(chunk: AudioChunkMessage): boolean {
    this.chunksProduced++;

    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.chunksDropped++;
      this.updateBackpressure();
      return false;
    }

    const currentDepth = Math.max(0, this.chunksSent - this.chunksProcessed);

    // Backpressure threshold exceeded: shed stale window to prevent unbounded memory growth
    if (currentDepth >= MAX_QUEUE_DEPTH) {
      this.chunksDropped++;
      this.backpressureState = "DEGRADED";
      this.updateBackpressure();
      return false;
    }

    try {
      this.socket.send(JSON.stringify(chunk));
      this.chunksSent++;
      this.updateBackpressure();
      return true;
    } catch {
      this.chunksDropped++;
      this.updateBackpressure();
      return false;
    }
  }

  private handleAnalysisResponse(): void {
    if (this.chunksProcessed < this.chunksSent) {
      this.chunksProcessed++;
    }
    const currentDepth = Math.max(0, this.chunksSent - this.chunksProcessed);
    if (currentDepth < MAX_QUEUE_DEPTH && this.backpressureState === "DEGRADED") {
      this.backpressureState = "NORMAL";
    }
    this.updateBackpressure();
  }

  private updateBackpressure(): void {
    const stats = this.getBackpressureStats();
    this.backpressureListeners.forEach((cb) => {
      try {
        cb(stats);
      } catch (err) {
        console.error("Error in backpressure listener:", err);
      }
    });
  }

  public getBackpressureStats(): BackpressureStats {
    const queueDepth = Math.max(0, this.chunksSent - this.chunksProcessed);
    return {
      chunksProduced: this.chunksProduced,
      chunksSent: this.chunksSent,
      chunksProcessed: this.chunksProcessed,
      chunksDropped: this.chunksDropped,
      queueDepth,
      status: this.backpressureState,
    };
  }

  private resetStats(): void {
    this.chunksProduced = 0;
    this.chunksSent = 0;
    this.chunksProcessed = 0;
    this.chunksDropped = 0;
    this.backpressureState = "NORMAL";
  }

  public onBackpressureChange(callback: BackpressureCallback): () => void {
    this.backpressureListeners.add(callback);
    callback(this.getBackpressureStats());
    return () => {
      this.backpressureListeners.delete(callback);
    };
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.setState(
        "ERROR",
        `Connection failed after ${this.maxReconnectAttempts} reconnect attempts.`
      );
      return;
    }

    this.reconnectAttempts++;
    const delayMs = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 16000);
    this.setState(
      "RECONNECTING",
      `Reconnecting attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delayMs}ms...`
    );

    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.establishConnection();
    }, delayMs);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        try {
          this.socket.send("ping");
        } catch {
          // Ignore transient send failures
        }
      }
    }, 15000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  public disconnect(): void {
    this.isIntentionallyClosed = true;
    this.stopHeartbeat();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.close(1000, "Client disconnect requested");
      this.socket = null;
    }

    this.sessionId = null;
    this.resetStats();
    this.updateBackpressure();
    this.setState("DISCONNECTED");
  }

  public onEvent(callback: EventCallback): () => void {
    this.eventListeners.add(callback);
    return () => {
      this.eventListeners.delete(callback);
    };
  }

  public onStateChange(callback: StateCallback): () => void {
    this.stateListeners.add(callback);
    callback(this.state);
    return () => {
      this.stateListeners.delete(callback);
    };
  }

  private notifyEvent(event: SecurityEvent): void {
    this.eventListeners.forEach((cb) => {
      try {
        cb(event);
      } catch (err) {
        console.error("Error in WebSocket event listener:", err);
      }
    });
  }

  private setState(newState: ConnectionState, error?: string): void {
    this.state = newState;
    this.stateListeners.forEach((cb) => {
      try {
        cb(newState, error);
      } catch (err) {
        console.error("Error in WebSocket state listener:", err);
      }
    });
  }

  public getState(): ConnectionState {
    return this.state;
  }
}
