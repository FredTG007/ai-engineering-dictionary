---
title: Error Analysis
description: Reading a sample of real failures, labelling what went wrong, and counting the categories before deciding what to fix.
difficulty: intermediate
interview: "Your RAG assistant's thumbs-down rate doubled after a launch and the team wants to swap the model. What would you do before agreeing to that?"
interviewAnswer: "Covers pulling a sample of failing traces, reading them and writing open notes, grouping notes into failure categories and counting them, fixing the largest category first, and turning each category into eval cases so the fix can be measured."
buildThis:
  title: Tag and categorize LLM failures in a spreadsheet
  goal: Build a systematic error categorization workflow to find out why an LLM prompt fails.
  steps:
    - Collect 50 prompt-response pairs where the system output was incorrect.
    - Define 4 common failure tags (e.g., hallucination, missing context, format error).
    - Manually tag each failure and generate a summary count of the most frequent issues.
  skills:
    - Debugging
    - Data Categorization
    - Analysis
  time: under an hour
  stretch: Write a Python script that parses your tagged CSV and plots a failure frequency chart.
---

Error analysis is the habit of reading a sample of your system's actual failures, writing down what went wrong in each one, and counting how often each kind of failure appears. It sounds too simple to need a name, but it is the step teams skip most often, and skipping it is how they end up fixing the wrong thing.

The usual symptom is a team arguing about a fix nobody has measured. After a launch, a support assistant's thumbs-down rate doubled and the first proposal was to switch to a larger model. Someone pulled 100 bad conversations from [tracing](./tracing.md) and read them. Forty-one failed because the right help article was never retrieved, 22 because the bot answered from an outdated pricing page, and only nine looked like reasoning mistakes a bigger model might fix. The model swap would have addressed the smallest bucket at the highest cost.

The process has a few plain steps:

| Step | What you do |
|---|---|
| Sample | Pull 50 to 200 failing or flagged traces, not hand-picked ones |
| Annotate | Write a short free-text note on the first thing that went wrong |
| Group | Cluster the notes into a handful of named failure categories, a [failure taxonomy](./failure-taxonomy.md) |
| Count | Rank categories by frequency and by how much they hurt users |
| Act | Fix the top category, then add its cases to your [evals](./evals.md) |

Note the first failure, not every failure. In an [agent](./agent.md) trace, a bad tool choice at step two often causes everything after it, and counting the downstream symptoms inflates the wrong categories. Keep the categories coarse at first; you can split them once you see which ones matter.

Error analysis is what makes the rest of an eval suite meaningful. Generic metrics such as "helpfulness" rarely match the ways your product actually breaks, while categories that come from reading real traces become specific checks, often scored by an [LLM-as-judge](./llm-as-judge.md) calibrated on the examples you just labelled. Repeat the exercise after every significant change, because fixing the top category reshuffles the list.

_Usage:_

- "Before we argue about models, can someone read fifty of the bad traces?"
- "Retrieval misses are 40 percent of the failures. That's the first thing to fix."
- "Tag the first thing that went wrong, not everything that went wrong."
