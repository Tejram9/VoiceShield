import os
import math
import wave
import struct

def generate_speech_audio_fixture(
    filename: str = "test_speech_4s.wav",
    duration_sec: float = 4.0,
    sample_rate: int = 16000
) -> str:
    """
    Generates a 16kHz Mono PCM_S16LE speech audio fixture containing
    multi-frequency harmonic tones simulating human vocal formants.
    """
    num_samples = int(sample_rate * duration_sec)
    os.makedirs(os.path.dirname(filename) if os.path.dirname(filename) else ".", exist_ok=True)
    
    with wave.open(filename, 'wb') as wav_file:
        wav_file.setnchannels(1) # Mono
        wav_file.setsampwidth(2) # 16-bit PCM (2 bytes)
        wav_file.setframerate(sample_rate)
        
        # Formant frequencies: 150 Hz (fundamental F0), 800 Hz (F1), 1200 Hz (F2)
        samples = []
        for i in range(num_samples):
            t = i / sample_rate
            # Modulate amplitude to simulate speech cadence and word pauses
            cadence = 0.5 * (1.0 + math.sin(2 * math.pi * 2.5 * t))
            val = (
                0.5 * math.sin(2 * math.pi * 150.0 * t) +
                0.3 * math.sin(2 * math.pi * 800.0 * t) +
                0.2 * math.sin(2 * math.pi * 1200.0 * t)
            ) * cadence * 0.7
            
            sample_int = int(val * 32767.0)
            sample_int = max(-32768, min(32767, sample_int))
            samples.append(struct.pack('<h', sample_int))
            
        wav_file.writeframes(b''.join(samples))
        
    return filename

if __name__ == "__main__":
    path = generate_speech_audio_fixture("backend/benchmarks/test_speech_4s.wav", 4.0)
    print(f"Generated 4.0s audio fixture at: {path}")
