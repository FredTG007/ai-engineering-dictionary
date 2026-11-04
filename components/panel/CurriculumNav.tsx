import type { CurriculumPosition } from "@/lib/content/curriculumNavigation";

interface CurriculumNavProps {
  position: CurriculumPosition;
  titleOf: (slug: string) => string;
  onSelect: (slug: string) => void;
}

export function CurriculumNav({ position, titleOf, onSelect }: CurriculumNavProps) {
  const { previousSlug, nextSlug } = position;
  return (
    <nav className="curriculum-nav" aria-label="Curriculum">
      <button type="button" className="curriculum-nav__button" disabled={!previousSlug} onClick={() => previousSlug && onSelect(previousSlug)}>
        <span className="curriculum-nav__hint">← Previous</span>
        <span className="curriculum-nav__title">{previousSlug ? titleOf(previousSlug) : "Start"}</span>
      </button>
      <button type="button" className="curriculum-nav__button curriculum-nav__button--next" disabled={!nextSlug} onClick={() => nextSlug && onSelect(nextSlug)}>
        <span className="curriculum-nav__hint">Next →</span>
        <span className="curriculum-nav__title">{nextSlug ? titleOf(nextSlug) : "The end"}</span>
      </button>
    </nav>
  );
}
