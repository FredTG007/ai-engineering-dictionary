---
title: Tokenizer
description: The component that splits text into the token IDs a model reads, usually learned with byte-pair encoding over a training corpus.
difficulty: intermediate
interview: "Your cost model, built on one provider's tokenizer, underestimated the bill by 30 percent after you switched model families, and Thai users cost more than English ones. What is going on?"
interviewAnswer: "Covers each model family having its own tokenizer and vocabulary, BPE merging frequent byte sequences so well-represented languages compress better than others, code, numbers and whitespace tokenizing differently, and counting with the target model's tokenizer per language and feature."
---

A tokenizer converts text into the sequence of integer IDs a model actually processes, and converts the model's output IDs back into text. It is fixed when the model is trained, so every [LLM](./llm.md) family ships with its own, and the same sentence can become a different number of [tokens](./tokens.md) depending on which model you call.

Most current tokenizers use byte-pair encoding (BPE) or a close relative. Training starts from individual bytes or characters and repeatedly merges the most frequent adjacent pair into a new symbol, until the vocabulary reaches a target size, commonly from about 32,000 to over 200,000 entries. Common words end up as single tokens, rarer words split into pieces, and in byte-level tokenizers anything unusual falls back to individual bytes, so no input is ever unrepresentable.

The merge rules reflect the training data, which produces uneven costs. A team that budgeted from English traffic found their Thai and Hindi users cost two to three times more per message, because those scripts were less common in the tokenizer's corpus and broke into many more tokens per word. The same effect hits code, long numbers and unusual whitespace. When they switched model families, their cost forecast was off by about 30 percent because they had kept counting with the old tokenizer.

| Input | Typical behaviour |
|---|---|
| Common English words | One token each, often including the leading space |
| Rare words and names | Split into several subword pieces |
| Numbers | Split into chunks, which is one reason arithmetic is unreliable |
| Non-Latin scripts | Often many more tokens per word |
| JSON and code | Braces, quotes and indentation add up quickly |

Tokenization also explains some odd model behaviour. A model sees "strawberry" as a few multi-letter pieces rather than individual letters, which is why it can miscount characters, and a stray trailing space can change how a prompt is split. For budgeting, [cost tracking](./cost-tracking.md) and [context window](./context-window.md) checks, always count with the exact tokenizer of the model you deploy.

_Usage:_

- "Don't estimate with characters divided by four, run the real tokenizer."
- "Our Korean prompts are nearly three times the tokens of the English ones."
- "The new model has a bigger vocabulary, so the same prompt got cheaper."
