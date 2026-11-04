import type { Point } from "./types";

/** Pure: SVG path through the points with each corner softened by a quadratic curve. */
export function roundedPath(points: Point[], radius: number): string {
  if (points.length === 0) return "";
  const commands = [`M${points[0].x},${points[0].y}`];
  for (let index = 1; index < points.length - 1; index++) {
    const corner = points[index];
    const before = towards(corner, points[index - 1], radius);
    const after = towards(corner, points[index + 1], radius);
    commands.push(`L${before.x},${before.y}`, `Q${corner.x},${corner.y} ${after.x},${after.y}`);
  }
  const last = points[points.length - 1];
  commands.push(`L${last.x},${last.y}`);
  return commands.join(" ");
}

/** A point `radius` away from `from` in the direction of `to`, never past halfway. */
function towards(from: Point, to: Point, radius: number): Point {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const distance = Math.min(radius, length / 2);
  return { x: from.x + ((to.x - from.x) * distance) / length, y: from.y + ((to.y - from.y) * distance) / length };
}
