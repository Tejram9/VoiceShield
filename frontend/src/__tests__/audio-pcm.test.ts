import { describe, it, expect } from "vitest";
import {
  AUDIO_SAMPLE_RATE,
  ANALYSIS_WINDOW_SECONDS,
  ANALYSIS_HOP_SECONDS,
  WINDOW_SAMPLES,
  HOP_SAMPLES,
} from "../lib/audio/constants";
import {
  downmixToMono,
  resampleTo16k,
  float32ToInt16Pcm,
  int16PcmToBase64,
  float32ToBase64Pcm,
  RollingAudioBuffer,
} from "../lib/audio/pcm";
import {
  computeRmsLevel,
  hasSignificantAudio,
  float32ToBase64Pcm16,
} from "../lib/audio/encoding";

describe("VoiceShield Audio Constants", () => {
  it("defines canonical 16kHz sampling rate and 4s/1s window/hop geometry", () => {
    expect(AUDIO_SAMPLE_RATE).toBe(16000);
    expect(ANALYSIS_WINDOW_SECONDS).toBe(4);
    expect(ANALYSIS_HOP_SECONDS).toBe(1);
    expect(WINDOW_SAMPLES).toBe(64000); // 16000 * 4
    expect(HOP_SAMPLES).toBe(16000); // 16000 * 1
  });
});

describe("Audio PCM Conversion & Clamping (float32ToInt16Pcm)", () => {
  it("converts normalized Float32 values to signed 16-bit PCM (PCM_S16LE)", () => {
    const input = new Float32Array([0.0, 1.0, -1.0, 0.5, -0.5]);
    const int16 = float32ToInt16Pcm(input);

    expect(int16.length).toBe(5);
    expect(int16[0]).toBe(0);
    expect(int16[1]).toBe(32767);
    expect(int16[2]).toBe(-32768);
    expect(int16[3]).toBe(Math.round(0.5 * 32767));
    expect(int16[4]).toBe(Math.round(-0.5 * 32768));
  });

  it("safely clamps values exceeding [-1.0, 1.0] without integer overflow", () => {
    const input = new Float32Array([1.5, 2.0, 100.0, -1.5, -5.0, -999.0]);
    const int16 = float32ToInt16Pcm(input);

    expect(int16[0]).toBe(32767);
    expect(int16[1]).toBe(32767);
    expect(int16[2]).toBe(32767);
    expect(int16[3]).toBe(-32768);
    expect(int16[4]).toBe(-32768);
    expect(int16[5]).toBe(-32768);
  });

  it("handles empty array gracefully", () => {
    const empty = float32ToInt16Pcm(new Float32Array(0));
    expect(empty.length).toBe(0);
  });
});

describe("Stereo to Mono Downmixing (downmixToMono)", () => {
  it("returns the single channel directly when input is 1 channel", () => {
    const ch0 = new Float32Array([0.1, 0.2, 0.3]);
    const mono = downmixToMono([ch0]);
    expect(mono).toBe(ch0);
  });

  it("computes element-wise arithmetic mean across 2 channels (stereo)", () => {
    const ch0 = new Float32Array([1.0, 0.0, -0.5, 0.8]);
    const ch1 = new Float32Array([0.0, 1.0, -0.5, -0.2]);
    const mono = downmixToMono([ch0, ch1]);

    expect(mono.length).toBe(4);
    expect(mono[0]).toBeCloseTo(0.5, 5);
    expect(mono[1]).toBeCloseTo(0.5, 5);
    expect(mono[2]).toBeCloseTo(-0.5, 5);
    expect(mono[3]).toBeCloseTo(0.3, 5);
  });

  it("handles multi-channel (4 channels) correctly", () => {
    const ch0 = new Float32Array([0.4]);
    const ch1 = new Float32Array([0.2]);
    const ch2 = new Float32Array([0.6]);
    const ch3 = new Float32Array([0.8]);
    const mono = downmixToMono([ch0, ch1, ch2, ch3]);
    expect(mono[0]).toBeCloseTo(0.5, 5);
  });

  it("returns empty Float32Array on empty or null input", () => {
    expect(downmixToMono([]).length).toBe(0);
  });
});

describe("Linear Resampling to 16kHz (resampleTo16k)", () => {
  it("returns original array when source rate is already 16000Hz", () => {
    const input = new Float32Array([0.1, 0.2, 0.3]);
    const resampled = resampleTo16k(input, 16000, 16000);
    expect(resampled).toBe(input);
  });

  it("resamples 48kHz audio (3:1 downsample) to 16kHz with exact length", () => {
    // 48,000 samples @ 48kHz = 1.0 second -> resampled should be exactly 16,000 samples
    const input48k = new Float32Array(48000);
    for (let i = 0; i < 48000; i++) {
      input48k[i] = Math.sin((2 * Math.PI * 440 * i) / 48000);
    }

    const resampled16k = resampleTo16k(input48k, 48000, 16000);
    expect(resampled16k.length).toBe(16000);
  });

  it("resamples 44.1kHz audio to 16kHz", () => {
    const input44k = new Float32Array(44100);
    const resampled16k = resampleTo16k(input44k, 44100, 16000);
    expect(resampled16k.length).toBe(16000);
  });

  it("handles empty array gracefully", () => {
    expect(resampleTo16k(new Float32Array(0), 48000, 16000).length).toBe(0);
  });
});

describe("Base64 Serialization (int16PcmToBase64 & float32ToBase64Pcm)", () => {
  it("encodes 16-bit PCM bytes to standard base64", () => {
    const int16 = new Int16Array([0, 32767, -32768]);
    const b64 = int16PcmToBase64(int16);
    expect(typeof b64).toBe("string");
    expect(b64.length).toBeGreaterThan(0);

    // Verify roundtrip decoding via Uint8Array
    const binary = atob(b64);
    const decodedBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      decodedBytes[i] = binary.charCodeAt(i);
    }
    const decodedInt16 = new Int16Array(decodedBytes.buffer);
    expect(decodedInt16[0]).toBe(0);
    expect(decodedInt16[1]).toBe(32767);
    expect(decodedInt16[2]).toBe(-32768);
  });

  it("processes large buffers (>8192 bytes = 64,000 samples = 128,000 bytes) without stack overflow", () => {
    const largeWindow = new Float32Array(64000);
    for (let i = 0; i < 64000; i++) {
      largeWindow[i] = 0.5 * Math.sin(i * 0.1);
    }

    const b64 = float32ToBase64Pcm(largeWindow);
    expect(typeof b64).toBe("string");
    // 64000 int16 samples = 128000 bytes -> base64 length = ceil(128000 / 3) * 4 = 170668
    expect(b64.length).toBe(170668);
  });

  it("float32ToBase64Pcm16 in encoding.ts produces matching output", () => {
    const samples = new Float32Array([0.0, 0.5, -0.5, 1.0, -1.0]);
    const b64_a = float32ToBase64Pcm(samples);
    const b64_b = float32ToBase64Pcm16(samples);
    expect(b64_a).toBe(b64_b);
  });
});

describe("RMS Level & Significant Audio Detection", () => {
  it("evaluates silence as near-zero RMS level", () => {
    const silence = new Float32Array(16000); // 1s silence
    const rms = computeRmsLevel(silence);
    expect(rms).toBe(0);
    expect(hasSignificantAudio(silence, 0.005)).toBe(false);
  });

  it("evaluates active speech / sine tone as significant audio", () => {
    const tone = new Float32Array(16000);
    for (let i = 0; i < 16000; i++) {
      tone[i] = 0.3 * Math.sin((2 * Math.PI * 440 * i) / 16000);
    }
    const rms = computeRmsLevel(tone);
    expect(rms).toBeGreaterThan(0.1);
    expect(hasSignificantAudio(tone, 0.005)).toBe(true);
  });
});

describe("Continuous Ordered 4.0s Window / 1.0s Hop Rolling Buffer", () => {
  it("proves exact mathematical windowing: 64,000 samples window with 16,000 samples hop", () => {
    const buffer = new RollingAudioBuffer(64000, 16000);

    // Initial state: empty
    expect(buffer.hasWindow()).toBe(false);
    expect(buffer.nextWindow()).toBeNull();

    // 1. Write first 3.0 seconds (48,000 samples) -> not enough for a 4.0s window
    const chunk3s = new Float32Array(48000);
    for (let i = 0; i < 48000; i++) {
      chunk3s[i] = i; // Value represents sample index
    }
    buffer.write(chunk3s);
    expect(buffer.hasWindow()).toBe(false);
    expect(buffer.nextWindow()).toBeNull();

    // 2. Write 1.0 second (16,000 samples) -> now total is 64,000 samples (4.0s)
    const chunk1s_a = new Float32Array(16000);
    for (let i = 0; i < 16000; i++) {
      chunk1s_a[i] = 48000 + i;
    }
    buffer.write(chunk1s_a);
    expect(buffer.hasWindow()).toBe(true);

    // 3. Extract Window 1: must be exactly samples 0 -> 63,999
    const window1 = buffer.nextWindow();
    expect(window1).not.toBeNull();
    expect(window1!.length).toBe(64000);
    expect(window1![0]).toBe(0);
    expect(window1![63999]).toBe(63999);

    // After extracting Window 1, buffer shifted by 1.0s (16,000 samples).
    // Buffer now retains 48,000 samples (indices 16,000 -> 63,999).
    expect(buffer.hasWindow()).toBe(false);

    // 4. Write next 1.0 second (16,000 samples, indices 64,000 -> 79,999)
    const chunk1s_b = new Float32Array(16000);
    for (let i = 0; i < 16000; i++) {
      chunk1s_b[i] = 64000 + i;
    }
    buffer.write(chunk1s_b);
    expect(buffer.hasWindow()).toBe(true);

    // 5. Extract Window 2: must be exactly samples 16,000 -> 79,999
    const window2 = buffer.nextWindow();
    expect(window2).not.toBeNull();
    expect(window2!.length).toBe(64000);
    expect(window2![0]).toBe(16000);
    expect(window2![63999]).toBe(79999);

    // 6. Write another 1.0 second (16,000 samples, indices 80,000 -> 95,999)
    const chunk1s_c = new Float32Array(16000);
    for (let i = 0; i < 16000; i++) {
      chunk1s_c[i] = 80000 + i;
    }
    buffer.write(chunk1s_c);
    expect(buffer.hasWindow()).toBe(true);

    // 7. Extract Window 3: must be exactly samples 32,000 -> 95,999
    const window3 = buffer.nextWindow();
    expect(window3).not.toBeNull();
    expect(window3!.length).toBe(64000);
    expect(window3![0]).toBe(32000);
    expect(window3![63999]).toBe(95999);

    // Check statistics
    const stats = buffer.getStats();
    expect(stats.windowsEmitted).toBe(3);
    expect(stats.totalSamplesWritten).toBe(96000);
    expect(stats.samplesBuffered).toBe(48000);
  });

  it("clears all buffers completely on clear()", () => {
    const buffer = new RollingAudioBuffer(64000, 16000);
    buffer.write(new Float32Array(64000));
    expect(buffer.hasWindow()).toBe(true);

    buffer.clear();
    expect(buffer.hasWindow()).toBe(false);
    expect(buffer.nextWindow()).toBeNull();
    expect(buffer.getStats().samplesBuffered).toBe(0);
    expect(buffer.getStats().windowsEmitted).toBe(0);
  });

  it("guarantees sample ordering with small chunks (e.g. 4096 worklet chunks)", () => {
    const buffer = new RollingAudioBuffer(64000, 16000);
    const CHUNK_SIZE = 4096;
    let sampleCounter = 0;

    // Stream 20 worklet chunks (20 * 4096 = 81,920 samples)
    for (let c = 0; c < 20; c++) {
      const chunk = new Float32Array(CHUNK_SIZE);
      for (let i = 0; i < CHUNK_SIZE; i++) {
        chunk[i] = sampleCounter++;
      }
      buffer.write(chunk);
    }

    // Should have accumulated enough for at least 1 window (64,000 <= 81,920)
    expect(buffer.hasWindow()).toBe(true);
    const win1 = buffer.nextWindow()!;
    expect(win1.length).toBe(64000);
    expect(win1[0]).toBe(0);
    expect(win1[63999]).toBe(63999);

    // After 1 hop (16,000), remaining samples = 81,920 - 16,000 = 65,920 >= 64,000 -> 2nd window ready immediately!
    expect(buffer.hasWindow()).toBe(true);
    const win2 = buffer.nextWindow()!;
    expect(win2.length).toBe(64000);
    expect(win2[0]).toBe(16000);
    expect(win2[63999]).toBe(79999);
  });
});
