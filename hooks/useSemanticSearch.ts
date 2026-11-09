"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MeaningQuery, SemanticWorkerEvent } from "@/lib/search/semanticWorkerProtocol";

export type SemanticStatus =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "unavailable" };

const NO_SLUGS: string[] = [];

interface MeaningResults {
  query: string;
  slugs: string[];
}

/**
 * Search by meaning in a Web Worker. Nothing is downloaded until `start` is called; after
 * that, every query is sent to the worker once the model is ready. `meaningSlugs` holds the
 * matches for the current query, or nothing while they are still on their way.
 */
export function useSemanticSearch(query: string) {
  const workerRef = useRef<Worker | null>(null);
  const [status, setStatus] = useState<SemanticStatus>({ kind: "idle" });
  const [results, setResults] = useState<MeaningResults>({ query: "", slugs: NO_SLUGS });
  const trimmedQuery = query.trim();

  const start = useCallback(() => {
    if (workerRef.current) return;
    try {
      const worker = new Worker(new URL("../workers/semanticSearch.worker.ts", import.meta.url), { type: "module" });
      worker.onmessage = ({ data }: MessageEvent<SemanticWorkerEvent>) => handleEvent(data, setStatus, setResults);
      worker.onerror = () => setStatus({ kind: "unavailable" });
      workerRef.current = worker;
      setStatus({ kind: "loading" });
    } catch {
      setStatus({ kind: "unavailable" });
    }
  }, []);

  useEffect(() => () => workerRef.current?.terminate(), []);

  useEffect(() => {
    if (status.kind !== "ready" || !trimmedQuery) return;
    const message: MeaningQuery = { query: trimmedQuery };
    workerRef.current?.postMessage(message);
  }, [status.kind, trimmedQuery]);

  const meaningSlugs = results.query === trimmedQuery ? results.slugs : NO_SLUGS;
  return { status, start, meaningSlugs };
}

function handleEvent(
  event: SemanticWorkerEvent,
  setStatus: (status: SemanticStatus) => void,
  setResults: (results: MeaningResults) => void,
): void {
  if (event.type === "ready") setStatus({ kind: "ready" });
  else if (event.type === "failed") {
    console.warn(`Search by meaning is off: ${event.reason}`);
    setStatus({ kind: "unavailable" });
  }
  else setResults({ query: event.query, slugs: event.matches.map((match) => match.slug) });
}
