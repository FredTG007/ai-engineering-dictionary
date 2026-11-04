/** A dictionary entry as parsed from `dictionary/<slug>.md`. */
export interface Term {
  slug: string;
  title: string;
  description: string;
  /** Markdown of the definition, without frontmatter or the usage section. */
  definitionMarkdown: string;
  /** Quotes listed under the `_Usage:_` section. */
  quotes: string[];
  /** Slugs this entry links to, in order of first appearance, without duplicates. */
  outgoingSlugs: string[];
  hasUsageSection: boolean;
}

/** A term prepared for the browser: definition already rendered to HTML. */
export interface PublishedTerm {
  slug: string;
  title: string;
  description: string;
  definitionHtml: string;
  definitionText: string;
  quotes: string[];
  outgoingSlugs: string[];
  incomingSlugs: string[];
}
