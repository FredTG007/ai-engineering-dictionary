---
title: Tool-Result Budgets
description: Hard caps on how many tool calls, tokens, seconds or dollars an agent may spend in one run before it must stop or ask.
difficulty: intermediate
interview: "An overnight batch of agent runs cost eight times the usual amount because one job re-read the same file three hundred times. What budgets would you add and what should happen when a budget is hit?"
interviewAnswer: "Covers separate caps on tool calls, context tokens, wall-clock time and spend, set per run from measured normal usage. Describes stopping cleanly when a cap is hit: summarise progress, return a partial result or ask the user, and log the cause so repeated-call loops are caught in evals."
buildThis:
  title: Add a spend meter to an agent loop
  goal: Wrap an existing tool-calling loop so it tracks calls, tokens and seconds, and stops with a summary when any cap is exceeded.
  steps:
    - Write a small agent loop with two tools, such as read a file and search a folder.
    - Add a budget object with caps for tool calls, total tokens and wall-clock seconds, checked before every call.
    - When a cap is hit, have the model write a one-paragraph summary of progress and return it instead of continuing.
    - Give the agent a task that cannot be finished and confirm it stops at the cap every time.
  skills:
    - Python
    - tool calling
    - cost tracking
  time: an afternoon
  stretch: Log which tool consumed the most budget per run and plot the distribution across fifty runs.
---

A tool-result budget is a limit on what an agent may consume in a single run. The budget can be counted in tool calls, tokens added to the context, wall-clock seconds, or dollars, and usually all four. When the agent reaches a cap it must stop, summarise, or ask for permission to continue. The point is to turn a runaway loop into a bounded one before the bill or the user notices.

Budgets exist because an [agent loop](./agent-loop.md) has no natural end. The model keeps calling tools as long as it believes it is making progress, and a model can believe that for a very long time. A loop that retries a failing search, re-reads a file it has already seen, or scrolls through pages that never contain the answer will burn tokens steadily and look busy in the logs.

The failure usually arrives as a bill. One team ran research agents overnight and woke to a day that cost eight times the normal amount. A single job had been asked to find a configuration value in a repository, could not find it, and re-read the same 40-kilobyte file about three hundred times, each read appended to the context. Nothing crashed. The job just kept going until the morning deploy killed it. A cap of fifty tool calls per run, with a rule that identical calls count double, would have stopped it in under two minutes.

| Budget | What it catches | Typical starting point |
|---|---|---|
| Tool calls per run | Retry loops, repeated reads | Two to three times the p95 of successful runs |
| Context tokens | Bloated context, [context rot](./context-rot.md) | Well under the model's window |
| Wall-clock seconds | Slow tools, stuck browsers | Longer than any legitimate run you have seen |
| Dollars per run | Everything above, in one number | A cost you would be happy to waste once |

What happens at the cap matters as much as the number. A hard kill loses all the work; a better design asks the model to write a short summary of what it found and what it was about to try, then returns that partial result or asks the user whether to continue. Record the reason in [cost tracking](./cost-tracking.md) so repeat offenders show up in review. Budgets pair naturally with [retries and timeouts](./retries-and-timeouts.md) at the tool level and with provider [rate limits](./rate-limits.md), and they are mandatory for anything driving a screen through [computer use](./computer-use.md), where every step is expensive.

_Usage:_

- "The run hit its fifty-call cap and returned a summary instead of a result. Good, that's what it's for."
- "Set a dollar budget per job before we let the agent run unattended."
- "It re-read the same file three hundred times overnight. We need a budget, not a bigger model."
