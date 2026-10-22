// Thin wrapper around GA4's gtag. Every event goes through track() so we can
// guarantee nothing email-shaped is ever sent to analytics.

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const rawId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
export const GA_MEASUREMENT_ID = /^G-[A-Z0-9]+$/.test(rawId) ? rawId : "";

const EMAIL_LIKE = /[^\s@]+@[^\s@]+\.[^\s@]+/;

export function track(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  const safe: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (typeof value === "string" && EMAIL_LIKE.test(value)) continue;
    safe[key] = value;
  }

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, safe);
  }
  window.gtag?.("event", event, safe);
}
