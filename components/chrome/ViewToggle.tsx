import type { View } from "@/hooks/useView";

const OPTIONS: Array<{ id: View; label: string }> = [
  { id: "map", label: "Map" },
  { id: "study", label: "Study" },
  { id: "ask", label: "Ask" },
];

/** Switches between the subway map, flashcards and Ask the dictionary. */
export function ViewToggle({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  return (
    <div className="view-toggle" role="group" aria-label="View">
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          className="view-toggle__btn"
          aria-pressed={view === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
