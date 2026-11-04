/** Where the narrated audio for a term is served from (files live in `public/audio/`). */
export function audioUrl(slug: string): string {
  return `/audio/${slug}.mp3`;
}

/** The manifest lists the slugs whose narration has been recorded. */
export interface AudioManifest {
  slugs: string[];
}

/** Pure: reads `public/audio/manifest.json`; anything malformed counts as "no audio yet". */
export function parseAudioManifest(json: string | null): AudioManifest {
  if (!json) return { slugs: [] };
  try {
    const data: unknown = JSON.parse(json);
    const slugs = (data as { slugs?: unknown }).slugs;
    return { slugs: Array.isArray(slugs) ? slugs.filter((slug): slug is string => typeof slug === "string") : [] };
  } catch {
    return { slugs: [] };
  }
}

/** Pure: the manifest for a folder that contains these file names. */
export function manifestFromFileNames(fileNames: string[]): AudioManifest {
  const slugs = fileNames.filter((name) => name.endsWith(".mp3")).map((name) => name.slice(0, -".mp3".length));
  return { slugs: slugs.sort() };
}

export function serializeAudioManifest(manifest: AudioManifest): string {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}
