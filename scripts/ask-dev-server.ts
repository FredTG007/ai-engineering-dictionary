/**
 * Local Ask API on :8787 for `next dev` / static `serve out` testing.
 * Reads GEMINI_API_KEY from the environment; never prints it.
 */
import { createServer } from "node:http";
import { handleAskRequest } from "../lib/ask/handler";

const port = Number(process.env.ASK_PORT ?? 8787);
const apiKey = process.env.GEMINI_API_KEY || (process.env.GEMINI_API_KEY_HEX ? Buffer.from(process.env.GEMINI_API_KEY_HEX, "hex").toString("utf8") : "");
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set");
  process.exit(1);
}
const signingSecret = process.env.ASK_SIGNING_SECRET || apiKey;

createServer(async (req, res) => {
  if (!req.url?.startsWith("/api/ask")) {
    res.writeHead(404).end("not found");
    return;
  }
  const body = req.method === "POST" ? await readBody(req) : undefined;
  const result = await handleAskRequest(
    { method: req.method, headers: req.headers, body },
    { apiKey, signingSecret },
  );
  const headers = { "content-type": "application/json", ...(result.headers ?? {}) };
  res.writeHead(result.status, headers);
  res.end(JSON.stringify(result.body));
}).listen(port, () => {
  console.log(`Ask dev server on http://127.0.0.1:${port}/api/ask`);
});

function readBody(req: import("node:http").IncomingMessage): Promise<unknown> {
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
