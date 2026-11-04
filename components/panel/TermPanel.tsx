"use client";

import { useState } from "react";
import { curriculumPosition } from "@/lib/content/curriculumNavigation";
import type { PublishedTerm } from "@/lib/content/types";
import { ConnectionChips } from "./ConnectionChips";
import { CurriculumNav } from "./CurriculumNav";
import { DefinitionBody } from "./DefinitionBody";
import { HeardInTheWild } from "./HeardInTheWild";

interface TermPanelProps {
  term: PublishedTerm;
  orderedSlugs: string[];
  titleOf: (slug: string) => string;
  onSelect: (slug: string) => void;
  onClose: () => void;
  onExpand: () => void;
}

export function TermPanel({ term, orderedSlugs, titleOf, onSelect, onClose, onExpand }: TermPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const position = curriculumPosition(orderedSlugs, term.slug);

  const toggleExpanded = () => {
    if (!expanded) onExpand();
    setExpanded(!expanded);
  };

  return (
    <aside className="panel" aria-label={term.title}>
      <div className="panel__topline">
        <span className="panel__counter">
          {position.index + 1} / {position.total}
        </span>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Close panel">
          ×
        </button>
      </div>
      <div className="panel__scroll">
        <h2 className="panel__title">{term.title}</h2>
        <p className="panel__description">{term.description}</p>
        <button type="button" className="read-more" aria-expanded={expanded} onClick={toggleExpanded}>
          {expanded ? "Show less" : "Read more"}
        </button>
        {expanded && <DefinitionBody html={term.definitionHtml} onTermLink={onSelect} />}
        <HeardInTheWild quotes={term.quotes} />
        <ConnectionChips term={term} titleOf={titleOf} onSelect={onSelect} />
      </div>
      <CurriculumNav position={position} titleOf={titleOf} onSelect={onSelect} />
    </aside>
  );
}
