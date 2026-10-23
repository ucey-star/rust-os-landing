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

export const LANGUAGES = [
  { value: "rust", label: "Rust" },
  { value: "python", label: "Python" },
  { value: "javascript_typescript", label: "JavaScript / TypeScript" },
  { value: "go", label: "Go" },
  { value: "c_cpp", label: "C / C++" },
  { value: "something_else", label: "Something else" },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: "new", label: "New to coding" },
  { value: "some", label: "Some experience" },
  { value: "professional", label: "Professional developer" },
] as const;

type Status = "idle" | "submitting" | "success" | "error";

function chipClass(selected: boolean) {
  return `cursor-pointer rounded-full border px-3 py-1.5 text-[13px] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cyber ${
    selected
      ? "border-volt/70 bg-volt/10 text-volt"
      : "border-white/12 text-mute hover:border-white/30 hover:text-ink"
  }`;
}

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
  const [languages, setLanguages] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [buildIdea, setBuildIdea] = useState("");
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

  function toggleLanguage(value: string) {
    setLanguages((current) =>
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

    const trimmedIdea = buildIdea.trim();
    const answeredSurvey = languages.length > 0 || experience !== "" || trimmedIdea.length > 0;
    track("form_submit", { form_location: location, survey_answered: answeredSurvey });

    const languageLabels = LANGUAGES.filter((l) => languages.includes(l.value)).map(
      (l) => l.label,
    );
    const experienceLabel = EXPERIENCE_LEVELS.find((e) => e.value === experience)?.label ?? "";

    const result = await submitToFormspree({
      email: trimmedEmail,
      first_name: firstName.trim(),
      languages: languageLabels.join("; "),
      experience: experienceLabel,
      build_idea: trimmedIdea,
      form_location: location,
      ...getAttribution(),
      _subject: "New interest-list sign-up",
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
        languages: languages.join(","),
        language_count: languages.length,
        experience: experience || undefined,
        has_build_idea: trimmedIdea.length > 0,
      });
      for (const language of languages) track("survey_language", { language });
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
            What would you want to learn?
          </span>
          <ChevronDown
            aria-hidden
            className={`size-4 shrink-0 transition-transform ${surveyOpen ? "rotate-180" : ""}`}
          />
        </button>

        <div id={ids.survey} hidden={!surveyOpen} className="space-y-5 px-4 pb-4">
          <fieldset>
            <legend className="mb-3 text-sm text-ink">
              Which language would you want to learn?
              <span className="ml-1 text-mute">Select any.</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((language) => {
                const checked = languages.includes(language.value);
                return (
                  <label key={language.value} className={chipClass(checked)}>
                    <input
                      type="checkbox"
                      name="languages"
                      value={language.value}
                      checked={checked}
                      onChange={() => toggleLanguage(language.value)}
                      className="sr-only"
                    />
                    {language.label}
                  </label>
                );
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-3 text-sm text-ink">Your coding experience</legend>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <label key={level.value} className={chipClass(experience === level.value)}>
                  <input
                    type="radio"
                    name={`${uid}-experience`}
                    value={level.value}
                    checked={experience === level.value}
                    onChange={() => setExperience(level.value)}
                    className="sr-only"
                  />
                  {level.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor={ids.feedback} className="mb-1.5 block text-sm text-ink">
              What would you want to build?
            </label>
            <textarea
              id={ids.feedback}
              name="build_idea"
              rows={2}
              maxLength={1000}
              value={buildIdea}
              onChange={(e) => setBuildIdea(e.target.value)}
              placeholder="An operating system, a game engine, a web app…"
              className="w-full resize-y rounded-xl border border-white/12 bg-void/70 px-4 py-3 text-base text-ink placeholder:text-mute/50 transition-colors hover:border-white/25 focus:border-cyber/70 focus:outline-none sm:text-sm"
            />
          </div>
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
