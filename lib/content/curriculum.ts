const ORDERED_ITEM = /^\s*\d+\.\s+([a-z0-9-]+)\s*$/;

/** Pure: reads the ordered slug list from the curriculum markdown. */
export function parseCurriculum(markdown: string): string[] {
  return markdown
    .split("\n")
    .map((line) => ORDERED_ITEM.exec(line)?.[1])
    .filter((slug): slug is string => Boolean(slug));
}
