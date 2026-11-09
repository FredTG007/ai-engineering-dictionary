interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onResetView: () => void;
}

export function ZoomControls({ onZoomIn, onZoomOut, onFit, onResetView }: ZoomControlsProps) {
  return (
    <div className="zoom-controls" role="group" aria-label="Map controls">
      <button type="button" className="ink-button" onClick={onZoomIn} aria-label="Zoom in">
        +
      </button>
      <button type="button" className="ink-button" onClick={onZoomOut} aria-label="Zoom out">
        −
      </button>
      <button type="button" className="ink-button" onClick={onFit} aria-label="Show the whole map" title="Show the whole map">
        ⤢
      </button>
      <button
        type="button"
        className="ink-button ink-button--label"
        onClick={onResetView}
        aria-label="Reset view"
        title="Reset view"
      >
        Reset view
      </button>
    </div>
  );
}
