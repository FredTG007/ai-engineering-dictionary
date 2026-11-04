import { roughPolyline, seedFrom } from "@/lib/sketch/roughPath";

const WIDTH = 200;
const HEIGHT = 10;

/** A pen underline that stretches to its container's width. */
export function RoughUnderline({ seed, className = "" }: { seed: string; className?: string }) {
  const stroke = roughPolyline(
    [
      { x: 2, y: HEIGHT * 0.6 },
      { x: WIDTH * 0.55, y: HEIGHT * 0.45 },
      { x: WIDTH - 2, y: HEIGHT * 0.55 },
    ],
    seedFrom(seed),
    { wobble: 1.6, step: 22 },
  );
  return (
    <svg className={`rough-underline ${className}`} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
      <path d={stroke} />
    </svg>
  );
}
