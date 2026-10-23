import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Bot,
  Brain,
  Code2,
  Eye,
  Info,
  MessagesSquare,
  MonitorPlay,
  Route,
  Sparkles,
  TrendingDown,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import { CtaButton, HERO_EMAIL_INPUT_ID, SIGNUP_ANCHOR } from "@/components/CtaButton";
import { Faq } from "@/components/Faq";
import { HeroVideo } from "@/components/HeroVideo";
import { Logo } from "@/components/Logo";
import { SignupForm } from "@/components/SignupForm";
import { SiteFooter } from "@/components/SiteFooter";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <HelpShape />
        <Roadmap />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="bg-noise relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -top-48 left-1/2 h-[640px] w-[min(1000px,140vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(152_91_255/0.24),transparent)]" />
        <div className="absolute top-32 -left-48 size-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(185_255_53/0.09),transparent)]" />
        <div className="absolute top-60 -right-40 size-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(23_221_242/0.12),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-void" />
      </div>

      <header className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Logo />
          <CtaButton
            ctaId="header"
            className="hidden items-center gap-1.5 rounded-full border border-volt/40 px-4 py-2 font-display text-sm font-medium text-volt transition-colors hover:bg-volt/10 sm:inline-flex"
          >
            Join the Interest List
          </CtaButton>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 pt-22 pb-20 sm:px-8 sm:pt-28 lg:grid-cols-[1.02fr_1fr] lg:items-center lg:gap-14 lg:pt-36 lg:pb-28">
        <div>
          <p className="rise flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-cyber sm:text-xs">
            <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-cyber" />
            AI APPRENTICESHIP // EARLY CONCEPT
          </p>

          <h1
            className="rise mt-5 font-display text-[2.45rem] leading-[1.03] font-semibold tracking-[-0.035em] text-balance text-ink sm:text-6xl lg:text-[3.6rem]"
            style={delay(80)}
          >
            Learn to Code by Building Real Software.
            <span className="text-gradient mt-2 block pb-1">Would You Use It?</span>
          </h1>

          <p
            className="rise mt-5 max-w-xl text-[17px] leading-relaxed text-mute sm:text-lg"
            style={delay(160)}
          >
            We’re exploring an AI-powered apprenticeship that teaches programming through a project
            you choose — like building an operating system in Rust. It won’t write the code for you.
            It teaches what you need when you need it, and steps back as you get better.
          </p>

          <div
            id={SIGNUP_ANCHOR}
            className="rise mt-6 max-w-xl scroll-mt-24 rounded-2xl border border-white/10 bg-panel/60 p-4 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.9)] backdrop-blur-md sm:mt-8 sm:p-5"
            style={delay(240)}
          >
            <p aria-hidden className="mb-4 font-mono text-[11px] tracking-wider text-mute">
              <span className="text-volt">$</span> learn --by-building --join
              <span className="caret ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-volt/80" />
            </p>
            <SignupForm location="hero" emailInputId={HERO_EMAIL_INPUT_ID} />
          </div>
        </div>

        <div className="rise" style={delay(320)}>
          <HeroVideo />
          <p className="mt-4 flex items-center gap-2 font-mono text-[11px] tracking-wide text-mute/80">
            <Info className="size-3.5 shrink-0" aria-hidden />
            Concept teaser. Nothing shown is a working product — we’re testing whether it should be.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function SectionHeading({
  eyebrow,
  title,
  children,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={`reveal max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className="font-mono text-[11px] tracking-[0.22em] text-cyber sm:text-xs">{eyebrow}</p>
      <h2 className="mt-4 font-display text-3xl leading-tight font-semibold tracking-[-0.025em] text-balance text-ink sm:text-[2.6rem]">
        {title}
      </h2>
      {children && <div className="mt-4 text-[17px] leading-relaxed text-mute">{children}</div>}
    </div>
  );
}

const PROBLEMS: {
  tag: string;
  title: string;
  body: string;
  code: string;
  icon: LucideIcon;
  accent: string;
}[] = [
  {
    tag: "01",
    title: "Passive by Design",
    body: "Hundreds of hours of video feel like progress. But recognising a solution on screen isn’t the same as producing one in a blank editor — and that’s the skill a real project demands.",
    code: "// watched it. can you write it?",
    icon: MonitorPlay,
    accent: "text-volt border-volt/30 bg-volt/10 group-hover:shadow-[0_0_30px_-6px_rgb(185_255_53/0.6)]",
  },
  {
    tag: "02",
    title: "How Memory Works",
    body: "Psychologists call it the testing effect: you retain information by retrieving and using it, not by watching someone else use it. Knowledge you never have to use doesn’t stick.",
    code: "see: Roediger & Karpicke, 2006",
    icon: Brain,
    accent: "text-cyber border-cyber/30 bg-cyber/10 group-hover:shadow-[0_0_30px_-6px_rgb(23_221_242/0.6)]",
  },
  {
    tag: "03",
    title: "Outsourced to AI",
    body: "Asking an AI to write the code ships the feature but skips the learning. You end up with software you can’t explain, debug, or extend on your own.",
    code: "> just generate it for me",
    icon: Bot,
    accent: "text-neon border-neon/30 bg-neon/10 group-hover:shadow-[0_0_30px_-6px_rgb(152_91_255/0.6)]",
  },
];

function Problem() {
  return (
    <section aria-labelledby="problem" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="// THE PROBLEM"
          title={<span id="problem">Finished a Course. Froze on Your First Real Project?</span>}
        >
          That’s not a you problem. Following along and building are two different skills — and
          most courses only train the first.
        </SectionHeading>

        <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
          {PROBLEMS.map(({ tag, title, body, code, icon: Icon, accent }) => (
            <article
              key={title}
              className="reveal group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-panel to-panel/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 sm:p-7"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              />
              <div className="flex items-center justify-between">
                <span
                  className={`flex size-11 items-center justify-center rounded-xl border transition-shadow ${accent}`}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="font-mono text-xs text-mute/60">{tag}</span>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-ink">{title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-mute">{body}</p>
              <code className="mt-6 block truncate rounded-lg border border-white/6 bg-void/70 px-3 py-2 font-mono text-[12px] text-mute">
                {code}
              </code>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const STEPS: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Pick a Real Project",
    body: "Choose a language and something you actually want to build. Learning Rust? Build an operating system.",
    icon: Waypoints,
  },
  {
    title: "Learn Just in Time",
    body: "The AI shapes a personal learning path around your project and teaches each concept the moment you need it.",
    icon: Route,
  },
  {
    title: "Write It Yourself",
    body: "You write and debug the code. The AI validates your work and makes you take real engineering decisions.",
    icon: Code2,
  },
  {
    title: "Help That Fades",
    body: "Heavy support at the start, hands-off by the end — so you leave with a skill, not a completed checklist.",
    icon: TrendingDown,
  },
];

function HowItWorks() {
  return (
    <section aria-labelledby="how" className="relative py-20 sm:py-28">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(45%_55%_at_85%_40%,rgb(23_221_242/0.08),transparent_70%)]"
      />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow="// THE IDEA" title={<span id="how">How It Would Work</span>}>
          An apprenticeship, not a course. This is the concept we’re testing — none of it exists yet.
        </SectionHeading>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ title, body, icon: Icon }, i) => (
            <li
              key={title}
              className="reveal group relative rounded-2xl border border-white/8 bg-panel/50 p-6 transition-colors hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-void text-cyber transition-colors group-hover:border-cyber/40">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="font-mono text-xs text-mute/60">0{i + 1}</span>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-ink">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-mute">{body}</p>
            </li>
          ))}
        </ol>

        {/* Support fading from full to none */}
        <div aria-hidden className="reveal mt-6 px-1">
          <div className="h-1.5 rounded-full bg-gradient-to-r from-volt via-cyber/50 to-transparent" />
          <div className="mt-2 flex justify-between font-mono text-[10px] tracking-[0.18em] text-mute/70 sm:text-[11px]">
            <span>AI SUPPORT: HIGH</span>
            <span>YOU, ON YOUR OWN</span>
          </div>
        </div>

        <figure className="reveal mt-16 rounded-2xl border border-volt/20 bg-gradient-to-br from-volt/[0.06] via-transparent to-neon/[0.06] px-6 py-10 text-center sm:px-12 sm:py-14">
          <p className="font-mono text-[11px] tracking-[0.22em] text-volt">{"// THE PRINCIPLE"}</p>
          <blockquote className="mx-auto mt-5 max-w-3xl font-display text-2xl leading-snug font-medium tracking-tight text-balance text-ink sm:text-[2rem]">
            The measure of success isn’t “Did you finish the project?”
            <span className="text-gradient mt-1 block">It’s “Could you build the next one without us?”</span>
          </blockquote>
        </figure>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const BENEFITS: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Follow the Journey",
    body: "Receive updates if the project moves forward.",
    icon: Eye,
  },
  {
    title: "Share Your Ideas",
    body: "Tell us what you’d want to learn and what you’d want to build.",
    icon: MessagesSquare,
  },
  {
    title: "Be Early",
    body: "Hear about potential prototypes, demonstrations, or experiments if they become available.",
    icon: Sparkles,
  },
];

function HelpShape() {
  return (
    <section aria-labelledby="help-shape" className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_15%_50%,rgb(152_91_255/0.12),transparent_70%)]"
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
        <div className="reveal">
          <p className="font-mono text-[11px] tracking-[0.22em] text-cyber sm:text-xs">{"// COMMUNITY"}</p>
          <h2
            id="help-shape"
            className="mt-4 font-display text-3xl leading-tight font-semibold tracking-[-0.025em] text-ink sm:text-[2.6rem]"
          >
            Don’t Just Watch It Being Built.
            <span className="text-gradient mt-1 block">Help Shape What It Could Become.</span>
          </h2>
          <CtaButton
            ctaId="help_shape"
            className="btn-volt mt-8 inline-flex h-12 items-center gap-2 rounded-xl px-6 font-display text-base font-semibold"
          >
            I’m Interested
            <ArrowRight className="size-4" aria-hidden />
          </CtaButton>
        </div>

        <ul className="space-y-3">
          {BENEFITS.map(({ title, body, icon: Icon }, i) => (
            <li
              key={title}
              className="reveal group flex gap-4 rounded-2xl border border-white/8 bg-panel/50 p-5 transition-colors hover:border-white/20 sm:p-6"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-void text-cyber transition-colors group-hover:border-cyber/40">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  <span className="mr-2 font-mono text-xs font-normal text-mute/60">0{i + 1}</span>
                  {title}
                </h3>
                <p className="mt-1 text-[15px] leading-relaxed text-mute">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const STAGES = [
  {
    n: "01",
    title: "Validate Demand",
    body: "Find out whether people genuinely want to learn to code this way.",
    status: "Happening now",
    current: true,
  },
  {
    n: "02",
    title: "Explore the Vision",
    body: "Gather feedback on the languages, projects, and support people want, and investigate what it would take to build.",
    status: "If there’s interest",
    current: false,
  },
  {
    n: "03",
    title: "Evaluate a Prototype",
    body: "If sufficient demand and feasibility exist, explore developing an early prototype.",
    status: "If it’s feasible",
    current: false,
  },
];

function Roadmap() {
  return (
    <section aria-labelledby="roadmap" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow="// ROADMAP" title={<span id="roadmap">A Conditional Path</span>}>
          Each stage only happens if the one before it justifies it. Nothing here is a commitment.
        </SectionHeading>

        <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          {/* Connecting line: vertical on mobile, horizontal on desktop */}
          <span
            aria-hidden
            className="absolute top-2 bottom-2 left-[19px] w-px bg-gradient-to-b from-volt/70 via-cyber/40 to-neon/20 md:top-[19px] md:right-[16%] md:bottom-auto md:left-[16%] md:h-px md:w-auto md:bg-gradient-to-r"
          />
          {STAGES.map((stage) => (
            <li key={stage.n} className="reveal relative pl-14 md:pl-0 md:text-center">
              <span
                className={`absolute top-0 left-0 flex size-10 items-center justify-center rounded-full border font-mono text-xs md:relative md:mx-auto ${
                  stage.current
                    ? "border-volt bg-void text-volt shadow-[0_0_24px_-2px_rgb(185_255_53/0.6)]"
                    : "border-white/20 bg-void text-mute"
                }`}
              >
                {stage.n}
              </span>
              <p
                className={`font-mono text-[11px] tracking-[0.18em] uppercase md:mt-5 ${
                  stage.current ? "text-volt" : "text-mute/70"
                }`}
              >
                Stage {stage.n} · {stage.status}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">
                {stage.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-mute md:mx-auto md:max-w-[17rem]">
                {stage.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function FaqSection() {
  return (
    <section aria-labelledby="faq" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading eyebrow="// FAQ" title={<span id="faq">Straight Answers</span>}>
          No hype. Here’s exactly where things stand.
        </SectionHeading>
        <div className="reveal">
          <Faq />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function FinalCta() {
  return (
    <section aria-labelledby="final-cta" className="bg-noise relative isolate overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/media/hologram.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-35 blur-[2px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_50%,rgb(5_7_13/0.55),rgb(5_7_13/0.95))]" />
        <div className="bg-grid absolute inset-0 opacity-70" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-void to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-void to-transparent" />
      </div>

      <div className="mx-auto max-w-2xl px-5 text-center sm:px-8">
        <p className="reveal font-mono text-[11px] tracking-[0.22em] text-volt sm:text-xs">
          {"// THE ONLY QUESTION THAT MATTERS RIGHT NOW"}
        </p>
        <h2
          id="final-cta"
          className="reveal mt-5 font-display text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-ink sm:text-6xl"
        >
          Would You Learn to Code <span className="text-gradient">This Way?</span>
        </h2>
        <p className="reveal mx-auto mt-5 max-w-lg text-lg leading-relaxed text-mute">
          Help us find out whether this idea should become a real product.
        </p>

        <div className="reveal mx-auto mt-10 max-w-xl rounded-2xl border border-white/10 bg-void/70 p-4 text-left shadow-[0_0_80px_-20px_rgb(185_255_53/0.25)] backdrop-blur-md sm:p-5">
          <SignupForm location="final" />
        </div>
      </div>
    </section>
  );
}
