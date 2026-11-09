"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  clearProgressStorage,
  countLearnedInSnapshot,
  readProgressSnapshot,
  snapshotHasStudyHistory,
  writeProgressSnapshot,
  type ProgressSnapshot,
} from "@/lib/progress/progressSnapshot";

const UNDO_MS = 6000;

interface ClearProgressControlProps {
  learnedCount: number;
  onCleared: () => void;
  onRestored: (snapshot: ProgressSnapshot) => void;
}

/**
 * Settings-style control for wiping learned terms and study schedules, with a
 * confirmation dialog and a short Undo window. Leaves theme and sound alone.
 */
export function ClearProgressControl({ learnedCount, onCleared, onRestored }: ClearProgressControlProps) {
  const [confirming, setConfirming] = useState(false);
  const [hasStudyHistory, setHasStudyHistory] = useState(false);
  const [undo, setUndo] = useState<ProgressSnapshot | null>(null);
  const [clearedCount, setClearedCount] = useState(0);
  const titleId = useId();
  const descriptionId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const undoTimer = useRef<number | null>(null);

  useEffect(() => {
    setHasStudyHistory(snapshotHasStudyHistory(readProgressSnapshot(window.localStorage)));
  }, [learnedCount, undo]);

  const canClear = learnedCount > 0 || hasStudyHistory;

  useEffect(() => {
    if (!confirming) return;
    cancelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setConfirming(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirming]);

  useEffect(() => {
    if (!confirming) return;
    const previous = triggerRef.current;
    return () => {
      previous?.focus();
    };
  }, [confirming]);

  useEffect(() => {
    return () => {
      if (undoTimer.current !== null) window.clearTimeout(undoTimer.current);
    };
  }, []);

  if (!canClear && !undo) return null;

  const confirm = () => {
    const snapshot = readProgressSnapshot(window.localStorage);
    const n = Math.max(learnedCount, countLearnedInSnapshot(snapshot));
    clearProgressStorage(window.localStorage);
    onCleared();
    setHasStudyHistory(false);
    setConfirming(false);
    setClearedCount(n);
    setUndo(snapshot);
    if (undoTimer.current !== null) window.clearTimeout(undoTimer.current);
    undoTimer.current = window.setTimeout(() => setUndo(null), UNDO_MS);
  };

  const undoClear = () => {
    if (!undo) return;
    writeProgressSnapshot(window.localStorage, undo);
    onRestored(undo);
    setHasStudyHistory(snapshotHasStudyHistory(undo));
    setUndo(null);
    if (undoTimer.current !== null) window.clearTimeout(undoTimer.current);
  };

  return (
    <div className="clear-progress">
      {canClear && (
        <button
          ref={triggerRef}
          type="button"
          className="clear-progress__trigger"
          onClick={() => setConfirming(true)}
          aria-haspopup="dialog"
        >
          Clear my progress
        </button>
      )}

      {confirming && (
        <Modal titleId={titleId} descriptionId={descriptionId} onDismiss={() => setConfirming(false)}>
          <h2 id={titleId} className="clear-progress__title">
            Clear progress?
          </h2>
          <p id={descriptionId} className="clear-progress__body">
            {confirmMessage(learnedCount, hasStudyHistory)}
          </p>
          <div className="clear-progress__actions">
            <button ref={cancelRef} type="button" className="ink-button ink-button--label" onClick={() => setConfirming(false)}>
              Cancel
            </button>
            <button type="button" className="ink-button ink-button--label ink-button--danger" onClick={confirm}>
              Continue
            </button>
          </div>
        </Modal>
      )}

      {undo && (
        <div className="clear-progress__toast" role="status" aria-live="polite">
          <span>{clearedCount > 0 ? `Cleared ${clearedCount} term${clearedCount === 1 ? "" : "s"}.` : "Cleared your study history."}</span>
          <button type="button" className="clear-progress__undo" onClick={undoClear}>
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

function confirmMessage(learnedCount: number, studyPresent: boolean): string {
  if (learnedCount > 0) {
    const base = `This will clear the ${learnedCount} term${learnedCount === 1 ? "" : "s"} you've visited. Continue?`;
    return studyPresent ? `${base} Your study review history will be cleared too.` : base;
  }
  return "This will clear your study review history. Continue?";
}

function Modal({
  titleId,
  descriptionId,
  onDismiss,
  children,
}: {
  titleId: string;
  descriptionId: string;
  onDismiss: () => void;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = dialogRef.current;
    if (!root) return;
    const focusable = () =>
      Array.from(root.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(
        (el) => !el.hasAttribute("disabled"),
      );
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    root.addEventListener("keydown", onKeyDown);
    return () => root.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="clear-progress__backdrop" onClick={onDismiss}>
      <div
        ref={dialogRef}
        className="clear-progress__dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
