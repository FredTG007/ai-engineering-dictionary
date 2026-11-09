---
title: Metadata Filtering
description: Restricting a vector search to documents whose attributes, like tenant, date or product, match hard conditions before ranking.
difficulty: intermediate
interview: "A multi-tenant RAG app occasionally shows one customer a snippet from another customer's documents. How would you fix retrieval to stop this?"
interviewAnswer: "Covers attaching tenant and permission metadata at indexing time, applying filters inside the vector query rather than after it, pre-filter versus post-filter trade-offs on recall and latency, enforcing access server-side, and tests that assert no cross-tenant results."
buildThis:
  title: Build a filtered vector search tool
  goal: Combine hard attribute constraints with semantic similarity to narrow down retrieval results.
  steps:
    - Create a small document collection tagged with categories and dates.
    - Index documents and metadata into a local vector store like Chroma.
    - Write a query function that applies a metadata filter before similarity search.
    - Verify that restricted queries exclude records outside the filter criteria.
  skills:
    - ChromaDB
    - Vector Search
    - Python
  time: an afternoon
  stretch: Build a parser that extracts filter tags directly from user prompts using a small regex or LLM classifier.
---

Metadata filtering means narrowing a search to documents whose structured attributes match explicit conditions, such as `tenant_id = 42` or `published_after = 2025-01-01`, before or during the vector lookup. Every chunk you store carries a small set of fields next to its embedding, and the filter turns those fields into rules that similarity alone cannot express.

The problem it solves usually shows up as a leak or a stale answer. One team found their internal assistant quoting a 2022 pricing sheet because, semantically, it was the closest match to "what does the Pro plan cost?" A worse version: a multi-tenant support bot returned a paragraph from another customer's contract. [Similarity search](./similarity-search.md) ranks by meaning, not by permission or freshness, so anything that must be true about a result belongs in a filter, not in the hope that the right document scores highest.

Where the filter runs matters for both correctness and speed. Most [vector databases](./vector-database.md) support pre-filtering, post-filtering, or a hybrid of the two.

| Approach | How it works | Risk |
|---|---|---|
| Pre-filter | Apply conditions first, then search the survivors | Slow if many documents pass the filter and the index can't be used to search them |
| Post-filter | Search top-k, then drop non-matching results | Can return zero results when matches sit outside the top-k |
| Filtered index | Index is built to traverse only matching nodes | Needs engine support and careful field indexing |

The design work happens at ingestion time, not query time. When you do [chunking](./chunking.md), attach the fields you will need later: source, owner, document version, language, access group. Retrofitting metadata onto a few million chunks is far more painful than writing it once. Keep field names consistent and types strict, because a date stored as a string in one pipeline and a timestamp in another will silently break range filters.

Treat filters as a security boundary in any [RAG](./rag.md) system that serves more than one customer. Derive tenant and permission filters from the authenticated session on the server, never from text the model or user produced, and test them with [evals](./evals.md) that deliberately ask for data the caller should not see.

_Usage:_

- "Don't rely on the embedding to pick the right tenant. Put tenant_id in the filter."
- "We got zero hits because it was post-filtering top-20 and none of them were from this year."
- "Add doc_version to the chunk metadata so we can stop retrieving the old handbook."
