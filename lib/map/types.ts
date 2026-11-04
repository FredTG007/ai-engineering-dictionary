export interface Point {
  x: number;
  y: number;
}

export interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** Which side of its station a label sits on. */
export type LabelSide = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

/** A learning track as listed in `internal/Tracks.md`. */
export interface Track {
  id: string;
  name: string;
  colour: string;
  slugs: string[];
}

/** Hand-tuned position of a station, in grid units. */
export interface StationPlacement {
  x: number;
  y: number;
  label: LabelSide;
}

export interface MapStation {
  slug: string;
  label: string;
  position: Point;
  labelSide: LabelSide;
  labelBox: Box;
  trackIds: string[];
}

export interface MapLine {
  trackId: string;
  colour: string;
  /** Octilinear polyline through the track's stations, in pixels. */
  points: Point[];
}

/** Everything needed to draw the subway map, computed at build time. */
export interface SubwayMap {
  width: number;
  height: number;
  stations: MapStation[];
  lines: MapLine[];
}
