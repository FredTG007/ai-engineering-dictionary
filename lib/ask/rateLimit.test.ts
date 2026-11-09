import assert from "node:assert/strict";
import { test } from "node:test";
import { consumeAskQuota, rateLimitCookieName } from "./rateLimit";
import { DAILY_QUESTION_LIMIT } from "./limits";

const secret = "test-secret";

test("consumeAskQuota allows the first questions of the day then blocks", () => {
  let cookie: string | undefined;
  for (let i = 0; i < DAILY_QUESTION_LIMIT; i++) {
    const result = consumeAskQuota({ cookieHeader: cookie ? `${rateLimitCookieName()}=${cookie}` : undefined, secret });
    assert.equal(result.allowed, true);
    cookie = result.cookieValue;
  }
  const blocked = consumeAskQuota({ cookieHeader: `${rateLimitCookieName()}=${cookie}`, secret });
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.remaining, 0);
});

test("tampered cookies are treated as a fresh day", () => {
  const first = consumeAskQuota({ cookieHeader: undefined, secret });
  const tampered = first.cookieValue.replace(/\.[^.]+$/, ".deadbeef");
  const next = consumeAskQuota({ cookieHeader: `${rateLimitCookieName()}=${tampered}`, secret });
  assert.equal(next.state.count, 1);
});
