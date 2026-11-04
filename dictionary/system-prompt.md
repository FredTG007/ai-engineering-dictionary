---
title: System Prompt
description: The standing instructions placed before a conversation that set a model's role, rules, tone and output format for every turn.
---

A system prompt is a block of instructions that sits at the start of every request and frames how the model should behave. It typically defines the assistant's role, the rules it must follow, the tone, the output format and how to handle edge cases. Most chat APIs give it a dedicated slot separate from user messages, and models are trained to give it more weight.

The system prompt is where product decisions become model behavior. If the bot must never discuss pricing, always answer in the user's language, or refuse to give medical advice, those rules start here. One retail team discovered their assistant was happily recommending competitors' products because nothing in the system prompt told it otherwise. A single line fixed it, but only after a screenshot circulated internally.

It is not a security boundary. Users can often get a model to reveal or ignore its system prompt through [jailbreak](./jailbreak.md) attempts or [prompt injection](./prompt-injection.md) hidden in documents. Do not put secrets, API keys or internal URLs in it, and do not rely on it alone to block harmful actions. Enforce critical rules in code with [guardrails](./guardrails.md) and permission checks.

System prompts tend to grow over time as each incident adds another rule. A prompt that started at 200 words can reach 3,000, with contradictory instructions and rules nobody remembers adding. Long system prompts cost [tokens](./tokens.md) on every call and can dilute the instructions that matter. Review them periodically, delete rules that evals show are unnecessary, and keep the most important constraints near the top.

Because the system prompt is usually identical across requests, it is a good candidate for [prompt caching](./prompt-caching.md), which can cut both cost and latency for the repeated prefix.

_Usage:_

- "Put the refusal rule in the system prompt and add an eval for it."
- "Our system prompt is 4k tokens of accumulated incident fixes."
- "Assume the system prompt will leak, so nothing secret goes in there."
