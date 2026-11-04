import { neighborsOf } from "@/lib/graph/buildGraph";
import type { GraphEdge } from "@/lib/graph/types";

export type NodeEmphasis = "focus" | "neighbor" | "normal" | "dimmed";

/** Pure: how strongly each node should be drawn given the focused slug. */
export function emphasisResolver(focusSlug: string | null, edges: GraphEdge[]): (slug: string) => NodeEmphasis {
  if (!focusSlug) return () => "normal";
  const neighbors = neighborsOf(focusSlug, edges);
  return (slug) => {
    if (slug === focusSlug) return "focus";
    return neighbors.has(slug) ? "neighbor" : "dimmed";
  };
}

export function isEdgeTouching(edge: GraphEdge, slug: string | null): boolean {
  return slug !== null && (edge.source === slug || edge.target === slug);
}
