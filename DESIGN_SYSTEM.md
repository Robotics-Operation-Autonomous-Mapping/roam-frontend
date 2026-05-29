# ROAM — Design System & Engineering Aesthetics Manual

This manual provides an in-depth breakdown of the design architecture, typography, color palettes, interactive physics, and environmental overlays that constitute the **ROAM (Robotics Operation for Autonomous Mapping)** high-fidelity web portal. 

Emulating an industrial **"Mission Control"** and **"Engineering Intelligence"** theme, the interface translates high-precision physical robotics engineering into a state-of-the-art digital experience.

---

## 📡 1. The Design Paradigm: "Engineering Intelligence"

ROAM’s aesthetics reject generic, sterile web designs in favor of an **immersive, high-contrast, tactile, and command-center-like environment**. This design identity is characterized by:
*   **Tactile Textures**: Simulating physically-rendered screens, scopes, and glass instrumentation.
*   **Infrared & Laser-guided Styling**: Highlighting interactions with glowing, sharp coral components that echo scanning lasers and telemetry tracking.
*   **Telemetry Grid Frameworks**: Data arrays, coordinates, status markers, and mechanical bracket tags (`[ LABEL ]`) that suggest real-time structural processing.

---

## 🎨 2. Color System & Design Tokens

ROAM's dark-mode palette uses curated warm cream typography, deep Obsidian blacks, and a striking Coral primary tone to create depth, contrast, and visual punch.

### 🔳 Core Palette
These design tokens are declared as global CSS variables in [`app/globals.css`](file:///c:/Robotics%20Operation%20for%20Autonomous%20Mapping/roam-frontend/app/globals.css) and registered in [`tailwind.config.ts`](file:///c:/Robotics%20Operation%20for%20Autonomous%20Mapping/roam-frontend/tailwind.config.ts):

| Design Token | CSS Variable | Hex Color | Visual Purpose & Psychological Role |
| :--- | :--- | :--- | :--- |
| **`bg`** | `--color-bg` | `#0A0A0B` | **Deep Obsidian Black**. An absolute dark canvas that mimics raw outer space or a darkened robotics telemetry command room. |
| **`surface`** | `--color-surface` | `#111113` | **Carbon Grey (Base Surface)**. Used for component backing cards and containers to create structural depth. |
| **`surface-2`** | `--color-surface-2` | `#1A1A1E` | **Subtle Charcoal Grey**. Applied to secondary panels, input forms, code block containers, and scrollbar tracks. |
| **`primary`** | `--color-primary` | `#E8512A` | **Vivid Coral / Laser Orange**. The primary accent color symbolizing LiDAR laser sweeps, active telemetry, and clickable highlights. |
| **`primary-2`** | `--color-primary-2` | `#F07A50` | **Peach Coral / Soft Orange**. A slightly lighter, desaturated coral for button hover states and neon glow halos. |
| **`cream`** | `--color-cream` | `#F5ECD7` | **Warm White / Soft Cream**. The main body typography color. Eliminates blue-light fatigue and provides a premium, paper-like elegance. |
| **`muted`** | `--color-muted` | `#6B6B72` | **Cool Steel Grey**. Used for coordinates, micro-labels, subheadings, and inactive navigational states. |
| **`border`** | `--color-border` | `#222226` | **Muted Charcoal Border**. Creates razor-sharp, low-contrast section separations for neat, structural alignment. |

### 🚦 Data & Application Status Array (RGB Tokens)
Used for state chips, tracking, and applicant status filters in the Admin Portal. These are mapped with RGB vectors in CSS to support seamless variable-opacity backgrounds:

*   **`Pending`**: `rgb(138, 154, 178)` (Steel Blue) — Represents files currently in queue.
*   **`Reviewed`**: `rgb(58, 123, 213)` (Cobalt Blue) — Denotes active telemetry evaluations.
*   **`Interview`**: `rgb(232, 146, 42)` (Amber Orange) — Indicates real-time scheduling phases.
*   **`Accepted`**: `rgb(46, 204, 113)` (Emerald Green) — System success, integration, or mission entry.
*   **`Rejected`**: `rgb(217, 64, 64)` (Crimson Red) — Process bypass or halt.
*   **`Waitlisted`**: `rgb(155, 89, 182)` (Amethyst Purple) — Standby buffer queue.

### 🛡️ Telemetry Dashboard Theme (Admin Portal)
A slightly elevated, high-readability setup designed for heavy administration reviews:
*   `--admin-bg`: `#151518` (Softer Dark Base)
*   `--admin-bg-dark`: `#0F0F12` (Recessed Panels)
*   `--admin-surface`: `#222226` (Card Surfaces)
*   `--admin-surface-2`: `#2D2D33` (Form & Interactive Fields)
*   `--admin-text`: `#F5ECD7` (Warm Cream Typography)
*   `--admin-muted`: `#888890` (Technical Grey)
*   `--admin-border`: `#333338` (Defined Enclosures)
*   `--admin-accent`: `#E8512A` (Vivid Coral Highlights)

---

## 🔤 3. Typography & Font System

ROAM implements a hyper-specific three-tier font hierarchy utilizing Google Fonts loaded natively in Next.js 14 to maintain maximum performance and zero cumulative layout shifts (CLS).

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                               BEBAS NEUE (400)                               │
│                         - Display & Major Headings -                         │
├──────────────────────────────────────────────────────────────────────────────┐
│                                 DM Sans (Var)                                │
│                         - High-Readability Body Text -                       │
├──────────────────────────────────────────────────────────────────────────────┐
│                           JetBrains Mono (Var)                               │
│                   - Technical Metrics & HUD Telemetry -                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 1. The Display Face: `Bebas Neue`
*   **Token / Variable**: `var(--font-display)` | Tailwind Class: `font-display`
*   **Configuration**: `weight: "400"`, subset `"latin"`
*   **Application**: Large hero graphics, section titles, and action verbs (e.g. `EXPLORE. UNDERSTAND. RECREATE.`).
*   **Styling Standards**: All-Caps, reduced line spacing (`leading-[0.86]`), tracking adjustments to form dense, heavy structural blocks of text.

### 2. The Functional Face: `DM Sans`
*   **Token / Variable**: `var(--font-sans)` | Tailwind Class: `font-sans`
*   **Configuration**: Variable-weight, subset `"latin"`, `antialiased`
*   **Application**: Standard reading text, paragraphs, buttons, forms, and main navigation links.
*   **Styling Standards**: Balanced contrast, `tracking-wide` for maximum structural clarity, and comfortable line-heights (`leading-[1.85]`).

### 3. The Technical Face: `JetBrains Mono`
*   **Token / Variable**: `var(--font-mono)` | Tailwind Class: `font-mono`
*   **Configuration**: Variable-weight, subset `"latin"`
*   **Application**: Coordinates, altimeters, sensor values, status badges, tabular metrics, labels wrapped in brackets, and HUD elements.
*   **Styling Standards**: Uppercase tags, wide character spacing (`tracking-[0.3em]`), and low opacity values (e.g. `text-cream/45`) to represent machine log feedback.

---

## 🎬 4. Tactile UI & Atmospheric Interactivity

ROAM is a living app that reacts to mouse tracking, scrolling, and page-state adjustments. These interactions create a premium, tactile, and highly customized sensory experience.

### 🌾 Procedural Film Grain Overlay
Applied universally across the entire application viewport, this grain overlay prevents flat, artificial-looking web elements:
```css
body::after {
  content: "";
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: 50;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.04;
}
```
*   **Effect**: A gentle, animated analog television noise texture overlaid at an extremely subtle `0.04` opacity.

### 🎯 Concentric Hover Target Crosshairs (Custom Cursor)
On desktop screens, the browser's default cursor is replaced entirely with an custom SVG crosshair targeting array to emulate a surveying instrument:
*   **Standard Viewport State**: A solid primary Coral dot (`#E8512A`) that tracks mouse movements with pixel-perfect accuracy.
    ```html
    <circle cx='10' cy='10' r='4' fill='%23E8512A'/>
    ```
*   **Interactive / Hover State** (Links, buttons, form controls): The cursor morphs into a dual-ring targeting sight. An outer semi-transparent coral ring locks around a solid central point, reinforcing the theme of robotic tracking.
    ```html
    <circle cx='12' cy='12' r='6' fill='%23E8512A' opacity='0.6'/>
    <circle cx='12' cy='12' r='3' fill='%23E8512A'/>
    ```

### 🛰️ Landing HUD Telemetry Arrays
The hero landing experience features fixed top-left and top-right telemetry details in micro-spaced `JetBrains Mono` mimicking a spacecraft/rover display:
*   **Telemetry Left**: Status indicator showing club metadata: `ROAM / ATLAS-1 · Engineering · UofC · Status: Operational`.
*   **Telemetry Right**: Actual location metrics representing ROAM’s home base at the University of Calgary: `51.04° N 114.09° W · Alt: 1042M · Calgary, AB · Mission cycle: Active`.

### ⚡ LiDAR Sweep Scanner Reveal (Reveal Transition)
When the application page mounts, a horizontal bright Coral scanning laser sweeps vertically down the page:
*   **Details**: Utilizes high-precision rendering calculations inside an HTML5 Canvas container, clip-path insets (`clipPath: "inset(0 0 100% 0)"`), and a linear gradient to simulate active LiDAR mapping sweeps (`"SCANNING SURFACE ///"`). Once the laser sweeps past, the interactive landing scene is progressively unlocked.

### 🎮 Smooth Easing & Physics Integrations
Animations utilize advanced physics systems rather than linear movements to ensure premium, high-grade interactions:
*   **Stat Counters**: Numbers scroll rapidly using custom quadratic ease-out curves (`ease = 1 - Math.pow(1 - progress, 4)`).
*   **Interactive 3D Rover Controls**: The rover’s scroll tracking uses low-pass spring filters (`currentRoverY += (targetY - currentRoverY) * 0.15 * dt`) to slide gracefully along irregular virtual terrain profiles.
*   **3D Depth Point Clouds**: Emulates physical LiDAR outputs using `three` + `@react-three/fiber` particle systems that shift depending on mouse positioning.
