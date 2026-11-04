---
title: LLM (Large Language Model)
description: A neural network trained on huge amounts of text to predict the next token, used as the core engine of most AI products.
---

A large language model is a neural network trained to predict the next piece of text given everything before it. That objective, repeated over trillions of [tokens](./tokens.md) and followed by post-training on instructions and human feedback, produces a system that can summarize, translate, classify, write code and hold a conversation. Nothing in the model "knows" facts the way a database does; it has learned statistical patterns that usually line up with facts, and sometimes do not.

For an engineer, the useful mental model is a stateless function. You send a [prompt](./prompt.md), the model reads it inside a fixed [context window](./context-window.md), and it returns generated text. It does not remember the previous request unless you send that history again. Teams that miss this point end up confused when a chatbot "forgets" the user's name halfway through a session, when the real cause is that the conversation history was trimmed before the call.

The gap between a pattern matcher and a source of truth shows up quickly in production. One support team shipped a bot that answered billing questions directly from the model, and within a week it had promised a customer a thirty-day refund window the company never offered. That is [hallucination](./hallucination.md), and it is a property of how these models work rather than a bug in one vendor's release. The fix was not a better model but feeding the bot the actual policy text through [RAG](./rag.md) and checking answers with [evals](./evals.md).

Choosing a model is mostly a trade-off between quality, cost and speed. Larger models tend to reason better but cost more per token and take longer to respond; smaller ones are cheap and fast but stumble on multi-step tasks. Most production systems end up using more than one, sending easy requests to a small model and hard ones to a large one, which is the idea behind [model routing](./model-routing.md).

_Usage:_

- "The LLM isn't the product; the retrieval and the evals around it are."
- "Swap the LLM for the smaller one on classification, it's ten times cheaper and just as accurate."
- "Remember the LLM is stateless, so we have to resend the chat history every turn."
