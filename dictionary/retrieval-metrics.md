---
title: Retrieval Metrics
description: Scores such as recall@k, MRR and nDCG that measure whether retrieval returns the right documents near the top.
difficulty: intermediate
interview: "After a chunking change, your RAG answer scores dropped but nobody can say whether retrieval or generation got worse. Which retrieval metrics would you compute, and on what data?"
interviewAnswer: "Covers a labeled set of queries with known relevant chunks, recall@k at the cutoff actually sent to the model, MRR for how high the first relevant result ranks, nDCG for graded relevance, comparing before and after, and slicing by query type."
---

Retrieval metrics measure the search half of a [RAG](./rag.md) system on its own, separate from what the model writes. You need a set of queries where you know which documents or chunks are relevant, then you run retrieval and score how many of them came back and how high they ranked.

The most useful metric is usually recall@k: the share of relevant items that appear in the top k results, where k is the number of chunks you actually put in the prompt. If the answer needs one chunk and it sits at position 12 while you send the top 5, the model never sees it. Precision@k, the share of the top k that is relevant, matters when irrelevant chunks distract the model or waste [tokens](./tokens.md).

Ranking-aware metrics tell you whether the good results come first. Mean reciprocal rank (MRR) takes the position of the first relevant result for each query, scores it as one divided by that rank, and averages across queries, so a hit at rank 1 scores 1.0 and a hit at rank 4 scores 0.25. Normalized discounted cumulative gain (nDCG) handles graded relevance, where some documents are more useful than others: each result's gain is discounted by the logarithm of its position, and the total is divided by the score of an ideal ordering, giving a number between 0 and 1.

| Metric | Question it answers | Use when |
|---|---|---|
| Recall@k | Did the needed chunks make the cut? | Almost always; set k to your prompt budget |
| Precision@k | How much of the context is noise? | Context is long or noisy |
| MRR | How high is the first good hit? | One right answer per query |
| nDCG@k | Is the order close to ideal? | Relevance is graded, not yes/no |

These metrics are how you settle arguments. One team saw answer quality drop after changing [chunking](./chunking.md) and spent a week tweaking prompts. When they finally computed recall@5 on their [golden dataset](./golden-dataset.md), it had fallen from 82 to 64 percent: the new chunks split tables away from their headings. The prompt had never been the problem.

Report the numbers per query type, not just on average. A [hybrid search](./hybrid-search.md) or [reranking](./reranking.md) change can raise the average while hurting identifier lookups, and the [evals](./evals.md) for answer quality should sit alongside these, not replace them.

_Usage:_

- "Recall at 5 dropped eighteen points after the re-chunk, that's your regression."
- "MRR is fine; the right doc is always near the top, the model just ignores it."
- "We grade relevance zero to three, so nDCG is the number we track."
