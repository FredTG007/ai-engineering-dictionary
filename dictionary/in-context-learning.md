---
title: In-Context Learning
description: Changing what a model does by putting instructions and examples in the prompt, with no change to its weights.
difficulty: beginner
interview: "Your classification prompt has grown to forty examples and costs more per call than the model itself seemed to justify. How do you decide whether to keep going in-context or fine-tune?"
interviewAnswer: "Covers that in-context learning pays for the examples on every request while fine-tuning pays once, so the break-even depends on volume and prompt length, and that prompt caching, retrieving only the most relevant examples, and comparing both options on the same eval set are the ways to decide rather than guessing."
buildThis:
  title: Measure how many examples a task really needs
  goal: Plot accuracy against the number of in-context examples for one classification task.
  steps:
    - Pick a labelled dataset with a few hundred rows and hold out a hundred for testing.
    - Build prompts with zero, two, five, ten and twenty examples drawn from the rest.
    - Run the test set through each prompt and record accuracy, tokens and cost.
    - Chart the three curves and find where more examples stop paying for themselves.
  skills:
    - Python
    - Prompting
    - Evals
  time: an afternoon
  stretch: Replace the fixed examples with the five nearest examples by embedding similarity and compare the curve.
---

In-context learning is the ability of a trained model to pick up a task from what is in its prompt. Instructions, a few worked examples, a document to answer from, a schema to follow: all of these change the model's behaviour for that one request, and none of them change a single weight. The model is frozen; the learning happens in the [context window](./context-window.md) and disappears when the request ends.

It is the umbrella over the prompting techniques people use every day. [Few-shot prompting](./few-shot-prompting.md) is in-context learning from examples. A system prompt is in-context learning from instructions. Retrieval is in-context learning from documents. Framing them this way makes the trade-off explicit: you are renting behaviour per request rather than buying it once.

The rent adds up. A team classifying support tickets kept adding examples whenever they saw a mistake, and the prompt grew to forty examples and about 3,500 [tokens](./tokens.md). At two million tickets a month, the examples alone cost more than the answers. Accuracy had also plateaued at twelve examples; the other twenty-eight were paying for nothing. Trimming to the twelve most useful and enabling [prompt caching](./prompt-caching.md) on the shared prefix cut the monthly bill by roughly 60 percent with no change in quality.

| Approach | Pays when | Changes weights | Good for |
| --- | --- | --- | --- |
| In-context learning | Every request | No | Fast iteration, changing requirements, low volume |
| [Fine-tuning](./fine-tuning.md) or [LoRA](./lora.md) | Once per training run | Yes | Stable tasks, high volume, long example sets |

Choose in-context learning first and move on when the numbers say so. It needs no training pipeline, changes ship by editing text, and it works with models you cannot fine-tune. Switch to fine-tuning when the prompt is long, the task is stable, and volume is high enough that the per-request cost outweighs a training job. Either way, measure both on the same eval set before deciding, since the model may learn the task from five examples and make the whole question moot.

_Usage:_

- "We're paying for forty examples on every call; the accuracy curve flattens at twelve."
- "It's all in-context, nothing is trained, so the fix is a prompt edit and a deploy."
- "If the task stops changing we'll fine-tune and drop the examples from the prompt."
