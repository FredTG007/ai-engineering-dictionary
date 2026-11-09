"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useSemanticSearch } from "@/hooks/useSemanticSearch";
import { hybridHits, type ResultHit } from "@/lib/search/hybridSearch";
import type { TermSearch } from "@/lib/search/termSearch";
import { SearchStatus } from "./SearchStatus";
import { useSlashShortcut } from "./useSlashShortcut";

interface SearchBoxProps {
  search: TermSearch;
  onSelect: (slug: string) => void;
}

export function SearchBox({ search, onSelect }: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const { status, start, meaningSlugs } = useSemanticSearch(query);
  const hasQuery = query.trim() !== "";
  const hits = hasQuery ? hybridHits(search, query, meaningSlugs) : [];
  useSlashShortcut(inputRef);

  useEffect(() => setActiveIndex(0), [query, meaningSlugs]);

  const choose = (hit: ResultHit) => {
    onSelect(hit.slug);
    setQuery("");
    inputRef.current?.blur();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => wrapIndex(index + (event.key === "ArrowDown" ? 1 : -1), hits.length));
    } else if (event.key === "Enter" && hits[activeIndex]) {
      choose(hits[activeIndex]);
    } else if (event.key === "Escape") {
      setQuery("");
      inputRef.current?.blur();
    }
  };

  return (
    <div className="search" role="combobox" aria-expanded={hits.length > 0} aria-haspopup="listbox">
      <input
        ref={inputRef}
        className="search__input"
        type="search"
        placeholder="Search terms…  /"
        aria-label="Search terms"
        aria-controls="search-results"
        aria-activedescendant={hits[activeIndex] ? `hit-${hits[activeIndex].slug}` : undefined}
        value={query}
        onFocus={start}
        onChange={(event) => {
          start();
          setQuery(event.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
      {hasQuery && (
        <div className="search__dropdown">
          {hits.length > 0 ? (
            <ul id="search-results" className="search__results" role="listbox">
              {hits.map((hit, index) => (
                <li
                  key={hit.slug}
                  id={`hit-${hit.slug}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  className="search__hit"
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    choose(hit);
                  }}
                >
                  <span className="search__hit-title">
                    {hit.title}
                    {hit.foundBy === "meaning" && <span className="search__meaning-tag">by meaning</span>}
                  </span>
                  <span className="search__hit-description">{hit.description}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="search__empty">No terms match “{query}”.</p>
          )}
          <SearchStatus status={status} />
        </div>
      )}
    </div>
  );
}

function wrapIndex(index: number, length: number): number {
  return length === 0 ? 0 : (index + length) % length;
}
