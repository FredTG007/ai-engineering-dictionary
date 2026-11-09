import assert from "node:assert/strict";
import { test } from "node:test";
import {
  clearProgressStorage,
  countLearnedInSnapshot,
  readProgressSnapshot,
  snapshotHasStudyHistory,
  writeProgressSnapshot,
} from "./progressSnapshot";
import { LEARNED_STORAGE_KEY, STUDY_STORAGE_KEY } from "./storageKeys";

function memoryStorage(initial: Record<string, string> = {}): Storage {
  const data = { ...initial };
  return {
    get length() {
      return Object.keys(data).length;
    },
    clear() {
      for (const key of Object.keys(data)) delete data[key];
    },
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
    },
    key() {
      return null;
    },
    removeItem(key: string) {
      delete data[key];
    },
    setItem(key: string, value: string) {
      data[key] = String(value);
    },
  } as Storage;
}

test("read/write/clear round-trip keeps only progress keys", () => {
  const storage = memoryStorage({
    [LEARNED_STORAGE_KEY]: '["rag","agent"]',
    [STUDY_STORAGE_KEY]: '{"rag:term":{"due":1}}',
    "aied:palette": "night",
    "aied:sound": "on",
  });
  const snapshot = readProgressSnapshot(storage);
  assert.equal(countLearnedInSnapshot(snapshot), 2);
  assert.equal(snapshotHasStudyHistory(snapshot), true);

  clearProgressStorage(storage);
  assert.equal(storage.getItem(LEARNED_STORAGE_KEY), null);
  assert.equal(storage.getItem(STUDY_STORAGE_KEY), null);
  assert.equal(storage.getItem("aied:palette"), "night");
  assert.equal(storage.getItem("aied:sound"), "on");

  writeProgressSnapshot(storage, snapshot);
  assert.equal(storage.getItem(LEARNED_STORAGE_KEY), '["rag","agent"]');
  assert.equal(storage.getItem(STUDY_STORAGE_KEY), '{"rag:term":{"due":1}}');
});

test("empty or invalid learned JSON counts as zero", () => {
  assert.equal(countLearnedInSnapshot({ learnedJson: null, studyJson: null }), 0);
  assert.equal(countLearnedInSnapshot({ learnedJson: "{", studyJson: null }), 0);
  assert.equal(snapshotHasStudyHistory({ learnedJson: null, studyJson: "{}" }), false);
});
