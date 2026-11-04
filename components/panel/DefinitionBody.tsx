"use client";

import type { MouseEvent } from "react";

interface DefinitionBodyProps {
  html: string;
  onTermLink: (slug: string) => void;
}

/** Rendered definition; in-dictionary links navigate inside the app instead of reloading. */
export function DefinitionBody({ html, onTermLink }: DefinitionBodyProps) {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const slug = termSlugFromClick(event);
    if (!slug) return;
    event.preventDefault();
    onTermLink(slug);
  };

  return <div className="definition" onClick={handleClick} dangerouslySetInnerHTML={{ __html: html }} />;
}

function termSlugFromClick(event: MouseEvent<HTMLDivElement>): string | null {
  const anchor = (event.target as HTMLElement).closest("a");
  const href = anchor?.getAttribute("href") ?? "";
  return new URLSearchParams(href.startsWith("?") ? href : "").get("term");
}
