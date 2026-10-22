// Captures UTM parameters and the external referrer on landing, keeps them for
// the browser session, and hands them to the sign-up form as hidden fields.

const STORAGE_KEY = "rustos:attribution";

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

type UtmKey = (typeof UTM_KEYS)[number];
export type Attribution = Partial<Record<UtmKey | "referrer" | "landing_page", string>>;

function read(): Attribution | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

function externalReferrer(): string {
  if (!document.referrer) return "";
  try {
    const ref = new URL(document.referrer);
    if (ref.origin === window.location.origin) return "";
    // Drop the query string: referrer URLs can carry personal data.
    return ref.origin + ref.pathname;
  } catch {
    return "";
  }
}

export function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Attribution = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) fromUrl[key] = value.slice(0, 200);
  }

  const existing = read();
  // Keep the first touch of the session unless a new campaign link was opened.
  if (existing && Object.keys(fromUrl).length === 0) return;

  const next: Attribution = {
    ...fromUrl,
    referrer: externalReferrer() || existing?.referrer || "(direct)",
    landing_page: window.location.pathname,
  };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage blocked (private mode etc.) — getAttribution() falls back to the live URL.
  }
}

export function getAttribution(): Attribution {
  const stored = read();
  if (stored) return stored;

  const params = new URLSearchParams(window.location.search);
  const live: Attribution = {
    referrer: externalReferrer() || "(direct)",
    landing_page: window.location.pathname,
  };
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) live[key] = value.slice(0, 200);
  }
  return live;
}
