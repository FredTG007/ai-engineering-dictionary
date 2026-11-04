import type { Point } from "@/lib/map/types";
import { roughArrow } from "@/lib/sketch/roughPath";

const NOTE_OFFSET = { x: 18, y: 104 };

/** A pencilled margin note pointing at the first station. */
export function StartHereNote({ station }: { station: Point }) {
  const note = { x: station.x + NOTE_OFFSET.x, y: station.y + NOTE_OFFSET.y };
  const { shaft, head } = roughArrow({ x: note.x - 4, y: note.y - 20 }, { x: station.x + 4, y: station.y + 16 }, 7);
  return (
    <g className="margin-note" aria-hidden="true">
      <text x={note.x} y={note.y} textAnchor="middle">
        start here
      </text>
      <path d={shaft} />
      <path d={head} />
    </g>
  );
}
