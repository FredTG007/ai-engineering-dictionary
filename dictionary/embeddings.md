---
title: Embeddings
description: Lists of numbers that represent the meaning of text, so similar content ends up close together and can be compared.
difficulty: beginner
interview: "Search over your help center returns articles that share keywords with the query but miss its meaning. How could embeddings help, and what can go wrong?"
interviewAnswer: "Explains vectors that place similar meaning close together, compared with cosine similarity. Covers using the same embedding model for documents and queries, re-embedding everything when the model changes, weak handling of exact terms like IDs, and pairing with keyword search."
buildThis:
  title: Build a semantic search tool over personal notes
  goal: Generate vector embeddings for local text files and search them using cosine similarity.
  steps:
    - Read a folder of text notes and split them into short paragraphs.
    - Call an embedding API to convert each paragraph into a vector of floats.
    - Write a search function that computes cosine similarity between a query vector and your notes.
  skills:
    - Vector Math
    - Cosine Similarity
    - Search
  time: an afternoon
  stretch: Use a lightweight vector index like FAISS or ChromaDB instead of raw numpy arrays.
---

An embedding is a vector, a fixed-length list of numbers, that represents the meaning of a piece of text. An embedding model reads a sentence, paragraph or document and outputs, say, 1,024 numbers. Texts with similar meaning produce vectors that point in similar directions, even if they share no words. "How do I reset my password" and "I forgot my login" end up close together.

Embeddings are what make [similarity search](./similarity-search.md) possible. You embed your documents once, store the vectors in a [vector database](./vector-database.md), then embed each incoming query and find the nearest stored vectors. This is the retrieval step at the heart of [retrieval-augmented generation (RAG)](./rag.md), and it also powers deduplication, clustering, recommendation and [semantic caching](./semantic-caching.md).

The vectors are only as good as the model that made them, and mismatches cause quiet failures. One team upgraded their embedding model for queries but forgot to re-embed the stored documents. Search results became nearly random, yet nothing errored, because the vectors still had the right length. Every stored vector must come from the same model and version as the query vectors, so a model change means a full re-index.

Embedding models also have blind spots. General-purpose models may not understand domain jargon, product codes or internal acronyms, and they often struggle with exact matches such as error codes or SKU numbers. That is one reason teams combine vector search with keyword search in [hybrid search](./hybrid-search.md). Long inputs are another issue: an embedding of a twenty-page document blurs many topics into one point, which is why documents are split by [chunking](./chunking.md) before embedding.

Practical choices include vector size, which affects storage and search speed, and whether to use a hosted or self-hosted model. Evaluate candidates on your own queries with known relevant results rather than relying on public leaderboards.

_Usage:_

- "We changed embedding models, so the whole index needs re-embedding."
- "Embeddings won't match SKU codes. Add keyword search."
- "Check recall on our own queries before switching embedding providers."
