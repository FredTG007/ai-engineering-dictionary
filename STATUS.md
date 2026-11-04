# Status

## v2: subway map (branch `v2-subway`)

- **Terms:** 91, all in `internal/Curriculum.md`, all on at least one of 8 tracks in `internal/Tracks.md`.
- **New in this round (17 terms):** transformer, tokenizer, bm25, retrieval-metrics, document-ingestion, react-pattern, workflows-vs-agents, orchestrator-worker, error-analysis, pairwise-evals, online-vs-offline-evals, indirect-prompt-injection, llm-gateway, user-feedback-loops, supervised-fine-tuning, dpo, speculative-decoding. Each one is in the curriculum, on a track and placed on the map. 23 older entries got a single inline link to a new term, and their prose is otherwise unchanged. A separate technical proofread fixed small errors in 9 of the new entries; the remaining doubts for an expert are in `PROOFREAD-v2.md`.
- **Map:** the layout is hand-tuned in `lib/map/stationPlacements.ts`. Foundations now starts further west, RAG runs further east, Agents and Safety reach a lower bottom row, Evals continues north past Drift to User Feedback Loops, and Training & Inference has a longer diagonal. `npm run validate` checks that no label overlaps another label, a station or a line, and that no line runs through a station it doesn't serve.
- **Layout fix:** the default fit no longer centres an oversized map. That centring pushed the top row (Vector Database) under the header subtitle. The map is now pinned below the header and crops on the right and bottom instead. While a term is open, the insets also reserve the folded Lines tab (bottom left on desktop, under the header on mobile), so centring on a station or pressing "fit" keeps labels like Multi-Agent System out from under it.
- **Listen button:** the term panel plays `/audio/<slug>.mp3` for slugs listed in `public/audio/manifest.json`, which is read at build time. Other terms show a disabled "Audio coming soon". Spoken scripts exist for rag, embeddings, agent, evals and prompt-injection in `scripts/voice/`.
- **Study mode:** `?view=study`, or the Study button in the header. Each term has two flashcards, scheduled with SM-2 in localStorage (`aied:study:v1`). Filter by track and card type, with due, new and seen counts. Space flips and 1–4 grade. Anki TSV and CSV export run client-side.
- **Checks:** `npm run validate` and `npm run build` pass. Checked in headless Chrome at 1440×900, 1280×720 and 390×844 with no console errors except the expected 404 noted below. Checks covered: the default fit is clear of the header; centring on Multi-Agent System; keyboard grading in study mode; schedules persist across reloads; the track filter; both export downloads; Map/Study toggling; the disabled Listen button on a term without audio.
## Unfinished / TODO

- **Audio files are not recorded yet.** `public/audio/manifest.json` already lists the five scripted slugs, so their Listen buttons are enabled, but pressing one gets a 404 and the button shows "Audio unavailable". Add the five `.mp3` files, or run `npm run audio:manifest` to reset the manifest to the files that actually exist.
- **Proofread doubts:** `PROOFREAD-v2.md` lists claims and illustrative numbers in the new entries for a domain expert to confirm.
- **Study progress** is separate from "Mark as learned" and, like it, lives in one browser.

- **X handle:** `components/chrome/Footer.tsx` links to `https://x.com/` as a placeholder (marked `TODO`).
- **Newsletter:** the form is UI only. It shows a friendly message and sends nothing (`// TODO: wire newsletter backend` in `components/chrome/NewsletterForm.tsx`). It now sits in the welcome card.
- **Map label widths are estimated**, not measured. The estimate is deliberately generous and matches the self-hosted fonts in Chrome. A fallback font could render wider labels, though the overlap check leaves a few pixels of room.
- **Adding a term needs a map position** in `lib/map/stationPlacements.ts`. There is no automatic layout. The validator tells you when a station is missing or a label collides.
- **No per-term static pages:** term views are client-side (`/?term=slug`), so search engines index only the home page.
- **Progress lives in one browser** (localStorage). There are no accounts and no sync.
- No deployment and no git remote set up (as requested).
