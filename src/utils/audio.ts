/**
 * Gentle procedural music-box / soft harp arpeggio synthesizer using Web Audio API.
 * Keeps background ambiance completely self-contained without fragile external MP3 URLs.
 */

class AmbientMusicPlayer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private isPlaying = false;
  private step = 0;

  // Delicate F major / D minor classical arpeggio progression (Hz)
  private readonly sequence: number[] = [
    349.23, 440.0, 523.25, 659.25, 523.25, 440.0, // Fmaj7
    293.66, 349.23, 440.0, 523.25, 440.0, 349.23, // Dm7
    233.08, 293.66, 349.23, 440.0, 349.23, 293.66, // Bbmaj7
    261.63, 329.63, 392.0, 523.25, 392.0, 329.63, // C
  ];

  private playNote(freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const overtone = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const overtoneGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, now);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    overtoneGain.gain.setValueAtTime(0.0001, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.025, now + 0.02);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

    osc.connect(noteGain);
    overtone.connect(overtoneGain);
    noteGain.connect(this.masterGain);
    overtoneGain.connect(this.masterGain);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + 2.3);
    overtone.stop(now + 1.2);
  }

  public start(): boolean {
    if (this.isPlaying) return true;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;

      if (!this.ctx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }

      if (this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }

      if (this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setTargetAtTime(0.28, this.ctx.currentTime, 0.35);
      }

      this.isPlaying = true;
      this.playNote(this.sequence[this.step % this.sequence.length]);
      this.step += 1;

      this.timerId = window.setInterval(() => {
        if (!this.isPlaying) return;
        this.playNote(this.sequence[this.step % this.sequence.length]);
        this.step += 1;
      }, 620);

      return true;
    } catch {
      return false;
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.15);
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    }
    return this.start();
  }
}

export const ambientMusic = new AmbientMusicPlayer();
