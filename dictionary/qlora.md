---
title: QLoRA
description: LoRA fine-tuning on top of a 4-bit quantized frozen base model, so large models can be tuned on a single GPU.
difficulty: advanced
interview: "You want to fine-tune a 70B open-weight model for a legal summarisation task and the only hardware you can get is one 48GB GPU. How do you make it fit, and what do you give up?"
interviewAnswer: "Covers quantizing the frozen base to four bits so the weights fit in memory, training only small LoRA adapters in higher precision, the slower steps from dequantizing on the fly, and evaluating against a LoRA run on a bigger box to confirm the quality gap is acceptable."
buildThis:
  title: Fine-tune a 7B model on one free GPU with QLoRA
  goal: Train a QLoRA adapter for a small open-weight model on a free cloud GPU and measure memory, time and quality against the base.
  steps:
    - Prepare two hundred instruction and answer pairs for a narrow task such as rewriting ticket titles.
    - Load a 7B open-weight model in 4-bit using bitsandbytes and attach a LoRA config with PEFT.
    - Train for one epoch on a free Colab or Kaggle GPU, logging peak memory and step time.
    - Compare base and adapted outputs on fifty held-out examples with a simple pass or fail check.
  skills:
    - PEFT
    - quantization
    - Hugging Face
    - Python
  time: a day
  stretch: Run the same data as a standard LoRA on a 16-bit base using a rented GPU and compare quality and cost per run.
---

QLoRA is [LoRA](./lora.md) applied to a base model that has been quantized to four bits. The frozen base weights are stored in a compact format, the small adapter matrices are trained in normal precision, and during each step the base weights are dequantized on the fly to compute activations. The point is memory: a model that needs 140 gigabytes of weights in 16-bit precision needs roughly 35 in four-bit, which turns a multi-GPU node into a single card.

The memory arithmetic is why people reach for it. Full [fine-tuning](./fine-tuning.md) of a large [open-weight model](./open-weight-models.md) needs the weights, the gradients and the optimizer states, which is several times the weight size. Plain LoRA removes most of the gradient and optimizer cost but still holds the full-precision base. QLoRA shrinks the base too, which is the last big term. One team budgeted a multi-GPU cloud node for a 70B adapter run and spent about eighteen hundred dollars across three attempts while fixing data problems. The fourth run used QLoRA on a single 48 gigabyte GPU overnight for roughly twenty dollars, and its scores on their [evals](./evals.md) were within a point of the earlier runs.

| Method | What is trained | Base precision | Typical hardware for 70B | Step speed |
| --- | --- | --- | --- | --- |
| Full fine-tune | All weights | 16-bit | Multi-GPU node | Fastest per step |
| LoRA | Small adapters | 16-bit | Two to four large GPUs | Fast |
| QLoRA | Small adapters | 4-bit | One large GPU | Slower, due to dequantizing |

The trade-offs are speed and a small quality risk. Dequantizing the base at every step makes training slower per step than LoRA on the same hardware, so a run that fits is not always a run that finishes quickly. The [quantization](./quantization.md) also introduces a little noise into the frozen base, and the adapter learns on top of that noisy base. In most reports the gap to a 16-bit LoRA run is small, but it is a gap, and it should be measured on your task rather than assumed.

Serving needs a decision at the end. You can keep the quantized base and load the adapter alongside it, which keeps memory low and suits [GPU serving](./gpu-serving.md) stacks that already run quantized models. Or you can merge the adapter into a full-precision copy of the base for maximum quality, which brings the memory cost back. Either way the adapter is tied to the exact base checkpoint and quantization settings it was trained against. The data rules are unchanged from [supervised fine-tuning](./supervised-fine-tuning.md): QLoRA makes training cheap, and it will faithfully learn whatever is wrong with your two hundred examples.

_Usage:_

- "It fits on the one A6000 with QLoRA, but each epoch takes about twice as long."
- "We merged the adapter into the sixteen-bit base for serving, so check memory on the inference box."
- "Before we buy a node, run it QLoRA overnight and see if the quality is even close."
