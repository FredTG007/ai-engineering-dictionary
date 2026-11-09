import assert from "node:assert/strict";
import { test } from "node:test";
import { combineSearchResults, hybridHits, meaningWeightFor, RESULT_LIMIT } from "./hybridSearch";
import { createTermSearch } from "./termSearch";

test("a sentence-like query trusts meaning more than keywords", () => {
  assert.ok(meaningWeightFor("why does my bot make things up") > 1);
});

test("a one- or two-word query trusts keywords more than meaning", () => {
  assert.ok(meaningWeightFor("rag") < 1);
  assert.ok(meaningWeightFor("  prompt   caching ") < 1);
});

test("for a sentence, the top meaning match beats keyword matches on filler words", () => {
  const results = combineSearchResults("why does my bot make things up", ["embeddings", "function-schema"], ["hallucination", "grounding"]);
  assert.equal(results[0].slug, "hallucination");
  assert.equal(results[0].foundBy, "meaning");
});

test("for a short query, keyword order leads", () => {
  const results = combineSearchResults("rag", ["rag", "query-rewriting"], ["tool-calling"]);
  assert.deepEqual(results.map((result) => result.slug), ["rag", "query-rewriting", "tool-calling"]);
});

test("no more than RESULT_LIMIT results come back", () => {
  const many = Array.from({ length: 20 }, (_, index) => `term-${index}`);
  assert.equal(combineSearchResults("a b c", many, many.slice().reverse()).length, RESULT_LIMIT);
});

const search = createTermSearch([
  { slug: "hallucination", title: "Hallucination", description: "Confidently wrong output.", definitionText: "Invented facts." },
  { slug: "embeddings", title: "Embeddings", description: "Vectors for text.", definitionText: "Why does my bot need numbers." },
]);

test("before meaning results arrive, hits are the keyword results", () => {
  const hits = hybridHits(search, "why does my bot", []);
  assert.deepEqual(hits.map((hit) => [hit.slug, hit.foundBy]), [["embeddings", "keyword"]]);
});

test("meaning-only hits carry their title and description and are marked as found by meaning", () => {
  const [top] = hybridHits(search, "why does my bot make things up", ["hallucination"]);
  assert.deepEqual(top, { slug: "hallucination", title: "Hallucination", description: "Confidently wrong output.", foundBy: "meaning" });
});

test("a meaning slug with no matching term is skipped", () => {
  assert.deepEqual(hybridHits(search, "zzz qqq xxx", ["not-a-term"]), []);
});
