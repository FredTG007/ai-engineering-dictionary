import { boxAround, unionBox } from "./geometry";
import { labelBox, shortLabel } from "./labelGeometry";
import { routeThrough } from "./octilinearRoute";
import { tracksBySlug } from "./parseTracks";
import type { Box, MapLine, MapStation, Point, StationPlacement, SubwayMap, Track } from "./types";

/** Pixels per grid unit used by the placements. */
export const GRID_SIZE = 40;
export const MAP_MARGIN = 60;
export const STATION_RADIUS = 7;

interface MapInput {
  tracks: Track[];
  placements: Record<string, StationPlacement>;
  titleOf: (slug: string) => string;
}

/** Pure: turns tracks plus hand-tuned placements into drawable stations and lines. */
export function buildSubwayMap({ tracks, placements, titleOf }: MapInput): SubwayMap {
  const membership = tracksBySlug(tracks);
  const placed = [...membership.keys()].filter((slug) => placements[slug]);
  const rawStations = placed.map((slug) =>
    createStation(slug, placements[slug], shortLabel(titleOf(slug)), membership.get(slug) ?? []),
  );
  const rawLines = tracks.map((track) => createLine(track, placements));
  const bounds = unionBox([...rawStations.flatMap(stationBoxes), ...rawLines.flatMap((line) => line.points.map((point) => boxAround(point, 0)))]);
  const shift = { x: MAP_MARGIN - bounds.left, y: MAP_MARGIN - bounds.top };
  return {
    width: Math.ceil(bounds.right - bounds.left + 2 * MAP_MARGIN),
    height: Math.ceil(bounds.bottom - bounds.top + 2 * MAP_MARGIN),
    stations: rawStations.map((station) => shiftStation(station, shift)),
    lines: rawLines.map((line) => ({ ...line, points: line.points.map((point) => translate(point, shift)) })),
  };
}

function createStation(slug: string, placement: StationPlacement, label: string, trackIds: string[]): MapStation {
  const position = toPixels(placement);
  return { slug, label, position, labelSide: placement.label, labelBox: labelBox(position, placement.label, label), trackIds };
}

function createLine(track: Track, placements: Record<string, StationPlacement>): MapLine {
  const stops = track.slugs.filter((slug) => placements[slug]).map((slug) => toPixels(placements[slug]));
  return { trackId: track.id, colour: track.colour, points: routeThrough(stops) };
}

function stationBoxes(station: MapStation): Box[] {
  return [station.labelBox, boxAround(station.position, STATION_RADIUS * 2)];
}

function shiftStation(station: MapStation, shift: Point): MapStation {
  const position = translate(station.position, shift);
  return { ...station, position, labelBox: labelBox(position, station.labelSide, station.label) };
}

function toPixels({ x, y }: StationPlacement): Point {
  return { x: x * GRID_SIZE, y: y * GRID_SIZE };
}

function translate(point: Point, shift: Point): Point {
  return { x: point.x + shift.x, y: point.y + shift.y };
}
