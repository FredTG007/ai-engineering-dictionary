---
title: Software 1.0 / 2.0 / 3.0
description: Three ways to program behaviour, with explicit code, learned weights, or natural-language prompts to a model.
difficulty: beginner
interview: "A product manager edited a prompt in the admin panel on Friday and refund approvals doubled over the weekend. What does this incident say about how your team treats prompts, and what would you change?"
interviewAnswer: "Covers that prompts are program code in natural language and need the same discipline as other code: version control, review, evals before release and the ability to roll back, so the fix is to move prompts into the repo with a regression suite and a release process rather than banning edits."
buildThis:
  title: Solve one task three ways
  goal: Implement the same text classification with rules, a trained model and a prompt, then compare them.
  steps:
    - Choose a small labelled dataset such as spam versus not spam.
    - Write a rule-based classifier with keyword lists and regexes.
    - Train a logistic regression on the same training split.
    - Write a prompt for a hosted LLM and run it zero-shot on the test split.
    - Compare accuracy, cost per thousand items, and how long each took to change when you add a new category.
  skills:
    - Python
    - scikit-learn
    - Prompting
  time: a day
  stretch: Write a short decision note on which approach you would ship and under what conditions you would switch.
---

Software 1.0, 2.0 and 3.0 is a framing, popularised by Andrej Karpathy, for three different ways of getting a computer to do something. In 1.0 a person writes explicit instructions in a programming language. In 2.0 the "program" is the weights of a neural network, found by training on data rather than written by hand. In 3.0 the program is a [prompt](./prompt.md) written in plain English, and the computer that runs it is a large language model.

The framing is useful because it says what kind of artefact a prompt is. It is not configuration and it is not documentation; it is source code that happens to be in a natural language and to run on a probabilistic interpreter. That has consequences for how a team should handle it. Prompts need version control and review, behaviour needs to be tested with [evals](./evals.md) rather than unit tests alone, and a change needs a rollback path.

Teams that treat prompts as copy rather than code pay for it. A product manager at one company edited the refund-assistant prompt directly in an admin panel on a Friday afternoon to make it "friendlier". The new wording also softened the eligibility rules, and automatic refund approvals doubled over the weekend before anyone connected the two. There was no diff, no review and no test. Moving prompts into the repository with [prompt versioning](./prompt-versioning.md) and a regression suite fixed the process, not the person.

| Layer | The program is | Changed by | Tested with |
| --- | --- | --- | --- |
| Software 1.0 | Hand-written code | Editing code | Unit and integration tests |
| Software 2.0 | Learned weights | [Fine-tuning](./fine-tuning.md) and retraining on data | Held-out datasets and metrics |
| Software 3.0 | Prompts in natural language | Editing text | Evals and regression suites |

Most real systems mix all three. Code handles routing, validation and anything that must be exactly right; weights handle perception and judgement; prompts handle instructions that change often or are hard to specify formally. The design skill is deciding which layer each requirement belongs in, and keeping a human able to step in, which is what an [autonomy slider](./autonomy-slider.md) is for.

_Usage:_

- "That prompt is production code; it goes through review like everything else."
- "Validation stays in 1.0, I don't want a model deciding whether an email address is valid."
- "We moved the tone rules into the prompt and the eligibility rules back into code."
