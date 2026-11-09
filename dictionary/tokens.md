---
title: Tokens
description: The chunks of text a language model actually reads and writes, and the unit you are billed and rate-limited by.
difficulty: beginner
interview: "Your LLM bill tripled this month with flat traffic, and the only recent change was a feature that adds API data to prompts. How do you investigate?"
interviewAnswer: "Covers measuring input and output tokens per feature, noting that JSON keys, braces and quotes tokenize poorly, trimming fields or reformatting data compactly, output being priced higher than input, and adding per-feature cost tracking so spikes surface in days."
buildThis:
  title: Build a token-budget cost calculator
  goal: Create a command-line tool that estimates API costs and tracks character-to-token ratios across different model tokenizers.
  steps:
    - Install official tokenizers libraries for popular open and proprietary models.
    - Write a function to count tokens for any input text file.
    - Calculate estimated input and output costs based on current pricing tiers.
    - Output a summary table comparing token counts across different models.
  skills:
    - Python
    - API Pricing
    - CLI
  time: under an hour
  stretch: Build a local web UI using Streamlit that highlights individual tokens with alternating background colors as you type.
---

Tokens are the units of text a language model processes. A [tokenizer](./tokenizer.md) splits input into pieces that are often whole common words, fragments of rarer words, punctuation or whitespace. As a rough rule, one token is about four characters of English, but code, numbers and non-English text usually take more tokens per character.

Tokens matter because almost every limit and cost in an [LLM](./llm.md) system is measured in them. The [context window](./context-window.md) is a token budget. Provider pricing is per million input and output tokens, with output usually priced several times higher. [Rate limits](./rate-limits.md) are often expressed as tokens per minute. If you only think in characters or words, your estimates will drift.

A common production surprise is the bill that jumps without any change in traffic. One team saw costs triple in a month and traced it to a feature that pasted full JSON API responses into the prompt. The payloads were full of repeated keys, quotes and braces, all of which tokenize poorly. Trimming the fields and reformatting the data as compact text cut input tokens by about 70 percent. Proper [cost tracking](./cost-tracking.md) per feature would have caught it in days rather than weeks.

Output tokens deserve separate attention because they drive both cost and [latency](./latency.md). The model generates output one token at a time, so a response twice as long takes roughly twice as long to finish. Asking for concise answers, capping the maximum output length, and avoiding verbose formats are the cheapest optimizations available. Always count with the tokenizer for the specific model you call, since different model families split the same text differently.

_Usage:_

- "That prompt is 9k tokens before the user even types anything."
- "Output tokens are four times the price, so tell it to stop writing essays."
- "Run it through the tokenizer, character counts are useless for budgeting."
