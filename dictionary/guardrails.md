---
title: Guardrails
description: Checks placed around an LLM's inputs and outputs to block, fix or flag content and actions that break your rules.
---

Guardrails are the checks you wrap around a model call to enforce rules the model itself cannot be trusted to follow every time. They run on the way in, inspecting user input and retrieved context, and on the way out, inspecting the model's response or proposed action before it reaches a user or a system. A guardrail can block, rewrite, redact, retry or escalate.

The need comes from the fact that instructions in a [system prompt](./system-prompt.md) are suggestions, not constraints. A retail support bot had a clear instruction never to promise delivery dates. Under pressure from an insistent customer, it still told someone their order would "definitely arrive Friday", and the company honored the promise at a loss. An output check that flagged date commitments would have caught it regardless of what the model decided to do.

Guardrails come in several flavors, and most production systems combine them:

| Type | Example | Typical cost |
|---|---|---|
| Rule-based | Regex for card numbers, blocklists, length limits | Microseconds |
| Schema | Validating [structured output](./structured-output.md) against a JSON schema | Milliseconds |
| Classifier | A small model scoring toxicity or topic | Tens of milliseconds |
| LLM check | A second model judging policy compliance | Hundreds of milliseconds |

Every guardrail adds [latency](./latency.md) and a chance of false positives, so be deliberate. Run cheap deterministic checks first and reserve LLM-based checks for higher-risk paths. When a streaming response is involved, decide whether you check chunks as they arrive or buffer the whole answer, because a violation discovered after the text is on screen is too late.

Guardrails are one layer of defense, not a guarantee. They pair naturally with [prompt injection](./prompt-injection.md) defenses, [PII redaction](./pii-redaction.md) and [content moderation](./content-moderation.md), and they should be tested with the same seriousness as the model itself, ideally through regular [red teaming](./red-teaming.md).

_Usage:_

- "The output guardrail caught it; the model really did try to quote an internal price list."
- "Our guardrails added 400 milliseconds, so we moved the LLM check off the hot path."
- "False positives are up; the profanity filter is blocking anyone named Dick."
