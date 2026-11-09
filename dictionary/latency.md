---
title: Latency
description: How long a user or system waits for a response, measured end to end and usually tracked as percentiles like p50 and p95.
difficulty: beginner
interview: "Users say your chat feature feels slow, but the average response time looks fine on the dashboard. Where do you look?"
interviewAnswer: "Covers tracking p95 and p99 instead of the mean, and splitting time into retrieval, queueing, time to first token and generation. Mentions streaming to cut perceived wait, shorter outputs, smaller models for simple steps, and tracing each stage end to end."
buildThis:
  title: Build a latency percentile monitor for LLM API calls
  goal: Measure and log p50, p90, and p99 response times for an LLM endpoint under load.
  steps:
    - Write a script that fires concurrent requests to an LLM endpoint using asyncio.
    - Capture the start and end timestamp for every individual request.
    - Calculate p50, p90, and p95 latency percentiles from the collected metrics.
    - Plot the latency distribution over time using a lightweight charting library.
  skills:
    - Python
    - Asyncio
    - Metrics
    - Benchmarking
  time: an afternoon
  stretch: Simulate network jitter and track how intermittent timeouts impact the p99 latency metric.
---

Latency is the time between sending a request and getting the response you need. In LLM systems it is rarely a single number, because a request often passes through retrieval, a [reranking](./reranking.md) step, one or more model calls and post-processing. Measure it end to end, and break it down per stage so you know where the time goes.

Percentiles matter more than averages. A p50 of two seconds can hide a p95 of fifteen, and the users in that tail are the ones who give up. Model latency is especially spiky because output length varies from request to request and provider load changes through the day. Always look at p95 and p99 when judging whether a change helped.

| Stage | Typical contribution | Main levers |
| --- | --- | --- |
| Retrieval and reranking | 50-500 ms | Index tuning, smaller reranker |
| Prefill (reading the prompt) | 100 ms - several s | Shorter prompts, caching |
| Decode (writing output) | Grows with output length | Concise answers, faster model |
| Tool calls and retries | Unbounded | Timeouts, parallel calls |

The most common latency regression is accidental. One team added a cross-encoder reranker to improve answer quality and saw p95 double overnight. Another added a second "check the answer" model call and turned a three-second response into seven. Neither change was wrong, but both were shipped without a latency budget, and both needed to be revisited.

There are three broad ways to bring latency down. Do less: shorter prompts, fewer [tokens](./tokens.md) in the output, fewer sequential calls. Do it faster: smaller models through [model routing](./model-routing.md), [prompt caching](./prompt-caching.md), or parallel tool calls. Or make the wait feel shorter with [streaming](./streaming.md), which shows the first words while the rest is still generating. Perceived latency is often what users actually care about.

_Usage:_

- "p50 looks fine, it's the p95 tail that's killing conversion."
- "What's the latency budget for this feature before we add another call?"
- "Half the latency is the reranker, not the model."
