# Layal Alshaikh Group — Luxury Real Estate, Qatar

Marketing website for **Layal Alshaikh Group**, a family‑owned Qatar real‑estate
advisory and one‑stop business‑setup firm. The site showcases exclusive villas,
apartments and penthouses across The Pearl, Lusail and West Bay, with a luxury
"matte‑black & gold" brand identity, a switchable **dark/light** theme, an
animated 3D villa, and a content **admin portal**.

> Live brand: info@layalgroup.com · www.layalgroup.com

---

## ✨ Features

- **Cinematic dark hero** (full‑bleed slideshow that *lights up on hover*) + **light‑mode hero** with an **animated 3D villa** (Three.js, lights‑on‑hover).
- **Theme switch** — sliding sun/moon pill with a circular page‑reveal (View Transitions API). Warm‑gold "night" ⇄ cream‑gold "day".
- **Liquid‑glass UI** — frosted nav, buttons, and cards.
- **Motion** scroll/parallax/stagger animations.
- **House cursor** — a little gold house follows the pointer and lights up over interactive elements (desktop).
- **Multi‑page**: Home, Properties, Gallery (photos + video), About, Contact, Admin.
- **Responsive** down to mobile; respects `prefers-reduced-motion`.

## 🗂 Project structure

```
.
├── index.html            # Home
├── properties.html       # Listings + filters
├── gallery.html          # Photo / video gallery + lightbox
├── about.html            # About + services + testimonials
├── contact.html          # Contact form + info
├── admin.html            # Admin portal (content management)
├── css/
│   └── style.css         # Full design system (themes, components)
├── js/
│   ├── layout.js         # Shared nav/footer injection (subpages)
│   ├── main.js           # Home interactions (preloader, hero slideshow…)
│   ├── theme.js          # Dark/light switch + reveal transition
│   ├── cursor.js         # House cursor
│   ├── motion.js         # Scroll animations (motion.dev)
│   ├── house3d.js        # 3D villa (three.js)
│   └── admin.js          # Admin portal logic
├── favicon.svg
├── robots.txt
├── sitemap.xml
└── package.json
```

## 🛠 Tech

- **HTML5 / CSS3 / vanilla JS** (no framework — design/prototype phase)
- **three.js** (CDN) — 3D villa · **motion.dev** (CDN) — animations
- **View Transitions API** — theme reveal
- Image delivery via **Unsplash** with `auto=format` (serves WebP/AVIF)

## 🚀 Run locally

```bash
npx serve -p 3000 .
# open http://localhost:3000
```

## 🧭 Roadmap

- [x] **Phase 1 — Design** (luxury brand, dark/light, 3D, animations)
- [ ] **Phase 2 — Development**
  - [ ] SEO pass on every page (meta, Open Graph, JSON‑LD, canonical)
  - [ ] Performance pass (image dimensions/CLS, lazy‑load, defer, WebP, Lighthouse ≥ 90)
  - [ ] Real backend for the admin (auth + CRUD: properties, gallery, content)
  - [ ] Contact form wiring (email / service)
  - [ ] Accessibility (WCAG AA) + structured data for listings
- [ ] **Phase 3 — Deployment** (domain, HTTPS, CDN, analytics)

## 🎨 Brand

| Token | Value |
|---|---|
| Matte black | `#16120C` |
| Gold | `#CBA85A` |
| Headings | Cormorant Garamond |
| Body | Inter |

---

© Layal Alshaikh Group. All rights reserved.
