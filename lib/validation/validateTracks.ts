import { findLayoutProblems } from "../map/findLayoutProblems";
import type { StationPlacement, SubwayMap, Track } from "../map/types";
import type { ValidationError } from "./validateDictionary";

const MIN_STATIONS = 2;

/** Pure: checks `internal/Tracks.md` against the dictionary and the map placements. */
export function validateTracks(tracks: Track[], knownSlugs: Set<string>, placements: Record<string, StationPlacement>): ValidationError[] {
  const trackedSlugs = new Set(tracks.flatMap((track) => track.slugs));
  return [
    ...tracks.flatMap((track) => trackProblems(track, knownSlugs).map((message) => ({ slug: `track:${track.id}`, message }))),
    ...[...trackedSlugs].filter((slug) => !placements[slug]).map((slug) => ({ slug, message: "on a track but has no position in lib/map/stationPlacements.ts" })),
    ...Object.keys(placements).filter((slug) => !trackedSlugs.has(slug)).map((slug) => ({ slug, message: "has a map position but is on no track" })),
  ];
}

function trackProblems(track: Track, knownSlugs: Set<string>): string[] {
  const unknown = track.slugs.filter((slug) => !knownSlugs.has(slug)).map((slug) => `lists unknown term "${slug}"`);
  const repeated = track.slugs.filter((slug, index) => track.slugs.indexOf(slug) !== index).map((slug) => `lists "${slug}" twice`);
  const tooShort = track.slugs.length < MIN_STATIONS ? [`needs at least ${MIN_STATIONS} stations`] : [];
  const noColour = track.colour === "#000000" ? ["is missing a `colour: #rrggbb` line"] : [];
  return [...unknown, ...repeated, ...tooShort, ...noColour];
}

/** Pure: every label must stay clear of other labels, stations and lines. */
export function validateMapLayout(map: SubwayMap): ValidationError[] {
  return findLayoutProblems(map).map((message) => ({ slug: "map", message }));
}
