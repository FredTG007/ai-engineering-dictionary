---
title: DPO (Direct Preference Optimization)
description: A preference-training method that tunes a model directly on chosen-versus-rejected answer pairs, with no reward model or RL loop.
difficulty: advanced
interview: "After DPO on support preference pairs, your model's answers got noticeably longer and wordier, and humans no longer prefer them. What are the likely causes and what would you change?"
interviewAnswer: "Covers length bias in the chosen answers, inconsistent or noisy labels, too low a beta or too many epochs drifting from the reference model, checking pairs for length and quality, and measuring with pairwise evals plus regression checks after each run."
---

Direct preference optimization (DPO) is a way to train a model on preference data, pairs of answers to the same prompt where one is marked chosen and the other rejected, without training a separate reward model or running reinforcement learning. Introduced by Rafailov and colleagues in 2023, it reaches a similar goal to [RLHF](./rlhf.md) with a training loop that looks much more like ordinary [supervised fine-tuning](./supervised-fine-tuning.md).

The method works by comparing the model against a frozen copy of itself. The starting model, usually already supervised fine-tuned, is kept as a reference. For each pair, the loss widens the gap between the two answers: measured against the reference, the chosen answer should gain probability relative to the rejected one. Only that margin is trained, so in practice both answers can become less likely, with the rejected one falling faster. A parameter called beta controls how far the model is allowed to move away from the reference: a small beta permits larger shifts, a large beta keeps the model conservative.

| | RLHF with PPO | DPO |
|---|---|---|
| Reward model | Trained separately | Not needed |
| Training loop | Generate, score, update with RL | Supervised-style passes over fixed pairs |
| Models in memory | Policy, reference, reward, often a value model | Policy and reference |
| Typical difficulty | Unstable, many hyperparameters | Simpler, fewer knobs |
| Data | Preference pairs | Preference pairs |

DPO learns whatever separates chosen from rejected, including things you did not intend. A team ran DPO on support replies where raters had usually picked the longer, more thorough answer. The tuned model became markedly wordier, and on a fresh [pairwise eval](./pairwise-evals.md) humans preferred the original model. Length was the strongest signal in their pairs, so it was what the model learned. Checking pairs for length and other shortcuts before training is cheaper than discovering them afterwards.

Simpler is not the same as easy. DPO still needs consistent labelling guidelines, enough pairs that cover your real prompts, and [evals](./evals.md) after every run to catch regressions in behaviour you did not target. Pairs can come from human raters, from an [LLM-as-judge](./llm-as-judge.md), or from [user feedback](./user-feedback-loops.md), and each source carries its own biases into the model.

_Usage:_

- "We dropped the reward model and went with DPO; training fits on one node now."
- "The chosen answers are 40 percent longer on average. That's what it learned."
- "Bump beta, it's drifting too far from the SFT checkpoint."
