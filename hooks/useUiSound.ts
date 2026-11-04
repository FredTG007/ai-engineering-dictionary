"use client";

import { useCallback } from "react";
import { playUiSound, type UiSound } from "@/lib/sound/uiSounds";
import { useStoredPreference } from "./useStoredPreference";

type SoundSetting = "on" | "off";
const isSoundSetting = (value: string): value is SoundSetting => value === "on" || value === "off";

/** UI sound effects, muted by default; the choice is persisted. */
export function useUiSound() {
  const [setting, setSetting] = useStoredPreference<SoundSetting>("aied:sound", "off", isSoundSetting);
  const muted = setting === "off";

  const play = useCallback((sound: UiSound) => {
    if (!muted) playUiSound(sound);
  }, [muted]);

  const toggleMuted = useCallback(() => setSetting(muted ? "on" : "off"), [muted, setSetting]);

  return { muted, toggleMuted, play };
}
