---
title: LoRA (Low-Rank Adaptation)
description: A cheap fine-tuning method that trains small add-on matrices instead of all model weights, producing compact swappable adapters.
difficulty: advanced
interview: "You need distinct tone and terminology for twenty enterprise customers on one self-hosted model. How would LoRA adapters fit, and what are the operational trade-offs?"
interviewAnswer: "Covers training small low-rank matrices on a frozen base, so each customer gets a compact adapter instead of a full model copy. Discusses serving many adapters on one base, rank and data quality, retraining when the base changes, and evaluating each adapter against the base."
buildThis:
  title: Fine-tune a small model on custom text using a LoRA adapter
  goal: Train a low-rank adaptation matrix on a custom dataset without modifying the base model weights.
  steps:
    - Prepare a JSONL dataset containing fifty examples of a specific writing style.
    - Load an open-weight base model and apply PEFT LoRA configuration settings.
    - Run the training script using Hugging Face TRL or Unsloth on a free cloud GPU.
    - Save the resulting adapter weights separately from the base model.
  skills:
    - PEFT
    - Hugging Face
    - Fine-Tuning
    - Python
  time: an afternoon
  stretch: Compare the generation output of the base model against the LoRA-adapted model using identical prompts.
---

LoRA is a way to fine-tune a large model by training only a small number of extra parameters. Instead of updating every weight in the network, it freezes the original model and learns pairs of thin matrices that are added alongside selected layers. The result is an adapter that is often a few megabytes to a few hundred megabytes, compared with many gigabytes for a full copy of the model.

The practical reason teams adopt LoRA is cost and hardware. A team that wanted to [fine-tune](./fine-tuning.md) a mid-sized [open-weight model](./open-weight-models.md) for ticket classification found that full fine-tuning needed a multi-GPU node they did not have. With LoRA, the same job ran on a single GPU overnight, and the quality on their [evals](./evals.md) was within a point of what a full fine-tune achieved in a later comparison.

Adapters also change how you serve models. Because the base model stays frozen, one deployment can load many adapters and choose one per request, for example a separate adapter per customer or per task. This avoids running a full model copy for each variant, which would multiply GPU memory needs. Serving stacks for [GPU serving](./gpu-serving.md) increasingly support loading and switching adapters on the fly, though each adapter adds a little latency and memory overhead.

LoRA has a few settings that matter in practice. The rank controls adapter capacity: too low and the model cannot learn the task, too high and you lose the efficiency benefit and risk overfitting. Which layers receive adapters also affects quality. Variants such as QLoRA combine LoRA with [quantization](./quantization.md) of the frozen base model, cutting memory further so larger models fit on smaller cards.

The limits are the same as for fine-tuning generally. LoRA teaches style, format, and narrow skills well, but it does not make a model reliably know new facts, and a poorly curated dataset produces a poorly behaved adapter however efficient the training was. Treat adapters as versioned artifacts, tied to a specific base model version, because an adapter trained on one base will not work on another.

_Usage:_

- "Train a LoRA adapter per customer and hot-swap them on the shared base model."
- "Rank 8 underfit; bump it to 32 and rerun the eval."
- "That adapter was trained on the old base checkpoint, it won't load on the new one."
