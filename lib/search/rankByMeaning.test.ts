import assert from "node:assert/strict";
import { test } from "node:test";
import { dotProduct, rankByMeaning } from "./rankByMeaning";

test("dotProduct multiplies matching components and sums them", () => {
  assert.equal(dotProduct(Float32Array.from([1, 2, 3]), Float32Array.from([4, -5, 6])), 12);
});

test("dotProduct of a unit vector with itself is its cosine similarity, 1", () => {
  const unit = Float32Array.from([0.6, 0.8]);
  assert.ok(Math.abs(dotProduct(unit, unit) - 1) < 1e-6);
});

const index = [
  { slug: "north", vector: Float32Array.from([0, 1]) },
  { slug: "east", vector: Float32Array.from([1, 0]) },
  { slug: "north-east", vector: Float32Array.from([Math.SQRT1_2, Math.SQRT1_2]) },
];

test("terms are ordered from most to least similar", () => {
  const ranked = rankByMeaning(Float32Array.from([0.28, 0.96]), index, { floor: -1, limit: 3 });
  assert.deepEqual(ranked.map((match) => match.slug), ["north", "north-east", "east"]);
});

test("terms below the similarity floor are dropped", () => {
  const ranked = rankByMeaning(Float32Array.from([0, 1]), index, { floor: 0.5, limit: 3 });
  assert.deepEqual(ranked.map((match) => match.slug), ["north", "north-east"]);
});

test("at most `limit` terms are returned", () => {
  assert.equal(rankByMeaning(Float32Array.from([0, 1]), index, { floor: -1, limit: 1 }).length, 1);
});
