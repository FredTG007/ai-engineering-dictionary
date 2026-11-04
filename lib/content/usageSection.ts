const USAGE_HEADING = /^\s*(?:#+\s*)?_Usage:_\s*$/m;
const QUOTE_ITEM = /^\s*[-*]\s+(.+?)\s*$/;

export interface SplitBody {
  definitionMarkdown: string;
  usageMarkdown: string | null;
}

/** Separates the definition from the trailing `_Usage:_` section. */
export function splitUsageSection(body: string): SplitBody {
  const match = USAGE_HEADING.exec(body);
  if (!match) return { definitionMarkdown: body.trim(), usageMarkdown: null };
  return {
    definitionMarkdown: body.slice(0, match.index).trim(),
    usageMarkdown: body.slice(match.index + match[0].length).trim(),
  };
}

/** Reads list items from the usage section, stripping surrounding quote marks. */
export function parseQuotes(usageMarkdown: string): string[] {
  return usageMarkdown
    .split("\n")
    .map((line) => QUOTE_ITEM.exec(line)?.[1])
    .filter((item): item is string => Boolean(item))
    .map(stripQuoteMarks);
}

function stripQuoteMarks(text: string): string {
  return text.replace(/^["“]|["”]$/g, "");
}
