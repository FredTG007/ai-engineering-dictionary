---
title: Rate Limits
description: Caps a provider places on requests or tokens per minute, which your system must respect, queue around, or plan capacity for.
---

Rate limits are the ceilings an LLM provider puts on how much you can send in a window of time. They are usually expressed as requests per minute and tokens per minute, sometimes split into input and output tokens, and they apply per API key, per organization, or per model. When you cross one, the provider rejects the call with an HTTP 429 instead of serving it.

Most teams discover their limits during a launch rather than in planning. A document-summarization feature we shipped worked fine in staging, then failed for about a third of users on the first Monday morning because a nightly batch job was sharing the same key and had already consumed most of the token budget. The errors looked like random outages until someone read the response codes.

Token limits bite harder than request limits for LLM workloads. A single request with a long [context window](./context-window.md) can consume tens of thousands of tokens, so a modest number of [RAG](./rag.md) calls stuffed with retrieved chunks can exhaust a tokens-per-minute quota while the request count looks low. Estimating token usage per feature, not just traffic, is the only reliable way to forecast headroom.

Handling limits well is mostly about smoothing demand. Common tactics include a client-side queue or token bucket that paces outgoing calls, exponential backoff with jitter on 429s as described in [retries and timeouts](./retries-and-timeouts.md), separate keys or projects for batch and interactive traffic, and shifting offline work to off-peak hours or a provider batch API. Reading the remaining-quota headers that many providers return lets you slow down before you hit the wall instead of after.

When smoothing is not enough, you need more capacity or another path. Options include requesting a higher tier, spreading load across regions or providers, and routing overflow to a secondary model through [fallback models](./fallback-models.md) or [model routing](./model-routing.md). Whatever you choose, surface 429 counts in your [observability](./observability.md) stack so that a quota problem shows up as a quota problem, not as vague user complaints about the assistant being "down".

_Usage:_

- "We're not down, we're getting 429s. The eval run is eating the whole token quota."
- "Put the nightly backfill on its own key so it can't starve production."
- "Read the remaining-tokens header and throttle before the provider does it for us."
