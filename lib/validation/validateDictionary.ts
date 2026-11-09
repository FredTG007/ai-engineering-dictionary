import { countWords } from "../content/parseTerm";
import { DIFFICULTIES, type Term } from "../content/types";
import type { Track } from "../map/types";

export const MAX_DESCRIPTION_LENGTH = 140;
export const MIN_BODY_WORDS = 200;

export interface ValidationError {
  slug: string;
  message: string;
}

type TermRule = (term: Term, context: RuleContext) => string[];

interface RuleContext {
  knownSlugs: Set<string>;
  curriculum: Set<string>;
  trackedSlugs: Set<string>;
}

const descriptionIsShort: TermRule = (term) =>
  term.description.length >= MAX_DESCRIPTION_LENGTH
    ? [`description is ${term.description.length} chars (must be < ${MAX_DESCRIPTION_LENGTH})`]
    : [];

const descriptionIsPresent: TermRule = (term) =>
  term.description.trim() === "" ? ["description is missing"] : [];

const bodyIsLongEnough: TermRule = (term) => {
  const words = countWords(term.definitionMarkdown);
  return words < MIN_BODY_WORDS ? [`body has ${words} words (needs >= ${MIN_BODY_WORDS})`] : [];
};

const linksResolve: TermRule = (term, { knownSlugs }) =>
  term.outgoingSlugs
    .filter((target) => !knownSlugs.has(target))
    .map((target) => `links to missing term "${target}"`);

const isInCurriculum: TermRule = (term, { curriculum }) =>
  curriculum.has(term.slug) ? [] : ["missing from internal/Curriculum.md"];

const hasUsageSection: TermRule = (term) =>
  term.hasUsageSection && term.quotes.length > 0 ? [] : ["no _Usage:_ section with quotes"];

const hasDifficulty: TermRule = (term) =>
  term.difficulty ? [] : [`difficulty must be one of: ${DIFFICULTIES.join(", ")}`];

const hasInterviewQuestion: TermRule = (term) =>
  term.interview.endsWith("?") ? [] : ["interview must be a question ending in \"?\""];

const hasInterviewAnswer: TermRule = (term) =>
  term.interviewAnswer === "" ? ["interviewAnswer is missing"] : [];

const isOnATrack: TermRule = (term, { trackedSlugs }) =>
  trackedSlugs.has(term.slug) ? [] : ["not on any track in internal/Tracks.md"];

const TERM_RULES: TermRule[] = [
  descriptionIsPresent,
  descriptionIsShort,
  bodyIsLongEnough,
  linksResolve,
  isInCurriculum,
  hasUsageSection,
  hasDifficulty,
  hasInterviewQuestion,
  hasInterviewAnswer,
  isOnATrack,
];

/** Pure: checks every term against the writing rules and the curriculum against the files. */
export function validateDictionary(terms: Term[], curriculum: string[], tracks: Track[]): ValidationError[] {
  const context: RuleContext = {
    knownSlugs: new Set(terms.map((term) => term.slug)),
    curriculum: new Set(curriculum),
    trackedSlugs: new Set(tracks.flatMap((track) => track.slugs)),
  };
  const termErrors = terms.flatMap((term) =>
    TERM_RULES.flatMap((rule) => rule(term, context)).map((message) => ({ slug: term.slug, message })),
  );
  return [
    ...termErrors,
    ...findOrphanCurriculumEntries(curriculum, context.knownSlugs),
    ...findBuildThisProblems(terms),
  ];
}

/** Pure: every term needs a Build This project card. */
export function findBuildThisProblems(terms: Term[]): ValidationError[] {
  return terms
    .filter((term) => term.buildThis === null)
    .map((term) => ({ slug: term.slug, message: "buildThis project card is missing" }));
}

function findOrphanCurriculumEntries(curriculum: string[], knownSlugs: Set<string>): ValidationError[] {
  return curriculum
    .filter((slug) => !knownSlugs.has(slug))
    .map((slug) => ({ slug, message: "listed in curriculum but dictionary file is missing" }));
}
