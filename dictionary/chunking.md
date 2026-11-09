---
title: Chunking
description: Splitting documents into smaller passages before embedding them, so retrieval can return focused, relevant pieces of text.
difficulty: beginner
interview: "Retrieval keeps returning passages that cut off halfway through the answer a user needs. How would you rethink your chunking?"
interviewAnswer: "Covers chunk size versus focus, overlap between chunks, splitting on document structure like headings rather than fixed character counts, and keeping metadata such as title and section. Mentions measuring retrieval hit rate on real questions before and after a change."
buildThis:
  title: Split long documents with overlapping chunks
  goal: Write a Python function that divides a long text file into smaller overlapping segments for retrieval.
  steps:
    - Write a script that reads a multi-page article or book chapter from a text file.
    - Implement a sliding window function that splits the text into chunks of 500 characters.
    - Add a 50-character overlap between adjacent chunks to prevent cutting sentences in half.
    - Print the resulting chunks to verify their sizes and boundary points.
  skills:
    - Text Processing
    - Python
    - RAG
  time: under an hour
  stretch: Implement semantic chunking by splitting text wherever embedding distance between sentences spikes.
---

Chunking is splitting source documents, once [document ingestion](./document-ingestion.md) has turned them into clean text, into smaller pieces before you embed and index them. A retrieval system rarely wants a whole fifty-page manual; it wants the two paragraphs that answer the question. Each chunk gets its own [embedding](./embeddings.md) and is stored in a [vector database](./vector-database.md), so the quality of your chunks sets an upper limit on what [similarity search](./similarity-search.md) can find.

Chunk size is a balancing act. Large chunks carry more context but blend several topics into one vector, so they match many queries loosely and few precisely, and they eat [tokens](./tokens.md) in the prompt. Small chunks match precisely but can lose the information needed to interpret them. A sentence like "This limit does not apply to enterprise plans" means little if the chunk does not say which limit.

That loss of context is a common source of wrong answers. One team's assistant told customers their data was retained for 30 days when the real figure for their plan was 90. The 30-day sentence was retrieved on its own, cut off from the heading that said it applied only to the free tier. Including the section heading and document title in each chunk fixed most cases like it.

| Strategy | How it splits | Best for |
| --- | --- | --- |
| Fixed size with overlap | Every N tokens, small overlap | Quick start, uniform text |
| Structure-aware | Headings, paragraphs, list items | Docs, wikis, policies |
| Semantic | Where the topic shifts | Long unstructured prose |
| Parent-child | Small chunks retrieved, larger section returned | Precision plus context |

There is no universal best setting. Start with structure-aware splitting of a few hundred tokens, add the title and heading path to each chunk, and evaluate retrieval on real questions with known answers. Because changing your chunking means re-embedding everything, settle it early with measurements rather than guesses. Good chunks make every later stage of [RAG](./rag.md), including [reranking](./reranking.md), work better.

_Usage:_

- "The chunk lost its heading, so the model didn't know it was the free-tier limit."
- "Try parent-child chunking, retrieve small and send the whole section."
- "Changing chunk size means a full re-index, so test it on the eval set first."
