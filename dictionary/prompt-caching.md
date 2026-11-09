---
title: Prompt Caching
description: Reusing the model's processed state for a repeated prompt prefix so later calls are cheaper and start answering sooner.
difficulty: intermediate
interview: "You enabled prompt caching on a long system prompt but input costs barely moved. What would you check?"
interviewAnswer: "Covers caching needing an exact prefix match, volatile content such as timestamps or user data placed early and invalidating the cache, ordering stable material first, cache expiry on low-traffic endpoints, and tracking hit rate instead of assuming savings."
buildThis:
  title: Benchmark Prompt Caching Costs
  goal: Measure how prompt caching reduces latency and token costs for a large system prompt.
  steps:
    - Send a large context document (e.g., a software codebase) to an LLM provider multiple times.
    - Configure the API request headers or parameters to enable prompt caching.
    - Measure and log the time-to-first-token and cost difference between cached and uncached calls.
    - Write a brief summary report of your findings.
  skills:
    - API headers
    - cost optimization
    - benchmarking
    - latency
  time: under an hour
  stretch: Calculate the cache expiration TTL break-even point for your specific request frequency.
---

Prompt caching lets a provider skip reprocessing the part of a prompt it has already seen. When many requests share a long, identical prefix, such as a large [system prompt](./system-prompt.md), a block of tool definitions, or a reference document, the provider stores the computed state for that prefix and reuses it on the next call. You still pay for the new tokens at the end, but the cached portion is billed at a steep discount and processed far faster.

The symptom that usually leads teams here is a bill that grows with conversation length rather than with users. One support assistant we ran resent a 9,000-token policy manual on every turn. Each follow-up question cost almost as much as the first, and [time to first token](./time-to-first-token.md) sat around two seconds even for one-word replies. Enabling prompt caching on the manual cut input cost on follow-ups by roughly 80% and brought first-token latency under half a second.

Caching only works on an exact prefix match, so prompt layout matters. Put the stable material first and the volatile material last: instructions, tool schemas, and documents at the top; the user's message and any timestamps at the bottom. A single changed character early in the prompt, such as a "current time" line injected into the system prompt, invalidates everything after it. This is the most common reason teams enable caching and see no savings.

| Prompt section | Changes how often | Place it |
|---|---|---|
| System instructions, tool schemas | Per deploy | First |
| Reference documents | Per session | Middle |
| Conversation history | Per turn | Near the end |
| Latest user message, timestamps | Every call | Last |

Prompt caching is different from response [caching](./caching.md) and [semantic caching](./semantic-caching.md). Those return a stored answer and skip the model entirely; prompt caching still runs the model and produces a fresh answer, but avoids redoing work on the shared prefix. Under the hood it relies on the same idea as the [KV cache](./kv-cache.md), persisted across requests. Caches also expire after a period of inactivity, often around five minutes by default, so low-traffic endpoints may rarely get hits. Track the cache hit rate in your [cost tracking](./cost-tracking.md) dashboard rather than assuming it works.

_Usage:_

- "Cache hits dropped to zero after someone added the date to the system prompt."
- "Move the tool definitions above the history so they stay in the cached prefix."
- "With prompt caching on, the long-document follow-ups cost a fraction of the first call."
