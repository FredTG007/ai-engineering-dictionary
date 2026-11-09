import assert from "node:assert/strict";
import { test } from "node:test";
import { fuseRankings } from "./rankFusion";

const slugs = (results: { slug: string }[]) => results.map((result) => result.slug);

test("a term both rankings agree on beats a term only one of them found", () => {
  const fused = fuseRankings({ keyword: ["a", "b"], meaning: ["b", "c"] }, { meaningWeight: 1 });
  assert.equal(fused[0].slug, "b");
});

test("each result says which ranking found it", () => {
  const fused = fuseRankings({ keyword: ["a", "b"], meaning: ["b", "c"] }, { meaningWeight: 1 });
  assert.deepEqual(
    Object.fromEntries(fused.map((result) => [result.slug, result.foundBy])),
    { a: "keyword", b: "both", c: "meaning" },
  );
});

test("with no meaning ranking the keyword order is kept", () => {
  assert.deepEqual(slugs(fuseRankings({ keyword: ["x", "y", "z"], meaning: [] }, { meaningWeight: 1 })), ["x", "y", "z"]);
});

test("a heavier meaning weight lets the top meaning result beat the top keyword result", () => {
  const fused = fuseRankings({ keyword: ["junk"], meaning: ["hallucination"] }, { meaningWeight: 1.5 });
  assert.deepEqual(slugs(fused), ["hallucination", "junk"]);
});

test("equal weights break a tie in favour of the keyword ranking", () => {
  assert.deepEqual(slugs(fuseRankings({ keyword: ["k"], meaning: ["m"] }, { meaningWeight: 1 })), ["k", "m"]);
});
