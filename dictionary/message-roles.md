---
title: Message Roles
description: The system, user, assistant and tool labels on each chat message that tell the model who said what and what to trust.
difficulty: beginner
interview: "A colleague puts all the bot's rules at the top of the first user message instead of in the system prompt, and the rules keep getting ignored after a few turns. Why, and what would you change?"
interviewAnswer: "Covers that models are post-trained to weight the system role as standing instructions and user turns as requests, so rules in a user message fade as the conversation grows and are easier for later user text to override, and that the fix is to move rules to the system message, keep user content in user turns, and use assistant turns for examples of desired output."
buildThis:
  title: Test how role placement changes behaviour
  goal: Measure whether the same instruction is followed more reliably in the system role than in the user role.
  steps:
    - Write one strict rule such as always replying in exactly three bullet points.
    - Build twenty short multi-turn conversations that tempt the model to break the rule.
    - Run each conversation twice, once with the rule in the system message and once at the top of the first user message.
    - Count rule violations for each placement and record the difference.
  skills:
    - Prompting
    - Python
    - Evals
  time: under an hour
  stretch: Add a third variant that repeats the rule as a short reminder in every user turn and see whether it helps or hurts.
---

Message roles are the labels attached to each message in a chat request. The common ones are system for standing instructions from the developer, user for what the person said, assistant for what the model said earlier, and tool for results returned from a function call. The model is post-trained on conversations that use these labels, so it has learned to treat each role differently: the system turn as rules to keep, user turns as requests to answer, assistant turns as its own prior words, and tool turns as data rather than instructions.

The roles are the concept; the [chat template](./chat-template.md) is how they are written onto the wire for a given model. Every major API exposes roles in roughly the same shape, which is why a prompt built from clean roles ports between providers more easily than one that mashes everything into a single text block.

Putting content in the wrong role is a quiet source of bugs. A team wrote their assistant's rules at the top of the first user message because an early prototype had no system field. The rules worked for short chats and faded as conversations grew, and by turn eight the bot was happily ignoring its own formatting constraints. Worse, because the rules lived in a user turn, any later user turn carried the same authority and could override them, which made [prompt injection](./prompt-injection.md) trivially easy. Moving the rules into the [system prompt](./system-prompt.md) and leaving user turns for user content fixed both problems without changing a word of the rules.

| Role | Carries | Should contain | Should not contain |
| --- | --- | --- | --- |
| system | Standing instructions | Persona, rules, output format | User data, retrieved documents |
| user | Requests | What the person actually said, retrieved context clearly marked | Developer rules |
| assistant | Prior model output | Earlier answers, worked examples | Hidden instructions |
| tool | Function results | Raw data from [tool calling](./tool-calling.md) | Anything meant as a command |

Roles also give you a clean way to show rather than tell. [Few-shot examples](./few-shot-prompting.md) work well as alternating user and assistant turns before the real request, because the model reads its own earlier answers as a pattern to continue. Keep the final turn a genuine user message, and let the assistant speak last.

_Usage:_

- "Move the rules into the system message; they don't belong in a user turn."
- "Tool results are data, the model shouldn't be treating that JSON as instructions."
- "Put the examples in as fake assistant turns, it copies its own style better than a description."
