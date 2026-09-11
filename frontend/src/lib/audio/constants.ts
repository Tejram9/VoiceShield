/**
 * VoiceShield — Central Audio Architecture Constants
 *
 * Single source of truth for audio capture, windowing, and transport.
 * Do NOT scatter magic numbers across components.
 */

/** Canonical audio sampling rate required by all AI models (16 kHz) */
export const AUDIO_SAMPLE_RATE = 16000;

/** Single channel (mono) requirement */
export const AUDIO_CHANNELS = 1;

/** Duration of the sliding analysis window in seconds (4.0s) */
export const ANALYSIS_WINDOW_SECONDS = 4;

/** Stride / hop between analysis updates in seconds (1.0s) */
export const ANALYSIS_HOP_SECONDS = 1;

/** Number of samples in a full 4.0-second analysis window (64,000 samples @ 16kHz) */
export const WINDOW_SAMPLES = AUDIO_SAMPLE_RATE * ANALYSIS_WINDOW_SECONDS; // 64000

/** Number of samples to advance per hop (16,000 samples @ 16kHz) */
export const HOP_SAMPLES = AUDIO_SAMPLE_RATE * ANALYSIS_HOP_SECONDS; // 16000

/** Worklet buffer size for audio chunk emission (~256ms @ 16kHz) */
export const WORKLET_BUFFER_SIZE = 4096;

/** Maximum client-side queue depth before backpressure drops stale windows */
export const MAX_QUEUE_DEPTH = 3;

/** Maximum allowable audio payload size in bytes (500 KB ~ 15.6s @ 16kHz PCM16) */
export const MAX_AUDIO_PAYLOAD_BYTES = 500000;

/** Audio encoding format string conforming to backend contract */
export const CANONICAL_AUDIO_FORMAT = "pcm_s16le" as const;
