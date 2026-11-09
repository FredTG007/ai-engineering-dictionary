/** Allowed time estimates for a Build This project card. */
export const BUILD_THIS_TIMES = [
  "under an hour",
  "an afternoon",
  "a day",
  "a weekend",
] as const;

export type BuildThisTime = (typeof BUILD_THIS_TIMES)[number];

/** A small portfolio project that teaches the term by building something. */
export interface BuildThis {
  title: string;
  goal: string;
  steps: string[];
  skills: string[];
  time: BuildThisTime;
  stretch: string;
}

const MIN_STEPS = 3;
const MAX_STEPS = 5;
const MIN_SKILLS = 1;
const MAX_SKILLS = 6;

/** Pure: parse and validate a Build This card from frontmatter. Throws on bad shape. */
export function parseBuildThis(value: unknown): BuildThis {
  if (!isRecord(value)) throw new Error("buildThis must be an object");
  const title = requiredString(value, "title");
  const goal = requiredString(value, "goal");
  const stretch = requiredString(value, "stretch");
  const time = requiredString(value, "time");
  if (!isBuildThisTime(time)) {
    throw new Error(`time must be one of: ${BUILD_THIS_TIMES.join(", ")}`);
  }
  const steps = requiredStringList(value, "steps", MIN_STEPS, MAX_STEPS);
  const skills = requiredStringList(value, "skills", MIN_SKILLS, MAX_SKILLS);
  return { title, goal, steps, skills, time, stretch };
}

/** Pure: return a card or null when the field is absent. Throws when present but invalid. */
export function parseOptionalBuildThis(value: unknown): BuildThis | null {
  if (value === undefined || value === null) return null;
  return parseBuildThis(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBuildThisTime(value: string): value is BuildThisTime {
  return (BUILD_THIS_TIMES as readonly string[]).includes(value);
}

function requiredString(record: Record<string, unknown>, key: string): string {
  const raw = record[key];
  if (typeof raw !== "string" || raw.trim() === "") {
    throw new Error(`${key} is missing`);
  }
  return raw.trim();
}

function requiredStringList(
  record: Record<string, unknown>,
  key: string,
  min: number,
  max: number,
): string[] {
  const raw = record[key];
  if (!Array.isArray(raw)) throw new Error(`${key} must be a list`);
  const items = raw.map((item, index) => {
    if (typeof item !== "string" || item.trim() === "") {
      throw new Error(`${key}[${index}] must be a non-empty string`);
    }
    return item.trim();
  });
  if (items.length < min || items.length > max) {
    throw new Error(`${key} must have ${min} to ${max} items (got ${items.length})`);
  }
  return items;
}
