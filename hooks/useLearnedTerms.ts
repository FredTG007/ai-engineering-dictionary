"use client";

import { useCallback, useEffect, useState } from "react";
import { LEARNED_STORAGE_KEY } from "@/lib/progress/storageKeys";
import { parseLearnedSlugs } from "@/lib/progress/trackProgress";

/** The set of terms the reader has marked as learned, persisted in localStorage. */
export function useLearnedTerms(isKnownSlug: (slug: string) => boolean) {
  const [learned, setLearned] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    setLearned(new Set(parseLearnedSlugs(window.localStorage.getItem(LEARNED_STORAGE_KEY), isKnownSlug)));
  }, [isKnownSlug]);

  const persist = useCallback((next: ReadonlySet<string>) => {
    setLearned(next);
    window.localStorage.setItem(LEARNED_STORAGE_KEY, JSON.stringify([...next]));
  }, []);

  const toggleLearned = useCallback((slug: string) => {
    setLearned((current) => {
      const next = new Set(current);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      window.localStorage.setItem(LEARNED_STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const clearLearned = useCallback(() => {
    setLearned(new Set());
    window.localStorage.removeItem(LEARNED_STORAGE_KEY);
  }, []);

  const restoreLearned = useCallback(
    (slugs: ReadonlySet<string>) => {
      persist(slugs);
    },
    [persist],
  );

  return { learned, toggleLearned, clearLearned, restoreLearned };
}
