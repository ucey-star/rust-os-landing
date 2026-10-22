import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5 font-mono text-[13px] font-medium tracking-[0.18em] text-ink"
      aria-label="The Rust OS Project — home"
    >
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
        <path d="M16 2 28 9v14L16 30 4 23V9z" fill="none" stroke="#17DDF2" strokeOpacity=".7" strokeWidth="1.6" />
        <path
          d="M12.5 22V10h4.5a3.5 3.5 0 0 1 0 7h-4.5m4.5 0 3.5 5"
          fill="none"
          stroke="#B9FF35"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      RUST<span className="text-volt">/</span>OS
    </Link>
  );
}
