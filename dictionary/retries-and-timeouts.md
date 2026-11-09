---
title: Retries and Timeouts
description: Rules for how long to wait on a model call and when to try again, so slow or failed requests don't hang or cascade.
difficulty: intermediate
interview: "When your LLM provider degraded, your entire web app stopped responding, including pages that never call the model. How would you redesign timeouts and retries?"
interviewAnswer: "Covers replacing long library-default timeouts, a short time-to-first-token limit plus a longer total limit for streaming, retrying 429 and 5xx with exponential backoff and jitter but not 400s, retry budgets, isolating LLM worker pools, idempotent tools and fallback models."
buildThis:
  title: Build a resilient API wrapper with retries and timeouts
  goal: Write a Python client wrapper that safely handles rate limits, network timeouts, and transient server errors.
  steps:
    - Write a wrapper function around an LLM API call that enforces a hard timeout limit.
    - Implement exponential backoff logic to catch rate limit errors and wait before trying again.
    - Add a maximum retry count to stop infinite loops when the API is completely down.
    - Test your wrapper by mocking network failures and verifying it recovers cleanly.
  skills:
    - Production
    - Error Handling
    - Python
  time: under an hour
  stretch: Add a fallback mechanism that switches to a secondary backup model provider if the primary provider fails all retries.
---

Retries and timeouts decide what your application does when a model call is slow or fails. A timeout sets the maximum time you will wait before giving up; a retry policy decides which failures are worth trying again, how many times, and with what delay. LLM calls fail more often and vary in duration more than typical API calls, so these settings matter more than usual.

The default settings are often the problem. One team's chat endpoint had an HTTP client timeout of ten minutes inherited from a library default. When the provider degraded, requests piled up, worker threads were exhausted, and the whole web app stopped responding, including pages that never called the model. A 30-second timeout and a small worker pool for LLM calls would have contained the damage to one feature.

Choosing a timeout for generation is tricky because duration depends on output length. A request that produces 2,000 tokens legitimately takes much longer than one that produces 50. With [streaming](./streaming.md), it helps to use two limits: a short timeout on [time to first token](./time-to-first-token.md), which catches stuck requests quickly, and a longer overall limit for the full response. [Reasoning models](./reasoning-models.md) need more generous budgets because they may think for a while before emitting anything.

| Failure | Retry? | Notes |
|---|---|---|
| 429 rate limited | Yes, with backoff | Respect any retry-after header |
| 500/503 server error | Yes, a few times | Use jitter to avoid synchronized retries |
| Timeout | Usually once | Then fail over or give up |
| 400 bad request | No | Fix the input; retrying wastes money |
| Invalid structured output | Sometimes | Retry with the validation error in the prompt |

Retries can multiply cost and load if you are careless. Exponential backoff with jitter prevents every client from retrying at the same instant after a blip, and a retry budget caps total attempts so a bad minute does not turn into a self-inflicted outage against your own [rate limits](./rate-limits.md). Be careful retrying calls in an [agent loop](./agent-loop.md) that already triggered side effects through [tool calling](./tool-calling.md); make those tools idempotent first. After retries are exhausted, a [fallback model](./fallback-models.md) is often a better next step than another attempt.

_Usage:_

- "Set a five-second timeout on first token and fail over if nothing arrives."
- "Don't retry 400s, it's the same broken JSON every time and we pay for each one."
- "Add jitter to the backoff; all the pods retried in lockstep and hammered the API again."
