import type { StationPlacement } from "./types";

/**
 * Hand-tuned station positions in grid units (see GRID_SIZE), plus the side
 * each label sits on. `npm run validate` fails if a label would overlap
 * another label, a station or a line, so tune here and re-run it.
 */
export const STATION_PLACEMENTS: Record<string, StationPlacement> = {
  // Foundations: west to east, then down the diagonal
  "llm": { x: -4, y: 0, label: "n" },
  "tokens": { x: -2, y: 0, label: "n" },
  "tokenizer": { x: 0, y: 0, label: "s" },
  "transformer": { x: 2, y: 0, label: "n" },
  "context-window": { x: 4, y: 0, label: "e" },
  "prompt": { x: 5.2, y: 1.2, label: "e" },
  "system-prompt": { x: 6.4, y: 2.4, label: "e" },
  "few-shot-prompting": { x: 7.6, y: 3.6, label: "e" },
  "chain-of-thought": { x: 8.8, y: 4.8, label: "e" },
  "temperature": { x: 10, y: 6, label: "e" },
  "top-p-sampling": { x: 11.2, y: 7.2, label: "e" },
  "structured-output": { x: 12.4, y: 8.4, label: "w" },
  "hallucination": { x: 14.4, y: 8.4, label: "s" },
  "inference": { x: 16.4, y: 8.4, label: "ne" },

  // RAG: up from Context Window, then east across the top
  "embeddings": { x: 4, y: -1.5, label: "w" },
  "similarity-search": { x: 4, y: -3, label: "w" },
  "vector-database": { x: 6, y: -5, label: "n" },
  "document-ingestion": { x: 8, y: -5, label: "s" },
  "chunking": { x: 10, y: -5, label: "n" },
  "metadata-filtering": { x: 12, y: -5, label: "s" },
  "rag": { x: 14, y: -5, label: "n" },
  "query-rewriting": { x: 16, y: -5, label: "s" },
  "bm25": { x: 18, y: -5, label: "n" },
  "hybrid-search": { x: 20, y: -5, label: "s" },
  "reranking": { x: 22, y: -5, label: "n" },
  "retrieval-metrics": { x: 24, y: -5, label: "s" },
  "grounding": { x: 26, y: -5, label: "n" },
  "context-engineering": { x: 28, y: -5, label: "s" },

  // Safety: down the west side to Human-in-the-Loop
  "guardrails": { x: 4.4, y: 4.4, label: "w" },
  "prompt-injection": { x: 4.4, y: 5.6, label: "w" },
  "indirect-prompt-injection": { x: 4.4, y: 6.8, label: "w" },
  "jailbreak": { x: 4.4, y: 8, label: "w" },
  "pii-redaction": { x: 4.4, y: 9.2, label: "w" },
  "content-moderation": { x: 4.4, y: 10.4, label: "w" },
  "red-teaming": { x: 4.4, y: 11.6, label: "w" },
  "human-in-the-loop": { x: 4.4, y: 18, label: "w" },

  // Agents: down from Structured Output, then west along the bottom
  "agent": { x: 12.4, y: 9.6, label: "w" },
  "tool-calling": { x: 12.4, y: 10.8, label: "w" },
  "function-schema": { x: 12.4, y: 12, label: "w" },
  "agent-loop": { x: 12.4, y: 13.2, label: "w" },
  "react-pattern": { x: 12.4, y: 14.4, label: "w" },
  "planning": { x: 12.4, y: 15.6, label: "w" },
  "memory": { x: 12.4, y: 16.8, label: "w" },
  "mcp": { x: 12.4, y: 18, label: "s" },
  "workflows-vs-agents": { x: 10.4, y: 18, label: "n" },
  "orchestrator-worker": { x: 8.4, y: 18, label: "s" },
  "multi-agent": { x: 6.4, y: 18, label: "n" },

  // Training & Inference: down from Inference, then east along the bottom
  "reasoning-models": { x: 16.4, y: 9.8, label: "w" },
  "multimodal": { x: 16.4, y: 11, label: "w" },
  "open-weight-models": { x: 16.4, y: 12.2, label: "w" },
  "fine-tuning": { x: 16.4, y: 13.4, label: "w" },
  "supervised-fine-tuning": { x: 17.4, y: 14.4, label: "w" },
  "lora": { x: 18.4, y: 15.4, label: "w" },
  "rlhf": { x: 19.4, y: 16.4, label: "w" },
  "dpo": { x: 20.4, y: 17.4, label: "w" },
  "distillation": { x: 21.4, y: 18.4, label: "s" },
  "quantization": { x: 23.4, y: 18.4, label: "n" },
  "kv-cache": { x: 25.4, y: 18.4, label: "s" },
  "speculative-decoding": { x: 27.4, y: 18.4, label: "n" },
  "batching": { x: 29.4, y: 18.4, label: "s" },
  "throughput": { x: 31.4, y: 18.4, label: "n" },
  "gpu-serving": { x: 33.4, y: 18.4, label: "s" },

  // Production: east from Inference, up the east side, back west to Drift
  "latency": { x: 19.4, y: 8.4, label: "n" },
  "time-to-first-token": { x: 21.9, y: 8.4, label: "s" },
  "streaming": { x: 24.4, y: 8.4, label: "n" },
  "observability": { x: 28.4, y: 8.4, label: "e" },
  "tracing": { x: 28.4, y: 7.2, label: "e" },
  "cost-tracking": { x: 28.4, y: 6, label: "e" },
  "caching": { x: 28.4, y: 4.8, label: "e" },
  "semantic-caching": { x: 28.4, y: 3.6, label: "e" },
  "prompt-caching": { x: 28.4, y: 2.4, label: "e" },
  "rate-limits": { x: 28.4, y: 1.2, label: "e" },
  "retries-and-timeouts": { x: 28.4, y: 0, label: "e" },
  "fallback-models": { x: 27, y: 0, label: "s" },
  "model-routing": { x: 25.6, y: 0, label: "n" },
  "llm-gateway": { x: 24.2, y: 0, label: "s" },
  "drift": { x: 22.8, y: 0, label: "nw" },

  // Evals: up the diagonal from Hallucination to Drift, then north
  "evals": { x: 15.24, y: 7.56, label: "e" },
  "error-analysis": { x: 16.08, y: 6.72, label: "e" },
  "golden-dataset": { x: 16.92, y: 5.88, label: "w" },
  "llm-as-judge": { x: 17.76, y: 5.04, label: "w" },
  "pairwise-evals": { x: 18.6, y: 4.2, label: "w" },
  "regression-evals": { x: 19.44, y: 3.36, label: "w" },
  "prompt-versioning": { x: 20.28, y: 2.52, label: "w" },
  "ab-testing-prompts": { x: 21.12, y: 1.68, label: "w" },
  "online-vs-offline-evals": { x: 21.96, y: 0.84, label: "w" },
  "user-feedback-loops": { x: 22.8, y: -1.6, label: "e" },

  // Voice: a loop below Production between Latency and Streaming
  "voice-agents": { x: 19.4, y: 9.9, label: "e" },
  "speech-to-text": { x: 19.4, y: 11.4, label: "s" },
  "turn-detection": { x: 24.4, y: 11.4, label: "s" },
  "text-to-speech": { x: 24.4, y: 9.9, label: "e" },
};
