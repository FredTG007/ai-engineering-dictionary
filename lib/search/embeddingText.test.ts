import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFINITION_WORDS, embeddingTextOf, findSearchHintProblems } from "./embeddingText";

const term = {
  slug: "hallucination",
  title: "Hallucination",
  description: "When a model states something false.",
  definitionMarkdown: `A **hallucination** links to [LLM](./llm.md) and ${"word ".repeat(100)}`,
};

test("the embedded text starts with the title, then the search hint, then the description", () => {
  const text = embeddingTextOf(term, "the bot makes stuff up");
  assert.ok(text.startsWith("Hallucination. the bot makes stuff up. When a model states something false."));
});

test("only the opening words of the definition are embedded, as plain text", () => {
  const text = embeddingTextOf(term, "hint");
  const definitionPart = text.split("something false. ")[1];
  assert.equal(definitionPart.split(" ").length, DEFINITION_WORDS);
  assert.ok(definitionPart.startsWith("A hallucination links to LLM and"));
});

test("a term without a search hint, and a hint without a term, are both reported", () => {
  const problems = findSearchHintProblems(["rag", "evals"], { rag: "answer from our docs", gone: "old hint" });
  assert.deepEqual(problems.map((problem) => problem.slug).sort(), ["search-hint:evals", "search-hint:gone"]);
});
