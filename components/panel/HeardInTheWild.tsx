export function HeardInTheWild({ quotes }: { quotes: string[] }) {
  if (quotes.length === 0) return null;
  return (
    <section className="panel-section">
      <h3 className="panel-section__title">Heard in the wild</h3>
      <ul className="quotes">
        {quotes.map((quote) => (
          <li key={quote} className="quote">
            “{quote}”
          </li>
        ))}
      </ul>
    </section>
  );
}
