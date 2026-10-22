"use client";

import type { MouseEvent, ReactNode } from "react";
import { track } from "@/lib/analytics";

export const SIGNUP_ANCHOR = "join";
export const HERO_EMAIL_INPUT_ID = "hero-email";

type CtaButtonProps = {
  ctaId: string;
  children: ReactNode;
  className?: string;
};

/** Smooth-scrolls to the hero sign-up form and focuses the email field. */
export function CtaButton({ ctaId, children, className }: CtaButtonProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    track("cta_click", { cta_id: ctaId, cta_text: event.currentTarget.textContent ?? "" });

    const target = document.getElementById(SIGNUP_ANCHOR);
    if (!target) return;
    event.preventDefault();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    history.replaceState(null, "", `#${SIGNUP_ANCHOR}`);

    const input = document.getElementById(HERO_EMAIL_INPUT_ID);
    window.setTimeout(() => input?.focus({ preventScroll: true }), reduced ? 0 : 450);
  }

  return (
    <a href={`#${SIGNUP_ANCHOR}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
