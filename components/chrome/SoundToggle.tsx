interface SoundToggleProps {
  muted: boolean;
  onToggle: () => void;
}

export function SoundToggle({ muted, onToggle }: SoundToggleProps) {
  return (
    <button
      type="button"
      className="ink-button"
      aria-pressed={!muted}
      aria-label={muted ? "Turn sounds on" : "Mute sounds"}
      title={muted ? "Sounds off" : "Sounds on"}
      onClick={onToggle}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
