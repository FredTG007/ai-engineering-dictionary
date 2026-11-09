import assert from "node:assert/strict";
import { test } from "node:test";
import { findStaleEmbeddings, parseTermEmbeddingsFile, type TermEmbeddingsFile } from "./termEmbeddings";
import { EMBEDDING_MODEL } from "./semanticModel";

const file = (terms: { slug: string; hash: string }[], model: string = EMBEDDING_MODEL.id): TermEmbeddingsFile => ({
  model,
  dimensions: EMBEDDING_MODEL.dimensions,
  terms: terms.map((term) => ({ ...term, scale: 0.01, values: "AAAA" })),
});

test("embeddings that match every term's hash are fresh", () => {
  const expected = [{ slug: "rag", hash: "h1" }];
  assert.deepEqual(findStaleEmbeddings(expected, file(expected)), []);
});

test("a missing embeddings file is reported once", () => {
  const errors = findStaleEmbeddings([{ slug: "rag", hash: "h1" }], null);
  assert.equal(errors.length, 1);
  assert.match(errors[0].message, /npm run search:embeddings/);
});

test("a term whose text changed is reported as stale", () => {
  const errors = findStaleEmbeddings([{ slug: "rag", hash: "new" }], file([{ slug: "rag", hash: "old" }]));
  assert.deepEqual(errors.map((error) => error.slug), ["embeddings:rag"]);
});

test("new terms and deleted terms are both reported", () => {
  const errors = findStaleEmbeddings([{ slug: "new-term", hash: "h" }], file([{ slug: "gone", hash: "h" }]));
  assert.deepEqual(errors.map((error) => error.slug).sort(), ["embeddings:gone", "embeddings:new-term"]);
});

test("embeddings from a different model are stale", () => {
  const expected = [{ slug: "rag", hash: "h1" }];
  assert.equal(findStaleEmbeddings(expected, file(expected, "some/other-model")).length, 1);
});

test("parsing rejects a file without a terms list", () => {
  assert.throws(() => parseTermEmbeddingsFile(JSON.stringify({ model: "m", dimensions: 3 })));
});

test("parsing accepts a well-formed file", () => {
  const parsed = parseTermEmbeddingsFile(JSON.stringify(file([{ slug: "rag", hash: "h" }])));
  assert.equal(parsed.terms[0].slug, "rag");
});
