import type { PublishedTerm } from "../content/types";

export type CardKind = "definition" | "interview";

/** One flashcard. Every term yields a definition card and an interview card. */
export interface StudyCard {
  id: string;
  slug: string;
  kind: CardKind;
  title: string;
  front: string;
  back: string;
  trackIds: string[];
}

export type CardKindFilter = CardKind | "all";

export interface DeckFilter {
  /** Null means every track. */
  trackId: string | null;
  kind: CardKindFilter;
}

/** Pure: the full deck, in curriculum order, definition card before interview card. */
export function buildStudyCards(terms: PublishedTerm[]): StudyCard[] {
  return terms.flatMap((term) => [definitionCard(term), interviewCard(term)]);
}

/** Pure: the cards that match a track and card-type filter. */
export function filterCards(cards: StudyCard[], { trackId, kind }: DeckFilter): StudyCard[] {
  return cards.filter(
    (card) => (trackId === null || card.trackIds.includes(trackId)) && (kind === "all" || card.kind === kind),
  );
}

function definitionCard(term: PublishedTerm): StudyCard {
  return { ...cardBase(term, "definition"), front: term.title, back: term.description };
}

function interviewCard(term: PublishedTerm): StudyCard {
  return { ...cardBase(term, "interview"), front: term.interview, back: term.interviewAnswer };
}

function cardBase(term: PublishedTerm, kind: CardKind) {
  return { id: `${term.slug}:${kind}`, slug: term.slug, kind, title: term.title, trackIds: term.trackIds };
}
