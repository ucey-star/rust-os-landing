"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { track } from "@/lib/analytics";

const FAQS = [
  {
    q: "Is the OS available now?",
    a: "No. This is an early-stage concept currently being validated.",
  },
  {
    q: "Why Rust?",
    a: "Rust provides interesting opportunities for systems programming, including memory safety and low-level control.",
  },
  {
    q: "When will it launch?",
    a: "There is no confirmed launch date. Development depends on demand, feasibility, and available resources.",
  },
  {
    q: "Who is this for?",
    a: "Developers, Rust enthusiasts, systems programmers, and people interested in alternative operating systems.",
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
