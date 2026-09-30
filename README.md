# ROAM Robotics — Website

The official website for **ROAM (Robotics Operation for Autonomous Mapping)**, a student-led robotics club at the Schulich School of Engineering, University of Calgary. ROAM is building **ATLAS-1**, an autonomous rover for LiDAR mapping and 3D digital-twin generation.

The site has two halves:

- **Public site:** tells visitors what ROAM builds, shows interactive 3D demos, handles recruitment applications, and takes sponsorship and contact inquiries.
- **Team Portal:** a sign-in area for accepted members to manage their profiles, and for leads and admins to review applications, manage the roster, and email people.

---

## What the website can do

### Public pages

| Route | What it does |
| --- | --- |
| `/` | Landing page with a Mars scene where the rover drives in, followed by sections on the club, its mission areas, the tech stack, and calls to join or sponsor. |
| `/team` | Team roster: the captain, subteam leads, and members grouped by subteam, with photos, short bios, and LinkedIn/portfolio links. |
| `/demo` | "Mission Control" page with project status, a point-cloud visualization, an autonomous navigation simulator, a build-progress tracker, and the planned hardware stack. |
| `/join` | Recruitment page covering subteam roles, what members gain, and what's expected of them. |
| `/apply` | Multi-step application form with department-specific technical questions and an optional résumé upload. |
| `/sponsors` | Sponsorship page with tiers, partnership packages, and a sponsor inquiry section. |
| `/contact` | Contact form. Each message goes to the right club inbox based on the subject chosen. |
| `/portal` | Entry point for the Team Portal. Visitors who aren't accepted members are turned away with a "not permitted" message. |

### Interactive demos

All of these run in the browser and are built with Three.js / React Three Fiber and canvas:

- **Mars hero:** a scene of the rover arriving on Martian terrain.
- **Path-planning sandbox:** choose start and goal cells on a grid with obstacles, and watch an A* planner find a route between them.
- **Autonomous navigation simulator:** pick start and goal cells in a 3D city grid, then watch the rover plan and drive the path while a minimap tracks it.
- **Exploded sensor rig:** a 3D breakdown of the rover's sensor and compute payload. Select a module to see its specs.
- **Point-cloud visualization:** a procedurally generated LiDAR-style scan of terrain.
- **Mission domain canvases:** animated views of terrain mapping, infrastructure inspection, and environmental monitoring.

The demos run on simulated or procedurally generated data. They show what the rover is designed to do; they don't stream data from live hardware.

### Team Portal (`/admin`)

Signing in uses Clerk (Google sign-in or email). Access is limited to accepted members. Each person's account links to their team profile the first time they sign in.

| Section | Who can use it | What it does |
| --- | --- | --- |
| **Profile** | Every member | Edit name, bio, photo, links, subteam, birthday, and whether the profile appears on the public Team page. |
| **Recruitment** | Leads and admins | Browse every application, filter by department or status, search, read full responses, and set a status (pending, reviewed, interview, accepted, waitlisted, rejected) with reviewer notes. |
| **All Members** | Admins | Manage the roster: assign roles (member, lead, admin) and subteams, and edit any profile. Each subteam can have only one lead. |
| **Compose** | Admins | Write rich-text emails with attachments from the club's addresses. Every sent email is kept in a log. |

### Automated features

- **Birthday emails:** a daily scheduled job sends a branded birthday email to any member whose birthday is today.
- **Team page updates:** the public Team page is cached, and it rebuilds automatically when a profile or roster change is saved.
- **SEO:** per-page metadata, structured data (JSON-LD), a sitemap, and a `robots.txt` that keeps crawlers out of the portal.

---

## How it works

```
Browser ──► Next.js (App Router) on Vercel
              │
              ├── Public pages (static / cached)
              ├── 3D demos (client-side Three.js)
              ├── API routes ──► Supabase (Postgres + Storage)
              │                ──► Resend (email)
              └── Middleware ──► Clerk (authentication)
```

- **Framework:** Next.js 14 (App Router) with TypeScript. Most pages render on the server, and the heavy 3D scenes load only in the browser, and only when they're needed.
- **Data:** Supabase stores applications, member profiles, email logs, résumés, and member photos. Public pages read only the fields meant to be public. Everything else goes through server-side API routes.
- **Authentication:** Clerk handles sign-in. Middleware protects the portal routes, and every portal API call checks the signed-in user's role on the server before it returns or changes any data.
- **Email:** Resend sends contact-form messages, portal emails, and birthday emails from a verified domain.
- **Hosting:** Vercel, which also runs the scheduled birthday job.

### Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14, React 18, TypeScript |
| 3D / graphics | Three.js, React Three Fiber, Drei |
| Animation | GSAP (ScrollTrigger), Framer Motion |
| Styling | Tailwind CSS with shared design tokens (see `DESIGN_SYSTEM.md`) |
| Auth | Clerk |
| Database & storage | Supabase |
| Email | Resend |
| Hosting | Vercel |

---

## Project structure

```text
roam-frontend/
├── app/                 # Routes (pages, layouts) and API routes
│   ├── admin/           # Team Portal pages
│   └── api/             # Contact, applications, members, email, cron
├── components/
│   ├── admin/           # Portal UI (recruitment, members, compose, profile)
│   ├── hero/            # Mars landing scene
│   ├── interactive/     # Navigation simulator, path planner, sensor rig
│   ├── pointcloud/      # Point-cloud visualization
│   ├── rover/           # Rover 3D model
│   ├── sections/        # Page sections (home, join, apply, demo, sponsors, contact)
│   ├── team/            # Public Team page
│   └── ui/              # Shared UI primitives
├── lib/                 # Auth helpers, Supabase clients, email templates, site config
├── supabase/            # SQL schema and access-policy files
├── scripts/             # Admin maintenance scripts
└── public/              # Static assets, textures, sponsor logos
```

---

## Local development

**Requirements:** Node.js 18.17+ and npm.

```bash
npm install
cp .env.example .env.local   # then fill in your own credentials
npm run dev                  # http://localhost:3000
```

`.env.example` lists every variable the app needs (Supabase, Clerk, Resend, and the cron secret), with notes on each. Never commit `.env.local` or any real keys. The service-role and API secrets must stay server-only.

Most public pages and demos work without credentials. The application form, Team page, contact form, and portal need the matching services configured.

### Database setup

Run the SQL files in `supabase/` in the Supabase SQL editor. Start with the schema files, then apply the access-policy (RLS) files. You also need two storage buckets, one for résumés and one for member photos.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build, including lint and type checks |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run clerk:allowlist` | Sync the sign-in allowlist from accepted applications |
| `npm run invite:test` / `invite:send` | Send portal invitation emails (test run, then a real send) |
| `npm run seed:preview` / `seed:wipe` | Add or remove placeholder members for local previews |

Admin scripts need server credentials in `.env.local`. Run them only against the environment you mean to change.

---

## Deployment

The site deploys to Vercel. Set the same environment variables from `.env.example` in the Vercel project settings. The daily birthday job is defined in `vercel.json` and is secured with `CRON_SECRET`.

Before pushing, run `npm run build` locally. Lint and type errors fail the production build.

---

## Contributing

- Follow the design tokens and conventions in `DESIGN_SYSTEM.md`: dark surfaces, coral accents, and monospace/display typography.
- Load 3D scenes dynamically, and use procedural geometry where you can to keep bundles small.
- Enforce permissions in the API routes, not only in the UI.

---

## License

Proprietary to the ROAM Robotics Club. All rights reserved. Reproducing or redistributing this code without permission is not allowed.
