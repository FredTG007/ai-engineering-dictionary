import { GEMINI_MODEL } from "./limits";

export interface GeminiResult {
  text: string;
  model: string;
}

/** Call Gemini generateContent over HTTPS. Never logs the API key. */
export async function callGemini(options: {
  apiKey: string;
  prompt: string;
  model?: string;
  fetchImpl?: typeof fetch;
}): Promise<GeminiResult> {
  const model = options.model ?? GEMINI_MODEL;
  const fetchImpl = options.fetchImpl ?? fetch;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(options.apiKey)}`;
  const response = await fetchImpl(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: options.prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
    }),
  });
  if (response.status === 429) {
    const err = new Error("quota");
    err.name = "QuotaError";
    throw err;
  }
  if (!response.ok) {
    const err = new Error(`upstream ${response.status}`);
    err.name = "UpstreamError";
    throw err;
  }
  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
  if (!text.trim()) {
    const err = new Error("empty model reply");
    err.name = "UpstreamError";
    throw err;
  }
  return { text: text.trim(), model };
}
