# One Night — Landing Page

Premium marketing landing page for **One Night**, *le réseau social de soirées* —
the nightlife social network where you reconnect with the people you crossed paths
with at your favourite parties.

![One Night](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-149eca) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)

## ✨ Highlights

- **Fully coded device mockups** — the in-app screens (live feed, chat, themed
  event) are recreated entirely in JSX/CSS, no image assets required, crisp at any
  resolution.
- **Premium dark + neon brand system** — lavender / electric-purple / hot-pink,
  heavy condensed display type (Anton) paired with Inter.
- **Motion** — Framer Motion reveals & floating cards, all gated behind
  `prefers-reduced-motion`.
- **100% statically prerendered** — every route ships as static HTML for instant
  loads and ideal SEO.
- **Accessible** — WCAG-minded: skip link, focus-visible rings, labelled icon
  buttons, semantic landmarks, `lang="fr"`.
- **SEO-ready** — Open Graph / Twitter metadata, JSON-LD `MobileApplication`
  schema, `robots.txt` and `sitemap.xml`.

## 🧱 Stack

| Layer      | Tech                                   |
| ---------- | -------------------------------------- |
| Framework  | Next.js 16 (App Router) + React 19     |
| Language   | TypeScript (strict)                    |
| Styling    | Tailwind CSS 3                          |
| Animation  | Framer Motion 11                       |
| Fonts      | `next/font` — Anton + Inter            |

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build (static export-ready)
npm run start    # serve the production build
```

## 🗂 Structure

```
app/
  layout.tsx        # fonts, metadata, viewport, theme
  page.tsx          # section composition + JSON-LD
  globals.css       # design tokens, utilities, reduced-motion
  icon.svg          # brand favicon
  robots.ts / sitemap.ts
components/
  Nav, Hero, Marquee, Features, Showcase, Stats,
  HowItWorks, Testimonials, CTA, Footer   # page sections
  PhoneFrame, screens                     # coded app mockups
  Reveal                                  # scroll-reveal primitives
  ui, icons                               # buttons, logo, SVG icon set
tailwind.config.ts                        # brand color & motion tokens
```

## 🎨 Brand tokens

| Token          | Hex       | Usage                |
| -------------- | --------- | -------------------- |
| `neon`         | `#FF2E9A` | primary / hot pink   |
| `violet`       | `#7C3AED` | electric purple      |
| `lilac`        | `#E9DDFB` | light section bg     |
| `ink`          | `#0B0710` | dark base            |

---

Built section-by-section as a premium product landing — design system first,
then UX, then implementation, then QA (responsive, a11y, performance, SEO).
