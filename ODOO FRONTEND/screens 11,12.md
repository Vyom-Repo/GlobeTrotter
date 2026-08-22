# GlobeTrotter — UI/UX Design Specification
### Screens 11 & 12 — Calendar / Timeline View · Admin Analytics Dashboard

**Version:** 1.0
**Theme:** `light-blue`
**Typeface:** Lora (display/headings) + Inter (UI/body/data)
**Companion document:** `GlobeTrotter_Design_Spec_Screens_8-9-10.md` — this file assumes the same design system. Tokens are restated in §1 so this file is usable standalone, but keep both files in sync if either changes.

---

## 0. How to use this document

Same rules as the companion spec: every value used in build must trace back to a token in §1. Screens 11 and 12 are structurally different from 8–10 — one is a dense date-grid, the other is a data/analytics surface — so this document leans harder on grid math, chart tokens, and data-table patterns than the previous one did.

---

## 1. Design Tokens (restated for consistency)

### 1.1 Color

```css
[data-theme="light-blue"] {
  /* Accent (from brief) */
  --palette-accent-50:  #e8f4ff;
  --palette-accent-100: #c0deff;
  --palette-accent-200: #8ac2ff;
  --palette-accent-300: #55a6ff;
  --palette-accent-400: #2090ff; /* Primary Light Blue */
  --palette-accent-500: #0073e6;
  --palette-accent-600: #005bcc;
  --palette-accent-700: #0044a3;
  --palette-accent-800: #002e7a;
  --palette-accent-900: #001852;

  /* Neutrals */
  --palette-neutral-0:   #ffffff;
  --palette-neutral-25:  #f7f9fc;
  --palette-neutral-50:  #eef2f8;
  --palette-neutral-100: #e2e8f0;
  --palette-neutral-200: #cbd5e1;
  --palette-neutral-300: #a3b1c4;
  --palette-neutral-400: #7c8ba1;
  --palette-neutral-500: #5b6b82;
  --palette-neutral-600: #445167;
  --palette-neutral-700: #313c4e;
  --palette-neutral-800: #202836;
  --palette-neutral-900: #12161f;

  /* Semantic */
  --color-success-50:  #e9f9ee; --color-success-400: #34b167; --color-success-600: #1f8a4c;
  --color-warning-50:  #fff6e6; --color-warning-400: #f5a623; --color-warning-600: #c17d0a;
  --color-danger-50:   #fdebeb; --color-danger-400:  #e5484d; --color-danger-600:  #b3231f;

  /* Role mapping */
  --color-bg-page: var(--palette-neutral-25);
  --color-bg-surface: var(--palette-neutral-0);
  --color-bg-surface-alt: var(--palette-neutral-50);
  --color-bg-sunken: var(--palette-neutral-100);
  --color-text-primary: var(--palette-neutral-900);
  --color-text-secondary: var(--palette-neutral-600);
  --color-text-tertiary: var(--palette-neutral-400);
  --color-text-on-accent: #ffffff;
  --color-border-subtle: var(--palette-neutral-100);
  --color-border-default: var(--palette-neutral-200);
  --color-border-strong: var(--palette-neutral-300);
  --color-accent: var(--palette-accent-400);
  --color-accent-hover: var(--palette-accent-500);
  --color-accent-active: var(--palette-accent-600);
  --color-accent-subtle: var(--palette-accent-50);
  --color-accent-border: var(--palette-accent-200);
  --color-focus-ring: var(--palette-accent-300);
}
```

### 1.2 Chart / Data-Viz palette (new — needed for Screen 12)

Analytics screens need a categorical palette beyond the single accent ramp, so multi-series charts (pie/donut segments, bar series) stay distinguishable while still reading as "part of the same brand." Built by rotating hue around the accent while holding saturation/lightness close, plus two warm outliers for contrast on the pie chart:

```css
--chart-1: var(--palette-accent-400);  /* #2090ff — primary series */
--chart-2: #34b167;                    /* success green — secondary series */
--chart-3: #f5a623;                    /* warning amber — tertiary series */
--chart-4: #8a6de0;                    /* violet — quaternary, chosen to sit between accent and warm tones */
--chart-5: #e5484d;                    /* danger red — reserved for "at risk / churn" series only, never decorative */
--chart-grid-line: var(--palette-neutral-100);
--chart-axis-label: var(--palette-neutral-500);
```

**Rule:** `--chart-5` (red) is semantically reserved — only use it for a series that actually represents a negative/risk metric (e.g. drop-off, cancellations). Never use it just because you've run out of palette slots.

### 1.3 Typography

| Token | Size/LH | Family | Weight | Usage |
|---|---|---|---|---|
| `--text-display-lg` | 32/40px | Lora | 600 | Screen H1 |
| `--text-display-md` | 24/32px | Lora | 600 | Section headers ("Calendar View", "Platform Overview") |
| `--text-display-sm` | 20/28px | Lora | 500 | Card/panel titles, month name |
| `--text-body-lg` | 16/24px | Inter | 400 | Primary text |
| `--text-body-md` | 14/20px | Inter | 400 | Default UI text |
| `--text-body-sm` | 13/18px | Inter | 400 | Meta, captions, axis labels |
| `--text-label` | 12/16px, uppercase, 0.04em | Inter | 600 | KPI labels, table headers, day-of-week headers |
| `--text-numeric` | 14–28px, tabular-nums | Inter | 600–700 | KPI figures, dates, all table numbers |

> Calendar day numbers and every stat on the Admin dashboard must use `font-variant-numeric: tabular-nums` — non-negotiable for a grid of digits that needs to feel aligned rather than hand-set.

### 1.4 Spacing / Radius / Elevation / Breakpoints / Motion
Identical to companion spec §1.3–1.5 — see that document. Two additions specific to this file:

```css
--radius-none: 0px;      /* calendar day cells sit flush, no rounding, to read as a true grid */
--kpi-card-min-width: 180px;
```

---

## 2. Screen 11 — Calendar View Screen

### 2.1 Purpose
Per PDF §10 ("Trip Calendar / Timeline Screen"): a month-grid visualization of all the user's trips across time, so they can see at a glance where their travel dates overlap, cluster, or leave gaps. The wireframe shows a classic 7-column month grid with trip names inline in the relevant day cells (e.g. "PARIS TRIP," "NYC – GETAWAY," "JAPAN ADVENTURE").

### 2.2 Layout (desktop, 1024px+)

```
┌──────────────────────────────────────────────────────────────┐
│ GlobeTrotter                                          [●][○]  │  Header
├──────────────────────────────────────────────────────────────┤
│ [ Search bar ..... ] [Group by▾][Filter▾][Sort by▾]            │  Control bar
├──────────────────────────────────────────────────────────────┤
│                        Calendar View                           │  Lora, --text-display-md
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  ←        January 2024        →      [Month▾] [Today]      │ │  Calendar header
│  ├────┬────┬────┬────┬────┬────┬────┤                        │ │
│  │SUN │MON │TUE │WED │THU │FRI │SAT │                        │ │  Day-of-week row
│  ├────┼────┼────┼────┼────┼────┼────┤                        │ │
│  │    │    │    │    │    │  1 │  2 │                        │ │
│  ├────┼────┼────┼────┼────┼────┼────┤                        │ │
│  │  3 │  4 │  5 │  6 │  7 │  8 │ 9  │                        │ │
│  │    │    │    │    │    │    │▓PARIS TRIP▓                 │ │
│  ├────┼────┼────┼────┼────┼────┼────┤                        │ │
│  │ 10 │ 11 │ 12 │ 13 │ 14 │ 15 │ 16 │                        │ │
│  │▓▓▓▓▓ PARIS TRIP (cont.) ▓▓▓▓▓▓▓▓ │▓NYC-GETAWAY▓▓▓▓▓▓▓▓▓▓▓│ │
│  ├────┼────┼────┼────┼────┼────┼────┤                        │ │
│  │ 17 │ 18 │ 19 │ 20 │ 21 │ 22 │ 23 │                        │ │
│  │▓▓▓ JAPAN ADVENTURE ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │                        │ │
│  └────┴────┴────┴────┴────┴────┴────┘                        │ │
└──────────────────────────────────────────────────────────────┘
```

### 2.3 Component: Calendar Header
- `44px` row: left/right chevron nav buttons (ghost, 32×32px hit area) flanking the month label (`--text-display-sm`, Lora), then right-aligned a view-mode dropdown (`Month / Week / Agenda`) and a `Today` secondary button that jumps to the current date.
- Keyboard support: `←/→` change month when the header has focus; `Enter` on the month label opens a quick year/month jump menu.

### 2.4 Component: Day-of-Week Row
- 7-column grid, `--text-label` styling, `--color-text-tertiary`, centered, `height: 32px`, bottom border `1px solid --color-border-default`.
- Sunday/Saturday get no special color treatment by default (keep this a planning tool, not a "weekend highlight" calendar) unless the user explicitly filters to weekend-only trips.

### 2.5 Component: Date Cell (the core building block)
- Grid: `7` equal columns × up to `6` rows, using CSS Grid (`display: grid; grid-template-columns: repeat(7, 1fr);`), each cell `min-height: 96px` desktop, `--radius-none` (flush grid, per §1.4), `1px solid --color-border-subtle` on all sides (grid lines, not individual card borders — avoid doubled borders by using `border-collapse`-style negative margins or box-shadow insets).
- **Date number:** top-left of cell, `--text-numeric`, `14px`, `--color-text-secondary`. Today's cell: date number sits inside a filled `24px` circle, `--color-accent` bg, white text.
- **Out-of-month days** (leading/trailing days from adjacent months, visible in a 6-row grid): date number in `--color-text-tertiary` at 50% opacity, cell background `--color-bg-surface-alt`, no trip bars render on these even if a trip technically spans into them — they're context, not actionable.
- **Trip bar(s):** this is the signature interaction of the screen. A trip spanning multiple days renders as a single continuous horizontal bar that runs *across* the day cells it covers (like a Gantt/booking-calendar bar), not a repeated label in every cell:
  - `height: 22px`, `--radius-sm` on the two rounded end-caps only (start day and end day of that row-segment), squared where it's cut off by a week boundary and continues to the next row.
  - Background: one of `--chart-1` through `--chart-4` assigned per-trip (cycled, consistent per trip across the whole calendar — store a `tripId → color` mapping so the same trip is always the same color everywhere, including Screen 9's timeline if it ever needs a color accent).
  - Label: trip name, `--text-body-sm`, 600 weight, white text, truncated with ellipsis if the bar is too short to fit it (e.g. a 1-day trip) — in that case, rely on tap/hover to reveal the full name.
  - Stacking: if two trips overlap the same date range (edge case, but real — e.g. planning conflict), stack a second bar below the first with `4px` gap; cell height grows to accommodate up to 2 stacked bars before switching to a "+N more" pill.
- **Hover/click on a trip bar:** desktop hover shows a tooltip card (trip name, date range, `View itinerary →` link). Click navigates to Screen 9 (Itinerary View) for that trip. Click on empty cell space (no trip) opens "+ Plan a trip" starting on that date, reusing Screen 4's Create Trip flow.

### 2.6 States
- **No trips this month:** grid still renders fully (dates matter even with nothing planned) but every cell is empty — no special empty-state illustration needed here, since an empty calendar is self-explanatory, unlike an empty search list.
- **Loading:** the grid structure renders immediately (skeleton isn't needed for the chrome), but trip bars render as low-opacity `--color-bg-sunken` shimmer blocks until data resolves.
- **Trip pending/unconfirmed** (e.g. dates set but itinerary not yet built): bar renders with a diagonal-stripe pattern fill instead of solid color, signaling "planned but not finalized" without needing extra copy.

### 2.7 Responsive
- **Tablet:** cell `min-height` drops to `72px`; trip bar labels may need to abbreviate ("PARIS" not "PARIS TRIP") — truncate by width, don't hardcode abbreviations.
- **Mobile:** month grid is genuinely hard to use below ~380px with inline bars — switch to **Agenda view** as the default (a vertical list of dates with trip chips beside each date that has one), and offer the grid as a secondary toggle. This is a deliberate platform-appropriate deviation from the wireframe's desktop-first grid, not a shortcut — call it out to your team as intentional.

---

## 3. Screen 12 — Admin Panel / Analytics Dashboard

### 3.1 Purpose
Per PDF §13 (optional but included in the wireframe): admin-only view of platform usage — trip creation trends, popular cities/activities, user engagement, and user-management tools. The wireframe shows a left-nav-less top-tab layout (`Manage Users / Popular Cities / Popular Activities / User Trends and Analytics`) with a KPI-and-chart body and a right-side annotation panel.

### 3.2 Layout (desktop, 1024px+)

```
┌──────────────────────────────────────────────────────────────┬─────────────┐
│ GlobeTrotter                                          [●][○]  │             │
├──────────────────────────────────────────────────────────────┤  ANNOTATION │
│ [ Search bar ..... ][Group▾][Filter▾][Sort by▾]                │  PANEL      │
├──────────────────────────────────────────────────────────────┤  (section    │
│ [Manage Users] [Popular Cities] [Popular Activities] [Trends] │  descriptions│
├──────────────────────────────────────────────────────────────┤  per the     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                  │  wireframe's │
│  │ 12,480 │ │  3,204  │ │  842   │ │  91%   │   KPI row         │  right note) │
│  │ Users  │ │  Trips  │ │ Active │ │ Retain │                  │             │
│  └────────┘ └────────┘ └────────┘ └────────┘                  │             │
│  ┌──────────────────────┐  ┌────────────────────────────────┐│             │
│  │   Donut: trip split   │  │  Line: user growth over time    ││             │
│  │   by category          │  │                                  ││             │
│  └──────────────────────┘  └────────────────────────────────┘│             │
│  ┌────────────────────────────────────────────────────────┐  │             │
│  │  Bar: top 5 popular cities         │  Ranked list          │  │             │
│  └────────────────────────────────────────────────────────┘  │             │
└──────────────────────────────────────────────────────────────┴─────────────┘
```

### 3.3 Component: Section Tabs
- Matches the wireframe's four labeled buttons: `Manage Users`, `Popular Cities`, `Popular Activities`, `User Trends and Analytics`.
- Style: underline-tab pattern (not pill, to distinguish admin chrome from the traveler-facing filter pills elsewhere in the app) — `padding: 12px 4px`, `--text-body-md` 600 weight, `--color-text-secondary` default, `--color-accent-active` + `2px solid --color-accent` bottom border when active. `--duration-fast` underline slide transition between tabs.
- Each tab swaps the entire body region below (§3.4–3.7) — treat as independent routed views, not an accordion.

### 3.4 Component: KPI Card (used across all four tabs)
- Grid of cards, `repeat(auto-fit, minmax(var(--kpi-card-min-width), 1fr))`, `gap: var(--space-4)`.
- Card: `--color-bg-surface`, `--radius-lg`, `1px solid --color-border-subtle`, `padding: var(--space-5)`.
- Content: `--text-label` metric name at top (`--color-text-tertiary`), large `--text-numeric` value below (`28px`, 700 weight, `--color-text-primary`), and a small trend indicator beside it: `▲ 12%` in `--color-success-600` or `▼ 4%` in `--color-danger-600`, `--text-body-sm`.
- Never show a trend arrow without a comparison period label underneath in `--color-text-tertiary` (e.g. "vs. last 30 days") — an unlabeled arrow is a common dashboard mistake and misleads readers.

### 3.5 Component: Chart Cards
- Same card shell as KPI cards but larger, `min-height: 320px`, header row: `--text-display-sm` (Lora) title + optional ghost "⋯" menu for `Export CSV` / `View full data`.
- **Donut (category split — e.g. trip types, or user tiers):** center label shows the total count, matching the pattern from Screen 9's budget donut for cross-screen consistency. Segments use `--chart-1` → `--chart-4` in a fixed, legend-matched order. Legend: horizontal row below the chart, colored dot + label + percentage, `--text-body-sm`.
- **Line chart (growth/trend over time — e.g. "User Trends and Analytics" tab):** `--chart-1` stroke, `2px`, with a soft area-fill gradient from `--color-accent-subtle` to transparent beneath the line. Gridlines: `--chart-grid-line`, horizontal only (no vertical gridlines — reduces visual noise). Axis labels: `--text-body-sm`, `--chart-axis-label`. Hover: vertical crosshair + tooltip showing exact value + date.
- **Bar chart (rankings — e.g. "Popular Cities," "Popular Activities"):** horizontal bars (not vertical) when ranking named items with a long tail of labels — city/activity names are text-length-variable and read better left-aligned than rotated under vertical bars. Bar fill `--chart-1`, `--radius-sm` end cap, value label right of each bar in `--text-numeric`. Sort descending by default; top item gets a subtle `--color-accent-subtle` row background to draw the eye without needing a "#1" badge.

### 3.6 Component: Manage Users Table (Manage Users tab)
- Standard data table, not cards — admin tables should be scannable and dense:
  - Header row: `--text-label`, `--color-bg-surface-alt` background, `height: 40px`, sortable columns show a chevron on hover/active.
  - Body rows: `height: 52px`, `1px solid --color-border-subtle` bottom border, hover `--color-bg-surface-alt`.
  - Columns: Avatar+Name, Email, Signup date, Trips created (`--text-numeric`), Status (badge: `Active` in `--color-success-50`/`600`, `Suspended` in `--color-danger-50`/`600`), Actions (ghost "⋯" menu → View / Suspend / Delete).
  - Row selection: checkbox column for bulk actions, appears as a `40px` first column; selecting any row reveals a sticky bulk-action bar above the table ("3 selected — Suspend / Export / Cancel").
  - Pagination footer: `Rows per page ▾` + page number controls, right-aligned, `--text-body-sm`.
- Search bar in the shared control bar (§2.2 of companion doc) filters this table live; `Filter ▾` exposes Status and Signup-date-range filters.

### 3.7 Component: Annotation / Context Panel (right column)
- Matches the wireframe's right-side descriptive text blocks per section.
- Sticky card, `--color-bg-surface-alt`, `--radius-lg`, `padding: var(--space-4)`, `width: 280px`.
- Structure per active tab: Lora `--text-display-sm` heading matching the tab name, then 2–3 short Inter paragraphs (`--text-body-sm`, `--color-text-secondary`) explaining what the section shows and how to use search/filter/sort/group to narrow it — written in the interface's own plain voice, e.g. *"This section tracks which cities users are visiting most, based on current trip data. Use filters to narrow by date range or region."*
- This panel updates its copy when the tab changes but keeps the same visual position — treat content-swap as a `--duration-fast` cross-fade, not a layout jump.

### 3.8 States
- **Loading:** KPI cards show skeleton pulses on the number only (label stays static since it's known immediately); charts show a skeleton axis + flat skeleton bar/line/donut ring.
- **No data for date range:** chart card body replaced with a centered "No data for this period" message (`--text-body-md`, `--color-text-tertiary`) — keep the card frame/title visible so the layout doesn't jump.
- **Table empty (e.g. filtered to zero users):** standard empty-row state inside the table body, spanning all columns: "No users match these filters."
- **Permission-gated:** if a signed-in admin lacks a specific permission (e.g. can view but not suspend users), the relevant action is shown disabled with a tooltip "Requires super-admin," never hidden outright — hiding controls silently is disorienting for admins comparing notes with each other.

### 3.9 Responsive
- **Tablet:** annotation panel collapses to a dismissible info banner above the KPI row (ⓘ icon + one-line summary, "Learn more" expands the full text inline) rather than a persistent side column.
- **Mobile:** KPI cards go 2-per-row; charts stack full-width, `min-height` reduces to `240px`; the Manage Users table converts to stacked row-cards (avatar+name+status on line 1, remaining fields as label:value pairs below) since a wide table cannot compress meaningfully on a small screen — this mirrors the same table-to-card responsive pattern most senior systems use rather than forcing horizontal scroll on a data table.

---

## 4. Cross-Screen Consistency Notes (11 & 12)

- **Trip color mapping** introduced in §2.5 (`tripId → chart color`) should be the single source of truth reused anywhere else a trip needs a color accent — including any trip-colored elements added later to Screens 8–10.
- **Donut chart component** is shared verbatim between Screen 9's budget panel (companion doc §4.5) and Screen 12's category-split chart (§3.5) — build one `<DonutChart>` primitive with a `centerLabel` prop, don't fork it.
- KPI trend arrows (§3.4) and budget-state color transitions (companion doc §4.5) both use the same `success/warning/danger` semantic tokens from §1.1 — never introduce a second red/green pair.

---

## 5. Accessibility Additions (specific to 11 & 12)

- Calendar grid: each date cell is a `<button>` or `role="gridcell"` within `role="grid"`, with `aria-label` combining the full date and any trip name(s) present ("January 9, 2024, Paris Trip departure"). Arrow-key navigation moves focus between cells; `Enter`/`Space` opens the cell's detail.
- Charts: every chart card includes a visually-hidden data table (`sr-only` class, not `display:none`) as a fallback for screen readers, since SVG chart internals are rarely announced usefully on their own.
- Admin table: column headers use `<th scope="col">`; sort state announced via `aria-sort="ascending|descending|none"`.
- Status badges (Active/Suspended) always pair color with text — never a bare colored dot in the admin table.

---

## 6. Dev Handoff Notes

- Build the calendar grid with CSS Grid + a date-utility library (e.g. `date-fns`) for month math (leading/trailing days, leap years) — don't hand-roll date arithmetic.
- Trip bars spanning week boundaries are the trickiest part of Screen 11: compute bar segments per calendar row (a trip crossing a Saturday→Sunday boundary is two visual segments, one `Trip`), not one DOM element stretched with `position:absolute` across the whole grid — the row-segment approach handles variable row heights and reflow correctly.
- Reuse the companion spec's skeleton-loader primitive (§7 there) for KPI/table/chart loading states here — same component, different slot dimensions.
- Chart library: any of Recharts/Chart.js/D3 works; whichever is chosen, wire colors exclusively from `--chart-1..5` custom properties (read via `getComputedStyle` at chart-init time) so a future theme swap doesn't require touching chart code.
