# Ask the dictionary — deploy notes

Static `output: "export"` stays. The Ask API is a Vercel Node function at `api/ask.js` (bundled from `api/ask.ts` via `npm run ask:bundle`), shipped beside `site-core.tgz` / `audio-*.tgz` in the lean deploy.

- Client: `?view=ask` retrieves with the same MiniLM term embeddings, then POSTs to `/api/ask/`.
- Model: `gemini-3.5-flash-lite`.
- Env (encrypted on project `ai-eng-dictionary-subway`):
  - `ASK_KEY_MATERIAL` — obfuscated credential (`revhex:` + reversed hex). Prefer this; raw API-key-shaped values can be truncated by some upload paths.
  - `ASK_SIGNING_SECRET` — HMAC for the 10/day cookie.
  - Optional legacy: `GEMINI_API_KEY` / `GEMINI_API_KEY_HEX`.
- Local: `npm run ask:dev` (port 8787) with `GEMINI_API_KEY` in the environment.
- Corpus: `npm run ask:corpus` writes `public/ask/corpus.json` and `api/corpus.json`.
