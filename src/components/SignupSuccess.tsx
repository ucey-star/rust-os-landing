"use client";

import { forwardRef } from "react";
import { ShareButton } from "./ShareButton";

export const SignupSuccess = forwardRef<HTMLHeadingElement>(function SignupSuccess(_, headingRef) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-volt/25 bg-panel/80 px-5 py-8 text-center sm:px-8">
      {/* Scan line sweeping the card */}
      <div
        aria-hidden
        className="motion-safe-only pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgb(185_255_53/0.08),transparent)]"
        style={{ animation: "scan 3.2s ease-in-out infinite" }}
      />

      <div aria-hidden className="relative mx-auto mb-6 size-20">
        <span
          className="motion-safe-only absolute inset-0 rounded-full border border-volt/50"
          style={{ animation: "ring-pulse 2.4s ease-out infinite" }}
        />
        <span
          className="motion-safe-only absolute inset-0 rounded-full border border-cyber/40"
          style={{ animation: "ring-pulse 2.4s ease-out 1.2s infinite" }}
        />
        <svg viewBox="0 0 80 80" className="relative size-20">
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="rgb(23 221 242 / 0.5)"
            strokeWidth="1"
            strokeDasharray="4 6"
            className="motion-safe-only origin-center"
            style={{ animation: "spin-slow 14s linear infinite", transformBox: "fill-box" }}
          />
          <circle cx="40" cy="40" r="26" fill="rgb(185 255 53 / 0.1)" stroke="#B9FF35" strokeWidth="1.5" />
          <path
            d="M28 41 l8 8 l16 -18"
            fill="none"
            stroke="#B9FF35"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="40"
            strokeDashoffset="40"
            style={{ animation: "draw 0.6s 0.2s ease-out forwards" }}
          />
        </svg>
      </div>

      <p className="relative mb-2 font-mono text-[11px] tracking-[0.2em] text-volt">
        &gt; INTEREST_RECORDED
      </p>
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="relative font-display text-2xl font-semibold tracking-tight text-ink outline-none focus-visible:outline-none sm:text-3xl"
      >
        You’re on the list.
      </h3>
      <p className="relative mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-mute">
        Thanks for being interested in learning by building. Your interest helps us understand
        whether this idea is worth pursuing.
      </p>
      <div className="relative mt-6">
        <ShareButton />
      </div>
    </div>
  );
});
