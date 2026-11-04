interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
}

export function ZoomControls({ onZoomIn, onZoomOut, onFit }: ZoomControlsProps) {
  return (
    <div className="zoom-controls" role="group" aria-label="Map zoom">
      <button type="button" className="ink-button" onClick={onZoomIn} aria-label="Zoom in">
        +
      </button>
      <button type="button" className="ink-button" onClick={onZoomOut} aria-label="Zoom out">
        −
      </button>
      <button type="button" className="ink-button" onClick={onFit} aria-label="Show the whole map" title="Show the whole map">
        ⤢
      </button>
    </div>
  );
}
