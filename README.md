# rust-os-landing

Proof-of-demand landing page for **Learn by Building** (working name): an idea for an AI-powered apprenticeship that teaches programming through building real software you choose, like an operating system in Rust. The AI doesn't write the code for you. It teaches concepts when you need them, makes you write and debug the code, and steps back as you improve. The page has one job: measure genuine interest by collecting email sign-ups.

The working name lives in `src/lib/site.ts` (`siteName`). Change it there and the logo, metadata and share text all update.

- Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Lucide icons
- Sign-ups go to **[Formspree](https://formspree.io)**. There's no database and no backend to maintain.
- Optional **Google Analytics 4** for privacy-conscious conversion tracking
- Deploys to **Vercel** with zero configuration

> This repository is only the landing page. It is intentionally separate from any product code.

---

## Quick start (local)

Requires **Node.js 20+**. If you use nvm, run `nvm use` (see `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # then fill in your Formspree endpoint
npm run dev                  # http://localhost:3000
```

Until `NEXT_PUBLIC_FORMSPREE_ENDPOINT` is set, the form shows a **"Setup required"** notice and won't submit.

| Variable | Required | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_FORMSPREE_ENDPOINT` | **Yes** | Your Formspree form URL, e.g. `https://formspree.io/f/abcdwxyz` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | GA4 ID like `G-XXXXXXXXXX`. Leave it empty and analytics stay off. |
| `NEXT_PUBLIC_SITE_URL` | No | Your production URL for SEO and share previews. Vercel's domain is used automatically if empty. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Shown on `/privacy` as a contact for data requests. |

None of these are secrets. Formspree endpoints and GA IDs are meant to be public.

---

## Step-by-step setup and deployment

### 1–2. Create the GitHub repo and push

The repo is already configured with `origin = https://github.com/ucey-star/rust-os-landing`. To set it up from scratch somewhere else:

```bash
# Option A: GitHub CLI
gh repo create rust-os-landing --public --source=. --remote=origin --push

# Option B: create an empty repo named rust-os-landing on github.com (no README), then:
git remote add origin https://github.com/<your-username>/rust-os-landing.git
git branch -M main
git push -u origin main
```

### 3. Create a Formspree account

Sign up for free at <https://formspree.io/register>. The free plan includes a monthly submission allowance. If the experiment takes off, check your usage on the dashboard.

### 4. Create a new form

1. In the Formspree dashboard, click **+ New Form** and give it a name like "Rust OS interest list".
2. Copy the form endpoint. It looks like `https://formspree.io/f/abcdwxyz`.
3. Recommended form settings:
   - **reCAPTCHA: off.** This site submits with AJAX and uses a honeypot (`_gotcha`). Formspree's own spam filtering still applies.
   - **Email notifications:** your choice. Every submission is stored in the dashboard either way.

### 5. Add the endpoint

- **Locally:** put it in `.env.local` as `NEXT_PUBLIC_FORMSPREE_ENDPOINT=...` and restart `npm run dev`.
- **On Vercel:** go to Project → Settings → Environment Variables, add the same key and value, then **redeploy**. `NEXT_PUBLIC_*` values are baked in at build time.

### 6. Test that sign-ups arrive

1. Open the site, enter your own email, and submit.
2. The **"You're on the list."** state appears *only* after Formspree confirms the submission. Any failure shows an error instead.
3. The first submission to a new form can trigger a **confirmation email from Formspree** to the account owner. Click it, or later submissions may be held.
4. Check the Formspree dashboard → your form → **Submissions**.
5. To test again, open a new tab or a private window. Each browser session can only sign up once.

Each submission includes these fields:

| Field | Notes |
| --- | --- |
| `email` | required |
| `first_name` | optional |
| `languages` | optional survey: languages they want to learn, e.g. `Rust; Python` |
| `experience` | optional survey: `New to coding`, `Some experience` or `Professional developer` |
| `build_idea` | optional free text: what they'd want to build |
| `form_location` | `hero` or `final`, the form that was used |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` | from the landing URL, if present |
| `referrer` | external referring site (origin and path only), or `(direct)` |
| `landing_page` | path the visitor first landed on |

Unsubscribe requests from `/privacy#unsubscribe` arrive in the **same form** with `request_type = unsubscribe`. Remove those addresses before you send any update.

### 7–8. Deploy on Vercel

1. Go to <https://vercel.com/new> and import the `rust-os-landing` GitHub repo.
2. Framework preset: **Next.js**. Leave the build settings at their defaults.
3. Add the environment variables from the table above. At minimum, add `NEXT_PUBLIC_FORMSPREE_ENDPOINT`.
4. Click **Deploy**. Every push to `main` redeploys automatically after that.

### 9. Configure analytics (GA4, optional but recommended)

1. At <https://analytics.google.com>, create a property, then a **Web** data stream for your Vercel domain.
2. Copy the **Measurement ID** (`G-…`) into `NEXT_PUBLIC_GA_MEASUREMENT_ID` on Vercel and redeploy.
3. In GA4, go to Admin → Events and mark **`sign_up`** as a **key event** (conversion).
4. Optional: under Admin → Custom definitions, register the event parameters `form_location`, `cta_id`, `language`, `experience`, `trigger`, and `reason` as custom dimensions so you can break reports down by them.

Events sent by the site:

| Event | When |
| --- | --- |
| `page_view` | automatically, with UTM attribution |
| `video_play` / `video_pause` / `video_unmute` | the visitor uses the video controls (autoplay isn't counted as a play) |
| `cta_click` | any "Join"/"I'm Interested" button (`cta_id`) |
| `form_start` | first focus in a form (`form_location`) |
| `survey_open` | the optional survey is expanded |
| `form_submit` | a submission attempt |
| `form_error` | validation or submission failure (`reason`). **Never** counted as a sign-up. |
| `sign_up` | **only after Formspree confirms success**. This is the conversion. |
| `survey_response` / `survey_language` | survey answers sent with a successful sign-up (languages and experience level only, never free text) |
| `share` | the Share button (`method`: `web_share` or `copy_link`) |
| `faq_open` | an FAQ question is opened |

Email addresses and names are **never** sent to analytics. `track()` also drops any value that looks like an email address. Google Signals and ad personalisation are disabled.

**Primary metric: visitor-to-sign-up conversion rate**

```
Conversion rate = unique successful sign-ups ÷ unique visitors × 100
```

- In GA4, go to Reports → Engagement → **Key events**, select `sign_up`, and read the **user key event rate**. That is the share of users who signed up.
- For a ground-truth count, use the number of Formspree submissions (excluding `request_type = unsubscribe`) ÷ GA4 **Users** for the same date range.
- Reports → Acquisition → **Traffic acquisition** splits it by `utm_source` / `utm_campaign`, so tag every promo link, e.g.
  `https://your-site.vercel.app/?utm_source=tiktok&utm_medium=video&utm_campaign=teaser_01`

### 10. View and export sign-ups

In the Formspree dashboard, open your form → **Submissions** to browse them, then use **Export** to download a CSV. You can open it in Sheets or Excel and filter by `languages`, `experience` or `utm_source`.

---

## Project structure

```
src/
  app/
    page.tsx              landing page (hero, problem, how it would work, help shape, roadmap, FAQ, final CTA)
    privacy/page.tsx      privacy policy + unsubscribe form
    layout.tsx            fonts, SEO/Open Graph metadata, analytics
    opengraph-image.tsx   generated 1200×630 share image
  components/
    SignupForm.tsx        reusable Formspree form (validation, honeypot, survey, attribution)
    SignupSuccess.tsx     confirmation state + ShareButton
    HeroVideo.tsx         promo video: muted autoplay, play/pause, sound, reduced-motion, fallback
    CtaButton.tsx         smooth scroll to the hero form + focus email
    Faq.tsx               accessible accordion
  lib/
    formspree.ts          submit + "confirmed only" success logic, session de-dupe
    attribution.ts        UTM + referrer capture
    analytics.ts          GA4 track() with PII guard
public/media/             promo video (MP4 + WebM), poster, closing-section background still
```

## Editing content

All copy lives directly in `src/app/page.tsx` (sections) and `src/components/Faq.tsx` (FAQ). To swap the video, replace the files in `public/media/` and update `promoVideo` in `src/lib/site.ts`. To re-encode a new source video for the web:

```bash
ffmpeg -i source.mp4 -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart public/media/rust-os-promo.mp4
ffmpeg -i source.mp4 -c:v libvpx-vp9 -crf 36 -b:v 0 -c:a libopus -b:a 64k public/media/rust-os-promo.webm
ffmpeg -ss 2 -i source.mp4 -frames:v 1 -q:v 3 public/media/rust-os-poster.jpg
```
