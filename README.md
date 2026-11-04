# The AI Engineering Dictionary

**by Fred Osei-Adu**

A plain-language, interconnected dictionary of the terms you meet when you build, ship and operate LLM-powered systems: retrieval, evals, agents, guardrails, voice, observability, serving, and more. Each entry explains a concept by tying it to a real symptom an engineer hit in production.

Version 2 draws the dictionary as a **subway map** printed in a field notebook. Each coloured line is a learning track (Foundations, RAG, Agents, Evals, Safety, Production, Training & Inference, Voice), each station is a term, and terms that belong to several tracks are ringed interchanges. Click a station to centre it and read the entry; `?term=rag` URLs can be shared.

## Features

- **Subway map (SVG).** Hand-tuned octilinear layout: lines run horizontally, vertically or at 45°. `npm run validate` fails if any label would overlap another label, a station or a line. Drag to pan, scroll or pinch to zoom, `+` / `−` / fit buttons, keyboard-focusable stations.
- **Side panel** (a bottom sheet on mobile): difficulty badge, the track(s) a term sits on, the description, "Read more" for the full definition, an **interview question** whose "what a good answer covers" note is revealed on click, "Heard in the wild" quotes, "Connects to" chips, and prev/next through the curriculum with `N / 74`.
- **Progress.** Mark a term as learned; each line shows a hand-drawn progress bar and a "start/continue" link to the next unlearned station. Click a line name to highlight it on the map. Progress is saved in localStorage.
- **Search.** Client-side fuzzy search (MiniSearch). Press `/` to focus it, then use ↑/↓ and Enter.
- **Notebook look.** Fraunces and Source Serif 4, self-hosted at build time through `next/font`. Paper grain is SVG noise in a data URI, the map sits on a dot grid, and underlines, arrows, circles and progress bars are drawn with a seeded "pen wobble", so they look the same on every render. No external images.
- **Paper / Kraft / Night** palettes and optional WebAudio UI sounds (muted by default). Both choices are saved, and a tiny inline script applies the stored palette before first paint.
- **Fully static.** `next build` exports plain HTML/JS to `out/`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run validate   # content, tracks and map-legibility rules
npm run build      # static export to out/
npm start          # serve out/ locally
```

## Add a term

1. Create `dictionary/<slug>.md`:

   ```markdown
   ---
   title: Your Term
   description: One plain sentence under 140 characters.
   difficulty: intermediate
   interview: "A scenario-style question ending in a question mark?"
   interviewAnswer: "What a good answer covers, in one to three sentences."
   ---

   At least 200 words. Tie it to a real symptom. Link other terms like
   [embeddings](./embeddings.md) on first mention only.

   _Usage:_

   - "A short, realistic quote."
   - "Another one."
   ```

2. Add the slug to `internal/Curriculum.md` at the right point in the learning order.
3. Put it on at least one track in `internal/Tracks.md`, and give it a position and label side in `lib/map/stationPlacements.ts`.
4. Link the new entry back into older entries that should mention it.
5. Run `npm run validate`. If it reports overlapping labels, nudge the station or flip its label side.

The full writing rules are in [CLAUDE.md](./CLAUDE.md).

## Project layout

| Path | Purpose |
|---|---|
| `dictionary/` | One Markdown file per term |
| `internal/Curriculum.md` | Ordered learning path (drives prev/next) |
| `internal/Tracks.md` | Learning tracks: name, colour and ordered stations |
| `lib/content/` | Pure parsing, Markdown rendering, curriculum logic |
| `lib/map/` | Pure map logic: track parsing, station placements, octilinear routing, label geometry, layout checks, viewport maths |
| `lib/sketch/` | Seeded "hand-drawn" SVG paths (wobbly lines, circles, arrows) |
| `lib/progress/` | Per-track progress from the set of learned terms |
| `lib/validation/` | Content, track and map rules used by `npm run validate` |
| `lib/search/`, `lib/theme/`, `lib/sound/` | Search index, palettes, WebAudio tones |
| `hooks/` | React hooks (URL sync, pan/zoom, learned terms, palette, sound, element size) |
| `components/` | React UI: map, panel, tracks legend, sketch primitives, search, header/footer |
| `scripts/validate-content.ts` | Validator CLI |

## Author

Written by **Fred Osei-Adu**. All definitions and interview questions are original.
