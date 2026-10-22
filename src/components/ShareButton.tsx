"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { track } from "@/lib/analytics";

const SHARE_TEXT = "Someone wants to build an operating system in Rust. Would you use it?";

function shareUrl() {
  const url = new URL(window.location.origin);
  url.searchParams.set("utm_source", "share");
  url.searchParams.set("utm_medium", "referral");
  return url.toString();
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  if (!ok) throw new Error("copy failed");
}

export function ShareButton() {
  const [copied, setCopied] = useState(false);
  const [manualUrl, setManualUrl] = useState<string | null>(null);

  async function handleShare() {
    const url = shareUrl();
    const data = { title: "The Rust OS Project", text: SHARE_TEXT, url };

    if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
      try {
        await navigator.share(data);
        track("share", { method: "web_share", content_type: "landing_page" });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        // Otherwise fall through to copying the link.
      }
    }

    try {
      await copyToClipboard(url);
      setCopied(true);
      track("share", { method: "copy_link", content_type: "landing_page" });
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setManualUrl(url);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-cyber/40 bg-cyber/10 px-5 font-display text-sm font-semibold text-ink transition-colors hover:border-cyber hover:bg-cyber/15"
      >
        {copied ? (
          <Check className="size-4 text-volt" aria-hidden />
        ) : (
          <Share2 className="size-4 text-cyber" aria-hidden />
        )}
        {copied ? "Link copied" : "Share the Project"}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </span>
      {manualUrl && (
        <label className="w-full max-w-xs text-xs text-mute">
          Copy this link:
          <input
            readOnly
            value={manualUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-1 w-full rounded-md border border-white/15 bg-void px-2 py-1.5 font-mono text-xs text-ink"
          />
        </label>
      )}
    </div>
  );
}
