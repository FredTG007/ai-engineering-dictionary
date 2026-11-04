---
title: Evals
description: Repeatable tests that score an LLM system's outputs against expectations so you can tell whether a change helped or hurt.
---

Evals are repeatable tests that run an LLM system over a fixed set of inputs and score the outputs, so that you can compare one version of the system against another with numbers rather than impressions. They play the role unit and integration tests play in ordinary software, adapted for outputs that are probabilistic and often free-form.

Teams usually start writing evals after a change that looked good and was not. One familiar story: an engineer tweaked the [system prompt](./system-prompt.md) to make answers friendlier, spot-checked five conversations, and shipped. A week later support tickets showed the bot had stopped including order numbers in its replies. Five hand-picked examples could not catch a pattern that appeared in 20 percent of real traffic.

An eval has three parts: inputs, a way to run the system, and a way to score the result. Inputs often come from a [golden dataset](./golden-dataset.md) of curated cases. Scoring varies by task:

| Scoring method | Good for | Weakness |
|---|---|---|
| Exact or programmatic match | Classification, extraction, [structured output](./structured-output.md) | Cannot judge open-ended text |
| Reference similarity | Short factual answers | Penalizes valid rewordings |
| [LLM-as-judge](./llm-as-judge.md) | Tone, helpfulness, groundedness | Needs its own calibration |
| Human review | Final say on subtle quality | Slow and expensive |

Good evals measure the parts separately. In a [retrieval-augmented generation (RAG)](./rag.md) system, score retrieval (was the right document found?) independently from generation (was the answer correct and supported?). In an agent, score whether the right tool was chosen separately from whether the final answer was right. When a number drops, this tells you where to look.

Evals only help if they run often. Wire them into CI so prompt and model changes are checked before merge, which is the basis of [regression evals](./regression-evals.md). Keep the suite fast enough that people do not skip it, and keep adding cases from production failures. An eval suite that has not grown in three months is probably measuring last quarter's problems.

_Usage:_

- "What did the evals say? Don't tell me it 'feels better.'"
- "Retrieval score is flat, generation dropped four points. It's the new prompt."
- "Add that ticket to the eval set so we never ship this bug again."
