import assert from "node:assert/strict";
import { test } from "node:test";
import { createTermSearch } from "./termSearch";

const search = createTermSearch([
  { slug: "rag", title: "RAG", description: "Retrieval-augmented generation.", definitionText: "Fetch documents, then answer." },
  { slug: "chunking", title: "Chunking", description: "Splitting documents.", definitionText: "Cut long text into pieces." },
]);

test("keyword search ranks a title match first and tolerates prefixes", () => {
  assert.deepEqual(search.keywordSlugs("chunk", 8), ["chunking"]);
});

test("keyword search returns at most `limit` slugs", () => {
  assert.equal(search.keywordSlugs("documents", 1).length, 1);
});

test("hitFor describes any term by slug", () => {
  assert.deepEqual(search.hitFor("rag"), { slug: "rag", title: "RAG", description: "Retrieval-augmented generation." });
  assert.equal(search.hitFor("missing"), undefined);
});
