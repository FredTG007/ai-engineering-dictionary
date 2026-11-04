import type { Point } from "./types";

/** Screen = world × scale + offset. */
export interface Viewport {
  x: number;
  y: number;
  scale: number;
}

export interface Size {
  width: number;
  height: number;
}

/** Parts of the screen covered by overlays, so "centre" means the visible middle. */
export interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const MIN_SCALE = 0.3;
export const MAX_SCALE = 3;
export const NO_INSETS: Insets = { top: 0, right: 0, bottom: 0, left: 0 };

export function clampScale(scale: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

/**
 * Pure: viewport that shows the whole content inside the visible area, centred.
 * `minScale` keeps text legible on small screens at the cost of cropping the edges.
 */
export function fitContent(content: Size, view: Size, insets: Insets = NO_INSETS, minScale = MIN_SCALE, padding = 24): Viewport {
  const visible = visibleSize(view, insets);
  const scale = clampScale(
    Math.max(minScale, Math.min((visible.width - 2 * padding) / content.width, (visible.height - 2 * padding) / content.height)),
  );
  return {
    scale,
    x: insets.left + (visible.width - content.width * scale) / 2,
    y: insets.top + (visible.height - content.height * scale) / 2,
  };
}

/** Pure: zooms by `factor` while keeping the world point under `anchor` fixed on screen. */
export function zoomAround(viewport: Viewport, anchor: Point, factor: number): Viewport {
  const scale = clampScale(viewport.scale * factor);
  const ratio = scale / viewport.scale;
  return { scale, x: anchor.x - (anchor.x - viewport.x) * ratio, y: anchor.y - (anchor.y - viewport.y) * ratio };
}

/** Pure: viewport at `scale` with the world point in the middle of the visible area. */
export function centreOn(world: Point, scale: number, view: Size, insets: Insets = NO_INSETS): Viewport {
  const visible = visibleSize(view, insets);
  const clamped = clampScale(scale);
  return {
    scale: clamped,
    x: insets.left + visible.width / 2 - world.x * clamped,
    y: insets.top + visible.height / 2 - world.y * clamped,
  };
}

/** Pure: blend between two viewports, `t` from 0 to 1. */
export function interpolate(from: Viewport, to: Viewport, t: number): Viewport {
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
    scale: from.scale + (to.scale - from.scale) * t,
  };
}

function visibleSize(view: Size, insets: Insets): Size {
  return {
    width: Math.max(1, view.width - insets.left - insets.right),
    height: Math.max(1, view.height - insets.top - insets.bottom),
  };
}
