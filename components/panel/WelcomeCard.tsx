interface WelcomeCardProps {
  termCount: number;
  firstSlug: string;
  firstTitle: string;
  onStart: (slug: string) => void;
}

export function WelcomeCard({ termCount, firstSlug, firstTitle, onStart }: WelcomeCardProps) {
  return (
    <aside className="panel panel--welcome" aria-label="Welcome">
      <div className="panel__scroll">
        <p className="panel__eyebrow">{termCount} terms, one map</p>
        <h2 className="panel__title">Learn the vocabulary of shipping LLM systems.</h2>
        <p className="panel__description">
          Every sphere is a term; every line is a link between two definitions. Drag to orbit, scroll to zoom, click a
          node to read it — or press <kbd>/</kbd> to search.
        </p>
        <button type="button" className="read-more" onClick={() => onStart(firstSlug)}>
          Start with {firstTitle} →
        </button>
      </div>
    </aside>
  );
}
