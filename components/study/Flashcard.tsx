import type { StudyCard } from "@/lib/study/cards";

const EYEBROWS = { definition: "Term", interview: "Interview question" } as const;
const ANSWER_TITLES = { definition: "Definition", interview: "What a good answer covers" } as const;

interface FlashcardProps {
  card: StudyCard;
  flipped: boolean;
  onFlip: () => void;
}

/** One card: the prompt, and the answer once flipped. */
export function Flashcard({ card, flipped, onFlip }: FlashcardProps) {
  return (
    <article className="flashcard" data-kind={card.kind} aria-live="polite">
      <p className="flashcard__eyebrow">
        {EYEBROWS[card.kind]}
        {card.kind === "interview" && <span className="flashcard__about"> · {card.title}</span>}
      </p>
      <p className={card.kind === "definition" ? "flashcard__term" : "flashcard__question"}>{card.front}</p>
      {flipped ? (
        <div className="flashcard__answer">
          <h3 className="flashcard__answer-title">{ANSWER_TITLES[card.kind]}</h3>
          <p>{card.back}</p>
        </div>
      ) : (
        <button type="button" className="flashcard__flip" onClick={onFlip}>
          Show answer <kbd>Space</kbd>
        </button>
      )}
    </article>
  );
}
