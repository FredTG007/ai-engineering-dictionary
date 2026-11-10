---
title: Handoffs
description: Passing a task, plus a compact summary of what is already known, from one agent or specialist to another.
difficulty: intermediate
interview: "Your triage agent routes billing questions to a billing specialist, but customers complain they have to repeat their order number. What is going wrong and how would you fix the handoff?"
interviewAnswer: "Covers that the specialist starts from an empty or stripped context, so the handoff must carry a structured summary: goal, facts already gathered, actions taken, and open questions. Mentions logging the handoff payload, testing it in evals, and dropping raw transcript noise rather than passing everything."
buildThis:
  title: Build a two-agent triage-to-specialist handoff
  goal: Route a support message from a triage agent to one of two specialists with a structured state summary the specialist actually uses.
  steps:
    - Write a triage prompt that classifies a message and extracts known facts into a small JSON summary.
    - Write two specialist prompts (billing, shipping) that receive only the summary plus the latest user message.
    - Log every handoff payload to a file and inspect ten of them by hand.
    - Write five test conversations where a fact is given early and check the specialist never re-asks for it.
  skills:
    - prompt design
    - JSON
    - Python
    - logging
  time: an afternoon
  stretch: Add a handoff back to triage when the specialist decides the message was misrouted, and make sure facts survive the round trip.
---

A handoff is the moment one agent passes a task to another, along with enough state for the receiver to continue without starting over. The receiving agent might be a specialist with different tools, a cheaper model for a routine sub-task, or a human. The hard part is not the routing decision. It is deciding what the receiver needs to know and writing it down in a form the receiver will actually read.

Handoffs exist because one agent that knows every tool gets worse at all of them. A [multi-agent](./multi-agent.md) design splits responsibilities so each [agent](./agent.md) has a short prompt, a small tool list and clear success criteria. The [orchestrator-worker](./orchestrator-worker.md) pattern is a handoff from a coordinator to workers; peer handoffs happen when a triage agent passes a customer to a billing or shipping specialist. Either way, a bad handoff shows up as a receiver that repeats work, asks questions already answered, or acts on stale assumptions.

The classic failure is the specialist that starts from nothing. One support team built a triage agent that collected the customer's order number, email and the issue type, then handed off to a billing agent with only the latest user message. The billing agent's first reply, every single time, was "Could you share your order number?" Customers had already typed it, and a third of them left the conversation at that point. The fix was a structured summary passed with the handoff, and the re-ask rate dropped to near zero within a day.

| Carry across | Drop |
|---|---|
| Goal and constraints in one or two sentences | Full transcript of the earlier conversation |
| Facts already confirmed (IDs, dates, names) | Tool outputs that have already been summarised |
| Actions already taken, including failed ones | The sender's internal reasoning |
| Open questions and what the user is waiting for | Instructions that only applied to the sender's role |

Treat the handoff payload as an interface with a schema, not free text. Write it with the same care you give [context engineering](./context-engineering.md) for a single prompt: short, structured, and tested. Log every payload so you can read them when something goes wrong, and give the receiver a [tool-result budget](./tool-result-budgets.md) so a confused specialist cannot loop forever. If facts need to survive across many handoffs or sessions, store them in [memory](./memory.md) rather than hoping each summary preserves them.

_Usage:_

- "The handoff summary didn't include the order ID, so billing asked for it again."
- "Let's define a schema for the handoff payload instead of passing the whole transcript."
- "Triage hands off to three specialists; log every handoff so we can replay the bad ones."
