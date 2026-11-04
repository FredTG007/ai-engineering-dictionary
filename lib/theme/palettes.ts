export interface Palette {
  id: string;
  name: string;
  /** Two colours for the switcher swatch: page and ink. */
  swatch: [string, string];
}

/** The colours themselves live in `app/globals.css` under `[data-palette="…"]`. */
export const PALETTES: Palette[] = [
  { id: "paper", name: "Paper", swatch: ["#f4eedf", "#2a2620"] },
  { id: "kraft", name: "Kraft", swatch: ["#e3cfa9", "#3a2a18"] },
  { id: "night", name: "Night", swatch: ["#1b1f2a", "#e9e2cf"] },
];

export const DEFAULT_PALETTE_ID = PALETTES[0].id;
export const PALETTE_STORAGE_KEY = "aied:palette";

export function findPalette(id: string): Palette {
  return PALETTES.find((palette) => palette.id === id) ?? PALETTES[0];
}

/**
 * Inline script for <head>: applies the stored palette before first paint so
 * returning visitors don't see the default colours flash.
 */
export function paletteBootScript(): string {
  const ids = JSON.stringify(PALETTES.map((palette) => palette.id));
  return `try{var p=localStorage.getItem(${JSON.stringify(PALETTE_STORAGE_KEY)});if(${ids}.indexOf(p)>-1)document.documentElement.dataset.palette=p}catch(e){}`;
}
