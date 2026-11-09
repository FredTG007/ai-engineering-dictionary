import assert from "node:assert/strict";
import { test } from "node:test";
import { parseBuildThis, BUILD_THIS_TIMES } from "./buildThis";

test("parseBuildThis accepts a complete card", () => {
  const card = parseBuildThis({
    title: "Build a refund-policy RAG bot",
    goal: "Answer support questions only from a policy PDF.",
    steps: ["Load the PDF", "Chunk and embed it", "Retrieve top chunks", "Answer with citations"],
    skills: ["RAG", "embeddings", "evals"],
    time: "an afternoon",
    stretch: "Add a golden set of 20 questions and fail the build when recall drops.",
  });
  assert.equal(card.title, "Build a refund-policy RAG bot");
  assert.equal(card.steps.length, 4);
  assert.equal(card.time, "an afternoon");
});

test("parseBuildThis rejects missing fields and bad time", () => {
  assert.throws(() => parseBuildThis({ title: "x" }), /goal/);
  assert.throws(
    () =>
      parseBuildThis({
        title: "x",
        goal: "y",
        steps: ["a", "b", "c"],
        skills: ["s"],
        time: "forever",
        stretch: "z",
      }),
    /time/,
  );
  assert.ok(BUILD_THIS_TIMES.includes("a weekend"));
});

test("parseBuildThis requires 3 to 5 steps", () => {
  assert.throws(
    () =>
      parseBuildThis({
        title: "x",
        goal: "y",
        steps: ["a", "b"],
        skills: ["s"],
        time: "an afternoon",
        stretch: "z",
      }),
    /steps/,
  );
});
