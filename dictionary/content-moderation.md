---
title: Content Moderation
description: Classifying user inputs and model outputs for harmful or off-policy content such as hate, self-harm, violence or sexual material.
difficulty: intermediate
interview: "Your moderation filter blocks too many harmless medical questions but still misses some abusive ones. How do you tune it?"
interviewAnswer: "Covers checking both inputs and outputs, per-category thresholds instead of one global cutoff, and measuring precision and recall on a labeled set of real traffic. Mentions domain-specific policy, human review for borderline cases, and the latency cost of each check."
---

Content moderation in an LLM application means checking text, and sometimes images or audio from [multimodal](./multimodal.md) inputs, against a set of harm categories and deciding what to do when something matches. It runs in both directions: on user input, to catch abuse or requests you will not serve, and on model output, to catch anything harmful the model produced despite its training. It is one specific kind of [guardrail](./guardrails.md), focused on harm categories rather than business rules.

The need is easy to underestimate until it bites. A language-learning app let users chat freely with a tutor persona. Within a week of launch, a cluster of teenage users had found that the tutor would continue sexually explicit role-play if they framed it as vocabulary practice. The model's built-in safety training reduced but did not prevent it, and the app had no output check at all.

Most teams use a dedicated moderation classifier rather than asking the main model to police itself. Classifiers are fast, cheap, and return per-category scores you can threshold differently for different products. A mental-health support app might route self-harm signals to a crisis flow rather than blocking, while a children's product might block at a much lower threshold than an internal tool.

Choosing thresholds is a trade-off between harm and frustration. Set them too strict and you block legitimate questions about medicine, history or safety, which users experience as the product being broken. Set them too loose and harmful output gets through. Review flagged samples regularly, track false-positive rates alongside catches, and keep labeled examples in your [evals](./evals.md).

Moderation also interacts with [streaming](./streaming.md). If you stream tokens to the user as they are generated, an output check that only runs on the complete response is too late. Options include moderating in chunks, delaying the stream slightly, or retracting a message after the fact, each with its own cost to [latency](./latency.md) and user experience. Moderation also complements [jailbreak](./jailbreak.md) defenses, catching harmful output however it was elicited.

_Usage:_

- "The moderation API flagged a question about chemotherapy dosages as self-harm."
- "We stream with a 200-token buffer so moderation can catch things before they render."
- "Set the violence threshold lower for the kids' app than for the internal tool."
