from abc import abstractmethod
from app.ai.base import BaseAIProvider, AIProviderStatus
from app.schemas.audio import AudioSegment
from app.schemas.analysis import ASRResult


class BaseASRProvider(BaseAIProvider[ASRResult]):
    """
    Abstract interface for Automatic Speech Recognition (ASR).
    Concrete implementations (e.g. OpenAI Whisper, Faster-Whisper)
    will inherit from this interface.
    """

    def __init__(self, name: str = "ASRProvider"):
        super().__init__(name)

    @abstractmethod
    async def process(self, input_data: AudioSegment) -> ASRResult:
        """
        Transcribes an AudioSegment into structured ASRResult containing
        transcribed text, language, confidence, and timestamp information.
        """
        pass


class PlaceholderASRProvider(BaseASRProvider):
    """
    Unloaded placeholder ASR provider contract.
    State is UNAVAILABLE until model weights are mounted in future tasks.
    """

    def __init__(self):
        super().__init__("PlaceholderWhisperASR")
        self.status = AIProviderStatus.UNAVAILABLE

    async def process(self, input_data: AudioSegment) -> ASRResult:
        raise NotImplementedError(
            "ASR model weights are not loaded in foundation phase. "
            "Mount Whisper provider in subsequent model integration task."
        )
