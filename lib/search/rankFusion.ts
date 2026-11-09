export type FoundBy = "keyword" | "meaning" | "both";

export interface FusedResult {
  slug: string;
  foundBy: FoundBy;
}

export interface Rankings {
  /** Slugs from keyword search, best first. */
  keyword: string[];
  /** Slugs from search by meaning, best first. */
  meaning: string[];
}

export interface FusionOptions {
  /** How much a meaning rank counts relative to the same keyword rank (keyword counts 1). */
  meaningWeight: number;
}

/** Standard reciprocal-rank-fusion damping: rank 1 scores 1/61, rank 2 scores 1/62, … */
const RRF_K = 60;

/**
 * Weighted reciprocal rank fusion. Each ranking adds weight / (K + rank) to a slug's score,
 * so terms both rankings agree on rise to the top. Ties keep keyword order first.
 */
export function fuseRankings({ keyword, meaning }: Rankings, { meaningWeight }: FusionOptions): FusedResult[] {
  const scores = new Map<string, { score: number; inKeyword: boolean; inMeaning: boolean; order: number }>();
  const add = (slug: string, points: number, source: "inKeyword" | "inMeaning") => {
    const entry = scores.get(slug) ?? { score: 0, inKeyword: false, inMeaning: false, order: scores.size };
    scores.set(slug, { ...entry, score: entry.score + points, [source]: true });
  };
  keyword.forEach((slug, index) => add(slug, 1 / (RRF_K + index + 1), "inKeyword"));
  meaning.forEach((slug, index) => add(slug, meaningWeight / (RRF_K + index + 1), "inMeaning"));
  return [...scores.entries()]
    .sort(([, a], [, b]) => b.score - a.score || a.order - b.order)
    .map(([slug, entry]) => ({ slug, foundBy: foundBy(entry.inKeyword, entry.inMeaning) }));
}

function foundBy(inKeyword: boolean, inMeaning: boolean): FoundBy {
  if (inKeyword && inMeaning) return "both";
  return inKeyword ? "keyword" : "meaning";
}
