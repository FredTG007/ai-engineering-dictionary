import { loadCurriculum, loadTerms, loadTracks } from "../lib/content/loadDictionary";
import { buildSubwayMap } from "../lib/map/buildSubwayMap";
import { STATION_PLACEMENTS } from "../lib/map/stationPlacements";
import { validateDictionary } from "../lib/validation/validateDictionary";
import { validateMapLayout, validateTracks } from "../lib/validation/validateTracks";

function main(): void {
  const terms = loadTerms();
  const tracks = loadTracks();
  const titles = new Map(terms.map((term) => [term.slug, term.title]));
  const map = buildSubwayMap({ tracks, placements: STATION_PLACEMENTS, titleOf: (slug) => titles.get(slug) ?? slug });
  const errors = [
    ...validateDictionary(terms, loadCurriculum(), tracks),
    ...validateTracks(tracks, new Set(titles.keys()), STATION_PLACEMENTS),
    ...validateMapLayout(map),
  ];
  if (errors.length > 0) {
    errors.forEach(({ slug, message }) => console.error(`✗ ${slug}: ${message}`));
    console.error(`\n${errors.length} problem(s) found.`);
    process.exit(1);
  }
  console.log(`✓ ${terms.length} terms valid on ${tracks.length} tracks; map layout has no overlaps.`);
}

main();
