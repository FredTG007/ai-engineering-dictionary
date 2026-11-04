import { markdownToPlainText, renderMarkdownToHtml } from "./renderMarkdown";
import type { PublishedTerm, Term } from "./types";

/**
 * Orders terms by curriculum and attaches rendered HTML, incoming links and
 * track membership. Terms with no difficulty fall back to "beginner"; the
 * validator rejects them before a release.
 */
export function publishTerms(terms: Term[], curriculum: string[], trackIdsOf: (slug: string) => string[]): PublishedTerm[] {
  const incoming = collectIncomingLinks(terms);
  return orderByCurriculum(terms, curriculum).map((term) => ({
    slug: term.slug,
    title: term.title,
    description: term.description,
    difficulty: term.difficulty ?? "beginner",
    interview: term.interview,
    interviewAnswer: term.interviewAnswer,
    trackIds: trackIdsOf(term.slug),
    definitionHtml: renderMarkdownToHtml(term.definitionMarkdown),
    definitionText: markdownToPlainText(term.definitionMarkdown),
    quotes: term.quotes,
    outgoingSlugs: term.outgoingSlugs,
    incomingSlugs: incoming.get(term.slug) ?? [],
  }));
}

function collectIncomingLinks(terms: Term[]): Map<string, string[]> {
  const incoming = new Map<string, string[]>();
  for (const source of terms) {
    for (const target of source.outgoingSlugs) {
      incoming.set(target, [...(incoming.get(target) ?? []), source.slug]);
    }
  }
  return incoming;
}

function orderByCurriculum(terms: Term[], curriculum: string[]): Term[] {
  const position = (slug: string) => {
    const index = curriculum.indexOf(slug);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };
  return [...terms].sort((a, b) => position(a.slug) - position(b.slug));
}
