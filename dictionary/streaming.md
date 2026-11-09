---
title: Streaming
description: Sending a model's output to the client token by token as it is generated, rather than waiting for the full response.
difficulty: beginner
interview: "Streaming works on your laptop, but in production the whole reply shows up at once after eight seconds. Where do you look?"
interviewAnswer: "Covers proxies, gateways or load balancers buffering server-sent events, checking those settings, and the wider changes streaming brings: handling streams that fail midway, timeouts for stalled streams, partial JSON, and output moderation before text reaches the user."
buildThis:
  title: Build a real-time streaming text client
  goal: Build a web app that displays model responses token by token as they arrive over the network.
  steps:
    - Set up a basic FastAPI backend that calls an LLM API with streaming enabled.
    - Create a minimal HTML and JavaScript frontend that reads the server-sent events stream.
    - Update the DOM incrementally as each text chunk arrives from the server.
    - Measure and display the total generation time once the stream completes.
  skills:
    - FastAPI
    - JavaScript
    - Server-Sent Events
  time: an afternoon
  stretch: Add a typing indicator that fades out once the first token arrives and a smooth auto-scroll effect.
---

Streaming is returning model output incrementally while it is still being generated. Instead of one HTTP response after the model finishes, the server sends a sequence of small chunks, usually over server-sent events, and the client renders them as they arrive. Most LLM APIs support it with a single flag.

The main benefit is perceived speed. Total generation time does not change, but the user sees the first words after the [time to first token](./time-to-first-token.md) rather than after the full response. For a reply that takes eight seconds to complete, that can be the difference between a user waiting and a user leaving. Chat products almost always stream for this reason.

Streaming adds engineering work in places teams do not expect. Proxies and load balancers sometimes buffer responses, so streaming works locally and then arrives all at once in production. One team spent two days on exactly that before finding a gateway setting that held responses until they completed. Error handling also changes: a request can start successfully and fail halfway, so the client needs a way to show a partial answer and offer a retry, and your [retries and timeouts](./retries-and-timeouts.md) logic must treat a stalled stream differently from a failed request.

Some features fit poorly with streaming. If you need [structured output](./structured-output.md) that must be validated before use, you either wait for the full object or use a parser that handles partial JSON. Output [guardrails](./guardrails.md) are harder too, since text has already reached the user before you can check the whole response; teams often check in small windows or hold back the final chunk until moderation passes.

For [voice agents](./voice-agents.md), streaming is essential end to end. Model output is streamed into text-to-speech so the agent can start speaking before the sentence is complete, which keeps conversational pauses short.

_Usage:_

- "It streams fine locally but the load balancer is buffering it in prod."
- "We stream the answer but hold the last chunk until moderation passes."
- "Streaming doesn't make it faster, it just makes it feel faster."
