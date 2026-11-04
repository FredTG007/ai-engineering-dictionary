---
title: Batching
description: Grouping multiple requests so they are processed together, raising hardware efficiency or lowering cost at the expense of latency.
---

Batching means processing several requests together instead of one at a time. In LLM systems the word covers two related ideas: server-side batching, where an inference engine runs many users' requests through the GPU in the same forward pass, and client-side batching, where you submit a large set of offline jobs to a provider's batch API for cheaper, slower processing. Both trade some per-request latency for much better efficiency.

Server-side batching is what makes self-hosted models cost effective. A GPU generating tokens for a single request spends most of its time waiting on memory, leaving compute idle. A team that launched a self-hosted model with batching disabled saw one request at a time served at decent speed, but [throughput](./throughput.md) collapsed as soon as a dozen users arrived, and queues grew to minutes. Turning on continuous batching, where new requests join the running batch as soon as others finish, raised total tokens per second several-fold on the same hardware.

Batch size is a direct trade-off between throughput and [latency](./latency.md). Larger batches use the GPU more fully, but each request shares compute with more neighbours, so individual responses slow down and [time to first token](./time-to-first-token.md) rises under load. Batches are also bounded by memory, since every sequence in the batch needs space in the [KV cache](./kv-cache.md). Serving configurations usually cap concurrent sequences to keep p95 latency within a target.

Client-side batch APIs suit work that does not need an immediate answer. Nightly classification, backfilling [embeddings](./embeddings.md), running large [evals](./evals.md), and bulk summarization can be submitted as a file of requests, processed within hours, and billed at a meaningful discount. Batch jobs also typically draw from a separate quota, which keeps them from competing with interactive traffic for [rate limits](./rate-limits.md).

The main mistake is batching work that users are waiting on. A report generator moved to a batch API to save money, and users who clicked "generate" then waited up to an hour. Keep interactive paths on synchronous calls, and move only genuinely asynchronous jobs to batch processing.

_Usage:_

- "Send the reindex through the batch API, it's half price and nobody's waiting on it."
- "Continuous batching tripled tokens per second, but p95 went up, so cap the batch size."
- "Don't batch the chat endpoint; people are staring at a spinner."
