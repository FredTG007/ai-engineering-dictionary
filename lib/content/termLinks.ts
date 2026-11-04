const RELATIVE_TERM_LINK = /\]\(\.\/([a-z0-9-]+)\.md\)/g;

/** Returns linked slugs in order of first appearance, without duplicates. */
export function extractLinkedSlugs(markdown: string): string[] {
  const slugs = [...markdown.matchAll(RELATIVE_TERM_LINK)].map((match) => match[1]);
  return [...new Set(slugs)];
}

/** Turns a markdown link target like `./rag.md` into a slug, or null if it is not a term link. */
export function slugFromHref(href: string): string | null {
  const match = /^\.\/([a-z0-9-]+)\.md$/.exec(href);
  return match ? match[1] : null;
}

export function termUrl(slug: string): string {
  return `?term=${slug}`;
}
