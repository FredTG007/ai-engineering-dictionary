import { LEARNED_STORAGE_KEY, STUDY_STORAGE_KEY } from "./storageKeys";

export interface ProgressSnapshot {
  learnedJson: string | null;
  studyJson: string | null;
}

/** Pure: copy the progress keys currently in storage (or null when absent). */
export function readProgressSnapshot(storage: Pick<Storage, "getItem">): ProgressSnapshot {
  return {
    learnedJson: storage.getItem(LEARNED_STORAGE_KEY),
    studyJson: storage.getItem(STUDY_STORAGE_KEY),
  };
}

/** Pure: write a snapshot back; removes a key when its value is null. */
export function writeProgressSnapshot(storage: Pick<Storage, "setItem" | "removeItem">, snapshot: ProgressSnapshot): void {
  writeKey(storage, LEARNED_STORAGE_KEY, snapshot.learnedJson);
  writeKey(storage, STUDY_STORAGE_KEY, snapshot.studyJson);
}

/** Pure: wipe only progress keys. */
export function clearProgressStorage(storage: Pick<Storage, "removeItem">): void {
  storage.removeItem(LEARNED_STORAGE_KEY);
  storage.removeItem(STUDY_STORAGE_KEY);
}

/** Pure: how many learned terms a stored JSON array represents. */
export function countLearnedInSnapshot(snapshot: ProgressSnapshot): number {
  if (!snapshot.learnedJson) return 0;
  try {
    const parsed: unknown = JSON.parse(snapshot.learnedJson);
    return Array.isArray(parsed) ? parsed.filter((slug) => typeof slug === "string").length : 0;
  } catch {
    return 0;
  }
}

/** Pure: whether study schedules JSON holds at least one card. */
export function snapshotHasStudyHistory(snapshot: ProgressSnapshot): boolean {
  if (!snapshot.studyJson) return false;
  try {
    const parsed: unknown = JSON.parse(snapshot.studyJson);
    return Boolean(parsed && typeof parsed === "object" && !Array.isArray(parsed) && Object.keys(parsed).length > 0);
  } catch {
    return false;
  }
}

function writeKey(storage: Pick<Storage, "setItem" | "removeItem">, key: string, value: string | null): void {
  if (value === null) storage.removeItem(key);
  else storage.setItem(key, value);
}
