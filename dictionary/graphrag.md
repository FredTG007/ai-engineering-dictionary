---
title: GraphRAG
description: Retrieval that walks a graph of entities and relationships, alongside vector search, to answer questions that span several documents.
difficulty: advanced
interview: "Analysts ask your document assistant questions like 'which suppliers of our top customer also appear in last year's audit findings?' and plain vector RAG fails. What would you try, and what would it cost?"
interviewAnswer: "Covers why one embedding cannot follow a chain of relationships across documents, extracting entities and relations into a graph at ingestion, walking the graph to collect linked passages and combining them with vector hits, and the upfront extraction bill, graph staleness and the fact that most single-hop questions never need it."
buildThis:
  title: Extract a small knowledge graph and query it alongside vectors
  goal: Build a graph of people, organisations and relationships from a document set and use it to answer multi-hop questions.
  steps:
    - Pick thirty short documents that mention overlapping people and organisations, such as press releases or meeting notes.
    - Prompt a model to extract entity and relation triples from each document as JSON and load them into a networkx graph.
    - Write ten two-hop questions and answer them by walking the graph to find linked documents, then passing those to the model.
    - Compare the answers and the retrieval cost against plain vector search over the same documents.
  skills:
    - prompt design
    - structured output
    - networkx
    - Python
    - embeddings
  time: a weekend
  stretch: Track how many extraction tokens the graph cost and estimate the bill for re-extracting when ten percent of the documents change.
---

GraphRAG is a family of retrieval approaches that build a graph of entities and the relationships between them at ingestion time, then answer questions by walking that graph in addition to, or instead of, searching by vector similarity. Where plain [RAG](./rag.md) finds passages that look like the question, GraphRAG finds passages that are connected to each other through named things.

The motivating failure is the multi-hop question. "Which suppliers of our largest customer were also named in last year's audit?" needs three facts from three documents: who the largest customer is, who supplies them, and who the audit named. No single chunk contains that chain, and an embedding of the whole question sits near none of the pieces. [Query decomposition](./query-decomposition.md) gets partway there, but the second and third queries depend on answers to the first, and a flat index has no notion of "the same company" across documents.

A graph makes that connection explicit. During [document ingestion](./document-ingestion.md), a model extracts entities and relations from each chunk, such as "Acme supplies Globex", and merges repeated mentions into one node. At query time, the system identifies the entities in the question, walks a few hops outward, and gathers the chunks attached to the nodes it visited. Some variants also precompute summaries of graph communities so broad questions like "what are the main themes in this corpus" have something to retrieve. The gathered chunks are then combined with ordinary [embeddings](./embeddings.md) or [hybrid search](./hybrid-search.md) hits before generation.

The cost arrives at ingestion. A legal-research team ran entity extraction over 40,000 contracts with a mid-tier model and received an 11,000 dollar invoice before answering a single question, then discovered that contract amendments changed enough nodes each month to require a partial re-extraction. The graph also drifts out of date in ways a vector index does not, because a wrong or stale relation silently reroutes retrieval.

| Question type | Vector RAG | GraphRAG |
| --- | --- | --- |
| Single fact in one passage | Good | Overkill |
| Two or three linked facts across documents | Misses the links | Designed for it |
| Corpus-wide themes or summaries | Weak | Community summaries help |
| Corpus changes daily | Cheap re-index | Expensive re-extraction |

Reach for GraphRAG only after measuring that your failing questions really are multi-hop, and after cheaper options such as better chunking, [agentic RAG](./agentic-rag.md) loops and metadata have been tried. For many products, a small graph over a few entity types, built from structured fields you already have, delivers most of the benefit without an extraction bill.

_Usage:_

- "The question needs three hops across three documents; no chunk has the whole chain."
- "Extraction over the full corpus cost more than six months of query traffic, so we scoped the graph to customers and suppliers only."
- "Half our failing evals are single-hop. GraphRAG won't fix those; the chunking will."
