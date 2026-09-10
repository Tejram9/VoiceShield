from enum import Enum
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class AudioFormat(str, Enum):
    PCM_S16LE = "pcm_s16le"
    WAV = "wav"
    MP3 = "mp3"
    OGG = "ogg"


class AudioSegment(BaseModel):
    """
    Representation of an ingested raw audio chunk or frame.
    Privacy principle: Audio bytes are held transiently in memory
    for feature extraction and discarded thereafter.
    """
    segment_id: str = Field(..., description="Unique audio chunk/segment identifier")
    session_id: str = Field(..., description="Target security call session ID")
    sample_rate: int = Field(16000, description="Audio sampling rate in Hz (default 16kHz)")
    channels: int = Field(1, description="Audio channel count (1 = mono)")
    duration_ms: float = Field(..., description="Audio duration in milliseconds")
    format: AudioFormat = Field(AudioFormat.PCM_S16LE, description="Audio encoding format")
    audio_bytes: Optional[bytes] = Field(None, description="Transient raw PCM/WAV byte payload")
    audio_base64: Optional[str] = Field(None, description="Optional base64 encoded PCM/WAV audio payload")

    model_config = ConfigDict(arbitrary_types_allowed=True)


class AudioChunkMessage(BaseModel):
    """
    Client -> Server WebSocket audio chunk streaming message envelope.
    Enforces strict typing and validation on streaming audio windows.
    """
    type: str = Field("audio_chunk", description="Message type indicator")
    session_id: str = Field(..., min_length=1, description="Target security call session ID")
    sequence: int = Field(..., ge=0, description="Monotonically increasing sequence number")
    sample_rate: int = Field(16000, description="Audio sampling rate in Hz (must be 16000)")
    channels: int = Field(1, description="Channel count (must be 1 for mono)")
    format: AudioFormat = Field(AudioFormat.PCM_S16LE, description="Audio encoding format")
    duration_ms: float = Field(..., gt=0, le=30000, description="Audio duration in milliseconds")
    audio_base64: str = Field(..., min_length=1, max_length=1000000, description="Base64 encoded PCM/WAV payload")

    @field_validator("sample_rate")
    @classmethod
    def validate_sample_rate(cls, v: int) -> int:
        if v != 16000:
            raise ValueError(f"Unsupported sample rate: {v}Hz. Only 16000Hz is supported.")
        return v

    @field_validator("channels")
    @classmethod
    def validate_channels(cls, v: int) -> int:
        if v != 1:
            raise ValueError(f"Unsupported channel count: {v}. Only mono (1 channel) is supported.")
        return v

    @field_validator("audio_base64")
    @classmethod
    def validate_audio_base64(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("audio_base64 payload must not be empty.")
        return v
