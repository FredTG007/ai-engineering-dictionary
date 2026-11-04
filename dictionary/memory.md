---
title: Memory
description: Mechanisms that let an LLM application keep and recall information across turns or sessions beyond a single context window.
---

Memory, in LLM applications, is any mechanism that lets the system keep information and bring it back later, beyond what fits in or survives a single call. Models are stateless; everything they "remember" must be sent again in the [context window](./context-window.md) on each request, so memory is really a question of what you store and what you choose to send back.

Two opposite symptoms push teams toward a memory design. The first is forgetting: a user tells a travel assistant they are vegetarian, and three sessions later it recommends a steakhouse. The second is overloading: a team kept every past message in the prompt to avoid forgetting, and after a few weeks long-running users hit context limits, costs per message climbed, and the assistant started surfacing details from months-old conversations that were no longer true.

It helps to separate memory by scope:

| Type | Holds | Typical implementation |
|---|---|---|
| Working memory | The current conversation and tool results | Message list, trimmed or summarized |
| Session summary | Key points from a long conversation | Periodic model-written summary |
| Long-term memory | Durable facts and preferences about a user | Key-value store or [vector database](./vector-database.md) |
| Task state | Progress on a multi-step job | Structured record the [agent](./agent.md) reads and updates |

Writing memory is harder than reading it. Deciding what is worth keeping, when a fact has changed, and when to forget is where most designs struggle. Extracting short, explicit facts ("diet: vegetarian, updated 2026-03-02") works better than storing raw transcripts, and timestamps let you prefer recent information over stale information. Retrieving long-term memory is usually a small [RAG](./rag.md) problem: find the few relevant facts for this request, not everything known about the user.

Memory brings privacy and safety obligations. Users should be able to see and delete what is stored about them, sensitive data may need [PII redaction](./pii-redaction.md) before it is saved, and anything written to memory from untrusted content can carry injected instructions into future sessions. Treat memory as a feature with its own [evals](./evals.md), checking both that important facts are recalled and that outdated ones are not.

_Usage:_

- "It forgot she's vegetarian again. We're not persisting preferences between sessions."
- "Stop replaying the full history. Summarize anything older than twenty turns."
- "Memory writes need a timestamp, or we'll keep trusting last year's address."
