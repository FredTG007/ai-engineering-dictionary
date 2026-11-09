import assert from "node:assert/strict";
import { test } from "node:test";
import { parseAskRequest } from "./validateAskRequest";

test("parseAskRequest accepts a short question with hits", () => {
  const parsed = parseAskRequest({ question: "Why does my bot invent policies?", hits: [{ slug: "hallucination", score: 0.7 }] });
  assert.equal(parsed.hits[0].slug, "hallucination");
});

test("parseAskRequest rejects an empty or huge question", () => {
  assert.throws(() => parseAskRequest({ question: "  ", hits: [{ slug: "rag", score: 0.5 }] }), /empty/);
  assert.throws(() => parseAskRequest({ question: "x".repeat(400), hits: [{ slug: "rag", score: 0.5 }] }), /too long/);
});
