---
title: Output Filtering
description: Checking or rewriting a model's reply after generation, before the user sees it, to catch leaks, policy violations and bad formats.
difficulty: intermediate
interview: "Your support bot streams replies and last week a customer's phone number appeared in the first chunk even though you have a PII filter. What happened and how would you redesign the filter?"
interviewAnswer: "Covers that per-token streaming bypasses a filter that only runs on the full reply, options such as buffering until sentence boundaries or scanning a sliding window with a hold-back, cheap deterministic checks first and a classifier or judge only for subtle cases, and measuring the extra latency the filter adds."
buildThis:
  title: Streaming-safe output filter
  goal: Build a filter that scans a streamed model reply for phone numbers and emails and redacts them before any chunk reaches the client.
  steps:
    - Stream a reply from any model API and print chunks as they arrive to see how small they are.
    - Add a buffer that holds back the last thirty characters so a pattern split across chunks can still be matched.
    - Run regex checks for phone numbers and emails on the buffer and replace matches before releasing text.
    - Send twenty test prompts that tempt the model to repeat contact details and confirm nothing leaks.
  skills:
    - streaming
    - regex
    - Python
    - PII handling
  time: an afternoon
  stretch: Add a small classifier call on each completed sentence for policy violations and measure how much latency it adds to time to first token.
---

Output filtering is the check that runs on a model's reply after it has been generated and before anyone sees it. The filter can block the reply, rewrite part of it, or route it to a fallback message. It covers things the input side cannot know in advance: personal data the model pulled from retrieved context, a policy violation phrased politely enough to pass the prompt, a markdown table where the client expected JSON, or a confident claim that no source supports.

Filters belong at the output because the earlier layers miss things. A [system prompt](./system-prompt.md) asks the model to behave and input [guardrails](./guardrails.md) screen the user's message, but neither sees what the model actually wrote. One support team learned this when a customer reported that the bot had repeated another customer's phone number. The number came from a retrieved ticket, so [PII redaction](./pii-redaction.md) on the user input never saw it, and the prompt instruction to never share contact details was simply ignored once the number was in context. A regex on the output would have caught it in a millisecond.

Streaming makes output filtering harder than it looks. That same team had a filter, but it ran on the completed reply while the client was already rendering tokens as they arrived through [streaming](./streaming.md). The phone number went out in the first chunk and the redaction arrived too late to matter. The fixes are to hold back a short window of text so patterns split across chunks can still match, to release text only at sentence boundaries, or to accept a few hundred milliseconds of buffering for the sensitive parts of a conversation.

| Check | Cost | Catches | Misses |
| --- | --- | --- | --- |
| Regex and string rules | Near zero | Phone numbers, emails, banned phrases, format | Anything phrased differently |
| Schema validation | Near zero | Malformed [structured output](./structured-output.md) | Valid JSON with wrong content |
| Classifier | Milliseconds | Toxicity, [content moderation](./content-moderation.md) categories | Subtle policy breaches |
| Judge model | Hundreds of milliseconds, real money | Unsupported claims, tone, [citation verification](./citation-verification.md) | Whatever the judge is wrong about |

Order the checks from cheapest to most expensive and stop early. Deterministic rules run on every reply, classifiers run on replies that pass them, and a judge model runs only where the stakes justify its latency and cost. The same rules double as [assertion-based evals](./assertion-based-evals.md) in your test suite, so a filter that fires in production should become a test case the next morning. Log every filter action with the trace, because a filter that blocks silently will hide a prompt regression for weeks.

_Usage:_

- "The output filter blocked eleven replies yesterday, and nine of them were the model quoting the retrieved ticket verbatim."
- "Hold back the last thirty characters of the stream or the regex never sees a whole number."
- "Run the cheap checks first; the judge only looks at replies that mention money."
