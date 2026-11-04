---
title: Pairwise Evals
description: Comparing two outputs for the same input and recording which is better, instead of scoring each one on an absolute scale.
difficulty: intermediate
interview: "Your 1-to-10 judge scores barely move between two prompt versions, yet reviewers say version B is clearly better. How would you set up an eval that can detect the difference?"
interviewAnswer: "Covers switching to pairwise comparison on the same inputs, running each pair in both orders to cancel position bias, allowing ties, reporting win rate with a confidence interval, controlling for length bias, and checking judge agreement with human picks."
---

Pairwise evals show a judge two outputs for the same input, usually from two versions of your system, and ask which one is better. The result is a win rate rather than an average score. Picking the better of two answers is an easier and more consistent judgment than placing one answer on a scale, for humans and models alike.

The problem pairwise evals solve is a flat absolute score. A team rewrote a summarization prompt and their [LLM-as-judge](./llm-as-judge.md) gave both versions an average of 7.8 out of 10, while every reviewer who read them side by side preferred the new one. Absolute scores tend to bunch in a narrow band and shift with small changes to the rubric or the judge; a direct comparison forces a decision on exactly the difference you changed.

| | Absolute scoring | Pairwise |
|---|---|---|
| Question asked | "How good is this answer?" | "Which of these two is better?" |
| Sensitivity to small changes | Low | High |
| Output | Mean score per version | Win, loss and tie rate |
| Comparing many versions | Easy, score each once | Needs many pairs or a rating system |
| Tells you if it is good enough | Yes, against a threshold | No, only which is better |

Judges have a strong position bias, so every pair must run twice. Show A then B, then B then A, and count a win only when the judge agrees in both orders; otherwise record a tie. Length bias matters too, because judges tend to prefer the longer answer, so check whether your winner simply writes more. Calibrate the judge on a sample of pairs that humans have already picked.

Pairwise results answer "better" but not "good". A new prompt can win 70 percent of comparisons and still fail a hard requirement, so keep absolute pass/fail checks in your [regression evals](./regression-evals.md) alongside the comparison. Report the win rate with a confidence interval, since 55 percent on 40 pairs is noise. The same chosen/rejected pairs also make good training data for preference methods such as [DPO](./dpo.md).

_Usage:_

- "Absolute scores were flat, but B wins 68 percent head to head."
- "Run every pair in both orders. The judge loves whatever comes first."
- "Is B actually better, or just longer?"
