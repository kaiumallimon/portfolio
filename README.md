# Kaium Al Limon · Portfolio

A full-stack developer portfolio built with Next.js 16, Supabase, and an arsenal of modern web technologies — featuring a full admin panel, live GitHub integration, custom 3D shader backgrounds, reCAPTCHA-protected contact, and three built-in utility tools.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Styling** | Tailwind CSS 4, shadcn/ui, Radix UI |
| **Animation** | Framer Motion, GSAP, Three.js (custom GLSL shaders) |
| **Database** | Supabase (Postgres + Auth + Storage + Realtime) |
| **Email** | Nodemailer (SMTP) with HTML templates |
| **APIs** | GitHub REST + GraphQL, reCAPTCHA v2 |
| **Icons** | Lucide, Tabler, React Icons |
| **Deployment** | Vercel-ready |

---

## Home Page Sections

- **Hero** — Profile image, headline, tech stack pills, animated background (Three.js ColorBends shader), CV download
- **About** — Bio, education timeline
- **Skills** — Categorized skill cards with icons
- **Impact** — Animated metric counters, live GitHub stars
- **Featured Projects** — Preview grid with mobile/web mockups
- **GitHub Contributions** — Live contribution calendar heatmap
- **Language Breakdown** — GitHub language distribution charts
- **Journey** — Co-curricular activities timeline
- **Achievements** — Award cards with rank badges
- **Hobbies** — Interest cards
- **Contact** — reCAPTCHA-protected form with SMTP email delivery

---

## Project Detail Pages

Every project has a rich detail page (`/projects/[id]`) with:

- Full-screen image gallery with lightbox dialog
- GitHub stats strip — stars, forks, open issues, watchers
- Language breakdown donut chart
- Repository details card (license, topics, size, default branch)
- Top contributors grid (avatar, username, additions/deletions)
- Renderered GitHub README with full markdown support
- Features, overview, conclusion sections

---

## Built-in Utility Tools

Three sub-applications live under `/tools`:

- **GitHub Unwrapped** — Personalized year-in-review: total contributions, streak, repositories, gamification rank. Exports as PNG.
- **UIU Exam Routine Finder** — Scrapes and filters exam schedules for United International University.
- **UIU CGPA Calculator** — Semester GPA and cumulative CGPA calculator.

---

## Admin Dashboard (`/admin`)

Full content management system protected by Supabase Auth (email/password + custom password reset flow):

### Content CRUD
| Section | Management |
|---|---|
| **Projects** | Add/edit/delete with multi-image upload, pagination, search, client filter |
| **Achievements** | Rank, date, team, image upload |
| **Activities** | Organization, period, active status |
| **Education** | Degree, institution, period, status (current/completed) |
| **Skills** | Categorized with highlight toggle |
| **Hobbies** | Icon-picker, description |
| **Metrics** | Value, suffix, featured flag |

### Dashboard Analytics
- Key performance indicators (total projects, achievements, messages)
- Area chart — message volume over time
- Bar chart — messages by day of week
- Donut chart — read/unread message ratio

### Settings
Unified settings editor covering:
- Profile & Hero (display name, headline, subheadline, bio, profile image, availability)
- Social & Contact (GitHub, LinkedIn, Facebook, email, location)
- SEO (custom title + description for metadata)
- Footer (description, social links)

### Message Inbox
Real-time contact message inbox with Supabase Realtime. Threaded view, mark as read, delete threads. Paginated.

---

## Unique UI & Effects

### Custom Animated Cursor
GSAP-powered cursor with four corner brackets. Snaps to interactive elements (`cursor-target`), rotates when idle, hides on touch devices.

### Three.js Shader Background
`ColorBends` component renders fluid GLSL color bends with up to 8 configurable colors, warp controls, mouse influence, and parallax — used on the hero section and admin login.

### Terminal Preloader
A boot-sequence animation (init → import → tsc → build → api → perf → deploy → done) with progress bar, floating code snippets, scanline overlay, and blinking cursor. Plays once per session via `sessionStorage`.

### Glass Morphism
Subtle glass card effects (`backdrop-blur`, rgba borders, `bg-slate-900/30`) across the admin panel and public sections.

### Scroll Reveals
Framer Motion-powered scroll-reveal primitives with direction and stagger support.

---

## SEO & Performance

- Dynamic `generateMetadata` reading from Supabase settings (per-deploy control)
- `robots.ts` — full crawl access
- `sitemap.ts` — all static routes + every project by ID
- `force-dynamic` on admin and dynamic pages
- Google Analytics (G-T8EL28VE67) with SPA pageview tracking

---

## Project Structure

```
app/                  # Next.js App Router (pages, API, admin)
├── api/              # Contact, settings, GitHub, auth, tools
├── admin/            # Dashboard, CRUD pages, login, settings
├── projects/         # Projects listing + detail pages
└── tools/            # GitHub Unwrapped, Exam Routine, CGPA Calculator
components/           # React components
├── shared/           # Header, backgrounds, scroll-reveal
├── custom-new/       # Home page sections, preloader, footer
├── admin/            # Admin tables, forms, charts, inbox
└── ui/               # shadcn/ui primitives
lib/                  # Data fetching, GitHub client, Supabase, utilities
types/                # TypeScript types (content, project)
supabase/migrations/  # Database schema (0001–0007)
```

---

## Database Tables

| Table | Purpose |
|---|---|
| `projects` | Portfolio projects with multi-image gallery |
| `achievements` | Awards and competitions |
| `activities` | Co-curricular activities |
| `education` | Academic history |
| `skills` | Skills grouped by category |
| `hobbies` | Personal interests |
| `metrics` | Impact statistics |
| `site_settings` | Global site configuration |
| `contact_messages` | Contact form submissions |
| `resume` | Resume/CV download link |
| `password_resets` | Password reset tokens |

---

*Designed and developed by **Kaium Al Limon** — full-stack developer from Dhaka, Bangladesh.*
