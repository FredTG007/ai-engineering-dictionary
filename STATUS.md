# Status

- **Terms:** 74 (all listed in `internal/Curriculum.md`; every term has at least one incoming and one outgoing link).
- **Graph:** 325 undirected edges derived from links between entries.
- `npm run validate` passes and `npm run build` produces `out/`.
- Checked in headless Chrome: graph rendering, node click/fly-to, `?term=` deep links and back/forward, search with the keyboard, palette switching, in-definition links, connection chips, newsletter message, and the mobile bottom sheet.

## Unfinished / TODO

- **X handle:** `components/chrome/Footer.tsx` links to `https://x.com/` as a placeholder (marked `TODO`).
- **Newsletter:** the form is UI only. It shows a friendly message and sends nothing (`// TODO: wire newsletter backend` in `components/chrome/NewsletterForm.tsx`).
- **Palette flash:** the stored palette is applied after hydration, so a returning visitor with a non-default palette may see the default colours for a moment.
- **No per-term static pages:** term views are client-side (`/?term=slug`), so search engines index only the home page.
- No deployment and no git remote set up (as requested).
