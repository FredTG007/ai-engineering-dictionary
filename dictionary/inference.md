---
title: Inference
description: Running a trained model to produce output for a given input; the per-request compute you pay for in production.
difficulty: beginner
interview: "You moved a long-document summarization job to self-hosted GPUs and throughput came in far below your estimate. What did the sizing likely miss?"
interviewAnswer: "Covers the prefill versus decode split, with long prompts making prefill dominate and driving time to first token, sizing on output speed alone being wrong, and fixes like request batching and KV cache reuse for shared prefixes, tracked as tokens and latency per feature."
buildThis:
  title: Build a local token counter and cost tracker for model inference
  goal: Track precise latency and per-token compute costs while executing a local open-weight model.
  steps:
    - Download a small open-weight model using Ollama or Hugging Face Transformers.
    - Write a wrapper script to measure time-to-first-token and total generation time.
    - Calculate cost metrics dynamically based on standard API pricing tiers.
    - Log request parameters, tokens generated, and execution time to a local CSV file.
  skills:
    - Python
    - Ollama
    - Performance Tracking
    - APIs
  time: under an hour
  stretch: Build a simple web dashboard using Streamlit to visualize inference latency across different prompt lengths.
---

Inference is the act of running a trained model on new input to get output. Training is when the model's weights are learned; inference is everything after, every time a user sends a message and the model replies. For most AI engineering teams, inference is the only phase they touch, either by calling a hosted API or by running a model on their own hardware.

Inference for an [LLM](./llm.md) happens in two stages. In the prefill stage, the model processes the whole input [prompt](./prompt.md) at once, which is relatively fast per token because it runs in parallel. In the decode stage, it generates output one token at a time, each step depending on the last, which is the bottleneck that [speculative decoding](./speculative-decoding.md) attacks. Prefill length drives [time to first token](./time-to-first-token.md); decode length drives total response time.

This split explains many cost and speed surprises. One team moved a summarization job from a hosted API to self-hosted [GPU serving](./gpu-serving.md) to save money, then found throughput far below their estimate. Their documents were long, so prefill dominated, and they had sized the hardware based on output speed alone. Enabling request [batching](./batching.md) and reusing the [KV cache](./kv-cache.md) for a shared prefix brought throughput up to where the business case worked.

Inference cost scales with usage, unlike training, which is a one-off. That makes it an operating expense to watch closely. Track tokens and latency per feature, and remember that a small change in prompt length, multiplied by millions of requests, is often the largest line on the bill.

_Usage:_

- "Inference is our biggest cloud cost now, bigger than storage."
- "Prefill is killing us, the prompts are 20k tokens each."
- "We don't train anything, we just pay for inference."
