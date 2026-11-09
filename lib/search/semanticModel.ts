/** The sentence-embedding model used at build time (terms) and in the browser (queries). */
export const EMBEDDING_MODEL = {
  id: "Xenova/all-MiniLM-L6-v2",
  /** transformers.js dtype for `onnx/model_quantized.onnx`. */
  dtype: "q8",
  dimensions: 384,
} as const;

/** Directory under `public/` holding the self-hosted model and onnxruntime wasm. */
export const MODEL_ASSET_DIR = "search-model";
/** Sub-directory of MODEL_ASSET_DIR holding the onnxruntime wasm build. */
export const WASM_ASSET_DIR = `${MODEL_ASSET_DIR}/ort`;
/** The onnxruntime-web build to load: plain SIMD wasm, the smallest one that runs without WebGPU. */
export const WASM_FILE_STEM = "ort-wasm-simd-threaded";
/** Term vectors, under `public/`. */
export const TERM_EMBEDDINGS_PATH = "search/term-embeddings.json";
