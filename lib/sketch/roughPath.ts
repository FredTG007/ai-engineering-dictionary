import type { Point } from "../map/types";
import { createSeededRandom } from "./seededRandom";

export interface Roughness {
  /** Maximum sideways wobble, in the same units as the points. */
  wobble: number;
  /** Distance between wobble points along each segment. */
  step: number;
}

const DEFAULT_ROUGHNESS: Roughness = { wobble: 1.4, step: 14 };

/** Stable numeric seed from any string, e.g. a slug. */
export function seedFrom(text: string): number {
  return [...text].reduce((hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16777619), 2166136261);
}

/**
 * Pure: an SVG path that follows the polyline with a pen-like wobble.
 * The same seed always produces the same stroke.
 */
export function roughPolyline(points: Point[], seed: number, roughness: Roughness = DEFAULT_ROUGHNESS): string {
  const random = createSeededRandom(seed);
  const jitter = () => (random() - 0.5) * 2 * roughness.wobble;
  const wobbly = points.flatMap((point, index) =>
    index === 0 ? [point] : subdivide(points[index - 1], point, roughness.step).slice(1),
  );
  const [first, ...rest] = wobbly.map((point) => ({ x: point.x + jitter(), y: point.y + jitter() }));
  return `M${format(first)}` + rest.map((point) => ` L${format(point)}`).join("");
}

/** Pure: a slightly lopsided, not-quite-closed loop, like circling something with a pen. */
export function roughEllipse(centre: Point, radiusX: number, radiusY: number, seed: number): string {
  const random = createSeededRandom(seed);
  const start = random() * Math.PI * 2;
  const sweep = Math.PI * 2.15;
  const steps = 28;
  const points = Array.from({ length: steps + 1 }, (_, index) => {
    const angle = start + (sweep * index) / steps;
    const wobble = 1 + (random() - 0.5) * 0.08;
    return { x: centre.x + Math.cos(angle) * radiusX * wobble, y: centre.y + Math.sin(angle) * radiusY * wobble };
  });
  return `M${format(points[0])}` + points.slice(1).map((point) => ` L${format(point)}`).join("");
}

/** Pure: a hand-drawn arrow from `from` to `to`: a gently bowed shaft plus two head strokes. */
export function roughArrow(from: Point, to: Point, seed: number): { shaft: string; head: string } {
  const random = createSeededRandom(seed);
  const bend = (random() - 0.5) * 0.35 + 0.2;
  const control = {
    x: (from.x + to.x) / 2 - (to.y - from.y) * bend,
    y: (from.y + to.y) / 2 + (to.x - from.x) * bend,
  };
  const angle = Math.atan2(to.y - control.y, to.x - control.x);
  const barb = (offset: number) => ({ x: to.x - Math.cos(angle + offset) * 11, y: to.y - Math.sin(angle + offset) * 11 });
  return {
    shaft: `M${format(from)} Q${format(control)} ${format(to)}`,
    head: `M${format(barb(0.5))} L${format(to)} L${format(barb(-0.45))}`,
  };
}

function subdivide(from: Point, to: Point, step: number): Point[] {
  const count = Math.max(1, Math.round(Math.hypot(to.x - from.x, to.y - from.y) / step));
  return Array.from({ length: count + 1 }, (_, index) => ({
    x: from.x + ((to.x - from.x) * index) / count,
    y: from.y + ((to.y - from.y) * index) / count,
  }));
}

function format({ x, y }: Point): string {
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}
