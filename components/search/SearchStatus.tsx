import type { SemanticStatus } from "@/hooks/useSemanticSearch";

/** One quiet line under the results saying whether search by meaning is helping yet. */
export function SearchStatus({ status }: { status: SemanticStatus }) {
  const text = statusText(status);
  if (!text) return null;
  return (
    <p className={`search__status search__status--${status.kind}`} role="status">
      {text}
    </p>
  );
}

function statusText(status: SemanticStatus): string | null {
  switch (status.kind) {
    case "idle":
      return null;
    case "loading":
      return "Loading search by meaning…";
    case "ready":
      return "Searching by meaning too";
    case "unavailable":
      return "Keyword search only: search by meaning didn’t load";
  }
}
