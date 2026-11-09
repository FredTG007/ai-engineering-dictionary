import { markdownToPlainText } from "../content/renderMarkdown";
import type { Term } from "../content/types";
import { PASSAGE_WORDS } from "./limits";
import type { AskCorpusFile } from "./corpusTypes";

export type { AskCorpusEntry, AskCorpusFile } from "./corpusTypes";

/** Pure: build the slim corpus the ask endpoint reads. */
export function buildAskCorpus(terms: Term[], now = new Date()): AskCorpusFile {
  return {
    generatedAt: now.toISOString(),
    terms: terms.map((term) => ({
      slug: term.slug,
      title: term.title,
      passage: passageOf(term),
    })),
  };
}

function passageOf(term: Term): string {
  const body = markdownToPlainText(term.definitionMarkdown).split(/\s+/).slice(0, PASSAGE_WORDS).join(" ");
  return `${term.description}\n\n${body}`.trim();
}
