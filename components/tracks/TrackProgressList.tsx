import type { Track } from "@/lib/map/types";
import type { TrackProgress } from "@/lib/progress/trackProgress";
import { RoughProgressBar } from "../sketch/RoughProgressBar";

interface TrackProgressListProps {
  tracks: Track[];
  progress: TrackProgress[];
  focusedTrackId: string | null;
  onFocusTrack: (trackId: string | null) => void;
  onContinue: (slug: string) => void;
}

/** The map legend, doubling as a progress report for each line. */
export function TrackProgressList({ tracks, progress, focusedTrackId, onFocusTrack, onContinue }: TrackProgressListProps) {
  const progressOf = new Map(progress.map((entry) => [entry.trackId, entry]));
  return (
    <ul className="track-list">
      {tracks.map((track) => {
        const { learned, total, nextSlug } = progressOf.get(track.id) ?? { learned: 0, total: track.slugs.length, nextSlug: null };
        const focused = track.id === focusedTrackId;
        return (
          <li key={track.id} className="track-list__item" data-focused={focused}>
            <button
              type="button"
              className="track-list__name"
              aria-pressed={focused}
              title={focused ? "Show all lines" : `Highlight the ${track.name} line`}
              onClick={() => onFocusTrack(focused ? null : track.id)}
            >
              <span className="track-list__swatch" style={{ background: track.colour }} />
              {track.name}
            </button>
            <span className="track-list__count">
              {learned}/{total}
            </span>
            <RoughProgressBar ratio={learned / total} colour={track.colour} seed={track.id} label={`${learned} of ${total} learned`} />
            {nextSlug ? (
              <button type="button" className="track-list__continue" onClick={() => onContinue(nextSlug)}>
                {learned === 0 ? "start" : "continue"} →
              </button>
            ) : (
              <span className="track-list__done">done ✓</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
