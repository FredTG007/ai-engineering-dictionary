"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * State mirrored to localStorage. Starts with `fallback` so server and first
 * client render match, then adopts the stored value after mount.
 */
export function useStoredPreference<T extends string>(
  key: string,
  fallback: T,
  isValid: (value: string) => value is T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    const stored = window.localStorage.getItem(key);
    if (stored !== null && isValid(stored)) setValue(stored);
  }, [key, isValid]);

  const update = useCallback(
    (next: T) => {
      setValue(next);
      window.localStorage.setItem(key, next);
    },
    [key],
  );

  return [value, update];
}
