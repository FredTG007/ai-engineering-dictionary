---
title: Fine-Tuning
description: Further training a pretrained model on your own examples so it adopts a specific format, style, or narrow skill more reliably.
---

Fine-tuning means continuing to train an existing [LLM](./llm.md) on a dataset of your own examples so that its weights shift toward the behaviour you want. You provide pairs of inputs and ideal outputs, the training process adjusts the model, and you get a new model version that you call like any other. It changes how the model behaves by default, rather than relying on instructions in each [prompt](./prompt.md).

The most common mistake is reaching for fine-tuning to teach the model facts. A team trained a model on their internal wiki hoping it would answer policy questions, and it confidently produced answers that blended old and new policies. Fine-tuning is poor at reliably storing and updating knowledge; when the wiki changed, they had to retrain. [RAG](./rag.md) suited the problem better, because retrieval can be updated in minutes and cites its sources.

Fine-tuning works well for consistent form and narrow skills. Good fits include always producing a strict output format, matching a house writing style, classifying into a fixed label set, or handling a domain's jargon. A classification feature that needed a 2,000-token [few-shot prompting](./few-shot-prompting.md) block to behave reliably, for example, can often be replaced by a fine-tuned small model with a short prompt, cutting both cost and latency.

Data quality matters more than data quantity. A few hundred carefully reviewed examples usually beat thousands of noisy ones, because the model learns the noise too. Hold out a test set before training, and compare the fine-tuned model against the best prompt-only baseline on your [evals](./evals.md). Many teams discover the baseline was nearly as good once the prompt was improved, which saves the ongoing cost of maintaining a custom model.

Fine-tuning creates operational obligations. Each custom model must be retrained when the base model is deprecated, re-evaluated when data changes, and versioned like code. Parameter-efficient methods such as [LoRA](./lora.md) make training cheaper and let you serve several variants on one base model, while [distillation](./distillation.md) is a specific use of fine-tuning to transfer a large model's behaviour into a smaller one.

_Usage:_

- "Don't fine-tune to teach it the refund policy; put the policy in retrieval."
- "The fine-tuned small model matches the big one on classification at a tenth of the cost."
- "We need 300 clean examples, not 5,000 scraped ones."
