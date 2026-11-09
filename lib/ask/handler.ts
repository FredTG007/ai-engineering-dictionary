import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildAskPrompt, isOffTopicReply } from "./buildAskPrompt";
import { callGemini } from "./callGemini";
import type { AskCorpusFile } from "./corpusTypes";
import { resolveAskHits } from "./resolveHits";
import { consumeAskQuota, rateLimitCookieName } from "./rateLimit";
import type { AskResponse } from "./types";
import { parseAskRequest } from "./validateAskRequest";

export interface AskHttpRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
}

export interface AskHttpResult {
  status: number;
  body: AskResponse | { ok: true; service: string };
  headers?: Record<string, string>;
}

let cachedCorpus: AskCorpusFile | null = null;

/** Load the ask corpus once per isolate (next to the function, or api/ under cwd). */
export function loadAskCorpus(): AskCorpusFile {
  if (cachedCorpus) return cachedCorpus;
  const candidates = corpusCandidates();
  for (const path of candidates) {
    try {
      cachedCorpus = JSON.parse(readFileSync(path, "utf8")) as AskCorpusFile;
      return cachedCorpus;
    } catch {
      // try next
    }
  }
  throw new Error("ask corpus.json not found");
}

function corpusCandidates(): string[] {
  const paths = [join(process.cwd(), "api", "corpus.json"), join(process.cwd(), "corpus.json")];
  const dirname = (globalThis as { __dirname?: string }).__dirname;
  if (typeof dirname === "string") paths.unshift(join(dirname, "corpus.json"));
  return paths;
}

/** Pure-ish HTTP handler shared by Vercel and the local dev server. */
export async function handleAskRequest(
  req: AskHttpRequest,
  options: { apiKey: string; signingSecret: string; corpus?: AskCorpusFile; fetchImpl?: typeof fetch },
): Promise<AskHttpResult> {
  if (req.method === "OPTIONS") {
    return { status: 204, body: { ok: true, service: "ask" }, headers: corsHeaders() };
  }
  if (req.method === "GET") {
    return { status: 200, body: { ok: true, service: "ask" }, headers: corsHeaders() };
  }
  if (req.method !== "POST") {
    return json(405, { ok: false, error: "Use POST.", code: "bad_request" });
  }

  let parsed;
  try {
    parsed = parseAskRequest(req.body);
  } catch (error) {
    return json(400, { ok: false, error: error instanceof Error ? error.message : "bad request", code: "bad_request" });
  }

  const cookieHeader = header(req.headers, "cookie");
  const quota = consumeAskQuota({ cookieHeader, secret: options.signingSecret });
  const setCookie = `${rateLimitCookieName()}=${quota.cookieValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=172800`;
  if (!quota.allowed) {
    return json(
      429,
      {
        ok: false,
        error: "Daily ask limit reached (10 questions). Try again tomorrow.",
        code: "rate_limited",
        remaining: 0,
      },
      setCookie,
    );
  }

  const corpus = options.corpus ?? loadAskCorpus();
  const retrieval = resolveAskHits(parsed.hits, corpus);
  if (retrieval.length === 0) {
    return json(
      400,
      {
        ok: false,
        error: "None of the retrieved terms are in the dictionary.",
        code: "bad_request",
        remaining: quota.remaining,
      },
      setCookie,
    );
  }

  const prompt = buildAskPrompt(parsed.question, retrieval);
  try {
    const { text, model } = await callGemini({ apiKey: options.apiKey, prompt, fetchImpl: options.fetchImpl });
    if (isOffTopicReply(text)) {
      return json(
        200,
        {
          ok: false,
          error: "That sits outside this dictionary. Try a question about shipping LLM systems.",
          code: "off_topic",
          remaining: quota.remaining,
        },
        setCookie,
      );
    }
    const citations = [...new Set(retrieval.map((hit) => hit.title))];
    return json(
      200,
      {
        ok: true,
        answer: text,
        citations,
        retrieval,
        prompt,
        model,
        remaining: quota.remaining,
      },
      setCookie,
    );
  } catch (error) {
    if (error instanceof Error && error.name === "QuotaError") {
      return json(
        503,
        {
          ok: false,
          error: "The free Gemini quota is exhausted for now. Please try again later.",
          code: "quota",
          remaining: quota.remaining,
        },
        setCookie,
      );
    }
    const detail = error instanceof Error ? error.message : "unknown";
    return json(
      502,
      {
        ok: false,
        error: `The answer service hiccuped (${detail}). Please try again in a moment.`,
        code: "upstream",
        remaining: quota.remaining,
      },
      setCookie,
    );
  }
}

function json(status: number, body: AskResponse, setCookie?: string): AskHttpResult {
  return {
    status,
    body,
    headers: {
      ...corsHeaders(),
      ...(setCookie ? { "Set-Cookie": setCookie } : {}),
    },
  };
}

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

function header(headers: AskHttpRequest["headers"], name: string): string | undefined {
  const value = headers[name] ?? headers[name.toLowerCase()];
  if (Array.isArray(value)) return value.join("; ");
  return value;
}
