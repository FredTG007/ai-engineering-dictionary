"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { usePalette } from "@/hooks/usePalette";
import { useTermSelection } from "@/hooks/useTermSelection";
import { useUiSound } from "@/hooks/useUiSound";
import { createTermSearch } from "@/lib/search/termSearch";
import type { SiteData } from "@/lib/siteData";
import { Footer } from "./chrome/Footer";
import { Header } from "./chrome/Header";
import { PaletteSwitcher } from "./chrome/PaletteSwitcher";
import { SoundToggle } from "./chrome/SoundToggle";
import { TermPanel } from "./panel/TermPanel";
import { WelcomeCard } from "./panel/WelcomeCard";
import { SearchBox } from "./search/SearchBox";

const TermGraphScene = dynamic(() => import("./graph/TermGraphScene").then((module) => module.TermGraphScene), {
  ssr: false,
  loading: () => <div className="graph-loading">Laying out the graph…</div>,
});

export function DictionaryApp({ terms, graph }: SiteData) {
  const termsBySlug = useMemo(() => new Map(terms.map((term) => [term.slug, term])), [terms]);
  const orderedSlugs = useMemo(() => terms.map((term) => term.slug), [terms]);
  const search = useMemo(() => createTermSearch(terms), [terms]);
  const isKnownSlug = useCallback((slug: string) => termsBySlug.has(slug), [termsBySlug]);
  const titleOf = useCallback((slug: string) => termsBySlug.get(slug)?.title ?? slug, [termsBySlug]);

  const { selectedSlug, selectTerm } = useTermSelection(isKnownSlug);
  const { palette, setPaletteId } = usePalette();
  const { muted, toggleMuted, play } = useUiSound();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const selectWithSound = useCallback(
    (slug: string) => {
      play("select");
      selectTerm(slug);
    },
    [play, selectTerm],
  );

  const hoverWithSound = useCallback(
    (slug: string | null) => {
      if (slug) play("hover");
      setHoveredSlug(slug);
    },
    [play],
  );

  const selectedTerm = selectedSlug ? termsBySlug.get(selectedSlug) : undefined;

  return (
    <div className="app" data-panel-open={Boolean(selectedTerm)}>
      <div className="graph">
        <TermGraphScene
          graph={graph}
          colors={palette.colors}
          selectedSlug={selectedSlug}
          hoveredSlug={hoveredSlug}
          onHover={hoverWithSound}
          onSelect={selectWithSound}
        />
      </div>
      <Header>
        <SearchBox search={search} onSelect={selectWithSound} />
        <PaletteSwitcher activeId={palette.id} onChange={setPaletteId} />
        <SoundToggle muted={muted} onToggle={toggleMuted} />
      </Header>
      {selectedTerm ? (
        <TermPanel
          key={selectedTerm.slug}
          term={selectedTerm}
          orderedSlugs={orderedSlugs}
          titleOf={titleOf}
          onSelect={selectWithSound}
          onClose={() => selectTerm(null)}
          onExpand={() => play("open")}
        />
      ) : (
        <WelcomeCard
          termCount={terms.length}
          firstSlug={orderedSlugs[0]}
          firstTitle={titleOf(orderedSlugs[0])}
          onStart={selectWithSound}
        />
      )}
      <Footer />
    </div>
  );
}
