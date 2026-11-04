---
title: Distillation
description: Training a smaller, cheaper model to imitate a larger model's outputs on your task so you keep most of the quality at lower cost.
difficulty: advanced
interview: "A large model tags millions of documents well but costs more than the feature earns. How would you distill it, and how would you know the student is good enough?"
interviewAnswer: "Covers sampling inputs that match production, curating teacher outputs with validators or a judge, fine-tuning a small student, evaluating on an independently labeled golden set, task suitability for narrow tasks, license terms, and routing low-confidence cases back to the teacher."
---

Distillation is the process of using a large, capable model as a teacher to train a smaller student model. You run the teacher on many representative inputs, collect its outputs, and [fine-tune](./fine-tuning.md) the student on those input and output pairs. The student learns to reproduce the teacher's behavior on that task, usually at a fraction of the cost and with much lower latency.

The usual motivation is a feature that works well but costs too much at scale. A team running document tagging on millions of records found that the large model produced excellent labels but the monthly [inference](./inference.md) bill was larger than the feature's revenue. They ran the large model on 20,000 sampled documents, trained a small model on the results, and served the student instead. Quality on their [evals](./evals.md) dropped by about two points, while cost dropped by over 90%.

Distillation works best on narrow, well-defined tasks. Classification, extraction into a fixed schema, routing decisions, and short rewrites distill well because the student only needs to cover a limited range of behavior. Open-ended reasoning and broad conversation distill poorly; the student mimics the surface style without the underlying capability, and quality falls off sharply on inputs unlike the training set.

The teacher's outputs need curation, not blind copying. Teacher mistakes become student mistakes, so filter outputs with validators, spot checks, or an [LLM-as-judge](./llm-as-judge.md) before training. Make sure the input sample matches production traffic, including the awkward edge cases, and keep a held-out [golden dataset](./golden-dataset.md) labeled independently of the teacher so you are not only measuring how well the student copies.

Check the provider's terms before distilling. Some commercial model licenses restrict using outputs to train competing models, while many [open-weight models](./open-weight-models.md) permit it. Distillation also pairs naturally with [model routing](./model-routing.md): the student handles the common cases, and the router escalates unusual or low-confidence inputs to the teacher.

_Usage:_

- "Distill the tagger into the small model; the big one is overkill for twelve labels."
- "Filter the teacher outputs first, or the student learns its mistakes too."
- "The student is great on invoices and terrible on anything else, which is expected."
