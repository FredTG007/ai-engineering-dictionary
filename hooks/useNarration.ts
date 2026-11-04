"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type NarrationStatus = "idle" | "loading" | "playing" | "unavailable";

/** Play/pause for one narration file; the audio element is created on first play. */
export function useNarration(src: string) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<NarrationStatus>("idle");

  useEffect(() => () => audio.current?.pause(), []);

  const toggle = useCallback(() => {
    const element = audio.current ?? createAudio(src, setStatus);
    audio.current = element;
    if (element.paused) {
      setStatus("loading");
      element.play().catch(() => setStatus("unavailable"));
    } else {
      element.pause();
    }
  }, [src]);

  return { status, toggle };
}

function createAudio(src: string, setStatus: (status: NarrationStatus) => void): HTMLAudioElement {
  const element = new Audio(src);
  element.addEventListener("playing", () => setStatus("playing"));
  element.addEventListener("pause", () => setStatus("idle"));
  element.addEventListener("ended", () => setStatus("idle"));
  element.addEventListener("error", () => setStatus("unavailable"));
  return element;
}
