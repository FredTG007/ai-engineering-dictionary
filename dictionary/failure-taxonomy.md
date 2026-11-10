---
title: Failure Taxonomy
description: A named, counted set of recurring failure modes built from open-coded notes on real traces, used to decide what to fix and automate.
difficulty: intermediate
interview: "Leadership says the assistant is 'just not smart enough' and wants to switch to a bigger model. How would you turn that complaint into something you can measure and act on?"
interviewAnswer: "Covers reading a sample of real failing traces and writing a free-text note on the first thing that went wrong in each, grouping the notes into a handful of named modes, counting them, fixing the largest bucket first, and turning each mode into an eval so its count can be tracked over time."
buildThis:
  title: Build a failure taxonomy from one hundred traces
  goal: Turn free-text notes on real or simulated failures into a counted list of named failure modes with an eval for the top one.
  steps:
    - Gather one hundred traces from a system you run, or generate them by running a small assistant over realistic inputs.
    - For each trace, write a one-line note on the first thing that went wrong, in a spreadsheet, without choosing categories yet.
    - Group the notes into five to eight named modes and count how many traces fall into each.
    - Write an automated check for the most common mode and run it over the same hundred traces to see how well it agrees with your labels.
  skills:
    - Error analysis
    - Labelling
    - Spreadsheets
    - Python
  time: a day
  stretch: Re-run the taxonomy after one fix and show how the counts shifted.
---

A failure taxonomy is the short list of named ways your system breaks, each with a count of how often it happens. It is the output of [error analysis](./error-analysis.md): you read real traces, write a free note on what went wrong in each, then group the notes into modes and count them. The taxonomy turns a vague feeling that the bot is bad into a ranked list of specific problems you can fix, measure and automate.

Vague complaints are the symptom that calls for one. After a launch, one team's assistant was described in every stand-up as "just dumb", and the proposed fix was a larger model at three times the cost. An engineer pulled 100 flagged conversations from [tracing](./tracing.md) and wrote one line per trace. Grouping the notes produced six modes. Forty percent were a single mode: the assistant answered from a stale pricing page because the retrieval index was a month behind. Another 25 percent were the model ignoring the user's second question. Only eight traces looked like reasoning failures a bigger model might help with. Re-indexing nightly removed the largest bucket in a day.

The method is deliberately plain. Note first, categorise later, because deciding the categories up front makes you see only those categories. Note the first thing that went wrong, since a bad retrieval at step one causes a wrong answer at step four and counting both inflates the downstream symptom. Keep the modes coarse at first, around five to eight, and split one only when it is big enough to deserve its own fix.

| Mode | Count | Example note |
| --- | --- | --- |
| Stale retrieval | 40 | Quoted old price from last quarter's page |
| Ignored second question | 25 | User asked about delivery and returns, got delivery only |
| Over-refusal | 12 | Refused a plain order lookup as sensitive |
| Wrong tool arguments | 9 | Searched by email when the user gave an order ID |
| Reasoning error | 8 | Added tax twice |
| Format | 6 | Markdown table in a plain-text channel |

The taxonomy is what the rest of the eval stack hangs from. Each mode with a count worth caring about becomes a check: a rule in [assertion-based evals](./assertion-based-evals.md) where the failure can be stated as a rule, a criterion in a judge rubric where it cannot. Modes also tell a generator what to stress when you build [synthetic eval data](./synthetic-eval-data.md), and they give the [golden dataset](./golden-dataset.md) a reason for every case it contains.

Rebuild the taxonomy after each significant change. Fixing the top mode reshuffles the list, and new features bring new modes. Tracking the counts over time, alongside the usual [evals](./evals.md), is the closest thing an LLM product has to a bug tracker that reflects what users actually hit.

_Usage:_

- "'The bot is dumb' is six modes. One of them is forty percent, and it's a stale index."
- "Write the note first and pick the category later, or you'll only see the categories you expected."
- "Each mode over ten percent gets its own eval by Friday."
