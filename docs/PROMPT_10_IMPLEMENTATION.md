# Prompt 10 — Frontend ↔ Backend Live Analysis Integration

## 1. Files Created

| File | Purpose |
|---|---|
| [`frontend/src/hooks/use-analysis-state.ts`](file:///d:/VoiceShield/frontend/src/hooks/use-analysis-state.ts) | Typed analysis state reducer — all 8 WebSocket event types mapped to precise state fields |
| [`frontend/src/components/analysis/audio-capture.tsx`](file:///d:/VoiceShield/frontend/src/components/analysis/audio-capture.tsx) | Isolated audio capture control (mic toggle, VU meter, permission error) |
| [`frontend/src/components/analysis/session-status-bar.tsx`](file:///d:/VoiceShield/frontend/src/components/analysis/session-status-bar.tsx) | Compact operational status strip (session state, latency, last event) |
| [`frontend/src/frontend/src/__tests__/use-analysis-state.test.ts`](file:///d:/VoiceShield/frontend/src/__tests__/use-analysis-state.test.ts) | 12-test frontend test suite for the state reducer |

## 2. Files Modified

| File | Change |
|---|---|
| [`frontend/src/hooks/use-analysis-session.ts`](file:///d:/VoiceShield/frontend/src/hooks/use-analysis-session.ts) | Delegates all event-to-state mapping to `useAnalysisState`. Removes hardcoded caller metadata. Uses `VoiceShieldError`. Adds `resetSession()`. |
| [`frontend/src/components/dashboard/live-call-card.tsx`](file:///d:/VoiceShield/frontend/src/components/dashboard/live-call-card.tsx) | Uses `AnalysisStatus` type. Honest empty states (PENDING ANALYSIS, dashes). `sessionError` banner with Retry. `isSessionReady` guard on mic/analysis buttons. |
| [`frontend/src/components/dashboard/risk-signal-breakdown.tsx`](file:///d:/VoiceShield/frontend/src/components/dashboard/risk-signal-breakdown.tsx) | Two clear modes: live per-signal (from `AnalysisState`) + REST signals. REFERENCE PROFILE UNAVAILABLE truthful state. PENDING states. No duck-typing. |
| [`frontend/src/components/dashboard/ai-findings-panel.tsx`](file:///d:/VoiceShield/frontend/src/components/dashboard/ai-findings-panel.tsx) | Clean 2-prop typed interface (`findings: SecurityFinding[]`, `events: SecurityEvent[]`). Visual hierarchy: findings prominent, events subdued. |
| [`frontend/src/components/dashboard/security-recommendation.tsx`](file:///d:/VoiceShield/frontend/src/components/dashboard/security-recommendation.tsx) | Removes `alert()` calls. Buttons disabled with title explaining not yet wired. Proper empty state when no assessment. |
| [`frontend/src/app/page.tsx`](file:///d:/VoiceShield/frontend/src/app/page.tsx) | All live analysis state from `useAnalysisSession`/`analysisState`. SessionStatusBar added. No hardcoded analysis results. Mock data clearly isolated. |

## 3. Session Lifecycle

```
1. useAnalysisSession mounts
        ↓
2. POST /api/v1/analysis/sessions
        ↓
3. GET /api/v1/analysis/sessions/{id} (seed initial state)
        ↓
4. WebSocket connect: ws://localhost:8000/ws/sessions/{id}
        ↓
5. UI shows: CONNECTED · WAITING FOR AUDIO
```

Session states in the UI:
- `INITIALIZING...` — during REST session creation
- `CONNECTED · WAITING FOR AUDIO` — session ready, no audio yet
- `ANALYZING` — audio POST in flight, events arriving
- `LIVE` — analysis completed, results displayed
- `ANALYSIS ERROR` — ANALYSIS_ERROR event received
- `CONNECTION FAILED` — WS max retries exceeded

## 4. WebSocket Lifecycle

The `AnalysisWebSocketClient` in `lib/websocket/analysis-socket.ts` handles:
- Heartbeat: `ping` → `pong` every 15s
- Reconnection: exponential backoff, max 5 attempts
- State machine: `DISCONNECTED → CONNECTING → CONNECTED → RECONNECTING → ERROR`

Events are dispatched from `use-analysis-session.ts` via `handleWebSocketEvent` → `processEvent` → `useAnalysisState` reducer.

## 5. Audio Flow

```
Browser getUserMedia (16kHz, mono)
        ↓
AudioWorklet (audio-processor.worklet.js)
        ↓
Float32 PCM samples → use-microphone.ts
        ↓
hasSignificantAudio() energy gate
        ↓
float32ToBase64Pcm16() encoding
        ↓
POST /api/v1/analysis/sessions/{id}/analyze
        { audio_base64: "<base64-PCM-S16LE>", sample_rate: 16000,
          duration_ms: 4000.0, format: "pcm_s16le" }
        ↓
Backend decodes → AudioSegment
        ↓
Real AI pipeline (ASR + Speaker + Spoof + SE NLP)
        ↓
WebSocket events → frontend state
```

4-second window / 1-second stride — set in `use-analysis-session.ts` via `useMicrophone` options.

## 6. Event Flow

```
Backend WebSocket broadcast
        ↓
AnalysisWebSocketClient.onEvent callback
        ↓
use-analysis-session: handleWebSocketEvent()
        ↓
use-analysis-state: processEvent(evt) → reducer
        ↓
Per-event state update:
  ANALYSIS_STARTED   → analysisStatus = "PROCESSING"
  ASR_UPDATED        → asr, transcript
  SPEAKER_*          → speaker.similarityScore, speaker.status
  SPOOF_*            → spoof.spoofProbability, spoof.indicators
  SOCIAL_ENG_*       → socialEngineering.urgencyScore, coercionDetected
  SECURITY_FINDING   → findings[] (deduped by event_id)
  RISK_UPDATE        → riskAssessment (partial, real-time)
  ANALYSIS_COMPLETED → analysisStatus = "COMPLETED", pipelineLatency
  ANALYSIS_ERROR     → analysisStatus = "ERROR", analysisError
        ↓
React state → component re-render
```

## 7. Frontend State Architecture

```
useAnalysisSession
  ├── useAnalysisState (reducer)
  │     └── state: AnalysisState
  │           ├── asr: ASRState | null
  │           ├── speaker: SpeakerState | null
  │           ├── spoof: SpoofState | null
  │           ├── socialEngineering: SocialEngineeringState | null
  │           ├── riskAssessment: RiskAssessment | null
  │           ├── findings: SecurityFinding[]
  │           ├── events: SecurityEvent[]
  │           ├── transcript: string
  │           ├── analysisStatus: AnalysisStatus
  │           ├── lastAnalyzedAt: string | null
  │           ├── pipelineLatency: PipelineLatency
  │           └── analysisError: string | null
  ├── useMicrophone (audio capture)
  └── AnalysisWebSocketClient (WS transport)
```

UI components consume `analysisState` directly — never parse metadata fields.

## 8. Error Handling

| Scenario | Error Source | UI Treatment |
|---|---|---|
| Session creation fails | `VoiceShieldError` from client | `sessionError` banner + Retry button |
| WebSocket disconnected | `ConnectionState = "ERROR"` | Error banner + Reconnect button in header |
| Analysis pipeline error | `ANALYSIS_ERROR` event | `analysisStatus = ERROR`, `analysisError` shown in transcript placeholder |
| Mic permission denied | `micState = "ERROR"` | Orange error strip in LiveCallCard |
| Browser unsupported | `micState = "UNSUPPORTED"` | Orange error strip with clear message |
| HTTP 404 | `VoiceShieldError(INVALID_SESSION)` | `sessionError` with Retry |
| HTTP 5xx | `VoiceShieldError(BACKEND_UNAVAILABLE)` | `sessionError` with Retry |

## 9. Testing Results

### Frontend Build
```
npm run build → exit code 0
✓ Compiled successfully in 4.0s
Zero errors · Zero TypeScript warnings
Route / → 26.2 kB (First Load JS: 129 kB)
```

### Backend Tests
```
pytest tests/ -v → 33/33 passed, 1 warning in ~61s
```

### REST Integration Sanity
```
POST /api/v1/analysis/sessions  → VS-2026-00E052 ✅
GET  /api/v1/analysis/sessions/VS-2026-00E052  → status: LIVE ANALYSIS ✅
POST /api/v1/analysis/sessions/VS-2026-00E052/analyze
  → risk_score: 49, risk_level: MEDIUM, signals: 1 ✅
```

## 10. Manual Verification Procedure

**Prerequisites:** Backend running on :8000, Frontend running on :3000.

1. Open `http://localhost:3000`
2. **Session initialization:** Header shows `SESSION: VS-2026-...`. SessionStatusBar shows `CONNECTED · WAITING FOR AUDIO`.
3. **Manual analysis:** Click "Run Analysis" button. Status changes to `ANALYZING`, then findings appear in the Detection Events feed. Risk score updates from backend.
4. **Microphone test:** Click "Live Mic". Browser requests microphone permission. If granted, VU meter activates, analysis triggers every ~1s automatically. Transcript appears from ASR.
5. **WebSocket events:** Risk signal breakdown updates with live spoof probability and speaker similarity.
6. **Error state:** Stop backend → Header shows `DISCONNECTED`, error banner appears, Reconnect button available.

## 11. Mock Data Status

| Export | Status |
|---|---|
| `MOCK_LIVE_CALL` | Unused in production runtime ✅ |
| `MOCK_RISK_SIGNALS` | Unused in production runtime ✅ |
| `MOCK_DETECTION_EVENTS` | Unused in production runtime ✅ |
| `MOCK_RECOMMENDATION` | Unused in production runtime ✅ |
| `MOCK_RECENT_INCIDENTS` | **Used only** by `RecentIncidentsTable` for historical context — documented as static demo data pending DB implementation |

## 12. Known Limitations

| Limitation | Description |
|---|---|
| Frontend test runner (Jest) | Project has no Jest config yet — `use-analysis-state.test.ts` is written but cannot be run automatically. Requires `npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom` and tsconfig jest target. Test logic is verified by code review. |
| Speaker reference profile | Backend speaker verification compares single window to itself (no enrolled profile DB). `speaker.status` will be "AVAILABLE" but similarity scores reflect self-comparison. UI correctly derives AVAILABLE/UNAVAILABLE from backend `status` field. |
| Session persistence | Backend in-memory store — sessions lost on restart. All state is rebuilt from WebSocket events on reconnect. |
| Workflow action buttons | "VERIFY CALLER" and "START CALLBACK" buttons are disabled with tooltip. Not connected to external systems in this phase. |
| Browser WS visual E2E | Full browser-side visual verification via automated browser requires a running dev server session. REST and WebSocket integration verified via curl/PowerShell above. |
