import fs from "node:fs";
import path from "node:path";
import { parseAudioManifest, type AudioManifest } from "./audioManifest";

export const AUDIO_DIR = path.join(process.cwd(), "public", "audio");
export const AUDIO_MANIFEST_FILE = path.join(AUDIO_DIR, "manifest.json");
export const VOICE_SCRIPTS_DIR = path.join(process.cwd(), "scripts", "voice");

export function loadAudioManifest(): AudioManifest {
  const json = fs.existsSync(AUDIO_MANIFEST_FILE) ? fs.readFileSync(AUDIO_MANIFEST_FILE, "utf8") : null;
  return parseAudioManifest(json);
}

/** Spoken scripts, one `scripts/voice/<slug>.txt` per narrated term. */
export function loadVoiceScripts(): { slug: string; text: string }[] {
  if (!fs.existsSync(VOICE_SCRIPTS_DIR)) return [];
  return fs
    .readdirSync(VOICE_SCRIPTS_DIR)
    .filter((file) => file.endsWith(".txt"))
    .sort()
    .map((file) => ({ slug: path.basename(file, ".txt"), text: fs.readFileSync(path.join(VOICE_SCRIPTS_DIR, file), "utf8") }));
}
