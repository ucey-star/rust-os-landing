import { Wrench } from "lucide-react";

/** Shown in place of a working form until NEXT_PUBLIC_FORMSPREE_ENDPOINT is set. */
export function SetupNotice() {
  return (
    <div
      role="note"
      className="rounded-xl border border-neon/40 bg-neon/10 px-4 py-3 text-[13px] leading-relaxed text-ink"
    >
      <p className="mb-1 flex items-center gap-2 font-mono text-[11px] tracking-wider text-neon">
        <Wrench className="size-3.5" aria-hidden />
        SETUP REQUIRED
      </p>
      Sign-ups aren’t connected yet. Create a form at{" "}
      <a href="https://formspree.io" className="underline underline-offset-2" target="_blank" rel="noreferrer">
        formspree.io
      </a>
      , then set{" "}
      <code className="rounded bg-void/60 px-1 font-mono text-[12px]">NEXT_PUBLIC_FORMSPREE_ENDPOINT</code>{" "}
      to its endpoint (e.g.{" "}
      <code className="font-mono text-[12px]">https://formspree.io/f/abcdwxyz</code>) in{" "}
      <code className="font-mono text-[12px]">.env.local</code> or your Vercel project settings, and
      redeploy.
    </div>
  );
}
