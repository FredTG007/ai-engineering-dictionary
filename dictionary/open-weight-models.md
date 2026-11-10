---
title: Open-Weight Models
description: Models whose trained weights are published for download, so you can run, inspect, and fine-tune them on your own infrastructure.
difficulty: beginner
interview: "A healthcare client cannot send patient data to an external API. When would you recommend an open-weight model, and what trade-offs would you explain?"
interviewAnswer: "Covers keeping data inside their own network, owning GPU serving, patching and on-call, checking quality with your own evals rather than leaderboards, reading license terms for commercial use and derivatives, cost only winning at high volume, and stability from pinned weights."
buildThis:
  title: Run and prompt a local open-weight model
  goal: Download, run, and query an open-weight language model entirely on your local hardware.
  steps:
    - Install Ollama or Llama.cpp on your local machine.
    - Download a lightweight open-weight model like Llama 3 or Mistral.
    - Write a short Python script using the local endpoint to generate text.
    - Measure the tokens per second generated on your machine.
  skills:
    - Ollama
    - Local Inference
    - Python
  time: under an hour
  stretch: "Modify the model's system prompt or generation parameters via a local configuration file."
---

An open-weight model is one whose trained parameters are released for anyone to download and run, usually as both a [base and a chat variant](./base-vs-chat-model.md). Unlike models available only through a provider's API, you can host an open-weight model on your own hardware, modify it through [fine-tuning](./fine-tuning.md), and keep all data inside your network. "Open weight" is narrower than fully open source: the training data and code are often not released, and licenses vary from permissive to restrictive.

Teams usually turn to open-weight models for data control, cost at high volume, or customization. A healthcare company that could not send patient notes to an external API ran an open-weight model inside its own cloud account, which satisfied its compliance review in weeks rather than months. Another team with a narrow, high-volume classification task found a small open-weight model, adapted with [LoRA](./lora.md), cheaper than any hosted option once traffic passed a few million calls per day.

The trade-off is that you take on operations the provider used to handle. Self-hosting means owning [GPU serving](./gpu-serving.md), capacity planning, security patching, upgrades, and on-call. The model may also trail the strongest proprietary models on difficult reasoning, so quality has to be confirmed with your own [evals](./evals.md) rather than public leaderboard scores, which rarely reflect a specific workload.

| Factor | Hosted proprietary API | Self-hosted open-weight |
|---|---|---|
| Setup effort | Minutes | Days to weeks |
| Data leaves your network | Yes | No |
| Cost at low volume | Low | High (idle GPUs) |
| Cost at high volume | Grows linearly | Can be much lower |
| Customization | Limited | Full fine-tuning, adapters |
| Version control | Provider decides | You pin exactly |

Licenses need reading, not assuming. Some open-weight licenses restrict commercial use above a user threshold, forbid certain applications, or require attribution, and these terms also govern derivatives such as fine-tunes and [distillation](./distillation.md) outputs. Check before you build a product on one.

Open-weight models also help with stability. Because you control the exact weights, the model cannot change underneath you, which removes one source of [drift](./drift.md). Many teams use them alongside hosted models, for example as a [fallback model](./fallback-models.md) during provider outages or as the cheap tier in a routing setup.

_Usage:_

- "Compliance won't approve the external API, so we're running an open-weight model in our VPC."
- "Read the license; the commercial terms change above a certain number of monthly users."
- "Leaderboards say it's close to the big models, but our eval says otherwise on contracts."
