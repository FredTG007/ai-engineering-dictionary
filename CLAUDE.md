# CLAUDE.md — writing rules for The AI Engineering Dictionary

This repo is a dictionary of **AI engineering** terms (building, shipping and operating LLM-powered systems — not AI-assisted coding). Author: Fred Osei-Adu.

## Entry format

Every term lives in `dictionary/<slug>.md`:

```markdown
---
title: Context Window
description: One plain sentence, under 140 characters.
---

Body paragraphs...

_Usage:_

- "A short, realistic quote an engineer might say."
- "Another one."
```

## Writing rules

1. **Original text only.** Never copy or paraphrase another dictionary or glossary.
2. **Plain, hype-free tone.** No "revolutionary", "game-changing", "unlock", "supercharge". Write like a senior engineer explaining something to a colleague.
3. **Tie it to a real symptom.** Every entry describes a concrete problem an engineer actually hit (a bill that spiked, a bot that invented a refund policy, a p95 that doubled) and how the term relates to it.
4. **Clear first sentence per paragraph.** Each paragraph opens with a sentence that states its point; the rest supports it.
5. **Body of at least 200 words**, excluding the frontmatter.
6. **`description` under 140 characters.**
7. **Relative links on first mention only.** Link other terms as `[embeddings](./embeddings.md)` the first time they appear in an entry; later mentions are plain text. Only link to terms that exist.
8. **Tables are welcome** where they clarify (lifecycles, trade-offs, comparisons).
9. **End with a `_Usage:_` section** of 2–3 short realistic quotes as list items ("Heard in the wild").
10. **Add every new slug to `internal/Curriculum.md`** in a sensible learning position.
11. **Link new entries back into older ones.** When you add a term, edit the existing entries that should mention it so the graph stays connected in both directions.

Run `npm run validate` before committing; it enforces rules 5, 6, 7 (missing targets), 9 and 10.

## Code rules

Clean-code practices: small focused functions and components, intention-revealing names, single responsibility, no dead code. Pure content-loading and graph logic lives in `lib/` and has no UI imports; React components live in `components/`.
