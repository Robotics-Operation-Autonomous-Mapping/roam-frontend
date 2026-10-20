# ROAM Website: How-To Guide

A practical guide for anyone making changes to the ROAM website (schulichroam.com).
It covers the common updates and the mistakes that are easy to make along the way.

**Website originally built by:** Vyapak Bansal
**Guide written by:** Parin Patel, with features added alongside Vyapak Bansal

All paths are relative to the root of the `roam-frontend` repo. If you change how
something works, update this guide in the same pull request.

---

## Contents

1. [Getting set up](#getting-set-up)
2. [Making any change](#making-any-change)
3. [Open or close recruitment](#open-or-close-recruitment)
4. [Add a new 3D model](#add-a-new-3d-model)
5. [Add a new project](#add-a-new-project)
6. [Add or remove a subteam](#add-or-remove-a-subteam)
7. [Update the sponsorship package](#update-the-sponsorship-package)
8. [Update the reimbursement and purchase forms](#update-the-reimbursement-and-purchase-forms)
9. [Update the demo page](#update-the-demo-page)
10. [Change the member count](#change-the-member-count)
11. [Add a link to the top menu](#add-a-link-to-the-top-menu)
12. [Page titles, search results and link previews](#page-titles-search-results-and-link-previews)
13. [Troubleshooting](#troubleshooting)
14. [Open work](#open-work)
15. [Change history](#change-history)

---

## Getting set up

```
git clone https://github.com/Robotics-Operation-Autonomous-Mapping/roam-frontend
cd roam-frontend
npm install
npm run dev
```

Then open http://localhost:3000.

- **Environment keys.** Pages that use the database or sign-in (the application form, the team portal) need a `.env.local` file with the Supabase and Clerk keys. Copy `.env.example` to `.env.local` and get the values from the website lead. Never commit `.env.local`.
- **Write access.** Pushing to the repo needs write access to the Robotics-Operation-Autonomous-Mapping GitHub organization. Ask an org admin to add your GitHub account.
- **Don't keep the project in OneDrive or Dropbox.** Sync tools fight with git and the dev server, causing missing files after switching branches and slow reloads. Use a plain folder such as `C:\dev\roam-frontend`.

---

## Making any change

Start from an up-to-date `main` on a new branch:

```
git checkout main
git pull
git checkout -b short-name-for-the-change
```

Make the change, then check it:

```
npm run dev              # look at it on http://localhost:3000
npx tsc --noEmit         # type check: prints nothing if OK
npm run lint             # should say "No ESLint warnings or errors"
```

Commit only the files you meant to change, push, and open a pull request on GitHub:

```
git status
git add path/to/file1 path/to/file2
git commit -m "Say what the change does"
git push -u origin short-name-for-the-change
```

- Stop `npm run dev` (Ctrl+C) before switching branches.
- Avoid `git add .`, which can sweep in stray files.
- Changes only reach the live site after the pull request is merged **and** Vercel deploys. Check the repo's **Deployments** page for the date of the last production deploy.

---

## Open or close recruitment

**File:** `lib/site.ts`, at the bottom.

```ts
export const RECRUITMENT = { open: true };   // recruitment open
export const RECRUITMENT = { open: false };  // recruitment closed
```

That one value controls the whole site:

| `open` | What visitors see |
|---|---|
| `true` | Apply buttons on the homepage hero, the "Join the Mission" section, the team page, and the bottom of `/join`; the application form on `/apply` |
| `false` | Apply buttons hidden or replaced with a greyed-out "Recruitment Closed" button; `/apply` shows a closed message |

- The closed message is in `components/sections/RecruitmentClosed.tsx`.
- The application form saves straight to Supabase from the browser. Hiding the form does not stop someone determined from submitting directly. To fully lock submissions, turn off inserts on the `applications` table in the Supabase dashboard.

---

## Add a new 3D model

Each project card on `/projects` can show one 3D model that visitors drag to rotate and scroll to zoom. The viewer is `components/sections/projects/ModelViewer.tsx`, built with React Three Fiber and drei.

### Step 1: Get the file in the right format

The site only reads **`.glb`** files. Aim for under about 10 MB.

CAD files (`.sldprt`, `.sldasm`, `.f3d`, `.step`, `.stl`, `.obj`) won't load in the browser. To convert one:

1. Export from the CAD tool as STEP, OBJ or STL.
2. Open it in Blender (free): **File → Import** → that format.
3. **File → Export → glTF 2.0**, set Format to **glTF Binary (.glb)**, tick **Compression**, and export.

If the file is too large, remove small internal parts (screws, bolts, cables) before exporting. Large files load slowly, especially on phones.

### Step 2: Test it outside the site

Drag the `.glb` into https://gltf-viewer.donmccurdy.com. It runs in the browser and nothing is uploaded. If the model shows there, it will work on the site.

### Step 3: Add the file

Put it in `public/models/`, named in lowercase with no spaces:

```
public/models/atlas.glb        good
public/models/ATLAS Final.glb  bad: capitals and a space
```

### Step 4: Connect it to a project

In `components/sections/projects/constants.ts`, add a `model` line to the project's object:

```ts
model: "/models/atlas.glb",
```

The path starts with `/models/` and leaves out `public`, because everything in `public/` is served from the site root.

- **Existing project:** add the line to its object.
- **New project:** see [Add a new project](#add-a-new-project).
- **Replacing a model:** overwrite the file in `public/models/` under the same name. No code change needed.

### Step 5: Check and commit

Check `/projects` at desktop and phone width. Then commit the model file and the `constants.ts` change **together**. A `model` line pointing at a file that isn't committed shows a renderer error on the live site.

```
git add public/models/atlas.glb components/sections/projects/constants.ts
git commit -m "Add ATLAS 3D model"
```

Don't commit test or placeholder models.

### Photos instead of models

Put the image in `public/projects/` and add `image: "/projects/atlas.jpg",` to the project. If a project has both, the model is shown. With neither, a "coming soon" placeholder shows.

### Viewer settings

In `ModelViewer.tsx`: starting camera angle (`camera`), spin speed (`autoRotateSpeed`), and lighting (`ambientLight`, `directionalLight`). `<Stage>` centres and sizes the model automatically. Keep `environment={null}` on `<Stage>`; the default downloads lighting from an external site, which ad-blockers and some networks block.

---

## Add a new project

**File:** `components/sections/projects/constants.ts`. Add one object to the `PROJECTS` list. A new card appears automatically, in list order.

```ts
{
  slug: "atlas",                     // short lowercase ID: unique, no spaces
  name: "ATLAS",
  tagline: "Our first autonomous rover",
  status: "IN PROGRESS",
  summary: "One or two sentences about the project.",
  specs: [
    { label: "Compute", value: "NVIDIA Jetson" },
    { label: "SLAM", value: "ORB-SLAM3" },
  ],
  model: "/models/atlas.glb",        // optional
},
```

Separate objects with commas.

---

## Add or remove a subteam

Subteams live in two places that must agree: the **public site** (join page and application form) and the **team portal** (member profiles, backed by the database).

### Add: public site

**1. Join page card:** `components/sections/join/constants.ts`. Add an object to `ROLES`:

```ts
{
  title: "CONTROLS",
  desc: "One sentence on what this subteam does.",
},
```

**2. Card layout:** `components/sections/join/RolesSection.tsx`. The grid uses `lg:grid-cols-3`. Pick a column count the cards fill evenly (6 cards → 3, 8 cards → 4).

**3. Application form:** `components/sections/application/types.ts`. Add the department name to `Department`:

```ts
  | "Controls"
```

TypeScript will then flag `components/sections/application/constants.ts` until it has an entry for the new department in all three lists: `DEPT_DESCRIPTIONS`, `DEPT_ICONS`, and `TECH_QUESTIONS`. When the errors are gone, the form and the admin dashboard filter are both updated.

**4. Search description:** update the list of roles in `app/join/page.tsx` (`description`).

### Add: team portal

**5. Subteam list:** `lib/members/types.ts`. Add to `SUBTEAMS` using a lowercase_underscore ID:

```ts
  "controls",
```

**6. Labels and mapping:** `lib/members/constants.ts`.

```ts
// in SUBTEAM_LABELS: the display name
controls: "Controls",

// in DEPT_TO_SUBTEAM: application department → portal subteam
Controls: "controls",
```

**7. Database:** the `members.subteam` column only accepts listed values. Someone with Supabase access must run this in the SQL editor **before** the code is deployed:

```sql
ALTER TYPE public.member_subteam ADD VALUE 'controls';
```

### Remove

Reverse steps 1–4 (delete the entries). **Keep** the department's line in `DEPT_TO_SUBTEAM`: older applications in the database still use that department name, and the mapping lets leads keep seeing them.

Removing a subteam from the portal and database is riskier, because existing members may have it set. Plan it with the website lead first.

---

## Update the sponsorship package

The "View Sponsorship Package" button at the top of `/sponsors` opens a PDF in a new tab.

- **New version of the package:** overwrite `public/sponsorship-package.pdf` with the new file, keeping the same name. No code change needed.
- **Moving it somewhere else** (e.g. a Google Drive link): change `SPONSORSHIP_PACKAGE_URL` in `components/sections/sponsors/constants.ts`. A full `https://...` link works there too.
- The button itself is in `components/sections/sponsors/SponsorHero.tsx`.

Check the PDF opens on a phone before pushing. Large PDFs (over ~10 MB) load slowly, so export a compressed version if needed.

---

## Update the reimbursement and purchase forms

The team portal has a **Reimbursements** page (`/admin/reimbursement`) that only leads and admins can see. It lists links to the club's Microsoft Forms.

- **Change a link or add a form:** edit the `FORMS` list at the top of `components/admin/reimbursement/ReimbursementPage.tsx`. Each form is one object with a `title`, `description` and `href`.
- **Change who can see it:** `canAccessReimbursement` in `lib/members/access.ts`. It currently allows `"admin"` and `"lead"`.
- The page is hidden from the portal menu for everyone else (`AdminShell.tsx`), and `PortalGate.tsx` redirects anyone who types the URL directly.

Who can *submit* a form is controlled in Microsoft Forms, not on the website. Keep the forms restricted to the organization's accounts.

---

## Update the demo page

The demo page (`/demo`) is assembled in `components/sections/demo/DemoClient.tsx`, which lists its sections in order. Each section is its own file in `components/sections/demo/`.

### Update the progress tracker and tech stack

Both are plain lists in `components/sections/demo/constants.ts`. No layout code needs to change.

- **`MILESTONES`**: the build timeline. Each item has a `label` and a `status` of `"done"`, `"active"` or `"upcoming"`. An `"active"` item can also have a `note` (e.g. `"In progress"`). When a milestone is finished, change its status to `"done"` and mark the next one `"active"`.
- **`SYSTEM_STACK`**: the hardware and software table. Each row has a `component`, `spec` and `status` (`"CONFIRMED"` or `"PLANNED"`).

### The LiDAR point cloud simulation

The "Live Point Cloud Simulation" section is a 3D scene drawn in the browser with React Three Fiber (three.js). Nothing runs on a robot or a server, and no external simulator such as Gazebo is involved.

| File | What it does |
|---|---|
| `components/sections/demo/PointCloudVisualization.tsx` | The section heading, and loads the 3D canvas only in the browser |
| `components/pointcloud/PointCloudCanvas.tsx` | Runs the scan animation and switches to user control when it ends |
| `components/pointcloud/usePointCloud.ts` | Generates the points: a noise-based terrain plus feature clusters (boulders, trunks), coloured by height |
| `components/pointcloud/parts/PointCloudScene.tsx` | Draws the points and the camera controls |
| `components/pointcloud/parts/ScanEffects.tsx`, `PointCloudHUD.tsx` | The sweep effect and on-screen readouts |
| `components/pointcloud/parts/constants.ts` | Settings: `POINT_COUNT` (3,000 on phones, 10,000 on desktop), `SCAN_DURATION`, `INTRO_HOLD` |

**Common changes:**

- **Colours:** the five `C_...` colours at the top of `usePointCloud.ts`, ordered from lowest to highest points.
- **Terrain features:** the `FEATURES` list in `usePointCloud.ts`. Each entry is one cluster: position (`cx`, `cz`), radius `r`, height `h`, and how many points it gets (`density`).
- **Performance:** lower `POINT_COUNT` if the page stutters on phones. Keep the phone value low, since every point is drawn every frame.
- **Scan speed:** `SCAN_DURATION`, in seconds.

### Planned rework: live LiDAR simulation

The plan is to replace the static terrain with an Autoware/RViz-style simulation: a rover drives through a 3D scene while a spinning LiDAR fires rays each frame, and every hit adds a point, so the map builds up as it moves. Points are coloured by height or distance.

Notes for whoever builds it:

- Build it as a new component in `components/pointcloud/` and swap it into `PointCloudVisualization.tsx`, so the old version stays available until the new one is ready.
- Cap the total number of points (drop the oldest beyond a limit), or phones will slow down over time.
- Keep the same `CanvasErrorBoundary` wrapper so a WebGL failure shows a fallback instead of breaking the page.
- Real data can be added later: a point cloud exported from RTAB-Map (ARGOS) or a Gazebo recording can be saved as `.ply` or `.pcd` and loaded with three.js's `PLYLoader` / `PCDLoader`. The website plays recorded data back; it doesn't run the simulator.

---

## Change the member count

The number appears in three places. Keep them in sync:

| File | What to change |
|---|---|
| `components/sections/AboutSection.tsx` | `<StatCounter end={55} ...` |
| `components/sections/sponsors/constants.ts` | `{ value: "55+", label: "Team Members" }` |
| `components/sections/demo/LiveMetrics.tsx` | `{ end: 55, label: "TEAM MEMBERS", ... }` |

---

## Add a link to the top menu

**File:** `components/nav/Navbar.tsx`, the `NAV_LINKS` list. Add an object where the link should appear:

```ts
{ label: "Projects", href: "/projects" },
```

It shows on desktop and in the phone menu. Also add new pages to `app/sitemap.ts` so search engines find them.

---

## Page titles, search results and link previews

**Adding or editing a page's title:** in that page's `page.tsx`, write only the page name:

```ts
export const metadata: Metadata = {
  title: "Projects",
  description: "One or two sentences Google shows under the link.",
  alternates: {
    canonical: "https://schulichroam.com/projects",
  },
};
```

Don't add ` | ROAM Robotics` yourself. `app/layout.tsx` adds it to every page through `title.template`, so writing it again shows it twice. The homepage (`app/page.tsx`) is the exception and keeps its full title.

Every new public page should also have:
- a `canonical` link with its full address, as above;
- an entry in `app/sitemap.ts`.

**Keeping pages out of Google:** add the path to `disallow` in `app/robots.ts`. `/admin`, `/portal`, `/sign-in` and `/sign-up` are already there.

**Link preview image:** when the site is shared on LinkedIn, Discord, texts and so on, the preview uses `public/og-image.png` (set in `app/layout.tsx` under `openGraph` and `twitter`). To change it, replace that file with a new **1200 × 630** PNG under the same name. Apps cache previews, so updates can take a few days to appear; LinkedIn's Post Inspector forces a refresh.

**Checking:** Chrome DevTools → Lighthouse → SEO, on the live site. Google Search Console (ask the website lead for access) shows which pages Google has indexed and any errors.

---

## Troubleshooting

**My changes don't show on the live site.**
The pull request must be merged and Vercel must deploy. Check the repo's Deployments page.

**My changes seem to have disappeared.**
You're probably on a different branch. VS Code's bottom-left corner shows the current branch. Each branch has its own version of the files.

**Files show as `deleted` after switching branches.**
Something (usually the dev server or a sync tool) held the files open. Stop the dev server, run `git restore .`, and switch again.

**"Missing Supabase env vars" or a Clerk "keyless mode" message.**
`.env.local` is missing. See [Getting set up](#getting-set-up).

**"The default export is not a React Component" / "Unsupported Server Component type".**
An import doesn't match its export:

| In the component file | Import it as |
|---|---|
| `export default function X()` | `import X from "..."` |
| `export const X = ...` | `import { X } from "..."` |

**Lint error about an apostrophe.**
In JSX text, write `'` as `&apos;` and `"` as `&quot;`, or reword. Plain quotes are fine inside normal strings like `"We're"` in `constants.ts`.

**3D viewer shows "Renderer error".**
Press F12 → Console and read the `[ROAM] 3D canvas error:` line.

| Console says | Fix |
|---|---|
| 404 / "Could not load" | The path in `constants.ts` doesn't match the file in `public/models/` exactly |
| "Unexpected token" / "Invalid glTF" | Not a real `.glb` (renaming doesn't convert it). Convert in Blender |
| Mentions "environment", "hdr" or "githack" | Keep `environment={null}` on `<Stage>` in `ModelViewer.tsx` |

**Push rejected with a 403.**
Your GitHub account doesn't have write access, or git is signed in as a different account. Run `git credential-manager github login` to sign in with the right one.

---

## Open work

Things in progress or waiting on someone. Remove an item when it's done, and add new ones as they come up.

| Item | What's needed | Waiting on |
|---|---|---|
| ARGOS 3D model | Replace the test model at `public/models/argos.glb` with the real `.glb` (see [Add a new 3D model](#add-a-new-3d-model)) | Thowfeeq |
| Merge `website-updates` | Open the pull request into `main` once the real model is in. Reviewer should check the reimbursement page with a lead account and a regular account | Reviewer |
| Vercel deploys | Production hasn't deployed from this repo since June 2026. Reconnect the repo in the Vercel project's Git settings | Vyapak |
| Local dev keys | Developers need a dev copy of `.env.local` to run `/apply`, `/team` and the portal locally | Vyapak |
| Subteam co-leads | The portal allows one lead per subteam (`app/api/members/[id]/route.ts`). Decide whether to allow co-leads; if yes, remove that check and show each lead's `title` on the team page | Vyapak |
| Third reimbursement form | Two forms are linked; add the third to `FORMS` if there is one | Kirill |
| About section "Disciplines" | `components/sections/AboutSection.tsx` lists 5 disciplines that don't match the 6 subteams. Decide whether to change them | Vyapak |
| Lock applications in the database | When recruitment closes, also turn off inserts on the Supabase `applications` table | Whoever has Supabase access |
| Demo LiDAR rework | Build the live LiDAR simulation (see [Update the demo page](#update-the-demo-page)). Do it on its own branch | Anyone |
| Lighthouse pass | After deploy, run Lighthouse (SEO, Accessibility) on the main pages and fix red items | Anyone |

---

## Change history

| Date | Change | By | Branch |
|---|---|---|---|
| May 2026 | Original website | Vyapak Bansal | — |
| Oct 2026 | Member count updated to 55 | Parin Patel | `update-member-count` (merged) |
| Oct 2026 | Recruitment on/off switch | Parin Patel | `recruitment-off-switch` |
| Oct 2026 | Subteams reduced to six (removed Computer Engineering and Mechatronics) | Parin Patel | `update-subteams` |
| Oct 2026 | Projects page with ARGOS and 3D model viewer | Parin Patel | `projects-section` |
| Oct 2026 | Sponsorship package button | Parin Patel | `sponsorship-package-button` |
| Oct 2026 | Leads-only reimbursement and purchase forms in the team portal | Parin Patel | `portal-reimbursement` |
| Oct 2026 | SEO fixes: page titles, canonical links, robots rules, structured data, social preview image | Parin Patel | `website-updates` |
| Oct 2026 | This guide | Parin Patel | `website-updates` |
