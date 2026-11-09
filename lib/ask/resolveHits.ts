import type { AskCorpusFile } from "./corpusTypes";
import type { AskHit } from "./types";

export type { AskCorpusFile } from "./corpusTypes";

/** Pure: attach passages to client hits; drop unknown slugs. */
export function resolveAskHits(
  hits: Array<{ slug: string; score: number }>,
  corpus: AskCorpusFile,
): AskHit[] {
  const bySlug = new Map(corpus.terms.map((term) => [term.slug, term]));
  return hits.flatMap((hit) => {
    const entry = bySlug.get(hit.slug);
    if (!entry) return [];
    return [{ slug: entry.slug, title: entry.title, score: hit.score, passage: entry.passage }];
  });
}
