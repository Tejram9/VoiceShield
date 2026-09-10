# VoiceShield — Frontend Integration Guide

> **Audience**: Engineers integrating the Next.js 15 Security Console with the FastAPI backend.
> **Last updated**: 2026-09-11

---

## 1. Architecture Overview

```
Browser (Next.js 15 / React 19)
  │
  ├── lib/config.ts              ← All backend URLs (single source of truth)
  │
  ├── lib/api/
  │   ├── client.ts              ← Low-level fetch wrapper (timeout, error mapping)
  │   ├── sessions.ts            ← Session-specific REST functions
  │   ├── types.ts               ← Pydantic-mirroring TypeScript interfaces
  │   └── index.ts               ← Barrel export
  │
  ├── lib/websocket/
  │   ├── analysis-socket.ts     ← AnalysisWebSocketClient (heartbeat, reconnect)
  │   ├── events.ts              ← parseAnalysisEvent(), isEventType()
  │   └── index.ts               ← Barrel export
  │
  ├── lib/audio/
  │   └── encoding.ts            ← Float32→PCM16, Blob→base64, ArrayBuffer→base64
  │
  ├── hooks/
  │   ├── use-analysis-session.ts   ← Master session hook (REST + WS + Mic)
  │   ├── use-analysis-websocket.ts ← Standalone WS hook (typed events only)
  │   └── use-microphone.ts         ← Browser audio capture hook
  │
  └── types/
      ├── api.ts                 ← Re-export of lib/api/types.ts
      ├── websocket.ts           ← Discriminated union AnalysisEvent
      └── analysis.ts            ← AnalysisConnectionState, VoiceShieldError
```

---

## 2. Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:8000` | HTTP base URL of the FastAPI backend |
| `NEXT_PUBLIC_WS_URL` | No | Derived from API_URL | WebSocket base URL override |

**URL derivation rule** (automatic, no hacks):
```
http://host:port  →  ws://host:port
https://host      →  wss://host
```

**Security rule**: Never add `NEXT_PUBLIC_*_API_KEY` or any secret. All AI provider credentials remain server-side in the FastAPI backend.

**Example `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 3. REST API Endpoints

All endpoints are prefixed with `/api/v1`. The prefix is defined in `lib/config.ts` as `API_V1`.

### POST `/api/v1/analysis/sessions`
Create a new security analysis session.

**Request:**
```json
{
  "caller_name": "Alex Turner",
  "caller_role": "Executive Director",
  "caller_number": "+1 (555) 234-8901",
  "verification_state": "NOT VERIFIED"
}
```
All fields are optional. `session_id` may be provided to use a custom ID.

**Response (201):**
```json
{
  "session_id": "VS-2026-003E35",
  "status": "LIVE ANALYSIS",
  "message": "VoiceShield security session initialized successfully."
}
```

---

### GET `/api/v1/analysis/sessions/{session_id}`
Retrieve current session state including latest risk assessment and event history.

**Response (200):**
```json
{
  "session_id": "VS-2026-003E35",
  "caller_name": "Alex Turner",
  "current_risk_score": 49,
  "current_risk_level": "MEDIUM",
  "latest_assessment": { ... },
  "events": [ ... ],
  "start_time": "03:30:00 UTC"
}
```

**Error (404):** Session not found → `VoiceShieldError` with code `INVALID_SESSION`.

---

### POST `/api/v1/analysis/sessions/{session_id}/analyze`
Trigger real AI pipeline analysis on an audio segment.

**Request:**
```json
{
  "sample_rate": 16000,
  "duration_ms": 4000.0,
  "format": "pcm_s16le",
  "audio_base64": "<base64-encoded PCM-S16LE bytes>"
}
```

`audio_base64` is optional. If omitted, the pipeline runs on synthetic silence.

**Response (200):** `RiskAssessment` with `risk_score`, `risk_level`, `contributing_signals`, `recommended_action`.

---

## 4. WebSocket

### Connection URL
```
ws://localhost:8000/ws/sessions/{session_id}
```

### Heartbeat Protocol
- Client sends: `"ping"` (plain text string)
- Server responds: `"pong"` (plain text string)
- Interval: every **15 seconds** (frontend) / timeout **30 seconds** (backend)

### Connection States
| State | Meaning |
|---|---|
| `DISCONNECTED` | Not connected |
| `CONNECTING` | Handshake in progress |
| `CONNECTED` | Open, receiving events |
| `RECONNECTING` | Auto-reconnecting (backoff active) |
| `ERROR` | Max retries exceeded or fatal error |

### Reconnection Strategy
- Maximum attempts: **5**
- Backoff: exponential `min(1000 * 2^(attempt-1), 16000)` ms
- After 5 failures: state → `ERROR`, user must manually reconnect

---

## 5. WebSocket Event Types

Every event is a JSON object conforming to the `SecurityEvent` schema.
The `event_type` field is the discriminant.

| `event_type` | Source | Key `metadata` fields |
|---|---|---|
| `ANALYSIS_STARTED` | Orchestrator | `segment_id`, `duration_ms` |
| `ASR_UPDATED` | faster-whisper | `text`, `language`, `confidence` |
| `SPEAKER_ANALYSIS_UPDATED` | ECAPA-TDNN | `similarity_score`, `verification_state` |
| `SPOOF_ANALYSIS_UPDATED` | Wav2Vec2 | `spoof_probability`, `indicators` |
| `SOCIAL_ENGINEERING_UPDATED` | Rule-based NLP | `urgency_score`, `coercion_detected` |
| `SECURITY_FINDING` | Orchestrator | `category`, `confidence` |
| `RISK_UPDATE` | RiskFusionEngine | `risk_score`, `explanation` |
| `ANALYSIS_COMPLETED` | Orchestrator | `total_latency_ms`, `risk_score` |
| `ANALYSIS_ERROR` | Orchestrator | `failed_stage`, `error_type` |

**Type-safe consumption:**
```typescript
import { parseAnalysisEvent, isEventType } from "@/lib/websocket";

const event = parseAnalysisEvent(rawMessageString);
if (event && isEventType(event, "ASR_UPDATED")) {
  console.log(event.metadata.text); // ✅ fully typed
}
```

---

## 6. Error Handling

All errors thrown by the API client are `VoiceShieldError` instances.

```typescript
import { VoiceShieldError, VoiceShieldErrorCode } from "@/types/analysis";

try {
  await createAnalysisSession();
} catch (err) {
  if (err instanceof VoiceShieldError) {
    // err.userMessage — safe to display in UI
    // err.code — VoiceShieldErrorCode for programmatic handling
    // err.recoverable — true if a retry might succeed
    // err.detail — raw error for logging only, never display
  }
}
```

| Error Code | Category | Recoverable |
|---|---|---|
| `BACKEND_UNAVAILABLE` | Infrastructure | Yes |
| `NETWORK_FAILURE` | Infrastructure | Yes |
| `HTTP_ERROR` | HTTP | Status ≥ 500 |
| `INVALID_SESSION` | Session | Yes (create new) |
| `WEBSOCKET_DISCONNECTED` | WebSocket | Yes |
| `WEBSOCKET_MAX_RETRIES` | WebSocket | No (page refresh) |
| `ANALYSIS_FAILED` | AI Pipeline | Yes |
| `AUDIO_PROCESSING_FAILED` | Audio | Yes |
| `MALFORMED_RESPONSE` | Data | No |
| `MIC_PERMISSION_DENIED` | Audio Capture | Yes (user action) |

---

## 7. Audio Transport

The backend accepts audio as `audio_base64` — base64-encoded PCM-S16LE bytes.

Three input paths are supported:

```typescript
import {
  float32ToBase64Pcm16, // Float32Array from AudioWorklet
  blobToBase64,         // browser Blob (MediaRecorder, File)
  arrayBufferToBase64,  // ArrayBuffer (fetch, Web Audio)
} from "@/lib/audio/encoding";

// Path 1: Live mic (AudioWorklet)
const b64 = float32ToBase64Pcm16(float32Samples);

// Path 2: Recorded blob
const b64 = await blobToBase64(audioBlob);

// Path 3: Raw buffer
const b64 = arrayBufferToBase64(audioBuffer);
```

All produce a base64 string ready for `audio_base64` in the analyze request.

---

## 8. Development Commands

```bash
# Frontend
cd frontend
npm run dev       # Start Next.js dev server on :3000
npm run build     # Production build (TypeScript strict check)
npm run lint      # ESLint

# Backend
cd backend
.venv\Scripts\uvicorn.exe app.main:app --host 0.0.0.0 --port 8000 --reload

# Backend tests
cd backend
.venv\Scripts\pytest.exe
```

---

## 9. Backend CORS

The backend explicitly allows only `http://localhost:3000`:

```python
# backend/app/core/config.py
ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]
```

For production deployment, set the `ALLOWED_ORIGINS` environment variable to the frontend domain. Do not use `*`.

---

## 10. Mock Data

`frontend/src/lib/mock-data.ts` contains static data for visual development.

**Rule:** Mock data must never reach the production runtime path.

```
mock-data.ts          → RecentIncidentsTable (static historical context only)
lib/api/ + hooks/     → All live AI analysis data
```

The `RecentIncidentsTable` component intentionally uses mock data — it represents historical incident records that would come from a PostgreSQL database in a production deployment (not yet implemented).

---

## 11. Known Limitations

| Limitation | Impact | Resolution |
|---|---|---|
| In-memory session store | Sessions lost on backend restart | PostgreSQL persistence (future prompt) |
| No authentication | Any client can create sessions | Auth hardening phase (future prompt) |
| Single-speaker enrollment | Speaker verification compares against single audio window, not enrolled profile | Enrollment DB (future prompt) |
| Social engineering NLP is rule-based | Limited to keyword patterns; no semantic understanding | LLM integration (future prompt) |
| WS events not persisted | Refreshing page loses event history | DB-backed event log (future prompt) |
| Browser mic requires HTTPS in production | getUserMedia blocked on non-localhost HTTP | HTTPS / reverse proxy required for prod |
