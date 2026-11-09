---
title: RAG (Retrieval-Augmented Generation)
description: A pattern where you fetch relevant documents at request time and place them in the prompt so the model answers from them.
difficulty: beginner
interview: "Your support bot invented a 60-day refund window when the real policy is 30 days. How would you use retrieval to fix it and confirm the fix holds?"
interviewAnswer: "Covers retrieving the actual policy at request time and instructing the model to answer only from it, logging retrieved chunk IDs to check retrieval before touching the prompt, and evaluating retrieval and answer quality separately, with the token and latency cost of context."
buildThis:
  title: Build a Local Mini-RAG System
  goal: Answer questions over a local text file using vector embeddings and an LLM.
  steps:
    - Chunk a local text document into smaller paragraphs using Python.
    - Generate embeddings for each chunk using a free local embedding model or lightweight API.
    - Store embeddings in an in-memory vector index like FAISS or Chroma.
    - Retrieve top matching chunks for a user question and format them into an LLM prompt.
  skills:
    - embeddings
    - vector database
    - Chroma
    - Python
  time: a weekend
  stretch: Implement a sliding-window chunking strategy with overlap and measure its effect on answer accuracy.
---

Retrieval-augmented generation (RAG) is the pattern of looking up relevant information when a request arrives and putting it into the [prompt](./prompt.md) so the model can answer from it instead of from memory alone. The model's weights stay the same; what changes is the context it sees on each call.

Teams usually reach for RAG after a [hallucination](./hallucination.md) incident. A typical one: the support bot confidently described a 60-day refund window when the real policy was 30 days, because nothing in its training data said otherwise and nothing in the prompt corrected it. Pasting the actual policy into the context fixes that class of error far more cheaply than retraining, and it lets you update answers by updating documents.

A basic pipeline has two phases. Offline, you split source documents with [chunking](./chunking.md), turn each chunk into [embeddings](./embeddings.md), and store them in a [vector database](./vector-database.md). Online, you embed the user's question, retrieve the closest chunks, and send them to the model along with instructions to answer only from what was provided.

| Stage | Common failure | Typical fix |
|---|---|---|
| [Ingestion](./document-ingestion.md) | Tables and PDFs parsed into noise | Better parsers, structure-aware chunking |
| Retrieval | Right document exists but is not returned | Hybrid search, [query rewriting](./query-rewriting.md), metadata filters |
| Ranking | Relevant chunk returned at position 15, cut off | Reranking, larger candidate pool |
| Generation | Model ignores context or blends in prior knowledge | Stricter instructions, citations, grounding checks |

Most RAG problems are retrieval problems wearing a generation costume. When an answer is wrong, look at what was retrieved before touching the prompt. If the right chunk was not in the context, no amount of prompt tuning will help. Logging the retrieved chunk IDs for every request makes this debugging possible.

RAG is not free. Each retrieved chunk adds tokens, which raises cost and [latency](./latency.md), and a larger context can dilute the model's attention. Measure [retrieval quality](./retrieval-metrics.md) and answer quality separately with [evals](./evals.md), so you know which half of the system to fix.

_Usage:_

- "Before you rewrite the prompt, check whether the refund doc was even retrieved."
- "We're doing RAG over the help center, re-indexed nightly."
- "Recall at 5 is fine; the problem is the model blending in what it already thinks."
