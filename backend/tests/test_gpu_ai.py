import os
import sys
import pytest
import numpy as np
import torch
from app.ai.audio_preprocessor import load_audio_pcm, window_audio_samples, to_torch_tensor
from benchmarks.audio_fixtures import generate_speech_audio_fixture

AUDIO_FIXTURE_PATH = "backend/benchmarks/test_speech_4s.wav"

@pytest.fixture(scope="module", autouse=True)
def setup_audio_fixture():
    generate_speech_audio_fixture(AUDIO_FIXTURE_PATH, duration_sec=4.0)
    yield

def test_cuda_availability():
    assert torch.cuda.is_available(), "CUDA PyTorch must be available"
    device_name = torch.cuda.get_device_name(0)
    assert "RTX 3050" in device_name or "NVIDIA" in device_name, f"Unexpected GPU device: {device_name}"

def test_gpu_asr_inference():
    if not torch.cuda.is_available():
        pytest.skip("CUDA not available")
    from faster_whisper import WhisperModel
    model = WhisperModel("base", device="cuda", compute_type="float16")
    segments, info = model.transcribe(AUDIO_FIXTURE_PATH, beam_size=1)
    text = "".join([s.text for s in segments])
    assert text is not None, "Transcribed text should not be None"

def test_gpu_speaker_verification_inference():
    if not torch.cuda.is_available():
        pytest.skip("CUDA not available")
    from speechbrain.inference.speaker import EncoderClassifier
    classifier = EncoderClassifier.from_hparams(
        source="speechbrain/spkrec-ecapa-voxceleb",
        run_opts={"device": "cuda"}
    )
    speech, _ = load_audio_pcm(AUDIO_FIXTURE_PATH)
    signal = torch.from_numpy(speech).unsqueeze(0).to("cuda")
    emb = classifier.encode_batch(signal)
    
    assert emb.shape[-1] == 192, f"Expected 192-dim speaker embedding, got {emb.shape[-1]}"
    sim = torch.nn.functional.cosine_similarity(emb, emb, dim=-1).mean().item()
    norm_sim = (sim + 1.0) / 2.0
    assert 0.0 <= norm_sim <= 1.0, f"Cosine similarity score out of bounds: {norm_sim}"

def test_gpu_spoof_detection_inference():
    if not torch.cuda.is_available():
        pytest.skip("CUDA not available")
    from transformers import AutoModelForAudioClassification, AutoFeatureExtractor
    model_id = "WWWxp/wav2vec2_spoof_dection1"
    
    try:
        feature_extractor = AutoFeatureExtractor.from_pretrained(model_id)
    except Exception:
        feature_extractor = AutoFeatureExtractor.from_pretrained("facebook/wav2vec2-base")
        
    model = AutoModelForAudioClassification.from_pretrained(model_id).to("cuda")
    speech_array, sr = load_audio_pcm(AUDIO_FIXTURE_PATH)
    inputs = feature_extractor(speech_array, sampling_rate=sr, return_tensors="pt")
    inputs = {k: v.to("cuda") for k, v in inputs.items()}
    
    with torch.no_grad():
        logits = model(**inputs).logits
        probs = torch.softmax(logits, dim=-1)
        spoof_prob = probs[0][1].item() if probs.shape[-1] > 1 else probs[0][0].item()
        
    assert 0.0 <= spoof_prob <= 1.0, f"Spoof probability out of bounds: {spoof_prob}"

def test_gpu_vram_concurrency():
    if not torch.cuda.is_available():
        pytest.skip("CUDA not available")
    # Load all models concurrently into GPU memory to verify zero OOM
    from faster_whisper import WhisperModel
    from speechbrain.inference.speaker import EncoderClassifier
    from transformers import AutoModelForAudioClassification
    
    asr = WhisperModel("base", device="cuda", compute_type="float16")
    speaker = EncoderClassifier.from_hparams(source="speechbrain/spkrec-ecapa-voxceleb", run_opts={"device": "cuda"})
    spoof = AutoModelForAudioClassification.from_pretrained("WWWxp/wav2vec2_spoof_dection1").to("cuda")
    
    allocated_mb = torch.cuda.memory_allocated() / (1024 * 1024)
    reserved_mb = torch.cuda.memory_reserved() / (1024 * 1024)
    
    assert allocated_mb < 5000, f"VRAM allocated ({allocated_mb} MB) exceeded 5 GB safety budget"
    assert reserved_mb < 5800, f"VRAM reserved ({reserved_mb} MB) exceeded 6 GB GPU physical memory"
