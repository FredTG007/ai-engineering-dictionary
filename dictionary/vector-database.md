---
title: Vector Database
description: A database built to store embeddings and quickly find the ones nearest to a query vector, often alongside metadata filters.
---

A vector database stores [embeddings](./embeddings.md) and answers the question "which stored vectors are closest to this one?" quickly, even across millions or billions of items. It builds approximate nearest neighbor indexes for [similarity search](./similarity-search.md), stores the original text or an ID alongside each vector, and usually supports [metadata filtering](./metadata-filtering.md) so you can restrict results by tenant, date, language or document type.

You do not always need a dedicated product. For a few hundred thousand vectors, a vector extension in the relational database you already run is often enough, and it keeps your data in one place with existing backups and access controls. Dedicated vector databases earn their keep at larger scale, with high query volume, or when you need features like built-in [hybrid search](./hybrid-search.md).

The operational problems are mostly about keeping the index in step with the source data. One team's assistant kept quoting a pricing page that had been changed two months earlier. The documents were updated in the CMS, but the ingestion job only added new pages and never re-embedded edited ones. Another team leaked one customer's documents into another's answers because the tenant filter was applied in application code that a new endpoint bypassed. Filtering in the query itself, enforced on every call, is safer.

Plan for re-indexing from the start. Changing your embedding model or [chunking](./chunking.md) strategy means rebuilding the whole index, which can take hours. Keep the raw text and a pipeline that can regenerate everything, track which embedding model produced each vector, and watch query latency and recall as the collection grows.

_Usage:_

- "We don't need a new vector database yet, the Postgres extension handles our volume."
- "The index is stale, edited docs never got re-embedded."
- "Tenant filtering has to happen in the vector query, not after."
