---
title: Workflows vs Agents
description: The design choice between code that fixes the sequence of LLM calls and a model that decides its own next step at runtime.
difficulty: intermediate
interview: "A team built a fully autonomous agent to triage support tickets, and it is slow, expensive and hard to debug, yet the tickets follow about five known paths. What would you recommend, and when would an agent still be the right call?"
interviewAnswer: "Covers replacing the agent with a workflow of fixed steps, such as classify then route then draft, because the paths are known, which makes cost, latency and testing predictable, and keeping agentic steps only where the number or order of steps truly cannot be known ahead of time."
buildThis:
  title: Compare a scripted pipeline to a loop-based agent
  goal: Build a fixed multi-step text summarizer, then refactor it into an agent that decides when to stop.
  steps:
    - Write a Python script that chains two prompts together in a fixed sequence for summarization.
    - "Add a conditional router step to the script based on the model's first output."
    - Convert the structure into a dynamic loop where the LLM decides its own next tool call.
    - Compare the predictability, token cost, and failure modes of both approaches.
  skills:
    - Pipeline Design
    - Control Flow
    - State Management
    - Evaluation
  time: an afternoon
  stretch: Log the exact prompt tokens and execution time for both designs across fifty test inputs to find the cost-reliability tradeoff.
---

A workflow is a system where your code decides the order of LLM calls and tools, while an [agent](./agent.md) is a system where the model decides what to do next at runtime. Both use the same parts: prompts, [tool calling](./tool-calling.md) and [structured output](./structured-output.md). The difference is who holds the control flow, and that choice shapes cost, [latency](./latency.md) and how easy the system is to test.

Teams often start with an agent when a workflow would have done the job. One support team gave a model a dozen tools and the instruction "resolve the ticket". It worked in demos, but in production each ticket took eight to fifteen model calls, the p95 was over a minute, and no two runs of the same ticket looked alike. When they looked at the logs, almost every ticket followed one of five paths: refund, shipping status, password reset, bug report or escalation. Rebuilding it as a workflow (classify, route to one of five fixed handlers, draft a reply) cut cost by roughly 70 percent and made every path testable with ordinary [evals](./evals.md).

| | Workflow | Agent |
|---|---|---|
| Who picks the next step | Your code | The model |
| Cost and latency | Predictable | Varies per run |
| Testing | Each step on its own | Whole trajectories |
| Good fit | Known paths, high volume | Open-ended tasks with unknown steps |
| Main risk | Rigid when an input does not fit | Loops, drift, surprising actions |

The choice is a spectrum, not a binary. Most production systems are workflows with one or two agentic steps inside, for example a fixed pipeline that hands an open-ended research step to a small [agent loop](./agent-loop.md) with a step limit. Patterns like routing and [orchestrator-worker](./orchestrator-worker.md) sit between the two ends.

A useful rule is to let production logs make the case: begin with fixed steps, and hand the model control only over the kinds of input the fixed path keeps getting wrong. Autonomy is something you pay for in tokens, time and debugging effort, so it should earn its place.

_Usage:_

- "Ninety percent of tickets take the same five paths. That's a workflow, not an agent."
- "Keep the pipeline fixed and let the agent loose only on the research step."
- "We can't write a regression test for 'whatever the agent felt like doing'."
