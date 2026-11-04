---
title: Prompt Versioning
description: Tracking every change to a prompt with an identifier, history and author, so outputs can be traced to the exact prompt used.
---

Prompt versioning is the practice of giving every [prompt](./prompt.md) a tracked history, with an identifier for each version, a record of who changed what, and a way to tell which version produced any given output. It treats prompts as the deployable artifacts they are, rather than strings edited in place.

The pain that motivates it is usually an unexplained change in behavior. A team noticed their classification accuracy had dropped from 94 to 87 percent over a month. The [system prompt](./system-prompt.md) lived in a database row that three people edited through an admin panel, with no history. Nobody could say what the prompt had looked like when accuracy was good, so the only option was to guess and re-test.

At minimum, a versioning setup should provide:

- An immutable ID or hash for each version, attached to logs and traces for every request.
- A diff view, so reviewers can see exactly which words changed.
- The model name and parameters such as [temperature](./temperature.md) stored with the prompt, since the same text behaves differently on different models.
- The ability to roll back instantly to a known good version.

Two storage approaches are common. Keeping prompts in the code repository gives you review, history and CI for free, but every change requires a deploy. Keeping them in a prompt registry or config service lets non-engineers iterate and lets you switch versions at runtime, but you must add the review and audit trail yourself. Many teams start in the repo and move to a registry once product or domain experts need to edit prompts directly.

Versioning is what makes the rest of the quality loop work. [Regression evals](./regression-evals.md) need to record which version they scored. [A/B testing prompts](./ab-testing-prompts.md) requires serving two identified versions side by side. Debugging a bad answer from last Tuesday requires knowing exactly which text was in effect. Without version IDs in your logs, every one of these becomes guesswork, and the [evals](./evals.md) you run tell you about a prompt that may no longer exist.

_Usage:_

- "Which prompt version was live on the 12th? The trace only says 'support-v2'."
- "Roll back to prompt 41. The new one broke the JSON output."
- "Store the model ID with the prompt. The same text acts differently on the new model."
