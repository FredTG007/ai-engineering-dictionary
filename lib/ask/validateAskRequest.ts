import { MAX_HITS, MAX_QUESTION_CHARS, MIN_HITS } from "./limits";

export interface ParsedAskRequest {
  question: string;
  hits: Array<{ slug: string; score: number }>;
}

/** Pure: parse and bound the client payload. Throws a short reason string. */
export function parseAskRequest(body: unknown): ParsedAskRequest {
  if (!isRecord(body)) throw new Error("body must be a JSON object");
  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (question.length === 0) throw new Error("question is empty");
  if (question.length > MAX_QUESTION_CHARS) {
    throw new Error(`question is too long (max ${MAX_QUESTION_CHARS} characters)`);
  }
  if (!Array.isArray(body.hits)) throw new Error("hits must be a list");
  if (body.hits.length < MIN_HITS) throw new Error("no retrieved terms — try a question about AI engineering");
  const hits = body.hits.slice(0, MAX_HITS).map((hit, index) => {
    if (!isRecord(hit) || typeof hit.slug !== "string" || hit.slug.trim() === "") {
      throw new Error(`hits[${index}] needs a slug`);
    }
    const score = typeof hit.score === "number" && Number.isFinite(hit.score) ? hit.score : 0;
    return { slug: hit.slug.trim(), score };
  });
  return { question, hits };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
