"use client";

import { useMemo } from "react";
import type { GraphEdge, Vec3 } from "@/lib/graph/types";
import { isEdgeTouching } from "./focus";

interface GraphEdgesProps {
  edges: GraphEdge[];
  positions: Record<string, Vec3>;
  focusSlug: string | null;
  baseColor: string;
  activeColor: string;
}

export function GraphEdges({ edges, positions, focusSlug, baseColor, activeColor }: GraphEdgesProps) {
  const activeEdges = useMemo(() => edges.filter((edge) => isEdgeTouching(edge, focusSlug)), [edges, focusSlug]);
  return (
    <>
      <EdgeLines edges={edges} positions={positions} color={baseColor} opacity={focusSlug ? 0.25 : 0.6} />
      <EdgeLines edges={activeEdges} positions={positions} color={activeColor} opacity={0.95} />
    </>
  );
}

interface EdgeLinesProps {
  edges: GraphEdge[];
  positions: Record<string, Vec3>;
  color: string;
  opacity: number;
}

function EdgeLines({ edges, positions, color, opacity }: EdgeLinesProps) {
  const vertices = useMemo(() => edgeVertices(edges, positions), [edges, positions]);
  return (
    <lineSegments key={vertices.length}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[vertices, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </lineSegments>
  );
}

function edgeVertices(edges: GraphEdge[], positions: Record<string, Vec3>): Float32Array {
  return new Float32Array(edges.flatMap(({ source, target }) => [...positions[source], ...positions[target]]));
}
