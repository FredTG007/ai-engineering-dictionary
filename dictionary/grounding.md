---
title: Grounding
description: Making a model base its answer on specific supplied sources, and checking that each claim can be traced back to them.
---

Grounding means tying a model's output to specific evidence you supplied, so that each claim in the answer can be traced to a source rather than to the model's general training. A grounded answer is one you can check line by line against the documents in the context.

The need for it is clearest after an embarrassing [hallucination](./hallucination.md). A benefits assistant told an employee that dental coverage included orthodontics for adults. The retrieved policy document was in the context and said the opposite; the model blended it with common patterns from its training data. Retrieval worked. Grounding failed. This is the gap between having the right information in the prompt and actually answering from it.

Grounding has a prompt side and a verification side. On the prompt side, you instruct the model to answer only from the provided sources, to cite the passage behind each claim, and to say clearly when the sources do not contain the answer. Asking for [structured output](./structured-output.md) with a citation field per claim makes those references easy to parse and display.

On the verification side, you check the answer after it is generated. Common approaches include confirming that each cited passage exists and was actually in the context, using a second model as an [LLM-as-judge](./llm-as-judge.md) to decide whether each claim is supported, and flagging answers where a high share of sentences have no citation. These checks can run inline for high-stakes flows or offline on sampled traffic.

Grounding is a property you measure, not one you assume. In a [RAG](./rag.md) system, track a groundedness rate alongside answer correctness in your [evals](./evals.md). The two diverge in useful ways: an answer can be correct but ungrounded, meaning the model got lucky from prior knowledge, which will break the day your documents change. An answer can also be grounded but wrong, which points to a bad or outdated source document rather than a model problem. Knowing which case you are in tells you whether to fix the prompt, the retrieval, or the content.

_Usage:_

- "The policy was right there in context. It's a grounding problem, not retrieval."
- "Every sentence needs a citation ID, or the judge marks it unsupported."
- "Groundedness dropped to 82 percent after we switched models. Hold the rollout."
