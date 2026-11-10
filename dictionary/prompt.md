---
title: Prompt
description: The full input text sent to a language model for one request, including instructions, context, examples and user input.
difficulty: beginner
interview: "Your summarizer started ignoring its formatting rules after someone pasted a long customer email into it. What would you check in the prompt?"
interviewAnswer: "Covers the prompt as the full assembled input: system instructions, examples, context and user text. Looks at ordering, clear delimiters around untrusted content, conflicting instructions, length pushing rules out of focus, and logging the exact final prompt sent."
buildThis:
  title: Construct a Structured Prompt Template
  goal: Combine system instructions, few-shot examples, and user input into a reliable prompt format.
  steps:
    - Define clear XML-style tags for instructions, context, and examples.
    - Write a Python function using f-strings to inject dynamic user variables into the template.
    - Test the template across five different edge-case inputs to check adherence.
    - Refine the prompt layout to minimize token usage while maintaining accuracy.
  skills:
    - templating
    - XML tags
    - few-shot
    - Python
  time: under an hour
  stretch: Write an automated unit test suite that validates the prompt outputs required JSON keys consistently.
---

A prompt is everything you send to a model in a single request. In casual usage it means the user's question, but in an engineered system it is a structured document: instructions, the [system prompt](./system-prompt.md), retrieved context, examples, conversation history and finally the user's message. The model sees all of it as one sequence of [tokens](./tokens.md) and generates a continuation.

The prompt is the main lever you have over model behavior without retraining. Small changes in wording, ordering or formatting can shift accuracy noticeably. One team changed "Answer briefly" to "Answer in one sentence" to tidy up their summarizer, and a downstream parser that expected bullet points started failing on a third of requests. Nobody had tested the change because it looked cosmetic.

That kind of incident is why prompts belong in version control and behind tests. Treat them like code: keep them in files as a [prompt template](./prompt-template.md) rather than scattered string literals, review changes, and run [evals](./evals.md) against a fixed set of inputs before shipping. [Prompt versioning](./prompt-versioning.md) lets you tie every production response back to the exact prompt that produced it, which is the first thing you want during an incident.

A good prompt is specific about the task, the audience, the output format and what to do when the answer is unknown. Vague instructions such as "be helpful" leave the model to guess. Concrete ones such as "If the documents do not contain the answer, reply 'I don't know' and nothing else" give it a clear rule and make failures easier to detect. Adding a couple of worked examples, known as [few-shot prompting](./few-shot-prompting.md), is often the fastest way to pin down format and tone.

Prompts also form an attack surface. Any text you include from users, web pages or documents can contain instructions that compete with yours, which is the root of [prompt injection](./prompt-injection.md).

_Usage:_

- "Don't hotfix the prompt in prod; open a PR and run the evals."
- "The prompt is 80% retrieved context and 20% instructions."
- "Which prompt version produced this answer?"
