"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, ChevronDown, Loader2 } from "lucide-react";
import { track } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import {
  EMAIL_PATTERN,
  SIGNED_UP_EVENT,
  hasSignedUpThisSession,
  isFormspreeConfigured,
  markSignedUp,
  submitToFormspree,
} from "@/lib/formspree";
import { SetupNotice } from "./SetupNotice";
import { SignupSuccess } from "./SignupSuccess";

export const INTERESTS = [
  { value: "security_privacy", label: "Security and privacy" },
  { value: "speed_performance", label: "Speed and performance" },
  { value: "developer_customization", label: "Developer customization" },
  { value: "learning_os_dev", label: "Learning about operating-system development" },
  { value: "open_source", label: "Open-source collaboration" },
  { value: "something_else", label: "Something else" },
] as const;

type Status = "idle" | "submitting" | "success" | "error";

type SignupFormProps = {
  /** Where on the page this form lives; sent to Formspree and analytics. */
  location: "hero" | "final";
  /** Optional id for the email input so CTAs can focus it. */
  emailInputId?: string;
};

export function SignupForm({ location, emailInputId }: SignupFormProps) {
  const uid = useId();
  const ids = {
    email: emailInputId ?? `${uid}-email`,
    emailError: `${uid}-email-error`,
    name: `${uid}-name`,
    survey: `${uid}-survey`,
    feedback: `${uid}-feedback`,
    note: `${uid}-note`,
  };

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const inFlight = useRef(false);
  const started = useRef(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const movedFocus = useRef(false);

  // Reflect a confirmed sign-up from this session (from either form on the page).
  useEffect(() => {
    const sync = () => {
      if (hasSignedUpThisSession()) setStatus("success");
    };
    sync();
    window.addEventListener(SIGNED_UP_EVENT, sync);
    return () => window.removeEventListener(SIGNED_UP_EVENT, sync);
  }, []);

  useEffect(() => {
    if (status === "success" && movedFocus.current) {
      successHeadingRef.current?.focus();
    }
  }, [status]);

  if (status === "success") {
    return <SignupSuccess ref={successHeadingRef} />;
  }

  function handleFirstInteraction() {
    if (started.current) return;
    started.current = true;
    track("form_start", { form_location: location });
  }

  function toggleSurvey() {
    const next = !surveyOpen;
    setSurveyOpen(next);
    if (next) track("survey_open", { form_location: location });
  }

  function toggleInterest(value: string) {
    setInterests((current) =>
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    if (hasSignedUpThisSession()) {
      setStatus("success");
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !EMAIL_PATTERN.test(trimmedEmail) || trimmedEmail.length > 254) {
      setEmailError(
        trimmedEmail ? "Please enter a valid email address." : "Please enter your email address.",
      );
      track("form_error", {
        form_location: location,
        reason: trimmedEmail ? "email_invalid" : "email_missing",
      });
      emailRef.current?.focus();
      return;
    }
    setEmailError(null);

    // Honeypot filled: almost certainly a bot. Silently do nothing.
    if (honeypotRef.current?.value) return;

    if (!isFormspreeConfigured) {
      setStatus("error");
      setFormError("Sign-ups aren’t connected yet. Please check back soon.");
      track("form_error", { form_location: location, reason: "not_configured" });
      return;
    }

    inFlight.current = true;
    setStatus("submitting");
    setFormError(null);

    const trimmedFeedback = feedback.trim();
    const answeredSurvey = interests.length > 0 || trimmedFeedback.length > 0;
    track("form_submit", { form_location: location, survey_answered: answeredSurvey });

    const selectedLabels = INTERESTS.filter((i) => interests.includes(i.value)).map(
      (i) => i.label,
    );

    const result = await submitToFormspree({
      email: trimmedEmail,
      first_name: firstName.trim(),
      interests: selectedLabels.join("; "),
      feedback: trimmedFeedback,
      form_location: location,
      ...getAttribution(),
      _subject: "New Rust OS interest sign-up",
      _gotcha: honeypotRef.current?.value ?? "",
    });

    inFlight.current = false;

    if (!result.ok) {
      setStatus("error");
      if (result.field === "email") {
        setEmailError(result.message);
        emailRef.current?.focus();
      } else {
        setFormError(result.message);
      }
      track("form_error", { form_location: location, reason: "submit_failed" });
      return;
    }

    // Formspree confirmed the submission — only now is it a conversion.
    track("sign_up", { method: "formspree", form_location: location });
    if (answeredSurvey) {
      track("survey_response", {
        form_location: location,
        interests: interests.join(","),
        interest_count: interests.length,
        has_feedback: trimmedFeedback.length > 0,
      });
      for (const interest of interests) track("survey_interest", { interest });
    }
    movedFocus.current = true;
    markSignedUp();
    setStatus("success");
  }

  const submitting = status === "submitting";

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      onFocusCapture={handleFirstInteraction}
      className="relative space-y-3"
      aria-describedby={ids.note}
    >
      {!isFormspreeConfigured && <SetupNotice />}

      <div className="grid gap-3 sm:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        <div>
          <label htmlFor={ids.name} className="mb-1.5 block text-xs font-medium text-mute">
            First name <span className="text-mute/60">(optional)</span>
          </label>
          <input
            id={ids.name}
            name="first_name"
            type="text"
            autoComplete="given-name"
            maxLength={80}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Ada"
            className="h-12 w-full rounded-xl border border-white/12 bg-void/70 px-4 text-base text-ink placeholder:text-mute/50 transition-colors hover:border-white/25 focus:border-cyber/70 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor={ids.email} className="mb-1.5 block text-xs font-medium text-mute">
            Email address
          </label>
          <input
            ref={emailRef}
            id={ids.email}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="off"
            spellCheck={false}
            required
            maxLength={254}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(null);
            }}
            placeholder="you@example.com"
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? ids.emailError : undefined}
            className={`h-12 w-full rounded-xl border bg-void/70 px-4 text-base text-ink placeholder:text-mute/50 transition-colors focus:outline-none ${
              emailError
                ? "border-red-400/70 focus:border-red-400"
                : "border-white/12 hover:border-white/25 focus:border-cyber/70"
            }`}
          />
        </div>
      </div>

      {emailError && (
        <p id={ids.emailError} role="alert" className="text-sm text-red-300">
          {emailError}
        </p>
      )}

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden className="absolute -left-[10000px] top-auto size-px overflow-hidden">
        <label>
          Leave this field empty
          <input ref={honeypotRef} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Optional survey, collapsed by default so it doesn't compete with the email field */}
      <div className="rounded-xl border border-white/8 bg-white/[0.02]">
        <button
          type="button"
          onClick={toggleSurvey}
          aria-expanded={surveyOpen}
          aria-controls={ids.survey}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-[13px] text-mute transition-colors hover:text-ink"
        >
          <span>
            <span className="font-mono text-[11px] tracking-wider text-cyber">OPTIONAL</span>
            <span className="mx-2 text-white/20">/</span>
            What would make you try a Rust OS?
          </span>
          <ChevronDown
            aria-hidden
            className={`size-4 shrink-0 transition-transform ${surveyOpen ? "rotate-180" : ""}`}
          />
        </button>

        <div id={ids.survey} hidden={!surveyOpen} className="px-4 pb-4">
          <fieldset>
            <legend className="mb-3 text-sm text-ink">
              What would make you interested in trying a new OS built in Rust?
              <span className="ml-1 text-mute">Select any.</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => {
                const checked = interests.includes(interest.value);
                return (
                  <label
                    key={interest.value}
                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-[13px] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cyber ${
                      checked
                        ? "border-volt/70 bg-volt/10 text-volt"
                        : "border-white/12 text-mute hover:border-white/30 hover:text-ink"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="interests"
                      value={interest.value}
                      checked={checked}
                      onChange={() => toggleInterest(interest.value)}
                      className="sr-only"
                    />
                    {interest.label}
                  </label>
                );
              })}
            </div>
          </fieldset>
          <label htmlFor={ids.feedback} className="mt-4 mb-1.5 block text-xs font-medium text-mute">
            Anything else? <span className="text-mute/60">(optional)</span>
          </label>
          <textarea
            id={ids.feedback}
            name="feedback"
            rows={3}
            maxLength={1000}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What would make a Rust-based OS worth using for you?"
            className="w-full resize-y rounded-xl border border-white/12 bg-void/70 px-4 py-3 text-base text-ink placeholder:text-mute/50 transition-colors hover:border-white/25 focus:border-cyber/70 focus:outline-none sm:text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="btn-volt inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 font-display text-base font-semibold"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Joining…
          </>
        ) : (
          <>
            Join the Interest List
            <ArrowRight className="size-4" aria-hidden />
          </>
        )}
      </button>

      {formError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-3.5 py-2.5 text-sm text-red-200"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{formError}</span>
        </div>
      )}

      <div id={ids.note} className="space-y-1 text-center sm:text-left">
        <p className="font-mono text-[12px] tracking-wide text-ink/80">
          Free to join. No spam. Just project updates.
        </p>
        <p className="text-[12px] leading-relaxed text-mute">
          Your email is only used to measure interest and send relevant project updates.
          Unsubscribe anytime.{" "}
          <Link href="/privacy" className="underline decoration-white/25 underline-offset-2 hover:text-ink">
            Privacy
          </Link>
        </p>
      </div>
    </form>
  );
}
