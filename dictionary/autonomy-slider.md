---
title: Autonomy Slider
description: A product design that lets the user choose how much an agent may do on its own, from suggesting to acting without asking.
difficulty: beginner
interview: "An email assistant launched with 'fully autonomous' as the default and sent two hundred unwanted follow-ups on day one. How would you redesign the feature around an autonomy slider?"
interviewAnswer: "Covers offering distinct levels such as draft only, act after confirmation, and act freely within limits, defaulting to the cautious end for new users. Mentions tying higher levels to allowlisted actions and spend caps, and earning the user's trust with visible results before suggesting a higher setting."
buildThis:
  title: Add a three-level autonomy control to a task agent
  goal: Build a small file-organising agent whose behaviour changes with a setting of suggest, confirm or auto.
  steps:
    - Write an agent that proposes moves for files in a scratch folder based on their names and contents.
    - Implement three modes, one that prints suggestions only, one that asks yes or no before each move, and one that moves without asking.
    - Make the auto mode refuse to delete anything and cap it at twenty moves per run.
    - Run the same messy folder through all three modes and record how many actions each one took.
  skills:
    - Python
    - CLI
    - agent design
  time: an afternoon
  stretch: Add a log that shows the user what auto mode did and a one-command undo for the last run.
---

An autonomy slider is a product control that lets the user decide how much an agent does without asking. At the low end the model only suggests, and the person does the work. In the middle it drafts or acts but waits for confirmation. At the high end it completes whole tasks on its own within set limits. Andrej Karpathy used the image of a slider when describing how useful AI products let people choose the level of autonomy instead of forcing a fully autonomous agent on them.

The slider matters because trust is earned per task, not per product. The same user who is happy to let an assistant reformat a document will not let it send email to a client without reading it first. A single autonomy setting for the whole product is wrong for one of those cases. Giving the user a dial, ideally one that remembers a setting per kind of action, lets the product be useful at both ends.

The failure story is a default set too high. One team launched an email assistant with "handle my follow-ups" switched on for everyone. On the first day it sent roughly two hundred follow-up messages that users had not reviewed, including several to people who had explicitly asked not to be contacted. The feature was pulled within hours. It relaunched with draft-only as the default, a confirm step for sending, and a fully autonomous mode that users had to switch on themselves after seeing a week of good drafts. Adoption of the autonomous mode was slower, but complaints dropped to a handful.

| Level | The agent does | The person does |
|---|---|---|
| Suggest | Proposes next steps or text | Everything else |
| Confirm | Prepares the action and waits | Approves or edits each one |
| Act within limits | Completes the task inside caps | Reviews a summary afterwards |
| Act freely | Everything the role allows | Sets the role up front |

Each notch on the slider needs matching safeguards. [Human-in-the-loop](./human-in-the-loop.md) review is the middle setting made concrete. The higher settings depend on [allowlisting](./allowlisting.md) which actions the [agent](./agent.md) may take at all, [guardrails](./guardrails.md) on what it can say, and budgets on what it can spend. The slider also reflects a broader shift in how software is built: when behaviour is written in prompts, as the [Software 3.0](./software-3-0.md) framing describes, the question of how much to let the model decide becomes a product setting rather than a hard-coded one, and the [workflows vs agents](./workflows-vs-agents.md) trade-off becomes something a user can move.

_Usage:_

- "Default to draft mode. Let people turn on auto-send after they've seen a week of drafts."
- "The slider is a trust control. Nobody starts at full autonomy with their own inbox."
- "Confirm mode for anything that sends or pays, auto mode for anything we can undo."
