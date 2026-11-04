export interface CurriculumPosition {
  index: number;
  total: number;
  previousSlug: string | null;
  nextSlug: string | null;
}

/** Pure: where `slug` sits in the ordered list and what comes before/after it. */
export function curriculumPosition(orderedSlugs: string[], slug: string): CurriculumPosition {
  const index = orderedSlugs.indexOf(slug);
  return {
    index,
    total: orderedSlugs.length,
    previousSlug: index > 0 ? orderedSlugs[index - 1] : null,
    nextSlug: index >= 0 && index < orderedSlugs.length - 1 ? orderedSlugs[index + 1] : null,
  };
}
