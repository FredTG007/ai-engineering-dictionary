---
title: Orchestrator-Worker
description: A pattern where a planning call decides the subtasks for each request at runtime, separate calls do them, and one call merges them.
difficulty: advanced
interview: "Your report generator uses one giant prompt to research and write about ten competitors, and it keeps dropping some of them. How would you restructure it with orchestrator-worker or simpler routing patterns, and what would you monitor?"
interviewAnswer: "Covers an orchestrator that plans one subtask per competitor, parallel workers with focused context, and a synthesis step, compared with simpler routing, chaining or fan-out where the subtasks are known; plus monitoring fan-out size, per-worker failures, total tokens and whether the synthesis drops worker results."
buildThis:
  title: Build a research report generator
  goal: Use an orchestrator to break a topic into subtopics, fetch content in parallel workers, and merge results.
  steps:
    - Write an orchestrator prompt that splits a broad research topic into three subquestions.
    - Run concurrent worker calls to generate text answers for each subquestion.
    - Pass all worker outputs to a final aggregation prompt to synthesize a coherent report.
    - Test the flow with different research topics and verify coherence.
  skills:
    - Concurrency
    - Orchestration
    - Python
  time: an afternoon
  stretch: Let the orchestrator dynamically decide how many workers to spawn based on topic complexity.
---

Orchestrator-worker is a pattern with a planner at the top. One LLM call, the orchestrator, reads the request and writes a plan of subtasks; each subtask goes to its own worker call; a final step merges what the workers return. The plan is produced fresh for every request, so a question about two competitors gets two workers and a question about ten gets ten. It sits between a single prompt and a full [multi-agent](./multi-agent.md) system.

It usually solves a coverage problem. A competitive-analysis tool used one long prompt to research and summarize ten competitors, and reports regularly skipped two or three of them, or gave the last ones a single thin sentence. Splitting the job so an orchestrator listed the competitors, ten workers each researched one with a focused context, and a final call merged the results fixed the gaps. Each worker had a small, clear job, and the orchestrator's plan made missing pieces easy to spot.

Before reaching for a planner, check whether a simpler structure covers your inputs, because it often does:

| Structure | Who decides the subtasks | Fits when |
|---|---|---|
| Fixed chain | Your code, as an ordered list of steps | Every request needs the same steps |
| Routing | Your code, after a classifier picks one branch | Requests fall into a few known types |
| Fixed fan-out | Your code, as a set list of parallel calls | The split is always the same, such as one call per section |
| Orchestrator-worker | The model, per request | The number or kind of subtasks changes from one request to the next |

The first three are [workflows](./workflows-vs-agents.md), because the structure is in your code. Orchestrator-worker hands the plan to the model, which brings back some of the unpredictability of an [agent](./agent.md). Routing in particular is often confused with [model routing](./model-routing.md); one picks a handler by task type, the other picks a model by cost or difficulty, and a system can do both.

Running it in production needs the usual controls. Cap how many workers the orchestrator can create, because a bad plan with forty subtasks can multiply the bill. Run workers in parallel with timeouts so one slow call does not hold up the whole result. Record the plan and every worker's output in [tracing](./tracing.md), and check in [evals](./evals.md) that the synthesis step actually uses each worker's result instead of quietly dropping one.

_Usage:_

- "The orchestrator planned 38 subtasks for a two-line question. Cap the fan-out."
- "This doesn't need an orchestrator. It's three categories; just route it."
- "Workers run in parallel, so latency is the slowest worker plus the merge."
