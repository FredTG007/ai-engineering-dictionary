---
title: Fallback Models
description: A backup model or provider your system switches to when the primary model errors, times out, or is rate limited.
difficulty: intermediate
interview: "You are adding a second provider as a fallback after an outage. What would you do so the fallback actually works when the primary fails?"
interviewAnswer: "Covers defining triggers such as exhausted retries, repeated 5xx or long 429 waits, per-model prompt variants for format and tool-schema differences, running each fallback through evals, logging which model served each request, and weighing same-region versus cross-provider options."
buildThis:
  title: Implement an automatic retry and fallback proxy
  goal: Write a client wrapper that catches API rate limits and errors, switching to a backup model automatically.
  steps:
    - Write a function that calls your primary model provider.
    - Wrap the call in a try-except block that catches timeout and rate-limit errors.
    - Route the request to a cheaper backup model if the primary call fails.
  skills:
    - Error Handling
    - API Design
    - Resilience
  time: an afternoon
  stretch: Add exponential backoff delays before triggering the fallback model.
---

A fallback model is a second option your system uses when the first one cannot answer. If the primary model returns errors, times out, or hits [rate limits](./rate-limits.md), the request is resent to a different model, a different region, or a different provider. The goal is to keep the feature working, possibly at slightly lower quality, rather than showing users an error page.

Teams usually add fallbacks after a single-provider outage. A meeting-notes product we worked on went dark for 90 minutes when its only provider had an incident; customers saw spinners and then blank summaries. The fix was a simple chain: primary model, then the same model in another region, then a smaller model from a second provider. The next incident caused a brief quality dip instead of an outage.

Fallbacks are not free substitutes, because models differ in behavior. A prompt tuned for one model may produce different formatting, refuse more often, or break [structured output](./structured-output.md) parsing on another. Function schemas for [tool calling](./tool-calling.md) can be interpreted differently too. Each model in the chain needs its own prompt variant where necessary and its own pass through your [evals](./evals.md), or the fallback will fail at exactly the moment you need it.

| Fallback target | Pros | Cons |
|---|---|---|
| Same model, other region | Identical behavior | Shares provider-wide outages |
| Smaller model, same provider | Cheap, fast | Lower quality; same outages |
| Comparable model, other provider | Survives provider incidents | Prompt and format drift |
| Cached or canned response | Always available | Not a real answer |

Decide clearly what triggers a fallback and log every switch. Typical triggers are a timeout after the policy in [retries and timeouts](./retries-and-timeouts.md) is exhausted, repeated 5xx errors, or a 429 that would take too long to wait out. Recording which model actually served each request in your [tracing](./tracing.md) is essential; otherwise a quality complaint can't be traced to the fact that half the traffic quietly ran on the backup all afternoon. Fallbacks are a reliability tool, while [model routing](./model-routing.md) picks models up front for cost or quality.

_Usage:_

- "We were on the fallback for two hours and nobody noticed until the JSON parse errors showed up."
- "Run the eval suite against the backup model too, not just the primary."
- "Fail over after one timeout; a second retry just doubles the wait."
