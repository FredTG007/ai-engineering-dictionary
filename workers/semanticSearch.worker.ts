/// <reference lib="webworker" />
/**
 * Search by meaning, off the main thread. Prefers self-hosted model + wasm under
 * /search-model/; if those assets are absent (lean deploy), falls back to the
 * Hugging Face CDN and the default onnxruntime wasm CDN.
 */
import { env, pipeline, type FeatureExtractionPipeline } from "@huggingface/transformers";
import { decodeEmbedding } from "@/lib/search/embeddingCodec";
import { MEANING_FLOOR, RESULT_LIMIT } from "@/lib/search/hybridSearch";
import { rankByMeaning, type TermVector } from "@/lib/search/rankByMeaning";
import { EMBEDDING_MODEL, MODEL_ASSET_DIR, TERM_EMBEDDINGS_PATH, WASM_ASSET_DIR, WASM_FILE_STEM } from "@/lib/search/semanticModel";
import type { MeaningQuery, SemanticWorkerEvent } from "@/lib/search/semanticWorkerProtocol";
import { parseTermEmbeddingsFile } from "@/lib/search/termEmbeddings";

declare const self: DedicatedWorkerGlobalScope;

const post = (event: SemanticWorkerEvent) => self.postMessage(event);

async function selfHostedAssetsPresent(): Promise<boolean> {
  try {
    const probe = await fetch(`/${MODEL_ASSET_DIR}/${EMBEDDING_MODEL.id}/config.json`, { method: "HEAD" });
    return probe.ok;
  } catch {
    return false;
  }
}

async function configureAssets(): Promise<void> {
  const wasm = env.backends.onnx.wasm;
  if (!wasm) throw new Error("onnxruntime wasm backend is missing");
  wasm.numThreads = 1;
  if (await selfHostedAssetsPresent()) {
    env.allowRemoteModels = false;
    env.allowLocalModels = true;
    env.localModelPath = `/${MODEL_ASSET_DIR}/`;
    wasm.wasmPaths = { mjs: `/${WASM_ASSET_DIR}/${WASM_FILE_STEM}.mjs`, wasm: `/${WASM_ASSET_DIR}/${WASM_FILE_STEM}.wasm` };
    return;
  }
  env.allowRemoteModels = true;
  env.allowLocalModels = false;
}

async function loadTermVectors(): Promise<TermVector[]> {
  const response = await fetch(`/${TERM_EMBEDDINGS_PATH}`);
  if (!response.ok) throw new Error(`term embeddings: HTTP ${response.status}`);
  return parseTermEmbeddingsFile(await response.text()).terms.map((term) => ({ slug: term.slug, vector: decodeEmbedding(term) }));
}

async function loadSearchByMeaning(): Promise<(query: string) => Promise<SemanticWorkerEvent>> {
  if (typeof WebAssembly === "undefined") throw new Error("WebAssembly is not available");
  await configureAssets();
  const [extract, termVectors]: [FeatureExtractionPipeline, TermVector[]] = await Promise.all([
    pipeline("feature-extraction", EMBEDDING_MODEL.id, { dtype: EMBEDDING_MODEL.dtype, device: "wasm" }),
    loadTermVectors(),
  ]);
  return async (query) => {
    const output = await extract(query, { pooling: "mean", normalize: true });
    const matches = rankByMeaning(output.data as Float32Array, termVectors, { floor: MEANING_FLOOR, limit: RESULT_LIMIT });
    return { type: "matches", query, matches };
  };
}

const searchByMeaning = loadSearchByMeaning();
searchByMeaning.then(
  () => post({ type: "ready" }),
  (error: unknown) => post({ type: "failed", reason: error instanceof Error ? error.message : String(error) }),
);

self.onmessage = async ({ data }: MessageEvent<MeaningQuery>) => {
  post(await (await searchByMeaning)(data.query));
};
