"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { track } from "@/lib/analytics";

const FAQS = [
  {
    q: "Is this available now?",
    a: "No. This is an early-stage concept. We’re testing whether people genuinely want it before building it.",
  },
  {
    q: "How is this different from a coding course?",
    a: "No videos and no passive lessons. You’d learn by building a real project you choose, with each concept introduced at the moment your project needs it.",
  },
  {
    q: "Will the AI write the code for me?",
    a: "No — that’s the point. It would explain, review, and push you to make engineering decisions, but you’d write and debug the code yourself. Its help would fade as you get more capable.",
  },
  {
    q: "Why does the video talk about building an OS in Rust?",
    a: "It’s one example of the kind of ambitious project you could learn through. The idea is that you pick the language and the project.",
  },
  {
    q: "Which languages would it support?",
    a: "That hasn’t been decided. The answers people give when they sign up will help decide where it starts.",
  },
  {
    q: "When will it launch?",
    a: "There is no confirmed launch date. Development depends on demand, feasibility, and available resources.",
  },
  {
    q: "What happens when I sign up?",
    a: "Your interest is recorded, and you may receive relevant updates about the project.",
  },
  {
    q: "Is joining free?",
    a: "Yes.",
  },
];

export function Faq() {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-white/8 overflow-hidden rounded-2xl border border-white/8 bg-panel/50">
      {FAQS.map((item, index) => {
        const isOpen = open === index;
        const buttonId = `${baseId}-q${index}`;
        const panelId = `${baseId}-a${index}`;
        return (
          <div key={item.q}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  setOpen(isOpen ? null : index);
                  if (!isOpen) track("faq_open", { question: item.q });
                }}
                className="group flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-display text-base font-medium text-ink transition-colors hover:bg-white/[0.02] sm:px-6 sm:text-lg"
              >
                {item.q}
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen
                      ? "rotate-45 border-volt/60 text-volt"
                      : "border-white/15 text-mute group-hover:border-white/30"
                  }`}
                >
                  <Plus className="size-3.5" aria-hidden />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p className="px-5 pb-5 text-[15px] leading-relaxed text-mute sm:px-6">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
