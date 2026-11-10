---
title: Stop Sequences
description: Strings that make the model halt generation the moment they appear, so output ends where you want instead of where the model wants.
difficulty: intermediate
interview: "Your summariser's p95 latency doubled and output cost rose after a model upgrade, and you notice every reply now ends with a 'Sources:' section nobody asked for. What is a cheap fix, and what could go wrong with it?"
interviewAnswer: "Covers adding 'Sources:' as a stop sequence so generation ends before the unwanted section, saving tokens and time, while noting the risks that the string could appear inside legitimate content and truncate it, that stop sequences are matched on text so streaming clients must handle the cut, and that a prompt fix or eval should back it up."
buildThis:
  title: Build a stop-sequence tester
  goal: Measure how much output and latency a stop sequence saves on a real prompt, and how often it fires early.
  steps:
    - Write a prompt that tends to produce a trailing section you do not want, such as a sign-off.
    - Run fifty generations without a stop sequence and record tokens and time per request.
    - Run the same fifty with the section header as a stop sequence and record the savings.
    - Scan both sets for cases where the stop string appeared inside wanted content.
  skills:
    - Python
    - API calls
    - Latency
  time: under an hour
  stretch: Compare the stop-sequence approach with a prompt instruction that asks the model to omit the section, on both cost and reliability.
---

A stop sequence is a string you give the API alongside the prompt; as soon as the generated text contains it, the model stops and the sequence itself is dropped from the output. It is the cheapest control you have over where output ends. Chat models already use a built-in end-of-turn token for this purpose, and custom stop sequences let you add your own boundaries on top.

The common uses are all about boundaries. A delimiter such as a closing tag stops a model from adding commentary after a block of [structured output](./structured-output.md). A section header stops a model that insists on appending a summary or sign-off nobody wanted. With a [base model](./base-vs-chat-model.md), a stop sequence such as a newline followed by the user's label is what prevents the model from writing the user's next turn itself. Each of these also caps [tokens](./tokens.md), which saves money and shortens [latency](./latency.md), because the model never generates the part you would have thrown away.

A real example: a team's summariser got slower and more expensive after a model upgrade. The p95 roughly doubled, and inspection showed every reply now ended with a lengthy "Sources:" section the prompt had not asked for and the UI did not display. Adding "Sources:" as a stop sequence brought both numbers back the same afternoon, while they worked on a prompt that stopped the behaviour at the root.

| Situation | Stop sequence | Effect |
| --- | --- | --- |
| Unwanted trailing section | The section's header | Output ends before it is written |
| Model invents the next user turn | The user label, e.g. a newline then "User:" | Generation halts at the turn boundary |
| One item wanted from a list | The newline after the first item | Returns one item cheaply |
| Closing a block | The closing tag or fence | No commentary after the block |

The main pitfall is the stop string appearing inside legitimate content. A stop sequence on "Sources:" will also cut a summary that happens to say "the report's sources: internal and external". Choose strings that cannot occur naturally, prefer multi-character tokens over single newlines, and watch [streaming](./streaming.md) clients, since the server may deliver a few characters before matching the stop and then cut. A stop sequence is a guard, not a fix; pair it with an eval that checks outputs are complete.

_Usage:_

- "Add 'Sources:' as a stop sequence for now and fix the prompt properly next sprint."
- "It stopped mid-sentence because the stop string showed up inside the quote."
- "For the base model the stop is the user label, otherwise it talks to itself."
