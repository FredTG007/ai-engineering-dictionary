"use client";

import { useCallback, useState } from "react";
import type { StudyCard } from "@/lib/study/cards";
import { describeDelay, type Grade } from "@/lib/study/sm2";
import type { Schedules } from "@/lib/study/studyQueue";
import { Flashcard } from "./Flashcard";
import { GradeButtons } from "./GradeButtons";
import { useStudyShortcuts } from "./useStudyShortcuts";

interface StudySessionProps {
  card: StudyCard | undefined;
  schedules: Schedules;
  now: number;
  nextDue: number | null;
  onGrade: (cardId: string, grade: Grade) => void;
  onOpenTerm: (slug: string) => void;
}

/** The card in front of the reader, or a note when nothing is left to study. */
export function StudySession({ card, schedules, now, nextDue, onGrade, onOpenTerm }: StudySessionProps) {
  const [flipped, setFlipped] = useState(false);
  const flip = useCallback(() => setFlipped(true), []);
  const grade = useCallback(
    (answer: Grade) => {
      if (!card) return;
      setFlipped(false);
      onGrade(card.id, answer);
    },
    [card, onGrade],
  );
  useStudyShortcuts({ flipped: flipped && Boolean(card), onFlip: flip, onGrade: grade });

  if (!card) return <AllCaughtUp nextDue={nextDue} now={now} />;
  return (
    <div className="study-session">
      <Flashcard key={card.id} card={card} flipped={flipped} onFlip={flip} />
      {flipped && (
        <>
          <GradeButtons schedule={schedules[card.id]} now={now} onGrade={grade} />
          <button type="button" className="read-more study-session__open" onClick={() => onOpenTerm(card.slug)}>
            Open “{card.title}” on the map
          </button>
        </>
      )}
      <p className="study-session__keys">
        <kbd>Space</kbd> flip · <kbd>1</kbd>–<kbd>4</kbd> grade
      </p>
    </div>
  );
}

function AllCaughtUp({ nextDue, now }: { nextDue: number | null; now: number }) {
  return (
    <div className="study-session study-session--done">
      <p className="flashcard__term">All caught up.</p>
      <p>
        {nextDue === null
          ? "No cards match this filter."
          : `Nothing is due right now. The next card comes back in about ${describeDelay(Math.max(0, nextDue - now))}.`}
      </p>
    </div>
  );
}
