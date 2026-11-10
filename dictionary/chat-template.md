---
title: Chat Template
description: The exact text format, with special tokens and role markers, that a list of chat messages is turned into before tokenization.
difficulty: intermediate
interview: "After moving a model from a hosted API to your own vLLM cluster, the same eval suite drops from 84 to 63 percent with no prompt changes. Where would you look first?"
interviewAnswer: "Covers checking that the serving stack is applying the model's own chat template rather than a default or a mismatched one, comparing the raw token sequence sent to the model against the reference, and adding a startup test that renders a known conversation and diffs it against the expected string."
buildThis:
  title: Render the same conversation through three chat templates
  goal: See exactly what the model receives for a given message list across model families.
  steps:
    - Load the tokenizers for three different open-weight chat models.
    - Build one conversation with a system, two user and one assistant message.
    - "Call each tokenizer's chat template function and print the rendered string and token count."
    - Note the special tokens, role markers and where the generation prompt is appended.
  skills:
    - Hugging Face
    - Python
    - Tokenization
  time: under an hour
  stretch: Deliberately send a conversation rendered with the wrong template to a model and document how the answers degrade.
---

A chat template is the rule for serialising a list of messages into the one string of text the model actually reads. Models do not receive a JSON array of roles; they receive tokens. The template inserts the special tokens and markers that the model saw during post-training, such as a marker for the start of a user turn, an end-of-turn token, and the cue that tells the model it is now the assistant's turn to write. Each model family uses its own format.

The template is distinct from [message roles](./message-roles.md). Roles are the concept, the same across every provider: this part is the system instruction, that part is the user. The template is the wire format for a specific model, and getting it wrong is invisible at the API layer because the request still looks valid. Hosted APIs apply the correct template for you. When you run an [open-weight model](./open-weight-models.md) yourself, the serving stack has to do it, and it has to do it with the right one.

A mismatch is quiet and costly. A team moved a model from a hosted endpoint to their own [GPU serving](./gpu-serving.md) cluster and reran their evals as a sanity check. Accuracy fell from 84 to 63 percent with identical prompts. The server had fallen back to a generic template because the tokenizer files they had copied lacked the template definition, so every system prompt arrived as plain text with no role markers. The model still answered, just worse, and nothing logged an error. The fix was one configuration file, found after two days of blaming the quantisation.

| Symptom | Likely template problem |
| --- | --- |
| System prompt ignored | Rendered without a system marker |
| Model keeps writing after its answer | End-of-turn token not emitted or not a stop sequence |
| Few-shot examples bleed into the answer | Assistant turns not closed properly |
| Tool calls come back as prose | Tool-call format differs from what the template expects |

Treat the rendered prompt as an artefact you can inspect. Log or test the exact string produced for a known conversation, compare it against the model card's reference, and check that the end-of-turn token is configured as a [stop sequence](./stop-sequences.md). The [tokenizer](./tokenizer.md) and template ship together for a reason; when you swap or quantise a model, verify both. The same care applies to a [base model](./base-vs-chat-model.md), which has no template at all and needs a different prompting style entirely.

_Usage:_

- "Print the rendered prompt, I want to see the actual role markers going in."
- "Evals dropped twenty points and nothing changed except the serving stack, check the chat template."
- "The tokenizer config we copied doesn't include the template, so vLLM is using a default one."
