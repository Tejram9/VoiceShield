from abc import abstractmethod
from typing import Optional, Dict, Any
from app.ai.base import BaseAIProvider, AIProviderStatus
from app.schemas.audio import AudioSegment
from app.schemas.analysis import SpeakerVerificationResult, VerificationState


class BaseSpeakerVerificationProvider(BaseAIProvider[SpeakerVerificationResult]):
    """
    Abstract interface for Speaker Verification (Voice Biometrics).
    Concrete implementations (e.g. SpeechBrain ECAPA-TDNN)
    will inherit from this interface.
    """

    def __init__(self, name: str = "SpeakerVerificationProvider"):
        super().__init__(name)

    @abstractmethod
    async def process_with_reference(
        self,
        audio: AudioSegment,
        reference_profile: Optional[Dict[str, Any]] = None
    ) -> SpeakerVerificationResult:
        """
        Compares an incoming AudioSegment against a trusted speaker reference profile.
        Returns SpeakerVerificationResult containing similarity_score (0.0 to 1.0)
        and verification_state (VERIFIED, NOT_VERIFIED, UNKNOWN).
        """
        pass

    async def process(self, input_data: AudioSegment) -> SpeakerVerificationResult:
        return await self.process_with_reference(input_data, None)


class PlaceholderSpeakerVerificationProvider(BaseSpeakerVerificationProvider):
    """
    Unloaded placeholder speaker verification provider contract.
    State is UNAVAILABLE until embedding model weights are mounted.
    """

    def __init__(self):
        super().__init__("PlaceholderECAPA-TDNN")
        self.status = AIProviderStatus.UNAVAILABLE

    async def process_with_reference(
        self,
        audio: AudioSegment,
        reference_profile: Optional[Dict[str, Any]] = None
    ) -> SpeakerVerificationResult:
        raise NotImplementedError(
            "Speaker verification model weights are not loaded in foundation phase. "
            "Mount ECAPA-TDNN provider in subsequent model integration task."
        )
