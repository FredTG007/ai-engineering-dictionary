---
title: Hallucination
description: When a model states something false or unsupported with full confidence, such as an invented fact, citation or policy.
difficulty: beginner
interview: "Your support bot told a customer about a refund policy your company does not have. How would you reduce the chance of that happening again?"
interviewAnswer: "Covers grounding answers in retrieved policy documents, instructing the model to say it does not know when sources are silent, requiring citations, checking answers against sources with evals or a judge, and routing policy commitments through guardrails or human review."
---

A hallucination is output that sounds plausible but is not true or not supported by the information the model was given. It might be a made-up statistic, a citation to a paper that does not exist, an API method that was never shipped, or a company policy nobody wrote. The defining feature is confidence: the model presents the invented detail in the same tone as everything else.

It happens because an [LLM](./llm.md) generates likely text, not verified text. When the right answer is missing from its training data or its [context window](./context-window.md), the model still produces the most plausible continuation, and plausible is not the same as correct. A support bot asked about a refund window it was never told about will often invent a reasonable-sounding number. One widely reported airline case involved exactly that: the bot described a bereavement refund policy that did not exist, and a tribunal ordered the airline to honor it.

| Cause | Typical symptom | Mitigation |
| --- | --- | --- |
| Answer not in context | Invented policy or number | [RAG](./rag.md) with relevant documents |
| Retrieved the wrong passage | Confident answer about a different product | Better [chunking](./chunking.md) and reranking |
| Prompt pushes for an answer | Never says "I don't know" | Explicit permission to abstain |
| Required schema field | Made-up value to fill the slot | Nullable fields, "unknown" option |

You cannot remove hallucination entirely, but you can make it rarer and easier to catch. Give the model the source material, tell it to answer only from that material, and let it say it does not know. Ask for citations to specific passages, then check that the cited text actually supports the claim. This combination is usually called [grounding](./grounding.md).

Detection needs to be part of your pipeline, not an occasional manual check. Build a set of questions with known answers, including ones where the correct response is "not covered", and run them as [evals](./evals.md) on every prompt or model change. An [LLM-as-judge](./llm-as-judge.md) step can flag answers that are not supported by the retrieved context.

_Usage:_

- "It hallucinated a return policy; the doc wasn't even retrieved."
- "Add 'not in the docs' cases to the eval set so we catch hallucinations."
- "Lower temperature won't fix it. The model just doesn't have the facts."
