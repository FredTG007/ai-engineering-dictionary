import { memo, type KeyboardEvent } from "react";
import { STATION_RADIUS } from "@/lib/map/buildSubwayMap";
import { labelAnchor } from "@/lib/map/labelGeometry";
import type { MapStation } from "@/lib/map/types";
import { roughEllipse, seedFrom } from "@/lib/sketch/roughPath";

const INTERCHANGE_RADIUS = STATION_RADIUS + 2.5;

interface StationProps {
  station: MapStation;
  colour: string;
  selected: boolean;
  learned: boolean;
  dimmed: boolean;
  onActivate: (slug: string) => void;
  onHover: (slug: string | null) => void;
}

export const Station = memo(function Station({ station, colour, selected, learned, dimmed, onActivate, onHover }: StationProps) {
  const { slug, label, position } = station;
  const interchange = station.trackIds.length > 1;
  const anchor = labelAnchor(position, station.labelSide);

  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onActivate(slug);
  };

  return (
    <g
      className="station"
      data-interchange={interchange}
      data-selected={selected}
      data-learned={learned}
      data-dimmed={dimmed}
      style={{ color: interchange ? "var(--ink)" : colour }}
      role="button"
      tabIndex={0}
      aria-label={`${label}${learned ? " (learned)" : ""}`}
      aria-pressed={selected}
      onClick={() => onActivate(slug)}
      onKeyDown={handleKeyDown}
      onPointerEnter={() => onHover(slug)}
      onPointerLeave={() => onHover(null)}
    >
      <circle className="station__hit" cx={position.x} cy={position.y} r={STATION_RADIUS * 2.4} />
      {selected && (
        <path className="station__circled" d={roughEllipse(position, INTERCHANGE_RADIUS + 9, INTERCHANGE_RADIUS + 7, seedFrom(slug))} />
      )}
      <circle className="station__marker" cx={position.x} cy={position.y} r={interchange ? INTERCHANGE_RADIUS : STATION_RADIUS} />
      <text className="station__label" x={anchor.x} y={anchor.y} textAnchor={anchor.textAnchor} dominantBaseline="central">
        {label}
      </text>
    </g>
  );
});
