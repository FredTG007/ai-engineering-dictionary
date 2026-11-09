"use client";

import { useCallback, useMemo, useState } from "react";
import { useLearnedTerms } from "@/hooks/useLearnedTerms";
import { usePalette } from "@/hooks/usePalette";
import { useTermSelection } from "@/hooks/useTermSelection";
import { useUiSound } from "@/hooks/useUiSound";
import { useView } from "@/hooks/useView";
import { audioUrl } from "@/lib/audio/audioManifest";
import { parseLearnedSlugs, progressByTrack } from "@/lib/progress/trackProgress";
import type { ProgressSnapshot } from "@/lib/progress/progressSnapshot";
import { createTermSearch } from "@/lib/search/termSearch";
import type { SiteData } from "@/lib/siteData";
import { Footer } from "./chrome/Footer";
import { Header } from "./chrome/Header";
import { PaletteSwitcher } from "./chrome/PaletteSwitcher";
import { SoundToggle } from "./chrome/SoundToggle";
import { ViewToggle } from "./chrome/ViewToggle";
import { SubwayMapView } from "./map/SubwayMapView";
import { TermPanel } from "./panel/TermPanel";
import { WelcomeCard } from "./panel/WelcomeCard";
import { AskView } from "./ask/AskView";
import { ClearProgressControl } from "./progress/ClearProgressControl";
import { SearchBox } from "./search/SearchBox";
import { StudyView } from "./study/StudyView";
import { LinesCard } from "./tracks/LinesCard";
import { TrackProgressList } from "./tracks/TrackProgressList";

export function DictionaryApp({ terms, tracks, map, audioSlugs }: SiteData) {
  const termsBySlug = useMemo(() => new Map(terms.map((term) => [term.slug, term])), [terms]);
  const tracksById = useMemo(() => new Map(tracks.map((track) => [track.id, track])), [tracks]);
  const orderedSlugs = useMemo(() => terms.map((term) => term.slug), [terms]);
  const narrated = useMemo(() => new Set(audioSlugs), [audioSlugs]);
  const search = useMemo(() => createTermSearch(terms), [terms]);
  const isKnownSlug = useCallback((slug: string) => termsBySlug.has(slug), [termsBySlug]);
  const titleOf = useCallback((slug: string) => termsBySlug.get(slug)?.title ?? slug, [termsBySlug]);
  const colourOf = useCallback((trackId: string) => tracksById.get(trackId)?.colour ?? "currentColor", [tracksById]);

  const { selectedSlug, selectTerm } = useTermSelection(isKnownSlug);
  const { view, setView } = useView();
  const { palette, setPaletteId } = usePalette();
  const { muted, toggleMuted, play } = useUiSound();
  const { learned, toggleLearned, clearLearned, restoreLearned } = useLearnedTerms(isKnownSlug);
  const [focusedTrackId, setFocusedTrackId] = useState<string | null>(null);
  const [resetEpoch, setResetEpoch] = useState(0);
  const [searchEpoch, setSearchEpoch] = useState(0);
  const progress = useMemo(() => progressByTrack(tracks, learned), [tracks, learned]);
  const progressById = useMemo(() => new Map(progress.map((entry) => [entry.trackId, entry])), [progress]);

  const selectWithSound = useCallback(
    (slug: string) => {
      play("select");
      selectTerm(slug);
    },
    [play, selectTerm],
  );

  const openOnMap = useCallback(
    (slug: string) => {
      setView("map");
      selectWithSound(slug);
    },
    [setView, selectWithSound],
  );

  const hoverWithSound = useCallback((slug: string | null) => slug && play("hover"), [play]);

  const resetView = useCallback(() => {
    setView("map");
    selectTerm(null);
    setFocusedTrackId(null);
    setSearchEpoch((epoch) => epoch + 1);
    setResetEpoch((epoch) => epoch + 1);
  }, [setView, selectTerm]);

  const restoreProgress = useCallback(
    (snapshot: ProgressSnapshot) => {
      restoreLearned(new Set(parseLearnedSlugs(snapshot.learnedJson, isKnownSlug)));
    },
    [restoreLearned, isKnownSlug],
  );

  const progressActions = (
    <ClearProgressControl learnedCount={learned.size} onCleared={clearLearned} onRestored={restoreProgress} />
  );

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

  const header = (
    <Header>
      <SearchBox key={searchEpoch} search={search} onSelect={openOnMap} />
      <ViewToggle view={view} onChange={setView} />
      <PaletteSwitcher activeId={palette.id} onChange={setPaletteId} />
      <SoundToggle muted={muted} onToggle={toggleMuted} />
    </Header>
  );

  if (view === "study") {
    return (
      <div className="app" data-view="study">
        {header}
        <StudyView terms={terms} tracks={tracks} onOpenTerm={openOnMap} />
      </div>
    );
  }

  if (view === "ask") {
    return (
      <div className="app" data-view="ask">
        {header}
        <AskView search={search} titleOf={titleOf} onOpenTerm={openOnMap} />
      </div>
    );
  }

  return (
    <div className="app" data-view="map" data-panel-open="true">
      <SubwayMapView
        map={map}
        startSlug={orderedSlugs[0]}
        colourOf={colourOf}
        selectedSlug={selectedSlug}
        learned={learned}
        focusedTrackId={focusedTrackId}
        resetEpoch={resetEpoch}
        onSelect={selectWithSound}
        onHover={hoverWithSound}
        onResetView={resetView}
      />
      {header}
      {selectedTerm ? (
        <>
          <LinesCard learnedCount={learned.size} total={terms.length} progressActions={progressActions}>
            {linesList}
          </LinesCard>
          <TermPanel
            key={selectedTerm.slug}
            term={selectedTerm}
            tracks={selectedTerm.trackIds.flatMap((id) => tracksById.get(id) ?? [])}
            progressOf={(trackId) => progressById.get(trackId)}
            orderedSlugs={orderedSlugs}
            learned={learned.has(selectedTerm.slug)}
            audioSrc={narrated.has(selectedTerm.slug) ? audioUrl(selectedTerm.slug) : null}
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
          progressActions={progressActions}
          footer={<Footer />}
        />
      )}
    </div>
  );
}
