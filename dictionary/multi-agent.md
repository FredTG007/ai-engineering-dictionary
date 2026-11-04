---
title: Multi-Agent System
description: An architecture where several LLM agents with separate roles, prompts or tools coordinate to complete a task.
difficulty: advanced
interview: "A teammate proposes splitting your single agent into five specialized agents. What would make you agree, and what failure modes would you watch for?"
interviewAnswer: "Agrees only if roles need different tools, context or permissions and a single agent measurably fails. Watches for lost context in handoffs, agents looping or contradicting each other, multiplied cost and latency, and harder debugging, so traces across agents and clear ownership matter."
---

A multi-agent system splits work across more than one [agent](./agent.md), each with its own instructions, tools and often its own model. A common shape is an [orchestrator](./orchestrator-worker.md) that breaks a request into subtasks and hands them to specialist workers, such as a researcher, a coder and a reviewer, then merges their results. Other shapes include peer agents passing messages or a pipeline where each agent transforms the previous one's output.

The usual motivation is that one agent with everything in its prompt starts to degrade. A team building a due-diligence assistant found that once their single agent had twenty-five tools and a four-page [system prompt](./system-prompt.md), it began skipping steps and calling the wrong search tool about one time in six. Splitting it into a planner plus three narrow workers, each seeing only its own five tools, brought tool-selection errors close to zero.

The trade-offs are real and often underestimated:

| Gain | Cost |
|---|---|
| Smaller, focused prompts per agent | More LLM calls, so higher cost and [latency](./latency.md) |
| Parallel subtasks | Harder to debug across agent boundaries |
| Different models per role | Information lost in handoffs between agents |
| Isolated tool permissions | Coordination failures, loops and duplicated work |

Handoffs are where most multi-agent bugs live. When the orchestrator summarizes a subtask for a worker, it can drop a constraint the user stated, and the worker cheerfully produces something that violates it. Passing structured briefs rather than free-text summaries, and giving each agent a clear stopping condition in its [agent loop](./agent-loop.md), reduces this.

Before reaching for multiple agents, check whether better [planning](./planning.md) or a tighter tool set in one agent would do. When you do go multi-agent, invest early in [tracing](./tracing.md) so you can see which agent said what, because "the system gave a wrong answer" is nearly impossible to diagnose otherwise.

_Usage:_

- "The reviewer agent keeps approving everything because it never sees the original requirements."
- "Going multi-agent tripled our token spend for a two-point accuracy gain."
- "Give the research agent read-only tools; only the executor should be able to write."
