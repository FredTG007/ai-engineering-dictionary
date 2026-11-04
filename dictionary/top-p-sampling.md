---
title: Top-p Sampling
description: A sampling method that limits each next-token choice to the smallest set of tokens whose probabilities add up to p.
---

Top-p sampling, also called nucleus sampling, restricts which tokens the model is allowed to pick at each step. The model ranks every candidate [token](./tokens.md) by probability, then keeps only the top ones until their combined probability reaches the threshold p. Sampling happens within that shortlist. With p set to 0.9, the long tail of unlikely tokens making up the last 10 percent is discarded.

The point is to cut off nonsense without forcing the model to always take the single most likely word. When the model is confident, the nucleus might contain one or two tokens; when it is uncertain, it might contain dozens. That adaptive behavior is what distinguishes top-p from top-k, which keeps a fixed number of candidates regardless of confidence.

Top-p and [temperature](./temperature.md) both control randomness, and changing both at once makes behavior hard to reason about. Temperature reshapes the probabilities; top-p then trims the list. A team debugging odd word choices in generated product descriptions found that someone had set temperature to 1.3 and top-p to 0.5 in an attempt to make copy "creative but safe". The two settings fought each other, producing text that was oddly repetitive in some places and bizarre in others. Resetting top-p to 1.0 and tuning only temperature gave predictable results.

For most production work, leave top-p at the provider's default and adjust temperature if you need to. Reach for top-p when you see rare, off-topic tokens slipping into otherwise sensible output, such as random foreign words or broken formatting in long generations. Some providers and newer models restrict or ignore these parameters, so check the API documentation for the [LLM](./llm.md) you call.

Neither setting addresses accuracy. If outputs contain a [hallucination](./hallucination.md), the usual cause is missing or misleading context, and the fix is in the [prompt](./prompt.md) or retrieval, not the sampler.

_Usage:_

- "Don't touch top-p and temperature together, pick one."
- "We dropped top-p to 0.95 and the random Cyrillic tokens disappeared."
- "Top-p is at the default, the weirdness is coming from the prompt."
