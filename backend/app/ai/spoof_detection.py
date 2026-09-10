from abc import abstractmethod
from app.ai.base import BaseAIProvider, AIProviderStatus
from app.schemas.audio import AudioSegment
from app.schemas.analysis import SpoofDetectionResult


class BaseSpoofDetectionProvider(BaseAIProvider[SpoofDetectionResult]):
    """
    Abstract interface for Voice Spoof & Synthetic Speech Detection.
    Concrete implementations (e.g. AASIST, Wav2Vec2 audio spoof classifier)
    will inherit from this interface.
    """

    def __init__(self, name: str = "SpoofDetectionProvider"):
        super().__init__(name)

    @abstractmethod
    async def process(self, input_data: AudioSegment) -> SpoofDetectionResult:
        """
        Evaluates an AudioSegment for synthetic speech, vocoder artifacts, and AI voice cloning.
        Returns SpoofDetectionResult containing spoof_probability (0.0 to 1.0)
        and authenticity_confidence.
        """
        pass


class PlaceholderSpoofDetectionProvider(BaseSpoofDetectionProvider):
    """
    Unloaded placeholder voice spoof detection provider contract.
    State is UNAVAILABLE until deepfake classifier weights are mounted.
    """

    def __init__(self):
        super().__init__("PlaceholderAASISTSpoofDetector")
        self.status = AIProviderStatus.UNAVAILABLE

    async def process(self, input_data: AudioSegment) -> SpoofDetectionResult:
        raise NotImplementedError(
            "Voice spoof detection model weights are not loaded in foundation phase. "
            "Mount AASIST/Wav2Vec2 spoof detector in subsequent model integration task."
        )
