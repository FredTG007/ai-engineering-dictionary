---
title: Planning
description: Having an agent lay out the steps of a task before or while acting, so long tasks stay coherent instead of drifting.
difficulty: advanced
interview: "Your research agent drifts after about twenty steps and repeats searches it already ran. How would you add planning, and how do you stop the plan itself going stale?"
interviewAnswer: "Covers drafting an explicit step list, tracking progress in state outside the context window, and revising the plan when results contradict it. Discusses plan-then-execute versus interleaved replanning, step and budget limits, checkpoints, and evaluating plan quality separately."
---

Planning, in agent systems, means having the model lay out the steps of a task explicitly, before or while carrying it out, instead of choosing each action only in reaction to the last result. The plan becomes something the [agent](./agent.md) can follow, check off and revise.

The need appears on longer tasks, where purely reactive agents lose the thread. A team built an agent to migrate a set of customer records between two systems. Without a plan, it handled the first few records well, then got absorbed in fixing a formatting issue in one record and never returned to the rest. The final message said "done." A written plan listing each record, updated after every step, made the remaining work visible to both the model and the reviewers.

There are a few common ways to structure it:

- **Plan then execute:** the model writes a full plan up front, and the [agent loop](./agent-loop.md) works through it step by step. Predictable, but brittle if early steps reveal surprises.
- **Interleaved planning:** the model reasons briefly before each action about what to do next, similar to [chain-of-thought](./chain-of-thought.md) applied to tool use. Flexible, but can drift on long tasks.
- **Plan and revise:** an explicit plan, kept in state, that the model updates when results contradict it. Usually the best balance for multi-step work.
- **Separate planner:** one model call produces the plan and others execute it, sometimes with different models, as in some [multi-agent](./multi-agent.md) designs.

A plan is also a review point. Showing the plan to a user before execution lets them catch a wrong approach before any action is taken, which is far cheaper than undoing ten tool calls. This makes planning a natural place for [human-in-the-loop](./human-in-the-loop.md) approval on sensitive tasks.

Planning has costs and limits. Writing and revising a plan adds tokens and latency, and for short tasks of two or three steps it is pure overhead. Plans can also be confidently wrong, and a model may follow a bad plan instead of noticing it. [Reasoning models](./reasoning-models.md) do some of this internally, but keeping an explicit, inspectable plan in state remains useful for long or auditable tasks.

_Usage:_

- "Make it write the plan as a checklist and tick items off. It keeps forgetting step four."
- "Show the user the plan before it touches production data."
- "For a two-step lookup, skip planning. It's just burning tokens."
