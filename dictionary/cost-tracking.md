---
title: Cost Tracking
description: Measuring and attributing LLM spend per request, feature, user and model so you can see where money goes and control it.
difficulty: beginner
interview: "Your monthly LLM bill went from about 4k to 31k dollars with flat user growth. How do you find the cause and stop it happening again?"
interviewAnswer: "Covers logging per call the model, input, output and cached tokens and computed cost, tagged by feature, tenant and trace ID, drilling from costly features to requests, and levers like trimming context, model routing, caching, output caps, per-user budgets and watching reasoning tokens."
---

Cost tracking is the practice of recording what each LLM call costs and attributing that spend to the features, customers and workflows that caused it. Model providers bill by [tokens](./tokens.md), with different prices for input and output and for each model, so the cost of a request depends on prompt length, response length, model choice and how many calls a workflow makes. A monthly invoice tells you the total; cost tracking tells you why.

The usual wake-up call is a bill. A startup's monthly LLM spend jumped from roughly four thousand dollars to thirty-one thousand with no matching growth in users. It took a week to find the cause because nothing recorded cost per feature. Eventually they traced it to a new "summarize this thread" button that sent the entire conversation history, sometimes eighty thousand tokens, to their largest model every time it was clicked, and a handful of power users clicked it constantly.

A useful setup records, per model call, the model, input tokens, output tokens, cached tokens and computed cost, tagged with the feature, user or tenant, and trace ID. That lets you answer questions such as which feature costs most per active user, which customers are unprofitable, and whether a prompt change made requests more expensive. Tying this to [tracing](./tracing.md) means you can drill from an expensive feature down to individual requests.

Once you can see costs, the levers become clear. Common ones include trimming prompts and retrieved context, moving simple tasks to cheaper models through [model routing](./model-routing.md), using [prompt caching](./prompt-caching.md) for repeated prefixes, adding response [caching](./caching.md), capping output length, and setting per-user budgets. [Reasoning models](./reasoning-models.md) deserve special attention, since their hidden thinking tokens are billed as output and can multiply cost without any visible change in response length.

Track cost as a first-class metric alongside latency and quality. A change that improves answer quality by one percent but doubles cost per request is a business decision, and it should be made knowingly.

_Usage:_

- "That one enterprise tenant is costing us more in tokens than they pay in subscription."
- "Tag every call with the feature name or we'll be guessing again next month."
- "The new prompt is better, but it's 40 percent more expensive per conversation."
