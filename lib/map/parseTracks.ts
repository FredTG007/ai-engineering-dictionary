import type { Track } from "./types";

const TRACK_HEADING = /^##\s+(.+?)\s*$/;
const COLOUR_LINE = /^colour:\s*(#[0-9a-fA-F]{6})\s*$/;
const ORDERED_ITEM = /^\s*\d+\.\s+([a-z0-9-]+)\s*$/;

/** Pure: reads tracks (heading, colour, ordered slugs) from the tracks markdown. */
export function parseTracks(markdown: string): Track[] {
  const tracks: Track[] = [];
  for (const line of markdown.split("\n")) {
    const heading = TRACK_HEADING.exec(line);
    if (heading) tracks.push({ id: trackIdFromName(heading[1]), name: heading[1], colour: "#000000", slugs: [] });
    const current = tracks.at(-1);
    if (!current) continue;
    const colour = COLOUR_LINE.exec(line);
    if (colour) current.colour = colour[1];
    const item = ORDERED_ITEM.exec(line);
    if (item) current.slugs.push(item[1]);
  }
  return tracks;
}

export function trackIdFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Track ids each slug belongs to, in track order. */
export function tracksBySlug(tracks: Track[]): Map<string, string[]> {
  const membership = new Map<string, string[]>();
  for (const track of tracks) {
    for (const slug of track.slugs) membership.set(slug, [...(membership.get(slug) ?? []), track.id]);
  }
  return membership;
}
