"use client";

import { useEffect, useState, type RefObject } from "react";
import type { Size } from "@/lib/map/viewport";

/** Live width and height of an element; null until it has been measured. */
export function useElementSize(ref: RefObject<Element | null>): Size | null {
  const [size, setSize] = useState<Size | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((current) => (current?.width === width && current?.height === height ? current : { width, height }));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
