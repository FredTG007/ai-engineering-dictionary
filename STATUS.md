# Status

## v2: subway map (branch `v2-subway`)

- **Terms:** 91, all in `internal/Curriculum.md`, all on at least one of 8 tracks in `internal/Tracks.md`.
- **New in this round (17 terms):** transformer, tokenizer, bm25, retrieval-metrics, document-ingestion, react-pattern, workflows-vs-agents, orchestrator-worker, error-analysis, pairwise-evals, online-vs-offline-evals, indirect-prompt-injection, llm-gateway, user-feedback-loops, supervised-fine-tuning, dpo, speculative-decoding. Each one is in the curriculum, on a track and placed on the map. 23 older entries got a single inline link to a new term, and their prose is otherwise unchanged. A separate technical proofread fixed small errors in 9 of the new entries; the remaining doubts for an expert are in `PROOFREAD-v2.md`.
- **Map:** the layout is hand-tuned in `lib/map/stationPlacements.ts`. Foundations now starts further west, RAG runs further east, Agents and Safety reach a lower bottom row, Evals continues north past Drift to User Feedback Loops, and Training & Inference has a longer diagonal. `npm run validate` checks that no label overlaps another label, a station or a line, and that no line runs through a station it doesn't serve.
- **Layout fix:** the default fit no longer centres an oversized map. That centring pushed the top row (Vector Database) under the header subtitle. The map is now pinned below the header and crops on the right and bottom instead. While a term is open, the insets also reserve the folded Lines tab (bottom left on desktop, under the header on mobile), so centring on a station or pressing "fit" keeps labels like Multi-Agent System out from under it.
- **Listen button:** the term panel plays `/audio/<slug>.mp3` for slugs listed in `public/audio/manifest.json`, which is read at build time. Spoken scripts for all 91 terms are in `scripts/voice/`. All 91 narrations are recorded with Kokoro `af_heart` (local, free).
- **Study mode:** `?view=study`, or the Study button in the header. Each term has two flashcards, scheduled with SM-2 in localStorage (`aied:study:v1`). Filter by track and card type, with due, new and seen counts. Space flips and 1–4 grade. Anki TSV and CSV export run client-side.
- **Checks:** `npm run validate` and `npm run build` pass. Checked in headless Chrome at 1440×900, 1280×720 and 390×844 with no console errors except the expected 404 noted below. Checks covered: the default fit is clear of the header; centring on Multi-Agent System; keyboard grading in study mode; schedules persist across reloads; the track filter; both export downloads; Map/Study toggling; Listen on narrated terms.
- **Search by meaning:** the search box shows keyword (MiniSearch) results instantly. On first focus it lazy-loads a Web Worker with the all-MiniLM-L6-v2 model (quantized, ~23 MB, plus ~14 MB onnxruntime wasm, self-hosted under `public/search-model/` when present (fetched by `npm run search:assets` / `prebuild`); the worker falls back to the Hugging Face CDN if those files are omitted from a lean deploy). It embeds the query in the browser and fuses the ranking with the keyword results (reciprocal rank fusion) against term vectors precomputed at build time in `public/search/term-embeddings.json` (56 KB). Meaning-only hits carry a "by meaning" tag, and unrelated queries fall below a similarity floor. If the model can't load, keyword search stays. `npm run search:embeddings` regenerates the vectors; `npm run validate` fails when they are stale; `npm run search:check` runs 32 query checks (32/32 pass, including held-out queries and unrelated ones).
- **Map fit:** on desktop the default fit now scales the whole map down to 0.4 so no label hides behind the side panel. Phones keep a 0.6 minimum for legibility and pan.
- **Follow on X:** the unwired newsletter form is gone; the footer says new terms are announced on X and links to @fredoseiadu.

## Unfinished / TODO

- **Audio:** all 91 terms narrated with Kokoro `af_heart` (local). Re-run generation from `scripts/voice/` if a script changes, then `npm run audio:manifest`.
- **Proofread doubts:** `PROOFREAD-v2.md` lists claims and illustrative numbers for a domain expert to confirm.
- **Study progress** is separate from "Mark as learned" and, like it, lives in one browser.
- **Newsletter:** no service chosen yet (Buttondown, Beehiiv or Substack).
- **Map label widths are estimated**, not measured.
- **Adding a term needs a map position** in `lib/map/stationPlacements.ts`, a voice script, and a re-run of `npm run search:embeddings`.
- **No per-term static pages:** term views are client-side (`/?term=slug`).
- **Progress lives in one browser** (localStorage). No accounts, no sync.
- No deployment to a git remote yet (as requested).
