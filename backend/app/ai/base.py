from abc import ABC, abstractmethod
from enum import Enum
import time
from typing import Any, Dict, Generic, Optional, TypeVar
from pydantic import BaseModel
from app.core.logging import logger

T = TypeVar("T", bound=BaseModel)


class AIProviderStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    UNAVAILABLE = "UNAVAILABLE"
    PROCESSING_ERROR = "PROCESSING_ERROR"
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"


class BaseAIProvider(ABC, Generic[T]):
    """
    Abstract base class for all VoiceShield AI model providers.
    Ensures a clean separation between model contracts and actual model weight implementations.
    Provides execution timing, provider status tracking, and error boundary protections.
    """

    def __init__(self, name: str):
        self.name = name
        self.status = AIProviderStatus.UNAVAILABLE

    def is_available(self) -> bool:
        return self.status == AIProviderStatus.AVAILABLE

    @abstractmethod
    async def process(self, input_data: Any) -> T:
        """
        Executes model inference on input_data and returns a structured output schema.
        Must be implemented by concrete model wrappers.
        """
        pass

    async def safe_process(self, input_data: Any, session_id: str = "global") -> Optional[T]:
        """
        Wrapper providing execution timing and partial failure handling.
        If a model fails or is unavailable, logs the failure and returns None,
        preventing single-model crashes from breaking the entire session orchestrator.
        """
        if not self.is_available():
            logger.warning(
                f"Provider {self.name} is currently unavailable. Skipping inference.",
                extra={"session_id": session_id}
            )
            return None

        start_time = time.perf_counter()
        try:
            result = await self.process(input_data)
            elapsed_ms = (time.perf_counter() - start_time) * 1000.0
            logger.info(
                f"Provider {self.name} completed inference in {elapsed_ms:.2f}ms.",
                extra={"session_id": session_id}
            )
            return result
        except Exception as exc:
            elapsed_ms = (time.perf_counter() - start_time) * 1000.0
            logger.error(
                f"Provider {self.name} failed after {elapsed_ms:.2f}ms: {exc}",
                exc_info=True,
                extra={"session_id": session_id}
            )
            return None
