import type { Box, LabelSide, Point } from "./types";

export const LABEL_FONT_SIZE = 14;
export const LABEL_LINE_HEIGHT = 18;
/** Distance from the station centre to the nearest edge of its label. */
export const LABEL_GAP = 16;

/**
 * Rough advance widths of the map's serif face, in ems. Deliberately a
 * touch generous so the overlap check errs on the side of more space.
 */
const NARROW = /[ilj.,'’:;|!()\-\s]/;
const WIDE = /[MWmw]/;
const CAPITAL = /[A-Z0-9&]/;

export function estimateTextWidth(text: string, fontSize = LABEL_FONT_SIZE): number {
  const ems = [...text].reduce((sum, char) => sum + charWidthInEms(char), 0);
  return ems * fontSize;
}

function charWidthInEms(char: string): number {
  if (WIDE.test(char)) return 0.86;
  if (NARROW.test(char)) return 0.3;
  if (CAPITAL.test(char)) return 0.68;
  return 0.52;
}

/** How a label is anchored, for both drawing and collision checks. */
export interface LabelAnchor {
  x: number;
  y: number;
  textAnchor: "start" | "middle" | "end";
}

const DIAGONAL_GAP = LABEL_GAP * 0.75;

export function labelAnchor(station: Point, side: LabelSide): LabelAnchor {
  const { x, y } = station;
  switch (side) {
    case "e": return { x: x + LABEL_GAP, y, textAnchor: "start" };
    case "w": return { x: x - LABEL_GAP, y, textAnchor: "end" };
    case "n": return { x, y: y - LABEL_GAP - LABEL_LINE_HEIGHT / 2, textAnchor: "middle" };
    case "s": return { x, y: y + LABEL_GAP + LABEL_LINE_HEIGHT / 2, textAnchor: "middle" };
    case "ne": return { x: x + DIAGONAL_GAP, y: y - DIAGONAL_GAP - LABEL_LINE_HEIGHT / 2, textAnchor: "start" };
    case "nw": return { x: x - DIAGONAL_GAP, y: y - DIAGONAL_GAP - LABEL_LINE_HEIGHT / 2, textAnchor: "end" };
    case "se": return { x: x + DIAGONAL_GAP, y: y + DIAGONAL_GAP + LABEL_LINE_HEIGHT / 2, textAnchor: "start" };
    case "sw": return { x: x - DIAGONAL_GAP, y: y + DIAGONAL_GAP + LABEL_LINE_HEIGHT / 2, textAnchor: "end" };
  }
}

/** Pure: the box a label occupies; `y` of the anchor is the label's vertical centre. */
export function labelBox(station: Point, side: LabelSide, text: string): Box {
  const anchor = labelAnchor(station, side);
  const width = estimateTextWidth(text);
  const left = anchor.textAnchor === "start" ? anchor.x : anchor.textAnchor === "end" ? anchor.x - width : anchor.x - width / 2;
  return {
    left,
    right: left + width,
    top: anchor.y - LABEL_LINE_HEIGHT / 2,
    bottom: anchor.y + LABEL_LINE_HEIGHT / 2,
  };
}

/** Map labels drop the parenthetical, e.g. "RAG (Retrieval-Augmented Generation)" → "RAG". */
export function shortLabel(title: string): string {
  return title.replace(/\s*\([^)]*\)\s*$/, "");
}
