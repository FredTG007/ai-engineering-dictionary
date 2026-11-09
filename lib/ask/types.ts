/** One retrieved dictionary passage sent to / used by the ask endpoint. */
export interface AskHit {
  slug: string;
  title: string;
  /** Cosine similarity from the browser MiniLM retrieval, 0..1. */
  score: number;
  /** Plain-text passage the model is allowed to use. */
  passage: string;
}

export interface AskRequestBody {
  question: string;
  /** Client-ranked hits from the precomputed term embeddings. */
  hits: Array<{ slug: string; score: number }>;
}

export interface AskSuccess {
  ok: true;
  answer: string;
  citations: string[];
  retrieval: AskHit[];
  prompt: string;
  model: string;
  remaining: number;
}

export interface AskFailure {
  ok: false;
  error: string;
  code: "bad_request" | "rate_limited" | "quota" | "upstream" | "off_topic";
  remaining?: number;
}

export type AskResponse = AskSuccess | AskFailure;
