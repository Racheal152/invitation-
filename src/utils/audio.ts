/**
 * Background graduation soundtrack player using the uploaded local audio track.
 * Supports smooth fade-in / fade-out and seamless looping across the invitation.
 */

const TRACK_SRC = '/assets/aistudio/Kanye_West_-_Good_Morning__Instrumental__b72015dd.mp3';
const TARGET_VOLUME = 0.58;

class AmbientMusicPlayer {
  private audio: HTMLAudioElement | null = null;
  private fadeTimer: number | null = null;
  private isPlaying = false;

  private ensureAudio(): HTMLAudioElement {
    if (!this.audio) {
      const el = new Audio(TRACK_SRC);
      el.loop = true;
      el.preload = 'auto';
      el.volume = 0;
      this.audio = el;
    }
    return this.audio;
  }

  private clearFade() {
    if (this.fadeTimer !== null) {
      window.clearInterval(this.fadeTimer);
      this.fadeTimer = null;
    }
  }

  private fadeTo(target: number, durationMs: number, onComplete?: () => void) {
    this.clearFade();
    const audio = this.audio;
    if (!audio) return;

    const startVol = audio.volume;
    const diff = target - startVol;
    if (Math.abs(diff) < 0.005 || durationMs <= 0) {
      audio.volume = Math.max(0, Math.min(1, target));
      onComplete?.();
      return;
    }

    const stepMs = 25;
    const steps = Math.max(1, Math.round(durationMs / stepMs));
    let currentStep = 0;

    this.fadeTimer = window.setInterval(() => {
      currentStep += 1;
      const progress = Math.min(1, currentStep / steps);
      const nextVol = startVol + diff * progress;
      audio.volume = Math.max(0, Math.min(1, nextVol));

      if (progress >= 1) {
        this.clearFade();
        onComplete?.();
      }
    }, stepMs);
  }

  public start(): boolean {
    if (this.isPlaying) return true;
    try {
      const audio = this.ensureAudio();
      this.clearFade();
      audio.volume = Math.min(audio.volume, 0.05);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this.isPlaying = false;
        });
      }

      this.isPlaying = true;
      this.fadeTo(TARGET_VOLUME, 650);
      return true;
    } catch {
      this.isPlaying = false;
      return false;
    }
  }

  public stop() {
    this.isPlaying = false;
    if (!this.audio) return;

    const audio = this.audio;
    this.fadeTo(0, 280, () => {
      if (!this.isPlaying) {
        audio.pause();
      }
    });
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
