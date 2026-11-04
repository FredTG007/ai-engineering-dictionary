interface LearnedToggleProps {
  learned: boolean;
  onToggle: () => void;
}

export function LearnedToggle({ learned, onToggle }: LearnedToggleProps) {
  return (
    <button type="button" className="learned-toggle" role="checkbox" aria-checked={learned} onClick={onToggle}>
      <svg className="learned-toggle__box" viewBox="0 0 22 22" aria-hidden="true">
        <path className="learned-toggle__frame" d="M3,4 L19,3.4 L18.6,19 L3.4,18.6 Z" />
        {learned && <path className="learned-toggle__tick" d="M5.5,11.5 L9.5,16 L19.5,3" />}
      </svg>
      {learned ? "Learned" : "Mark as learned"}
    </button>
  );
}
