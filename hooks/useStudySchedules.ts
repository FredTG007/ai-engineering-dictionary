"use client";

import { useCallback, useEffect, useState } from "react";
import { STUDY_STORAGE_KEY } from "@/lib/progress/storageKeys";
import { review, type Grade } from "@/lib/study/sm2";
import { parseSchedules, type Schedules } from "@/lib/study/studyQueue";

/** SM-2 review state for every studied card, persisted in localStorage. */
export function useStudySchedules(isKnownCard: (id: string) => boolean) {
  const [schedules, setSchedules] = useState<Schedules>({});

  useEffect(() => {
    setSchedules(parseSchedules(window.localStorage.getItem(STUDY_STORAGE_KEY), isKnownCard));
  }, [isKnownCard]);

  const grade = useCallback((cardId: string, answer: Grade) => {
    setSchedules((current) => {
      const next = { ...current, [cardId]: review(current[cardId], answer, Date.now()) };
      window.localStorage.setItem(STUDY_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearSchedules = useCallback(() => {
    setSchedules({});
    window.localStorage.removeItem(STUDY_STORAGE_KEY);
  }, []);

  const restoreSchedules = useCallback((next: Schedules) => {
    setSchedules(next);
    if (Object.keys(next).length === 0) window.localStorage.removeItem(STUDY_STORAGE_KEY);
    else window.localStorage.setItem(STUDY_STORAGE_KEY, JSON.stringify(next));
  }, []);

  return { schedules, grade, clearSchedules, restoreSchedules };
}
