import assert from "node:assert/strict";
import { test } from "node:test";
import type { Term } from "../content/types";
import { findBuildThisProblems } from "./validateDictionary";

function stubTerm(overrides: Partial<Term> = {}): Term {
  return {
    slug: "rag",
    title: "RAG",
    description: "desc",
    difficulty: "beginner",
    interview: "Q?",
    interviewAnswer: "A",
    definitionMarkdown: "body",
    quotes: ["q"],
    outgoingSlugs: [],
    hasUsageSection: true,
    buildThis: {
      title: "Build a refund-policy RAG bot",
      goal: "Answer support questions only from a policy PDF.",
      steps: ["Load the PDF", "Chunk and embed it", "Retrieve top chunks", "Answer with citations"],
      skills: ["RAG", "embeddings"],
      time: "an afternoon",
      stretch: "Add a golden set of 20 questions.",
    },
    ...overrides,
  };
}

test("findBuildThisProblems flags a missing card", () => {
  const errors = findBuildThisProblems([stubTerm({ buildThis: null })]);
  assert.equal(errors.length, 1);
  assert.match(errors[0].message, /buildThis/);
});

test("findBuildThisProblems accepts a complete card", () => {
  assert.deepEqual(findBuildThisProblems([stubTerm()]), []);
});
