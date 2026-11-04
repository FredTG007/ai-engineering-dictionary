import type { Track } from "@/lib/map/types";
import type { TrackProgress } from "@/lib/progress/trackProgress";

interface TrackBadgesProps {
  tracks: Track[];
  progressOf: (trackId: string) => TrackProgress | undefined;
}

/** The lines a station sits on, with progress; more than one makes it an interchange. */
export function TrackBadges({ tracks, progressOf }: TrackBadgesProps) {
  return (
    <p className="track-badges">
      {tracks.length > 1 && <span className="track-badges__interchange">Interchange ·</span>}
      {tracks.map((track) => {
        const progress = progressOf(track.id);
        return (
          <span key={track.id} className="track-badge">
            <span className="track-badge__line" style={{ background: track.colour }} />
            {track.name}
            {progress && (
              <span className="track-badge__progress">
                {progress.learned}/{progress.total}
              </span>
            )}
          </span>
        );
      })}
    </p>
  );
}
