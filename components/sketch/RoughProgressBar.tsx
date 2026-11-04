import { roughPolyline, seedFrom } from "@/lib/sketch/roughPath";

const WIDTH = 160;
const HEIGHT = 12;
const HATCH_SPACING = 5;

interface RoughProgressBarProps {
  ratio: number;
  colour: string;
  seed: string;
  label: string;
}

/** A pencil-outlined bar, hatched in the track colour up to `ratio`. */
export function RoughProgressBar({ ratio, colour, seed, label }: RoughProgressBarProps) {
  const filled = Math.max(0, Math.min(1, ratio)) * (WIDTH - 4);
  const outline = roughPolyline(
    [
      { x: 1, y: 1 },
      { x: WIDTH - 1, y: 1 },
      { x: WIDTH - 1, y: HEIGHT - 1 },
      { x: 1, y: HEIGHT - 1 },
      { x: 1, y: 1 },
    ],
    seedFrom(seed),
    { wobble: 0.7, step: 16 },
  );
  return (
    <svg className="rough-progress" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" role="img" aria-label={label}>
      <path className="rough-progress__hatch" stroke={colour} d={hatchLines(filled)} />
      <path className="rough-progress__outline" d={outline} />
    </svg>
  );
}

function hatchLines(width: number): string {
  const count = Math.floor(width / HATCH_SPACING);
  return Array.from({ length: count }, (_, index) => {
    const x = 3 + index * HATCH_SPACING;
    return `M${x},${HEIGHT - 2.5} L${x + 4},2.5`;
  }).join(" ");
}
