# VoiceShield — Production Deployment & Hardening Guide

This document describes the deployment architecture, configuration, environment variables, security boundaries, and operational health procedures for VoiceShield.

---

## 1. System Architecture & Deployment Boundary

VoiceShield enforces a strict separation between the browser presentation layer and the AI analysis service:

```
┌─────────────────────────────────────────────────────────────┐
│                 Browser Client (End-User)                   │
│  - Web Audio API / AudioWorklet (16 kHz mono PCM_S16LE)     │
│  - MediaStream microphone capture with explicit user opt-in │
│  - Zero client-side raw audio storage (localStorage/IDB: 0) │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS (REST) / WSS (WebSocket)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Vercel-Hosted Next.js 15 Frontend               │
│  - Static / SSR Dashboard UI                                │
│  - Centralized URL configuration (config.ts)                │
│  - Client-side backpressure & state synchronization         │
│  - Truthful SecOps error states & degraded modes            │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / WSS
                               ▼
┌─────────────────────────────────────────────────────────────┐
│           Separately Hosted FastAPI Backend Service         │
│  (Docker / Dedicated VM / GPU Instance / Cloud Container)   │
│  - FastAPI ASGI Server (Uvicorn)                            │
│  - CORS Middleware with strict origin whitelisting          │
│  - Thread-safe AI Model Registry (Lifespan warm load)       │
│  - WebSocket streaming endpoint (/ws/sessions/{id})         │
│  - Zero disk storage for raw audio or base64 streams        │
└──────────────────────────────┬──────────────────────────────┘
                               │ In-Memory Tensors (Transient)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Real AI Models                         │
│  1. faster-whisper base (ASR transcription)                 │
│  2. SpeechBrain ECAPA-TDNN (Biometric speaker embeddings)   │
│  3. WWWxp/wav2vec2_spoof_dection1 (Synthetic voice detector)│
│  4. Local Rule-Based Social Engineering NLP Fallback        │
│  5. RiskFusionEngine (Multi-modal fused risk scoring)       │
└─────────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Architectural Boundary**: The Python AI runtime requires PyTorch, CTranslate2, and native libraries. It MUST NOT be embedded in Vercel Serverless/Edge functions. The FastAPI backend must be hosted independently on a container or VM with adequate CPU/GPU resources.

---

## 2. Frontend Deployment (Vercel)

### Requirements
- Node.js 18.x or later.
- Next.js 15.5.25.

### Steps to Deploy on Vercel
1. Link the repository to your Vercel project and set **Root Directory** to `frontend`.
2. Configure the required environment variables in the Vercel Dashboard under **Project Settings → Environment Variables**:
   - `NEXT_PUBLIC_API_BASE_URL`: `https://<backend-domain>`
   - `NEXT_PUBLIC_WS_BASE_URL`: `wss://<backend-domain>`
3. Deploy. The build command will execute `npm run build` and output static assets and server bundles.

---

## 3. Backend Deployment (Docker / Cloud VM)

### Requirements
- Python 3.10+ (Tested on Python 3.12 / 3.14).
- CUDA-compatible GPU (e.g. NVIDIA RTX / T4 / A10G) optional but recommended for low-latency inference. Automatically falls back to multi-core CPU.
- Minimum 4 GB RAM (8 GB+ recommended for concurrent inference).

### Running with Docker
```bash
# Build backend container
docker build -t voiceshield-backend:latest -f docker/Dockerfile.backend .

# Run with GPU support (if NVIDIA Container Toolkit is installed)
docker run --gpus all -d \
  -p 8000:8000 \
  -e ENVIRONMENT=production \
  -e CORS_ALLOWED_ORIGINS="https://<frontend-domain>" \
  --name voiceshield-api voiceshield-backend:latest
```

---

## 4. Environment Variables Reference

### Frontend Environment Variables (`frontend/.env.production`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Yes (in prod) | `http://localhost:8000` | HTTP/S base URL of the FastAPI backend. |
| `NEXT_PUBLIC_WS_BASE_URL` | Optional | Derived from API URL (`ws://`/`wss://`) | WebSocket base URL for real-time analysis streaming. |
| `NEXT_PUBLIC_API_URL` | Legacy alias | `http://localhost:8000` | Fallback alias for `NEXT_PUBLIC_API_BASE_URL`. |
| `NEXT_PUBLIC_WS_URL` | Legacy alias | Derived from API URL | Fallback alias for `NEXT_PUBLIC_WS_BASE_URL`. |

> [!WARNING]
> **Security Rule**: Never prefix backend secrets, API keys, or database credentials with `NEXT_PUBLIC_`. Only public connection URLs are permitted in browser bundles.

### Backend Environment Variables (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `ENVIRONMENT` | Yes | `development` | `development` or `production`. When `production`, wildcard `*` CORS is rejected. |
| `BACKEND_HOST` | No | `0.0.0.0` | Bind IP for ASGI server. |
| `BACKEND_PORT` | No | `8000` | Bind port for ASGI server. |
| `CORS_ALLOWED_ORIGINS` | Yes (in prod) | `http://localhost:3000` | Comma-separated list of allowed frontend origins (e.g. `https://voiceshield.vercel.app`). |
| `ALLOWED_ORIGINS` | Alias | `http://localhost:3000` | Backward-compatible alias for `CORS_ALLOWED_ORIGINS`. |
| `SECRET_KEY` | Yes (in prod) | `change_this_to_a_secure_random_string` | Cryptographic secret for session signing. |
| `WS_HEARTBEAT_INTERVAL_SEC` | No | `30` | WebSocket ping/pong interval in seconds. |
| `WHISPER_MODEL_SIZE` | No | `base` | faster-whisper model variant (`tiny`, `base`, `small`, `medium`, `large-v3`). |

---

## 5. Local Development Quickstart

### 1. Start FastAPI Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
Access the dashboard at `http://localhost:3000`.

---

## 6. CORS Configuration & Hardening

VoiceShield enforces strict CORS validation via FastAPI's `CORSMiddleware`:
1. In `development` mode, `http://localhost:3000` is permitted by default.
2. In `production` mode (`ENVIRONMENT=production`):
   - Wildcard `*` origins are **explicitly rejected** on startup.
   - All permitted domains must be explicitly defined via `CORS_ALLOWED_ORIGINS="https://voiceshield.vercel.app,https://<custom-domain>"`.
   - Requests from untrusted origins receive standard HTTP responses with no `Access-Control-Allow-Origin` header.

---

## 7. WebSocket Streaming Configuration & Resilience

The WebSocket endpoint `/ws/sessions/{session_id}` handles streaming audio chunks and bi-directional telemetry:
- **Audio Specification**: 16,000 Hz, 1-channel mono, 16-bit PCM (`pcm_s16le`), 4.0s window / 1.0s hop.
- **Payload Limits**: Payloads over 500 KB are rejected with `OVERSIZED_PAYLOAD` to protect against buffer exhaustion.
- **Error Survivability**: Malformed JSON, non-16kHz audio, or invalid Base64 emit structured `ANALYSIS_ERROR` events back to the client without terminating the connection or crashing the backend.
- **Backpressure**: Client drops stale audio windows if queue depth exceeds `MAX_QUEUE_DEPTH` (3) and reports `DEGRADED` status until processed.

---

## 8. AI Model Initialization & GPU Acceleration

- AI model weights (`faster-whisper`, `SpeechBrain ECAPA-TDNN`, `WWWxp/wav2vec2_spoof_dection1`) are initialized asynchronously on application startup via the lifespan handler.
- If an NVIDIA GPU with CUDA support is present, models automatically allocate to VRAM. If unavailable, models load into system RAM and utilize multi-threaded CPU inference.
- If an individual AI provider fails, other pipeline stages continue functioning and report explicit unavailable states (`REFERENCE_UNAVAILABLE`, `UNAVAILABLE`) rather than fabricated scores.

---

## 9. Operational Health Checks

The backend provides several monitoring and liveness endpoints:

| Endpoint | Purpose | Expected Response |
|---|---|---|
| `GET /health` | Basic service uptime and AI model registry status | `{"status": "ok", "service": "VoiceShield Backend", ...}` |
| `GET /health/live` | Container liveness probe | `{"status": "alive"}` |
| `GET /health/ready` | Readiness probe (checks if all AI models are loaded) | `{"status": "ready", "ready": true, "ai_models": {...}}` |
| `GET /` | Root service metadata and API version | `{"service": "VoiceShield Backend", "version": "0.1.0", ...}` |

---

## 10. Troubleshooting

### Issue 1: Microphone permission denied in browser
- **Cause**: Browsers restrict `navigator.mediaDevices.getUserMedia` to `https://` origins (or `localhost` during development).
- **Resolution**: Ensure the frontend is served over HTTPS in production. Verify permissions in browser site settings.

### Issue 2: WebSocket connection failure (`WSS`)
- **Cause**: Mixing HTTP and WSS, or reverse proxy not forwarding WebSocket upgrade headers (`Upgrade: websocket`, `Connection: Upgrade`).
- **Resolution**: Verify reverse proxy (Nginx / Cloudflare / Traefik) is configured for WebSocket pass-through. Verify `NEXT_PUBLIC_WS_BASE_URL` uses `wss://` on HTTPS sites.

### Issue 3: CORS error on API requests
- **Cause**: Frontend origin not in backend `CORS_ALLOWED_ORIGINS`.
- **Resolution**: Set `CORS_ALLOWED_ORIGINS="https://<your-vercel-domain>"` in the backend environment.
