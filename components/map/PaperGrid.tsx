const GRID_SPACING = 24;
const OVERSCAN = 4000;

/** Faint dot grid in map space, so it pans and zooms with the ink. */
export function PaperGrid({ width, height }: { width: number; height: number }) {
  return (
    <>
      <defs>
        <pattern id="paper-dots" width={GRID_SPACING} height={GRID_SPACING} patternUnits="userSpaceOnUse">
          <circle cx={GRID_SPACING / 2} cy={GRID_SPACING / 2} r={0.9} className="paper-dot" />
        </pattern>
      </defs>
      <rect x={-OVERSCAN} y={-OVERSCAN} width={width + 2 * OVERSCAN} height={height + 2 * OVERSCAN} fill="url(#paper-dots)" />
    </>
  );
}
