import { PALETTES, type Palette } from "@/lib/theme/palettes";

interface PaletteSwitcherProps {
  activeId: string;
  onChange: (id: string) => void;
}

export function PaletteSwitcher({ activeId, onChange }: PaletteSwitcherProps) {
  return (
    <div className="palette-switcher" role="radiogroup" aria-label="Color palette">
      {PALETTES.map((palette) => (
        <button
          key={palette.id}
          type="button"
          role="radio"
          aria-checked={palette.id === activeId}
          aria-label={palette.name}
          title={palette.name}
          className="swatch"
          style={swatchStyle(palette)}
          onClick={() => onChange(palette.id)}
        />
      ))}
    </div>
  );
}

function swatchStyle({ colors }: Palette) {
  return { background: `linear-gradient(135deg, ${colors.background} 50%, ${colors.accent} 50%)` };
}
