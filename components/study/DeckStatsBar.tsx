import type { DeckStats } from "@/lib/study/studyQueue";
import { RoughProgressBar } from "../sketch/RoughProgressBar";

/** Due and new counts, plus how much of the deck has been seen. */
export function DeckStatsBar({ stats, seed }: { stats: DeckStats; seed: string }) {
  return (
    <div className="deck-stats">
      <p className="deck-stats__counts">
        <strong>{stats.due}</strong> due · <strong>{stats.new}</strong> new · {stats.mature} well known
      </p>
      <RoughProgressBar
        ratio={stats.total === 0 ? 0 : stats.seen / stats.total}
        colour="var(--accent)"
        seed={seed}
        label={`${stats.seen} of ${stats.total} cards seen`}
      />
      <p className="deck-stats__seen">
        {stats.seen} / {stats.total} cards seen
      </p>
    </div>
  );
}
