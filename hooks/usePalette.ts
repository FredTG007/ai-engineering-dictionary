"use client";

import { useCallback } from "react";
import { DEFAULT_PALETTE_ID, PALETTES, PALETTE_STORAGE_KEY, findPalette } from "@/lib/theme/palettes";
import { useStoredPreference } from "./useStoredPreference";

const PALETTE_IDS = new Set(PALETTES.map((palette) => palette.id));
const isPaletteId = (value: string): value is string => PALETTE_IDS.has(value);

/**
 * Active palette, persisted in localStorage. The boot script in the layout
 * applies the stored palette before paint; this hook only changes it.
 */
export function usePalette() {
  const [paletteId, storePaletteId] = useStoredPreference(PALETTE_STORAGE_KEY, DEFAULT_PALETTE_ID, isPaletteId);

  const setPaletteId = useCallback(
    (id: string) => {
      document.documentElement.dataset.palette = id;
      storePaletteId(id);
    },
    [storePaletteId],
  );

  return { palette: findPalette(paletteId), setPaletteId };
}
