---
title: Supervised Fine-Tuning (SFT)
description: Training a pretrained model on prompt and ideal-response pairs so it learns to imitate those responses.
difficulty: advanced
interview: "After SFT on 2,000 support transcripts, your model copies agents' typos and sometimes invents order numbers. What went wrong and how would you rebuild the dataset?"
interviewAnswer: "Covers SFT imitating its data, including errors and facts the model cannot know, cleaning and reviewing examples, removing answers that depend on unavailable information, masking loss to response tokens, holding out a test set, and comparing against a prompt-only baseline."
buildThis:
  title: Fine-tune a model on custom instructions
  goal: Train an open-weights model on a small dataset of custom prompt-response pairs using QLoRA.
  steps:
    - Format a small CSV dataset of input prompts and target responses into JSONL.
    - Set up an Unsloth or Hugging Face training script with 4-bit quantization.
    - Run the fine-tuning loop for a few epochs on a cloud GPU notebook.
    - Test the trained model against the base model on held-out prompts.
  skills:
    - PyTorch
    - QLoRA
    - Hugging Face
  time: a day
  stretch: Evaluate the fine-tuned model against the base model using an automated LLM-as-a-judge scoring script.
---

Supervised fine-tuning (SFT) trains a pretrained model on examples of a prompt paired with the response you want, adjusting its weights so it produces similar responses to similar prompts. It is the most common form of [fine-tuning](./fine-tuning.md), and it is also the stage that turns a raw pretrained [LLM](./llm.md) into an instruction-following assistant before any preference training.

SFT teaches imitation, and the model imitates everything in the data. A team fine-tuned a small model on 2,000 real support transcripts and found it reproduced agents' typos, their habit of saying "let me check that for you" with nothing to check, and order numbers that looked plausible but did not exist. The human agents had looked those numbers up in a tool the model never saw, so the model learned to produce the shape of an order number without the lookup. That is a training-data cause of [hallucination](./hallucination.md).

The training objective is next-token prediction on the target response. Each example is formatted with the same chat template the model will see at inference time, and the loss is usually computed only on the response [tokens](./tokens.md), so the model learns to answer rather than to reproduce prompts. Getting the template wrong is a common silent bug: the tuned model works in the notebook and degrades behind the serving stack.

| Choice | Typical guidance |
|---|---|
| Dataset size | Hundreds to a few thousand reviewed examples for a narrow task |
| Data source | Curated or corrected outputs, not raw logs |
| Method | Full fine-tuning or [LoRA](./lora.md) adapters |
| Held-out set | Split before training, never tuned against |
| Baseline | The best prompt-only version of the same task |

SFT has limits that preference methods address. It shows the model one good answer per prompt but never says which of two plausible answers is worse, so it is weak at teaching subtle quality judgments. Teams that need that usually follow SFT with [DPO](./dpo.md) or [RLHF](./rlhf.md) on preference pairs. Measure each stage with [evals](./evals.md) against the untuned baseline, because a better prompt sometimes closes most of the gap.

_Usage:_

- "SFT learned the agents' typos. Clean the transcripts before the next run."
- "Mask the loss to the assistant turns; we were training it to write user messages."
- "Strip any example where the answer depends on data the model won't have."
