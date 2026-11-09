export interface TermVector {
  slug: string;
  vector: Float32Array;
}

export interface MeaningMatch {
  slug: string;
  /** Cosine similarity, because both vectors are normalised. */
  similarity: number;
}

export interface MeaningRankOptions {
  /** Matches below this similarity are treated as unrelated and dropped. */
  floor: number;
  limit: number;
}

export function dotProduct(a: Float32Array, b: Float32Array): number {
  let sum = 0;
  for (let index = 0; index < a.length; index++) sum += a[index] * b[index];
  return sum;
}

/** Terms most similar in meaning to the query vector, best first. */
export function rankByMeaning(query: Float32Array, terms: TermVector[], { floor, limit }: MeaningRankOptions): MeaningMatch[] {
  return terms
    .map(({ slug, vector }) => ({ slug, similarity: dotProduct(query, vector) }))
    .filter((match) => match.similarity >= floor)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}
