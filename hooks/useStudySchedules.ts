"use client";

import { useCallback, useEffect, useState } from "react";
import { review, type Grade } from "@/lib/study/sm2";
import { parseSchedules, type Schedules } from "@/lib/study/studyQueue";

const STORAGE_KEY = "aied:study:v1";

/** SM-2 review state for every studied card, persisted in localStorage. */
export function useStudySchedules(isKnownCard: (id: string) => boolean) {
  const [schedules, setSchedules] = useState<Schedules>({});

  useEffect(() => {
    setSchedules(parseSchedules(window.localStorage.getItem(STORAGE_KEY), isKnownCard));
  }, [isKnownCard]);

  const grade = useCallback((cardId: string, answer: Grade) => {
    setSchedules((current) => {
      const next = { ...current, [cardId]: review(current[cardId], answer, Date.now()) };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { schedules, grade };
}
