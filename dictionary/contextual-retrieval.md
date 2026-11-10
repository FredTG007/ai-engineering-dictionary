---
title: Contextual Retrieval
description: Prepending a short, document-aware description to each chunk before indexing so it stays findable once cut from its source.
difficulty: intermediate
interview: "Your finance assistant indexes quarterly reports, but questions about Q3 revenue keep pulling chunks from other quarters. Chunk size is already tuned. What would you try next?"
interviewAnswer: "Covers that the chunks never mention which company or quarter they belong to once cut from the report, generating a sentence or two of context per chunk from the whole document and prepending it before both embedding and BM25 indexing, using prompt caching so the per-chunk cost stays low, and measuring recall before and after."
buildThis:
  title: Add generated context to every chunk and measure recall
  goal: Rebuild a chunk index where each chunk carries a model-written description of where it came from, then compare retrieval accuracy.
  steps:
    - Chunk three or four long documents with similar structure, such as reports from different years or product manuals for different models.
    - For each chunk, prompt a model with the full document and the chunk to write two sentences situating it, and prepend that text to the chunk.
    - Index both the original and the contextualised chunks in a local vector store and a BM25 index.
    - Run twenty questions that name a specific document and compare how often the right chunk appears in the top five.
  skills:
    - chunking
    - prompt caching
    - BM25
    - embeddings
    - Python
  time: an afternoon
  stretch: Measure the token cost of contextualising with and without prompt caching on the full document.
---

Contextual retrieval is an indexing technique where, before a chunk is embedded or added to a keyword index, a model writes a short description of what the chunk is and where it sits in its source document, and that description is prepended to the chunk text. The chunk that gets stored says, in effect, "this is from Acme's Q3 2024 report, in the section on subscription revenue", followed by the original text. Anthropic described and named the technique, and it has since become a common addition to [RAG](./rag.md) pipelines.

The failure it fixes is the orphaned chunk. [Chunking](./chunking.md) strips every passage of the headings, titles and preceding paragraphs that told a human reader what it was about. A finance team indexed four years of quarterly reports and found that "revenue grew 12 percent to 48 million" appeared, with slightly different numbers, in sixteen chunks that never named the quarter. A question about Q3 2024 revenue retrieved chunks from whichever quarter happened to phrase its sentence most similarly, and the bot answered with the wrong year's figure a third of the time. Metadata filters helped when the user named the quarter exactly, which they rarely did.

Adding context changes what the [embeddings](./embeddings.md) and the [BM25](./bm25.md) index see. The contextualised chunk now contains the words "Q3 2024" and "Acme", so keyword matching finds them, and its vector shifts toward the right company and period. Because the technique improves both retrievers, it is usually paired with [hybrid search](./hybrid-search.md). The team above saw the wrong-quarter rate drop from roughly a third to under five percent with no change to chunk size or prompt.

| Approach | Where the fix lives | Index cost | Request cost |
| --- | --- | --- | --- |
| Larger chunks | Chunking | None | More tokens per request |
| [Parent-document retrieval](./parent-document-retrieval.md) | Retrieval step | Small | Larger context |
| Contextual retrieval | Indexing | One model call per chunk | None |

The cost is one generation call per chunk at indexing time, with the whole document in the prompt each time. That sounds expensive, and for a large corpus it is, unless the document is cached. With [prompt caching](./prompt-caching.md), the full document is sent once and each chunk's call reads it from the cache, which brings the price down to a few dollars per million document tokens for most providers. Re-run the step whenever a document changes, since stale context is as misleading as none.

_Usage:_

- "Sixteen chunks say revenue grew 12 percent and none of them say which quarter. Prepend the context before you embed."
- "Contextualising the corpus cost about forty dollars with caching on; without it, the estimate was six hundred."
- "Now that chunks name the product, BM25 finally hits the right manual."
