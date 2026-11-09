---
title: Vector Database
description: A database built to store embeddings and quickly find the ones nearest to a query vector, often alongside metadata filters.
difficulty: intermediate
interview: "Your assistant keeps quoting a pricing page that was edited two months ago. What would you check in the retrieval index, and how do you prevent it recurring?"
interviewAnswer: "Covers ingestion that only adds new documents and never re-embeds edited or deleted ones, change detection and re-indexing pipelines, keeping raw text and tracking the embedding model per vector, plus enforcing metadata filters like tenant inside the query itself."
buildThis:
  title: Build a pure Python vector search engine
  goal: Write a lightweight script that stores float vectors and performs cosine similarity search without external DB software.
  steps:
    - Generate or load a set of sample text embeddings.
    - Write a cosine similarity function using basic vector math.
    - Implement a search function that compares a query vector against all stored vectors.
    - Return the top K closest vectors along with their similarity scores.
  skills:
    - Python
    - Vector Math
    - Search
  time: under an hour
  stretch: Add metadata filtering so you can restrict searches to items matching a specific category tag.
---

A vector database stores [embeddings](./embeddings.md) and answers the question "which stored vectors are closest to this one?" quickly, even across millions or billions of items. It builds approximate nearest neighbor indexes for [similarity search](./similarity-search.md), stores the original text or an ID alongside each vector, and usually supports [metadata filtering](./metadata-filtering.md) so you can restrict results by tenant, date, language or document type.

You do not always need a dedicated product. For a few hundred thousand vectors, a vector extension in the relational database you already run is often enough, and it keeps your data in one place with existing backups and access controls. Dedicated vector databases earn their keep at larger scale, with high query volume, or when you need features like built-in [hybrid search](./hybrid-search.md).

The operational problems are mostly about keeping the index in step with the source data. One team's assistant kept quoting a pricing page that had been changed two months earlier. The documents were updated in the CMS, but the ingestion job only added new pages and never re-embedded edited ones. Another team leaked one customer's documents into another's answers because the tenant filter was applied in application code that a new endpoint bypassed. Filtering in the query itself, enforced on every call, is safer.

Plan for re-indexing from the start. Changing your embedding model or [chunking](./chunking.md) strategy means rebuilding the whole index, which can take hours. Keep the raw text and a pipeline that can regenerate everything, track which embedding model produced each vector, and watch query latency and recall as the collection grows.

_Usage:_

- "We don't need a new vector database yet, the Postgres extension handles our volume."
- "The index is stale, edited docs never got re-embedded."
- "Tenant filtering has to happen in the vector query, not after."
