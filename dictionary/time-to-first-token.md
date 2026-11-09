---
title: Time to First Token (TTFT)
description: The delay between sending a request and receiving the first generated token, which sets how responsive an AI feature feels.
difficulty: intermediate
interview: "Users say your chat assistant feels sluggish even though total response time is unchanged since you added a long system prompt and retrieval. What do you measure and fix?"
interviewAnswer: "Covers separating time to first token from total latency, prefill cost growing with prompt length, retrieval and reranking steps that run before generation, streaming output, prompt caching for shared prefixes, and tracking p50 and p95 TTFT separately."
buildThis:
  title: Build a latency tracker for LLM requests
  goal: Measure and log the time elapsed between sending a prompt and receiving the first generated token.
  steps:
    - Write a script that records a high-resolution timestamp right before sending an API request.
    - Listen to the streaming response chunk stream using an async client.
    - Record a second timestamp upon receiving the very first text chunk.
    - Compute the difference and print the Time to First Token (TTFT) in milliseconds.
  skills:
    - Python
    - Performance Profiling
    - Networking
  time: under an hour
  stretch: Compare TTFT across different input prompt lengths to see how prompt size affects prefill duration.
---

Time to first token is how long it takes from sending a request until the model emits its first piece of output. It covers network time, queueing at the provider, and the prefill phase of [inference](./inference.md), where the model reads the entire prompt before it can write anything. When responses are [streamed](./streaming.md), TTFT is the moment the user stops staring at a spinner.

TTFT is the metric users feel most directly in chat interfaces. A reply that starts after 400 milliseconds and takes six seconds to finish usually feels faster than one that appears all at once after four seconds. That is why it deserves its own dashboard panel, separate from total [latency](./latency.md).

The biggest driver you control is prompt length. Prefill time grows with the number of input [tokens](./tokens.md), so every retrieved document, tool definition and line of conversation history adds delay before the first word. One team watched TTFT creep from under a second to nearly four over a quarter. Nothing was broken; the system prompt had grown with each incident fix, retrieval had gone from three chunks to twelve, and long chats were sending full history on every turn. Trimming retrieval and summarizing older turns brought it back down.

Several other factors push TTFT up. Large models take longer to prefill than small ones. Reasoning models may spend seconds thinking before the first visible token. Provider queueing spikes at busy times, which shows up as TTFT variance rather than a steady increase. Cold starts on self-hosted endpoints can add many seconds to the first request after a quiet period.

The most effective fixes are shorter prompts and [prompt caching](./prompt-caching.md), which lets the provider skip prefill for a repeated prefix such as a long system prompt. Measure TTFT per route and per model in your [observability](./observability.md) stack, and alert on its p95, not just the average.

_Usage:_

- "TTFT is 3 seconds because we're stuffing twelve chunks into every prompt."
- "Turn on prompt caching for the system prompt, it should cut TTFT in half."
- "Users don't care about total time if TTFT is under a second."
