"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { track } from "@/lib/analytics";
import { promoVideo } from "@/lib/site";

type NetworkInformation = { saveData?: boolean };

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);

  // True once the visitor has taken control; we stop auto-pausing/resuming then.
  const userControlled = useRef(false);
  const pausedOffscreen = useRef(false);
  const trackedPlay = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: NetworkInformation }).connection
      ?.saveData;

    // Muted autoplay, unless the visitor prefers reduced motion or is saving data.
    if (!reducedMotion && !saveData) {
      video.play().catch(() => {
        // Autoplay blocked: the poster and play button remain.
      });
    }

    // Pause while scrolled out of view to save CPU/battery; resume on return.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (userControlled.current) return;
        if (!entry.isIntersecting && !video.paused) {
          pausedOffscreen.current = true;
          video.pause();
        } else if (entry.isIntersecting && pausedOffscreen.current) {
          pausedOffscreen.current = false;
          video.play().catch(() => {});
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    userControlled.current = true;
    if (video.paused) {
      video.play().catch(() => setFailed(true));
      if (!trackedPlay.current) {
        trackedPlay.current = true;
        track("video_play", { video_title: "promo", trigger: "user" });
      }
    } else {
      video.pause();
      track("video_pause", { video_title: "promo" });
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    userControlled.current = true;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted) {
      if (video.paused) video.play().catch(() => {});
      track("video_unmute", { video_title: "promo" });
    }
  }

  return (
    <figure className="relative">
      {/* Ambient glow behind the frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(60%_60%_at_30%_30%,rgb(152_91_255/0.35),transparent_70%),radial-gradient(50%_50%_at_80%_80%,rgb(23_221_242/0.25),transparent_70%)] blur-2xl"
      />

      <div className="frame-gradient overflow-hidden rounded-2xl shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]">
        <div className="flex items-center justify-between border-b border-white/10 bg-panel/80 px-3.5 py-2 font-mono text-[11px] tracking-wider text-mute">
          <span className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span
                className={`absolute inline-flex size-full rounded-full bg-volt ${playing ? "motion-safe:animate-ping" : ""} opacity-60`}
              />
              <span className="relative inline-flex size-2 rounded-full bg-volt" />
            </span>
            TRANSMISSION_01
          </span>
          <span>00:{promoVideo.durationSeconds}</span>
        </div>

        <div
          className="relative bg-void"
          style={{ aspectRatio: `${promoVideo.width} / ${promoVideo.height}` }}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 size-full object-cover"
            poster={promoVideo.poster}
            width={promoVideo.width}
            height={promoVideo.height}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Promotional video: a hooded figure in an illuminated mask types the words “I want to build an OS in Rust”."
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
          >
            <source src={promoVideo.webm} type="video/webm" />
            <source src={promoVideo.mp4} type="video/mp4" onError={() => setFailed(true)} />
          </video>

          {failed && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={promoVideo.poster}
              alt="Still from the promotional video: a hooded figure wearing an illuminated mask."
              className="absolute inset-0 size-full object-cover"
            />
          )}

          {!playing && !failed && (
            <button
              type="button"
              onClick={togglePlay}
              className="group absolute inset-0 flex items-center justify-center bg-void/30 transition-colors hover:bg-void/10"
              aria-label="Play promotional video"
            >
              <span className="flex size-16 items-center justify-center rounded-full border border-volt/60 bg-void/70 text-volt shadow-[0_0_40px_-6px_rgb(185_255_53/0.7)] backdrop-blur transition-transform group-hover:scale-105">
                <Play className="ml-1 size-7" fill="currentColor" aria-hidden />
              </span>
            </button>
          )}

          {!failed && (
            <div className="absolute bottom-3 left-3 flex gap-2">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? "Pause video" : "Play video"}
                className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-void/70 text-ink backdrop-blur transition-colors hover:border-volt/60 hover:text-volt"
              >
                {playing ? (
                  <Pause className="size-4" fill="currentColor" aria-hidden />
                ) : (
                  <Play className="ml-0.5 size-4" fill="currentColor" aria-hidden />
                )}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute video" : "Mute video"}
                aria-pressed={!muted}
                className="flex h-10 items-center gap-2 rounded-full border border-white/15 bg-void/70 px-3.5 font-mono text-[11px] tracking-wider text-ink backdrop-blur transition-colors hover:border-cyber/60 hover:text-cyber"
              >
                {muted ? (
                  <VolumeX className="size-4" aria-hidden />
                ) : (
                  <Volume2 className="size-4" aria-hidden />
                )}
                <span className="hidden sm:inline">{muted ? "SOUND OFF" : "SOUND ON"}</span>
              </button>
            </div>
          )}

          {failed && (
            <p className="absolute inset-x-0 bottom-0 bg-void/80 px-4 py-2 text-center font-mono text-xs text-mute">
              Video unavailable in this browser.
            </p>
          )}
        </div>
      </div>
    </figure>
  );
}
