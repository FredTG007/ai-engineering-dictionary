import type { View } from "@/hooks/useView";

/** Switches between the subway map and the flashcard study view. */
export function ViewToggle({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  const studying = view === "study";
  return (
    <button
      type="button"
      className="view-toggle"
      aria-pressed={studying}
      title={studying ? "Back to the map" : "Study with flashcards"}
      onClick={() => onChange(studying ? "map" : "study")}
    >
      {studying ? "← Map" : "Study"}
    </button>
  );
}
