---
title: Transformer
description: The neural network architecture behind modern LLMs, built around attention so every token can weigh every earlier token.
difficulty: intermediate
interview: "A teammate asks why doubling the prompt length made your self-hosted model more than twice as slow to start answering. How would you explain it using the transformer architecture?"
interviewAnswer: "Covers self-attention comparing every token with every earlier token, so the attention part of prefill grows quadratically with prompt length on top of linear work in the rest of each layer, the KV cache growing linearly during decoding, and mitigations such as shorter prompts, prefix caching and optimized attention kernels."
buildThis:
  title: Build a tiny self-attention module
  goal: Implement scaled dot-product attention from scratch using NumPy to understand how tokens interact.
  steps:
    - Create random query, key, and value matrices for a small sequence of token vectors.
    - Compute the dot product of queries and keys to get raw attention scores.
    - Scale the scores by the square root of the head dimension and apply softmax.
    - Multiply the attention weights by the value matrix to produce context-aware vectors.
  skills:
    - NumPy
    - Linear Algebra
    - Neural Networks
  time: a day
  stretch: Extend the single-head attention function into multi-head attention by splitting the hidden dimension.
---

A transformer is the neural network architecture almost every modern [LLM](./llm.md) is built on. It processes a sequence of [tokens](./tokens.md) through a stack of identical layers, and each layer has two main parts: an attention block that lets each token gather information from other tokens, and a feed-forward block that transforms each token's representation on its own.

Attention is the idea that makes the architecture work. For every token, the layer computes three vectors: a query, a key and a value. It scores the token's query against the keys of the other tokens, turns those scores into weights with a softmax, and takes a weighted sum of their values. A model generating text uses causal attention, so each token can only look at tokens before it. Many attention "heads" run in parallel, each free to learn a different kind of relationship, such as which noun a pronoun refers to.

The architecture explains several symptoms engineers see in production. One team found that doubling their prompt length made the first token arrive more than twice as late. Attention compares every token with every earlier token, so its share of the prompt-processing work grows with the square of the prompt length. The feed-forward blocks and projections grow only linearly and dominate at moderate lengths, but as prompts get longer the quadratic part takes over, while the memory held in the [KV cache](./kv-cache.md) grows linearly. Long prompts are expensive in a way that word counts do not suggest.

| Part | What it does | Why you care |
|---|---|---|
| Embedding layer | Maps token IDs to vectors | Vocabulary set by the [tokenizer](./tokenizer.md) |
| Attention | Mixes information across tokens | Cost grows with context length |
| Feed-forward | Transforms each token independently | Holds most of the parameters |
| Output head | Scores every possible next token | Feeds [temperature](./temperature.md) and sampling |

You rarely need the maths to build applications, but the shape matters. Knowing that generation is one forward pass per output token explains why output length drives [latency](./latency.md), why the [context window](./context-window.md) has a hard limit, and why serving tricks like [speculative decoding](./speculative-decoding.md) and caching target the parts they do.

_Usage:_

- "It's a transformer, so a 100k-token prompt is going to cost you at prefill no matter what."
- "Attention can see the whole context, but that doesn't mean it uses all of it well."
- "Most of the parameters are in the feed-forward layers, not the attention heads."
