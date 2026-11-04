"use client";

import { Html } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import type { GraphNode as GraphNodeData, Vec3 } from "@/lib/graph/types";
import type { Palette } from "@/lib/theme/palettes";
import type { NodeEmphasis } from "./focus";

interface GraphNodeProps {
  node: GraphNodeData;
  position: Vec3;
  emphasis: NodeEmphasis;
  colors: Palette["colors"];
  onHover: (slug: string | null) => void;
  onSelect: (slug: string) => void;
}

const LABEL_Z_RANGE: [number, number] = [9, 0];

export function GraphNode({ node, position, emphasis, colors, onHover, onSelect }: GraphNodeProps) {
  const radius = nodeRadius(node.degree);

  const handleOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = "pointer";
    onHover(node.slug);
  };
  const handleOut = () => {
    document.body.style.cursor = "";
    onHover(null);
  };
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(node.slug);
  };

  return (
    <group position={position}>
      <mesh onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial
          color={nodeColor(emphasis, colors)}
          emissive={nodeColor(emphasis, colors)}
          emissiveIntensity={emphasis === "focus" ? 0.9 : 0.35}
          transparent
          opacity={emphasis === "dimmed" ? 0.25 : 1}
        />
      </mesh>
      <Html position={[0, radius + 0.6, 0]} center distanceFactor={30} zIndexRange={LABEL_Z_RANGE}>
        <span className={`node-label node-label--${emphasis}`}>{node.label}</span>
      </Html>
    </group>
  );
}

function nodeRadius(degree: number): number {
  return Math.min(0.3 + Math.sqrt(degree) * 0.13, 0.95);
}

function nodeColor(emphasis: NodeEmphasis, colors: Palette["colors"]): string {
  if (emphasis === "focus") return colors.accent;
  if (emphasis === "neighbor") return colors.accentAlt;
  return colors.node;
}
