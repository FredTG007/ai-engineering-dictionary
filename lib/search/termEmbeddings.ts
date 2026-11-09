import type { ValidationError } from "../validation/validateDictionary";
import type { EncodedEmbedding } from "./embeddingCodec";
import { EMBEDDING_MODEL } from "./semanticModel";

/** One term's vector plus the hash of the text it was computed from. */
export interface StoredTermEmbedding extends EncodedEmbedding {
  slug: string;
  hash: string;
}

/** Shape of `public/search/term-embeddings.json`. */
export interface TermEmbeddingsFile {
  model: string;
  dimensions: number;
  terms: StoredTermEmbedding[];
}

export interface ExpectedEmbedding {
  slug: string;
  hash: string;
}

const REBUILD_HINT = "run `npm run search:embeddings`";

/** Parses the embeddings file once, where it enters; throws on a malformed file. */
export function parseTermEmbeddingsFile(json: string): TermEmbeddingsFile {
  const data: unknown = JSON.parse(json);
  if (!isRecord(data) || typeof data.model !== "string" || typeof data.dimensions !== "number" || !Array.isArray(data.terms)) {
    throw new Error("term embeddings file needs model, dimensions and terms");
  }
  if (!data.terms.every(isStoredTermEmbedding)) throw new Error("every embedding needs slug, hash, scale and values");
  return { model: data.model, dimensions: data.dimensions, terms: data.terms };
}

/** Pure: which terms have no embedding, an embedding of old text, or an embedding but no term. */
export function findStaleEmbeddings(expected: ExpectedEmbedding[], file: TermEmbeddingsFile | null): ValidationError[] {
  if (!file) return [{ slug: "embeddings", message: `public/search/term-embeddings.json is missing; ${REBUILD_HINT}` }];
  if (file.model !== EMBEDDING_MODEL.id) {
    return [{ slug: "embeddings", message: `built with ${file.model}, expected ${EMBEDDING_MODEL.id}; ${REBUILD_HINT}` }];
  }
  const storedHashes = new Map(file.terms.map((term) => [term.slug, term.hash]));
  const expectedSlugs = new Set(expected.map((term) => term.slug));
  return [
    ...expected.filter((term) => storedHashes.get(term.slug) !== term.hash).map((term) => staleError(term.slug, storedHashes.has(term.slug))),
    ...file.terms.filter((term) => !expectedSlugs.has(term.slug)).map((term) => ({ slug: `embeddings:${term.slug}`, message: `has an embedding but no term; ${REBUILD_HINT}` })),
  ];
}

function staleError(slug: string, hasEmbedding: boolean): ValidationError {
  const problem = hasEmbedding ? "embedding is out of date with the entry or its search hint" : "has no embedding";
  return { slug: `embeddings:${slug}`, message: `${problem}; ${REBUILD_HINT}` };
}

function isStoredTermEmbedding(value: unknown): value is StoredTermEmbedding {
  return (
    isRecord(value) &&
    typeof value.slug === "string" &&
    typeof value.hash === "string" &&
    typeof value.scale === "number" &&
    typeof value.values === "string"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
