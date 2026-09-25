// ==========================================
// 7, 26 & MULTI-TRACK MUSIC & SOUND SYSTEM
// Supports different songs for Main, Kado, & Surat
// Seamless zero-delay auto-switching & fallbacks
// ==========================================
import { CONFIG } from '../config';
import { AudioTrackType } from '../types';

class SoundSystem {
  private activeTrack: AudioTrackType = 'default';
  private audioElements: Record<AudioTrackType, HTMLAudioElement | null> = {
    default: null,
    kado: null,
    surat: null,
  };
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private isUserPaused: boolean = false;
  private isSynthesizing: boolean = false;
  private synthInterval: number | null = null;
  private activeSynthTrack: AudioTrackType | null = null;
  private autoplayFailed: boolean = false;
  private listeners: Array<() => void> = [];

  constructor() {
    // will be initialized on client mount
  }

  public getTrackUrl(track: AudioTrackType): string {
    if (typeof window !== 'undefined') {
      const localCustom = localStorage.getItem(`birthday_music_${track}`);
      if (localCustom && localCustom.trim()) return localCustom.trim();
    }

    if (track === 'kado') {
      return (CONFIG.music || '').trim();
    }
    if (track === 'surat') {
      return (CONFIG.suratMusic || '').trim();
    }
    return (CONFIG.music || '').trim();
  }

  public setCustomTrackUrl(track: AudioTrackType, url: string) {
    if (typeof window !== 'undefined') {
      if (url.trim()) {
        localStorage.setItem(`birthday_music_${track}`, url.trim());
      } else {
        localStorage.removeItem(`birthday_music_${track}`);
      }
    }
    const el = this.audioElements[track];
    if (el) {
      el.src = url.trim();
      el.load();
    }
    if (this.activeTrack === track && this.isPlaying) {
      this.switchTrack(track, true);
    }
  }

  public init() {
    if (typeof window === 'undefined') return;

    const tracks: AudioTrackType[] = ['default', 'kado', 'surat'];

    tracks.forEach((track) => {
      const elId = track === 'default' ? 'bgMusic' : `bgMusic_${track}`;
      let el = document.getElementById(elId) as HTMLAudioElement | null;

      const trackSrc = this.getTrackUrl(track);

      if (!el) {
        el = document.createElement('audio');
        el.id = elId;
        el.loop = true;
        el.preload = 'auto';
        if (trackSrc) {
          el.src = trackSrc;
        }
        document.body.appendChild(el);
      } else if (trackSrc && (!el.src || el.src === window.location.href)) {
        el.src = trackSrc;
      }

      el.loop = true;
      el.preload = 'auto';

      el.addEventListener('play', () => {
        if (this.activeTrack === track) {
          this.isPlaying = true;
          this.autoplayFailed = false;
          this.notify();
        }
      });

      el.addEventListener('playing', () => {
        if (this.activeTrack === track) {
          this.isPlaying = true;
          this.autoplayFailed = false;
          this.notify();
        }
      });

      el.addEventListener('pause', () => {
        if (this.activeTrack === track && !this.isSynthesizing && this.isUserPaused) {
          this.isPlaying = false;
          this.notify();
        }
      });

      el.addEventListener('error', () => {
        if (this.activeTrack === track && this.isPlaying) {
          // If remote fails, fallback to synthesizer for this track
          this.startTrackSynth(track);
        }
      });

      this.audioElements[track] = el;
    });

    const activeEl = this.audioElements[this.activeTrack];
    if (activeEl && !activeEl.paused) {
      this.isPlaying = true;
    }

    // Try immediate zero-delay play for default track
    this.tryPlay();

    // Instant interaction triggers for mobile / strict autoplay browsers
    const triggerEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown', 'scroll'];
    const onFirstUserInteraction = () => {
      if (!this.isPlaying) {
        this.play();
      }
      triggerEvents.forEach((evt) => {
        window.removeEventListener(evt, onFirstUserInteraction, { capture: true });
      });
    };

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isPlaying && !this.isUserPaused) {
        this.resumeAfterInterruption();
      }
    });

    triggerEvents.forEach((evt) => {
      window.addEventListener(evt, onFirstUserInteraction, { capture: true, passive: true, once: true });
    });
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      autoplayFailed: this.autoplayFailed,
      activeTrack: this.activeTrack,
      trackTitle: this.getTrackTitle(this.activeTrack),
    };
  }

  public getTrackTitle(track: AudioTrackType): string {
    switch (track) {
      case 'kado':
        return 'Lagu Spesial Kado 🎁';
      case 'surat':
        return 'Lagu Surat Cinta 💌';
      default:
        return 'Musik Utama 🎵';
    }
  }

  public getActiveTrack(): AudioTrackType {
    return this.activeTrack;
  }

  /**
   * Switch between tracks (default, kado, surat)
   * Automatically plays the new track without delay and stops the previous track.
   */
  public switchTrack(track: AudioTrackType, forceRestart = false) {
    if (this.activeTrack === track && !forceRestart) return;

    const previousTrack = this.activeTrack;
    this.activeTrack = track;
    this.isUserPaused = false;

    // 1. Pause and reset the previous audio track
    const prevEl = this.audioElements[previousTrack];
    if (prevEl) {
      try {
        prevEl.pause();
        prevEl.currentTime = 0;
      } catch {
        // ignore
      }
    }
    this.stopRomanticSynth();

    // 2. Play new track automatically
    this.isPlaying = true;
    this.autoplayFailed = false;

    const nextEl = this.audioElements[track];
    const nextSrc = this.getTrackUrl(track);

    if (nextEl && nextSrc && nextSrc.trim() !== '') {
      try {
        if (!nextEl.src || !nextEl.src.includes(nextSrc)) {
          nextEl.src = nextSrc;
        }
        nextEl.muted = this.isMuted;
        nextEl.currentTime = 0;
        const playPromise = nextEl.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isPlaying = true;
              this.autoplayFailed = false;
              this.stopRomanticSynth();
              this.notify();
            })
            .catch(() => {
              // Browser blocked or media load error -> start high-quality melodic synth for this track
              this.startTrackSynth(track);
              this.notify();
            });
        }
      } catch {
        this.startTrackSynth(track);
      }
    } else {
      // If no custom URL provided for this track (e.g. kado or surat),
      // play the beautiful, customized romantic music-box melody for that section!
      this.startTrackSynth(track);
    }

    this.notify();
  }

  public async tryPlay() {
    try {
      const activeEl = this.audioElements[this.activeTrack];
      if (activeEl) {
        activeEl.muted = this.isMuted;
        const promise = activeEl.play();
        if (promise !== undefined) {
          await promise;
          this.isPlaying = true;
          this.autoplayFailed = false;
          this.notify();
          return;
        }
      }
    } catch {
      this.autoplayFailed = true;
      this.isPlaying = false;
      this.notify();
    }
  }

  public async play() {
    this.isUserPaused = false;
    this.autoplayFailed = false;
    this.isPlaying = true;
    this.initAudioContext();

    const activeEl = this.audioElements[this.activeTrack];
    const src = this.getTrackUrl(this.activeTrack);

    if (activeEl && src && src.trim() !== '' && !activeEl.error) {
      try {
        activeEl.muted = this.isMuted;
        await activeEl.play();
        this.notify();
        return;
      } catch {
        // fallback to synth
      }
    }

    this.startTrackSynth(this.activeTrack);
    this.notify();
  }

  /**
   * Resumes playback after an OS interrupt (e.g. microphone permission prompt)
   * Ensures the audio continues playing seamlessly!
   */
  public resumeAfterInterruption() {
    if (this.isUserPaused) return;
    this.isPlaying = true;
    this.autoplayFailed = false;
    this.initAudioContext();

    const activeEl = this.audioElements[this.activeTrack];
    const targetSrc = this.getTrackUrl(this.activeTrack);

    if (activeEl && targetSrc && targetSrc.trim() !== '') {
      activeEl.muted = this.isMuted;
      if (activeEl.paused) {
        const promise = activeEl.play();
        if (promise !== undefined) {
          promise
            .then(() => {
              this.isPlaying = true;
              this.stopRomanticSynth();
              this.notify();
            })
            .catch(() => {
              this.startTrackSynth(this.activeTrack);
              this.notify();
            });
        }
      } else {
        this.isPlaying = true;
        this.notify();
      }
    } else {
      this.startTrackSynth(this.activeTrack);
      this.notify();
    }
  }

  public pause() {
    this.isUserPaused = true;
    this.isPlaying = false;
    const activeEl = this.audioElements[this.activeTrack];
    if (activeEl) {
      activeEl.pause();
    }
    this.stopRomanticSynth();
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.isUserPaused = false;
      this.play();
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    Object.values(this.audioElements).forEach((el) => {
      if (el) el.muted = this.isMuted;
    });
    this.notify();
  }

  private initAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // ==========================================
  // DISTINCT SYNTHESIZER MELODIES PER TRACK
  // Used as zero-delay romantic music when no custom MP3 is set
  // or if network is unavailable
  // ==========================================
  private startTrackSynth(track: AudioTrackType) {
    if (this.isSynthesizing && this.activeSynthTrack === track && this.isPlaying) return;
    this.stopRomanticSynth();

    this.isSynthesizing = true;
    this.activeSynthTrack = track;
    this.initAudioContext();

    if (track === 'kado') {
      // CELEBRATORY & FESTIVE MUSIC-BOX WALTZ (F Major / D Minor)
      // Sparkling, warm birthday celebration feeling
      const kadoNotes = [
        349.23, 440.0, 523.25, 698.46, // F - A - C - F5
        392.00, 466.16, 587.33, 783.99, // G - Bb - D - G5
        349.23, 440.0, 523.25, 659.25, // F - A - C - E5
        293.66, 349.23, 440.00, 587.33, // D - F - A - D5
        349.23, 523.25, 698.46, 880.00, // F - C5 - F5 - A5
        440.00, 587.33, 698.46, 1046.50, // A - D5 - F5 - C6
      ];
      let kadoIdx = 0;
      this.synthInterval = window.setInterval(() => {
        if (!this.isPlaying || this.isMuted) return;
        const freq = kadoNotes[kadoIdx % kadoNotes.length];
        this.playRomanticChime(freq, 0.75, 0.08);
        kadoIdx++;
      }, 550);
    } else if (track === 'surat') {
      // DEEPLY EMOTIONAL ACOUSTIC LOVE BALLAD (G Major / E Minor)
      // Gentle, tender, romantic letter-reading atmosphere
      const suratNotes = [
        392.00, 493.88, 587.33, 783.99, // G - B - D - G5
        329.63, 392.00, 493.88, 659.25, // E - G - B - E5
        261.63, 329.63, 392.00, 523.25, // C - E - G - C5
        293.66, 369.99, 440.00, 587.33, // D - F# - A - D5
        392.00, 493.88, 587.33, 739.99, // G - B - D - F#5
        329.63, 440.00, 523.25, 659.25, // E - A - C5 - E5
        261.63, 392.00, 523.25, 783.99, // C - G - C5 - G5
        293.66, 440.00, 587.33, 880.00, // D - A - D5 - A5
      ];
      let suratIdx = 0;
      this.synthInterval = window.setInterval(() => {
        if (!this.isPlaying || this.isMuted) return;
        const freq = suratNotes[suratIdx % suratNotes.length];
        this.playRomanticChime(freq, 1.1, 0.075);
        suratIdx++;
      }, 800);
    } else {
      // MAIN BACKGROUND MUSIC-BOX ARPEGGIO (C Major / A Minor)
      const mainNotes = [
        261.63, 329.63, 392.00, 523.25, // C - E - G - C
        220.00, 261.63, 329.63, 440.00, // A - C - E - A
        174.61, 220.00, 261.63, 349.23, // F - A - C - F
        196.00, 246.94, 293.66, 392.00, // G - B - D - G
        261.63, 329.63, 392.00, 659.25, // C - E - G - E5
        220.00, 329.63, 440.00, 523.25, // A - E - A - C5
        174.61, 261.63, 349.23, 440.00, // F - C - F - A
        196.00, 293.66, 392.00, 493.88, // G - D - G - B
      ];
      let mainIdx = 0;
      this.synthInterval = window.setInterval(() => {
        if (!this.isPlaying || this.isMuted) return;
        const freq = mainNotes[mainIdx % mainNotes.length];
        this.playRomanticChime(freq, 0.9, 0.08);
        mainIdx++;
      }, 700);
    }
  }

  private stopRomanticSynth() {
    this.isSynthesizing = false;
    this.activeSynthTrack = null;
    if (this.synthInterval !== null) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  public playRomanticChime(freq = 523.25, duration = 0.8, gainVol = 0.1) {
    if (this.isMuted) return;
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, this.audioCtx.currentTime);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      const now = this.audioCtx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(gainVol, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // AudioContext unavailable
    }
  }

  // SFX for interactions
  public playCardFlip() {
    this.playRomanticChime(659.25, 0.25, 0.06);
  }

  public playCardMatch() {
    this.playRomanticChime(523.25, 0.3, 0.08);
    setTimeout(() => this.playRomanticChime(659.25, 0.3, 0.08), 120);
    setTimeout(() => this.playRomanticChime(783.99, 0.5, 0.1), 240);
  }

  public playCandleBlow() {
    if (this.isMuted) return;
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;

      const bufferSize = this.audioCtx.sampleRate * 0.4;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.2;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);
      filter.Q.setValueAtTime(1.5, this.audioCtx.currentTime);

      const gain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime;
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start(now);
      setTimeout(() => {
        this.playRomanticChime(784, 0.6, 0.09);
      }, 350);
    } catch {
      // ignore
    }
  }

  public playCelebration() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => {
      setTimeout(() => this.playRomanticChime(n, 0.6, 0.08), i * 140);
    });
  }
}

export const soundSystem = new SoundSystem();

if (typeof window !== 'undefined') {
  soundSystem.init();
}
