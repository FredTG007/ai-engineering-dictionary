import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { buildAskCorpus } from "../lib/ask/corpus";
import { loadTerms } from "../lib/content/loadDictionary";

const outDir = join(process.cwd(), "public", "ask");
const apiDir = join(process.cwd(), "api");
mkdirSync(outDir, { recursive: true });
mkdirSync(apiDir, { recursive: true });
const file = buildAskCorpus(loadTerms());
const json = `${JSON.stringify(file)}\n`;
writeFileSync(join(outDir, "corpus.json"), json);
writeFileSync(join(apiDir, "corpus.json"), json);
console.log(`✓ ask corpus: ${file.terms.length} terms`);
