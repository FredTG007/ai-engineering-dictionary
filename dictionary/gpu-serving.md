---
title: GPU Serving
description: Running model inference on your own GPU infrastructure, including the engines, scaling, and capacity planning that requires.
---

GPU serving is the work of hosting a model on GPUs you control and exposing it as an API to your applications. Rather than calling a provider, you choose hardware, run an inference engine that loads the weights and schedules requests, and handle scaling, monitoring, and upgrades yourself. It is how teams run [open-weight models](./open-weight-models.md), custom [fine-tuned](./fine-tuning.md) models, or workloads that cannot leave their network.

The motivation is usually cost at scale, data control, or latency, and the surprise is usually operational effort. A team moved a high-volume summarization workload off a hosted API to save money. The GPU bill was indeed lower, but the first month included two outages from out-of-memory crashes, a slow cold start that took twelve minutes to load weights on new nodes, and an engineer spending most of their time tuning the engine. The savings were real only after they counted those costs and built automation.

Memory is the central planning constraint. The model weights must fit, plus the [KV cache](./kv-cache.md) for every concurrent sequence, plus engine overhead. A rough budget starts with parameter count times bytes per parameter, adjusted by [quantization](./quantization.md), and then reserves the rest for cache. Large models are split across several GPUs with tensor or pipeline parallelism, which adds interconnect requirements and complexity.

Modern inference engines handle most of the hard scheduling. Open-source servers provide continuous [batching](./batching.md), paged cache memory, prefix caching, streaming, adapter loading for [LoRA](./lora.md), and an API compatible with common client libraries. Your job is to pick sensible limits for context length and concurrency, and to verify the resulting [throughput](./throughput.md) and latency under realistic load.

Autoscaling GPU serving is harder than scaling web servers. GPUs are expensive to keep idle, slow to provision, and models take minutes to load, so naive autoscaling reacts too late to traffic spikes. Common patterns keep a warm minimum of replicas, scale on queue depth or KV cache utilization rather than CPU, and route overflow to a hosted model through a fallback path. Track GPU utilization and cost per million tokens to confirm self-hosting still beats the API price.

_Usage:_

- "New replicas take ten minutes to load weights, so scale on queue depth, not CPU."
- "We're memory bound at 32k context; either quantize or add a second card."
- "Self-hosting only wins if utilization stays above about half."
