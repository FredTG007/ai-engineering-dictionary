"use client";

import { useMemo, useState } from "react";
import { askDictionary } from "@/lib/ask/client";
import { MAX_HITS, MAX_QUESTION_CHARS } from "@/lib/ask/limits";
import type { AskResponse, AskSuccess } from "@/lib/ask/types";
import { useSemanticSearch } from "@/hooks/useSemanticSearch";
import type { TermSearch } from "@/lib/search/termSearch";
import { RoughUnderline } from "../sketch/RoughUnderline";

interface AskViewProps {
  search: TermSearch;
  titleOf: (slug: string) => string;
  onOpenTerm: (slug: string) => void;
}

export function AskView({ search, titleOf, onOpenTerm }: AskViewProps) {
  const [question, setQuestion] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<AskResponse | null>(null);
  const [showHow, setShowHow] = useState(false);
  const { status, start, meaningMatches } = useSemanticSearch(question);

  const keywordHits = useMemo(() => {
    const trimmed = question.trim();
    if (!trimmed) return [] as Array<{ slug: string; score: number }>;
    return search.keywordSlugs(trimmed, MAX_HITS).map((slug, index) => ({
      slug,
      score: Math.max(0.15, 0.55 - index * 0.05),
    }));
  }, [question, search]);

  const hits = meaningMatches.length > 0
    ? meaningMatches.slice(0, MAX_HITS).map((match) => ({ slug: match.slug, score: match.similarity }))
    : keywordHits;

  const submit = async () => {
    const trimmed = question.trim();
    if (!trimmed || pending) return;
    start();
    setPending(true);
    setShowHow(false);
    try {
      const useHits = hits.length > 0 ? hits : keywordHits;
      if (useHits.length === 0) {
        setResult({
          ok: false,
          error: "No dictionary terms matched that question. Try naming a concept (RAG, evals, latency).",
          code: "bad_request",
        });
        return;
      }
      const response = await askDictionary({ question: trimmed, hits: useHits });
      setResult(response);
    } catch {
      setResult({ ok: false, error: "Could not reach the ask service.", code: "upstream" });
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="ask-view">
      <div className="ask-view__card">
        <p className="ask-view__eyebrow">Ask the dictionary</p>
        <h2 className="ask-view__title">Questions answered only from these entries.</h2>
        <RoughUnderline seed="ask" className="ask-view__underline" />
        <p className="ask-view__lede">
          Retrieval uses the same on-device meaning search as the search box. The answer is written by a small Gemini
          model that may only read the passages we send it — about 10 questions per browser per day.
        </p>
        <label className="ask-view__label" htmlFor="ask-question">
          Your question
        </label>
        <textarea
          id="ask-question"
          className="ask-view__input"
          rows={3}
          maxLength={MAX_QUESTION_CHARS}
          placeholder="e.g. Why does my support bot invent refund policies?"
          value={question}
          onFocus={start}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <div className="ask-view__actions">
          <button type="button" className="ink-button ask-view__submit" disabled={pending || !question.trim()} onClick={submit}>
            {pending ? "Looking up…" : "Ask"}
          </button>
          <span className="ask-view__status">
            {status.kind === "loading" && "Loading meaning search…"}
            {status.kind === "ready" && hits.length > 0 && `Top hit: ${titleOf(hits[0].slug)}`}
            {status.kind === "unavailable" && "Meaning search offline — using keyword retrieval."}
          </span>
        </div>
        {result && <AskResult result={result} showHow={showHow} onToggleHow={() => setShowHow((value) => !value)} onOpenTerm={onOpenTerm} />}
      </div>
    </main>
  );
}

function AskResult({
  result,
  showHow,
  onToggleHow,
  onOpenTerm,
}: {
  result: AskResponse;
  showHow: boolean;
  onToggleHow: () => void;
  onOpenTerm: (slug: string) => void;
}) {
  if (!result.ok) {
    return (
      <div className="ask-result ask-result--error" role="status">
        <p>{result.error}</p>
        {typeof result.remaining === "number" && <p className="ask-result__meta">{result.remaining} questions left today</p>}
      </div>
    );
  }
  return (
    <div className="ask-result" role="status">
      <p className="ask-result__answer">{result.answer}</p>
      <div className="ask-result__citations">
        {result.citations.map((title) => (
          <button key={title} type="button" className="chip" onClick={() => openCitation(result, title, onOpenTerm)}>
            {title}
          </button>
        ))}
      </div>
      <p className="ask-result__meta">
        {result.model} · {result.remaining} left today
      </p>
      <button type="button" className="ask-result__how" aria-expanded={showHow} onClick={onToggleHow}>
        {showHow ? "Hide how this answer was made" : "Show how this answer was made"}
      </button>
      {showHow && <HowMade success={result} />}
    </div>
  );
}

function HowMade({ success }: { success: AskSuccess }) {
  return (
    <div className="ask-how">
      <h3 className="ask-how__title">Retrieved chunks</h3>
      <ol className="ask-how__hits">
        {success.retrieval.map((hit) => (
          <li key={hit.slug}>
            <strong>{hit.title}</strong> · score {hit.score.toFixed(3)}
            <pre className="ask-how__passage">{hit.passage}</pre>
          </li>
        ))}
      </ol>
      <h3 className="ask-how__title">Final prompt</h3>
      <pre className="ask-how__prompt">{success.prompt}</pre>
    </div>
  );
}

function openCitation(result: AskSuccess, title: string, onOpenTerm: (slug: string) => void): void {
  const hit = result.retrieval.find((entry) => entry.title === title);
  if (hit) onOpenTerm(hit.slug);
}

