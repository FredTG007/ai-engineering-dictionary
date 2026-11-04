import { createSeededRandom } from "./seededRandom";
import type { PositionedGraph, TermGraph, Vec3 } from "./types";

export interface ForceLayoutOptions {
  iterations: number;
  linkDistance: number;
  linkStrength: number;
  repulsion: number;
  centering: number;
  damping: number;
  seed: number;
}

const DEFAULT_OPTIONS: ForceLayoutOptions = {
  iterations: 400,
  linkDistance: 12,
  linkStrength: 0.05,
  repulsion: 260,
  centering: 0.012,
  damping: 0.82,
  seed: 7,
};

interface Body {
  position: Vec3;
  velocity: Vec3;
}

/**
 * Pure 3D force-directed layout: springs along edges, inverse-square
 * repulsion between every pair, and a weak pull toward the origin.
 */
export function layoutGraph(graph: TermGraph, overrides: Partial<ForceLayoutOptions> = {}): PositionedGraph {
  const options = { ...DEFAULT_OPTIONS, ...overrides };
  const bodies = seedBodies(graph.nodes.length, options.seed);
  const index = new Map(graph.nodes.map((node, i) => [node.slug, i]));
  const links = graph.edges.map(({ source, target }) => [index.get(source)!, index.get(target)!] as const);

  for (let step = 0; step < options.iterations; step++) {
    const cooling = 1 - step / options.iterations;
    applyRepulsion(bodies, options.repulsion * cooling);
    applySprings(bodies, links, options);
    applyCentering(bodies, options.centering);
    integrate(bodies, options.damping);
  }

  const positions = Object.fromEntries(graph.nodes.map((node, i) => [node.slug, roundVec(bodies[i].position)]));
  return { ...graph, positions };
}

function seedBodies(count: number, seed: number): Body[] {
  const random = createSeededRandom(seed);
  const radius = Math.cbrt(count) * 6;
  return Array.from({ length: count }, () => ({
    position: [(random() - 0.5) * radius, (random() - 0.5) * radius, (random() - 0.5) * radius],
    velocity: [0, 0, 0],
  }));
}

function applyRepulsion(bodies: Body[], strength: number): void {
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const delta = subtract(bodies[i].position, bodies[j].position);
      const distanceSquared = Math.max(dot(delta, delta), 0.01);
      const push = scale(delta, strength / (distanceSquared * Math.sqrt(distanceSquared)));
      addInPlace(bodies[i].velocity, push);
      addInPlace(bodies[j].velocity, scale(push, -1));
    }
  }
}

function applySprings(bodies: Body[], links: ReadonlyArray<readonly [number, number]>, options: ForceLayoutOptions): void {
  for (const [a, b] of links) {
    const delta = subtract(bodies[b].position, bodies[a].position);
    const distance = Math.max(Math.sqrt(dot(delta, delta)), 0.01);
    const pull = scale(delta, ((distance - options.linkDistance) / distance) * options.linkStrength * 0.5);
    addInPlace(bodies[a].velocity, pull);
    addInPlace(bodies[b].velocity, scale(pull, -1));
  }
}

function applyCentering(bodies: Body[], strength: number): void {
  for (const body of bodies) addInPlace(body.velocity, scale(body.position, -strength));
}

function integrate(bodies: Body[], damping: number): void {
  for (const body of bodies) {
    body.velocity = scale(body.velocity, damping);
    addInPlace(body.position, body.velocity);
  }
}

function subtract(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scale(v: Vec3, factor: number): Vec3 {
  return [v[0] * factor, v[1] * factor, v[2] * factor];
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function addInPlace(target: Vec3, v: Vec3): void {
  target[0] += v[0];
  target[1] += v[1];
  target[2] += v[2];
}

function roundVec(v: Vec3): Vec3 {
  return [round(v[0]), round(v[1]), round(v[2])];
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
