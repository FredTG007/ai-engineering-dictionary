---
title: HyDE (Hypothetical Document Embeddings)
description: Ask the model to draft a plausible answer, embed that draft, and retrieve with it instead of the raw question.
difficulty: intermediate
interview: "Your internal wiki search works for long questions but returns junk for two-word queries like 'vpn timeout'. How could HyDE help, and what would you watch for?"
interviewAnswer: "Covers generating a short hypothetical answer so the query vector looks like a document rather than a question, measuring recall before and after on a golden set, the extra model call's latency and cost, and the risk that a fabricated draft pulls in the wrong document when the model has no real knowledge of the topic."
buildThis:
  title: Measure HyDE against plain query embedding
  goal: Find out whether embedding a model-written draft answer retrieves better chunks than embedding the question on your own corpus.
  steps:
    - Index a folder of your own notes or docs into a local vector store with an open embedding model.
    - Write twenty short questions and record which document should answer each one.
    - For each question, retrieve once with the raw query and once with a model-written hypothetical answer.
    - Compare recall at five for the two methods and log the extra latency of the drafting call.
  skills:
    - embeddings
    - Python
    - retrieval metrics
    - prompt design
  time: an afternoon
  stretch: Try averaging the query vector with the draft vector and see whether the blend beats either alone.
---

HyDE is a retrieval trick where you ask the model to write a short, plausible answer to the user's question first, then use [embeddings](./embeddings.md) of that draft to search the corpus instead of embedding the question itself. The draft is never shown to the user. It exists only to produce a vector that looks like the documents you are hoping to find.

The reason it works is that questions and answers live in different parts of embedding space. A three-word query such as "vpn drops laptop" shares little vocabulary or structure with the help-center article that resolves it, which is written in full sentences about split tunnelling and idle timeouts. A hypothetical answer written in the voice of that article lands much closer to it under [similarity search](./similarity-search.md). It is a cousin of [query rewriting](./query-rewriting.md), but instead of rephrasing the question it jumps straight to the shape of the result.

One team saw the effect clearly on an internal IT assistant. Long, well-formed questions retrieved the right article about 80 percent of the time, but terse searches typed from a phone retrieved it under 40 percent of the time. Adding a HyDE step with a small, fast model lifted short-query recall to roughly 70 percent with no change to the index. Their [RAG](./rag.md) prompt and chunks stayed identical; only the query vector changed.

The costs are real and easy to underestimate. Every search now needs a generation call before the retrieval call, which adds a few hundred milliseconds of [latency](./latency.md) and a per-request model bill. Worse, if the model knows nothing about the topic, it will still write a confident draft, and that draft can steer retrieval toward the wrong document entirely. A fabricated feature name in the draft is a fabricated feature name in the query.

| Situation | HyDE likely helps | HyDE likely hurts |
| --- | --- | --- |
| Query style | Short, keyword-like, jargon | Already a full sentence |
| Corpus | Formal prose, answers written out | Tables, codes, part numbers |
| Model knowledge | Topic is general | Topic is private and unknown to the model |

Treat HyDE as one lever among several, not a default. Measure it with [retrieval metrics](./retrieval-metrics.md) on a golden set, enable it only for query shapes where it wins, and consider [query decomposition](./query-decomposition.md) instead when the real problem is a question with several intents rather than a vocabulary gap.

_Usage:_

- "Short queries tank recall, so we draft a fake answer and embed that instead."
- "HyDE added 300 milliseconds and the model invented a product name that pulled in the wrong doc."
- "Only turn HyDE on when the query is under six words; it hurts the long ones."
