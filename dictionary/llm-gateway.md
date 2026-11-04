---
title: LLM Gateway
description: A proxy between your services and model providers that centralizes keys, routing, limits, logging, caching and cost tracking.
difficulty: intermediate
interview: "Five teams call three model providers directly with their own keys, and finance cannot explain a doubled bill. How would you introduce an LLM gateway, and what would you be careful not to break?"
interviewAnswer: "Covers a single proxy that holds provider keys, tags each request by team and feature for cost tracking, enforces quotas and rate limits, handles retries and fallbacks, and logs requests with PII controls; plus the gateway's added latency, streaming support, and avoiding a single point of failure."
---

An LLM gateway is a service that sits between your applications and the model providers they call. Instead of every team holding its own API keys and calling providers directly, all traffic goes through one proxy that handles authentication, routing, limits, logging and billing data in one place. Applications usually talk to it through one common API, so switching providers becomes a configuration change.

The need usually becomes obvious after a bill nobody can explain. One company had five teams calling three providers with keys pasted into separate services. The monthly bill doubled, and finance asked who was responsible. Nobody could say, because no request carried a team or feature tag. A batch job had been retrying failed calls in a tight loop for a week. After the gateway went in, every request carried a team and feature tag, per-team budgets triggered alerts, and the next runaway job was throttled within minutes.

Typical responsibilities:

| Concern | What the gateway does |
|---|---|
| Keys and access | Holds provider keys; services get scoped internal tokens |
| [Cost tracking](./cost-tracking.md) | Tags requests by team, feature and model |
| [Rate limits](./rate-limits.md) | Per-team quotas, shared provider limits |
| Reliability | [Retries and timeouts](./retries-and-timeouts.md), [fallback models](./fallback-models.md) |
| Routing | Sends requests to models by rule, as in [model routing](./model-routing.md) |
| [Caching](./caching.md) | Exact-match response caching; semantic caching only with a tuned similarity threshold, since a near match can return the wrong answer |
| [Observability](./observability.md) | Central logs and traces, with [PII redaction](./pii-redaction.md) |

The gateway becomes critical infrastructure, so it has to be built like it. It adds a network hop to every call, which matters for [time to first token](./time-to-first-token.md), and it must pass [streaming](./streaming.md) responses through without buffering them. If it goes down, every LLM feature goes down with it, so it needs redundancy and health checks like any other shared service.

Keep it thin. A gateway that rewrites prompts or adds business logic turns into a bottleneck every team has to queue behind. The parts that belong there are the cross-cutting ones: identity, limits, routing, logging and spend.

_Usage:_

- "Route it through the gateway or finance will never know which feature it was."
- "The gateway was buffering the stream, so TTFT jumped by two seconds."
- "Swapping providers was a config change at the gateway; no service redeploys."
