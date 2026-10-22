export const siteName = "The Rust OS Project";

export const siteDescription =
  "An early concept for a new operating system built in Rust. Join the interest list, follow the journey, and help decide whether it should be built.";

// NEXT_PUBLIC_SITE_URL wins; on Vercel we fall back to the production domain.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "";

export const promoVideo = {
  mp4: "/media/rust-os-promo.mp4",
  webm: "/media/rust-os-promo.webm",
  poster: "/media/rust-os-poster.jpg",
  width: 848,
  height: 480,
  durationSeconds: 36,
};
