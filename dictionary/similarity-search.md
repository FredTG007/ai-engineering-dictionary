---
title: Similarity Search
description: Finding the stored items whose vectors are closest to a query vector, used to retrieve content by meaning rather than keywords.
difficulty: intermediate
interview: "Your vector search returns documents that look related but rarely contain the answer. How do you diagnose and improve it?"
interviewAnswer: "Covers checking the embedding model fits the domain, chunk size and boundaries, the distance metric, top-k choice, and approximate index recall settings, measuring recall on labeled queries, and adding reranking or hybrid keyword search for exact terms."
---

Similarity search is the process of finding the items in a collection that are most similar to a query, measured by the distance between their vectors. You turn the query into an [embedding](./embeddings.md), compare it against stored embeddings using a measure such as cosine similarity or dot product, and return the top k closest results. It is how a [RAG](./rag.md) system finds passages relevant to a question that may not share any exact words with them.

Exact search compares the query with every stored vector, which is accurate but slow once you have millions of items. Production systems almost always use approximate nearest neighbor indexes, such as HNSW or IVF, that trade a little accuracy for large speed gains. A [vector database](./vector-database.md) manages these indexes for you, but the trade-off is still yours to tune.

| Setting | Higher value means | Watch out for |
| --- | --- | --- |
| top k | More candidates retrieved | More tokens, more noise in the prompt |
| Index search breadth | Better recall | Slower queries |
| Similarity threshold | Fewer, more relevant results | Empty results for unusual queries |

"Most similar" is not the same as "relevant", and that gap causes real bugs. One team's HR assistant answered questions about the UK parental leave policy using the US document, because the two were worded almost identically and the US one ranked slightly higher. Similarity search had done its job; the system had no way to know which country the user was in. Adding [metadata filtering](./metadata-filtering.md) on region fixed it.

Results also depend heavily on what you index. Chunks that are too large blur several topics together, chunks that are too small lose context, and duplicate content crowds out everything else in the top k. Measure retrieval quality directly with a set of queries and known relevant passages, and consider adding [reranking](./reranking.md) to reorder the candidates with a more precise model.

_Usage:_

- "Similarity search pulled the US policy because it's nearly the same text."
- "Bump top k to 20 and let the reranker pick the best five."
- "Recall dropped after we tightened the HNSW settings."
