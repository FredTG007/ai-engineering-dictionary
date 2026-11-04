"use client";

import { useCallback, useMemo, useState } from "react";
import { useStudySchedules } from "@/hooks/useStudySchedules";
import type { PublishedTerm } from "@/lib/content/types";
import type { Track } from "@/lib/map/types";
import { buildStudyCards, filterCards, type DeckFilter } from "@/lib/study/cards";
import type { Grade } from "@/lib/study/sm2";
import { deckStats, nextDueAt, studyQueue } from "@/lib/study/studyQueue";
import { DeckControls } from "./DeckControls";
import { DeckStatsBar } from "./DeckStatsBar";
import { ExportButtons } from "./ExportButtons";
import { StudySession } from "./StudySession";

interface StudyViewProps {
  terms: PublishedTerm[];
  tracks: Track[];
  onOpenTerm: (slug: string) => void;
}

/** Flashcards for every term and interview question, scheduled with SM-2. */
export function StudyView({ terms, tracks, onOpenTerm }: StudyViewProps) {
  const allCards = useMemo(() => buildStudyCards(terms), [terms]);
  const cardIds = useMemo(() => new Set(allCards.map((card) => card.id)), [allCards]);
  const isKnownCard = useCallback((id: string) => cardIds.has(id), [cardIds]);
  const trackNameOf = useCallback((id: string) => tracks.find((track) => track.id === id)?.name ?? id, [tracks]);

  const { schedules, grade } = useStudySchedules(isKnownCard);
  const [filter, setFilter] = useState<DeckFilter>({ trackId: null, kind: "all" });
  const [now, setNow] = useState(() => Date.now());

  const cards = useMemo(() => filterCards(allCards, filter), [allCards, filter]);
  const queue = useMemo(() => studyQueue(cards, schedules, now), [cards, schedules, now]);
  const stats = useMemo(() => deckStats(cards, schedules, now), [cards, schedules, now]);

  const gradeCard = useCallback(
    (cardId: string, answer: Grade) => {
      grade(cardId, answer);
      setNow(Date.now());
    },
    [grade],
  );
  const changeFilter = useCallback((next: DeckFilter) => {
    setFilter(next);
    setNow(Date.now());
  }, []);

  return (
    <main className="study" aria-label="Study flashcards">
      <div className="study__sheet">
        <header className="study__header">
          <h2 className="study__title">Study</h2>
          <DeckControls tracks={tracks} filter={filter} onChange={changeFilter} />
        </header>
        <DeckStatsBar stats={stats} seed={`study-${filter.trackId ?? "all"}-${filter.kind}`} />
        <StudySession
          key={`${filter.trackId}-${filter.kind}`}
          card={queue[0]}
          schedules={schedules}
          now={now}
          nextDue={nextDueAt(cards, schedules)}
          onGrade={gradeCard}
          onOpenTerm={onOpenTerm}
        />
        <ExportButtons cards={cards} trackNameOf={trackNameOf} fileStem={exportFileStem(filter, trackNameOf)} />
      </div>
    </main>
  );
}

function exportFileStem({ trackId, kind }: DeckFilter, trackNameOf: (id: string) => string): string {
  const parts = ["ai-engineering-dictionary", trackId ? trackNameOf(trackId) : null, kind === "all" ? null : kind];
  return parts
    .filter((part): part is string => part !== null)
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}
