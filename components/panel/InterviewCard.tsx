"use client";

import { useState } from "react";

interface InterviewCardProps {
  question: string;
  answer: string;
  onReveal: () => void;
}

/** An interview question; what a good answer covers stays hidden until asked for. */
export function InterviewCard({ question, answer, onReveal }: InterviewCardProps) {
  const [revealed, setRevealed] = useState(false);

  const reveal = () => {
    onReveal();
    setRevealed(true);
  };

  return (
    <section className="interview-card" aria-label="Interview question">
      <h3 className="interview-card__eyebrow">Interview question</h3>
      <p className="interview-card__question">{question}</p>
      {revealed ? (
        <div className="interview-card__answer">
          <h4 className="interview-card__answer-title">What a good answer covers</h4>
          <p>{answer}</p>
        </div>
      ) : (
        <button type="button" className="interview-card__reveal" aria-expanded={false} onClick={reveal}>
          Think it through, then reveal what a good answer covers
        </button>
      )}
    </section>
  );
}
