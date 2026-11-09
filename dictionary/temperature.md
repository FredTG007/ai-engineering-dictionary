---
title: Temperature
description: A sampling setting that controls how random a model's word choices are; low values are focused, high values more varied.
difficulty: beginner
interview: "Your extraction pipeline returns different field values for the same document on repeated runs. How do you think about temperature here?"
interviewAnswer: "Covers temperature scaling the randomness of token sampling, using zero or near-zero for extraction and classification, keeping higher values for creative tasks, noting that low temperature reduces but does not fully guarantee determinism, and pairing it with structured output and validation."
buildThis:
  title: Build a temperature comparison visualizer
  goal: Generate the same creative sentence at various temperature settings to visualize output variance.
  steps:
    - Write a Python script that calls an LLM API multiple times with a creative prompt.
    - Iterate temperature values from 0.0 to 1.5 in fixed increments.
    - Collect responses for each temperature setting and print them side by side.
    - Observe how low values repeat deterministic text while high values introduce novel phrasing.
  skills:
    - Python
    - API Integration
    - Sampling
  time: under an hour
  stretch: Calculate and plot the token overlap or embedding distance between outputs across different temperatures.
---

Temperature is a parameter that controls how much randomness goes into choosing each next token. At every step the model produces a probability for every possible next [token](./tokens.md). Temperature reshapes that distribution before sampling: low values sharpen it so the most likely token almost always wins, high values flatten it so less likely tokens get picked more often.

The practical effect is a dial between consistency and variety. Near zero, the same prompt tends to give the same answer, which suits extraction, classification and [structured output](./structured-output.md). Around 0.7 to 1.0, outputs vary more, which can help brainstorming or creative copy. Much above 1.0, text becomes erratic quickly.

| Temperature | Typical use | Risk |
| --- | --- | --- |
| 0 - 0.2 | Extraction, classification, JSON | Repetitive phrasing |
| 0.3 - 0.7 | Chat, summaries, support replies | Mild variation between runs |
| 0.8 - 1.2 | Brainstorming, marketing drafts | More factual slips and drift |

A frequent production symptom is flaky behavior that nobody can reproduce. One team had an extraction pipeline that failed to return valid JSON about one time in forty. The prompt was fine; temperature had been left at the SDK default of 1.0. Dropping it to 0 removed most failures and made their [evals](./evals.md) stable enough to compare prompt versions meaningfully.

Low temperature does not make a model correct. It makes it consistent, which includes being consistently wrong. It also does not guarantee identical outputs, since some serving stacks are not fully deterministic. If a model is giving a [hallucination](./hallucination.md) at temperature 0, the fix is better context or [grounding](./grounding.md), not a different setting.

Temperature interacts with [top-p sampling](./top-p-sampling.md), which trims the candidate list instead of reshaping it. Most providers recommend adjusting one and leaving the other at its default. Many [reasoning models](./reasoning-models.md) fix or ignore temperature entirely, so check the model's documentation before relying on it.

_Usage:_

- "Set temperature to zero for the extractor, we want boring and repeatable."
- "The evals are noisy because we're sampling at 1.0."
- "Temperature won't fix a hallucination, the doc just isn't in context."
