import type { Point } from "./types";

/**
 * Pure: joins two points with horizontal, vertical and 45° segments only.
 * The diagonal sits in the middle of the run, which gives the familiar
 * "straight, slant, straight" shape of a subway line.
 */
export function octilinearRoute(from: Point, to: Point): Point[] {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const run = Math.abs(dx);
  const rise = Math.abs(dy);
  if (run === 0 || rise === 0 || run === rise) return [from, to];

  const straight = (Math.max(run, rise) - Math.min(run, rise)) / 2;
  const alongX = run > rise;
  const step = (distance: number): Point =>
    alongX ? { x: Math.sign(dx) * distance, y: 0 } : { x: 0, y: Math.sign(dy) * distance };
  const first = add(from, step(straight));
  const second = subtract(to, step(straight));
  return [from, first, second, to];
}

/** Routes a whole track and drops repeated points. */
export function routeThrough(points: Point[]): Point[] {
  const routed = points.flatMap((point, index) =>
    index === 0 ? [point] : octilinearRoute(points[index - 1], point).slice(1),
  );
  return routed.filter((point, index) => index === 0 || !samePoint(point, routed[index - 1]));
}

function add(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y };
}

function subtract(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y };
}

function samePoint(a: Point, b: Point): boolean {
  return Math.abs(a.x - b.x) < 1e-6 && Math.abs(a.y - b.y) < 1e-6;
}
