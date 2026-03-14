# 🦁 jaysWild — Wildlife Photography Portfolio

> *Where every frame tells a story from the wild.*

A stunning, performance-obsessed wildlife photography portfolio built with **Next.js 16**, featuring a time-adaptive hero, immersive masonry galleries, and behind-the-lens storytelling. Crafted using the **BMAD methodology** from idea → architecture → code.

---

## ✨ What Makes This Special

| 🌅 Time-Adaptive Hero | 🖼️ Masonry Galleries | 🔍 Behind-the-Lens |
|---|---|---|
| Hero image shifts with your local time of day — dawn, midday, dusk, night | Infinite-scroll masonry layout — Color & Black/White collections | Hover or tap any photo to reveal camera settings, location & story |

| 🦋 Firefly Social Icons | ⚡ Blazing Performance | 🌐 SEO-First |
|---|---|---|
| Floating Instagram & Facebook links with gentle butterfly animations | Lighthouse 90+, LCP <2.5s, CLS <0.1, <200KB images on mobile | JSON-LD, Open Graph, XML sitemaps, Google Images optimized |

---

## 🎨 Design Philosophy

```
🌿 Matte Nature Palette
   Forest Green  ████  #5a8a6d
   Savanna Ochre ████  #8f7556
   Warm Neutral  ████  #faf9f7

🔤 Typography
   Headings  →  Cormorant Garamond (Serif)
   Body      →  Inter (Sans)
   Metadata  →  JetBrains Mono (Mono)
```

> *Generous whitespace. Calm scroll physics. Every design decision feels like walking through nature.*

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────┐
│  🧱 Framework      Next.js 16 + App Router           │
│  ⚛️  UI             React 19 + TypeScript (strict)    │
│  🎨 Styling        Tailwind CSS v4 (JIT)              │
│  🎞️  Animations     Framer Motion 12                  │
│  🗃️  State          Zustand 5                         │
│  🖼️  Images         Sharp + Vercel Blob Storage       │
│  📊 Analytics      Google Analytics 4 (@next/third)  │
│  🧪 Testing        Playwright E2E                     │
│  🚀 Deploy         Vercel (zero-downtime)             │
│  🔄 Build          Turbopack ⚡                        │
└─────────────────────────────────────────────────────┘
```

---

## 🗺️ BMAD Project Progress

This project was planned end-to-end using the **[BMAD Methodology](https://github.com/bmadcode/BMAD-METHOD)** — a structured AI-assisted development workflow.

### 📋 Planning Phase — ✅ 100% Complete

| Phase | Artifact | Status |
|-------|----------|--------|
| 🧠 **Analysis** | Brainstorming Sessions | ✅ Done |
| 📄 **PRD** | Product Requirements Document | ✅ Done |
| 🎨 **UX Design** | Full Design Specification | ✅ Done |
| 🏗️ **Architecture** | System Architecture Document | ✅ Done |
| 📖 **Epics & Stories** | 9 Epics · 57 Stories | ✅ Done |

> 💡 All planning artifacts live in [`_bmad-output/planning-artifacts/`](_bmad-output/planning-artifacts/)

---

### 🏗️ Implementation Phase — 🚧 In Progress

**9 Epics · 57 Stories** to bring jaysWild to life:

```
Epic 1 ✅  Project Foundation & Infrastructure Setup
Epic 2 🚧  Time-Adaptive Homepage Experience
Epic 3 🚧  Responsive Masonry Gallery Browsing
Epic 4 ⬜  Full-Screen Lightbox & Behind-the-Lens Storytelling
Epic 5 ⬜  SEO Optimization & Discoverability
Epic 6 ⬜  Social Media Conversion & Analytics
Epic 7 ⬜  Automated Image Management Pipeline
Epic 8 ⬜  Quality Assurance & Testing Framework
```

#### Epic 1 — Foundation ✅
- [x] Next.js 16 + App Router initialized
- [x] TypeScript strict mode (zero `any` policy)
- [x] Tailwind CSS v4 with custom nature palette
- [x] Vercel deployment pipeline
- [x] ESLint zero-error CI/CD gate
- [x] Playwright E2E test framework

#### Epic 2 — Homepage 🚧
- [x] `HomePage.tsx` component built
- [x] `Header.tsx` + `Footer.tsx` + `SocialIcons.tsx`
- [ ] Time-of-day adaptive hero (dawn / midday / dusk / night)
- [ ] Firefly/butterfly animation on social icons
- [ ] Progressive disclosure navigation hints

#### Epic 3 — Gallery 🚧
- [x] `MasonryGrid.tsx` — responsive masonry layout
- [x] `GalleryItem.tsx` — image card component
- [x] Color gallery page (`/gallery/color`)
- [x] B&W gallery page (`/gallery/bw`)
- [ ] Infinite scroll pagination
- [ ] Skeleton loaders (gradient pulse, 1.5s loop)
- [ ] Calm scroll physics

#### Epic 4 — Lightbox ⬜
- [x] `Lightbox.tsx` component scaffolded
- [x] `ImageMetadata.tsx` — behind-the-lens panel
- [ ] Full-screen viewer with zoom (keyboard: arrows, Esc, Z)
- [ ] Behind-the-lens metadata reveal (hover desktop / tap mobile)
- [ ] Camera settings · Location · Field story display

#### Epics 5–8 ⬜ — Coming Up Next

---

## 📐 Architecture at a Glance

```
                    ┌──────────────────────┐
                    │   Google Drive 📁     │
                    │  (Source of Truth)    │
                    └──────────┬───────────┘
                               │ GitHub Actions (daily sync)
                               ▼
                    ┌──────────────────────┐
                    │  Image Sync Pipeline  │
                    │  Sharp → WebP/AVIF   │
                    │  <200KB mobile       │
                    └──────────┬───────────┘
                               │
                               ▼
          ┌────────────────────────────────────┐
          │       Vercel Blob Storage 🪣        │
          │     (CDN · Optimized Images)       │
          └────────────────┬───────────────────┘
                           │
                           ▼
          ┌────────────────────────────────────┐
          │     Next.js 16 SSG + App Router    │
          │  ┌──────────┐  ┌────────────────┐  │
          │  │ Homepage │  │  Gallery Pages │  │
          │  │  (FR1-2) │  │   Color / B&W  │  │
          │  └──────────┘  └────────────────┘  │
          │  ┌──────────┐  ┌────────────────┐  │
          │  │ Lightbox │  │   About Page   │  │
          │  │ (FR8-12) │  │                │  │
          │  └──────────┘  └────────────────┘  │
          └────────────────┬───────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Vercel 🚀   │
                    │  (Zero DT)   │
                    └──────────────┘
```

---

## 🎯 Success Targets

### ⚡ Performance
| Metric | Target |
|--------|--------|
| Lighthouse Score | **90+** |
| Hero LCP | **< 2.5s** desktop / **< 3s** mobile 3G |
| Cumulative Layout Shift | **< 0.1** |
| JS Bundle | **< 200KB** gzipped |
| Mobile Image Size | **< 200KB** |

### 📈 Growth (Phase 1 — Months 1–6)
| Goal | Target |
|------|--------|
| Monthly Visitors | 500+ by Month 3, 1000+ by Month 6 |
| Organic Traffic | > 60% from search |
| Instagram Followers | +50/month driven by site |
| Return Visitors | > 25% within 30 days |

### 💰 Monetization (Phase 2 — Post-Validation)
| Stream | Target |
|--------|--------|
| Print Sales | $500+/month |
| Safari Inquiries | 5+ qualified leads / 6 months |
| Average Order Value | $200+ per print |

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/jayathu/jaysWild.git
cd jaysWild

# Install dependencies
yarn install

# Run in development (Turbopack ⚡)
yarn dev

# Build for production
yarn build

# Run E2E tests
yarn test

# Sync images from Google Drive
yarn sync-images
```

Open [http://localhost:3000](http://localhost:3000) 🌿

---

## 📁 Project Structure

```
jaysWild/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router pages
│   │   ├── 📄 page.tsx            # Homepage (time-adaptive hero)
│   │   ├── 📄 layout.tsx          # Root layout + fonts
│   │   ├── 📁 gallery/            # Gallery index + sub-routes
│   │   │   ├── 📁 color/          # Color photography gallery
│   │   │   └── 📁 bw/             # Black & White gallery
│   │   └── 📁 about/              # About the photographer
│   ├── 📁 components/
│   │   ├── 🏠 HomePage.tsx        # Main landing experience
│   │   ├── 🔝 Header.tsx          # Navigation header
│   │   ├── 🦶 Footer.tsx          # Site footer
│   │   ├── 🦋 SocialIcons.tsx     # Firefly animated social links
│   │   └── 📁 gallery/
│   │       ├── 🖼️  MasonryGrid.tsx # Responsive masonry layout
│   │       ├── 🃏 GalleryItem.tsx  # Individual photo card
│   │       ├── 🔍 Lightbox.tsx    # Full-screen viewer
│   │       └── 📷 ImageMetadata.tsx # Behind-the-lens panel
│   └── 📁 lib/                    # Utilities & sync pipeline
├── 📁 _bmad-output/               # BMAD planning artifacts
│   └── 📁 planning-artifacts/
│       ├── 📄 prd.md              # Product Requirements
│       ├── 📄 architecture.md     # System Architecture
│       ├── 📄 ux-design-specification.md
│       └── 📄 epics.md            # 9 Epics · 57 Stories
├── 📄 package.json
└── 📄 README.md                   # You are here 👋
```

---

## 🧪 Quality Standards

```
✅  TypeScript strict mode — zero `any` types in production
✅  ESLint zero-error — CI/CD gates block on any lint error
✅  Playwright E2E — 90%+ coverage on all critical paths
✅  WCAG 2.1 AA — full keyboard nav + screen reader support
✅  Core Web Vitals — monitored via Vercel Analytics
✅  Responsive — 320px to 2560px+ viewport support
✅  Cross-browser — Chrome, Safari, Firefox, Edge (last 2 versions)
```

---

## 🗓️ What's Next

> **We're here** 👇

```
✅  Planning Complete  →  🚧  Implementation (Active)  →  ⬜  Sprint Planning
```

**Immediate priorities:**
1. 🕐 Complete time-of-day adaptive hero logic in Epic 2
2. ♾️  Add infinite scroll + skeleton loaders in Epic 3
3. 🔍 Wire up Lightbox + Behind-the-Lens in Epic 4
4. 🌐 Implement SEO metadata layer in Epic 5

---

## 📸 About

Built with love for wildlife photography and the wild places that inspire it. Every pixel, every performance optimization, every accessibility feature — all in service of letting the photographs speak for themselves.

*"The best camera is the one you have with you. The best portfolio is the one that does justice to what you saw."*

---

<div align="center">

🌿 **Made with BMAD · Built on Vercel · Photographed in the wild** 🌿

</div>
