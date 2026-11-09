---
title: Observability
description: The ability to understand what an LLM system is doing in production from its logs, traces, metrics and recorded outputs.
difficulty: beginner
interview: "A customer reports the assistant gave a wrong answer yesterday afternoon. What would your observability setup need to let you find out why?"
interviewAnswer: "Covers traces per request linking the exact prompt, prompt and model versions, retrieved context, tool calls and output, plus token counts, latency and cost. Mentions searchable logs with privacy controls, quality metrics and user feedback tied to the same trace ID."
buildThis:
  title: Build an LLM call logger and tracer
  goal: Capture prompt tokens, latency, costs, and outputs for every LLM interaction in a local dashboard.
  steps:
    - Write a wrapper function around your LLM calls to measure execution time and token usage.
    - Store each trace record in a local SQLite database with a unique run ID.
    - Build a minimal web view using Streamlit to display recent traces and costs.
    - Trigger errors deliberately to confirm exception traces are recorded correctly.
  skills:
    - Streamlit
    - Logging
    - Tracing
  time: an afternoon
  stretch: Add nested span tracing so you can inspect individual steps inside multi-step workflows.
---

Observability is how well you can answer "what happened and why" about your LLM system after the fact, using the data it emits. For traditional services that means logs, metrics and traces. For LLM applications it also means capturing the actual prompts, retrieved context, model responses, tool calls, token counts and user feedback, because the interesting failures are usually about content, not crashes.

The gap becomes painful the first time a user reports a bad answer. A legal research assistant told a lawyer that a statute had been repealed when it had not. The team could see the request in their API logs, with a 200 status and 3.1 seconds of latency, but not the prompt that was sent, which documents [RAG](./rag.md) had retrieved, or which [prompt version](./prompt-versioning.md) was live. Reproducing the answer took two days of guessing. After they started recording full request context, similar reports took minutes to diagnose: the retriever had pulled an outdated document.

Good LLM observability usually covers several layers:

- **Request content:** prompts, completions and retrieved chunks, with [PII redaction](./pii-redaction.md) applied before storage.
- **Structure:** a [trace](./tracing.md) linking each user request to every model call, retrieval and tool call it triggered.
- **Operational metrics:** [latency](./latency.md), time to first token, error rates and token usage.
- **Quality signals:** thumbs-up and thumbs-down ratings, escalations, guardrail triggers and online eval scores.
- **Cost:** spend per request, feature and customer, which feeds [cost tracking](./cost-tracking.md).

Observability is also the foundation for improving quality. Production traces are the best source of real failure cases for your [evals](./evals.md), and patterns in quality metrics are often the first sign of drift after a model update or a change in user behavior.

Storing full content has costs and risks. Prompt and completion logs can be large, and they may contain sensitive data, so set retention limits, control access, and sample high-volume, low-risk traffic rather than keeping everything forever.

_Usage:_

- "We had 200s across the board while the bot was confidently answering in the wrong language."
- "Pull the trace for that ticket; I want to see what the retriever actually returned."
- "Log the prompt version with every request or we'll never untangle this."
