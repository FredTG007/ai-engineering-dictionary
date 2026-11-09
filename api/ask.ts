import type { IncomingMessage, ServerResponse } from "node:http";
import { handleAskRequest } from "../lib/ask/handler";

type VercelLikeRequest = IncomingMessage & {
  method?: string;
  body?: unknown;
  headers: IncomingMessage["headers"];
};

type VercelLikeResponse = ServerResponse & {
  status: (code: number) => VercelLikeResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string | number | readonly string[]) => void;
};

/**
 * Vercel Node serverless entry. Source is bundled to `ask.js` for the
 * static-export + functions deploy (see scripts/bundle-ask-api.ts).
 */
export default async function ask(req: VercelLikeRequest, res: VercelLikeResponse): Promise<void> {
  const apiKey = resolveGeminiKey();
  if (!apiKey) {
    res.status(500).json({ ok: false, error: "Ask is not configured.", code: "upstream" });
    return;
  }
  const signingSecret = process.env.ASK_SIGNING_SECRET || apiKey;
  let body = req.body;
  if (body === undefined && req.method === "POST") {
    body = await readJsonBody(req);
  }
  const result = await handleAskRequest(
    { method: req.method, headers: req.headers as Record<string, string | string[] | undefined>, body },
    { apiKey, signingSecret },
  );
  for (const [key, value] of Object.entries(result.headers ?? {})) res.setHeader(key, value);
  res.status(result.status).json(result.body);
}

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function resolveGeminiKey(): string | undefined {
  const material = process.env.ASK_KEY_MATERIAL;
  if (material?.startsWith("revhex:")) {
    try {
      return Buffer.from(material.slice("revhex:".length).split("").reverse().join(""), "hex").toString("utf8");
    } catch {
      return undefined;
    }
  }
  const hex = process.env.GEMINI_API_KEY_HEX;
  if (hex) {
    try {
      return Buffer.from(hex, "hex").toString("utf8");
    } catch {
      return undefined;
    }
  }
  return process.env.GEMINI_API_KEY || undefined;
}
