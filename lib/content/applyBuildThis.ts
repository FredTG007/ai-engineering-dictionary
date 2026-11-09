import type { BuildThis } from "./buildThis";

/** Insert or replace the buildThis key inside YAML frontmatter. */
export function upsertFrontmatter(raw: string, card: BuildThis): string {
  if (!raw.startsWith("---\n")) throw new Error("file has no frontmatter");
  const end = raw.indexOf("\n---\n", 4);
  if (end === -1) throw new Error("frontmatter not closed");
  const head = raw.slice(4, end);
  const body = raw.slice(end + 5);
  const without = stripBuildThis(head).trimEnd();
  const yaml = `${without}\n${formatBuildThisYaml(card)}\n`;
  return `---\n${yaml}---\n${body}`;
}

function stripBuildThis(frontmatter: string): string {
  const lines = frontmatter.split("\n");
  const kept: string[] = [];
  let skipping = false;
  for (const line of lines) {
    if (/^buildThis:\s*$/.test(line)) {
      skipping = true;
      continue;
    }
    if (skipping) {
      if (/^\s/.test(line) || line.trim() === "") continue;
      skipping = false;
    }
    kept.push(line);
  }
  return kept.join("\n");
}

export function formatBuildThisYaml(card: BuildThis): string {
  const steps = card.steps.map((step) => `    - ${yamlQuote(step)}`).join("\n");
  const skills = card.skills.map((skill) => `    - ${yamlQuote(skill)}`).join("\n");
  return [
    "buildThis:",
    `  title: ${yamlQuote(card.title)}`,
    `  goal: ${yamlQuote(card.goal)}`,
    "  steps:",
    steps,
    "  skills:",
    skills,
    `  time: ${yamlQuote(card.time)}`,
    `  stretch: ${yamlQuote(card.stretch)}`,
  ].join("\n");
}

function yamlQuote(value: string): string {
  if (/^[\w .,:;!?/+()-]+$/.test(value) && !value.includes(": ")) return value;
  return JSON.stringify(value);
}
