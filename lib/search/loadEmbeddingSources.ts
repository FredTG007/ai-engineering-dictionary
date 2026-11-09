import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { loadTerms } from "../content/loadDictionary";
import { embeddingTextOf } from "./embeddingText";
import { SEARCH_HINTS } from "./searchHints";
import { EMBEDDING_MODEL, TERM_EMBEDDINGS_PATH } from "./semanticModel";
import { parseTermEmbeddingsFile, type ExpectedEmbedding, type TermEmbeddingsFile } from "./termEmbeddings";

export const TERM_EMBEDDINGS_FILE = path.join(process.cwd(), "public", TERM_EMBEDDINGS_PATH);

export interface EmbeddingSource extends ExpectedEmbedding {
  text: string;
}

/** Every term's embedding text, hashed together with the model id so a model change also counts as stale. */
export function loadEmbeddingSources(): EmbeddingSource[] {
  return loadTerms().map((term) => {
    const text = embeddingTextOf(term, SEARCH_HINTS[term.slug] ?? "");
    return { slug: term.slug, text, hash: hashText(`${EMBEDDING_MODEL.id}\n${text}`) };
  });
}

export function loadTermEmbeddingsFile(): TermEmbeddingsFile | null {
  return fs.existsSync(TERM_EMBEDDINGS_FILE) ? parseTermEmbeddingsFile(fs.readFileSync(TERM_EMBEDDINGS_FILE, "utf8")) : null;
}

function hashText(text: string): string {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}
