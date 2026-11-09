import assert from "node:assert/strict";
import { test } from "node:test";
import { upsertFrontmatter } from "./applyBuildThis";
import { parseTerm } from "./parseTerm";

const card = {
  title: "Build a refund-policy RAG bot",
  goal: "Answer support questions only from a policy PDF.",
  steps: ["Load the PDF", "Chunk and embed it", "Retrieve top chunks", "Answer with citations"],
  skills: ["RAG", "embeddings"],
  time: "an afternoon" as const,
  stretch: "Add a golden set of 20 questions.",
};

test("upsertFrontmatter adds buildThis and parseTerm reads it back", () => {
  const raw = `---\ntitle: RAG\ndescription: A pattern.\ndifficulty: beginner\ninterview: "Q?"\ninterviewAnswer: "A"\n---\n\nBody words go here.\n\n_Usage:_\n\n- "quote"\n`;
  const updated = upsertFrontmatter(raw, card);
  assert.match(updated, /buildThis:/);
  const again = upsertFrontmatter(updated, { ...card, title: "Build it twice" });
  assert.equal(again.indexOf("buildThis:"), again.lastIndexOf("buildThis:"));
  assert.match(again, /Build it twice/);
  // parseTerm needs enough body words only for validate; here we just check buildThis
  const term = parseTerm("rag", again + " " + "word ".repeat(200));
  assert.equal(term.buildThis?.title, "Build it twice");
});
