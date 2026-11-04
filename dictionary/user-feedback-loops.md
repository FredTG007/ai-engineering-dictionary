---
title: User Feedback Loops
description: Collecting signals from real users, explicit ratings and implicit behavior, and feeding them back into evals, prompts and data.
difficulty: intermediate
interview: "Your assistant has a thumbs-up/down button that almost nobody clicks, and the few ratings are mostly angry. How would you build a feedback loop that actually improves the product?"
interviewAnswer: "Covers combining sparse explicit ratings with implicit signals such as retries, edits, copy actions and escalations, linking each signal to the full trace, reviewing and labeling the failures, turning confirmed failures into eval cases, and watching for bias in who leaves feedback."
---

A user feedback loop is the process of capturing what real users think of a model's output, in what they say and in what they do, and feeding that back into how the system is built. The loop only counts as closed when a signal from production ends up changing something: an eval case, a prompt, a retrieval fix or training data.

Explicit feedback alone is usually too thin to steer by. One team shipped a thumbs-up/down button and got ratings on under one percent of conversations, almost all thumbs-down from frustrated users. The useful signal was in behavior they were not logging yet: users who regenerated an answer three times, rewrote the draft before sending it, or asked for a human right after the bot replied. Once those events were tied to the [tracing](./tracing.md) data for each conversation, the team could find the worst failures without waiting for anyone to click a button.

| Signal | Type | What it often means |
|---|---|---|
| Thumbs up/down, star rating | Explicit | Satisfaction, but sparse and skewed toward anger |
| Written comment | Explicit | Rich detail, rare |
| Regenerate or retry | Implicit | The first answer missed |
| Heavy edits before use | Implicit | Close, but not right |
| Copy, accept, send unchanged | Implicit | Useful as is |
| Escalation to a human | Implicit | Failure or lack of trust |

Raw signals need review before they become ground truth. A thumbs-down can mean the answer was wrong, slow, correct but unwelcome, or that the user clicked by accident. Sample flagged conversations, read them, and label the actual failure, then add confirmed cases to your [golden dataset](./golden-dataset.md) so [regression evals](./regression-evals.md) catch them next time. Preference pairs from real usage can later feed [RLHF](./rlhf.md)-style training, but only after this kind of cleaning.

Watch the biases in who gives feedback and when. Unhappy users rate more often, power users more than casual ones, and a change to the UI can move feedback rates without any change in quality. Compare signals over time and across versions, as in [A/B testing prompts](./ab-testing-prompts.md), rather than reading any single number as the truth.

_Usage:_

- "Nobody clicks thumbs-down, but they hit regenerate constantly. Log that."
- "Every confirmed bad answer from feedback goes into the golden set by Friday."
- "Rating volume dropped after the redesign. Check the button before celebrating."
