import type { StudyCard } from "./cards";
import { type CardSchedule, MINUTE_MS } from "./sm2";

/** Failed cards due within this window are shown again before the sitting ends. */
const LEARN_AHEAD_MS = 10 * MINUTE_MS;
/** Interval after which a card counts as well known. */
const MATURE_INTERVAL_DAYS = 21;

export type Schedules = Readonly<Record<string, CardSchedule>>;

export interface DeckStats {
  total: number;
  due: number;
  new: number;
  seen: number;
  mature: number;
}

/**
 * Pure: cards to show now, in order — due reviews (oldest first), then new
 * cards in curriculum order, then cards failed moments ago. A failed card
 * jumps back to the front as soon as its short delay has passed.
 */
export function studyQueue(cards: StudyCard[], schedules: Schedules, now: number): StudyCard[] {
  const dueBy = (cutoff: number) => (card: StudyCard) => Boolean(schedules[card.id]) && schedules[card.id].due <= cutoff;
  const byDue = (a: StudyCard, b: StudyCard) => schedules[a.id].due - schedules[b.id].due;
  const due = cards.filter(dueBy(now)).sort(byDue);
  const fresh = cards.filter((card) => !schedules[card.id]);
  const learningSoon = cards.filter((card) => !dueBy(now)(card) && dueBy(now + LEARN_AHEAD_MS)(card)).sort(byDue);
  return [...due, ...fresh, ...learningSoon];
}

/** Pure: counts for the header of the study view. */
export function deckStats(cards: StudyCard[], schedules: Schedules, now: number): DeckStats {
  const seen = cards.filter((card) => schedules[card.id]);
  return {
    total: cards.length,
    due: seen.filter((card) => schedules[card.id].due <= now).length,
    new: cards.length - seen.length,
    seen: seen.length,
    mature: seen.filter((card) => schedules[card.id].intervalDays >= MATURE_INTERVAL_DAYS).length,
  };
}

/** Pure: when the next seen card falls due, or null if nothing has been studied. */
export function nextDueAt(cards: StudyCard[], schedules: Schedules): number | null {
  const dues = cards.flatMap((card) => (schedules[card.id] ? [schedules[card.id].due] : []));
  return dues.length > 0 ? Math.min(...dues) : null;
}

/** Pure: reads stored schedules, dropping cards that no longer exist or look corrupt. */
export function parseSchedules(stored: string | null, isKnownCard: (id: string) => boolean): Record<string, CardSchedule> {
  if (!stored) return {};
  try {
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== "object" || parsed === null) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(([id, value]) => isKnownCard(id) && isSchedule(value)),
    ) as Record<string, CardSchedule>;
  } catch {
    return {};
  }
}

function isSchedule(value: unknown): value is CardSchedule {
  const candidate = value as Partial<CardSchedule> | null;
  return (
    typeof candidate === "object" &&
    candidate !== null &&
    [candidate.ease, candidate.intervalDays, candidate.repetitions, candidate.due].every((field) => typeof field === "number")
  );
}
