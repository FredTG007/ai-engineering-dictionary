export interface AskCorpusEntry {
  slug: string;
  title: string;
  passage: string;
}

export interface AskCorpusFile {
  generatedAt: string;
  terms: AskCorpusEntry[];
}
