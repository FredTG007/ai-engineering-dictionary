import fs from "node:fs";
import { manifestFromFileNames, serializeAudioManifest } from "../lib/audio/audioManifest";
import { AUDIO_DIR, AUDIO_MANIFEST_FILE } from "../lib/audio/loadAudio";

/** Rewrites public/audio/manifest.json from the .mp3 files actually present. */
function main(): void {
  const manifest = manifestFromFileNames(fs.readdirSync(AUDIO_DIR));
  fs.writeFileSync(AUDIO_MANIFEST_FILE, serializeAudioManifest(manifest));
  console.log(`✓ audio manifest lists ${manifest.slugs.length} term(s): ${manifest.slugs.join(", ") || "none"}`);
}

main();
