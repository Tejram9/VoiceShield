/**
 * VoiceShield AudioWorklet Processor
 *
 * Runs in the AudioWorkletGlobalScope (audio rendering thread).
 * Receives raw audio from the microphone MediaStreamSource, downmixes to mono
 * if multi-channel, batches samples into fixed-size chunks, and posts them
 * to the main thread via zero-copy ArrayBuffer transfer.
 *
 * Main thread receives: { type: "audio-chunk", samples: Float32Array }
 */

class VoiceShieldProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    // Default buffer size: 4096 samples (~256ms at 16kHz)
    this._bufferSize =
      (options && options.processorOptions && options.processorOptions.bufferSize) || 4096;
    this._buffer = new Float32Array(this._bufferSize);
    this._bufferWriteIndex = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0 || !input[0]) {
      return true;
    }

    const numChannels = input.length;
    const channelLength = input[0].length;

    // Fast-path: Single channel (mono)
    if (numChannels === 1) {
      const channelData = input[0];
      for (let i = 0; i < channelLength; i++) {
        this._buffer[this._bufferWriteIndex++] = channelData[i];

        if (this._bufferWriteIndex >= this._bufferSize) {
          const chunk = this._buffer.slice(0);
          this.port.postMessage({ type: "audio-chunk", samples: chunk }, [chunk.buffer]);
          this._bufferWriteIndex = 0;
        }
      }
      return true;
    }

    // Multi-channel (e.g. stereo): Downmix to mono by channel-wise average
    for (let i = 0; i < channelLength; i++) {
      let sum = 0;
      for (let c = 0; c < numChannels; c++) {
        sum += input[c][i] || 0;
      }
      this._buffer[this._bufferWriteIndex++] = sum / numChannels;

      if (this._bufferWriteIndex >= this._bufferSize) {
        const chunk = this._buffer.slice(0);
        this.port.postMessage({ type: "audio-chunk", samples: chunk }, [chunk.buffer]);
        this._bufferWriteIndex = 0;
      }
    }

    return true;
  }
}

registerProcessor("voiceshield-processor", VoiceShieldProcessor);
