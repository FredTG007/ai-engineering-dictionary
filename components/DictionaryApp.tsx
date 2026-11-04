"use client";

import { useCallback, useMemo, useState } from "react";
import { useLearnedTerms } from "@/hooks/useLearnedTerms";
import { usePalette } from "@/hooks/usePalette";
import { useTermSelection } from "@/hooks/useTermSelection";
import { useUiSound } from "@/hooks/useUiSound";
import { progressByTrack } from "@/lib/progress/trackProgress";
import { createTermSearch } from "@/lib/search/termSearch";
import type { SiteData } from "@/lib/siteData";
import { Footer } from "./chrome/Footer";
import { Header } from "./chrome/Header";
import { PaletteSwitcher } from "./chrome/PaletteSwitcher";
import { SoundToggle } from "./chrome/SoundToggle";
import { SubwayMapView } from "./map/SubwayMapView";
import { TermPanel } from "./panel/TermPanel";
import { WelcomeCard } from "./panel/WelcomeCard";
import { SearchBox } from "./search/SearchBox";
import { LinesCard } from "./tracks/LinesCard";
import { TrackProgressList } from "./tracks/TrackProgressList";

export function DictionaryApp({ terms, tracks, map }: SiteData) {
  const termsBySlug = useMemo(() => new Map(terms.map((term) => [term.slug, term])), [terms]);
  const tracksById = useMemo(() => new Map(tracks.map((track) => [track.id, track])), [tracks]);
  const orderedSlugs = useMemo(() => terms.map((term) => term.slug), [terms]);
  const search = useMemo(() => createTermSearch(terms), [terms]);
  const isKnownSlug = useCallback((slug: string) => termsBySlug.has(slug), [termsBySlug]);
  const titleOf = useCallback((slug: string) => termsBySlug.get(slug)?.title ?? slug, [termsBySlug]);
  const colourOf = useCallback((trackId: string) => tracksById.get(trackId)?.colour ?? "currentColor", [tracksById]);

  const { selectedSlug, selectTerm } = useTermSelection(isKnownSlug);
  const { palette, setPaletteId } = usePalette();
  const { muted, toggleMuted, play } = useUiSound();
  const { learned, toggleLearned } = useLearnedTerms(isKnownSlug);
  const [focusedTrackId, setFocusedTrackId] = useState<string | null>(null);
  const progress = useMemo(() => progressByTrack(tracks, learned), [tracks, learned]);
  const progressById = useMemo(() => new Map(progress.map((entry) => [entry.trackId, entry])), [progress]);

  const selectWithSound = useCallback(
    (slug: string) => {
      play("select");
      selectTerm(slug);
    },
    [play, selectTerm],
  );

  const hoverWithSound = useCallback((slug: string | null) => slug && play("hover"), [play]);

  const selectedTerm = selectedSlug ? termsBySlug.get(selectedSlug) : undefined;
  const linesList = (
    <TrackProgressList
      tracks={tracks}
      progress={progress}
      focusedTrackId={focusedTrackId}
      onFocusTrack={setFocusedTrackId}
      onContinue={selectWithSound}
    />
  );

  return (
    <div className="app" data-panel-open={Boolean(selectedTerm)}>
      <SubwayMapView
        map={map}
        startSlug={orderedSlugs[0]}
        colourOf={colourOf}
        selectedSlug={selectedSlug}
        learned={learned}
        focusedTrackId={focusedTrackId}
        onSelect={selectWithSound}
        onHover={hoverWithSound}
      />
      <Header>
        <SearchBox search={search} onSelect={selectWithSound} />
        <PaletteSwitcher activeId={palette.id} onChange={setPaletteId} />
        <SoundToggle muted={muted} onToggle={toggleMuted} />
      </Header>
      {selectedTerm ? (
        <>
          <LinesCard learnedCount={learned.size} total={terms.length}>
            {linesList}
          </LinesCard>
          <TermPanel
            key={selectedTerm.slug}
            term={selectedTerm}
            tracks={selectedTerm.trackIds.flatMap((id) => tracksById.get(id) ?? [])}
            progressOf={(trackId) => progressById.get(trackId)}
            orderedSlugs={orderedSlugs}
            learned={learned.has(selectedTerm.slug)}
            titleOf={titleOf}
            onToggleLearned={() => toggleLearned(selectedTerm.slug)}
            onSelect={selectWithSound}
            onClose={() => selectTerm(null)}
            onExpand={() => play("open")}
          />
        </>
      ) : (
        <WelcomeCard
          termCount={terms.length}
          trackCount={tracks.length}
          learnedCount={learned.size}
          firstSlug={orderedSlugs[0]}
          firstTitle={titleOf(orderedSlugs[0])}
          onStart={selectWithSound}
          lines={linesList}
          footer={<Footer />}
        />
      )}
    </div>
  );
}
