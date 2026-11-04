import type { StudyCard } from "./cards";

/**
 * Pure: an Anki "Notes in Plain Text" file. The header lines tell Anki
 * (2.1.55 and later) the separator, note type, deck and which column holds
 * tags, so File → Import works without any mapping.
 */
export function toAnkiTsv(cards: StudyCard[], trackNameOf: (trackId: string) => string, deckName: string): string {
  const header = ["#separator:tab", "#html:false", "#notetype:Basic", `#deck:${deckName}`, "#tags column:3"];
  const rows = cards.map((card) => [card.front, card.back, ankiTags(card, trackNameOf)].map(quoteField).join("\t"));
  return [...header, ...rows].join("\n") + "\n";
}

/** Pure: a plain RFC 4180 CSV of the deck, for spreadsheets or other tools. */
export function toCsv(cards: StudyCard[], trackNameOf: (trackId: string) => string): string {
  const header = ["slug", "term", "type", "front", "back", "tracks"];
  const rows = cards.map((card) => [card.slug, card.title, card.kind, card.front, card.back, card.trackIds.map(trackNameOf).join("; ")]);
  return [header, ...rows].map((row) => row.map(quoteField).join(",")).join("\r\n") + "\r\n";
}

/** Anki tags can't contain spaces, so "Training & Inference" becomes "Training_&_Inference". */
function ankiTags(card: StudyCard, trackNameOf: (trackId: string) => string): string {
  return ["ai-eng-dictionary", card.kind, ...card.trackIds.map(trackNameOf)].map((tag) => tag.replace(/\s+/g, "_")).join(" ");
}

/** Wraps a field in double quotes and doubles any quotes inside it (works for both CSV and Anki TSV). */
function quoteField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}
