/**
 * VoiceShield audio encoding utilities.
 *
 * The backend analyze endpoint accepts `audio_base64`:
 *   base64( PCM 16-bit signed little-endian samples )
 *
 * Input sources supported:
 *   1. Float32Array  — from AudioWorklet (microphone capture pipeline)
 *   2. ArrayBuffer   — raw binary audio from any source
 *   3. Blob          — browser File / recorded audio blobs
 *
 * All paths produce a base64 string safe to embed in JSON.
 */

export * from "./constants";
export * from "./pcm";
import { float32ToBase64Pcm } from "./pcm";

// ---------------------------------------------------------------------------
// Blob / ArrayBuffer transport (Prompt 9 audio transport abstraction)
// ---------------------------------------------------------------------------

/**
 * Convert a browser Blob (e.g. MediaRecorder output, File) to a base64 string.
 * Uses FileReader internally — non-blocking, no memory duplication.
 *
 * @throws Error if the browser FileReader fails.
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("FileReader did not return a data URL string"));
        return;
      }
      // result is "data:<mime>;base64,<payload>" — strip the prefix
      const base64 = result.split(",")[1];
      if (!base64) {
        reject(new Error("FileReader returned an unexpected data URL format"));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error ?? new Error("FileReader error"));
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert an ArrayBuffer of raw audio bytes to base64.
 * Use this when audio bytes are already in memory as a buffer
 * (e.g. from fetch(), Web Audio API processing, or WebSocket binary frames).
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/**
 * Convert a Float32Array (normalized [-1,1] PCM) to Int16 PCM bytes,
 * then base64-encode the result for the backend API.
 */
export function float32ToBase64Pcm16(samples: Float32Array): string {
  return float32ToBase64Pcm(samples);
}

/**
 * Compute RMS level of a float32 audio window (0.0 → 1.0).
 */
export function computeRmsLevel(samples: Float32Array): number {
  let sumSq = 0;
  for (let i = 0; i < samples.length; i++) {
    sumSq += samples[i] * samples[i];
  }
  return Math.sqrt(sumSq / samples.length);
}

/**
 * Returns true if the audio window contains significant speech energy.
 * Threshold tuned for a typical 16kHz microphone in a quiet room.
 */
export function hasSignificantAudio(
  samples: Float32Array,
  rmsThreshold = 0.005
): boolean {
  return computeRmsLevel(samples) > rmsThreshold;
}
