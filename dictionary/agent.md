---
title: Agent
description: An LLM system that decides its own next steps, calling tools and reacting to results in a loop until a task is done.
difficulty: beginner
interview: "Product wants an agent to resolve refund tickets end to end. How do you decide whether it should be an agent or a fixed workflow, and what controls would you require?"
interviewAnswer: "Covers using an agent only when steps cannot be known in advance, preferring workflows for predictable paths, and controls such as step and token caps, least-privilege tools, human approval for irreversible actions like refunds, step logging, and evaluating path as well as outcome."
---

An agent is an LLM-based system that decides for itself what to do next in pursuit of a goal, typically by choosing tools to call, observing the results, and repeating until it judges the task complete. The defining feature is that the model controls the sequence of steps, rather than following a fixed path written in code.

The distinction matters because it changes how a system fails. A fixed workflow that classifies a ticket, retrieves an article and drafts a reply fails in predictable places. An agent given the same job plus access to a refund API might decide to issue a refund it was never meant to, or loop for 40 steps searching for an order that does not exist. One team found a single stuck conversation had made over 200 model calls before a timeout killed it, and their daily spend spiked accordingly.

An agent is built from a few parts working together:

| Part | Role |
|---|---|
| Model | Reads the situation and picks the next action |
| Tools | Functions the model can invoke, through [tool calling](./tool-calling.md) |
| Loop | Code that runs the model, executes tools and feeds results back, the [agent loop](./agent-loop.md) |
| State | Conversation, intermediate results and [memory](./memory.md) |
| Limits | Step caps, budgets, permissions and approval gates |

Use an agent when the path genuinely cannot be known in advance. Research tasks, debugging, and multi-system lookups where the next step depends on what the previous one found are good fits. When the steps are known, a plain workflow is cheaper, faster and easier to test, even if each step uses a model. Many production systems are mostly workflow with a small agentic section where flexibility is needed.

Agents need tighter operational controls than single model calls. Cap the number of steps and total tokens, scope each tool to the minimum permissions it needs, and require [human-in-the-loop](./human-in-the-loop.md) approval for irreversible actions like payments or deletions. Log every step so a bad run can be replayed, and evaluate agents on both the final outcome and the path taken, since a correct answer reached through a risky action is still a problem.

_Usage:_

- "Does this need to be an agent, or is it three steps we could just hard-code?"
- "One run hit 200 calls. We need a step cap and a token budget."
- "The agent can draft the refund, but a human clicks approve."
