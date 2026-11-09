/**
 * Bundle the Ask API into a single CommonJS file Vercel can run without a Next build.
 */
import { build } from "esbuild";
import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

async function main(): Promise<void> {
  const outDir = join(process.cwd(), "api");
  mkdirSync(outDir, { recursive: true });
  await build({
    entryPoints: [join(process.cwd(), "api", "ask.ts")],
    bundle: true,
    platform: "node",
    target: "node20",
    format: "cjs",
    outfile: join(outDir, "ask.js"),
    external: [],
    logLevel: "info",
  });
  copyFileSync(join(outDir, "corpus.json"), join(outDir, "corpus.json"));
  console.log("✓ bundled api/ask.js");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
