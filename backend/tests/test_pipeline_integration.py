import os
import sys
import base64
import pytest
import numpy as np
import torch
import asyncio
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.audio import AudioSegment, AudioFormat
from app.schemas.analysis import VerificationState
from app.schemas.risk import RiskLevel, RiskAssessment
from app.ai.audio_preprocessor import (
    load_audio_pcm,
    window_audio_samples,
    preprocess_audio_segment,
    parse_audio_bytes,
    AudioProcessingError
)
from app.ai.real_asr import RealWhisperASRProvider
from app.ai.real_speaker_verification import RealECAPASpeakerProvider
from app.ai.real_spoof_detection import RealWav2Vec2SpoofProvider
from app.ai.real_social_engineering import RealSocialEngineeringProvider
from app.services.analysis_orchestrator import AnalysisOrchestrator
from app.services.risk_fusion import RiskFusionEngine
from benchmarks.audio_fixtures import generate_speech_audio_fixture

AUDIO_FIXTURE_PATH = "backend/benchmarks/test_speech_4s.wav"

@pytest.fixture(scope="module", autouse=True)
def setup_audio_fixture():
    generate_speech_audio_fixture(AUDIO_FIXTURE_PATH, duration_sec=4.0)
    yield

client = TestClient(app)

def test_audio_preprocessor_centralized():
    speech_array, sr = load_audio_pcm(AUDIO_FIXTURE_PATH)
    assert sr == 16000
    assert len(speech_array) == 64000
    
    # Test windowing
    windowed = window_audio_samples(speech_array, duration_sec=4.0)
    assert len(windowed) == 64000
    
    # Test parse raw PCM bytes
    pcm_bytes = (speech_array * 32767.0).astype(np.int16).tobytes()
    parsed = parse_audio_bytes(pcm_bytes, sample_rate=16000, audio_format=AudioFormat.PCM_S16LE)
    assert len(parsed) == 64000
    assert parsed.dtype == np.float32

    # Test invalid audio error handling
    with pytest.raises(AudioProcessingError):
        parse_audio_bytes(b"", sample_rate=16000)

def test_real_asr_provider_integration():
    async def run():
        asr = RealWhisperASRProvider()
        segment = AudioSegment(
            segment_id="test-asr",
            session_id="session-test",
            duration_ms=4000.0,
            format=AudioFormat.PCM_S16LE
        )
        result = await asr.process(segment)
        assert result.status in ["AVAILABLE", "UNAVAILABLE"]
        assert isinstance(result.text, str)
    asyncio.run(run())

def test_real_speaker_provider_missing_reference():
    async def run():
        spk = RealECAPASpeakerProvider()
        segment = AudioSegment(
            segment_id="test-spk-no-ref",
            session_id="session-test",
            duration_ms=4000.0,
            format=AudioFormat.PCM_S16LE
        )
        # Without reference embedding profile, must return REFERENCE_UNAVAILABLE status
        result = await spk.process_with_reference(segment, reference_profile=None)
        assert result.status == "REFERENCE_UNAVAILABLE"
        assert result.verification_state == VerificationState.NOT_VERIFIED
    asyncio.run(run())

def test_real_speaker_provider_with_reference():
    if not torch.cuda.is_available():
        pytest.skip("CUDA not available for GPU embedding test")
    async def run():
        spk = RealECAPASpeakerProvider()
        speech, _ = load_audio_pcm(AUDIO_FIXTURE_PATH)
        
        # Generate 192-dim reference embedding vector
        signal = torch.from_numpy(speech).unsqueeze(0).to("cuda" if torch.cuda.is_available() else "cpu")
        with torch.no_grad():
            from app.ai.model_registry import model_registry
            if model_registry.speaker_model:
                ref_emb = model_registry.speaker_model.encode_batch(signal).squeeze(1).cpu().numpy().tolist()[0]
                
                segment = AudioSegment(
                    segment_id="test-spk-ref",
                    session_id="session-test",
                    duration_ms=4000.0,
                    format=AudioFormat.PCM_S16LE
                )
                res = await spk.process_with_reference(segment, reference_profile={"embedding": ref_emb})
                assert res.status == "AVAILABLE"
                assert res.similarity_score >= 0.50
                assert res.verification_state == VerificationState.VERIFIED
    asyncio.run(run())

def test_real_spoof_provider_integration():
    async def run():
        spf = RealWav2Vec2SpoofProvider()
        segment = AudioSegment(
            segment_id="test-spf",
            session_id="session-test",
            duration_ms=4000.0,
            format=AudioFormat.PCM_S16LE
        )
        res = await spf.process(segment)
        assert res.status in ["AVAILABLE", "UNAVAILABLE"]
        assert 0.0 <= res.spoof_probability <= 1.0
    asyncio.run(run())

def test_real_social_engineering_nlp():
    async def run():
        se = RealSocialEngineeringProvider()
        res = await se.analyze_transcript("Please transfer bank funds immediately to account 1234")
        assert res.status == "AVAILABLE"
        assert res.financial_request_detected is True
        assert res.urgency_score > 0.0
        assert len(res.findings) > 0
    asyncio.run(run())

def test_orchestrator_pipeline_execution():
    async def run():
        orchestrator = AnalysisOrchestrator()
        segment = AudioSegment(
            segment_id="test-orch-seg",
            session_id="VS-2026-TEST-ORCH",
            duration_ms=4000.0,
            format=AudioFormat.PCM_S16LE
        )
        assessment = await orchestrator.analyze_audio_segment(
            session_id="VS-2026-TEST-ORCH",
            audio_segment=segment
        )
        assert isinstance(assessment, RiskAssessment)
        assert 0 <= assessment.risk_score <= 100
        assert assessment.risk_level in [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH]
    asyncio.run(run())

def test_rest_api_full_pipeline():
    # 1. Create session
    resp = client.post("/api/v1/analysis/sessions", json={
        "caller_name": "Test User",
        "caller_role": "Executive",
        "caller_number": "+1 555 0000"
    })
    assert resp.status_code == 201
    data = resp.json()
    session_id = data["session_id"]
    
    # 2. Get session
    resp = client.get(f"/api/v1/analysis/sessions/{session_id}")
    assert resp.status_code == 200
    assert resp.json()["session_id"] == session_id
    
    # 3. Analyze segment with REST call
    speech_array, _ = load_audio_pcm(AUDIO_FIXTURE_PATH)
    pcm_bytes = (speech_array * 32767.0).astype(np.int16).tobytes()
    b64_audio = base64.b64encode(pcm_bytes).decode("utf-8")
    
    analyze_resp = client.post(f"/api/v1/analysis/sessions/{session_id}/analyze", json={
        "sample_rate": 16000,
        "duration_ms": 4000.0,
        "format": "pcm_s16le",
        "audio_base64": b64_audio,
        "context_metadata": {"origin_risk_score": 20.0}
    })
    assert analyze_resp.status_code == 200
    assessment_data = analyze_resp.json()
    assert "risk_score" in assessment_data
    assert "risk_level" in assessment_data
    assert "contributing_signals" in assessment_data

def test_websocket_connection_endpoint():
    with client.websocket_connect("/ws/sessions/VS-2026-WS-TEST") as websocket:
        websocket.send_text("ping")
        data = websocket.receive_text()
        assert data == "pong"
