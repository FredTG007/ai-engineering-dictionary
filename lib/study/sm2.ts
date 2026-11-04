/**
 * SM-2 spaced repetition (the SuperMemo 2 algorithm), with the four
 * Anki-style buttons mapped onto SM-2 quality scores (again 1, hard 3,
 * good 4, easy 5). Pure functions only.
 */

export const GRADES = ["again", "hard", "good", "easy"] as const;
export type Grade = (typeof GRADES)[number];

/** Review state of one card. A card with no state is new. */
export interface CardSchedule {
  /** Ease factor; SM-2 starts at 2.5 and never goes below 1.3. */
  ease: number;
  intervalDays: number;
  /** Successful reviews in a row. */
  repetitions: number;
  /** Epoch milliseconds when the card is next due. */
  due: number;
}

export const MINUTE_MS = 60_000;
export const DAY_MS = 24 * 60 * MINUTE_MS;
const INITIAL_EASE = 2.5;
const MIN_EASE = 1.3;
/** A failed card comes back within the same sitting. */
const RELEARN_DELAY_MS = MINUTE_MS;
const QUALITY: Record<Grade, number> = { again: 1, hard: 3, good: 4, easy: 5 };
/** Anki-style shortcut: a new card answered "easy" skips the one-day step. */
const EASY_FIRST_INTERVAL_DAYS = 4;

/** Pure: the card's state after answering it with `grade` at time `now`. */
export function review(schedule: CardSchedule | undefined, grade: Grade, now: number): CardSchedule {
  const previous = schedule ?? { ease: INITIAL_EASE, intervalDays: 0, repetitions: 0, due: now };
  const quality = QUALITY[grade];
  const ease = nextEase(previous.ease, quality);
  if (quality < 3) {
    return { ease, intervalDays: 0, repetitions: 0, due: now + RELEARN_DELAY_MS };
  }
  const intervalDays = grade === "easy" && previous.repetitions === 0 ? EASY_FIRST_INTERVAL_DAYS : nextInterval(previous, ease);
  return { ease, intervalDays, repetitions: previous.repetitions + 1, due: now + intervalDays * DAY_MS };
}

function nextEase(ease: number, quality: number): number {
  const missing = 5 - quality;
  return Math.max(MIN_EASE, ease + 0.1 - missing * (0.08 + missing * 0.02));
}

function nextInterval(previous: CardSchedule, ease: number): number {
  if (previous.repetitions === 0) return 1;
  if (previous.repetitions === 1) return 6;
  return Math.round(previous.intervalDays * ease);
}

/** Pure: short human label for when a card would come back, e.g. "1 min", "6 d". */
export function describeDelay(ms: number): string {
  if (ms < DAY_MS) return `${Math.max(1, Math.round(ms / MINUTE_MS))} min`;
  const days = Math.round(ms / DAY_MS);
  return days < 60 ? `${days} d` : `${Math.round(days / 30)} mo`;
}
