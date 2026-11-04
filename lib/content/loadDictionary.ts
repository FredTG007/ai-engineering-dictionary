import fs from "node:fs";
import path from "node:path";
import { parseTracks } from "../map/parseTracks";
import type { Track } from "../map/types";
import { parseCurriculum } from "./curriculum";
import { parseTerm } from "./parseTerm";
import type { Term } from "./types";

const DICTIONARY_DIR = path.join(process.cwd(), "dictionary");
const CURRICULUM_FILE = path.join(process.cwd(), "internal", "Curriculum.md");
const TRACKS_FILE = path.join(process.cwd(), "internal", "Tracks.md");

export function loadTerms(): Term[] {
  return fs
    .readdirSync(DICTIONARY_DIR)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => parseTerm(path.basename(file, ".md"), readText(path.join(DICTIONARY_DIR, file))));
}

export function loadCurriculum(): string[] {
  return parseCurriculum(readText(CURRICULUM_FILE));
}

export function loadTracks(): Track[] {
  return parseTracks(readText(TRACKS_FILE));
}

function readText(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}
