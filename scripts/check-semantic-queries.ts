/**
 * Offline quality check for search by meaning: runs natural-language queries through the
 * same model and the committed term vectors, fuses them with keyword search exactly like
 * the search box does, and checks an expected term lands in the top 3. Unrelated queries
 * must get no meaning match above the floor.
 */
import { loadTerms } from "../lib/content/loadDictionary";
import { markdownToPlainText } from "../lib/content/renderMarkdown";
import { decodeEmbedding } from "../lib/search/embeddingCodec";
import { combineSearchResults, MEANING_FLOOR, RESULT_LIMIT } from "../lib/search/hybridSearch";
import { loadTermEmbeddingsFile } from "../lib/search/loadEmbeddingSources";
import { loadNodeEmbedder } from "../lib/search/loadNodeEmbedder";
import { rankByMeaning, type TermVector } from "../lib/search/rankByMeaning";
import { createTermSearch, type TermSearch } from "../lib/search/termSearch";

interface ExpectedQuery {
  query: string;
  /** Any of these in the top 3 counts as a pass. */
  expected: string[];
  /** Written before the search hints, to show how tuning generalises. */
  heldOut?: true;
}

const COST = ["cost-tracking", "tokens", "caching", "prompt-caching", "semantic-caching", "model-routing", "llm-gateway"];
const SPEED = ["latency", "streaming", "time-to-first-token", "speculative-decoding", "caching", "kv-cache", "semantic-caching"];

const QUERIES: ExpectedQuery[] = [
  { query: "why does my bot make things up", expected: ["hallucination"] },
  { query: "my bill exploded", expected: COST },
  { query: "bill suddenly doubled", expected: COST },
  { query: "someone tricks the bot with hidden instructions", expected: ["prompt-injection", "indirect-prompt-injection", "jailbreak"] },
  { query: "make answers faster", expected: SPEED },
  { query: "the model forgot what we said earlier", expected: ["memory", "context-window"] },
  { query: "how do I know if my prompt change made things worse", expected: ["evals", "regression-evals", "ab-testing-prompts", "prompt-versioning"] },
  { query: "find documents similar to a question", expected: ["similarity-search", "embeddings", "vector-database"] },
  { query: "stop the bot from saying something offensive", expected: ["guardrails", "content-moderation"] },
  { query: "the answers got worse over time", expected: ["drift"] },
  { query: "split long documents into pieces", expected: ["chunking"] },
  { query: "let the model call my API", expected: ["tool-calling", "function-schema"] },
  { query: "the model returns broken JSON", expected: ["structured-output", "function-schema"] },
  { query: "hide customer emails and phone numbers before sending to the model", expected: ["pii-redaction"] },
  { query: "the provider keeps returning 429 errors", expected: ["rate-limits", "retries-and-timeouts", "fallback-models"] },
  { query: "use a cheaper model for easy questions", expected: ["model-routing", "distillation"] },
  { query: "chatbot gave a wrong answer with total confidence", expected: ["hallucination", "grounding"], heldOut: true },
  { query: "our invoice from the model provider is way higher this month", expected: COST, heldOut: true },
  { query: "a webpage the agent read told it to email our secrets", expected: ["indirect-prompt-injection", "prompt-injection"], heldOut: true },
  { query: "users wait too long before the first word appears", expected: SPEED, heldOut: true },
  { query: "quality slowly declined after launch", expected: ["drift", "online-vs-offline-evals", "user-feedback-loops"], heldOut: true },
  { query: "the bot is rude to customers", expected: ["guardrails", "content-moderation", "system-prompt"], heldOut: true },
  { query: "the assistant does not remember me between sessions", expected: ["memory"], heldOut: true },
  { query: "people ask the same question again and again and we pay every time", expected: ["semantic-caching", "caching", "prompt-caching"], heldOut: true },
  { query: "run the model on our own servers", expected: ["open-weight-models", "gpu-serving", "inference"], heldOut: true },
  { query: "which retrieved passage is actually most relevant", expected: ["reranking", "retrieval-metrics"], heldOut: true },
];

const UNRELATED = ["banana bread recipe", "football world cup", "how to tie a tie", "cheap flights to lisbon", "my cat is sick", "kitchen renovation ideas"];

async function main(): Promise<void> {
  const file = loadTermEmbeddingsFile();
  if (!file) throw new Error("no term embeddings; run `npm run search:embeddings` first");
  const termVectors: TermVector[] = file.terms.map((term) => ({ slug: term.slug, vector: decodeEmbedding(term) }));
  const keywordSearch = createTermSearch(
    loadTerms().map((term) => ({ ...term, definitionText: markdownToPlainText(term.definitionMarkdown) })),
  );
  const embed = await loadNodeEmbedder();
  const queryVectors = await embed([...QUERIES.map((entry) => entry.query), ...UNRELATED]);
  const meaningOf = (index: number) => rankByMeaning(queryVectors[index], termVectors, { floor: MEANING_FLOOR, limit: RESULT_LIMIT });

  const failures = [
    ...QUERIES.filter((entry, index) => !checkQuery(entry, meaningOf(index).map((match) => match.slug), keywordSearch)),
    ...UNRELATED.filter((query, index) => !checkUnrelated(query, meaningOf(QUERIES.length + index))),
  ];
  const total = QUERIES.length + UNRELATED.length;
  console.log(`\n${total - failures.length}/${total} checks pass (meaning floor ${MEANING_FLOOR}).`);
  if (failures.length > 0) process.exit(1);
}

function checkQuery(entry: ExpectedQuery, meaningSlugs: string[], keywordSearch: TermSearch): boolean {
  const keywordSlugs = keywordSearch.keywordSlugs(entry.query, RESULT_LIMIT);
  const results = combineSearchResults(entry.query, keywordSlugs, meaningSlugs);
  const position = results.findIndex((result) => entry.expected.includes(result.slug)) + 1;
  const passed = position >= 1 && position <= 3;
  const top3 = results.slice(0, 3).map((result) => `${result.slug}${result.foundBy === "meaning" ? "*" : ""}`).join(", ");
  console.log(`${passed ? "✓" : "✗"} ${entry.heldOut ? "[held out] " : ""}"${entry.query}" → #${position || "-"}  [${top3}]`);
  return passed;
}

function checkUnrelated(query: string, matches: { slug: string; similarity: number }[]): boolean {
  const passed = matches.length === 0;
  const detail = passed ? "no meaning match" : matches.map((match) => `${match.slug} ${match.similarity.toFixed(2)}`).join(", ");
  console.log(`${passed ? "✓" : "✗"} [unrelated] "${query}" → ${detail}`);
  return passed;
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
