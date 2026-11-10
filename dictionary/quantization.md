---
title: Quantization
description: Storing model weights with fewer bits, such as 8 or 4 instead of 16, so models use less memory and run faster at some quality cost.
difficulty: advanced
interview: "Your 70B model barely fits on your GPUs and you want to quantize it to 4-bit. How would you decide whether the quality loss is acceptable?"
interviewAnswer: "Covers memory and speed gains from fewer bits per weight, choosing methods like 8-bit versus 4-bit, and running the golden eval set on both versions. Watches for losses on reasoning, long context or non-English tasks, and checks real throughput on the target hardware."
buildThis:
  title: Run a Quantized Local Model
  goal: Compare the RAM usage and generation speed of a 4-bit model versus a 16-bit model.
  steps:
    - Download a small open-source model in GGUF format using a tool like Ollama or llama.cpp.
    - Monitor your system RAM and GPU VRAM usage while running an inference pass.
    - Download a heavier unquantized version of the same model size.
    - Compare output quality and hardware resource consumption between the two formats.
  skills:
    - GGUF
    - Ollama
    - hardware optimization
    - inference
  time: an afternoon
  stretch: Plot a latency-versus-perplexity curve for 2-bit, 4-bit, 8-bit, and 16-bit versions of the same base model.
---

Quantization reduces the numeric precision used to store and compute a model's weights, and sometimes its activations and [KV cache](./kv-cache.md). A model trained in 16-bit floating point can be converted to 8-bit or 4-bit representations, cutting its memory footprint by half or more. Less memory means a model fits on smaller or fewer GPUs, and less data to move per token usually means faster generation.

Teams typically reach for quantization when a model does not fit their hardware. One team self-hosting a 70-billion-parameter [open-weight model](./open-weight-models.md) needed roughly 140 GB of GPU memory at 16-bit, which meant two expensive cards. A 4-bit version fit on a single card with room left for the cache, halving their serving cost. The catch appeared later: the quantized model made more arithmetic mistakes in their invoice-checking flow, which their spot checks had not covered.

The quality cost is real but uneven. Eight-bit quantization is close to lossless for most workloads. Four-bit is often acceptable for chat and summarization but can hurt math, code, long-context recall, and strict [structured output](./structured-output.md). Smaller models tend to suffer more than larger ones, because they have less redundancy to absorb the lost precision.

| Precision | Memory vs 16-bit | Typical quality impact |
|---|---|---|
| 16-bit (FP16/BF16) | 1x | Baseline |
| 8-bit | ~0.5x | Usually negligible |
| 4-bit | ~0.25x | Noticeable on reasoning, math, code |
| Below 4-bit | <0.25x | Often significant degradation |

The only reliable way to choose a level is to measure on your own tasks. Run your [evals](./evals.md) on both the full-precision and quantized versions, paying attention to the categories most sensitive to precision. Also measure [throughput](./throughput.md) and latency on your actual [GPU serving](./gpu-serving.md) stack, since speedups depend on whether the hardware and kernels support the chosen format efficiently. Quantization is common when serving locally, and it is also how [LoRA](./lora.md) variants like [QLoRA](./qlora.md) fit large base models onto modest hardware during training.

_Usage:_

- "The 4-bit build fits on one card, but it fumbles the totals on long invoices."
- "Run the eval at 8-bit first; it's usually free quality-wise."
- "Quantizing the KV cache got us double the concurrent sessions."
