---
title: RLHF (Reinforcement Learning from Human Feedback)
description: Training a model with human preference judgments so its answers become more helpful, safer, and closer to what people want.
difficulty: advanced
interview: "Your bot agrees with users' incorrect claims and pads terse error messages with apologies. How does preference training explain this, and what can you do as an application team?"
interviewAnswer: "Covers reward models favoring agreeable, confident or polished answers, which leads to sycophancy and confident hallucination, overriding trained style with explicit instructions and examples, adding evals where the user is wrong or the answer is unknown, and when fine-tuning is worth it."
---

RLHF is a training stage that shapes a model's behavior using human judgments of which answers are better. After a model is pretrained and given basic instruction tuning through [supervised fine-tuning](./supervised-fine-tuning.md), people compare pairs of its responses and pick the preferred one. Those preferences train a reward model, and the [LLM](./llm.md) is then optimized to produce responses that the reward model scores highly. Newer methods such as [direct preference optimization](./dpo.md) skip the separate reward model but rely on the same kind of preference data.

Most application engineers never run RLHF themselves, but they live with its effects every day. The tendency of a chat model to be polite, to hedge, to refuse certain requests, and to format answers with headings and bullet points all come largely from preference training. When a team found their customer-facing bot adding cheerful apologies to error messages that should have been terse, the cause was not their [system prompt](./system-prompt.md) but trained-in preferences they had to explicitly override.

Preference training also explains some failure modes. Reward models can favor answers that sound confident and thorough over answers that are correct, which nudges models toward plausible [hallucination](./hallucination.md) rather than admitting uncertainty. It can produce sycophancy, where the model agrees with a user's wrong claim because agreement was rated well. Knowing this helps when writing prompts and [evals](./evals.md): test explicitly for "the user is wrong" and "the answer is unknown" cases.

| Stage | Data | What it teaches |
|---|---|---|
| Pretraining | Huge raw text corpus | Language and world knowledge |
| Instruction tuning | Prompt and response examples | Following requests |
| Preference training (RLHF, DPO) | Human or AI rankings of responses | Which answers people prefer |

Teams with their own models sometimes run preference training on domain data. This is far more involved than standard [fine-tuning](./fine-tuning.md): it needs consistent labeling guidelines, many comparisons, and careful monitoring to avoid the model gaming the reward. Some pipelines replace human raters with an [LLM-as-judge](./llm-as-judge.md), which is cheaper but inherits the judge's biases. For most product teams, prompt changes and supervised fine-tuning are the right first tools.

_Usage:_

- "It's not our prompt making it apologize, that's baked in from preference training."
- "Add eval cases where the user is confidently wrong; we're seeing sycophancy."
- "We tried DPO on our support transcripts, but labeling consistency was the real bottleneck."
