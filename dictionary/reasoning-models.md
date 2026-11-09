---
title: Reasoning Models
description: Models trained to think through a problem in hidden or visible steps before answering, trading time and tokens for accuracy.
difficulty: intermediate
interview: "Switching your claims-analysis step to a reasoning model halved errors, but timeouts and cost per claim jumped. How would you deploy it sensibly?"
interviewAnswer: "Covers thinking tokens billed as output and inflating cost and time to first token, revisiting timeouts, routing only the steps that measurably benefit or tuning effort settings, keeping simple tasks on fast models, and prompting with goals and constraints instead of step-by-step scripts."
buildThis:
  title: Compare standard and reasoning model outputs on puzzles
  goal: Write a script that benchmarks a reasoning model against a standard model on tricky logic puzzles and checks output quality.
  steps:
    - Select a set of five difficult logic or math word problems that standard models often fail.
    - Write code to query both a standard chat model and a reasoning model via their respective APIs.
    - Log the time taken, token count, and correctness for each model response.
    - Print a summary comparing latency and accuracy differences between the two architectures.
  skills:
    - API Integration
    - Benchmarking
    - JSON Parsing
  time: under an hour
  stretch: Inspect the hidden or visible chain-of-thought tokens to see where the reasoning model catches its own mistakes.
---

A reasoning model is an [LLM](./llm.md) trained to work through a problem step by step before giving its final answer. Where [chain-of-thought](./chain-of-thought.md) prompting asks an ordinary model to show its working, reasoning models do this by default, generating an extended internal sequence of thinking tokens that may be hidden, summarized, or returned depending on the provider. Many expose a setting that controls how much thinking effort to spend.

These models help most on problems with many dependent steps. Multi-step math, code debugging, planning over several constraints, and analysis of long documents with conflicting details all improve noticeably. A team whose insurance-claims assistant kept missing exclusions buried in policy clauses saw its error rate on their [evals](./evals.md) fall by roughly half after switching the analysis step to a reasoning model, with no prompt changes.

The cost is paid in time and tokens. Thinking tokens are usually billed as output, and a hard question can produce thousands of them before the visible answer starts. The same claims team saw [time to first token](./time-to-first-token.md) jump from under a second to more than fifteen seconds, and their cost per claim rose about fourfold. Timeouts tuned for ordinary models started killing legitimate requests, which is why [retries and timeouts](./retries-and-timeouts.md) need revisiting when you adopt one.

Reasoning models are often unnecessary for simple tasks. Classification, short extraction, rewriting, and casual chat rarely benefit, and extra thinking can even cause the model to overcomplicate an easy answer. A sensible pattern is [model routing](./model-routing.md): send straightforward requests to a fast standard model and reserve reasoning models, or higher effort settings, for the steps that measurably need them.

Prompting them is a little different. Detailed step-by-step instructions that helped older models can interfere with the model's own reasoning; stating the goal, constraints, and expected output format clearly tends to work better. In an agent, reasoning models are often used for the [planning](./planning.md) step while cheaper models execute the individual tool calls.

_Usage:_

- "Only the underwriting step needs the reasoning model; the rest can stay on the fast one."
- "First token is fifteen seconds now. Bump the timeout or lower the thinking effort."
- "Strip the 'think step by step' line from the prompt; it already does that."
