---
title: Throughput
description: How much work a model deployment completes per unit of time, measured in tokens or requests per second across all users.
difficulty: intermediate
interview: "Your self-hosted model handles one user quickly but falls over at fifty concurrent users. How do you think about throughput versus latency?"
interviewAnswer: "Covers tokens or requests per second across all users versus per-request speed. Discusses batching and continuous batching, GPU memory limits from the KV cache, how larger batches raise per-user latency, and load testing at realistic concurrency and prompt lengths."
---

Throughput is the total amount of work a system completes over time, usually measured in output tokens per second or requests per second across all concurrent users. It is a property of the whole deployment, not of a single request. [Latency](./latency.md) tells you how long one user waits; throughput tells you how many users you can serve at once with acceptable waits.

The two are easy to confuse until load arrives. A team benchmarked their self-hosted model by sending one request at a time, measured 80 tokens per second, and sized hardware assuming that number would scale linearly with GPUs. In production, with 50 concurrent users, each user saw about 15 tokens per second while total throughput was far higher than the benchmark suggested. Their capacity estimate was wrong in both directions: they had overestimated per-user speed and underestimated total capacity.

Several factors set the throughput of an LLM deployment. [Batching](./batching.md) is the largest lever, because GPUs are much more efficient when processing many sequences together. Memory limits how many sequences fit at once, which ties throughput to [KV cache](./kv-cache.md) size, context length, and [quantization](./quantization.md). Output length matters too: generating tokens is slower per token than processing the prompt, so a workload of long answers needs far more capacity than one of short classifications.

| Metric | Measures | Who cares |
|---|---|---|
| Output tokens/sec (total) | Deployment capacity | Capacity planning, cost per token |
| Output tokens/sec (per request) | Streaming speed users perceive | Product and UX |
| Requests/sec | Volume of calls handled | Short-response workloads |
| Time to first token | Wait before output starts | Interactive features |

Measure throughput under realistic concurrency and request shapes. Load tests should replay real prompt and output length distributions and report throughput alongside p50 and p95 latency at each concurrency level. The useful result is a curve showing where latency starts to degrade; that point, not peak throughput, sets how many users one replica can serve. For hosted models, effective throughput is often capped by provider [rate limits](./rate-limits.md) rather than hardware, so the same planning applies to quotas. Feed these numbers into [GPU serving](./gpu-serving.md) decisions and [cost tracking](./cost-tracking.md).

_Usage:_

- "Single-request benchmarks are useless for sizing; test at fifty concurrent."
- "We doubled throughput but per-user speed dropped below what feels like streaming."
- "Find the concurrency where p95 bends and size replicas from there."
