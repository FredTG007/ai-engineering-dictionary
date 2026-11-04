import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { slugFromHref, termUrl } from "./termLinks";

interface MarkdownNode {
  type: string;
  url?: string;
  children?: MarkdownNode[];
}

/** Rewrites `./slug.md` links into in-app `?term=slug` links. */
function remarkTermLinks() {
  return (tree: MarkdownNode) => rewriteTermLinks(tree);
}

function rewriteTermLinks(node: MarkdownNode): void {
  if (node.type === "link" && node.url) {
    const slug = slugFromHref(node.url);
    if (slug) node.url = termUrl(slug);
  }
  node.children?.forEach(rewriteTermLinks);
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkTermLinks)
  .use(remarkRehype)
  .use(rehypeStringify);

export function renderMarkdownToHtml(markdown: string): string {
  return String(processor.processSync(markdown));
}

/** Rough plain-text version of markdown, good enough for search indexing. */
export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#*_`|>-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
