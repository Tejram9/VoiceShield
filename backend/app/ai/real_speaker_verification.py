import torch
import asyncio
import numpy as np
from typing import Optional, Dict, Any
from app.ai.speaker_verification import BaseSpeakerVerificationProvider
from app.ai.base import AIProviderStatus
from app.ai.model_registry import model_registry, ModelStatus
from app.ai.audio_preprocessor import preprocess_audio_segment
from app.schemas.audio import AudioSegment
from app.schemas.analysis import SpeakerVerificationResult, VerificationState
from app.core.logging import logger

def _encode_speaker_sync(speech_array: np.ndarray, reference_profile: Optional[Dict[str, Any]]) -> SpeakerVerificationResult:
    if model_registry.speaker_model is None:
        return SpeakerVerificationResult(
            similarity_score=0.0,
            verification_state=VerificationState.NOT_VERIFIED,
            confidence=0.0,
            status=AIProviderStatus.UNAVAILABLE.value,
            model_name="SpeechBrain-ECAPA-TDNN"
        )

    try:
        device = model_registry.device
        signal = torch.from_numpy(speech_array).unsqueeze(0).to(device)

        with torch.no_grad():
            embedding = model_registry.speaker_model.encode_batch(signal)
            if embedding.ndim == 3:
                embedding = embedding.squeeze(1)

        if not reference_profile or "embedding" not in reference_profile:
            return SpeakerVerificationResult(
                similarity_score=0.0,
                verification_state=VerificationState.NOT_VERIFIED,
                confidence=0.0,
                status="REFERENCE_UNAVAILABLE",
                model_name="SpeechBrain-ECAPA-TDNN"
            )

        ref_raw = reference_profile["embedding"]
        if isinstance(ref_raw, list):
            ref_tensor = torch.tensor(ref_raw, dtype=torch.float32, device=device).unsqueeze(0)
        elif isinstance(ref_raw, torch.Tensor):
            ref_tensor = ref_raw.to(device)
            if ref_tensor.ndim == 1:
                ref_tensor = ref_tensor.unsqueeze(0)
        else:
            return SpeakerVerificationResult(
                similarity_score=0.0,
                verification_state=VerificationState.NOT_VERIFIED,
                confidence=0.0,
                status="REFERENCE_INVALID",
                model_name="SpeechBrain-ECAPA-TDNN"
            )

        sim = torch.nn.functional.cosine_similarity(embedding, ref_tensor, dim=-1).mean().item()
        normalized_sim = float(np.clip((sim + 1.0) / 2.0, 0.0, 1.0))
        state = VerificationState.VERIFIED if normalized_sim >= 0.50 else VerificationState.NOT_VERIFIED

        return SpeakerVerificationResult(
            similarity_score=round(normalized_sim, 4),
            verification_state=state,
            confidence=round(normalized_sim, 4),
            status=AIProviderStatus.AVAILABLE.value,
            model_name="SpeechBrain-ECAPA-TDNN"
        )
    except Exception as exc:
        logger.error(f"Error in _encode_speaker_sync: {exc}", exc_info=True)
        return SpeakerVerificationResult(
            similarity_score=0.0,
            verification_state=VerificationState.NOT_VERIFIED,
            confidence=0.0,
            status=AIProviderStatus.PROCESSING_ERROR.value,
            model_name="SpeechBrain-ECAPA-TDNN"
        )


class RealECAPASpeakerProvider(BaseSpeakerVerificationProvider):
    """
    Concrete implementation of BaseSpeakerVerificationProvider using SpeechBrain ECAPA-TDNN.
    Executes heavy embedding extraction off the main asyncio thread via asyncio.to_thread.
    """

    def __init__(self, name: str = "RealECAPASpeakerVerification"):
        super().__init__(name)
        if model_registry.speaker_status == ModelStatus.UNINITIALIZED:
            model_registry.initialize_models()
        self._update_status()

    def _update_status(self):
        if model_registry.speaker_status in [ModelStatus.AVAILABLE, ModelStatus.LOADING]:
            self.status = AIProviderStatus.AVAILABLE
        else:
            self.status = AIProviderStatus.UNAVAILABLE

    async def process_with_reference(
        self,
        audio: AudioSegment,
        reference_profile: Optional[Dict[str, Any]] = None
    ) -> SpeakerVerificationResult:
        self._update_status()
        if not self.is_available() or model_registry.speaker_model is None:
            return SpeakerVerificationResult(
                similarity_score=0.0,
                verification_state=VerificationState.NOT_VERIFIED,
                confidence=0.0,
                status=AIProviderStatus.UNAVAILABLE.value,
                model_name="SpeechBrain-ECAPA-TDNN"
            )

        speech_array = preprocess_audio_segment(audio)
        return await asyncio.to_thread(_encode_speaker_sync, speech_array, reference_profile)
