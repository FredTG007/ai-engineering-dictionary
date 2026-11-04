# The AI Engineering Dictionary

**by Fred Osei-Adu**

A plain-language, interconnected dictionary of the terms you meet when you build, ship and operate LLM-powered systems: retrieval, evals, agents, guardrails, voice, observability, serving, and more. Each entry explains a concept by tying it to a real symptom an engineer hit in production.

The site shows every term as a node in an interactive 3D graph. A line between two nodes means one definition links to the other. Click a node to fly to it and read the entry. Prev/next buttons follow a curated learning order, and URLs like `?term=rag` can be shared.

## Features

- 3D force-directed graph (three.js via React Three Fiber). The layout is computed at build time with a small deterministic force simulation.
- Side panel (a bottom sheet on mobile) with the description, the full definition, "Heard in the wild" quotes, "Connects to" chips and curriculum navigation.
- Client-side fuzzy search (MiniSearch). Press `/` to focus it, then use ↑/↓ and Enter.
- Four colour palettes and optional WebAudio UI sounds (muted by default). Both choices are saved in localStorage.
- Fully static: `next build` exports plain HTML/JS to `out/`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run validate   # check the content rules
npm run build      # static export to out/
npm start          # serve out/ locally
```

## Add a term

1. Create `dictionary/<slug>.md`:

   ```markdown
   ---
   title: Your Term
   description: One plain sentence under 140 characters.
   ---

   At least 200 words. Tie it to a real symptom. Link other terms like
   [embeddings](./embeddings.md) on first mention only.

   _Usage:_

   - "A short, realistic quote."
   - "Another one."
   ```

2. Add the slug to `internal/Curriculum.md` at the right point in the learning order.
3. Link the new entry back into older entries that should mention it.
4. Run `npm run validate`.

The full writing rules are in [CLAUDE.md](./CLAUDE.md).

## Project layout

| Path | Purpose |
|---|---|
| `dictionary/` | One Markdown file per term |
| `internal/Curriculum.md` | Ordered learning path (drives prev/next) |
| `lib/content/` | Pure parsing, Markdown rendering, curriculum logic |
| `lib/graph/` | Pure graph building and 3D force layout |
| `lib/validation/` | Content rules used by `npm run validate` |
| `lib/search/`, `lib/theme/`, `lib/sound/` | Search index, palettes, WebAudio tones |
| `hooks/` | React hooks (URL sync, palette, sound, persisted preferences) |
| `components/` | React UI: graph scene, panel, search, header/footer |
| `scripts/validate-content.ts` | Content validator CLI |

## Author

Written by **Fred Osei-Adu**. All definitions are original.
