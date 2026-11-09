import { markdownToPlainText } from "../content/renderMarkdown";
import type { Term } from "../content/types";
import type { ValidationError } from "../validation/validateDictionary";

/**
 * Words of the definition to embed. Measured with `npm run search:check`: longer openings
 * dilute the vector with detail, and short symptom-style queries stop matching.
 */
export const DEFINITION_WORDS = 20;

type EmbeddedTerm = Pick<Term, "title" | "description" | "definitionMarkdown">;

/** The text a term's meaning vector is computed from. */
export function embeddingTextOf(term: EmbeddedTerm, searchHint: string): string {
  const opening = markdownToPlainText(term.definitionMarkdown).split(" ").slice(0, DEFINITION_WORDS).join(" ");
  return `${term.title}. ${searchHint}. ${term.description} ${opening}`;
}

/** Pure: every term needs exactly one search hint, and every hint needs a term. */
export function findSearchHintProblems(termSlugs: string[], hints: Readonly<Record<string, string>>): ValidationError[] {
  const known = new Set(termSlugs);
  return [
    ...termSlugs.filter((slug) => !hints[slug]).map((slug) => ({ slug: `search-hint:${slug}`, message: "has no entry in lib/search/searchHints.ts" })),
    ...Object.keys(hints).filter((slug) => !known.has(slug)).map((slug) => ({ slug: `search-hint:${slug}`, message: "is in lib/search/searchHints.ts but is not a term" })),
  ];
}
