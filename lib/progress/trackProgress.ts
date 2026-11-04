import type { Track } from "../map/types";

export interface TrackProgress {
  trackId: string;
  learned: number;
  total: number;
  /** First station on the track not yet learned, or null when the track is done. */
  nextSlug: string | null;
}

/** Pure: how far along each track the reader is. */
export function progressByTrack(tracks: Track[], learned: ReadonlySet<string>): TrackProgress[] {
  return tracks.map((track) => ({
    trackId: track.id,
    learned: track.slugs.filter((slug) => learned.has(slug)).length,
    total: track.slugs.length,
    nextSlug: track.slugs.find((slug) => !learned.has(slug)) ?? null,
  }));
}

/** Pure: keeps only slugs that still exist, so renamed terms don't count forever. */
export function parseLearnedSlugs(stored: string | null, isKnownSlug: (slug: string) => boolean): string[] {
  if (!stored) return [];
  try {
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((slug): slug is string => typeof slug === "string" && isKnownSlug(slug)) : [];
  } catch {
    return [];
  }
}
