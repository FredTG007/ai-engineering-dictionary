import type { AskResponse } from "./types";

/** Browser helper: POST a question + retrieval hits to /api/ask. */
export async function askDictionary(options: {
  question: string;
  hits: Array<{ slug: string; score: number }>;
  endpoint?: string;
}): Promise<AskResponse> {
  const endpoint = options.endpoint ?? askEndpoint();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ question: options.question, hits: options.hits }),
  });
  const data = (await response.json()) as AskResponse;
  return data;
}

/** Local next/serve uses a side server on :8787; production uses same-origin /api/ask. */
export function askEndpoint(): string {
  if (typeof window === "undefined") return "/api/ask/";
  const override = (window as unknown as { __ASK_API__?: string }).__ASK_API__;
  if (override) return override;
  if (window.location.port === "3000" || window.location.port === "3001") {
    return `http://127.0.0.1:8787/api/ask`;
  }
  return "/api/ask/";
}
