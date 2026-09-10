# VoiceShield - AI Engine Architecture & Selected Models

The **VoiceShield Intelligence Layer** provides near-real-time detection of voice clone artifacts, speaker verification mismatches, social engineering coercion signals, and fused multi-modal risk scoring.

---

## 1. Final Verified AI Model Stack (Prompt 7, 7.1 & 8 Pipeline Integration)

- **ASR (Speech-to-Text)**: `RealWhisperASRProvider` (`faster-whisper` `base` model on CUDA float16 / CPU int8).
- **Speaker Verification**: `RealECAPASpeakerProvider` (`speechbrain/spkrec-ecapa-voxceleb` ECAPA-TDNN generating 192-dim embeddings).
- **Voice Spoof Detection**: `RealWav2Vec2SpoofProvider` (`WWWxp/wav2vec2_spoof_dection1` Wav2Vec2 classifier evaluating 4.0s windows).
- **Social Engineering Analysis**: `RealSocialEngineeringProvider` (Fast local rule-based NLP keyword classifier + optional cloud LLM JSON mode).

For full selection rationales, licensing details, CUDA installation notes, and empirical resource benchmarks, see [AI_MODEL_DECISION.md](file:///d:/VoiceShield/docs/AI_MODEL_DECISION.md) and [AI_RUNTIME.md](file:///d:/VoiceShield/docs/AI_RUNTIME.md).

---

## 2. Audio Preprocessing & Concurrency Pipeline

- **Canonical Preprocessor**: `app.ai.audio_preprocessor` (16,000 Hz Mono PCM WAV float32 format).
- **Parallel Execution**: ASR, Speaker Verification, and Voice Spoof Detection run concurrently via `asyncio.to_thread` background worker threads.
- **WebSocket Streaming**: Real-time event broadcasts (`ANALYSIS_STARTED`, `ASR_UPDATED`, `SPEAKER_ANALYSIS_UPDATED`, `SPOOF_ANALYSIS_UPDATED`, `SOCIAL_ENGINEERING_UPDATED`, `RISK_UPDATE`, `SECURITY_FINDING`, `ANALYSIS_COMPLETED`).

---

## 3. Measured Real-Inference Performance (CPU vs CUDA GPU)

| Model | Device | Cold Load | Warm Latency | GPU Allocated VRAM | GPU Reserved VRAM | Integration Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **faster-whisper-base** | CPU | 2.85 s | 853.2 ms | 0.0 MB | 0.0 MB | **REAL / CONNECTED** |
| **faster-whisper-base** | CUDA | 210.05 s | 365.2 ms | 0.0 MB | 0.0 MB | **REAL / CONNECTED** |
| **speechbrain ECAPA-TDNN**| CPU | 12.74 s | 156.0 ms | 0.0 MB | 0.0 MB | **REAL / CONNECTED** |
| **speechbrain ECAPA-TDNN**| CUDA | 3.82 s | 94.6 ms | 86.1 MB | 96.0 MB | **REAL / CONNECTED** |
| **WWWxp/wav2vec2-spoof** | CPU | 11.67 s | 241.7 ms | 0.0 MB | 0.0 MB | **REAL / CONNECTED** |
| **WWWxp/wav2vec2-spoof** | CUDA | 5.27 s | 25.0 ms | 363.0 MB | 340.0 MB | **REAL / CONNECTED** |
| **Local Rule NLP Fallback**| CPU | < 0.01 s | 0.098 ms | 0.0 MB | 0.0 MB | **REAL / CONNECTED** |

- **Automated Integration Test Suite**: **19 / 19 PASSED** (`tests/test_ai_models.py`, `tests/test_gpu_ai.py`, `tests/test_pipeline_integration.py`)

---

## 4. Privacy & Security Principles

1. **Transient Audio**: Raw audio bytes are processed in sliding memory buffers and discarded immediately.
2. **Scrubbed Logs**: Audio payloads and secrets are filtered from application logs.
3. **No Unsanctioned Persistence**: Audio stream frames are never saved to disk.
