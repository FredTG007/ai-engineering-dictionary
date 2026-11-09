import type { BuildThis } from "./buildThis";

export type { BuildThis } from "./buildThis";

export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/** A dictionary entry as parsed from `dictionary/<slug>.md`. */
export interface Term {
  slug: string;
  title: string;
  description: string;
  /** Null when the frontmatter value is missing or not a known level. */
  difficulty: Difficulty | null;
  /** One interview question about the term. */
  interview: string;
  /** What a good answer to the interview question covers. */
  interviewAnswer: string;
  /** Markdown of the definition, without frontmatter or the usage section. */
  definitionMarkdown: string;
  /** Quotes listed under the `_Usage:_` section. */
  quotes: string[];
  /** Slugs this entry links to, in order of first appearance, without duplicates. */
  outgoingSlugs: string[];
  hasUsageSection: boolean;
  /** Portfolio project card; null until authored. */
  buildThis: BuildThis | null;
}

/** A term prepared for the browser: definition already rendered to HTML. */
export interface PublishedTerm {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  interview: string;
  interviewAnswer: string;
  trackIds: string[];
  definitionHtml: string;
  definitionText: string;
  quotes: string[];
  outgoingSlugs: string[];
  incomingSlugs: string[];
  /** Present once authored; the validator requires it for release. */
  buildThis: BuildThis | null;
}
