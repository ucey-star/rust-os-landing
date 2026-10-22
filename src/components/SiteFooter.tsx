import Link from "next/link";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="space-y-2">
          <Logo />
          <p className="max-w-md text-xs leading-relaxed text-mute">
            An early concept being validated — not a released product. An independent project, not
            affiliated with or endorsed by the Rust Project or the Rust Foundation.
          </p>
        </div>
        <nav aria-label="Footer" className="flex gap-6 font-mono text-xs tracking-wider text-mute">
          <Link href="/privacy" className="hover:text-ink">
            PRIVACY
          </Link>
          <Link href="/privacy#unsubscribe" className="hover:text-ink">
            UNSUBSCRIBE
          </Link>
        </nav>
      </div>
    </footer>
  );
}
