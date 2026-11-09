import assert from "node:assert/strict";
import { test } from "node:test";
import { buildAskCorpus } from "./corpus";
import { resolveAskHits } from "./resolveHits";
import type { Term } from "../content/types";

const term = {
  slug: "rag",
  title: "RAG",
  description: "Fetch docs at request time.",
  difficulty: "beginner",
  interview: "Q?",
  interviewAnswer: "A",
  definitionMarkdown: "Retrieval-augmented generation puts documents in the prompt. " + "word ".repeat(300),
  quotes: [],
  outgoingSlugs: [],
  hasUsageSection: true,
  buildThis: null,
} satisfies Term;

test("buildAskCorpus keeps a bounded passage", () => {
  const file = buildAskCorpus([term]);
  assert.equal(file.terms[0].slug, "rag");
  assert.ok(file.terms[0].passage.split(/\s+/).length < 250);
});

test("resolveAskHits drops unknown slugs and keeps scores", () => {
  const corpus = buildAskCorpus([term]);
  const hits = resolveAskHits(
    [
      { slug: "rag", score: 0.9 },
      { slug: "nope", score: 0.8 },
    ],
    corpus,
  );
  assert.deepEqual(
    hits.map((hit) => hit.slug),
    ["rag"],
  );
  assert.equal(hits[0].score, 0.9);
});
