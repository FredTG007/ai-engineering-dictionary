---
title: Context Engineering
description: The practice of deciding exactly what information goes into a model's context on each call, in what form and in what order.
difficulty: intermediate
interview: "Your agent's answers got worse after you added more retrieved documents, tool outputs and history to every call. How do you decide what goes into the context?"
interviewAnswer: "Covers treating context as a limited budget, ranking and trimming retrieved chunks, summarizing old turns and verbose tool results, placing key instructions and evidence where the model attends well, and measuring quality, cost and latency per context change with evals."
---

Context engineering is the work of deciding what goes into the model's [context window](./context-window.md) on every call: which instructions, which retrieved documents, which conversation history, which tool results, and in what order and format. Prompt writing is one part of it. The larger part is the code that assembles everything around the prompt.

It becomes a discipline of its own once a system has several sources competing for space. A typical failure: an assistant performed well in demos, then started ignoring its formatting rules in long sessions. The cause was not the instructions themselves. Thirty turns of history and four large tool outputs had pushed the [system prompt](./system-prompt.md) far from the end of the context, and the rules were drowned out. Nothing in the prompt changed; the context around it did.

Most context decisions are trade-offs between completeness, cost and focus.

| Decision | More | Less |
|---|---|---|
| Retrieved chunks | Higher chance the answer is present | Lower cost, less distraction |
| Conversation history | Better continuity | Fewer stale or conflicting details |
| Tool output detail | Model sees everything | Model sees what matters |
| Examples | Clearer format | Room for actual content |

A few habits hold up across systems. Summarize or trim old conversation turns instead of passing them verbatim. Strip tool responses down to the fields the model needs; a raw 8,000-token JSON payload is rarely the right input. Put stable content first so it can benefit from caching, and put the most decision-relevant material close to the question. Label each section clearly so the model can tell instructions from data, which also helps against injected text.

Treat context assembly as code you test. Log the exact final context for each request, because a bug in what you sent looks identical to a model mistake from the outside. Run [evals](./evals.md) when you change retrieval depth, history length or summarization, not only when you change wording. In [agent](./agent.md) systems and [RAG](./rag.md) pipelines alike, the quality ceiling is usually set by what the model was shown, not by how it was asked.

_Usage:_

- "The prompt is fine. We're stuffing 40 turns of history in front of it."
- "Trim the tool response to five fields before it goes back into context."
- "Dump the full assembled context for that trace. I bet the doc never made it in."
