---
title: Reflection / Self-Critique
description: A second pass where the model grades its own draft against explicit rules or tests, then revises before anyone sees it.
difficulty: intermediate
interview: "Your coding agent has a 'self-review' step, yet it approves every draft and the bug rate has not moved. Why is reflection failing here and what would make it earn its cost?"
interviewAnswer: "Covers that reflection only works against checkable criteria: a rubric, failing tests or tool output, not a vague 'look for problems' prompt. Describes feeding real test results into the critique, limiting the number of revision rounds, and measuring the lift on evals against the doubled token cost."
buildThis:
  title: Build a draft-critique-revise loop with a rubric
  goal: Generate an answer, score it against a written rubric with a second model call, and revise only when a criterion fails.
  steps:
    - Write a five-item rubric for a task such as summarising a support ticket, each item a yes or no question.
    - Generate a draft, then ask the model to score the draft against the rubric and return JSON with a reason per item.
    - If any item fails, send the draft and the failed items back for one revision.
    - Run twenty inputs with and without the loop and compare rubric pass rates and token cost.
  skills:
    - prompt design
    - JSON
    - evals
    - Python
  time: an afternoon
  stretch: Replace the rubric score with the output of real unit tests for a small coding task and see whether the revision rate changes.
---

Reflection is a deliberate second pass in which the model reviews a draft it just produced, checks it against stated criteria, and revises before the result reaches the user. The critic can be the same model with a different prompt, a separate model, or a tool such as a test runner whose output is fed back. The draft, the critique and the revision all happen inside the [agent loop](./agent-loop.md); the user only sees the final version.

Reflection helps when the criteria are checkable. A critique that says "verify every number against the source table" or "run the tests and fix any failure" gives the model something concrete to do. A critique that says "look for problems" mostly produces confident approval, because the same model that made the mistake usually cannot see it without new evidence. This is the same limitation that makes [chain-of-thought](./chain-of-thought.md) useful for structured problems and weak for open-ended judgement.

The failure story is a review step that never rejects. One team added a "self-review" stage to their coding agent and watched its approval rate sit at 100 percent for a month while the bug rate on merged changes did not move. The review prompt asked the model to check its work for errors; the model found none. Replacing that with a step that ran the project's tests and handed the failing output back to the model cut the escaped-bug count on their [evals](./evals.md) by about 40 percent, at roughly double the tokens per task.

| Critique input | Typical result |
|---|---|
| "Check your work" | Rubber stamp |
| A written rubric with yes/no items | Catches format and policy misses |
| Tool output: tests, linters, schema validators | Catches real defects |
| A different model as critic | Catches some blind spots, adds cost and latency |

Treat reflection as a cost decision. Every round is at least one extra model call, so cap the number of revisions and measure the improvement with [rubric design](./rubric-design.md) that matches what the critic checks. Using an [LLM as judge](./llm-as-judge.md) inside the loop is reflection with a separate critic, and it inherits all of the judge's biases. The pattern appears again in [agentic RAG](./agentic-rag.md), where the model critiques retrieved context and decides whether to search again, and the same rule applies: it earns its cost only when the critique has something real to check against.

_Usage:_

- "Self-review approved every draft for a month. Give it the failing tests instead."
- "Cap reflection at two rounds, or the p95 doubles for nothing."
- "The critic model keeps flagging tone while missing the wrong refund amount. Fix the rubric."
