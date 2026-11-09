---
title: Chain-of-Thought
description: Prompting a model to work through intermediate reasoning steps before giving a final answer, which often improves accuracy.
difficulty: intermediate
interview: "Asking the model to reason step by step lifted accuracy on your pricing calculator, but latency and cost rose. How do you decide whether to keep it?"
interviewAnswer: "Weighs the accuracy gain on an eval set against extra output tokens, cost and p95 latency. Considers reasoning only on hard cases via routing, hiding or discarding the reasoning from users, and that the stated steps do not always reflect what the model actually did."
buildThis:
  title: Compare standard and step-by-step prompts
  goal: Test how forcing an LLM to explain its reasoning affects math or logic puzzle accuracy.
  steps:
    - Gather a test set of ten tricky word problems with known numerical answers.
    - Run all ten problems through an LLM using a direct answer prompt and record the scores.
    - "Run the same problems using a chain-of-thought prompt like 'Think step by step before answering'."
    - Compare the accuracy percentage of both approaches in a summary table.
  skills:
    - Prompt Engineering
    - Testing
    - Evaluation
  time: under an hour
  stretch: Extract the reasoning steps using regex and check if the model arrived at the correct answer for the right reasons.
---

Chain-of-thought is the practice of having a model write out its reasoning before committing to an answer. You either ask for it directly ("think step by step, then give the answer") or show it in [few-shot](./few-shot-prompting.md) examples. Because the model generates [tokens](./tokens.md) one at a time, writing the intermediate steps gives it more computation to spend on the problem, and later tokens can build on earlier ones.

It helps most on tasks that need several dependent steps. Arithmetic, logic puzzles, multi-condition eligibility checks and deciding which tool to call next all benefit. One insurance team found their claims triage model approving claims that failed one of four policy conditions. Asking it to check each condition explicitly, one per line, before deciding cut those errors by more than half.

The reasoning text has costs and risks. It adds output tokens, which raises both the bill and [latency](./latency.md), and users usually should not see it. Separate the reasoning from the final answer with clear markers or [structured output](./structured-output.md) fields so your code can strip it. Also remember the written reasoning is not a faithful trace of how the model reached its answer; it can look convincing and still be wrong, so evaluate the final output rather than trusting the explanation.

Simple tasks rarely need it. Classification, extraction and short rewrites often perform the same without reasoning, and adding it just slows them down. Measure with [evals](./evals.md) before turning it on everywhere.

Many newer [reasoning models](./reasoning-models.md) do this internally, producing hidden thinking before the visible reply. With those, asking for explicit step-by-step text can be redundant, and the main control becomes how much thinking budget to allow.

_Usage:_

- "Add chain-of-thought to the eligibility check, it keeps skipping a condition."
- "Put the reasoning in a scratchpad field and only show the answer."
- "CoT doubled our p95, so we only use it on the hard route."
