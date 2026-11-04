---
title: Temperature
description: A sampling setting that controls how random a model's word choices are; low values are focused, high values more varied.
---

Temperature is a parameter that controls how much randomness goes into choosing each next token. At every step the model produces a probability for every possible next [token](./tokens.md). Temperature reshapes that distribution before sampling: low values sharpen it so the most likely token almost always wins, high values flatten it so less likely tokens get picked more often.

The practical effect is a dial between consistency and variety. Near zero, the same prompt tends to give the same answer, which suits extraction, classification and [structured output](./structured-output.md). Around 0.7 to 1.0, outputs vary more, which can help brainstorming or creative copy. Above that, text becomes erratic quickly.

| Temperature | Typical use | Risk |
| --- | --- | --- |
| 0 - 0.2 | Extraction, classification, JSON | Repetitive phrasing |
| 0.3 - 0.7 | Chat, summaries, support replies | Mild variation between runs |
| 0.8 - 1.2 | Brainstorming, marketing drafts | More factual slips and drift |

A frequent production symptom is flaky behaviour that nobody can reproduce. One team had an extraction pipeline that failed to return valid JSON about one time in forty. The prompt was fine; temperature had been left at the SDK default of 1.0. Dropping it to 0 removed most failures and made their [evals](./evals.md) stable enough to compare prompt versions meaningfully.

Low temperature does not make a model correct. It makes it consistent, which includes being consistently wrong. It also does not guarantee identical outputs, since some serving stacks are not fully deterministic. If a model is giving a [hallucination](./hallucination.md) at temperature 0, the fix is better context or [grounding](./grounding.md), not a different setting.

Temperature interacts with [top-p sampling](./top-p-sampling.md), which trims the candidate list instead of reshaping it. Most providers recommend adjusting one and leaving the other at its default.

_Usage:_

- "Set temperature to zero for the extractor, we want boring and repeatable."
- "The evals are noisy because we're sampling at 1.0."
- "Temperature won't fix a hallucination, the doc just isn't in context."
