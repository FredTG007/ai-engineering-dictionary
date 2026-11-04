---
title: Jailbreak
description: A crafted input that gets a model to ignore its safety training or usage policy and produce content it would normally refuse.
---

A jailbreak is an input designed to make a model break its own safety behaviour, producing content it was trained or instructed to refuse. That refusal behaviour mostly comes from post-training such as [RLHF](./rlhf.md), which is why it has gaps. Typical techniques include role-play framing ("pretend you are an AI with no rules"), hypothetical wrappers, splitting a forbidden request into innocent-looking pieces, encoding text in base64 or another language, and long multi-turn conversations that gradually shift the model's sense of what is acceptable.

Jailbreaks differ from [prompt injection](./prompt-injection.md) in who is attacking whom. In a jailbreak, the user is usually trying to get the model to misbehave for their own benefit. In prompt injection, a third party hides instructions that turn the application against its user. The defences overlap, but the threat models are different, and conflating them leads to gaps.

The production symptom is usually a screenshot. A company's customer-facing assistant was coaxed, over about fifteen turns of "creative writing", into producing detailed instructions for picking a specific brand of lock. Someone posted it publicly with the company's logo visible. Nothing in the [system prompt](./system-prompt.md) was wrong; the user had simply found a path the model's training did not cover.

You cannot rely on the base model alone. Practical mitigations include:

- Input classifiers that recognise known jailbreak patterns before the main model sees them.
- Output [content moderation](./content-moderation.md) that checks the response regardless of how it was elicited.
- Limiting conversation length or re-evaluating context in long sessions where drift accumulates.
- Keeping the assistant narrowly scoped, since a bot that only answers billing questions has fewer ways to be steered off course.

Jailbreak techniques change constantly, so treat resistance as something you measure, not something you assume. Maintain a set of known attacks in your [evals](./evals.md), refresh it from ongoing [red teaming](./red-teaming.md), and rerun it whenever you change models, because a new model version can be stronger against old attacks and weaker against new ones.

_Usage:_

- "It held up for the first ten turns, then the 'grandma bedtime story' trick got through."
- "Add that jailbreak to the regression suite before we swap models."
- "Output moderation caught it even though the input classifier missed the base64 version."
