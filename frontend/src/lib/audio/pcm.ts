/**
 * VoiceShield — Deterministic Audio Processing & PCM Normalization
 *
 * Provides pure, zero-mock audio math:
 * - Stereo/multi-channel to mono downmix
 * - Deterministic linear resampling to 16,000 Hz
 * - Float32 ([-1.0, 1.0]) to Signed 16-bit PCM (PCM_S16LE) conversion with boundary clamping
 * - Efficient binary-to-base64 serialization without stack overflow
 * - 4.0-second rolling analysis buffer with 1.0-second sliding hop
 */

import {
  AUDIO_SAMPLE_RATE,
  WINDOW_SAMPLES,
  HOP_SAMPLES,
} from "./constants";

/**
 * Downmix multi-channel audio to mono by computing the channel-wise arithmetic mean.
 * If single-channel, returns the channel directly.
 * If empty, returns an empty Float32Array.
 */
export function downmixToMono(channels: Float32Array[]): Float32Array {
  if (!channels || channels.length === 0) {
    return new Float32Array(0);
  }
  if (channels.length === 1) {
    return channels[0];
  }

  const length = channels[0].length;
  const mono = new Float32Array(length);
  const numChannels = channels.length;

  for (let i = 0; i < length; i++) {
    let sum = 0;
    for (let c = 0; c < numChannels; c++) {
      sum += channels[c][i] || 0;
    }
    mono[i] = sum / numChannels;
  }

  return mono;
}

/**
 * Resample a 1D audio Float32Array from `fromRate` to `targetRate` (default: 16000 Hz)
 * using linear interpolation.
 * If `fromRate === targetRate`, returns the input array.
 */
export function resampleTo16k(
  input: Float32Array,
  fromRate: number,
  targetRate: number = AUDIO_SAMPLE_RATE
): Float32Array {
  if (!input || input.length === 0) {
    return new Float32Array(0);
  }
  if (fromRate === targetRate || fromRate <= 0) {
    return input;
  }

  const ratio = fromRate / targetRate;
  const newLength = Math.round(input.length / ratio);
  const output = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
    const originalPos = i * ratio;
    const indexLow = Math.floor(originalPos);
    const indexHigh = Math.min(indexLow + 1, input.length - 1);
    const fraction = originalPos - indexLow;

    // Linear interpolation
    const val = input[indexLow] * (1 - fraction) + input[indexHigh] * fraction;
    output[i] = Math.max(-1.0, Math.min(1.0, val));
  }

  return output;
}

/**
 * Convert normalized Float32 audio samples ([-1.0, 1.0]) to signed 16-bit PCM (PCM_S16LE).
 * Values outside [-1.0, 1.0] are safely clamped to avoid integer overflow / distortion.
 */
export function float32ToInt16Pcm(samples: Float32Array): Int16Array {
  if (!samples || samples.length === 0) {
    return new Int16Array(0);
  }

  const int16 = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1.0, Math.min(1.0, samples[i]));
    int16[i] = s < 0 ? Math.round(s * 32768) : Math.round(s * 32767);
  }

  return int16;
}

/**
 * Convert an Int16Array PCM buffer to a base64 string.
 * Processes in chunks of 8192 bytes to avoid call stack limits in JavaScript engines.
 */
export function int16PcmToBase64(int16: Int16Array): string {
  if (!int16 || int16.length === 0) {
    return "";
  }

  const bytes = new Uint8Array(int16.buffer, int16.byteOffset, int16.byteLength);
  let binary = "";
  const chunkSize = 8192;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
  }

  return btoa(binary);
}

/**
 * Convenience method to convert a Float32Array directly to base64 PCM_S16LE string.
 */
export function float32ToBase64Pcm(samples: Float32Array): string {
  const int16 = float32ToInt16Pcm(samples);
  return int16PcmToBase64(int16);
}

/**
 * RollingAudioBuffer — Manages the VoiceShield 4.0s window / 1.0s sliding hop architecture.
 *
 * Behavior:
 * - Appends incoming normalized 16kHz float32 samples.
 * - Initial analysis window requires full 4.0 seconds (64,000 samples @ 16kHz).
 * - Subsequent analysis windows are emitted every 1.0 second (16,000 samples hop),
 *   retaining the most recent 3.0 seconds from the previous window + 1.0 second of new audio:
 *     Window 1: [0.0s -> 4.0s]
 *     Window 2: [1.0s -> 5.0s]
 *     Window 3: [2.0s -> 6.0s]
 * - Memory is strictly bounded to prevent unbounded array growth.
 */
export class RollingAudioBuffer {
  private buffer: Float32Array;
  private writePos: number = 0;
  private totalSamplesWritten: number = 0;
  private windowsEmitted: number = 0;
  private hasInitialWindow: boolean = false;

  private readonly windowSize: number;
  private readonly hopSize: number;

  constructor(windowSize: number = WINDOW_SAMPLES, hopSize: number = HOP_SAMPLES) {
    this.windowSize = windowSize;
    this.hopSize = hopSize;
    // Buffer holds up to (windowSize + hopSize * 2) to accommodate incoming chunks smoothly
    this.buffer = new Float32Array(windowSize + hopSize * 4);
  }

  /**
   * Append new normalized 16kHz samples to the rolling buffer.
   */
  public write(samples: Float32Array): void {
    if (!samples || samples.length === 0) return;

    // Check if buffer needs expansion or shifting
    if (this.writePos + samples.length > this.buffer.length) {
      // Allocate larger temporary buffer or shift if we have accumulated excess
      const newCapacity = Math.max(this.buffer.length * 2, this.writePos + samples.length);
      const newBuf = new Float32Array(newCapacity);
      newBuf.set(this.buffer.subarray(0, this.writePos));
      this.buffer = newBuf;
    }

    this.buffer.set(samples, this.writePos);
    this.writePos += samples.length;
    this.totalSamplesWritten += samples.length;
  }

  /**
   * Returns true if enough audio has accumulated for an analysis window.
   * - First window requires `windowSize` (64,000 samples).
   * - Subsequent windows require at least `windowSize` after each `hopSize` advance.
   */
  public hasWindow(): boolean {
    return this.writePos >= this.windowSize;
  }

  /**
   * Extract the next 4.0s analysis window and advance the buffer by 1.0s hop.
   * Returns null if not enough samples are available.
   */
  public nextWindow(): Float32Array | null {
    if (!this.hasWindow()) {
      return null;
    }

    // Extract exactly 4.0 seconds (windowSize)
    const window = new Float32Array(this.windowSize);
    window.set(this.buffer.subarray(0, this.windowSize));

    // Shift the buffer left by hopSize (16,000 samples = 1.0s)
    const remaining = this.writePos - this.hopSize;
    if (remaining > 0) {
      this.buffer.copyWithin(0, this.hopSize, this.writePos);
      this.writePos = remaining;
    } else {
      this.writePos = 0;
    }

    this.windowsEmitted++;
    this.hasInitialWindow = true;

    // Compact buffer if capacity grew too large
    if (this.buffer.length > this.windowSize + this.hopSize * 8) {
      const compacted = new Float32Array(this.windowSize + this.hopSize * 4);
      compacted.set(this.buffer.subarray(0, this.writePos));
      this.buffer = compacted;
    }

    return window;
  }

  /**
   * Reset the buffer to initial state, clearing all audio samples.
   */
  public clear(): void {
    this.writePos = 0;
    this.totalSamplesWritten = 0;
    this.windowsEmitted = 0;
    this.hasInitialWindow = false;
    this.buffer = new Float32Array(this.windowSize + this.hopSize * 4);
  }

  /**
   * Get buffer diagnostic statistics.
   */
  public getStats() {
    return {
      samplesBuffered: this.writePos,
      totalSamplesWritten: this.totalSamplesWritten,
      windowsEmitted: this.windowsEmitted,
      hasInitialWindow: this.hasInitialWindow,
      secondsBuffered: Number((this.writePos / AUDIO_SAMPLE_RATE).toFixed(2)),
    };
  }
}
