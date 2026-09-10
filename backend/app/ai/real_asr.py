import os
import tempfile
import wave
import asyncio
import numpy as np
from typing import Optional
from app.ai.asr import BaseASRProvider
from app.ai.base import AIProviderStatus
from app.ai.model_registry import model_registry, ModelStatus
from app.ai.audio_preprocessor import preprocess_audio_segment
from app.schemas.audio import AudioSegment
from app.schemas.analysis import ASRResult
from app.core.logging import logger

def _transcribe_sync(speech_array: np.ndarray, duration_ms: float) -> ASRResult:
    if model_registry.asr_model is None:
        return ASRResult(
            text="",
            language="en",
            confidence=0.0,
            duration_ms=duration_ms,
            word_timestamps=[],
            status=AIProviderStatus.UNAVAILABLE.value
        )

    temp_wav_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_file:
            temp_wav_path = tmp_file.name

        pcm_int16 = (speech_array * 32767.0).clip(-32768, 32767).astype(np.int16)
        with wave.open(temp_wav_path, 'wb') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(16000)
            wf.writeframes(pcm_int16.tobytes())

        segments, info = model_registry.asr_model.transcribe(
            temp_wav_path,
            beam_size=1,
            language="en"
        )
        
        transcript = "".join([s.text for s in segments]).strip()
        detected_lang = getattr(info, 'language', 'en') or 'en'
        
        return ASRResult(
            text=transcript,
            language=detected_lang,
            confidence=1.0 if transcript else 0.0,
            duration_ms=duration_ms,
            word_timestamps=[],
            status=AIProviderStatus.AVAILABLE.value
        )
    except Exception as exc:
        logger.error(f"Error in _transcribe_sync: {exc}", exc_info=True)
        return ASRResult(
            text="",
            language="en",
            confidence=0.0,
            duration_ms=duration_ms,
            word_timestamps=[],
            status=AIProviderStatus.PROCESSING_ERROR.value
        )
    finally:
        if temp_wav_path and os.path.exists(temp_wav_path):
            try:
                os.remove(temp_wav_path)
            except Exception:
                pass


class RealWhisperASRProvider(BaseASRProvider):
    """
    Concrete implementation of BaseASRProvider using faster-whisper (base model).
    Executes heavy model inference off the main asyncio thread using asyncio.to_thread.
    """

    def __init__(self, name: str = "RealWhisperASR"):
        super().__init__(name)
        if model_registry.asr_status == ModelStatus.UNINITIALIZED:
            model_registry.initialize_models()
        self._update_status()

    def _update_status(self):
        if model_registry.asr_status in [ModelStatus.AVAILABLE, ModelStatus.LOADING]:
            self.status = AIProviderStatus.AVAILABLE
        else:
            self.status = AIProviderStatus.UNAVAILABLE

    async def process(self, input_data: AudioSegment) -> ASRResult:
        self._update_status()
        if not self.is_available() or model_registry.asr_model is None:
            return ASRResult(
                text="",
                language="en",
                confidence=0.0,
                duration_ms=input_data.duration_ms,
                word_timestamps=[],
                status=AIProviderStatus.UNAVAILABLE.value
            )

        speech_array = preprocess_audio_segment(input_data)
        return await asyncio.to_thread(_transcribe_sync, speech_array, input_data.duration_ms)
