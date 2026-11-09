import { fuseRankings, type FoundBy, type FusedResult } from "./rankFusion";
import type { SearchHit, TermSearch } from "./termSearch";

export const RESULT_LIMIT = 8;
/**
 * Cosine similarity below which a meaning match counts as unrelated. Unrelated queries
 * ("kitchen renovation ideas") peak around 0.24 against the term vectors; see `npm run search:check`.
 */
export const MEANING_FLOOR = 0.25;

/** Queries this long read as sentences, where keyword hits on filler words are noise. */
const SENTENCE_WORDS = 3;

/** How much search by meaning counts relative to keyword search for this query. */
export function meaningWeightFor(query: string): number {
  const words = query.trim().split(/\s+/).filter(Boolean).length;
  return words >= SENTENCE_WORDS ? 2 : 0.5;
}

/** Keyword and meaning rankings (slugs, best first) fused into what the search box shows. */
export function combineSearchResults(query: string, keywordSlugs: string[], meaningSlugs: string[]): FusedResult[] {
  return fuseRankings({ keyword: keywordSlugs, meaning: meaningSlugs }, { meaningWeight: meaningWeightFor(query) }).slice(0, RESULT_LIMIT);
}

export interface ResultHit extends SearchHit {
  foundBy: FoundBy;
}

/** What the search box lists: keyword results alone until meaning results arrive, then both fused. */
export function hybridHits(search: TermSearch, query: string, meaningSlugs: string[]): ResultHit[] {
  const keywordSlugs = search.keywordSlugs(query, RESULT_LIMIT);
  return combineSearchResults(query, keywordSlugs, meaningSlugs).flatMap(({ slug, foundBy }) => {
    const hit = search.hitFor(slug);
    return hit ? [{ ...hit, foundBy }] : [];
  });
}
