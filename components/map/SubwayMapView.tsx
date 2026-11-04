"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useElementSize } from "@/hooks/useElementSize";
import { usePanZoom } from "@/hooks/usePanZoom";
import type { MapStation, SubwayMap } from "@/lib/map/types";
import { centreOn, fitContent, type Size, type Viewport } from "@/lib/map/viewport";
import { PaperGrid } from "./PaperGrid";
import { overlayInsets } from "./overlayInsets";
import { StartHereNote } from "./StartHereNote";
import { Station } from "./Station";
import { TrackLine } from "./TrackLine";
import { ZoomControls } from "./ZoomControls";

const FOCUS_SCALE = 1.15;
/** Below this the labels are too small to read, so fitting crops the edges instead. */
const FIT_MIN_SCALE = 0.6;
const BUTTON_ZOOM_STEP = 1.3;

interface SubwayMapViewProps {
  map: SubwayMap;
  /** Station that gets the "start here" note. */
  startSlug: string;
  colourOf: (trackId: string) => string;
  selectedSlug: string | null;
  learned: ReadonlySet<string>;
  focusedTrackId: string | null;
  onSelect: (slug: string) => void;
  onHover: (slug: string | null) => void;
}

export function SubwayMapView({ map, startSlug, colourOf, selectedSlug, learned, focusedTrackId, onSelect, onHover }: SubwayMapViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const size = useElementSize(svgRef);
  const { viewport, setViewport, flyTo, zoomBy, wasDragged, handlers } = usePanZoom(svgRef, { x: 0, y: 0, scale: 1 });
  const stationsBySlug = useMemo(() => new Map(map.stations.map((station) => [station.slug, station])), [map.stations]);
  const selectedStation = selectedSlug ? stationsBySlug.get(selectedSlug) : undefined;

  const fitView = useCallback(
    (view: Size) => fitContent({ width: map.width, height: map.height }, view, overlayInsets(view), FIT_MIN_SCALE),
    [map.width, map.height],
  );

  useViewportFollowsSelection(size, selectedStation, viewport.scale, fitView, setViewport, flyTo);

  const activate = useCallback((slug: string) => !wasDragged() && onSelect(slug), [wasDragged, onSelect]);
  const isDimmed = (trackIds: string[]) => focusedTrackId !== null && !trackIds.includes(focusedTrackId);
  const startStation = stationsBySlug.get(startSlug);

  return (
    <div className="map">
      <svg ref={svgRef} className="map__surface" role="application" aria-label="Subway map of AI engineering terms" {...handlers}>
        <g transform={`translate(${viewport.x} ${viewport.y}) scale(${viewport.scale})`}>
          <PaperGrid width={map.width} height={map.height} />
          {startStation && <StartHereNote station={startStation.position} />}
          {map.lines.map((line) => (
            <TrackLine key={line.trackId} line={line} dimmed={isDimmed([line.trackId])} />
          ))}
          {map.stations.map((station) => (
            <Station
              key={station.slug}
              station={station}
              colour={colourOf(station.trackIds[0])}
              selected={station.slug === selectedSlug}
              learned={learned.has(station.slug)}
              dimmed={isDimmed(station.trackIds)}
              onActivate={activate}
              onHover={onHover}
            />
          ))}
        </g>
      </svg>
      <ZoomControls
        onZoomIn={() => zoomBy(BUTTON_ZOOM_STEP)}
        onZoomOut={() => zoomBy(1 / BUTTON_ZOOM_STEP)}
        onFit={() => size && flyTo(fitView(size))}
      />
    </div>
  );
}

/**
 * First measurement: show the whole map, or jump straight to a deep-linked
 * station. Afterwards: fly to each newly selected station.
 */
function useViewportFollowsSelection(
  size: Size | null,
  station: MapStation | undefined,
  currentScale: number,
  fitView: (view: Size) => Viewport,
  setViewport: (viewport: Viewport) => void,
  flyTo: (viewport: Viewport) => void,
) {
  const placed = useRef(false);
  const scale = useRef(currentScale);
  scale.current = currentScale;

  useEffect(() => {
    if (!size) return;
    const target = station
      ? centreOn(station.position, Math.max(scale.current, FOCUS_SCALE), size, overlayInsets(size))
      : null;
    if (!placed.current) {
      placed.current = true;
      setViewport(target ?? fitView(size));
    } else if (target) {
      flyTo(target);
    }
    // Only a new selection (or the first measurement) should move the camera.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station, size === null]);
}
