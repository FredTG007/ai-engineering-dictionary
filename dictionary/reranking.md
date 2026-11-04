---
title: Reranking
description: A second retrieval pass where a slower, more accurate model reorders candidate documents by how well they answer the query.
---

Reranking is a second pass over retrieved candidates in which a more precise model scores each one against the query and reorders the list. The first-stage retriever is built for speed across millions of documents; the reranker is built for accuracy across a few dozen.

The symptom that leads teams to add a reranker is usually "the right document was retrieved but not used." Logs show the correct chunk sitting at position 14, while only the top 5 make it into the prompt. Fast retrievers compare a query embedding with document [embeddings](./embeddings.md) computed independently, so they cannot weigh how specific words in the question relate to specific words in the passage. A reranker, usually a cross-encoder or a small [LLM](./llm.md), reads the query and each candidate together and catches those relationships.

The standard shape is retrieve wide, rerank narrow. Pull 50 to 100 candidates using [hybrid search](./hybrid-search.md), rerank them, and pass the best 5 to 10 to the model. This lets the cheap step optimize for recall and the expensive step optimize for precision.

| Setting | Effect of increasing it |
|---|---|
| Candidates retrieved | Better recall, more reranker cost and latency |
| Candidates kept after rerank | More context for the model, more tokens per call |
| Reranker model size | Better ordering, slower scoring |

The cost is real and shows up in [latency](./latency.md). One team watched p95 response time nearly double after adding a hosted reranker over 100 candidates; cutting to 40 candidates recovered most of the time with almost no loss in answer quality. Batch the scoring call, set a timeout, and fall back to the original order if the reranker is slow or unavailable.

Rerankers also give you a useful signal. Their scores are better calibrated than raw similarity, so you can drop candidates below a threshold and let the model say "I don't know" instead of answering from weak context. That threshold should be tuned with [evals](./evals.md) in your [RAG](./rag.md) pipeline, not picked by intuition.

_Usage:_

- "Recall is fine, the right chunk is in the top 50. It's just ranked 14th. Add a reranker."
- "Rerank 40, not 100. The extra 60 bought us latency and nothing else."
- "If the top rerank score is under 0.3, we tell the user we couldn't find it."
