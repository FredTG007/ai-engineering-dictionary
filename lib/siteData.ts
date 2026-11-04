import { loadAudioManifest } from "./audio/loadAudio";
import { loadCurriculum, loadTerms, loadTracks } from "./content/loadDictionary";
import { publishTerms } from "./content/publishTerms";
import type { PublishedTerm } from "./content/types";
import { buildSubwayMap } from "./map/buildSubwayMap";
import { tracksBySlug } from "./map/parseTracks";
import { STATION_PLACEMENTS } from "./map/stationPlacements";
import type { SubwayMap, Track } from "./map/types";

export interface SiteData {
  terms: PublishedTerm[];
  tracks: Track[];
  map: SubwayMap;
  /** Terms with recorded narration in `public/audio/`. */
  audioSlugs: string[];
}

/** Build-time entry point: everything the client needs, computed once. */
export function loadSiteData(): SiteData {
  const rawTerms = loadTerms();
  const tracks = loadTracks();
  const membership = tracksBySlug(tracks);
  const titles = new Map(rawTerms.map((term) => [term.slug, term.title]));
  const terms = publishTerms(rawTerms, loadCurriculum(), (slug) => membership.get(slug) ?? []);
  const map = buildSubwayMap({ tracks, placements: STATION_PLACEMENTS, titleOf: (slug) => titles.get(slug) ?? slug });
  return { terms, tracks, map, audioSlugs: loadAudioManifest().slugs };
}
