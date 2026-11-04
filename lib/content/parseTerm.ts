import matter from "gray-matter";
import type { Term } from "./types";
import { extractLinkedSlugs } from "./termLinks";
import { parseQuotes, splitUsageSection } from "./usageSection";

/** Pure: turns the raw text of a dictionary file into a Term. */
export function parseTerm(slug: string, rawFile: string): Term {
  const { data, content } = matter(rawFile);
  const { definitionMarkdown, usageMarkdown } = splitUsageSection(content);
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    definitionMarkdown,
    quotes: usageMarkdown ? parseQuotes(usageMarkdown) : [],
    outgoingSlugs: extractLinkedSlugs(content).filter((target) => target !== slug),
    hasUsageSection: usageMarkdown !== null,
  };
}

export function countWords(markdown: string): number {
  return markdown
    .replace(/\]\([^)]*\)/g, "]")
    .split(/\s+/)
    .filter((word) => /[A-Za-z0-9]/.test(word)).length;
}
