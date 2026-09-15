import threading
import time
from typing import Dict, Any, Optional
from enum import Enum
from app.core.logging import logger

try:
    import torch
    TORCH_AVAILABLE = True
except Exception as _torch_err:
    torch = None
    TORCH_AVAILABLE = False
    logger.warning(f"PyTorch could not be loaded ({_torch_err}). AI model inference will operate in safe fallback mode.")

class ModelStatus(str, Enum):
    UNINITIALIZED = "UNINITIALIZED"
    LOADING = "LOADING"
    AVAILABLE = "AVAILABLE"
    UNAVAILABLE = "UNAVAILABLE"
    PROCESSING_ERROR = "PROCESSING_ERROR"

class AIModelRegistry:
    """
    Thread-safe singleton registry for persistent AI model weight lifecycle management.
    Ensures pretrained models are loaded once at application startup (or lazily on first access),
    kept warm in GPU/CPU memory, and safely reused across incoming analysis requests.
    """

    _instance: Optional['AIModelRegistry'] = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._initialized = False
            return cls._instance

    def __init__(self):
        if self._initialized:
            return

        self._initialized = True
        self.device = "cuda" if (torch is not None and torch.cuda.is_available()) else "cpu"
        
        # Model handles & status dicts
        self.asr_model: Any = None
        self.asr_status: ModelStatus = ModelStatus.UNINITIALIZED
        
        self.speaker_model: Any = None
        self.speaker_status: ModelStatus = ModelStatus.UNINITIALIZED
        
        self.spoof_model: Any = None
        self.spoof_feature_extractor: Any = None
        self.spoof_status: ModelStatus = ModelStatus.UNINITIALIZED
        
        self.load_lock = threading.Lock()

    def initialize_models(self):
        """
        Loads all required AI models into memory once.
        Safely captures failures per model so one failed model loading does not prevent
        other models from functioning or crash the API server.
        """
        with self.load_lock:
            logger.info(f"Initializing AI Model Registry on device '{self.device}'...")

            # 1. Load ASR Model (faster-whisper base)
            if self.asr_status not in [ModelStatus.AVAILABLE, ModelStatus.LOADING]:
                self.asr_status = ModelStatus.LOADING
                try:
                    from faster_whisper import WhisperModel
                    compute_type = "float16" if self.device == "cuda" else "int8"
                    t0 = time.perf_counter()
                    self.asr_model = WhisperModel("base", device=self.device, compute_type=compute_type)
                    load_ms = (time.perf_counter() - t0) * 1000.0
                    self.asr_status = ModelStatus.AVAILABLE
                    logger.info(f"ASR model (faster-whisper base, {compute_type}) loaded in {load_ms:.2f}ms on {self.device}")
                except Exception as exc:
                    self.asr_status = ModelStatus.UNAVAILABLE
                    logger.error(f"Failed to load ASR model: {exc}", exc_info=True)

            # 2. Load Speaker Verification Model (SpeechBrain ECAPA-TDNN)
            if self.speaker_status not in [ModelStatus.AVAILABLE, ModelStatus.LOADING]:
                self.speaker_status = ModelStatus.LOADING
                try:
                    from speechbrain.inference.speaker import EncoderClassifier
                    t0 = time.perf_counter()
                    self.speaker_model = EncoderClassifier.from_hparams(
                        source="speechbrain/spkrec-ecapa-voxceleb",
                        run_opts={"device": self.device}
                    )
                    load_ms = (time.perf_counter() - t0) * 1000.0
                    self.speaker_status = ModelStatus.AVAILABLE
                    logger.info(f"Speaker verification model (ECAPA-TDNN) loaded in {load_ms:.2f}ms on {self.device}")
                except Exception as exc:
                    self.speaker_status = ModelStatus.UNAVAILABLE
                    logger.error(f"Failed to load Speaker Verification model: {exc}", exc_info=True)

            # 3. Load Voice Spoof Detector (WWWxp/wav2vec2_spoof_dection1)
            if self.spoof_status not in [ModelStatus.AVAILABLE, ModelStatus.LOADING]:
                self.spoof_status = ModelStatus.LOADING
                try:
                    from transformers import AutoModelForAudioClassification, AutoFeatureExtractor
                    model_id = "WWWxp/wav2vec2_spoof_dection1"
                    t0 = time.perf_counter()
                    try:
                        self.spoof_feature_extractor = AutoFeatureExtractor.from_pretrained(model_id)
                    except Exception:
                        self.spoof_feature_extractor = AutoFeatureExtractor.from_pretrained("facebook/wav2vec2-base")
                    
                    model = AutoModelForAudioClassification.from_pretrained(model_id)
                    if self.device == "cuda":
                        model = model.to("cuda")
                    model.eval()
                    self.spoof_model = model
                    load_ms = (time.perf_counter() - t0) * 1000.0
                    self.spoof_status = ModelStatus.AVAILABLE
                    logger.info(f"Voice Spoof Detector (Wav2Vec2) loaded in {load_ms:.2f}ms on {self.device}")
                except Exception as exc:
                    self.spoof_status = ModelStatus.UNAVAILABLE
                    logger.error(f"Failed to load Voice Spoof Detection model: {exc}", exc_info=True)

    def get_status_summary(self) -> Dict[str, str]:
        return {
            "device": self.device,
            "asr_status": self.asr_status.value,
            "speaker_status": self.speaker_status.value,
            "spoof_status": self.spoof_status.value,
        }

# Global singleton instance
model_registry = AIModelRegistry()
