export const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT?.trim() ?? "";

export const isFormspreeConfigured = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+\/?$/.test(
  FORMSPREE_ENDPOINT,
);

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type SubmitResult = { ok: true } | { ok: false; message: string; field?: string };

type FormspreeResponse = {
  ok?: boolean;
  errors?: { field?: string; message?: string }[];
};

/**
 * Posts to Formspree and only reports success when Formspree itself confirms it
 * (HTTP 2xx *and* `{ ok: true }` in the body).
 */
export async function submitToFormspree(data: Record<string, string>): Promise<SubmitResult> {
  if (!isFormspreeConfigured) {
    return { ok: false, message: "Sign-ups aren’t connected yet. Please check back soon." };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  let res: Response;
  try {
    res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
  } catch {
    return {
      ok: false,
      message: "We couldn’t reach the sign-up service. Check your connection and try again.",
    };
  } finally {
    clearTimeout(timeout);
  }

  let body: FormspreeResponse = {};
  try {
    body = (await res.json()) as FormspreeResponse;
  } catch {
    // Non-JSON response; handled as a failure below.
  }

  if (res.ok && body.ok === true) return { ok: true };

  const first = body.errors?.[0];
  if (res.status === 429) {
    return { ok: false, message: "Too many attempts. Please wait a minute and try again." };
  }
  if (first?.field === "email") {
    return { ok: false, field: "email", message: "Please enter a valid email address." };
  }
  return {
    ok: false,
    message: first?.message
      ? `Sign-up failed: ${first.message}`
      : `Something went wrong (error ${res.status}). Please try again.`,
  };
}

// Session-scoped record of a *confirmed* sign-up, shared by every form on the page.
const SIGNED_UP_KEY = "rustos:signed-up";
export const SIGNED_UP_EVENT = "rustos:signed-up";

export function hasSignedUpThisSession(): boolean {
  try {
    return sessionStorage.getItem(SIGNED_UP_KEY) === "1";
  } catch {
    return false;
  }
}

export function markSignedUp() {
  try {
    sessionStorage.setItem(SIGNED_UP_KEY, "1");
  } catch {
    // Storage unavailable — the in-memory state still prevents resubmission.
  }
  window.dispatchEvent(new Event(SIGNED_UP_EVENT));
}
