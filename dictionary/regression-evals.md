---
title: Regression Evals
description: Evals run automatically on every change to catch cases where something that used to work stops working.
difficulty: intermediate
interview: "A prompt change to make answers concise also dropped a required medical disclaimer, and nobody noticed for two weeks. How would you design a suite to block that at merge time?"
interviewAnswer: "Covers a CI suite built from past bugs, compliance cases and key intents with clear pass conditions, handling non-determinism with low temperature, repeats and pass rates, comparing per-category scores to a baseline, and tying results to prompt and model versions."
buildThis:
  title: Set up automated regression evals for prompt updates
  goal: Build a CI-style eval script that prevents prompt updates from breaking previously passing test cases.
  steps:
    - Create a JSON file containing ten input queries and their corresponding golden reference answers.
    - Write a Python script that runs the current prompt against all ten test cases.
    - Use an LLM-as-a-judge score function to check if the new output matches or exceeds the required quality threshold.
    - Exit with a non-zero error code if any test case score drops below the historical baseline.
  skills:
    - Evals
    - CI/CD
    - Python
  time: an afternoon
  stretch: Hook the script into a GitHub Action so it automatically runs and comments on pull requests that modify prompt files.
---

Regression evals are evals that run automatically whenever the system changes, with the specific job of catching anything that used to work and no longer does. They are the LLM equivalent of a regression test suite in CI: less about measuring overall quality and more about guarding what you have already fixed.

The need is driven by how changes interact in LLM systems. A small edit meant to fix one behavior often breaks another. One team added a line to the [system prompt](./system-prompt.md) telling the model to be concise; it fixed rambling answers and also caused the model to drop the safety disclaimer required on medical questions. Nobody noticed for two weeks because nobody was looking at medical questions when they tested conciseness.

A regression suite is built from cases you already care about. It typically draws from a [golden dataset](./golden-dataset.md), with priority given to past bugs, compliance-critical behaviors and high-traffic intents. Each case needs a clear pass or fail condition, scored by code where possible and by an [LLM-as-judge](./llm-as-judge.md) where not.

| Trigger | What to run |
|---|---|
| Prompt edit | Full regression suite |
| Model or provider upgrade | Full suite, plus a manual review of diffs |
| Retrieval or chunking change | Retrieval-focused cases and end-to-end answers |
| Tool or schema change | Agent and tool-selection cases |

Non-determinism makes regression checks noisier than ordinary tests. A case that passes 9 times out of 10 will eventually fail on a change that had nothing to do with it. Set [temperature](./temperature.md) low for eval runs, repeat flaky cases several times and use pass rates, and compare against the baseline's score rather than demanding 100 percent. A threshold like "no category drops more than two points" is more practical than "every case passes."

Make the suite cheap enough to run on every pull request, and keep a larger nightly run for depth. Pair it with [prompt versioning](./prompt-versioning.md) so every result is tied to the exact prompt and model that produced it. When a regression slips through anyway, add that case to the suite the same day.

_Usage:_

- "The concise-mode PR failed regression on the medical disclaimer cases."
- "That one's flaky; it passes seven of ten on main too. Look at the category score."
- "We bumped the model version and three extraction cases regressed. Blocking the upgrade."
