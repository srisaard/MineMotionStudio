export type SoundType = 'footstep' | 'sword_slash' | 'hit' | 'creeper_hiss' | 'explosion' | 'ding';

export class SoundFX {
  private static ctx: AudioContext | null = null;

  private static getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public static play(type: SoundType, volume = 0.8) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      switch (type) {
        case 'sword_slash': {
          // White noise whoosh + high metallic tone
          const bufferSize = ctx.sampleRate * 0.25;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
          }

          const noise = ctx.createBufferSource();
          noise.buffer = buffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(3200, now);
          filter.frequency.exponentialRampToValueAtTime(800, now + 0.22);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(volume * 0.9, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          noise.start(now);
          break;
        }

        case 'creeper_hiss': {
          // White noise sustained hiss
          const bufferSize = ctx.sampleRate * 1.4;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }

          const noise = ctx.createBufferSource();
          noise.buffer = buffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(2600, now);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.01, now);
          gain.gain.linearRampToValueAtTime(volume * 0.7, now + 0.2);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 1.35);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          noise.start(now);
          break;
        }

        case 'explosion': {
          // Deep noise rumble + blast
          const bufferSize = ctx.sampleRate * 0.8;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.3));
          }

          const noise = ctx.createBufferSource();
          noise.buffer = buffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, now);
          filter.frequency.exponentialRampToValueAtTime(80, now + 0.7);

          // Sub bass punch oscillator
          const osc = ctx.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(volume * 1.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.75);

          noise.connect(filter);
          filter.connect(gain);
          osc.connect(gain);
          gain.connect(ctx.destination);

          noise.start(now);
          osc.start(now);
          osc.stop(now + 0.75);
          break;
        }

        case 'hit': {
          // Classic hurt pitch transient
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(240, now);
          osc.frequency.exponentialRampToValueAtTime(90, now + 0.18);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(volume * 0.9, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.18);
          break;
        }

        case 'footstep': {
          // Subtle grass/stone step tap
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(110, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(volume * 0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        case 'ding': {
          // Experience orb chime
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now); // A5
          osc.frequency.exponentialRampToValueAtTime(1320, now + 0.15); // E6

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(volume * 0.7, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.35);
          break;
        }
      }
    } catch (e) {
      console.warn('Web Audio playback error:', e);
    }
  }

  // Generate an AudioBuffer containing all sound cues for video export
  public static generateRenderAudioBuffer(
    duration: number,
    soundTimeline: { time: number; type: SoundType }[]
  ): AudioBuffer {
    const sampleRate = 44100;
    const totalSamples = Math.ceil(duration * sampleRate);
    const audioCtx = new (window.OfflineAudioContext || window.AudioContext)(1, Math.max(1024, totalSamples), sampleRate);
    const buffer = audioCtx.createBuffer(1, Math.max(1024, totalSamples), sampleRate);
    const data = buffer.getChannelData(0);

    for (const cue of soundTimeline) {
      const startSample = Math.floor(cue.time * sampleRate);
      if (startSample >= totalSamples) continue;

      if (cue.type === 'sword_slash') {
        const len = Math.min(totalSamples - startSample, Math.floor(sampleRate * 0.22));
        for (let i = 0; i < len; i++) {
          const decay = Math.exp(-i / (sampleRate * 0.06));
          data[startSample + i] += (Math.random() * 2 - 1) * decay * 0.4;
        }
      } else if (cue.type === 'creeper_hiss') {
        const len = Math.min(totalSamples - startSample, Math.floor(sampleRate * 1.2));
        for (let i = 0; i < len; i++) {
          const env = Math.min(1, i / (sampleRate * 0.2)) * Math.exp(-(len - i) / (sampleRate * 0.3));
          data[startSample + i] += (Math.random() * 2 - 1) * env * 0.3;
        }
      } else if (cue.type === 'explosion') {
        const len = Math.min(totalSamples - startSample, Math.floor(sampleRate * 0.7));
        for (let i = 0; i < len; i++) {
          const decay = Math.exp(-i / (sampleRate * 0.2));
          const bass = Math.sin((i / sampleRate) * 80 * 2 * Math.PI) * decay;
          data[startSample + i] += ((Math.random() * 2 - 1) * 0.6 + bass * 0.4) * decay * 0.6;
        }
      } else if (cue.type === 'hit') {
        const len = Math.min(totalSamples - startSample, Math.floor(sampleRate * 0.15));
        for (let i = 0; i < len; i++) {
          const t = i / sampleRate;
          const freq = 220 - t * 800;
          data[startSample + i] += Math.sin(t * freq * 2 * Math.PI) * (1 - i / len) * 0.35;
        }
      } else if (cue.type === 'ding') {
        const len = Math.min(totalSamples - startSample, Math.floor(sampleRate * 0.3));
        for (let i = 0; i < len; i++) {
          const t = i / sampleRate;
          data[startSample + i] += Math.sin(t * 1100 * 2 * Math.PI) * (1 - i / len) * 0.3;
        }
      }
    }

    return buffer;
  }
}
