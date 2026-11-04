import { countWords } from "../content/parseTerm";
import type { AudioManifest } from "../audio/audioManifest";
import type { ValidationError } from "./validateDictionary";

export const MIN_SCRIPT_WORDS = 90;
export const MAX_SCRIPT_WORDS = 140;
/** Markdown syntax or URLs that a narrator would read out loud. */
const NOT_SPEAKABLE = /https?:\/\/|www\.|\]\(|[*_`#|]/;

/** Pure: manifest slugs must be real terms. */
export function validateAudioManifest(manifest: AudioManifest, knownSlugs: Set<string>): ValidationError[] {
  return manifest.slugs
    .filter((slug) => !knownSlugs.has(slug))
    .map((slug) => ({ slug: `audio:${slug}`, message: "listed in public/audio/manifest.json but is not a term" }));
}

/** Pure: each spoken script belongs to a term, runs 30–60 seconds, and is plain speech. */
export function validateVoiceScripts(scripts: { slug: string; text: string }[], knownSlugs: Set<string>): ValidationError[] {
  return scripts.flatMap(({ slug, text }) =>
    scriptProblems(slug, text, knownSlugs).map((message) => ({ slug: `voice:${slug}`, message })),
  );
}

function scriptProblems(slug: string, text: string, knownSlugs: Set<string>): string[] {
  const words = countWords(text);
  return [
    ...(knownSlugs.has(slug) ? [] : ["has no matching term in dictionary/"]),
    ...(words < MIN_SCRIPT_WORDS || words > MAX_SCRIPT_WORDS ? [`has ${words} words (needs ${MIN_SCRIPT_WORDS}–${MAX_SCRIPT_WORDS})`] : []),
    ...(NOT_SPEAKABLE.test(text) ? ["contains markdown or a URL"] : []),
  ];
}
