"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import type { Vec3 } from "@/lib/graph/types";

/** The subset of OrbitControls the rig drives. */
interface TargetControls {
  target: Vector3;
  update: () => void;
}

const FLIGHT_SECONDS = 1.1;
const VIEWING_DISTANCE = 26;

interface Flight {
  fromPosition: Vector3;
  toPosition: Vector3;
  fromTarget: Vector3;
  toTarget: Vector3;
  elapsed: number;
}

/** Flies the camera to `target` whenever it changes, keeping the current viewing angle. */
export function CameraRig({ target }: { target: Vec3 | null }) {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as unknown as TargetControls | null;
  const flight = useRef<Flight | null>(null);

  useEffect(() => {
    if (!target || !controls) return;
    const toTarget = new Vector3(...target);
    const direction = camera.position.clone().sub(controls.target).normalize();
    flight.current = {
      fromPosition: camera.position.clone(),
      toPosition: toTarget.clone().add(direction.multiplyScalar(VIEWING_DISTANCE)),
      fromTarget: controls.target.clone(),
      toTarget,
      elapsed: 0,
    };
  }, [target, camera, controls]);

  useFrame((_, delta) => {
    const current = flight.current;
    if (!current || !controls) return;
    current.elapsed += delta;
    const progress = easeInOutCubic(Math.min(current.elapsed / FLIGHT_SECONDS, 1));
    camera.position.lerpVectors(current.fromPosition, current.toPosition, progress);
    controls.target.lerpVectors(current.fromTarget, current.toTarget, progress);
    controls.update();
    if (progress === 1) flight.current = null;
  });

  return null;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}
