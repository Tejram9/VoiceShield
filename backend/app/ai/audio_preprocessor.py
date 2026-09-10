import os
import io
import wave
import base64
import numpy as np
import torch
from typing import Tuple, Union, Optional
from app.schemas.audio import AudioSegment, AudioFormat

CANONICAL_SAMPLE_RATE = 16000
CANONICAL_CHANNELS = 1
CANONICAL_SAMPLE_WIDTH = 2 # 16-bit PCM (2 bytes)

class AudioProcessingError(ValueError):
    """Custom exception raised for invalid or unparseable audio payloads."""
    pass

def load_audio_pcm(file_path: str, target_sr: int = CANONICAL_SAMPLE_RATE) -> Tuple[np.ndarray, int]:
    """
    Loads a WAV or PCM audio file into a 1D float32 numpy array normalized to [-1.0, 1.0].
    Performs mono conversion if multi-channel.
    """
    if not os.path.exists(file_path):
        raise AudioProcessingError(f"Audio file path does not exist: {file_path}")

    try:
        import soundfile as sf
        speech_array, sr = sf.read(file_path, dtype='float32')
        if speech_array.ndim > 1:
            speech_array = np.mean(speech_array, axis=1)
        return speech_array, sr
    except Exception:
        with wave.open(file_path, 'rb') as wav_file:
            n_channels = wav_file.getnchannels()
            sample_width = wav_file.getsampwidth()
            framerate = wav_file.getframerate()
            n_frames = wav_file.getnframes()
            
            raw_bytes = wav_file.readframes(n_frames)
            
            if sample_width == 2:
                dtype = np.int16
                norm_factor = 32768.0
            elif sample_width == 4:
                dtype = np.int32
                norm_factor = 2147483648.0
            else:
                dtype = np.uint8
                norm_factor = 128.0
                
            samples = np.frombuffer(raw_bytes, dtype=dtype).astype(np.float32)
            if n_channels > 1:
                samples = samples.reshape(-1, n_channels).mean(axis=1)
            samples /= norm_factor
            return samples, framerate

def window_audio_samples(
    speech_array: np.ndarray, 
    duration_sec: float = 4.0, 
    sample_rate: int = CANONICAL_SAMPLE_RATE
) -> np.ndarray:
    """
    Pads (with zeros) or truncates a 1D audio numpy array to fit the target window duration.
    """
    target_samples = int(duration_sec * sample_rate)
    num_samples = len(speech_array)
    
    if num_samples == target_samples:
        return speech_array
    elif num_samples < target_samples:
        padded = np.zeros(target_samples, dtype=np.float32)
        padded[:num_samples] = speech_array
        return padded
    else:
        return speech_array[:target_samples]

def parse_audio_bytes(
    raw_payload: Union[bytes, str],
    sample_rate: int = CANONICAL_SAMPLE_RATE,
    audio_format: AudioFormat = AudioFormat.PCM_S16LE
) -> np.ndarray:
    """
    Parses raw bytes or base64-encoded audio payload into a 1D float32 numpy array normalized to [-1.0, 1.0].
    """
    if isinstance(raw_payload, str):
        try:
            raw_bytes = base64.b64decode(raw_payload)
        except Exception as exc:
            raise AudioProcessingError(f"Failed to decode base64 audio payload: {exc}")
    else:
        raw_bytes = raw_payload

    if not raw_bytes:
        raise AudioProcessingError("Audio payload is empty (0 bytes).")

    if audio_format == AudioFormat.WAV:
        try:
            with wave.open(io.BytesIO(raw_bytes), 'rb') as wav_file:
                n_channels = wav_file.getnchannels()
                sample_width = wav_file.getsampwidth()
                framerate = wav_file.getframerate()
                n_frames = wav_file.getnframes()
                data = wav_file.readframes(n_frames)
                
                if sample_width == 2:
                    dtype = np.int16
                    norm = 32768.0
                elif sample_width == 4:
                    dtype = np.int32
                    norm = 2147483648.0
                else:
                    dtype = np.uint8
                    norm = 128.0
                    
                samples = np.frombuffer(data, dtype=dtype).astype(np.float32)
                if n_channels > 1:
                    samples = samples.reshape(-1, n_channels).mean(axis=1)
                return samples / norm
        except Exception as exc:
            raise AudioProcessingError(f"Failed to parse WAV header/bytes: {exc}")
    else:
        # Default raw 16-bit signed PCM mono
        samples = np.frombuffer(raw_bytes, dtype=np.int16).astype(np.float32)
        if len(samples) == 0:
            raise AudioProcessingError("Zero PCM audio samples decoded.")
        return samples / 32768.0

def preprocess_audio_segment(
    segment: AudioSegment,
    target_duration_sec: float = 4.0,
    sample_rate: int = CANONICAL_SAMPLE_RATE
) -> np.ndarray:
    """
    Canonical preprocessor turning an AudioSegment schema object into a 1D float32 numpy array.
    If audio_bytes is absent, loads test speech fixture or generates synthetic tone for testing.
    """
    if segment.audio_bytes is not None:
        speech_array = parse_audio_bytes(
            segment.audio_bytes,
            sample_rate=segment.sample_rate or sample_rate,
            audio_format=segment.format
        )
    else:
        # Fallback to test speech fixture if available
        fixture_path = "backend/benchmarks/test_speech_4s.wav"
        if os.path.exists(fixture_path):
            speech_array, _ = load_audio_pcm(fixture_path, target_sr=sample_rate)
        else:
            # Synthetic 4.0s 440Hz sine wave tone for dry run testing
            t = np.linspace(0, target_duration_sec, int(target_duration_sec * sample_rate), False)
            speech_array = (0.3 * np.sin(2 * np.pi * 440 * t)).astype(np.float32)

    return window_audio_samples(speech_array, duration_sec=target_duration_sec, sample_rate=sample_rate)

def to_torch_tensor(speech_array: np.ndarray, device: str = "cpu") -> torch.Tensor:
    """
    Converts 1D numpy array to a PyTorch FloatTensor on the target device.
    """
    tensor = torch.from_numpy(speech_array).float()
    if device != "cpu" and torch.cuda.is_available():
        tensor = tensor.to(device)
    return tensor
