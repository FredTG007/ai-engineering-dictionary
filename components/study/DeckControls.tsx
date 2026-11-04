import type { CardKindFilter, DeckFilter } from "@/lib/study/cards";
import type { Track } from "@/lib/map/types";

const KIND_OPTIONS: { value: CardKindFilter; label: string }[] = [
  { value: "all", label: "All cards" },
  { value: "definition", label: "Definitions" },
  { value: "interview", label: "Interview questions" },
];

interface DeckControlsProps {
  tracks: Track[];
  filter: DeckFilter;
  onChange: (filter: DeckFilter) => void;
}

/** Choose which track and which kind of card to study. */
export function DeckControls({ tracks, filter, onChange }: DeckControlsProps) {
  return (
    <div className="deck-controls">
      <label className="deck-controls__field">
        <span>Track</span>
        <select
          value={filter.trackId ?? ""}
          onChange={(event) => onChange({ ...filter, trackId: event.target.value || null })}
        >
          <option value="">All tracks</option>
          {tracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.name}
            </option>
          ))}
        </select>
      </label>
      <label className="deck-controls__field">
        <span>Cards</span>
        <select value={filter.kind} onChange={(event) => onChange({ ...filter, kind: event.target.value as CardKindFilter })}>
          {KIND_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
