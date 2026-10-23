import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SiteFooter } from "@/components/SiteFooter";
import { UnsubscribeForm } from "@/components/UnsubscribeForm";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How we handle the email addresses and feedback we collect.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "October 21, 2026";

export default function PrivacyPage() {
  return (
    <>
      <header className="border-b border-white/8">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 sm:px-8">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider text-mute hover:text-ink"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            BACK
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="font-mono text-xs tracking-[0.22em] text-cyber">{"// PRIVACY POLICY"}</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Privacy, in plain language.
        </h1>
        <p className="mt-3 font-mono text-xs text-mute">Last updated: {LAST_UPDATED}</p>

        <div className="mt-10 space-y-10 text-[16px] leading-relaxed text-mute [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-1.5">
          <section>
            <h2>Why we collect your email</h2>
            <p>
              This project is an early-stage idea. Emails are collected for two reasons only:
              to measure whether there’s genuine interest in building it, and to send you relevant
              project updates. We don’t sell, rent, or share your email with anyone for marketing.
            </p>
          </section>

          <section>
            <h2>What we collect</h2>
            <ul>
              <li>Your email address (required).</li>
              <li>Your first name, if you choose to give it.</li>
              <li>Your answers to the optional interest survey and any feedback you write.</li>
              <li>
                How you found the page: campaign tags in the link (UTM parameters) and the referring
                website, if your browser provides it.
              </li>
            </ul>
          </section>

          <section>
            <h2>Where it’s stored</h2>
            <p>
              Sign-ups are processed and stored by{" "}
              <a href="https://formspree.io/legal/privacy-policy" className="text-ink underline underline-offset-2" target="_blank" rel="noreferrer">
                Formspree
              </a>
              , a form-handling service. There’s no separate database behind this site.
            </p>
          </section>

          <section>
            <h2>Analytics</h2>
            <p>
              We may use privacy-conscious, aggregate analytics (Google Analytics 4) to understand how
              many people visit and sign up. Advertising features and Google Signals are disabled, and
              your email address and other directly identifying details are never sent to analytics.
            </p>
          </section>

          <section>
            <h2>How long we keep it</h2>
            <p>
              We keep your details while the project is being explored. If the project is abandoned,
              the list will be deleted rather than repurposed.
            </p>
          </section>

          <section id="unsubscribe" className="scroll-mt-8">
            <h2>Unsubscribe or delete your data</h2>
            <p className="mb-5">
              You can opt out at any time. Every update email will include an unsubscribe link. You
              can also use the form below, and your address will be removed from future updates and
              deleted on request.
              {contactEmail && (
                <>
                  {" "}
                  Or email{" "}
                  <a href={`mailto:${contactEmail}`} className="text-ink underline underline-offset-2">
                    {contactEmail}
                  </a>
                  .
                </>
              )}
            </p>
            <div className="rounded-2xl border border-white/10 bg-panel/60 p-5">
              <UnsubscribeForm />
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
