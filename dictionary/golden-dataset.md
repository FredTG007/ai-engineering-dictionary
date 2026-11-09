---
title: Golden Dataset
description: A curated, versioned set of inputs with known-good expected outputs that serves as the reference for running evals.
difficulty: intermediate
interview: "Your team wants to start running evals before each release but has no test data yet. How would you build a golden dataset?"
interviewAnswer: "Covers sampling real production inputs including hard and edge cases, writing expected outputs or grading criteria with domain experts, and versioning the set. Mentions keeping it representative as usage shifts, adding past failures, and avoiding leakage into prompts."
buildThis:
  title: Curate a Golden Dataset for a Support Bot
  goal: Build a versioned CSV reference file of tricky customer questions and verified ideal answers.
  steps:
    - Collect 20 historical customer support tickets along with their verified correct resolutions.
    - Format the inputs and expected outputs into a clean, version-controlled JSON or CSV file.
    - Write a quick evaluation script that checks new model answers against this reference file.
    - Calculate a baseline correctness score using exact match or semantic similarity.
  skills:
    - Evals
    - Dataset Curation
    - Testing
  time: an afternoon
  stretch: Automate the evaluation script to run in GitHub Actions every time the reference file changes.
---

A golden dataset is a curated collection of inputs paired with expected outputs, or with clear criteria for a good output, that you treat as the reference standard for [evals](./evals.md). It is the fixed ruler you measure every version of your system against.

The value of having one becomes obvious when you do not. A team comparing two models for a contract-summarization feature ran each on a fresh batch of random documents, got conflicting results on different days, and spent two weeks arguing. The real problem was that the inputs kept changing, so no comparison was apples to apples. A fixed set of 200 contracts with reviewed reference summaries settled the question in an afternoon.

Building a useful golden dataset is mostly curation work. Sources that tend to pay off:

- Real production inputs, sampled and anonymized, so the set reflects what users actually send.
- Past failures and bug reports, found through [error analysis](./error-analysis.md), each turned into a case with the correct answer.
- Edge cases chosen on purpose: empty inputs, very long ones, other languages, adversarial phrasing.
- Cases that test refusal or "I don't know" behavior, so the system is rewarded for not inventing answers.

Size matters less than coverage. A hundred well-chosen cases spread across your main user intents will tell you more than ten thousand near-duplicates of the most common question. Tag each case with its category so you can see scores broken down, since an overall average can hide a collapse in one important slice.

Treat the dataset like code. Store it in version control, review changes, and record which version each eval run used. Expected answers go stale: a [retrieval-augmented generation (RAG)](./rag.md) system over a help center will "fail" cases whose reference answers describe last year's policies. Schedule periodic review, and be careful about leakage, such as copying golden examples into a prompt as [few-shot prompting](./few-shot-prompting.md) examples, which inflates scores without improving the system. A held-out portion that nobody tunes against keeps you honest, and it is what makes [regression evals](./regression-evals.md) trustworthy.

_Usage:_

- "Which golden set version was that run on? The numbers don't match last week's."
- "Every escalated ticket becomes a golden case once someone writes the right answer."
- "Don't paste golden examples into the prompt. That's grading your own homework."
