---
title: Model Routing
description: Sending each request to the model best suited to it, so easy tasks use cheap fast models and hard ones get stronger models.
difficulty: intermediate
interview: "Most of your traffic is simple FAQ questions, yet every request goes to your most expensive model. How would you design a router, and how would you know it works?"
interviewAnswer: "Covers routing by rules or a small classifier, sending easy requests to a cheap fast model and escalating hard or low-confidence ones. Measures quality per route on an eval set, cost and latency savings, misroute rates, and adds fallbacks when a provider fails."
---

Model routing is the practice of choosing which model handles a request based on what the request needs. Instead of sending everything to one large model, a router inspects each call and directs it to a small, cheap model, a large capable model, or a specialist, depending on difficulty, task type, or customer tier. It is primarily a cost and [latency](./latency.md) tool, not a reliability mechanism.

The usual trigger is a bill dominated by work that did not need a frontier model. One internal assistant we audited sent every message, including "thanks" and "what's the status of ticket 4821", to the most expensive model available. Over 60% of traffic was simple lookups or small talk. Routing those to a small model cut monthly spend by more than half, and the median response got faster because the small model generated tokens more quickly.

Routers come in a few shapes, and simpler is usually better. Rule-based routing uses obvious signals: the endpoint called, the length of the input, whether tools are required, or the user's plan. Classifier-based routing runs a cheap model or a lightweight classifier that labels each request as easy or hard before dispatch. Cascade routing tries the small model first and escalates if a confidence check or a validator rejects the answer. Each step up adds complexity and its own failure modes, so start with rules and only add a classifier when the rules clearly miss.

Routing decisions have to be measured, not assumed. A router that misjudges difficulty sends hard questions to a weak model, and users experience that as random drops in quality, which is hard to debug. Build [evals](./evals.md) per route, using a [golden dataset](./golden-dataset.md) that covers each category, and log the chosen model on every request in your [tracing](./tracing.md) so you can slice quality and cost by route. [LLM-as-judge](./llm-as-judge.md) scoring on sampled production traffic is a practical way to catch misroutes.

Routing is related to, but distinct from, [fallback models](./fallback-models.md). Routing picks a model before the call based on the request; fallbacks switch models after a failure. Many systems use both: a router chooses the primary for each request, and a fallback chain sits behind it for outages.

_Usage:_

- "Route anything without tool calls to the small model and see if CSAT moves."
- "The router sent a contract-review question to the cheap tier, that's where the bad answer came from."
- "Log the route on every trace so we can compare cost per category."
