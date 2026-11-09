---
title: Online vs Offline Evals
description: Offline evals score a fixed dataset before release; online evals measure live traffic after it. You need both.
difficulty: intermediate
interview: "A prompt change passed every offline eval, but a week after release escalations to human agents rose 15 percent. How would you explain the gap and change your eval setup?"
interviewAnswer: "Covers offline sets missing real traffic patterns, online signals such as escalations, feedback and sampled judge scores on production traces, staged rollouts or A/B tests to compare versions live, and feeding production failures back into the offline set."
buildThis:
  title: Build an offline test runner and online logger
  goal: Compare evaluation results from a static test dataset against feedback logged from live runs.
  steps:
    - Create a JSON file with 10 test prompts and expected output keywords.
    - Write an offline script that scores model responses against this test set.
    - Add a live logging hook that saves production inputs and user thumbs-up or down signals.
    - Compare the offline accuracy score against the ratio of positive online feedback.
  skills:
    - Evals
    - Testing
    - Python
  time: a weekend
  stretch: Automate the offline test runner to execute every time you update your prompt templates.
---

Offline evals run your system over a fixed dataset before a change ships; online evals measure how the system behaves on real traffic after it ships. Offline evals tell you whether a change is safe to release, and online evals tell you whether it actually helped. Each one covers the other's blind spot.

The gap shows up as a release that passed everything and still hurt. A team's new prompt beat the old one on their [golden dataset](./golden-dataset.md), shipped, and a week later escalations to human agents were up 15 percent. Their offline set was built from tidy, single-question tickets, while real users pasted long email threads with three questions in them. No offline number could have revealed a traffic pattern the dataset did not contain.

| | Offline | Online |
|---|---|---|
| Inputs | Curated, fixed, repeatable | Live user traffic |
| When it runs | Before merge or release | After release, continuously |
| Typical signals | Pass rate, judge scores, accuracy | Escalations, retries, feedback, sampled judge scores |
| Strength | Fast, comparable across versions | Reflects what users really send |
| Weakness | Only as good as the dataset | Noisy, slow, and users see the failures |

Online evals take a few forms. You can sample production traces and score them with the same [LLM-as-judge](./llm-as-judge.md) rubric you use offline, watch behavioural signals such as copy events, regenerations and [user feedback](./user-feedback-loops.md), or run a controlled comparison through [A/B testing](./ab-testing-prompts.md). Online scoring also catches [drift](./drift.md), when traffic or a provider's model changes under you with no deploy at all.

The two loops should feed each other. Offline [regression evals](./regression-evals.md) gate every change, a staged rollout watches online signals for the first hours, and every production failure worth fixing becomes a new offline case. A team that only runs offline evals ships confidently into surprises; a team that only runs online evals lets users find every bug first.

_Usage:_

- "Offline says it's fine. Let's roll it to 5 percent and watch escalations."
- "We judge a one percent sample of production traces every night."
- "That failure never shows up offline because nobody pastes email threads into the test set."
