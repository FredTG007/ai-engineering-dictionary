import { memo } from "react";
import { roundedPath } from "@/lib/map/linePath";
import type { MapLine } from "@/lib/map/types";
import { roughPolyline, seedFrom } from "@/lib/sketch/roughPath";

const CORNER_RADIUS = 16;
const SKETCH_PASSES = [1, 2];

interface TrackLineProps {
  line: MapLine;
  dimmed: boolean;
}

/** One coloured line: a clean inked stroke with two loose pencil passes around it. */
export const TrackLine = memo(function TrackLine({ line, dimmed }: TrackLineProps) {
  return (
    <g className="track-line" data-dimmed={dimmed} style={{ color: line.colour }}>
      {SKETCH_PASSES.map((pass) => (
        <path key={pass} className="track-line__sketch" d={roughPolyline(line.points, seedFrom(line.trackId) + pass, { wobble: 2.2, step: 18 })} />
      ))}
      <path className="track-line__ink" d={roundedPath(line.points, CORNER_RADIUS)} />
    </g>
  );
});
