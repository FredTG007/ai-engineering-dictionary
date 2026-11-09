---
title: Tracing
description: Recording every step behind one LLM request, such as model calls, retrievals and tool calls, as a timed tree of spans.
difficulty: intermediate
interview: "Your agent's p95 latency climbed from four to eleven seconds and the dashboards only show that it is slow. How would you use tracing to find the cause?"
interviewAnswer: "Covers a span tree per request for model calls, retrievals and tool calls with durations and token counts, opening slow traces to spot repeated tool calls or slow rerankers, propagating trace IDs across services, and tagging prompt version and model on spans."
buildThis:
  title: Build a lightweight request tracer
  goal: Write a Python wrapper that logs timing, inputs, and outputs of nested function calls to a local SQLite database.
  steps:
    - Create a SQLite table to store span names, start times, durations, and payloads.
    - Write a context manager or decorator that measures elapsed time for any block of code.
    - Wrap a multi-step LLM workflow with your decorator to capture inner steps.
    - Query the database to print a formatted execution tree of a run.
  skills:
    - Python
    - SQLite
    - Logging
  time: an afternoon
  stretch: Render the recorded execution traces as an interactive collapsible tree view in a local HTML page.
---

Tracing captures everything that happened while serving one request as a connected tree of spans. The root span is the user's request; child spans are each model call, retrieval, reranking step, tool call and guardrail check it triggered, each with its own start time, duration, inputs, outputs and metadata like token counts. It is the most useful single tool in LLM [observability](./observability.md).

Its value is clearest in multi-step systems. An [agent](./agent.md) that answers a question by calling search three times, reading two documents and calling a calculator generates a dozen operations. When the final answer is wrong, a flat log shows you a pile of unrelated lines. A trace shows you the sequence: which search query the model wrote, what came back, and where the reasoning went off course.

Tracing is also how you find latency problems. A team noticed their assistant's p95 [latency](./latency.md) had climbed from four seconds to eleven. Aggregate metrics only told them it was slow. Opening a few slow traces showed the [agent loop](./agent-loop.md) occasionally calling the same lookup tool five or six times in a row because a tool error message was ambiguous. Clarifying the error text fixed the loop and the p95 fell back to normal.

A few practices make traces far more useful:

- Attach the prompt version, model name and parameters to every LLM span.
- Propagate one trace ID across services, queues and [multi-agent](./multi-agent.md) handoffs so the tree stays connected.
- Record token counts and computed cost per span for [cost tracking](./cost-tracking.md).
- Link user feedback and eval scores back to the trace that produced the response.

Many teams build on OpenTelemetry-style conventions so LLM traces sit alongside their existing service traces. Whatever tooling you choose, make it easy to go from a user complaint to the exact trace in a few clicks, because that path is used constantly during debugging.

_Usage:_

- "The trace shows the reranker took 1.8 seconds on its own; that's our whole regression."
- "Every handoff between agents was starting a new trace, so we couldn't follow the request."
- "Click into the span and you'll see the tool returned an empty list, not an error."
