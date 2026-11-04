---
title: Few-Shot Prompting
description: Including a handful of worked input-output examples in a prompt so the model copies the pattern, format and tone you want.
---

Few-shot prompting means showing the model a few examples of the task before asking it to do the real one. Instead of describing the desired output in abstract terms, you include two to five pairs of input and ideal output in the [prompt](./prompt.md), then append the new input. The model picks up the pattern and continues it. Zero-shot is the same request with no examples.

Examples communicate things that instructions struggle with. Format, length, tone and the handling of borderline cases are all easier to show than to describe. A team building a ticket classifier spent days rewording category definitions and still saw "billing" and "account" confused. Adding six labelled examples, including two ambiguous ones with the correct label, lifted accuracy on their [golden dataset](./golden-dataset.md) by twelve points in an afternoon.

The examples you choose shape the output more than you might expect. If every example is short, answers will be short. If three of four examples are labelled "positive", the model will lean towards "positive". If examples share an odd phrasing, it will show up in production. Pick examples that cover the range of real inputs, balance the labels, and include at least one tricky case.

| Approach | Strength | Weakness |
| --- | --- | --- |
| Zero-shot | Short, cheap prompt | Format and edge cases drift |
| Few-shot, fixed examples | Consistent output | Examples may not match the input |
| Few-shot, retrieved examples | Examples close to each input | Needs [embeddings](./embeddings.md) and a store |

Few-shot examples cost [tokens](./tokens.md) on every request, so they compete with retrieved context for space. For high-volume tasks with stable requirements, [fine-tuning](./fine-tuning.md) on many examples can replace a long few-shot prompt. For most teams, though, a well-chosen handful of examples is the cheapest improvement available.

_Usage:_

- "Stop rewriting the instructions and just add three examples."
- "All our few-shot examples were in English, so it started replying in English to Spanish tickets."
- "Retrieve the examples per request instead of hardcoding them."
