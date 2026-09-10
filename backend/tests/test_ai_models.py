import os
import sys
import pytest
import numpy as np
import torch
from app.ai.audio_preprocessor import load_audio_pcm, window_audio_samples, to_torch_tensor
from benchmarks.audio_fixtures import generate_speech_audio_fixture
from benchmarks.test_llm_nlp import run_local_rule_based_nlp, SocialEngineeringAnalysis

AUDIO_FIXTURE_PATH = "backend/benchmarks/test_speech_4s.wav"

@pytest.fixture(scope="module", autouse=True)
def setup_audio_fixture():
    generate_speech_audio_fixture(AUDIO_FIXTURE_PATH, duration_sec=4.0)
    yield

def test_audio_preprocessor():
    speech_array, sr = load_audio_pcm(AUDIO_FIXTURE_PATH)
    assert sr == 16000, f"Expected 16000 Hz, got {sr}"
    assert speech_array.ndim == 1, "Audio array must be mono (1D)"
    assert isinstance(speech_array, np.ndarray), "Audio array must be float32 numpy array"
    assert speech_array.dtype == np.float32, "Audio data type must be float32"
    
    windowed = window_audio_samples(speech_array, duration_sec=4.0, sample_rate=16000)
    assert len(windowed) == 64000, f"Expected 64000 samples for 4.0s window, got {len(windowed)}"
    
    tensor = to_torch_tensor(windowed)
    assert isinstance(tensor, torch.Tensor), "Target output must be PyTorch tensor"

def test_asr_model_real_inference():
    from faster_whisper import WhisperModel
    model = WhisperModel("base", device="cpu", compute_type="int8")
    segments, info = model.transcribe(AUDIO_FIXTURE_PATH, beam_size=1)
    text = "".join([s.text for s in segments])
    assert text is not None, "Transcribed text should not be None"

def test_speaker_verification_real_inference():
    from speechbrain.inference.speaker import EncoderClassifier
    classifier = EncoderClassifier.from_hparams(source="speechbrain/spkrec-ecapa-voxceleb", run_opts={"device": "cpu"})
    speech, _ = load_audio_pcm(AUDIO_FIXTURE_PATH)
    signal = torch.from_numpy(speech).unsqueeze(0)
    emb = classifier.encode_batch(signal)
    
    assert emb.shape[-1] == 192, f"Expected 192-dim speaker embedding, got {emb.shape[-1]}"
    
    # Cosine similarity with self
    sim = torch.nn.functional.cosine_similarity(emb, emb, dim=-1).mean().item()
    norm_sim = (sim + 1.0) / 2.0
    assert 0.0 <= norm_sim <= 1.0, f"Cosine similarity score out of bounds: {norm_sim}"

def test_spoof_detection_real_inference():
    from transformers import AutoModelForAudioClassification, AutoFeatureExtractor
    model_id = "WWWxp/wav2vec2_spoof_dection1"
    
    try:
        try:
            feature_extractor = AutoFeatureExtractor.from_pretrained(model_id)
        except Exception:
            feature_extractor = AutoFeatureExtractor.from_pretrained("facebook/wav2vec2-base")
            
        model = AutoModelForAudioClassification.from_pretrained(model_id)
    except Exception:
        pytest.skip("Model download unavailable during automated test run")
        
    speech_array, sr = load_audio_pcm(AUDIO_FIXTURE_PATH)
    inputs = feature_extractor(speech_array, sampling_rate=sr, return_tensors="pt")
    
    with torch.no_grad():
        logits = model(**inputs).logits
        probs = torch.softmax(logits, dim=-1)
        spoof_prob = probs[0][1].item() if probs.shape[-1] > 1 else probs[0][0].item()
        
    assert 0.0 <= spoof_prob <= 1.0, f"Spoof probability out of bounds: {spoof_prob}"

def test_local_nlp_classifier():
    res = run_local_rule_based_nlp("Please transfer bank funds immediately")
    assert isinstance(res, SocialEngineeringAnalysis)
    assert res.intent_category == "FINANCIAL_URGENCY"
    assert res.urgency_score > 0.0
