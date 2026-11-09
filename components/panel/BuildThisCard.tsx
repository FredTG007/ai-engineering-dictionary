"use client";

import { useState } from "react";
import type { BuildThis } from "@/lib/content/types";

interface BuildThisCardProps {
  card: BuildThis;
  onOpen: () => void;
}

/** A portfolio project sticky note for the open term. */
export function BuildThisCard({ card, onOpen }: BuildThisCardProps) {
  const [open, setOpen] = useState(false);

  const reveal = () => {
    onOpen();
    setOpen(true);
  };

  return (
    <section className="build-this-card" aria-label="Build this project">
      <h3 className="build-this-card__eyebrow">Build this</h3>
      <p className="build-this-card__title">{card.title}</p>
      <p className="build-this-card__goal">{card.goal}</p>
      <p className="build-this-card__meta">
        <span className="build-this-card__time">{card.time}</span>
        <span className="build-this-card__skills" aria-label="Skills">
          {card.skills.join(" · ")}
        </span>
      </p>
      {open ? (
        <div className="build-this-card__body">
          <h4 className="build-this-card__section-title">Steps</h4>
          <ol className="build-this-card__steps">
            {card.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <h4 className="build-this-card__section-title">Stretch</h4>
          <p className="build-this-card__stretch">{card.stretch}</p>
        </div>
      ) : (
        <button type="button" className="build-this-card__reveal" aria-expanded={false} onClick={reveal}>
          Show steps and stretch goal
        </button>
      )}
    </section>
  );
}
