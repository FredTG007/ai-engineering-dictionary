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

export type TermSearch = (query: string, limit?: number) => SearchHit[];

/** Builds a fuzzy, prefix-aware search function over the given terms. */
export function createTermSearch(terms: SearchableTerm[]): TermSearch {
  const index = new MiniSearch<SearchableTerm>({
    idField: "slug",
    fields: ["title", "description", "definitionText"],
    storeFields: ["slug", "title", "description"],
    searchOptions: { boost: { title: 4, description: 2 }, prefix: true, fuzzy: 0.2 },
  });
  index.addAll(terms);
  return (query, limit = 8) =>
    index
      .search(query)
      .slice(0, limit)
      .map((result) => ({ slug: result.slug, title: result.title, description: result.description }));
}
