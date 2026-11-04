"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type RefObject } from "react";
import type { Point } from "@/lib/map/types";
import { interpolate, zoomAround, type Viewport } from "@/lib/map/viewport";

const DRAG_THRESHOLD = 5;
const WHEEL_SENSITIVITY = 0.0016;
const FLIGHT_MS = 520;

interface Gesture {
  pointers: Map<number, Point>;
  dragged: boolean;
  startPoint: Point | null;
  lastPinchDistance: number | null;
}

/**
 * Drag to pan, wheel or pinch to zoom, and animated flights to a target
 * viewport. Pointer capture starts only once a drag is detected, so plain
 * clicks still reach the stations underneath.
 */
export function usePanZoom(surfaceRef: RefObject<SVGSVGElement | null>, initial: Viewport) {
  const [viewport, setViewport] = useState(initial);
  const latest = useRef(initial);
  latest.current = viewport;
  const gesture = useRef<Gesture>({ pointers: new Map(), dragged: false, startPoint: null, lastPinchDistance: null });
  const flight = useRef<number | null>(null);

  const cancelFlight = useCallback(() => {
    if (flight.current !== null) cancelAnimationFrame(flight.current);
    flight.current = null;
  }, []);

  const flyTo = useCallback(
    (target: Viewport) => {
      cancelFlight();
      const startedAt = performance.now();
      const from = latest.current;
      const frame = (now: number) => {
        const t = Math.min(1, (now - startedAt) / FLIGHT_MS);
        setViewport(interpolate(from, target, easeInOutCubic(t)));
        flight.current = t < 1 ? requestAnimationFrame(frame) : null;
      };
      flight.current = requestAnimationFrame(frame);
    },
    [cancelFlight],
  );

  const zoomBy = useCallback(
    (factor: number, anchor?: Point) => {
      cancelFlight();
      const surface = surfaceRef.current;
      const centre = anchor ?? (surface ? { x: surface.clientWidth / 2, y: surface.clientHeight / 2 } : { x: 0, y: 0 });
      setViewport((current) => zoomAround(current, centre, factor));
    },
    [cancelFlight, surfaceRef],
  );

  useWheelZoom(surfaceRef, zoomBy);

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    cancelFlight();
    const state = gesture.current;
    state.pointers.set(event.pointerId, localPoint(event));
    if (state.pointers.size === 1) {
      state.dragged = false;
      state.startPoint = localPoint(event);
    }
    state.lastPinchDistance = null;
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const state = gesture.current;
    const previous = state.pointers.get(event.pointerId);
    if (!previous) return;
    const point = localPoint(event);
    state.pointers.set(event.pointerId, point);
    if (state.pointers.size >= 2) return pinch(state, setViewport);
    if (!state.dragged && state.startPoint && distance(point, state.startPoint) < DRAG_THRESHOLD) return;
    if (!state.dragged) event.currentTarget.setPointerCapture(event.pointerId);
    state.dragged = true;
    setViewport((current) => ({ ...current, x: current.x + point.x - previous.x, y: current.y + point.y - previous.y }));
  };

  const onPointerUp = (event: PointerEvent<SVGSVGElement>) => {
    gesture.current.pointers.delete(event.pointerId);
    gesture.current.lastPinchDistance = null;
  };

  /** True right after a drag, so the click that ends it doesn't select a station. */
  const wasDragged = useCallback(() => gesture.current.dragged, []);

  useEffect(() => cancelFlight, [cancelFlight]);

  return {
    viewport,
    setViewport,
    flyTo,
    zoomBy,
    wasDragged,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  };
}

function useWheelZoom(surfaceRef: RefObject<SVGSVGElement | null>, zoomBy: (factor: number, anchor?: Point) => void) {
  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = surface.getBoundingClientRect();
      zoomBy(Math.exp(-event.deltaY * WHEEL_SENSITIVITY), { x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    surface.addEventListener("wheel", handleWheel, { passive: false });
    return () => surface.removeEventListener("wheel", handleWheel);
  }, [surfaceRef, zoomBy]);
}

function pinch(state: Gesture, setViewport: (update: (current: Viewport) => Viewport) => void) {
  const [a, b] = [...state.pointers.values()];
  const spread = distance(a, b);
  const previousSpread = state.lastPinchDistance;
  state.lastPinchDistance = spread;
  state.dragged = true;
  if (previousSpread === null || previousSpread === 0) return;
  const midpoint = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  setViewport((current) => zoomAround(current, midpoint, spread / previousSpread));
}

function localPoint(event: PointerEvent<SVGSVGElement>): Point {
  const rect = event.currentTarget.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}
