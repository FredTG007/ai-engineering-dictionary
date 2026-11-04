---
title: Human-in-the-Loop
description: A design where a person reviews, approves or corrects an AI system's output or action before it takes effect.
---

Human-in-the-loop means a person sits at a defined checkpoint in an AI workflow and must approve, edit or reject what the system proposes. The checkpoint might be before an [agent](./agent.md) sends an email, before a refund over a threshold is issued, or when the model's confidence is low. The point is to keep consequential or irreversible decisions under human control while still letting automation handle the routine bulk.

The need usually becomes obvious after an incident. One company let its procurement agent place orders directly through [tool calling](./tool-calling.md). A misread unit field turned "12 boxes" into "12 pallets", and the order shipped before anyone noticed. Adding an approval step for any order above a set value cost reviewers a few minutes a day and would have caught it.

Where you put the human matters more than whether you have one. Common patterns include:

- **Approve before action:** the agent pauses and waits for sign-off on writes, payments or external messages.
- **Review on escalation:** only low-confidence or policy-flagged cases go to a person.
- **Audit after the fact:** a sample of completed work is reviewed to catch drift and feed [evals](./evals.md).

Badly designed review steps fail quietly. If reviewers see hundreds of near-identical approvals a day, they start clicking "approve" without reading, which gives you the latency of a human check with none of the safety. Keep the queue small by routing only what genuinely needs judgment, show reviewers the evidence the model used, and make rejecting as easy as approving.

Human corrections are also valuable data. Every edit a reviewer makes is a labelled example of what the system got wrong, and teams that log these systematically can grow a [golden dataset](./golden-dataset.md) and tune [guardrails](./guardrails.md) far faster than teams that treat review as a pure cost.

_Usage:_

- "Anything that touches a customer's bank details goes to a human, no exceptions."
- "Approval rate is 99.8 percent, which tells me nobody is actually reading these."
- "Pipe the reviewer edits into the eval set so we stop making the same mistake."
