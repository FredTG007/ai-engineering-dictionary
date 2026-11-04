"use client";

import { useNarration, type NarrationStatus } from "@/hooks/useNarration";

const LABELS: Record<NarrationStatus, string> = {
  idle: "Listen",
  loading: "Loading…",
  playing: "Pause",
  unavailable: "Audio unavailable",
};

/** "Listen" for terms with recorded narration; a disabled placeholder for the rest. */
export function ListenButton({ src }: { src: string | null }) {
  if (!src) {
    return (
      <button type="button" className="listen-button" disabled title="Audio coming soon">
        <SpeakerIcon /> Audio coming soon
      </button>
    );
  }
  return <NarrationButton src={src} />;
}

function NarrationButton({ src }: { src: string }) {
  const { status, toggle } = useNarration(src);
  return (
    <button
      type="button"
      className="listen-button"
      aria-pressed={status === "playing"}
      disabled={status === "unavailable"}
      onClick={toggle}
    >
      <SpeakerIcon /> {LABELS[status]}
    </button>
  );
}

function SpeakerIcon() {
  return (
    <svg className="listen-button__icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3,7.5 L7,7.2 L11.5,3.5 L11.2,16.5 L7,12.8 L3.2,12.6 Z" />
      <path className="listen-button__wave" d="M14,7 Q16,10 14,13" />
    </svg>
  );
}
