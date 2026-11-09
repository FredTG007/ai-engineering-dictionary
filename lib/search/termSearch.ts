import MiniSearch from "minisearch";

export interface SearchableTerm {
  slug: string;
  title: string;
  description: string;
  definitionText: string;
}

export interface SearchHit {
  slug: string;
  title: string;
  description: string;
}

export interface TermSearch {
  /** Slugs from fuzzy, prefix-aware keyword search, best first. */
  keywordSlugs: (query: string, limit: number) => string[];
  /** What a result shows for a slug, whichever ranking found it. */
  hitFor: (slug: string) => SearchHit | undefined;
}

export function createTermSearch(terms: SearchableTerm[]): TermSearch {
  const index = new MiniSearch<SearchableTerm>({
    idField: "slug",
    fields: ["title", "description", "definitionText"],
    searchOptions: { boost: { title: 4, description: 2 }, prefix: true, fuzzy: 0.2 },
  });
  index.addAll(terms);
  const hits = new Map(terms.map(({ slug, title, description }) => [slug, { slug, title, description }]));
  return {
    keywordSlugs: (query, limit) => index.search(query).slice(0, limit).map((result) => String(result.id)),
    hitFor: (slug) => hits.get(slug),
  };
}
