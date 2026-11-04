"use client";

import { useCallback, useEffect, useState } from "react";

const TERM_PARAM = "term";

function readTermFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get(TERM_PARAM);
}

function writeTermToUrl(slug: string | null): void {
  const url = new URL(window.location.href);
  if (slug) url.searchParams.set(TERM_PARAM, slug);
  else url.searchParams.delete(TERM_PARAM);
  if (url.href !== window.location.href) window.history.pushState(null, "", url);
}

/** The selected term, kept in sync with `?term=slug` and browser history. */
export function useTermSelection(isKnownSlug: (slug: string) => boolean) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    const syncFromUrl = () => {
      const slug = readTermFromUrl();
      setSelectedSlug(slug && isKnownSlug(slug) ? slug : null);
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [isKnownSlug]);

  const selectTerm = useCallback((slug: string | null) => {
    setSelectedSlug(slug);
    writeTermToUrl(slug);
  }, []);

  return { selectedSlug, selectTerm };
}
