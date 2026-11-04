import { PALETTES, type Palette } from "@/lib/theme/palettes";

interface PaletteSwitcherProps {
  activeId: string;
  onChange: (id: string) => void;
}

export function PaletteSwitcher({ activeId, onChange }: PaletteSwitcherProps) {
  return (
    <div className="palette-switcher" role="radiogroup" aria-label="Paper">
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

function swatchStyle({ swatch: [page, ink] }: Palette) {
  return { background: `linear-gradient(135deg, ${page} 55%, ${ink} 55%)` };
}
