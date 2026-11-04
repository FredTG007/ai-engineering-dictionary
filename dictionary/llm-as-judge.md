---
title: LLM-as-Judge
description: Using a language model with a scoring rubric to grade another model's outputs when exact-match checks are not possible.
difficulty: intermediate
interview: "You want to replace manual review of chatbot answers with an LLM judge. How would you make sure its scores can be trusted?"
interviewAnswer: "Covers calibrating the judge against human-labeled examples and measuring agreement, using a clear rubric with specific criteria, checking position, length and self-preference bias, pairwise versus absolute scoring, and periodically re-auditing samples by hand."
---

LLM-as-judge is the technique of using a language model to grade outputs from your system, guided by a rubric, when a simple programmatic check cannot decide whether an answer is good. It makes it possible to score qualities like correctness of a free-form answer, tone, completeness or groundedness across thousands of cases without a human reading each one.

It fills a gap that every team hits. Exact-match scoring works for classification, but for a support reply there are many correct phrasings and many subtly wrong ones. One team's string-similarity metric rated a reply as 91 percent similar to the reference, even though it said "you are eligible" where the reference said "you are not eligible." A judge model asked the specific question "does the answer reach the same eligibility conclusion as the reference?" caught it immediately.

Good judges are narrow and explicit. A prompt that asks "rate this answer from 1 to 10" produces noisy, inflated scores. Prompts that work better ask one question at a time, define each label, require a short justification before the verdict, and return [structured output](./structured-output.md) such as `{"supported": false, "reason": "..."}`. Binary or three-level scales are easier to calibrate than wide numeric ranges.

Judges have known biases that you need to control for:

- **Position bias:** in pairwise comparisons, preferring whichever answer comes first. Swap the order and average.
- **Length bias:** favoring longer answers regardless of quality.
- **Self-preference:** rating outputs from the same model family more kindly.
- **Leniency:** passing answers that sound confident.

A judge is itself a model you have to evaluate. Before trusting it, have humans label a sample of a hundred or so cases and measure how often the judge agrees. Re-check that agreement when you change the judge prompt or model, and set [temperature](./temperature.md) low for consistency. Used this way, an LLM judge becomes a dependable scorer inside your [evals](./evals.md), and it is especially useful for checking [grounding](./grounding.md) in [RAG](./rag.md) outputs.

_Usage:_

- "The judge agreed with our human labels 88 percent of the time. Good enough for CI."
- "Swap the A/B order. I think the judge just likes whichever answer it sees first."
- "Make it output pass/fail with a reason, not a score out of ten."
