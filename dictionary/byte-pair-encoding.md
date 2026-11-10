---
title: Byte-Pair Encoding (BPE)
description: The merge-based algorithm most tokenizers use to split text into subword pieces, and the source of their odd behaviour.
difficulty: intermediate
interview: "Support tickets in Thai cost your team three times as much per ticket as English ones with the same word count. Why, and what can you do about it?"
interviewAnswer: "Covers that BPE vocabularies are built from merge frequencies in mostly English training text, so scripts with fewer learned merges fall back to many small pieces and cost more tokens per word, and that fixes include measuring tokens per language in cost tracking, trimming prompts for those languages, or choosing a model whose tokenizer was trained on more multilingual text."
buildThis:
  title: Train a tiny BPE tokenizer from scratch
  goal: Implement the merge loop on a small corpus and watch the vocabulary form.
  steps:
    - Take a few thousand lines of text and split them into UTF-8 bytes.
    - Count adjacent pairs, merge the most frequent pair into a new symbol, and repeat two hundred times.
    - Print the first fifty merges and tokenize a few new sentences with the result.
    - Compare token counts for English, code and a non-Latin script sample.
  skills:
    - Python
    - Tokenization
    - Algorithms
  time: an afternoon
  stretch: Tokenize the same text with a production tokenizer and explain the three biggest differences in its merges.
---

Byte-pair encoding is the algorithm that builds the vocabulary used by most modern tokenizers. It starts with raw bytes as the only symbols, counts which adjacent pair appears most often in a training corpus, merges that pair into a new symbol, and repeats until the vocabulary reaches a target size. The result is a list of merge rules. Encoding new text replays those rules, so frequent words become one token while rare words shatter into several.

Because merges are learned from frequency, a [tokenizer](./tokenizer.md) behaves in ways that surprise people. A word with a leading space is usually a different token from the same word without one. Capitalised and lowercase forms are separate tokens. Numbers split into unpredictable groups of digits, so arithmetic is harder than it looks. Code indentation can consume a token per run of spaces. The tokenizer never sees meaning, only byte statistics.

The most expensive surprise is usually language. A team ran [cost tracking](./cost-tracking.md) by region and found that Thai support tickets cost about three times as much per ticket as English ones with similar word counts. The tokenizer's training data was mostly English, so Thai script had few learned merges and each character fell back to two or three byte-level tokens. The same effect also ate into the [context window](./context-window.md): long Thai conversations were being truncated far sooner than English ones.

| Text | Why BPE handles it well or badly |
| --- | --- |
| Common English words | Frequent, so one merge covers the whole word |
| Non-Latin scripts | Few merges learned, so many bytes per character |
| Digits | Grouped arbitrarily, so "2024" and "2025" can differ in token count |
| Indented code | Whitespace runs become their own tokens |

The practical response is to measure rather than assume. Count [tokens](./tokens.md) with the exact tokenizer of the model you call, break the numbers down by language and content type, and budget prompts accordingly. When one language dominates your cost, compare tokenizers across model families, since a vocabulary trained on more multilingual text can halve the bill without touching the prompt.

_Usage:_

- "The word count is the same; the token count is three times higher because it's Thai."
- "It's splitting the invoice numbers into weird digit groups, that's a BPE thing."
- "Leading space and no leading space are two different tokens, so your few-shot examples don't match."
