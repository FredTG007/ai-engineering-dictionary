---
title: Structured Output
description: Getting a model to return data in a fixed machine-readable shape, such as JSON matching a schema, instead of free text.
difficulty: intermediate
interview: "About 2% of your extraction responses fail JSON parsing and crash a downstream job. How would you make the output reliable?"
interviewAnswer: "Covers provider JSON or schema-constrained modes and tool schemas, validating every response against the schema, bounded retries with the error fed back, and safe fallbacks. Notes that valid JSON can still hold wrong values, so field-level checks and evals still matter."
buildThis:
  title: Build an invoice data extractor
  goal: Extract vendor names, dates, and line items from messy invoices into a strict JSON schema.
  steps:
    - Define a Pydantic model representing the expected schema for the invoice data.
    - Configure an LLM client to enforce structured output using the Pydantic schema.
    - Write a script that sends sample invoice text to the model.
    - Validate that the returned JSON matches the required schema without parsing errors.
  skills:
    - Python
    - Pydantic
    - JSON Schema
  time: under an hour
  stretch: Handle schema validation failures gracefully by feeding the error back to the model for self-correction.
---

Structured output means constraining a model to produce data your code can parse reliably, usually JSON that matches a defined schema. Instead of asking for a paragraph and scraping it with regular expressions, you specify the fields, types and allowed values, and the model fills them in. Many APIs now support this natively, either through a JSON mode or by enforcing a schema during generation.

The need becomes obvious the first time a parser breaks in production. One team's order-extraction service worked in testing, then started throwing exceptions on about 2 percent of real emails. The model sometimes wrapped the JSON in a markdown code fence, sometimes added a friendly sentence before it, and occasionally returned "quantity": "two" instead of a number. Switching to schema-enforced output removed the parse failures entirely.

Valid shape is not the same as correct content. A schema guarantees that "refund_amount" is a number; it does not guarantee the number is right. Models under a strict schema can still invent values to fill required fields, which is a quiet form of [hallucination](./hallucination.md). Make fields optional or nullable when the information may be missing, add an explicit "unknown" option to enums, and check accuracy with [evals](./evals.md) rather than trusting that parsing succeeded.

Schema design affects quality. Clear field names and short descriptions act like instructions. Putting a reasoning field before the answer field gives the model room for [chain-of-thought](./chain-of-thought.md) inside the structure. Deeply nested schemas with dozens of fields tend to degrade accuracy; splitting one large extraction into two smaller calls often works better.

Structured output is also the foundation of [tool calling](./tool-calling.md). When a model decides to call a tool, it is producing arguments that must match a [function schema](./function-schema.md), and the same rules about clear names, nullable fields and validation apply.

_Usage:_

- "Turn on schema enforcement, I'm done stripping code fences."
- "The JSON parses fine, the values are just wrong."
- "Make that field nullable or it'll invent a date every time."
