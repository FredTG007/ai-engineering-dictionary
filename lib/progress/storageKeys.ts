/** localStorage keys for reader progress. Theme and sound prefs live elsewhere. */
export const LEARNED_STORAGE_KEY = "aied:learned";
export const STUDY_STORAGE_KEY = "aied:study:v1";

export const PROGRESS_STORAGE_KEYS = [LEARNED_STORAGE_KEY, STUDY_STORAGE_KEY] as const;
