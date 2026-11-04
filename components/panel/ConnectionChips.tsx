import type { PublishedTerm } from "@/lib/content/types";

interface ConnectionChipsProps {
  term: PublishedTerm;
  titleOf: (slug: string) => string;
  onSelect: (slug: string) => void;
}

export function ConnectionChips({ term, titleOf, onSelect }: ConnectionChipsProps) {
  const connected = [...new Set([...term.outgoingSlugs, ...term.incomingSlugs])];
  if (connected.length === 0) return null;
  return (
    <section className="panel-section">
      <h3 className="panel-section__title">Connects to</h3>
      <div className="chips">
        {connected.map((slug) => (
          <button key={slug} type="button" className="chip" onClick={() => onSelect(slug)}>
            {titleOf(slug)}
          </button>
        ))}
      </div>
    </section>
  );
}
