/**
 * Ultra-lightweight Web Audio API synthesizer for tactile "Apple-style" sound feedback.
 * No external MP3 files needed; generates crisp, pleasant acoustic micro-ticks at zero latency.
 */

let audioCtx: AudioContext | null = null;
let isAudioMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Plays a subtle, tactile "glass tick" completely non-blocking.
 */
export function playTapSound(freq = 900, duration = 0.035, gainValue = 0.06): void {
  if (isAudioMuted) return;
  setTimeout(() => {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + duration);

      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Non-blocking fallback
    }
  }, 0);
}

/**
 * Plays a gentle, harmonic double-tone chime for success / ticket confirmation.
 */
export function playSuccessSound(): void {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [587.33, 880]; // D5, A5 pleasing chord

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.08, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  } catch {
    // Graceful fallback
  }
}

/**
 * Plays a rich, resonant 3-tone attention chime for calling customers on the TV screen.
 */
export function playCallingChime(): void {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Pleasant major triad chime (C5 - E5 - G5)
    const tones = [523.25, 659.25, 783.99];

    tones.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const startTime = now + idx * 0.18;
      const duration = 0.8;

      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch {
    // Graceful fallback
  }
}

export function toggleAudioMute(): boolean {
  isAudioMuted = !isAudioMuted;
  return isAudioMuted;
}

export function getAudioMutedStatus(): boolean {
  return isAudioMuted;
}
