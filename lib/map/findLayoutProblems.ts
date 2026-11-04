import { STATION_RADIUS } from "./buildSubwayMap";
import { boxAround, boxesOverlap, segmentCrossesBox, shrinkBox } from "./geometry";
import type { MapLine, MapStation, Point, SubwayMap } from "./types";

/** Breathing room kept clear around every label, in pixels. */
const LABEL_PADDING = 3;
const MIN_STATION_DISTANCE = STATION_RADIUS * 4;

/** Pure: legibility problems on the map — anything that would overlap or touch. */
export function findLayoutProblems(map: SubwayMap): string[] {
  return [
    ...labelsOverlappingLabels(map.stations),
    ...labelsOverlappingStations(map.stations),
    ...labelsCrossingLines(map),
    ...stationsTooClose(map.stations),
    ...linesThroughForeignStations(map),
  ];
}

function paddedLabel(station: MapStation) {
  return shrinkBox(station.labelBox, -LABEL_PADDING);
}

function labelsOverlappingLabels(stations: MapStation[]): string[] {
  return pairs(stations)
    .filter(([a, b]) => boxesOverlap(paddedLabel(a), b.labelBox))
    .map(([a, b]) => `labels of "${a.slug}" and "${b.slug}" overlap`);
}

function labelsOverlappingStations(stations: MapStation[]): string[] {
  return stations.flatMap((labelled) =>
    stations
      .filter((other) => other !== labelled && boxesOverlap(paddedLabel(labelled), boxAround(other.position, STATION_RADIUS)))
      .map((other) => `label of "${labelled.slug}" covers station "${other.slug}"`),
  );
}

function labelsCrossingLines(map: SubwayMap): string[] {
  return map.stations.flatMap((station) =>
    map.lines
      .filter((line) => segmentsOf(line).some(([a, b]) => segmentCrossesBox(a, b, paddedLabel(station))))
      .map((line) => `label of "${station.slug}" crosses the ${line.trackId} line`),
  );
}

function stationsTooClose(stations: MapStation[]): string[] {
  return pairs(stations)
    .filter(([a, b]) => distance(a.position, b.position) < MIN_STATION_DISTANCE)
    .map(([a, b]) => `stations "${a.slug}" and "${b.slug}" are too close`);
}

function linesThroughForeignStations(map: SubwayMap): string[] {
  return map.lines.flatMap((line) =>
    map.stations
      .filter((station) => !station.trackIds.includes(line.trackId))
      .filter((station) => segmentsOf(line).some(([a, b]) => segmentCrossesBox(a, b, boxAround(station.position, STATION_RADIUS * 1.5))))
      .map((station) => `the ${line.trackId} line runs through station "${station.slug}"`),
  );
}

function segmentsOf(line: MapLine): [Point, Point][] {
  return line.points.slice(1).map((point, index) => [line.points[index], point]);
}

function pairs<T>(items: T[]): [T, T][] {
  return items.flatMap((a, index) => items.slice(index + 1).map((b): [T, T] => [a, b]));
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
