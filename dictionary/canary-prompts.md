---
title: Canary Prompts
description: Fixed probe prompts sent through the live system on a schedule, with alerts when their outputs change, to catch silent regressions.
difficulty: intermediate
interview: "Your provider updated the model behind your API alias overnight and your JSON parser started failing on a fraction of traffic. How would you detect this kind of change within minutes next time?"
interviewAnswer: "Covers sending a small fixed set of prompts through the production path on a schedule, checking each output with deterministic assertions and a hash or similarity against a recorded baseline, alerting on any delta, and pinning model versions or routing to a fallback when a canary trips."
buildThis:
  title: Run a canary probe against a model endpoint every hour
  goal: Detect a changed model or prompt by comparing probe outputs against a stored baseline and alerting on differences.
  steps:
    - Write ten prompts with deterministic expectations, such as a JSON shape, a required key, or a fixed classification label.
    - Store a baseline run with temperature zero, recording each output and the assertions it passes.
    - Schedule the probes with cron or a GitHub Action and compare each run against the baseline.
    - Send a message to a chat channel or email when any assertion or similarity check fails.
  skills:
    - Monitoring
    - Assertions
    - Cron
    - Python
  time: an afternoon
  stretch: Swap the model alias to an older version and confirm the canary fires within one scheduled run.
---

Canary prompts are a fixed set of probe requests sent through the production path on a schedule, with each output checked against a recorded baseline. They work like the canary in a mine: they are not real traffic, they are cheap to run, and when they change you know something upstream has changed before users tell you. The thing that changed can be a provider's model update, a prompt edit that slipped through, a broken retrieval index or a dependency behind a [gateway](./llm-gateway.md).

Silent model updates are the classic trigger. One team pointed their extraction service at a provider's floating model alias. A quiet update one night changed how the model cased JSON keys, so `orderId` became `order_id` in about a fifth of responses. The parser dropped those fields and the downstream job filled them with nulls. Nothing errored and no dashboard moved, because the requests all returned 200. Their canaries, ten fixed extraction prompts run every 20 minutes with a schema assertion, flagged the change within one cycle. Without them the first signal would have been a finance report a week later.

Good canaries have deterministic expectations. Run them at temperature zero and check them with [assertions](./assertion-based-evals.md): the output parses, a key is present, a classification label matches, a refusal fires on a probe that should be refused. For free-text probes, compare against the baseline with an embedding similarity threshold rather than exact matching, so you alert on a changed meaning rather than a changed comma. Keep the set small, 10 to 30 prompts, so the cost is negligible and the alert is readable.

| Signal | Offline [regression evals](./regression-evals.md) | Canary prompts |
| --- | --- | --- |
| When it runs | Before a release | Continuously in production |
| What it catches | Your changes | Changes you did not make |
| Size | Hundreds of cases | A handful of probes |

Canaries sit between [online and offline evals](./online-vs-offline-evals.md). They run against the live stack, which gives them the production prompt, model, index and config, but they use fixed inputs, which keeps the outputs comparable over time. That makes them an early detector for [drift](./drift.md) in the system itself rather than in user behaviour.

Wire the alert to an action. A tripped canary should page someone, pin the model to the last known version, or route traffic to a [fallback model](./fallback-models.md) until a person has looked. Log canary results alongside your [observability](./observability.md) data so the moment of change lines up with everything else you can see.

_Usage:_

- "The canaries fired at two in the morning. The provider swapped the model behind the alias."
- "Ten fixed prompts every twenty minutes, temperature zero, schema check on each one."
- "Pin the model version until we understand why canary seven started refusing."
