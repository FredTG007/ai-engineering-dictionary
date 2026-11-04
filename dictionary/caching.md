---
title: Caching
description: Storing and reusing results of earlier LLM work, from full responses to retrieved context, to cut cost and latency.
---

Caching in LLM systems means saving the result of expensive work so the next identical or similar request can reuse it instead of paying for it again. Model calls are slow and billed per token, so even a modest hit rate can make a noticeable difference to both [latency](./latency.md) and spend. The question is always what to cache, how to decide two requests are "the same", and when a cached result has gone stale.

Several layers can be cached, and they behave differently:

| Layer | What is reused | Match rule | Main risk |
|---|---|---|---|
| Exact response cache | Full model output | Identical prompt and parameters | Low hit rate on free-form input |
| [Semantic cache](./semantic-caching.md) | Full model output | Similar meaning via [embeddings](./embeddings.md) | Returning an answer to a different question |
| [Prompt cache](./prompt-caching.md) | Processed prompt prefix at the provider | Identical leading tokens | Minimal, but only reduces input cost |
| Retrieval cache | Search results or embeddings | Identical query or document | Stale results after data changes |

Stale answers are the classic failure. An e-commerce assistant cached responses to common questions for twenty-four hours to save money. When the returns policy changed from thirty days to fourteen, the bot kept telling customers thirty for a full day, and support had to honour the old window for everyone who asked. Tying cache invalidation to content updates, or keeping time-to-live short for policy-related answers, prevents this.

Caching also interacts with personalisation and randomness. A response that includes the user's name, order status or account details must never be served to someone else, so cache keys need to include anything that changes the correct answer, or such responses should not be cached at all. If you use non-zero [temperature](./temperature.md), caching freezes one sample, which is usually fine but can surprise teams expecting variety.

Measure before and after. Track hit rate, latency on hits versus misses, cost saved and, for any fuzzy matching, how often cached answers were wrong. A cache that saves money while quietly serving incorrect answers is a net loss.

_Usage:_

- "Hit rate is 38 percent on the FAQ endpoint and basically zero on chat."
- "Bust the cache whenever the help-centre article is republished."
- "Never cache anything that has an order number in the prompt."
