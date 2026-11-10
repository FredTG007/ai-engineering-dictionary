---
title: Prompt Template
description: A versioned prompt skeleton with named slots that are filled with user input, retrieved context and settings at request time.
difficulty: beginner
interview: "Your RAG answers suddenly stopped citing documents, retrieval metrics look fine, and the only recent change was a prompt wording tweak. What do you suspect, and how would you catch it next time?"
interviewAnswer: "Covers suspecting that the edit broke or renamed the slot that carries retrieved context so the model is answering from memory, verifying by logging the rendered prompt, and preventing it with a template that fails on missing slots, a test that renders known inputs, and prompt versioning with a regression eval."
buildThis:
  title: Write a tiny prompt templating library
  goal: Render prompts from a template file with named slots, strict missing-slot errors and escaped user content.
  steps:
    - Define a template format with named placeholders and store templates as text files under version control.
    - Write a render function that raises an error when a slot is missing or unused.
    - Escape or fence user-supplied content so it cannot be confused with instructions.
    - Add a test that renders each template with sample inputs and snapshots the result.
  skills:
    - Python
    - Templating
    - Testing
  time: an afternoon
  stretch: Add a version field to each template and log it alongside every model call so you can trace an answer back to the exact prompt text.
---

A prompt template is the fixed part of a [prompt](./prompt.md) with holes in it. The skeleton holds the instructions, formatting rules and examples; the holes, usually named slots, are filled at request time with the user's message, retrieved documents, the current date, or anything else that changes per call. For chat models the template is often a list of messages with slots in several of them, including the [system prompt](./system-prompt.md).

Templates separate the words from the code. The application logic decides what goes in each slot; the template decides how the model is asked. That split lets a prompt change ship without redeploying the service, lets non-engineers propose wording changes through review, and gives [prompt versioning](./prompt-versioning.md) and [A/B testing](./ab-testing-prompts.md) a concrete artefact to version and compare.

Templates also fail in specific, catchable ways. A team running a [RAG](./rag.md) assistant noticed that answers had stopped citing documents, yet retrieval metrics were unchanged. A wording tweak the previous week had renamed the context slot in the template but not in the code that filled it, so the renderer silently substituted an empty string. The model, given no documents, answered from memory for six days. Nothing errored because the prompt was still valid text. A renderer that refuses to run with a missing slot would have failed the first request instead.

| Practice | Why it matters |
| --- | --- |
| Fail on missing or unused slots | Catches renamed variables before the model sees an empty prompt |
| Fence user content in its own slot | Reduces confusion between instructions and data |
| Snapshot-test rendered output | Makes wording changes reviewable as diffs |
| Log the template version per call | Lets you trace a bad answer to the exact text |

Treat the filled slots with the same care as the skeleton. User-supplied text should sit in a clearly marked block, never interpolated into the middle of an instruction, and anything long or variable belongs in a slot that [context engineering](./context-engineering.md) can budget. When a template grows past a screen, split it into named sections and test each one; a prompt is code, and a template is its module system.

_Usage:_

- "The context slot got renamed and the renderer just filled it with nothing."
- "Prompt change goes through the template repo with a snapshot diff, not the admin panel."
- "Log the template version with every call or we can't tell which wording produced that answer."
