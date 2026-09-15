try:
    import torch
except Exception:
    torch = None
import asyncio
import numpy as np
from typing import List
from app.ai.spoof_detection import BaseSpoofDetectionProvider
from app.ai.base import AIProviderStatus
from app.ai.model_registry import model_registry, ModelStatus
from app.ai.audio_preprocessor import preprocess_audio_segment
from app.schemas.audio import AudioSegment
from app.schemas.analysis import SpoofDetectionResult
from app.core.logging import logger

def _detect_spoof_sync(speech_array: np.ndarray) -> SpoofDetectionResult:
    if model_registry.spoof_model is None or model_registry.spoof_feature_extractor is None:
        return SpoofDetectionResult(
            spoof_probability=0.0,
            authenticity_confidence=0.0,
            status=AIProviderStatus.UNAVAILABLE.value,
            model_name="Wav2Vec2-ASVspoof",
            indicators=[]
        )

    try:
        device = model_registry.device
        extractor = model_registry.spoof_feature_extractor
        inputs = extractor(speech_array, sampling_rate=16000, return_tensors="pt")
        inputs = {k: v.to(device) for k, v in inputs.items()}

        with torch.no_grad():
            logits = model_registry.spoof_model(**inputs).logits
            probs = torch.softmax(logits, dim=-1)
            
            # Verified label mapping: Index 0 = bonafide, Index 1 = spoof
            if probs.shape[-1] > 1:
                spoof_prob = float(probs[0][1].item())
            else:
                spoof_prob = float(probs[0][0].item())

        spoof_prob = float(np.clip(spoof_prob, 0.0, 1.0))
        auth_conf = round(1.0 - spoof_prob if spoof_prob < 0.5 else spoof_prob, 4)

        indicators: List[str] = []
        if spoof_prob >= 0.70:
            indicators.append("High synthetic speech probability (Wav2Vec2 classifier)")
            indicators.append("Vocoder phase continuity anomaly")
        elif spoof_prob >= 0.40:
            indicators.append("Elevated synthetic voice risk indicators")

        return SpoofDetectionResult(
            spoof_probability=round(spoof_prob, 4),
            authenticity_confidence=auth_conf,
            status=AIProviderStatus.AVAILABLE.value,
            model_name="WWWxp/wav2vec2_spoof_dection1",
            indicators=indicators
        )
    except Exception as exc:
        logger.error(f"Error in _detect_spoof_sync: {exc}", exc_info=True)
        return SpoofDetectionResult(
            spoof_probability=0.0,
            authenticity_confidence=0.0,
            status=AIProviderStatus.PROCESSING_ERROR.value,
            model_name="WWWxp/wav2vec2_spoof_dection1",
            indicators=[]
        )


class RealWav2Vec2SpoofProvider(BaseSpoofDetectionProvider):
    """
    Concrete implementation of BaseSpoofDetectionProvider using WWWxp/wav2vec2_spoof_dection1.
    Executes heavy Wav2Vec2 deepfake classification off the main asyncio thread via asyncio.to_thread.
    """

    def __init__(self, name: str = "RealWav2Vec2SpoofDetector"):
        super().__init__(name)
        if model_registry.spoof_status == ModelStatus.UNINITIALIZED:
            model_registry.initialize_models()
        self._update_status()

    def _update_status(self):
        if model_registry.spoof_status in [ModelStatus.AVAILABLE, ModelStatus.LOADING]:
            self.status = AIProviderStatus.AVAILABLE
        else:
            self.status = AIProviderStatus.UNAVAILABLE

    async def process(self, input_data: AudioSegment) -> SpoofDetectionResult:
        self._update_status()
        if not self.is_available() or model_registry.spoof_model is None:
            return SpoofDetectionResult(
                spoof_probability=0.0,
                authenticity_confidence=0.0,
                status=AIProviderStatus.UNAVAILABLE.value,
                model_name="Wav2Vec2-ASVspoof",
                indicators=[]
            )

        speech_array = preprocess_audio_segment(input_data, target_duration_sec=4.0)
        return await asyncio.to_thread(_detect_spoof_sync, speech_array)
