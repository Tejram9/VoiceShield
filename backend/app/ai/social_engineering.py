from abc import abstractmethod
from typing import Optional, Dict, Any, List
from app.ai.base import BaseAIProvider, AIProviderStatus
from app.schemas.analysis import SocialEngineeringResult, SecurityFinding


class BaseSocialEngineeringProvider(BaseAIProvider[SocialEngineeringResult]):
    """
    Abstract interface for Social Engineering & NLP Intent Analysis.
    Concrete implementations (e.g. LLM classifiers, rule-based NLP engines)
    will inherit from this interface.
    """

    def __init__(self, name: str = "SocialEngineeringProvider"):
        super().__init__(name)

    @abstractmethod
    async def analyze_transcript(
        self,
        transcript: str,
        history: Optional[List[str]] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> SocialEngineeringResult:
        """
        Analyzes a spoken transcript for social engineering indicators,
        coercion demands, financial requests, and authority impersonation.
        Returns structured SocialEngineeringResult with SecurityFinding objects.
        """
        pass

    async def process(self, input_data: str) -> SocialEngineeringResult:
        return await self.analyze_transcript(input_data)


class PlaceholderSocialEngineeringProvider(BaseSocialEngineeringProvider):
    """
    Unloaded placeholder social engineering provider contract.
    State is UNAVAILABLE until NLP/LLM integration is mounted.
    """

    def __init__(self):
        super().__init__("PlaceholderLLMSocialEngineering")
        self.status = AIProviderStatus.UNAVAILABLE

    async def analyze_transcript(
        self,
        transcript: str,
        history: Optional[List[str]] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> SocialEngineeringResult:
        raise NotImplementedError(
            "Social engineering NLP model is not loaded in foundation phase. "
            "Mount LLM provider in subsequent model integration task."
        )
