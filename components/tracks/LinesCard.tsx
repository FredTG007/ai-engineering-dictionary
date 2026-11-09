"use client";

import { useState, type ReactNode } from "react";

/** Folded-away legend shown while a term is open; expands to the full Lines list. */
export function LinesCard({
  learnedCount,
  total,
  progressActions,
  children,
}: {
  learnedCount: number;
  total: number;
  progressActions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="lines-card" data-open={open} aria-label="Lines and progress">
      <button type="button" className="lines-card__toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="lines-card__title">Lines</span>
        <span className="lines-card__summary">
          {learnedCount} / {total} learned
        </span>
        <span aria-hidden="true">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="lines-card__body">
          {children}
          {progressActions}
        </div>
      )}
    </section>
  );
}
