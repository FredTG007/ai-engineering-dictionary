---
title: Hybrid Search
description: Combining keyword search and vector search in one retrieval step so you catch both exact terms and paraphrased meaning.
---

Hybrid search runs a keyword search and a vector search over the same corpus and merges their results into a single ranked list. Each method misses things the other finds, and combining them is one of the cheapest ways to raise retrieval recall.

The weakness of pure vector search shows up with exact identifiers. A user pastes an error code like `ERR_4012` or a SKU like `KX-220B`, and [similarity search](./similarity-search.md) over [embeddings](./embeddings.md) returns documents about vaguely similar errors instead of the one page that contains that exact string. Keyword engines such as BM25 handle this well. The reverse is also true: a keyword search for "cancel my subscription" misses a page titled "Ending your membership," which a vector search finds easily.

| Query type | Keyword (BM25) | Vector |
|---|---|---|
| Error codes, SKUs, names | Strong | Weak |
| Paraphrased questions | Weak | Strong |
| Rare jargon | Strong | Depends on embedding model |
| Typos | Weak | Moderately robust |

Merging two ranked lists is the main design decision. The scores from each method live on different scales, so adding them directly rarely works. Reciprocal rank fusion sidesteps the problem by scoring each document based on its position in each list, not its raw score. Weighted blending of normalized scores is the alternative, but the weights need tuning against real queries and tend to drift as the corpus changes.

Hybrid search is usually the first retrieval improvement worth making in a [RAG](./rag.md) system, ahead of more expensive steps. Many [vector databases](./vector-database.md) now offer it natively, which avoids running and syncing a separate search engine. It pairs naturally with [reranking](./reranking.md): retrieve a broad candidate set from both methods, then let a reranker sort out the final order.

Measure it before and after. Build a set of queries that includes identifiers, paraphrases and domain jargon, and track recall at your cutoff for each category. A blended score that improves the average can still hurt one category badly, and that category may be the one your users care about most.

_Usage:_

- "Vector search can't find ERR_4012 to save its life. We need BM25 in there."
- "We switched to reciprocal rank fusion and stopped fiddling with the alpha weight."
- "Hybrid got recall@10 from 71 to 86 percent on the support set."
