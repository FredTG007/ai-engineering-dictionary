/**
 * Merge `internal/build-this.json` into each term's frontmatter as `buildThis`.
 * Idempotent: replaces an existing buildThis block.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { upsertFrontmatter } from "../lib/content/applyBuildThis";
import { parseBuildThis } from "../lib/content/buildThis";

const ROOT = join(process.cwd());
const DICT = join(ROOT, "dictionary");
const SOURCE = join(ROOT, "internal", "build-this.json");

function main(): void {
  const catalog = JSON.parse(readFileSync(SOURCE, "utf8")) as Record<string, unknown>;
  const slugs = readdirSync(DICT)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));
  const missing = slugs.filter((slug) => !(slug in catalog));
  const extra = Object.keys(catalog).filter((slug) => !slugs.includes(slug));
  if (missing.length || extra.length) {
    for (const slug of missing) console.error(`✗ missing card for ${slug}`);
    for (const slug of extra) console.error(`✗ unknown slug in catalog: ${slug}`);
    process.exit(1);
  }

  let updated = 0;
  for (const slug of slugs) {
    const card = parseBuildThis(catalog[slug]);
    const path = join(DICT, `${slug}.md`);
    const before = readFileSync(path, "utf8");
    const after = upsertFrontmatter(before, card);
    if (after !== before) {
      writeFileSync(path, after);
      updated += 1;
    }
  }
  console.log(`✓ applied Build This cards to ${updated} of ${slugs.length} terms`);
}

main();
