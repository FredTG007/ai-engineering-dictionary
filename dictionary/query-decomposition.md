---
title: Query Decomposition
description: Splitting a question with several parts into separate sub-queries that are retrieved on their own and then merged.
difficulty: intermediate
interview: "Users ask your pricing bot to compare two plans and it only ever describes one of them. What is going wrong in retrieval, and how would you fix it?"
interviewAnswer: "Covers how one embedding averages two intents so the stronger one wins the top-k, splitting the question into one sub-query per plan, retrieving and merging with a cap per sub-query, and checking recall per intent on a golden set rather than per question."
buildThis:
  title: Build a sub-query splitter with per-intent recall
  goal: Turn multi-part questions into separate searches and prove the merged results cover every part.
  steps:
    - Collect thirty questions from your own domain that each ask about two or three things at once.
    - Prompt a model to split each question into a JSON list of standalone sub-queries.
    - Retrieve the top chunks for each sub-query against a local index and merge them with a per-query cap.
    - "Score whether each intent's expected document appears, and compare against single-query retrieval."
  skills:
    - prompt design
    - structured output
    - Python
    - retrieval metrics
  time: an afternoon
  stretch: Add a rule that skips decomposition when the model returns only one sub-query, and measure the latency saved.
---

Query decomposition is the step of breaking a question that asks for several things into smaller questions that each ask for one thing, running retrieval for each, and merging the results before generation. It belongs in the same family as [query rewriting](./query-rewriting.md), but the goal is not a better single query. The goal is several queries, because one was never going to be enough.

The failure it addresses is easy to reproduce. A single embedding of "compare the Starter and Team plan pricing and tell me which supports SSO" is an average of three intents. In practice the vector lands nearest the chunks about one plan, usually the one with more text in the corpus, and the top five results all describe that plan. The model then writes a confident comparison with half the facts missing or invented. One SaaS support team found that 30 percent of their "compare" questions produced answers that mentioned only one of the two plans, and every one of those traces showed retrieval returning Starter chunks alone.

Decomposition fixes that by giving each intent its own retrieval budget. The model, or a cheap classifier, turns the question into a list of standalone sub-queries such as "Starter plan price", "Team plan price" and "which plans include SSO". Each one runs through the normal [RAG](./rag.md) retrieval path, often with a cap of two or three chunks per sub-query, and the merged set goes to the generator with the original question. [Reranking](./reranking.md) the merged pool against the original question helps trim the overlap.

| Question shape | Single query | Decomposed |
| --- | --- | --- |
| One intent, clear wording | Works | Adds cost for nothing |
| Two named items to compare | One item dominates | Both retrieved |
| Multi-hop, where the second part depends on the first | Misses the second hop | Needs sequential sub-queries |

The costs are an extra model call for the split and several retrievals instead of one. Latency grows, and so does the context size, so set caps and skip decomposition when the splitter returns a single sub-query. For questions where the second hop depends on the first answer, a loop that retrieves, reads, then forms the next query is more appropriate, which is the territory of [agentic RAG](./agentic-rag.md). [HyDE](./hyde.md) solves a different problem, vocabulary mismatch, and the two can be combined per sub-query.

Measure the win with [retrieval metrics](./retrieval-metrics.md) scored per intent, not per question. A question counts as served only when every part of it has its supporting chunk in the context.

_Usage:_

- "Every 'compare X and Y' question was retrieving only X, so we split them before search."
- "Cap it at three chunks per sub-query or the context balloons."
- "The splitter returned one sub-query, so skip the merge step and just search."
