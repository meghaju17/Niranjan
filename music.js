/* ==========================================================================
   Music — soft, dreamy, slow chords with gentle bell notes.
   Generated live with the Web Audio API, so there is no audio file to lose.
   Nothing plays until start() is called from a click (browser autoplay rules).
   If CONFIG.music.file is set, that file is looped instead.
   ========================================================================== */

(function () {
  'use strict';

  const CHORD_LEN = 8;               // seconds per chord
  const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

  // Cmaj7 → Am7 → Fmaj7 → G6 (warm, hopeful, a little wistful)
  const CHORDS = [
    [48, 55, 59, 64],
    [45, 55, 60, 64],
    [41, 57, 60, 64],
    [43, 59, 62, 64]
  ];

  class RomanticMusic {
    constructor(cfg) {
      cfg = cfg || {};
      this.file = cfg.file || '';
      this.volume = typeof cfg.volume === 'number' ? cfg.volume : 0.7;
      this.muted = false;
      this.started = false;
      this.ctx = null;
      this.audio = null;
      this.timer = null;
      this.nextTime = 0;
      this.chordIdx = 0;

      document.addEventListener('visibilitychange', () => {
        if (!this.started) return;
        if (document.hidden) {
          if (this.ctx) this.ctx.suspend();
          if (this.audio) this.audio.pause();
        } else if (!this.muted) {
          if (this.ctx) this.ctx.resume();
          if (this.audio) this.audio.play().catch(() => {});
        }
      });
    }

    /* ---------- public API ---------- */
    start() {
      if (this.started) { this._applyVolume(); return; }
      this.started = true;
      if (this.file) { this._startFile(); } else { this._startSynth(); }
    }

    toggle() {
      if (!this.started) this.start();
      this.muted = !this.muted;
      this._applyVolume();
      return this.muted;
    }

    /* ---------- own audio file ---------- */
    _startFile() {
      this.audio = new Audio(this.file);
      this.audio.loop = true;
      this.audio.volume = 0;
      this.audio.play().catch(() => {});
      this._applyVolume();
    }

    /* ---------- synthesized music ---------- */
    _startSynth() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = (this.ctx = new AC());

      this.master = ctx.createGain();
      this.master.gain.value = 0;

      this.filter = ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.value = 1900;
      this.filter.Q.value = 0.3;

      // gentle echo for a dreamy space
      const delay = ctx.createDelay(1.5);
      delay.delayTime.value = 0.46;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.36;
      const wet = ctx.createGain();
      wet.gain.value = 0.42;

      this.filter.connect(this.master);
      this.filter.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(wet);
      wet.connect(this.master);
      this.master.connect(ctx.destination);

      ctx.resume();
      this.nextTime = ctx.currentTime + 0.15;
      this._schedule();
      this.timer = setInterval(() => this._schedule(), 500);
      this._applyVolume(3);
    }

    _schedule() {
      const ctx = this.ctx;
      while (this.nextTime < ctx.currentTime + 2) {
        this._chord(this.nextTime, CHORDS[this.chordIdx % CHORDS.length]);
        this.nextTime += CHORD_LEN;
        this.chordIdx++;
      }
    }

    _chord(t, notes) {
      // soft pad
      notes.forEach((n) => this._pad(t, midi(n), CHORD_LEN + 2));
      // sparse bell-like melody from the chord tones, two octaves up
      for (let k = 0; k < 6; k++) {
        if (Math.random() < 0.68) {
          const n = notes[Math.floor(Math.random() * notes.length)] + 24;
          this._bell(t + 0.9 + k * 1.15 + Math.random() * 0.25, midi(n));
        }
      }
    }

    _pad(t, freq, dur) {
      const ctx = this.ctx;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.042, t + 2.6);
      g.gain.linearRampToValueAtTime(0.0001, t + dur);
      g.connect(this.filter);

      [['sine', 1], ['triangle', 1.003]].forEach(([type, mult]) => {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.value = freq * mult;
        o.connect(g);
        o.start(t);
        o.stop(t + dur + 0.1);
      });
    }

    _bell(t, freq) {
      const ctx = this.ctx;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.055, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3.6);
      g.connect(this.filter);

      const o1 = ctx.createOscillator();
      o1.type = 'sine';
      o1.frequency.value = freq;
      o1.connect(g);

      const g2 = ctx.createGain();
      g2.gain.value = 0.25;
      g2.connect(g);
      const o2 = ctx.createOscillator();
      o2.type = 'sine';
      o2.frequency.value = freq * 2.01;
      o2.connect(g2);

      o1.start(t); o2.start(t);
      o1.stop(t + 3.8); o2.stop(t + 3.8);
    }

    /* ---------- volume / mute with a gentle fade ---------- */
    _applyVolume(fadeSeconds) {
      const target = this.muted ? 0 : this.volume;
      const tc = (fadeSeconds || 0.5) / 3;
      if (this.master && this.ctx) {
        this.master.gain.cancelScheduledValues(this.ctx.currentTime);
        this.master.gain.setTargetAtTime(target * 0.9, this.ctx.currentTime, tc);
        if (!this.muted && this.ctx.state === 'suspended') this.ctx.resume();
      }
      if (this.audio) {
        const from = this.audio.volume, to = target, steps = 20;
        let i = 0;
        clearInterval(this._fade);
        this._fade = setInterval(() => {
          i++;
          this.audio.volume = Math.min(1, Math.max(0, from + (to - from) * (i / steps)));
          if (i >= steps) clearInterval(this._fade);
        }, 40);
        if (!this.muted && this.audio.paused) this.audio.play().catch(() => {});
      }
    }
  }

  window.RomanticMusic = RomanticMusic;
})();
