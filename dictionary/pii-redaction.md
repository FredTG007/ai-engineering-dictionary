---
title: PII Redaction
description: Detecting and removing or masking personal data such as names, emails and card numbers before it reaches a model, log or store.
---

PII redaction is the process of finding personally identifiable information in text and replacing it with placeholders or removing it before that text goes somewhere it should not. In LLM systems the risky destinations are the model provider's API, your logs and [observability](./observability.md) tools, your [vector database](./vector-database.md), and any dataset you might later use for [fine-tuning](./fine-tuning.md).

The trigger is often an audit rather than an outage. A healthcare scheduling assistant had been logging full prompts and completions for debugging. A compliance review found two years of patient names, dates of birth and medication details sitting in a third-party logging tool with broad internal access. Nothing had leaked externally, but the cleanup took months and the logging contract had to be renegotiated.

Detection combines several techniques, each with blind spots:

| Method | Good at | Weak at |
|---|---|---|
| Regex and checksums | Card numbers, emails, phone formats | Names, addresses, free-form context |
| Named-entity models | Names, locations, organisations | Unusual formats, domain-specific IDs |
| LLM-based detection | Contextual cases like "my daughter Emma" | Cost, latency, consistency |

A common pattern is reversible redaction. You replace "Jane Doe, jane@example.com" with "[PERSON_1], [EMAIL_1]", send the masked text to the model, and swap the real values back into the response before showing it to the user. The mapping lives only in memory for that request. This keeps the model useful while ensuring the provider and your logs never see raw data.

Redaction has costs. Aggressive masking can strip context the model needs, so a support bot that cannot see an order number may [hallucinate](./hallucination.md) one. False negatives are the bigger worry, so treat redaction as one of several [guardrails](./guardrails.md), and test it with realistic, messy input such as typos, mixed languages and numbers split across lines.

_Usage:_

- "Redact before the trace exporter, not after; the raw prompt was already in the logs."
- "The NER model missed every Ghanaian surname in the test set."
- "We restore the placeholders on the way out so the customer still sees their own name."
