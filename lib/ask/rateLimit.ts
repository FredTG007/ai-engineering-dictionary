import { createHmac, timingSafeEqual } from "node:crypto";
import { DAILY_QUESTION_LIMIT } from "./limits";

export interface RateLimitState {
  day: string; // YYYY-MM-DD UTC
  count: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  state: RateLimitState;
  cookieValue: string;
}

const COOKIE_NAME = "aied_ask";

export function rateLimitCookieName(): string {
  return COOKIE_NAME;
}

/** Pure-ish: decide whether another question is allowed and mint the next cookie. */
export function consumeAskQuota(options: {
  cookieHeader: string | undefined;
  secret: string;
  now?: Date;
}): RateLimitResult {
  const now = options.now ?? new Date();
  const day = utcDay(now);
  const previous = readState(options.cookieHeader, options.secret, day);
  const count = previous.day === day ? previous.count : 0;
  if (count >= DAILY_QUESTION_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      state: { day, count },
      cookieValue: signState({ day, count }, options.secret),
    };
  }
  const next = { day, count: count + 1 };
  return {
    allowed: true,
    remaining: DAILY_QUESTION_LIMIT - next.count,
    state: next,
    cookieValue: signState(next, options.secret),
  };
}

function utcDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function readState(cookieHeader: string | undefined, secret: string, today: string): RateLimitState {
  const raw = parseCookie(cookieHeader)[COOKIE_NAME];
  if (!raw) return { day: today, count: 0 };
  const verified = verifyState(raw, secret);
  return verified ?? { day: today, count: 0 };
}

function parseCookie(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(";").map((part) => {
      const [key, ...rest] = part.trim().split("=");
      return [key, decodeURIComponent(rest.join("="))];
    }),
  );
}

function signState(state: RateLimitState, secret: string): string {
  const payload = `${state.day}.${state.count}`;
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verifyState(value: string, secret: string): RateLimitState | null {
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [day, countRaw, sig] = parts;
  const count = Number(countRaw);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !Number.isInteger(count) || count < 0) return null;
  const expected = createHmac("sha256", secret).update(`${day}.${count}`).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return { day, count };
}
