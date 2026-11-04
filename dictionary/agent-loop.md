---
title: Agent Loop
description: The control loop that repeatedly calls the model, runs any tools it requests and feeds results back until the task ends.
difficulty: intermediate
interview: "An agent searching for a paper that does not exist ran 150 model calls before someone killed it. What would you change in the loop that drives it?"
interviewAnswer: "Covers max steps and token budgets, repeated-call detection, per-tool timeouts, returning concise tool errors as results the model can act on, telling the user plainly when a limit stops the run, context trimming, and per-step tracing so runs can be replayed."
---

The agent loop is the piece of ordinary code that drives an [agent](./agent.md): call the model, check whether it requested any tools, execute them, append the results to the conversation, and call the model again, repeating until the model returns a final answer or a limit is hit. The model makes decisions; the loop makes them happen and decides when to stop.

Most agent incidents are loop incidents. A research assistant was asked to find a paper that did not exist. It searched, found nothing, rephrased, searched again, and kept going. The loop had no step limit and no budget, so the run made 150 calls and cost more than the whole team's daily testing before someone killed the process. The model was behaving reasonably given what it saw; the loop gave it no reason to stop.

A minimal loop looks like this in pseudocode:

```
for step in range(MAX_STEPS):
    reply = model(messages, tools)
    if not reply.tool_calls:
        return reply.text
    for call in reply.tool_calls:
        result = run_tool(call)          # validate, authorize, time out
        messages.append(result)
return "Stopped: step limit reached"
```

Production loops add several controls around this core:

| Control | Prevents |
|---|---|
| Max steps and token budget | Runaway cost and endless retries |
| Per-tool timeouts | One slow API stalling the whole run |
| Repeated-call detection | The same failing call made over and over |
| Approval gates | Irreversible actions without a human check |
| Context trimming | History growing past the [context window](./context-window.md) |

Loops also need to handle errors in a way the model can use. When a tool fails, return a short, specific error as the tool result instead of crashing, so the model can try something else. When the loop stops due to a limit, tell the user plainly rather than returning a half-finished answer as if it were complete.

Observability is essential because the loop is where behavior unfolds over time. Record each step, the model's tool choice, the arguments, the result and the tokens used, ideally with [tracing](./tracing.md) so a run can be replayed. Patterns like [ReAct](./react-pattern.md), [planning](./planning.md) and [memory](./memory.md) are mostly additions to this loop, not replacements for it.

_Usage:_

- "There's no max_steps in the loop. That's how we got the 150-call run."
- "Return the API error to the model as a tool result. Don't throw."
- "It called the same search six times in a row. Add repeat detection."
