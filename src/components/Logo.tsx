import Link from "next/link";
import { siteName } from "@/lib/site";

export function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5 font-mono text-[13px] font-medium tracking-[0.18em] text-ink uppercase"
      aria-label={`${siteName} — home`}
    >
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
        <path d="M16 2 28 9v14L16 30 4 23V9z" fill="none" stroke="#17DDF2" strokeOpacity=".7" strokeWidth="1.6" />
        <path
          d="m10.5 11.5 5 4.5-5 4.5M17.5 21h5"
          fill="none"
          stroke="#B9FF35"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        {siteName.split(" ").map((word, i) => (
          <span key={word}>
            {i > 0 && <span className="text-volt">/</span>}
            {word}
          </span>
        ))}
      </span>
    </Link>
  );
}
