import matter from "gray-matter";
import { DIFFICULTIES, type Difficulty, type Term } from "./types";
import { parseOptionalBuildThis } from "./buildThis";
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
    difficulty: parseDifficulty(data.difficulty),
    interview: String(data.interview ?? "").trim(),
    interviewAnswer: String(data.interviewAnswer ?? "").trim(),
    definitionMarkdown,
    quotes: usageMarkdown ? parseQuotes(usageMarkdown) : [],
    outgoingSlugs: extractLinkedSlugs(content).filter((target) => target !== slug),
    hasUsageSection: usageMarkdown !== null,
    buildThis: parseOptionalBuildThis(data.buildThis),
  };
}

function parseDifficulty(value: unknown): Difficulty | null {
  return DIFFICULTIES.find((level) => level === value) ?? null;
}

export function countWords(markdown: string): number {
  return markdown
    .replace(/\]\([^)]*\)/g, "]")
    .split(/\s+/)
    .filter((word) => /[A-Za-z0-9]/.test(word)).length;
}
