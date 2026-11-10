---
title: Parent-Document Retrieval
description: Match on small chunks for precision, then hand the model the larger passage those chunks came from.
difficulty: intermediate
interview: "Your RAG bot retrieves the right 200-token chunk from a pricing table but still quotes the wrong column. What is happening and what retrieval change would you try first?"
interviewAnswer: "Covers how tiny chunks match well but arrive without the headers and surrounding rows that give them meaning, indexing small children while storing a pointer to a larger parent section, swapping children for parents before generation with deduplication, and measuring answer accuracy and context size before and after."
buildThis:
  title: Index small chunks, answer from their parents
  goal: Build a two-level index where retrieval happens on sentences but generation sees whole sections.
  steps:
    - Split a long document into sections, then split each section into sentence-sized child chunks that store their parent section id.
    - Embed only the child chunks into a local vector store.
    - Retrieve the top ten children for a question, map them to parents, and deduplicate.
    - Send the unique parent sections to the model and compare answers against sending the raw children.
  skills:
    - chunking
    - embeddings
    - Python
    - vector database
  time: an afternoon
  stretch: Log context token counts per request and find the parent size where accuracy stops improving.
---

Parent-document retrieval separates the text you search over from the text you give the model. You index small chunks, because small chunks produce precise embeddings and match specific questions well. When a small chunk is retrieved, you swap it for the larger section it was cut from, because the model needs the surrounding context to answer correctly. Some libraries call the same idea small-to-big or parent-child chunking.

The problem it solves shows up as soon as [chunking](./chunking.md) gets aggressive. A fintech team tuned their [RAG](./rag.md) pipeline down to 200-token chunks after seeing recall improve on their eval set, and recall did improve. Answers got worse. A chunk containing "Enterprise: 2.1 percent plus 30 cents" matched fee questions perfectly, but the chunk had lost the table header that said whether those figures applied to domestic or international cards. The model picked one, and it was the wrong one about half the time. The retrieval was right; the context was starved.

The fix is a two-level index. Each child chunk stores a pointer to its parent, which might be the enclosing section, the full table with its header, or a window of a few hundred tokens around the child. Retrieval runs on children. Before generation, children are replaced by their parents and duplicates are collapsed, so three hits inside one section yield one section in the prompt.

| Chunk size | Match precision | Context for the model | Tokens per request |
| --- | --- | --- | --- |
| Sentence-sized | High | Too little on its own | Low |
| Paragraph-sized | Medium | Usually enough | Medium |
| Section-sized | Low, averaged meaning | Plenty, sometimes noisy | High |
| Child match, parent sent | High | Plenty | Medium to high |

Choosing the parent size is the main tuning decision. Too small and you are back to orphaned facts. Too large and you push the [context window](./context-window.md) toward noise, and a parent of several thousand tokens can crowd out other relevant sections. A [reranking](./reranking.md) pass over the parents, scored against the original question, keeps the best ones when many children fire at once.

Parent-document retrieval is one of two common answers to orphaned chunks. The other is [contextual retrieval](./contextual-retrieval.md), which writes the missing context into each chunk before indexing. They combine well: contextual descriptions make children easier to find, and parent expansion gives the model the full picture once they are found.

_Usage:_

- "The chunk matched, it just didn't know which table it came from. Send the parent."
- "We index sentences and generate from sections now; accuracy came back up without hurting recall."
- "Three children from the same section collapsed to one parent, so the context actually shrank."
