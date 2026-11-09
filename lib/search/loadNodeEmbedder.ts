import path from "node:path";
import { env, pipeline } from "@huggingface/transformers";
import { EMBEDDING_MODEL, MODEL_ASSET_DIR } from "./semanticModel";

export type Embed = (texts: string[]) => Promise<Float32Array[]>;

/** Embeds texts in Node with the same self-hosted model files the browser loads. */
export async function loadNodeEmbedder(): Promise<Embed> {
  env.allowRemoteModels = false;
  env.localModelPath = path.join(process.cwd(), "public", MODEL_ASSET_DIR) + path.sep;
  const extract = await pipeline("feature-extraction", EMBEDDING_MODEL.id, { dtype: EMBEDDING_MODEL.dtype });
  return async (texts) => {
    const output = await extract(texts, { pooling: "mean", normalize: true });
    const [count, dimensions] = output.dims;
    const data = output.data as Float32Array;
    return Array.from({ length: count }, (_, row) => data.slice(row * dimensions, (row + 1) * dimensions));
  };
}
