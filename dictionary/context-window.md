---
title: Context Window
description: The maximum number of tokens a model can consider in one request, covering both the input you send and the output it writes.
difficulty: beginner
interview: "Users say your assistant forgets constraints they gave early in long chats, yet no request ever errors. What is likely happening and how would you fix it?"
interviewAnswer: "Covers silent truncation of history to stay under the token limit, logging what gets dropped and how full the window gets, and fixes such as pinning key facts, summarizing older turns or retrieving on demand, noting that bigger windows cost more and dilute attention."
---

The context window is the hard limit on how much text a model can see in a single call. It is measured in [tokens](./tokens.md) and includes everything: the [system prompt](./system-prompt.md), conversation history, retrieved documents, tool results and the response the model is about to generate. Anything outside the window simply does not exist for that request.

Running out of room fails in two ways. The loud way is an API error because the request exceeded the limit. The quiet way is worse: your own code truncates older messages to fit, and the model loses information without anyone noticing. One team found their assistant ignoring the user's dietary restrictions late in long conversations. The restriction had been stated in turn two, and the history trimmer dropped it once the chat grew past a certain length.

A bigger window is not a free fix. Long inputs cost more, increase [time to first token](./time-to-first-token.md), and models tend to pay less attention to material buried in the middle of a long context than to the start and end. Stuffing an entire knowledge base into a large window often performs worse than retrieving the five most relevant passages with [RAG](./rag.md).

| Strategy | When it helps | Cost |
| --- | --- | --- |
| Truncate oldest messages | Short chats, simple bots | Silent loss of early facts |
| Summarize history | Long conversations | Extra call, some detail lost |
| Retrieve on demand | Large document sets | Retrieval pipeline to build |
| Pin key facts | User preferences, constraints | Manual curation |

Treating the window as a budget is the core of [context engineering](./context-engineering.md). Decide what deserves space on every call, measure how full the window gets in real traffic, and log what was dropped. That turns a mysterious "it forgot" bug into something you can see and fix.

_Usage:_

- "We're hitting the context window on long tickets, so the history trimmer is eating the original complaint."
- "Just because it fits in the window doesn't mean the model will use it."
- "Pin the user's constraints at the top so they survive truncation."
