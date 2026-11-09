/** Writes public/search/term-embeddings.json: one int8 meaning vector per term, plus the hash of its text. */
import fs from "node:fs";
import path from "node:path";
import { encodeEmbedding } from "../lib/search/embeddingCodec";
import { loadEmbeddingSources, TERM_EMBEDDINGS_FILE } from "../lib/search/loadEmbeddingSources";
import { loadNodeEmbedder } from "../lib/search/loadNodeEmbedder";
import { EMBEDDING_MODEL } from "../lib/search/semanticModel";
import type { TermEmbeddingsFile } from "../lib/search/termEmbeddings";

async function main(): Promise<void> {
  const sources = loadEmbeddingSources();
  const embed = await loadNodeEmbedder();
  const vectors = await embed(sources.map((source) => source.text));
  const file: TermEmbeddingsFile = {
    model: EMBEDDING_MODEL.id,
    dimensions: EMBEDDING_MODEL.dimensions,
    terms: sources.map((source, index) => ({ slug: source.slug, hash: source.hash, ...encodeEmbedding(vectors[index]) })),
  };
  fs.mkdirSync(path.dirname(TERM_EMBEDDINGS_FILE), { recursive: true });
  fs.writeFileSync(TERM_EMBEDDINGS_FILE, `${JSON.stringify(file)}\n`);
  const kilobytes = (fs.statSync(TERM_EMBEDDINGS_FILE).size / 1024).toFixed(1);
  console.log(`✓ embedded ${sources.length} terms into ${path.relative(process.cwd(), TERM_EMBEDDINGS_FILE)} (${kilobytes} KB)`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
