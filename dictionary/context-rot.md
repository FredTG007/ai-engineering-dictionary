---
title: Context Rot / Lost in the Middle
description: The tendency of models to under-use information buried in the middle of a long context and to degrade as the context grows.
difficulty: intermediate
interview: "You moved from a 20-chunk RAG prompt to stuffing whole documents into a 200k-token context, and accuracy on your eval set fell. Why might that happen, and how would you arrange the prompt instead?"
interviewAnswer: "Covers that models attend most reliably to the start and end of the context and lose facts placed in the middle, that more tokens also mean more distractors, keeping retrieval and reranking so only relevant material goes in, placing the most important passages and the question at the edges, and testing with a needle-position eval rather than assuming a large window is used evenly."
buildThis:
  title: Run a needle-position experiment on your own model
  goal: Measure how answer accuracy changes with where a fact sits in a long prompt and how long the prompt is.
  steps:
    - Write one short fact and a question it answers, then build filler prompts from unrelated text at 4k, 32k and 100k tokens.
    - Insert the fact at the start, at several middle positions and at the end of each filler length.
    - Ask the question thirty times per position and length and record the accuracy.
    - Plot accuracy against position and length to find where the model starts to lose the fact.
  skills:
    - evals
    - Python
    - prompt design
    - plotting
  time: an afternoon
  stretch: Repeat the run with two distractor facts that contradict the needle and see how much faster accuracy falls.
---

Context rot is the observation that a model's use of its context is not uniform. Facts near the beginning and end of a prompt are recalled reliably; facts in the middle are recalled less often, and the effect gets worse as the prompt gets longer. The "lost in the middle" name comes from research that measured this with a known fact moved through a filler document. Context rot is the broader habit of calling any degradation with context length by the same name.

The reason it matters is that large windows invite a tempting shortcut. If the [context window](./context-window.md) is 200k tokens, why bother with retrieval at all when you can paste the whole manual in? One team did exactly that for a hardware support bot, replacing a 20-chunk [RAG](./rag.md) prompt with a 150k-token dump of the full documentation. Their eval score dropped from 88 to 71 percent. Tracing the misses showed that the relevant section sat around the 60k-token mark in most failing cases, and the model answered from a more general passage near the end. The fact was present; it was not used.

Length hurts in two ways at once. Position effects mean middle content gets less attention. Volume effects mean more distractors compete with the right passage, and near-duplicates of the answer, say an older version of the same procedure, can win. Larger prompts also cost more per request and raise latency, so the dump was slower and more expensive as well as less accurate.

| Prompt design | Risk | Mitigation |
| --- | --- | --- |
| Whole corpus pasted in | Middle content ignored, distractors win | Keep retrieval, send only what matters |
| Many chunks in retrieval order | Best chunk lands in the middle | [Rerank](./reranking.md) and place the top results at the edges |
| Long agent transcripts | Early instructions fade | Restate goals near the end, summarise old tool output |

The practical defence is deliberate [context engineering](./context-engineering.md). Retrieve and rerank so only relevant passages go in, put the most important material first or last, and restate the question after the documents. For agents, apply [tool-result budgets](./tool-result-budgets.md) so stale output does not push the task description into the dead zone. Stable prefixes also suit [prompt caching](./prompt-caching.md), so a well-ordered prompt tends to be cheaper too.

Test rather than assume. A needle-in-a-haystack run against the model you actually ship, at the lengths you actually send, shows where recall falls off and whether a new model version has moved the cliff.

_Usage:_

- "The answer was in the context at token 60k and the model answered from the summary at the end instead."
- "Don't paste the whole manual; rerank and put the top three chunks right before the question."
- "Our needle eval says recall drops after about 80k tokens on this model, so cap the context there."
