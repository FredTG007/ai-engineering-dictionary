"use client";

import { useCallback, useEffect, useState } from "react";

export type View = "map" | "study";
const VIEW_PARAM = "view";

function readViewFromUrl(): View {
  return new URLSearchParams(window.location.search).get(VIEW_PARAM) === "study" ? "study" : "map";
}

function writeViewToUrl(view: View): void {
  const url = new URL(window.location.href);
  if (view === "study") url.searchParams.set(VIEW_PARAM, view);
  else url.searchParams.delete(VIEW_PARAM);
  if (url.href !== window.location.href) window.history.pushState(null, "", url);
}

/** Map or study view, kept in sync with `?view=study` and browser history. */
export function useView() {
  const [view, setViewState] = useState<View>("map");

  useEffect(() => {
    const syncFromUrl = () => setViewState(readViewFromUrl());
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const setView = useCallback((next: View) => {
    setViewState(next);
    writeViewToUrl(next);
  }, []);

  return { view, setView };
}
