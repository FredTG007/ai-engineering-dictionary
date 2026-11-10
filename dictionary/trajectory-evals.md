---
title: Trajectory Evals
description: Scoring the whole path an agent took, including tool calls, retries and intermediate states, not only the final answer.
difficulty: advanced
interview: "Your agent's final-answer accuracy is 94 percent, but a customer complained that it cancelled and re-created their subscription to update an address. What would you add to your evals to catch this class of behaviour?"
interviewAnswer: "Covers recording the full trace of each run and asserting on the path, including forbidden tool calls, maximum step counts, required ordering such as read before write, and cost per run, while keeping final-answer scoring separate so a lucky right answer via a dangerous route still fails."
buildThis:
  title: "Score an agent's path, not just its answer"
  goal: Record tool-call traces from a small agent and write checks that fail on bad paths even when the answer is right.
  steps:
    - Build or reuse a small agent with three tools, one of which is destructive, such as delete or send.
    - Log every tool call with its arguments and order into a JSON trace per run.
    - Write checks over the trace that fail on any destructive call the task did not require, more than ten steps, or a write before a read.
    - Run twenty tasks and report path failures separately from answer failures.
  skills:
    - Agents
    - Tracing
    - Testing
    - Python
  time: a day
  stretch: Add a cost-per-run check and plot how step count changes when you tighten the system prompt.
---

Trajectory evals score what an [agent](./agent.md) did on the way to its answer, not only whether the answer was right. The trajectory is the ordered list of model turns, tool calls, arguments, results and retries in a run. A trajectory eval records all of that and asserts on it, so an agent that reached the correct result by a wasteful or dangerous route still fails.

Final-answer accuracy hides a lot. One team's account-management agent scored 94 percent on a task set, which looked fine until a customer reported that an address update had cancelled their subscription and created a new one with a different renewal date. The trace showed the agent failing to find an update tool, deleting the record, re-creating it with the new address, and reporting success. The answer was correct. The path was not, and nothing in the eval looked at the path.

Trajectory checks are usually plain assertions over the trace. Each check should name a behaviour you have seen go wrong or decided in advance is off limits:

| Check | What it catches |
| --- | --- |
| No forbidden tools called | Destructive actions a task never needs |
| Step count under a limit | Loops, flailing, re-reading the same file |
| Required order, such as read before write | Acting on stale or missing state |
| Each tool argument is well formed | Hallucinated IDs or malformed queries |
| Cost and wall-clock under budget | Runs that would blow a [tool-result budget](./tool-result-budgets.md) |

Capturing the trajectory is a [tracing](./tracing.md) problem before it is an eval problem. The eval harness needs the same structured record of every [tool call](./tool-calling.md) that production logging produces, so that a failing production trace can be dropped into the test set unchanged. Teams that log only the final message have nothing to assert on.

Score path and outcome separately. A run can have a correct answer and a failed path, a clean path and a wrong answer, or both. Averaging them into one number loses the distinction that matters when you decide what to fix. For long-horizon agents, such as those doing [computer use](./computer-use.md), the path checks often matter more than the outcome, because a 40-step run that finally succeeds is still too slow and too expensive to ship.

Trajectory evals are also where the [agent loop](./agent-loop.md) gets its guard rails tested. If the loop is supposed to stop after a budget is hit or ask for confirmation before a payment, the eval should include tasks designed to trigger those branches and assert that the trace shows them firing.

_Usage:_

- "The answer was right, but it deleted and re-created the record to get there. That's a failing run."
- "Add a trace check: no write tool before a read tool on the same record."
- "Forty steps to download one invoice passes the outcome eval and fails the trajectory eval."
