# Proofread report

All 74 entries in `dictionary/` were proofread for technical accuracy, tone, typos and grammar, paragraph openings, consistent terminology and realistic usage quotes. No design or UI code was changed.

- **Files changed:** 51 of 74 (the other 23 needed no edits).
- `npm run validate`: ✓ 74 terms valid.
- `npm run build`: passes.

## Consistency decisions

- **American spelling everywhere.** The entries mixed British and American spelling (behaviour/behavior, summarise/summarize, labelled, licence, defence, neighbour, maths). They now use American spelling throughout, which matches existing titles such as "Quantization". If you'd rather use British English, this is the one change to reverse.
- **RAG:** The first mention now reads "retrieval-augmented generation (RAG)" (embeddings, evals, fine-tuning, golden-dataset, grounding, hybrid-search, rag).
- **MCP:** The first mention in function-schema now reads "Model Context Protocol (MCP)".
- **Tool calling:** "decides to call a function" became "decides to call a tool" in structured-output.

## Notable accuracy fixes (file: before -> after)

- **hallucination:** "One airline-style incident … promised a bereavement discount that did not exist, and the company had to honour it" -> "One widely reported airline case … the bot described a bereavement refund policy that did not exist, and a tribunal ordered the airline to honor it". This now matches the real Air Canada case, which involved a refund policy rather than a discount, and in which a tribunal ordered the airline to honor it.
- **prompt-caching:** "Caches also expire after a few minutes of inactivity" -> "after a period of inactivity, often around five minutes by default". Providers now offer longer retention options.
- **pii-redaction:** "ensuring the provider and your logs never see raw data" -> "the provider and your logs see only masked values, as long as detection caught them". The old wording overstated the guarantee, and the same entry warns about false negatives.
- **llm:** "That single objective, repeated over trillions of tokens, produces a system that can…" -> "That objective, repeated over trillions of tokens and followed by post-training on instructions and human feedback, produces…". Pretraining alone doesn't produce assistant behavior.
- **mcp:** "Every tool a server advertises ends up in the model's context window" -> "Unless the host defers or filters them, every tool…". Some hosts now load tools on demand or search for them.
- **metadata-filtering (table):** Pre-filter risk "Slow if the filter is highly selective and the index can't use it" -> "Slow if many documents pass the filter and the index can't be used to search them". A highly selective pre-filter leaves only a few documents, which are cheap to scan.
- **reranking:** "Their scores are better calibrated than raw similarity" -> "usually more reliable for thresholding than raw similarity". How well reranker scores are calibrated varies by model.
- **system-prompt:** "Because the system prompt is identical across requests" -> "is usually identical". Many system prompts include dynamic fields.
- **function-schema:** "the model's only source of information" -> "the model's main source of information".
- **caching (table):** "only reduces input cost" -> "only reduces input cost and latency". Prompt caching also cuts time to first token.
- **temperature:** "Above that, text becomes erratic quickly" -> "Much above 1.0, …". The old wording contradicted the entry's own table, which lists 0.8–1.2 for brainstorming. Also added: "Many reasoning models fix or ignore temperature entirely, so check the model's documentation before relying on it."
- **top-p-sampling:** "the cause is missing or misleading context" -> "the usual cause is …".
- **tracing:** "Most teams build on OpenTelemetry-style conventions" -> "Many teams …".
- **text-to-speech (usage quote):** The old quote complained that "Dr." was read as "drive" in street addresses, which is the correct reading. It was replaced with "TTS read 'Elm St. and Oak Dr.' as 'Elm Saint and Oak Doctor'. Normalize addresses first."

Smaller edits: typos and grammar (gpu-serving and drift descriptions, "cost-effective"), comma splices in a few usage quotes, and "user thumbs" changed to "thumbs-up and thumbs-down ratings" (observability).

## Uncertain (left as written; worth a look)

- **top-p-sampling:** In the anecdote, temperature 1.3 with top-p 0.5 gives "bizarre" text. Because temperature is applied before the top-p cut, this can happen, but top-p 0.5 usually trims the strange tail. The symptom may be overstated.
- **llm-as-judge, regression-evals:** Both advise setting temperature low for judges and eval runs. That doesn't apply to reasoning models that fix temperature. The new caveat in temperature.md covers this, but these two entries don't mention it.
- **prompt-caching:** "the cached portion is billed at a steep discount" is true for cache reads, but some providers (for example Anthropic) charge a premium to write the cache.
- **reasoning-models:** "reasoning models do this by default" may be too general. Some hybrid models only think when thinking is turned on.
- **chain-of-thought:** It describes thinking as "hidden", but some providers return summarized or full reasoning.
- **distillation:** "Some commercial model licenses restrict using outputs to train competing models" may understate it, since most major providers' terms do.
- **rlhf:** The post-training table leaves out reinforcement learning with verifiable rewards (RLVR), which is now a major stage. Nothing in the table is false, so nothing was added.
- **lora:** "an adapter trained on one base will not work on another" is usually true, but adapters sometimes load onto closely related checkpoints.
- **gpu-serving, time-to-first-token (usage quotes):** "only wins if utilization stays above about half" and "should cut TTFT in half" are rough rules of thumb, not general facts. They were kept because they read as things people say.
- **hallucination:** The first mention of RAG is the short `[RAG](./rag.md)` inside a table cell. It wasn't expanded, to keep the cell short.
