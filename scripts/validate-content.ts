import { loadAudioManifest, loadVoiceScripts } from "../lib/audio/loadAudio";
import { loadCurriculum, loadTerms, loadTracks } from "../lib/content/loadDictionary";
import { buildSubwayMap } from "../lib/map/buildSubwayMap";
import { STATION_PLACEMENTS } from "../lib/map/stationPlacements";
import { findSearchHintProblems } from "../lib/search/embeddingText";
import { loadEmbeddingSources, loadTermEmbeddingsFile } from "../lib/search/loadEmbeddingSources";
import { SEARCH_HINTS } from "../lib/search/searchHints";
import { findStaleEmbeddings } from "../lib/search/termEmbeddings";
import { validateDictionary } from "../lib/validation/validateDictionary";
import { validateMapLayout, validateTracks } from "../lib/validation/validateTracks";
import { validateAudioManifest, validateVoiceScripts } from "../lib/validation/validateVoice";

function main(): void {
  const terms = loadTerms();
  const tracks = loadTracks();
  const titles = new Map(terms.map((term) => [term.slug, term.title]));
  const map = buildSubwayMap({ tracks, placements: STATION_PLACEMENTS, titleOf: (slug) => titles.get(slug) ?? slug });
  const errors = [
    ...validateDictionary(terms, loadCurriculum(), tracks),
    ...validateTracks(tracks, new Set(titles.keys()), STATION_PLACEMENTS),
    ...validateMapLayout(map),
    ...validateAudioManifest(loadAudioManifest(), new Set(titles.keys())),
    ...validateVoiceScripts(loadVoiceScripts(), new Set(titles.keys())),
    ...findSearchHintProblems([...titles.keys()], SEARCH_HINTS),
    ...findStaleEmbeddings(loadEmbeddingSources(), loadTermEmbeddingsFile()),
  ];
  if (errors.length > 0) {
    errors.forEach(({ slug, message }) => console.error(`✗ ${slug}: ${message}`));
    console.error(`\n${errors.length} problem(s) found.`);
    process.exit(1);
  }
  console.log(`✓ ${terms.length} terms valid on ${tracks.length} tracks; map layout has no overlaps; search embeddings are current.`);
}

main();
