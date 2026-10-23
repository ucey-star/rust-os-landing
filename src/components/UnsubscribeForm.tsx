"use client";

import { useRef, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { EMAIL_PATTERN, isFormspreeConfigured, submitToFormspree } from "@/lib/formspree";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Sends an unsubscribe request to the same Formspree form, flagged with
 * request_type=unsubscribe, so there's no extra backend to maintain.
 */
export function UnsubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const inFlight = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    inFlight.current = true;
    setStatus("submitting");
    setMessage(null);
    const result = await submitToFormspree({
      email: trimmed,
      request_type: "unsubscribe",
      _subject: "Unsubscribe request — interest list",
    });
    inFlight.current = false;

    if (result.ok) {
      setStatus("success");
      setMessage("Request received. You’ll be removed from future updates.");
    } else {
      setStatus("error");
      setMessage(result.message);
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="rounded-xl border border-volt/30 bg-volt/10 px-4 py-3 text-sm text-ink">
        {message}
      </p>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="unsubscribe-email" className="block text-xs font-medium text-mute">
        Email address to unsubscribe
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="unsubscribe-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 flex-1 rounded-xl border border-white/12 bg-void/70 px-4 text-base text-ink focus:border-cyber/70 focus:outline-none"
          placeholder="you@example.com"
        />
        <button
          type="submit"
          disabled={status === "submitting" || !isFormspreeConfigured}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-medium text-ink transition-colors hover:border-white/40 disabled:opacity-60"
        >
          {status === "submitting" && <Loader2 className="size-4 animate-spin" aria-hidden />}
          Unsubscribe
        </button>
      </div>
      {message && (
        <p role="alert" className="text-sm text-red-300">
          {message}
        </p>
      )}
      {!isFormspreeConfigured && (
        <p className="text-sm text-mute">The unsubscribe form isn’t connected yet.</p>
      )}
    </form>
  );
}
