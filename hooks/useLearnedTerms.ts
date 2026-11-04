"use client";

import { useCallback, useEffect, useState } from "react";
import { parseLearnedSlugs } from "@/lib/progress/trackProgress";

const STORAGE_KEY = "aied:learned";

/** The set of terms the reader has marked as learned, persisted in localStorage. */
export function useLearnedTerms(isKnownSlug: (slug: string) => boolean) {
  const [learned, setLearned] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    setLearned(new Set(parseLearnedSlugs(window.localStorage.getItem(STORAGE_KEY), isKnownSlug)));
  }, [isKnownSlug]);

  const toggleLearned = useCallback((slug: string) => {
    setLearned((current) => {
      const next = new Set(current);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { learned, toggleLearned };
}
