export type Vec3 = [number, number, number];

export interface GraphNode {
  slug: string;
  label: string;
  degree: number;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface TermGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface PositionedGraph extends TermGraph {
  positions: Record<string, Vec3>;
}
