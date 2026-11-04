"use client";

import { useEffect } from "react";
import { GRADES, type Grade } from "@/lib/study/sm2";

interface StudyShortcuts {
  flipped: boolean;
  onFlip: () => void;
  onGrade: (grade: Grade) => void;
}

/** Space (or Enter) flips the card; 1–4 grade it once it is flipped. */
export function useStudyShortcuts({ flipped, onFlip, onGrade }: StudyShortcuts) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === " " || (event.key === "Enter" && !flipped)) {
        event.preventDefault();
        if (!flipped) onFlip();
        return;
      }
      const grade = GRADES[Number(event.key) - 1];
      if (flipped && grade) {
        event.preventDefault();
        onGrade(grade);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [flipped, onFlip, onGrade]);
}

function isTypingTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName));
}
