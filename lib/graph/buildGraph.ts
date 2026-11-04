import type { GraphEdge, TermGraph } from "./types";

interface LinkedTerm {
  slug: string;
  title: string;
  outgoingSlugs: string[];
}

/** Pure: one undirected edge per linked pair of terms, no duplicates. */
export function buildTermGraph(terms: LinkedTerm[]): TermGraph {
  const known = new Set(terms.map((term) => term.slug));
  const edges = dedupeUndirected(
    terms.flatMap((term) =>
      term.outgoingSlugs.filter((target) => known.has(target)).map((target) => ({ source: term.slug, target })),
    ),
  );
  const degree = countDegrees(edges);
  const nodes = terms.map((term) => ({ slug: term.slug, label: term.title, degree: degree.get(term.slug) ?? 0 }));
  return { nodes, edges };
}

function dedupeUndirected(edges: GraphEdge[]): GraphEdge[] {
  const seen = new Set<string>();
  return edges.filter(({ source, target }) => {
    const key = [source, target].sort().join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function countDegrees(edges: GraphEdge[]): Map<string, number> {
  const degree = new Map<string, number>();
  for (const { source, target } of edges) {
    degree.set(source, (degree.get(source) ?? 0) + 1);
    degree.set(target, (degree.get(target) ?? 0) + 1);
  }
  return degree;
}

/** Slugs directly connected to `slug` by any edge. */
export function neighborsOf(slug: string, edges: GraphEdge[]): Set<string> {
  const neighbors = new Set<string>();
  for (const { source, target } of edges) {
    if (source === slug) neighbors.add(target);
    if (target === slug) neighbors.add(source);
  }
  return neighbors;
}
