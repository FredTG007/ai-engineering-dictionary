export type UiSound = "hover" | "select" | "open";

interface Tone {
  frequency: number;
  durationSeconds: number;
  volume: number;
  type: OscillatorType;
}

const TONES: Record<UiSound, Tone[]> = {
  hover: [{ frequency: 880, durationSeconds: 0.04, volume: 0.025, type: "sine" }],
  select: [
    { frequency: 523.25, durationSeconds: 0.09, volume: 0.05, type: "triangle" },
    { frequency: 783.99, durationSeconds: 0.14, volume: 0.04, type: "triangle" },
  ],
  open: [{ frequency: 659.25, durationSeconds: 0.08, volume: 0.035, type: "sine" }],
};

let context: AudioContext | null = null;

function audioContext(): AudioContext {
  context ??= new AudioContext();
  return context;
}

/** Plays a short synthesized blip; tones in a sound play one after another. */
export function playUiSound(sound: UiSound): void {
  const ctx = audioContext();
  let startAt = ctx.currentTime;
  for (const tone of TONES[sound]) {
    scheduleTone(ctx, tone, startAt);
    startAt += tone.durationSeconds * 0.7;
  }
}

function scheduleTone(ctx: AudioContext, tone: Tone, startAt: number): void {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = tone.type;
  oscillator.frequency.setValueAtTime(tone.frequency, startAt);
  gain.gain.setValueAtTime(tone.volume, startAt);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + tone.durationSeconds);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + tone.durationSeconds);
}
