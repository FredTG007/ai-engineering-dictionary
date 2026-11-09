"use client";

import { useState } from "react";
import { curriculumPosition } from "@/lib/content/curriculumNavigation";
import type { PublishedTerm } from "@/lib/content/types";
import type { Track } from "@/lib/map/types";
import type { TrackProgress } from "@/lib/progress/trackProgress";
import { RoughUnderline } from "../sketch/RoughUnderline";
import { BuildThisCard } from "./BuildThisCard";
import { ConnectionChips } from "./ConnectionChips";
import { CurriculumNav } from "./CurriculumNav";
import { DefinitionBody } from "./DefinitionBody";
import { DifficultyBadge } from "./DifficultyBadge";
import { HeardInTheWild } from "./HeardInTheWild";
import { InterviewCard } from "./InterviewCard";
import { LearnedToggle } from "./LearnedToggle";
import { ListenButton } from "./ListenButton";
import { TrackBadges } from "./TrackBadges";

interface TermPanelProps {
  term: PublishedTerm;
  tracks: Track[];
  progressOf: (trackId: string) => TrackProgress | undefined;
  orderedSlugs: string[];
  learned: boolean;
  /** Narration URL, or null while the term has no recorded audio. */
  audioSrc: string | null;
  titleOf: (slug: string) => string;
  onToggleLearned: () => void;
  onSelect: (slug: string) => void;
  onClose: () => void;
  onExpand: () => void;
}

export function TermPanel(props: TermPanelProps) {
  const { term, tracks, progressOf, orderedSlugs, learned, audioSrc, titleOf, onToggleLearned, onSelect, onClose, onExpand } = props;
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
        <DifficultyBadge difficulty={term.difficulty} />
        <button type="button" className="ink-button panel__close" onClick={onClose} aria-label="Close panel">
          ×
        </button>
      </div>
      <div className="panel__scroll">
        <h2 className="panel__title">{term.title}</h2>
        <RoughUnderline seed={term.slug} className="panel__underline" />
        <TrackBadges tracks={tracks} progressOf={progressOf} />
        <p className="panel__description">{term.description}</p>
        <div className="panel__actions">
          <button type="button" className="read-more" aria-expanded={expanded} onClick={toggleExpanded}>
            {expanded ? "Show less" : "Read more"}
          </button>
          <LearnedToggle learned={learned} onToggle={onToggleLearned} />
          <ListenButton src={audioSrc} />
        </div>
        {expanded && <DefinitionBody html={term.definitionHtml} onTermLink={onSelect} />}
        <InterviewCard question={term.interview} answer={term.interviewAnswer} onReveal={onExpand} />
        {term.buildThis && <BuildThisCard card={term.buildThis} onOpen={onExpand} />}
        <HeardInTheWild quotes={term.quotes} />
        <ConnectionChips term={term} titleOf={titleOf} onSelect={onSelect} />
      </div>
      <CurriculumNav position={position} titleOf={titleOf} onSelect={onSelect} />
    </aside>
  );
}
