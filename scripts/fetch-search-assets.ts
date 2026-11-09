/**
 * Puts the search-by-meaning model and the onnxruntime wasm under public/search-model/
 * so the browser never loads them from a third-party CDN. Idempotent: files that are
 * already in place are left alone, and downloads land under a temporary name first.
 */
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { EMBEDDING_MODEL, MODEL_ASSET_DIR, WASM_ASSET_DIR, WASM_FILE_STEM } from "../lib/search/semanticModel";

/** Pinned so the browser and the committed term embeddings always use the same weights. */
const MODEL_REVISION = "751bff37182d3f1213fa05d7196b954e230abad9";
const MODEL_FILES = ["config.json", "tokenizer.json", "tokenizer_config.json", "onnx/model_quantized.onnx"];
const WASM_FILES = [`${WASM_FILE_STEM}.mjs`, `${WASM_FILE_STEM}.wasm`];

const PUBLIC_DIR = path.join(process.cwd(), "public");

async function main(): Promise<void> {
  const modelDir = path.join(PUBLIC_DIR, MODEL_ASSET_DIR, EMBEDDING_MODEL.id);
  for (const file of MODEL_FILES) await downloadIfMissing(modelFileUrl(file), path.join(modelDir, file));
  const wasmSourceDir = onnxRuntimeDistDir();
  for (const file of WASM_FILES) copyIfChanged(path.join(wasmSourceDir, file), path.join(PUBLIC_DIR, WASM_ASSET_DIR, file));
  console.log(`✓ search model and wasm are in public/${MODEL_ASSET_DIR}/`);
}

function modelFileUrl(file: string): string {
  return `https://huggingface.co/${EMBEDDING_MODEL.id}/resolve/${MODEL_REVISION}/${file}`;
}

async function downloadIfMissing(url: string, target: string): Promise<void> {
  if (fs.existsSync(target)) return;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`download failed (${response.status}): ${url}`);
  writeAtomically(target, Buffer.from(await response.arrayBuffer()));
  console.log(`  downloaded ${path.relative(process.cwd(), target)}`);
}

function copyIfChanged(source: string, target: string): void {
  const contents = fs.readFileSync(source);
  if (fs.existsSync(target) && fs.readFileSync(target).equals(contents)) return;
  writeAtomically(target, contents);
  console.log(`  copied ${path.relative(process.cwd(), target)}`);
}

function writeAtomically(target: string, contents: Buffer): void {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const partial = `${target}.partial`;
  fs.writeFileSync(partial, contents);
  fs.renameSync(partial, target);
}

/** The onnxruntime-web build that @huggingface/transformers itself resolves to. */
function onnxRuntimeDistDir(): string {
  const requireFromTransformers = createRequire(createRequire(__filename).resolve("@huggingface/transformers"));
  return path.dirname(requireFromTransformers.resolve("onnxruntime-web"));
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
