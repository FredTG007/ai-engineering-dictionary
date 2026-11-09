---
title: A/B Testing Prompts
description: Serving two prompt versions to different slices of live traffic and comparing real user outcomes to decide which to keep.
difficulty: intermediate
interview: "Offline evals say your new prompt is better, but leadership wants proof in production. How would you design the A/B test?"
interviewAnswer: "Covers randomizing at the user or session level, choosing a primary metric such as resolution or task success plus guardrail metrics like cost and latency, sizing the sample for significance, logging prompt version per request, and watching for novelty effects."
buildThis:
  title: Split traffic between two prompt variants
  goal: Route incoming requests to two different prompts and log user ratings to find the better one.
  steps:
    - Set up a simple router script to randomly assign incoming user queries to Prompt A or Prompt B.
    - Call the LLM using both prompts and capture the generated outputs.
    - Collect a thumbs-up or thumbs-down feedback score from the user interface for each response.
    - Calculate the win rate for each prompt variant using a basic metrics aggregation script.
  skills:
    - Python
    - Routing
    - Analytics
  time: an afternoon
  stretch: Add automated statistical significance testing to stop the test early when one prompt clearly wins.
---

A/B testing prompts means splitting live traffic between two or more prompt versions and comparing how real users respond, so the decision about which version to keep rests on production outcomes rather than [offline scores](./online-vs-offline-evals.md) alone. It is the last step after offline [evals](./evals.md) say a change is safe to try.

Offline evals and live behavior can disagree, and that gap is the reason to test in production. One team's new onboarding prompt scored higher on their [LLM-as-judge](./llm-as-judge.md) helpfulness rubric, so they shipped it to everyone. Conversion to a paid plan dropped noticeably over the next week. The new prompt gave longer, more thorough answers that the judge liked and users skimmed past. A 50/50 split would have shown the drop within days and limited the damage.

Running a fair test requires a few basics:

- **Stable assignment:** hash a user or session ID so each person sees one variant consistently, rather than flipping on every message.
- **Clear version IDs:** tie each response to the exact prompt through [prompt versioning](./prompt-versioning.md), so the analysis is not muddied by edits during the test.
- **A primary metric chosen in advance:** task completion, [thumbs-up rate](./user-feedback-loops.md), escalation to a human, or conversion. Picking the best-looking metric afterwards produces false wins.
- **Guardrail metrics:** cost per conversation, [latency](./latency.md), and error or refusal rates, so a "winning" prompt that doubles token use is caught.

Sample size is often the hard part. Thumbs-up feedback is sparse, and LLM outputs are noisy, so small differences need a lot of traffic to confirm. Decide the minimum effect you care about and the run length before starting, and resist stopping the test early because a dashboard looks good on day two.

Not every change needs an A/B test. Bug fixes, safety fixes and format corrections should go through [regression evals](./regression-evals.md) and ship. Save live experiments for changes where user preference is the real question, such as tone, length, or how much the assistant asks before acting, and keep the losing variant's results, since they are useful evidence the next time someone proposes the same idea.

_Usage:_

- "The judge prefers B, but users bounce more on B. We're keeping A."
- "Assign by user ID, not request. People were getting a different personality every message."
- "We need two weeks at this traffic to detect a two-point lift. Don't call it Friday."
