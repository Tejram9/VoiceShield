# VoiceShield - AI Runtime Architecture & Pipeline Specification

This document details the real AI runtime architecture, thread-safe model lifecycle management, parallel execution model, risk fusion signal integration, performance observability, and privacy controls implemented in Prompt 8.

---

## 1. System Architecture Diagram

```
                              LIVE AUDIO / REST / WEBSOCKET
                                          │
                                          ▼
                             ┌─────────────────────────┐
                             │    Audio Preprocessor    │
                             │ (16kHz Mono Float32 WAV)│
                             └────────────┬────────────┘
                                          │
                   ┌──────────────────────┼──────────────────────┐
                   │                      │                      │
                   ▼                      ▼                      ▼
        ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
        │  RealWhisperASR  │   │  RealECAPASpeaker│   │RealWav2Vec2Spoof │
        │  (faster-whisper)│   │ (SpeechBrain Vox)│   │  (ASVspoof model)│
        └──────────┬───────┘   └──────────┬───────┘   └──────────┬───────┘
                   │                      │                      │
                   ▼                      │                      │
        ┌──────────────────┐              │                      │
        │RealSocialEngNLP  │              │                      │
        │(Rule + LLM Mode) │              │                      │
        └──────────┬───────┘              │                      │
                   │                      │                      │
                   └──────────────────────┼──────────────────────┘
                                          │
                                          ▼
                             ┌─────────────────────────┐
                             │    Risk Fusion Engine   │
                             │ (Fused Multi-Modal Risk)│
                             └────────────┬────────────┘
                                          │
                                          ▼
                             ┌─────────────────────────┐
                             │  WebSocket Broadcast &  │
                             │   Session State Store   │
                             └─────────────────────────┘
```

---

## 2. Model Weight Lifecycle & Thread-Safe Registry

- **Lifecycle Registry**: Implemented in `app.ai.model_registry.AIModelRegistry`.
- **Eager Warm Loading**: Pretrained weights (`faster-whisper-base`, `speechbrain/spkrec-ecapa-voxceleb`, `WWWxp/wav2vec2_spoof_dection1`) are initialized once on application startup via FastAPI lifespan context manager (`app/main.py`).
- **Device Selection**: Automatically selects `"cuda"` (NVIDIA GeForce RTX 3050 Laptop GPU, 6 GB VRAM) when available, falling back cleanly to 12-core parallel CPU execution (`"cpu"`).
- **Status State Machine**: Each model tracks `ModelStatus` (`UNINITIALIZED`, `LOADING`, `AVAILABLE`, `UNAVAILABLE`, `PROCESSING_ERROR`).
- **Safe Failure Boundaries**: If a single AI model fails to load or encounters an inference exception, it flags `UNAVAILABLE` or `PROCESSING_ERROR` without crashing the FastAPI application server or degrading other functional AI models.

---

## 3. Preprocessing & Audio Standard

- **Canonical Audio Standard**: 16,000 Hz, 1-channel mono, 16-bit PCM / WAV format normalized to `float32` in `[-1.0, 1.0]`.
- **Spoof Model Window**: 4.0-second sliding audio window (Option C) with 1.0-second hop update interval.
- **Centralized Preprocessor**: `app.ai.audio_preprocessor.preprocess_audio_segment` validates input formats, handles base64-encoded payloads, and enforces target windowing safely.

---

## 4. Parallel Non-Blocking Execution Model

- To prevent heavy CPU/GPU PyTorch/Whisper inference from blocking the single-threaded FastAPI `asyncio` event loop, model inference calls are executed off-thread via `asyncio.to_thread`.
- `AnalysisOrchestrator` runs ASR, Speaker Verification, and Voice Spoof Detection concurrently using `asyncio.gather(...)`.
- Social Engineering NLP executes immediately upon receiving the ASR transcription.

---

## 5. Risk Fusion & Model Output Semantics

- **Engine**: Core `app.services.risk_fusion.RiskFusionEngine`.
- **Voice Integrity Weight (0.35)**: Synthetic speech probability from Wav2Vec2. Index 0 = bonafide, Index 1 = spoof.
- **Speaker Match Weight (0.25)**: Cosine similarity derived from 192-dim ECAPA-TDNN embeddings against a trusted reference profile. If reference profile is missing, status is explicitly set to `REFERENCE_UNAVAILABLE`.
- **Social Engineering Weight (0.30)**: Urgency & coercion score from rule-based keyword NLP engine.
- **Context Risk Weight (0.10)**: Line origin & off-hours timeframe metadata.
- **Explicit Signal Representation**: Missing or unavailable AI signals are flagged explicitly without substituting fake random zero-risk values.

---

## 6. Privacy & Security Directives

1. **Transient Audio Buffer**: Audio bytes are held transiently in memory for feature extraction and discarded immediately.
2. **Zero Disk Persistence**: Raw audio payloads are never saved to disk or persistent databases.
3. **Scrubbed Logs**: Loggers filter raw audio byte strings, API secrets, and sensitive tokens. Only metadata and stage timing metrics are logged.
