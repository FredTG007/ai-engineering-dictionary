# Status

## v2: subway map (branch `v2-subway`)

- **Terms:** 74, all in `internal/Curriculum.md`, all on at least one of 8 tracks in `internal/Tracks.md`. Nine stations are interchanges.
- **Frontmatter:** every term now has `difficulty` (30 beginner, 35 intermediate, 9 advanced), `interview` and `interviewAnswer`. Only frontmatter lines were added; entry prose is unchanged from the proofread v1.
- **Map:** the layout is hand-tuned in `lib/map/stationPlacements.ts`. `npm run validate` checks that no label overlaps another label, a station or a line, and that no line runs through a station it doesn't serve.
- **Removed:** the 3D graph (`lib/graph/`, `components/graph/`) and the `three`, `@react-three/fiber`, `@react-three/drei` and `@types/three` dependencies.
- **Checks:** `npm run validate` and `npm run build` pass. Checked in headless Chrome at 1440×900 and 390×844 with no console errors: the overview fits beside the welcome card; click-to-centre; dragging from a station pans without selecting it; wheel zoom; keyboard activation of stations; search; in-definition links and back/forward; connection chips; prev/next; learned ticks persist across reloads; track highlight and "continue"; the palette persists without a flash; unknown `?term=` falls back to the welcome card.
- **Fixed from v1:** the palette no longer flashes the default colours on load.

## Unfinished / TODO

- **X handle:** `components/chrome/Footer.tsx` links to `https://x.com/` as a placeholder (marked `TODO`).
- **Newsletter:** the form is UI only. It shows a friendly message and sends nothing (`// TODO: wire newsletter backend` in `components/chrome/NewsletterForm.tsx`). It now sits in the welcome card.
- **Map label widths are estimated**, not measured. The estimate is deliberately generous and matches the self-hosted fonts in Chrome. A fallback font could render wider labels, though the overlap check leaves a few pixels of room.
- **Adding a term needs a map position** in `lib/map/stationPlacements.ts`. There is no automatic layout. The validator tells you when a station is missing or a label collides.
- **No per-term static pages:** term views are client-side (`/?term=slug`), so search engines index only the home page.
- **Progress lives in one browser** (localStorage). There are no accounts and no sync.
- No deployment and no git remote set up (as requested).
