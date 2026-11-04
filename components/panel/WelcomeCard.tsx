import type { ReactNode } from "react";
import { RoughUnderline } from "../sketch/RoughUnderline";

interface WelcomeCardProps {
  termCount: number;
  trackCount: number;
  learnedCount: number;
  firstSlug: string;
  firstTitle: string;
  onStart: (slug: string) => void;
  /** The Lines list, shown under the introduction. */
  lines: ReactNode;
  footer: ReactNode;
}

export function WelcomeCard({ termCount, trackCount, learnedCount, firstSlug, firstTitle, onStart, lines, footer }: WelcomeCardProps) {
  return (
    <aside className="panel panel--welcome" aria-label="Welcome">
      <div className="panel__scroll">
        <p className="panel__eyebrow">
          {termCount} stations · {trackCount} lines
        </p>
        <h2 className="panel__title">Learn the vocabulary of shipping LLM systems.</h2>
        <RoughUnderline seed="welcome" className="panel__underline" />
        <p className="panel__description">
          Each coloured line is a learning track and each station is a term. Ringed stations are interchanges, where one
          idea belongs to several tracks. Drag to pan, scroll or pinch to zoom, click a station to read it, or press{" "}
          <kbd>/</kbd> to search.
        </p>
        <button type="button" className="read-more" onClick={() => onStart(firstSlug)}>
          Start with {firstTitle} →
        </button>
        <section className="panel-section">
          <h3 className="panel-section__title">
            Your lines · {learnedCount} / {termCount} learned
          </h3>
          {lines}
        </section>
        {footer}
      </div>
    </aside>
  );
}
