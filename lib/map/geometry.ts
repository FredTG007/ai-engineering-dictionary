import type { Box, Point } from "./types";

export function boxesOverlap(a: Box, b: Box): boolean {
  return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
}

export function boxAround(point: Point, radius: number): Box {
  return { left: point.x - radius, right: point.x + radius, top: point.y - radius, bottom: point.y + radius };
}

export function unionBox(boxes: Box[]): Box {
  return boxes.reduce((union, box) => ({
    left: Math.min(union.left, box.left),
    top: Math.min(union.top, box.top),
    right: Math.max(union.right, box.right),
    bottom: Math.max(union.bottom, box.bottom),
  }));
}

/** Liang–Barsky clip: does the segment pass through the box's interior? */
export function segmentCrossesBox(a: Point, b: Point, box: Box): boolean {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  let enter = 0;
  let exit = 1;
  const edges: [number, number][] = [
    [-dx, a.x - box.left],
    [dx, box.right - a.x],
    [-dy, a.y - box.top],
    [dy, box.bottom - a.y],
  ];
  for (const [direction, distance] of edges) {
    if (direction === 0) {
      if (distance <= 0) return false;
      continue;
    }
    const t = distance / direction;
    if (direction < 0) enter = Math.max(enter, t);
    else exit = Math.min(exit, t);
    if (enter >= exit) return false;
  }
  return true;
}

export function shrinkBox(box: Box, by: number): Box {
  return { left: box.left + by, top: box.top + by, right: box.right - by, bottom: box.bottom - by };
}
