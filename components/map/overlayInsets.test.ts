import assert from "node:assert/strict";
import { test } from "node:test";
import { minFitScale } from "./overlayInsets";

test("desktop may fit the whole map at a small scale, a phone keeps text readable", () => {
  assert.ok(minFitScale({ width: 1280, height: 720 }) < minFitScale({ width: 390, height: 844 }));
});
