---
title: Guardrails
description: Checks placed around an LLM's inputs and outputs to block, fix or flag content and actions that break your rules.
difficulty: beginner
interview: "Your support bot promised a customer a delivery date despite a system prompt telling it never to. What guardrails would you add and where in the request path?"
interviewAnswer: "Covers why prompt instructions are not enforcement, input and output checks that block, rewrite or escalate, layering cheap rule and schema checks before classifiers or LLM judges, latency and false-positive costs, and how streaming affects when output can be checked."
buildThis:
  title: Build an Input and Output Safety Filter
  goal: Intercept malicious user prompts and toxic model outputs before they reach the user.
  steps:
    - Write a lightweight keyword and regex check to flag prompt injections and common attacks.
    - Implement a secondary classifier call using a small model to check for toxic language.
    - Wrap your main LLM application logic inside a pipeline that runs these checks before and after.
    - Return a polite refusal message whenever a guardrail trips.
  skills:
    - Guardrails
    - Safety
    - Content Moderation
  time: an afternoon
  stretch: Log all blocked prompts and responses to a local SQLite database for auditing.
---

Guardrails are the checks you wrap around a model call to enforce rules the model itself cannot be trusted to follow every time. They run on the way in, inspecting user input and retrieved context, and on the way out, with [output filtering](./output-filtering.md) of the model's response or proposed action before it reaches a user or a system. For agents, [allowlisting](./allowlisting.md) the tools and destinations each task may touch is the same idea applied to actions. A guardrail can block, rewrite, redact, retry or escalate.

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
