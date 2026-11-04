---
title: KV Cache
description: Memory where a model stores attention data for tokens already processed, so each new token doesn't recompute the whole sequence.
difficulty: advanced
interview: "Your self-hosted model handles forty concurrent short chats but fails at eight when users paste long documents. Why, and how would you raise capacity?"
interviewAnswer: "Covers KV cache memory growing with sequence length times concurrent requests, out-of-memory errors and queuing, paged cache management, grouped-query attention and cache quantization, capping context length, prefix caching for shared prompts, and prefill versus decode behavior."
---

The KV cache is the memory a transformer model uses to avoid redoing work during generation. Each layer computes key and value vectors for every token it has seen; rather than recomputing these for the whole sequence each time a new token is produced, the model stores them and only computes the new token's entries. This is what makes token-by-token generation affordable.

For application engineers the cache matters mainly because it consumes GPU memory in proportion to sequence length and the number of concurrent requests. A team self-hosting a model found that their server handled 40 simultaneous chats with short prompts but fell over at eight when users pasted long documents. The model weights had not changed; the KV cache for those long sequences filled the GPU, and new requests queued or failed with out-of-memory errors.

Cache size drives several serving decisions. Longer [context windows](./context-window.md) and more concurrent sessions both multiply memory, so capacity planning for [GPU serving](./gpu-serving.md) has to count the cache, not just the weights. Techniques such as paged memory management, grouped-query attention in the model architecture, and [quantization](./quantization.md) of cached values all exist to fit more sequences into the same memory, which directly raises [throughput](./throughput.md).

The cache also explains why the two phases of a request behave differently. Processing the prompt, often called prefill, fills the cache for all input tokens at once and dominates [time to first token](./time-to-first-token.md). Generation then reads the growing cache for each new token, which is limited by memory bandwidth more than raw compute. Long prompts make the first token slow; long outputs make the total response slow.

Reusing the cache across requests is the idea behind [prompt caching](./prompt-caching.md). When many requests share an identical prefix, a server can keep that prefix's cache entries and skip prefill for it on later calls. Hosted providers expose this as a discount and latency improvement; self-hosted inference engines offer prefix caching that does the same thing within your own deployment.

_Usage:_

- "We're not compute bound, the KV cache is eating all the memory at long contexts."
- "Turn on prefix caching so the shared system prompt doesn't get prefilled every time."
- "Cap max context at 16k or we can only serve a handful of sessions per GPU."
