import assert from "node:assert/strict";
import { test } from "node:test";
import { decodeEmbedding, encodeEmbedding } from "./embeddingCodec";

test("an encoded vector decodes to within one int8 step of the original", () => {
  const original = [0.5, -0.25, 0.125, -0.0625, 0];
  const decoded = decodeEmbedding(encodeEmbedding(original));
  const step = 0.5 / 127;
  assert.equal(decoded.length, original.length);
  original.forEach((value, index) => assert.ok(Math.abs(decoded[index] - value) <= step / 2 + 1e-9));
});

test("the largest component keeps its exact value", () => {
  const decoded = decodeEmbedding(encodeEmbedding([0.1, -0.9, 0.3]));
  assert.ok(Math.abs(decoded[1] - -0.9) < 1e-6);
});

test("encoding stores one byte per dimension as base64", () => {
  const encoded = encodeEmbedding(new Array(384).fill(0.05));
  assert.equal(atob(encoded.values).length, 384);
});

test("an all-zero vector round-trips without dividing by zero", () => {
  assert.deepEqual(Array.from(decodeEmbedding(encodeEmbedding([0, 0, 0]))), [0, 0, 0]);
});
