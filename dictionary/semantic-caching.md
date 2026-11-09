---
title: Semantic Caching
description: Reusing a stored LLM response when a new query means roughly the same thing as an earlier one, judged by embedding similarity.
difficulty: intermediate
interview: "You want a semantic cache in front of your help bot to cut costs. What could go wrong and how would you guard against it?"
interviewAnswer: "Covers embedding queries and matching by similarity threshold, wrong hits where small words like team or not change meaning, tuning the threshold on labeled pairs, scoping by tenant or product, excluding personalized or time-sensitive queries, and tracking wrong-hit rate."
buildThis:
  title: Build a semantic cache to save API costs
  goal: Create a caching layer that returns previous LLM answers when a new prompt is semantically similar to an old one.
  steps:
    - Set up a local vector store or SQLite database to hold queries, embeddings, and responses.
    - When a new user query arrives, generate its embedding vector.
    - Search your cache for an existing query with a cosine similarity score above 0.92.
    - Return the cached response if a match is found; otherwise, call the LLM and save the new pair.
  skills:
    - Embeddings
    - Caching
    - Vector Search
  time: an afternoon
  stretch: Track and log the estimated dollar amount saved by the cache across fifty repeated or rephrased test queries.
---

Semantic caching serves a previously generated answer when a new request is close in meaning to one already seen, even if the wording differs. Instead of keying the cache on the exact prompt text, you compute an [embedding](./embeddings.md) of the query, run a [similarity search](./similarity-search.md) against embeddings of past queries, and if the closest match is above a similarity threshold, return its stored response without calling the model.

The appeal is the hit rate. Exact-match [caching](./caching.md) rarely helps with natural language because users phrase the same question in endless ways: "how do I reset my password", "forgot password help", "can't log in, need new password". A semantic cache can treat these as one question. A software company's help bot saw its hit rate climb from about three percent with exact matching to around thirty-five percent with semantic matching, cutting both model spend and median latency on those requests.

The danger is that "similar" is not the same as "equivalent". The same help bot later served the answer for "how do I delete my account" to someone who asked "how do I delete my team account", which involved a different and far more destructive process. The embeddings were close; the correct answers were not. Small words such as "not", "team", "before" and product names can flip the meaning while barely moving the vector.

Several practices reduce wrong hits:

- Tune the similarity threshold on real queries labeled as same or different, rather than guessing a number.
- Scope the cache with [metadata filtering](./metadata-filtering.md) by product, language, user tier or tenant so near-duplicates from different contexts cannot match.
- Exclude personalized or time-sensitive questions entirely.
- Optionally verify a candidate hit with a cheap classifier or small model before serving it.

Semantic caching suits high-volume, repetitive, non-personalized traffic such as FAQ and documentation bots. It is a poor fit for open-ended conversation or anything where context from earlier turns changes the right answer. Monitor wrong-hit rates from user feedback and sampled reviews, not just hit rate.

_Usage:_

- "Drop the threshold to 0.92 and the hit rate doubles, but so do the wrong answers."
- "Partition the semantic cache by tenant; one customer just saw another's FAQ answer."
- "It's matching 'cancel subscription' with 'pause subscription', which is a very different flow."
