export interface Palette {
  id: string;
  name: string;
  scheme: "light" | "dark";
  colors: {
    background: string;
    surface: string;
    text: string;
    muted: string;
    accent: string;
    accentAlt: string;
    edge: string;
    node: string;
  };
}

export const PALETTES: Palette[] = [
  {
    id: "nocturne",
    name: "Nocturne",
    scheme: "dark",
    colors: {
      background: "#0a0e19",
      surface: "rgba(16, 22, 38, 0.88)",
      text: "#e7eaf3",
      muted: "#8d96ab",
      accent: "#7cf2c8",
      accentAlt: "#ff9e64",
      edge: "#2c3754",
      node: "#6474a0",
    },
  },
  {
    id: "ember",
    name: "Ember",
    scheme: "dark",
    colors: {
      background: "#150c0a",
      surface: "rgba(34, 19, 15, 0.9)",
      text: "#f6eae0",
      muted: "#b39484",
      accent: "#ff7a45",
      accentAlt: "#ffd166",
      edge: "#4b2b22",
      node: "#a0614a",
    },
  },
  {
    id: "paper",
    name: "Paper",
    scheme: "light",
    colors: {
      background: "#f2eee4",
      surface: "rgba(255, 252, 245, 0.92)",
      text: "#1f1d1a",
      muted: "#6b665d",
      accent: "#2f5bd3",
      accentAlt: "#d6453d",
      edge: "#c4baa6",
      node: "#857b69",
    },
  },
  {
    id: "aurora",
    name: "Aurora",
    scheme: "dark",
    colors: {
      background: "#061316",
      surface: "rgba(10, 30, 34, 0.88)",
      text: "#dff7f3",
      muted: "#86aaa6",
      accent: "#c38bff",
      accentAlt: "#5ef0ff",
      edge: "#1a3b41",
      node: "#438690",
    },
  },
];

export const DEFAULT_PALETTE_ID = PALETTES[0].id;

export function findPalette(id: string): Palette {
  return PALETTES.find((palette) => palette.id === id) ?? PALETTES[0];
}

/** CSS custom properties for a palette, e.g. `--color-accent`. */
export function paletteCssVariables(palette: Palette): Record<string, string> {
  return Object.fromEntries(
    Object.entries(palette.colors).map(([key, value]) => [`--color-${toKebabCase(key)}`, value]),
  );
}

function toKebabCase(name: string): string {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
