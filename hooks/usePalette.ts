"use client";

import { useEffect } from "react";
import { DEFAULT_PALETTE_ID, PALETTES, findPalette, paletteCssVariables } from "@/lib/theme/palettes";
import { useStoredPreference } from "./useStoredPreference";

const PALETTE_IDS = new Set(PALETTES.map((palette) => palette.id));
const isPaletteId = (value: string): value is string => PALETTE_IDS.has(value);

/** Active palette, persisted in localStorage and applied as CSS variables. */
export function usePalette() {
  const [paletteId, setPaletteId] = useStoredPreference("aied:palette", DEFAULT_PALETTE_ID, isPaletteId);
  const palette = findPalette(paletteId);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(paletteCssVariables(palette)).forEach(([name, value]) => root.style.setProperty(name, value));
    root.style.colorScheme = palette.scheme;
  }, [palette]);

  return { palette, setPaletteId };
}
