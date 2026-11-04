"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import type { PositionedGraph, Vec3 } from "@/lib/graph/types";
import type { Palette } from "@/lib/theme/palettes";
import { CameraRig } from "./CameraRig";
import { emphasisResolver } from "./focus";
import { GraphEdges } from "./GraphEdges";
import { GraphNode } from "./GraphNode";

interface TermGraphSceneProps {
  graph: PositionedGraph;
  colors: Palette["colors"];
  selectedSlug: string | null;
  hoveredSlug: string | null;
  onHover: (slug: string | null) => void;
  onSelect: (slug: string) => void;
}

export function TermGraphScene({ graph, colors, selectedSlug, hoveredSlug, onHover, onSelect }: TermGraphSceneProps) {
  const focusSlug = hoveredSlug ?? selectedSlug;
  const emphasisOf = useMemo(() => emphasisResolver(focusSlug, graph.edges), [focusSlug, graph.edges]);
  const cameraDistance = useMemo(() => boundingRadius(Object.values(graph.positions)) * 2.4, [graph.positions]);
  const selectedPosition = selectedSlug ? graph.positions[selectedSlug] : null;

  return (
    <Canvas camera={{ position: [0, 0, cameraDistance], fov: 50 }} dpr={[1, 2]}>
      <color attach="background" args={[colors.background]} />
      <fog attach="fog" args={[colors.background, cameraDistance * 0.8, cameraDistance * 2.2]} />
      <ambientLight intensity={0.7} />
      <pointLight position={[30, 30, 30]} intensity={1.2} decay={0} />
      <GraphEdges
        edges={graph.edges}
        positions={graph.positions}
        focusSlug={focusSlug}
        baseColor={colors.edge}
        activeColor={colors.accent}
      />
      {graph.nodes.map((node) => (
        <GraphNode
          key={node.slug}
          node={node}
          position={graph.positions[node.slug]}
          emphasis={emphasisOf(node.slug)}
          colors={colors}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
      <OrbitControls makeDefault enableDamping autoRotate={!selectedSlug} autoRotateSpeed={0.35} />
      <CameraRig target={selectedPosition} />
    </Canvas>
  );
}

function boundingRadius(points: Vec3[]): number {
  return Math.max(10, ...points.map(([x, y, z]) => Math.hypot(x, y, z)));
}
