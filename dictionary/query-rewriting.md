---
title: Query Rewriting
description: Using a model or rules to turn a user's raw question into one or more better search queries before retrieval runs.
difficulty: intermediate
interview: "Follow-up questions like and what about the annual plan retrieve nothing useful in your RAG chatbot. How would query rewriting help, and what does it cost?"
interviewAnswer: "Covers rewriting a follow-up into a standalone query using chat history, expanding or splitting into several queries, and handling synonyms. Trade-offs include an extra model call adding latency and cost, and rewrites that drift from what the user meant, so log and evaluate them."
buildThis:
  title: Build a Query Rewriting Pipeline
  goal: Transform ambiguous user questions into clear, explicit search queries before RAG retrieval.
  steps:
    - Write a prompt that takes chat history and a vague follow-up question as input.
    - Have a fast model output a standalone search query containing all necessary context.
    - Pass the rewritten query into a vector search database lookup.
    - Compare retrieval relevance scores between raw user queries and rewritten queries.
  skills:
    - RAG
    - query transformation
    - prompting
    - search
  time: an afternoon
  stretch: Generate three diverse variations of the user query in parallel to improve multi-angle retrieval coverage.
---

Query rewriting is the step where you transform what the user typed into a query that your retrieval system can actually match well. Users write short, ambiguous, conversational messages; search indexes respond best to explicit, self-contained phrasing. A rewriting step sits between the two.

The need becomes obvious in multi-turn chat. A user asks about the Enterprise plan, then follows up with "and does it include SSO?" Embedding that follow-up on its own retrieves generic SSO docs, or nothing useful, because "it" carries no meaning to the index. One team saw their [RAG](./rag.md) assistant answer roughly a third of follow-up questions about the wrong product before they added a rewrite that resolved pronouns against the conversation history.

Several rewriting techniques are common, and they can be combined:

- **Contextualization:** rewrite a follow-up into a standalone question using prior turns.
- **Expansion:** generate a few alternative phrasings or synonyms and search with each.
- **Decomposition:** split a compound question into sub-questions that are retrieved separately.
- **Hypothetical answer:** have the model draft a plausible answer and embed that, since it often sits closer to real documents than the question does.
- **Filter extraction:** pull structured constraints, like a date range or product name, out of the text and turn them into [metadata filtering](./metadata-filtering.md) conditions.

Rewriting costs an extra model call, so it shows up directly in [latency](./latency.md) and [time to first token](./time-to-first-token.md). A small, fast model is usually enough for this job, and you can skip the rewrite entirely for first-turn questions that are already specific. Running multiple expanded queries in parallel and merging the results keeps the added delay to roughly one round trip.

Rewrites can also go wrong. A model that "helpfully" adds assumptions can steer retrieval away from what the user meant. Log the original and rewritten query side by side, and include rewrite-sensitive cases in your [evals](./evals.md) so a prompt change to the rewriter does not quietly degrade retrieval.

_Usage:_

- "The follow-up just says 'what about Canada?', so we need to rewrite it with the previous turn."
- "Rewriting added 300 ms; let's move it to the small model."
- "Log both queries so we can see when the rewriter invents a constraint."
