---
title: Skill Library
description: A catalogue of named, reusable procedures, each bundling a prompt, the tools it needs and its checks, that an agent picks from.
difficulty: intermediate
interview: "Three teams each wrote their own 'send invoice' prompt for the company agent and they disagree about which fields are required. How would a skill library fix this and how would you keep it trustworthy?"
interviewAnswer: "Covers moving the procedure into one named skill with a versioned prompt, declared tools and a test suite, so every team calls the same thing. Mentions discovery through short descriptions the agent can read, ownership per skill, and running each skill's tests before a new version is published."
buildThis:
  title: Build a three-skill library with a router
  goal: Package three small procedures as named skills with descriptions and tests, and let a model pick the right one per request.
  steps:
    - Write three skills as folders, each with a prompt file, a list of allowed tools and three test inputs with expected outputs.
    - "Write a loader that reads every skill's name and one-line description into a menu."
    - "Ask the model to choose a skill for an incoming request, then run that skill's prompt with only its tools."
    - "Write a test runner that executes every skill's test inputs and reports pass or fail per skill."
  skills:
    - prompt design
    - Python
    - testing
    - file layout
  time: a day
  stretch: Version each skill and have the runner diff outputs between the current and previous version on the same test inputs.
---

A skill library is a collection of named procedures an agent can select from, where each skill packages a prompt, the tools it is allowed to call, and checks that confirm it did its job. Rather than one long [system prompt](./system-prompt.md) that tries to describe every task, the [agent](./agent.md) reads a menu of short skill descriptions, picks one, and loads only that skill's instructions and tools for the duration of the task.

The library solves a duplication problem that grows with the team. Early on, every feature gets its own prompt and its own ad hoc [tool calling](./tool-calling.md) setup. Within a year the same procedure exists in several places, each slightly different, and nobody knows which is correct. A skill library gives each procedure one home, one owner, and one version history.

The usual trigger is a disagreement nobody noticed. One company found that three teams had each written a "send invoice" prompt for their shared agent. One required a purchase order number, one treated it as optional, and one did not know the field existed. Customers of different products got different invoices, and finance spent a week reconciling them. Collapsing the three into a single versioned skill, with a test that checked the required fields, removed the inconsistency in one release.

| Part of a skill | What it contains | Why it is separate |
|---|---|---|
| Description | One or two lines the agent reads to choose | Keeps the menu small and cheap |
| Instructions | The full prompt, loaded only when selected | Saves context tokens on every other task |
| Tools | The specific functions or [MCP](./mcp.md) servers it may use | Limits blast radius |
| Checks | Tests or assertions on the output | Lets you ship a new version with confidence |

Operating a skill library is mostly discipline. Apply [prompt versioning](./prompt-versioning.md) to each skill so a change can be rolled back on its own. Keep descriptions honest, because a vague description makes the agent pick the wrong skill and a flattering one makes it pick a skill that cannot do the job. Skills also make [handoffs](./handoffs.md) cleaner, since a specialist can be defined as "this skill with this context". If a skill's steps are fully fixed, consider whether it should be a plain workflow instead; the [workflows vs agents](./workflows-vs-agents.md) question applies to each skill individually.

_Usage:_

- "There are three 'send invoice' prompts in the repo. Pick one, make it a skill, delete the others."
- "The agent chose the refund skill for a shipping question. The description is too vague."
- "Every skill ships with its own tests, or it doesn't ship."
