---
title: Base Model vs Chat Model
description: A base model continues documents; a chat model has been post-trained to answer, follow instructions and stop at the right point.
difficulty: beginner
interview: "A self-hosted assistant answers the user's question and then keeps going, writing a made-up follow-up question from the user and answering that too. What has most likely gone wrong?"
interviewAnswer: "Covers that the deployment is probably serving a base checkpoint rather than the instruct or chat variant, or applying no chat template, so the model treats the transcript as a document to continue, and that the fix is to load the chat checkpoint with its template, confirm the end-of-turn token is a stop condition, and add an eval that checks for fabricated user turns."
buildThis:
  title: Spot the base model from its output
  goal: Build a small classifier that tells whether a response came from a base or a chat model.
  steps:
    - Collect fifty responses each from a base and an instruct checkpoint of the same family.
    - Write simple heuristics such as fabricated user turns, missing answers and run-on text.
    - Score every response and measure how often each heuristic fires per model.
    - Package the check as a script that warns when a deployment looks like a base model.
  skills:
    - Python
    - Hugging Face
    - Evals
  time: an afternoon
  stretch: Run the check against a real serving endpoint on every deploy and fail the pipeline if it trips.
---

A base model and a chat model are usually the same architecture and almost the same weights, separated by [post-training](./pretraining-vs-post-training.md). The base model is what comes out of pretraining: a document completer that, given some text, produces the text most likely to come next. The chat model has been further trained on conversations, so it treats input as a dialogue, answers the latest turn, and stops when the answer is done.

The difference shows up in how each one must be prompted. A base model does not understand "you are a helpful assistant" as an instruction; it sees it as the opening of a document and continues in kind. To get useful work from one, you frame the task as a document whose natural continuation is the answer, such as a filled-in table or a question-and-answer list. A chat model expects [message roles](./message-roles.md), a [system prompt](./system-prompt.md) and a [chat template](./chat-template.md) that marks where each turn starts and ends.

Deploying the wrong one is a common and confusing failure. A team self-hosting an [open-weight model](./open-weight-models.md) pulled the base checkpoint instead of the instruct variant, because the names differed only by a suffix. The assistant answered reasonably, then invented a follow-up question from the user, answered that, and kept the conversation going by itself until it hit the output limit. Responses were long, cost roughly four times what was expected, and some of the fabricated user turns were later quoted in a bug report as things customers had actually said.

| Trait | Base model | Chat model |
| --- | --- | --- |
| Input treated as | A document to continue | A conversation to respond to |
| Knows when to stop | No, runs to the limit | Yes, emits an end-of-turn token |
| Follows a system prompt | Not reliably | Yes |
| Best use | Research, custom fine-tunes, completion tasks | Assistants and agents |

Base models still have a place. They are the right starting point for your own [fine-tuning](./fine-tuning.md) when you want to define the behaviour from scratch, and they can outperform chat models on pure completion tasks where instruction tuning adds unwanted chattiness. For almost everything user-facing, though, start from the chat variant and confirm the end-of-turn token is configured as a stop condition.

_Usage:_

- "It's writing the user's next message for them, we must be serving the base checkpoint."
- "Base is for fine-tuning from scratch; put the instruct one behind the API."
- "The names only differ by a suffix, so add a deploy check that pings the model and looks for fabricated turns."
