import type { MeaningMatch } from "./rankByMeaning";

/** Main thread → worker. The worker starts loading the model as soon as it is created. */
export interface MeaningQuery {
  query: string;
}

/** Worker → main thread. */
export type SemanticWorkerEvent =
  | { type: "ready" }
  | { type: "failed"; reason: string }
  | { type: "matches"; query: string; matches: MeaningMatch[] };
