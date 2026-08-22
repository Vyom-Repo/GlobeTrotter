# GlobeTrotter — UI/UX Design Specification
### Screens 8, 9 & 10 — Activity/City Search · Itinerary + Budget View · Community Tab

**Version:** 1.0
**Theme:** `light-blue`
**Typeface:** Lora (display/headings) + Inter (UI/body) — pairing rationale below
**Prepared for:** Frontend build handoff (hackathon delivery)

---

## 0. How to use this document

This spec is written the way a senior product designer would hand off to an engineer: every token is named, every component has states, and every screen has a grid, spacing rhythm, and edge-case behavior defined — not just a "happy path" mock. Build strictly off the tokens in §1; never hardcode a hex value or px number that isn't defined here. If a value is missing, extend the scale using the same ratio, don't invent an outlier.

---

## 1. Design Tokens

### 1.1 Color System

The brief supplies the accent ramp. A senior UI system never ships an accent ramp alone — it needs neutrals (for 90% of the UI surface: text, backgrounds, borders) and semantic colors (for budget states, alerts, success). Below is the full palette, with the brief's accent preserved exactly and the rest built to sit correctly against it.

```css
[data-theme="light-blue"] {
  /* ── Accent (from brief — do not alter) ───────────────── */
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
  --palette-name: "light-blue";

  /* ── Neutrals (cool-tinted to sit correctly next to the blue) ── */
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

  /* ── Semantic (budget & status — required for Screen 9) ── */
  --color-success-50:  #e9f9ee;
  --color-success-400: #34b167;
  --color-success-600: #1f8a4c;

  --color-warning-50:  #fff6e6;
  --color-warning-400: #f5a623;
  --color-warning-600: #c17d0a;

  --color-danger-50:   #fdebeb;
  --color-danger-400:  #e5484d;
  --color-danger-600:  #b3231f;

  /* ── Role mapping (what components actually consume) ── */
  --color-bg-page:        var(--palette-neutral-25);
  --color-bg-surface:     var(--palette-neutral-0);
  --color-bg-surface-alt: var(--palette-neutral-50);
  --color-bg-sunken:      var(--palette-neutral-100);

  --color-text-primary:   var(--palette-neutral-900);
  --color-text-secondary: var(--palette-neutral-600);
  --color-text-tertiary:  var(--palette-neutral-400);
  --color-text-on-accent: #ffffff;

  --color-border-subtle:  var(--palette-neutral-100);
  --color-border-default: var(--palette-neutral-200);
  --color-border-strong:  var(--palette-neutral-300);

  --color-accent:         var(--palette-accent-400);
  --color-accent-hover:   var(--palette-accent-500);
  --color-accent-active:  var(--palette-accent-600);
  --color-accent-subtle:  var(--palette-accent-50);
  --color-accent-border:  var(--palette-accent-200);

  --color-focus-ring:     var(--palette-accent-300);
}
```

**Contrast check (WCAG AA):** `--palette-accent-500 (#0073e6)` on white = 4.6:1 (passes for text ≥14px bold / UI components). `--palette-accent-600 (#005bcc)` on white = 6.1:1 (safe for all body text). **Rule:** never place body copy on `--palette-accent-400`; reserve 400 for large surfaces, icons, and filled buttons where white text sits on top.

### 1.2 Typography

**Pairing decision:** Lora is a warm, high-contrast serif — excellent for a travel brand's emotional, editorial moments (trip titles, empty states, hero copy), but its bracketed serifs and moderate x-height slow down scanning in dense, numeric UI like search-result lists and budget tables. A senior system pairs it with a neutral grotesque for those surfaces rather than forcing Lora everywhere. **Inter** is the pairing: it shares Lora's calm, humanist proportions without competing, and is free/self-hostable alongside Lora from Google Fonts.

| Role | Family | Used for |
|---|---|---|
| Display / Editorial | **Lora** (400, 500, 600, 700) | Screen titles, section headers ("Itinerary for a selected place"), empty-state headlines, trip/city names as headline text |
| UI / Body / Data | **Inter** (400, 500, 600, 700) | Nav, buttons, form fields, list items, budget numbers, filters, timestamps, community post body |

```css
--font-display: "Lora", Georgia, serif;
--font-body: "Inter", -apple-system, "Segoe UI", sans-serif;
```

**Type scale** (1.25 major-third ratio, 16px base):

| Token | Size / Line-height | Family | Weight | Usage |
|---|---|---|---|---|
| `--text-display-lg` | 32px / 40px | Lora | 600 | Screen H1 (rare, top of page) |
| `--text-display-md` | 24px / 32px | Lora | 600 | Section headers: "Itinerary for a selected place", "Community" |
| `--text-display-sm` | 20px / 28px | Lora | 500 | Card/panel titles, day headers ("Day 1") |
| `--text-body-lg` | 16px / 24px | Inter | 400 | Primary reading text, activity names |
| `--text-body-md` | 14px / 20px | Inter | 400 | Default UI text, list item body, post text |
| `--text-body-sm` | 13px / 18px | Inter | 400 | Meta text, timestamps, helper text |
| `--text-label` | 12px / 16px | Inter | 600, uppercase, 0.04em tracking | Filter chip labels, section eyebrows, badges |
| `--text-numeric` | 14–20px / tabular-nums | Inter | 600 | All currency and count values (tabular figures so columns align) |

> **Rule:** Any number representing money, count, or a date **must** use `font-variant-numeric: tabular-nums;` on Inter — this is what makes the budget column in Screen 9 feel professional instead of jittery.

### 1.3 Spacing, Radius, Elevation

```css
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
--space-5: 20px;  --space-6: 24px;  --space-8: 32px;  --space-10: 40px;
--space-12: 48px; --space-16: 64px;

--radius-sm: 6px;   /* chips, small buttons */
--radius-md: 10px;  /* inputs, filter bar, list rows */
--radius-lg: 16px;  /* cards, panels */
--radius-full: 999px; /* avatars, pills */

--shadow-xs: 0 1px 2px rgba(18,22,31,0.04);
--shadow-sm: 0 2px 6px rgba(18,22,31,0.06);
--shadow-md: 0 8px 24px rgba(18,22,31,0.08);
--shadow-focus: 0 0 0 3px var(--color-focus-ring);
```

### 1.4 Breakpoints

```css
--bp-mobile: 0–599px      /* single column, stacked */
--bp-tablet: 600–1023px   /* 2-col where noted */
--bp-desktop: 1024–1439px /* base spec below is authored at this width */
--bp-wide: 1440px+        /* content max-width 1200px, centered */
```

### 1.5 Motion

```css
--ease-standard: cubic-bezier(0.2, 0, 0, 1);
--duration-fast: 120ms;   /* hover, focus */
--duration-base: 200ms;   /* expand/collapse, tab switch */
--duration-slow: 320ms;   /* modal, drawer */
```
Respect `prefers-reduced-motion`: disable transform/slide transitions, keep opacity fades only.

---

## 2. Shared Global Components

These appear identically across all three screens — build once, reuse everywhere.

### 2.1 App Header
- Height: `64px`, background `--color-bg-surface`, bottom border `1px solid --color-border-subtle`.
- Left: "GlobeTrotter" wordmark, `--font-display`, 20px, 600 weight, `--color-text-primary`.
- Right: profile avatar (32px circle, `--radius-full`), notification bell icon (outline style, 20px), both with `--space-4` gap.
- Sticky on scroll (`position: sticky; top: 0; z-index: 40;`) with `--shadow-xs` once `scrollY > 0`.

### 2.2 Search / Group / Filter / Sort Control Bar
Appears on Screens 8, 9, and 10 per the wireframe. Standardize as **one component with slots**, not three separate bars.

- Container: height `44px`, `--radius-md`, `1px solid --color-border-default`, background `--color-bg-surface`.
- Layout (desktop): `[ Search input — flex:1 ] [ Group by ▾ ] [ Filter ▾ ] [ Sort by ▾ ]`, `--space-3` gaps.
- Search input: left-aligned magnifier icon (16px, `--color-text-tertiary`), placeholder `--text-body-md` in `--color-text-tertiary`, no visible border until focused.
- Dropdown triggers (`Group by`, `Filter`, `Sort by`): pill buttons, `--radius-full`, `1px solid --color-border-default`, `--text-body-sm` 500 weight, chevron-down 12px icon. Active/applied state: border becomes `--color-accent`, background `--color-accent-subtle`, text `--color-accent-active`, and a small numeric badge shows count of applied filters.
- Focus state on search input: `--shadow-focus` ring, border `--color-accent`.
- **Mobile:** search input full width on its own row; Group/Filter/Sort collapse into a single "Filters" button that opens a bottom sheet.

### 2.3 Buttons

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| Primary | `--color-accent` → `--color-accent-hover` on hover | `--color-text-on-accent` | none | "Add to Trip", "Post" |
| Secondary | `--color-bg-surface` | `--color-accent-active` | `1px solid --color-accent-border` | "View", "Filter" |
| Ghost | transparent | `--color-text-secondary` | none | icon-only actions, "Cancel" |
| Danger | `--color-danger-50` | `--color-danger-600` | `1px solid --color-danger-400` | "Remove activity" |

All buttons: height `36px` (compact `28px` for inline list actions), `--radius-md`, `--text-body-sm` 600 weight, `padding: 0 16px`, `transition: background var(--duration-fast) var(--ease-standard)`.

### 2.4 Cards
- Base card: `--color-bg-surface`, `--radius-lg`, `1px solid --color-border-subtle`, `--shadow-xs` resting, `--shadow-sm` on hover with `translateY(-2px)` (desktop only, disabled on touch).

---

## 3. Screen 8 — Activity Search / City Search Page

### 3.1 Purpose & user goal
User arrives here from the Itinerary Builder ("Add Stop" / "add activity to a section") wanting to find a **city** or an **activity** to slot into their trip. Per the problem statement this screen serves two related backend queries (City Search §7, Activity Search §8 of the PDF) sharing one UI shell — the mock shows this as a unified results list with a search chip above it (e.g. "Paragliding").

### 3.2 Layout (desktop, 1024px+)

```
┌──────────────────────────────────────────────────────────────┐
│ GlobeTrotter                                          [●][○]  │  Header, 64px
├──────────────────────────────────────────────────────────────┤
│  [ Active query chip: "Paragliding" ×]                        │  Search context, 40px
│  [ Search bar ............... ] [Group by ▾][Filter ▾][Sort▾] │  Control bar §2.2
├──────────────────────────────────────────────────────────────┤
│  RESULTS               "128 results"      [Grid ▤][List ☰]    │  Results header
│  ┌────────────────────────────────────────────────────────┐  │
│  │ [img 64×64]  Activity/City name          [ Add + ]      │  │  Result row, repeat
│  │              Type · Duration · Cost index  ★4.6 (212)    │  │
│  └────────────────────────────────────────────────────────┘  │
│  … 6–8 visible rows, virtualized/paginated below the fold …   │
└──────────────────────────────────────────────────────────────┘
```

### 3.3 Component: Result Row (the core building block)

The wireframe shows a flat "Option and its details" row seven times — treat this as one component:

- Container: full width, `min-height: 80px`, `padding: var(--space-4)`, bottom border `1px solid --color-border-subtle` (last row: no border), background transparent → `--color-bg-surface-alt` on hover.
- **Left:** thumbnail image, `64×64px`, `--radius-md`, `object-fit: cover`. Fallback: `--color-bg-sunken` block with a location-pin icon if no image (never a broken-image icon).
- **Center (flex: 1):**
  - Title — `--text-body-lg`, 600 weight, `--color-text-primary`, truncate with ellipsis at 1 line.
  - Meta line — `--text-body-sm`, `--color-text-secondary`, format: `{Type} · {Duration or "Full day"} · {Cost tier: $ / $$ / $$$}`
  - Rating row — 5-star icon set (14px, `--color-warning-400` filled / `--color-border-default` empty) + `"4.6 (212)"` in `--text-body-sm`.
- **Right:** `Add +` secondary button (§2.3). On click → becomes a filled "Added ✓" state in `--color-success-50` bg / `--color-success-600` text for 2s, then either persists as "Added ✓" (disabled ghost) or reverts to allow "Remove," depending on whether it's already in the itinerary — **never leave it ambiguous whether an item is already added.**
- Tap target on mobile: entire row is tappable to expand a bottom sheet with full description + image gallery + the Add button, since the 64px thumbnail alone isn't enough info on a small screen.

### 3.4 Filter panel (triggered from "Filter ▾")
Dropdown/sheet containing checkbox groups:
- **Type:** Sightseeing, Food & Drink, Adventure, Culture, Nightlife, Nature
- **Cost:** $ / $$ / $$$
- **Duration:** <2 hrs, Half-day, Full-day, Multi-day
- Footer: `Clear all` (ghost) + `Apply (N)` (primary), sticky to bottom of the panel.

### 3.5 States
- **Loading:** skeleton rows — gray `--color-bg-sunken` blocks in place of thumbnail/title/meta, shimmer animation `1.5s` loop, respecting reduced-motion (static gray if disabled).
- **Empty (no results):** centered illustration placeholder + Lora headline "Nothing matches yet" + Inter subtext "Try a different city or clear your filters" + `Clear filters` button. Never show a raw blank list.
- **Error:** inline banner, `--color-danger-50` bg, `--color-danger-600` text, retry button.
- **End of results (pagination):** "Load more" secondary button centered, OR infinite scroll with a 40px loading spinner footer — pick one; spec assumes **infinite scroll** for a search page since users compare many items.

### 3.6 Responsive
- **Tablet:** thumbnail shrinks to 56px, Group by/Sort collapse into one "Sort & Group" dropdown.
- **Mobile:** single column, control bar becomes 2 rows (search full-width row 1; "Filters (N)" pill row 2), rows keep 56px thumbnail, rating row wraps under meta if needed.

---

## 4. Screen 9 — Itinerary View Screen (with Budget Section)

### 4.1 Purpose
This is the PDF's **Itinerary View Screen (§6)** and **Trip Budget & Cost Breakdown Screen (§9)** merged, matching the wireframe's single-screen "Itenary for a selected place" with a day-by-day activity list and an expense column per row. This is the highest-stakes screen in the set — it's where a user judges whether the trip is affordable, so cost must be the most legible thing on the page.

### 4.2 Layout (desktop, 1024px+)

```
┌──────────────────────────────────────────────────────────────┐
│ GlobeTrotter                                          [●][○]  │
├──────────────────────────────────────────────────────────────┤
│ [ Search bar ..... ] [Group by▾][Filter▾][Sort by▾]            │
├──────────────────────────────────────────────────────────────┤
│              Itinerary for [Trip / City Name]                  │  Lora, --text-display-md
├───────────────────────────────┬──────────────────────────────┤
│  DAY TABS   [Day 1][Day 2][+] │  BUDGET SUMMARY PANEL         │
│                                │  Total spent   ₹42,300 / 60k  │
│  ── Physical Activity ── Expense│  ▓▓▓▓▓▓▓▓░░░░  70%           │
│  ┌──────────────────────┐ ₹800 │  Transport   ₹12,000          │
│  │ Visit Eiffel Tower    │      │  Stay        ₹20,000          │
│  └──────────┬───────────┘      │  Activities  ₹8,300           │
│             ↓                  │  Meals       ₹2,000            │
│  ┌──────────────────────┐₹1200 │  [ Pie chart ]                │
│  │ Seine river cruise    │      │  ⚠ Day 2 is 15% over avg      │
│  └──────────┬───────────┘      │                                │
│             ↓                  │                                │
│  ┌──────────────────────┐ ₹450 │                                │
│  │ Dinner at Le Marais   │      │                                │
│  └───────────────────────┘     │                                │
└───────────────────────────────┴──────────────────────────────┘
```

Two-column layout: **left column ≈ 66%** (day-wise activity timeline, matches wireframe exactly), **right column ≈ 34%, sticky** (budget summary — this is new structure needed to satisfy PDF §9 "pie/bar charts, average cost per day, alerts for overbudget days" which the wireframe implies via the per-row expense but doesn't fully lay out — call this out explicitly to your team as an addition beyond the raw wireframe).

### 4.3 Component: Day Tabs
- Horizontal pill tabs, `--radius-full`, matches §2.2 dropdown-trigger styling. Active tab: filled `--color-accent` bg, white text. Inactive: `--color-bg-surface`, `1px solid --color-border-default`, `--color-text-secondary`.
- `+` tab at the end (ghost, dashed border) to add a new day — opens the same "Add Section" flow as Screen 5 (Build Itinerary).
- Horizontally scrollable on mobile with a subtle right-edge fade to signal overflow.

### 4.4 Component: Activity Timeline Row (the core building block)
This directly matches the wireframe's connected boxes with the down-arrow connector.

- Each activity is a card: `--color-bg-surface`, `1px solid --color-border-subtle`, `--radius-md`, `padding: var(--space-3) var(--space-4)`, laid out as `[title/time — flex:1] [expense chip]`.
- **Connector:** a `2px` vertical line in `--color-border-default` between consecutive cards, centered, with a small down-chevron (12px, `--color-text-tertiary`) at its midpoint — exactly as drawn in the wireframe. This communicates sequence within the day without needing explicit "Step 1/2/3" labels (per the frontend-design principle: only number things that are genuinely sequential — here they are, since it's a same-day schedule).
- Card content:
  - Optional time badge, `--text-body-sm`, `--color-text-tertiary`, e.g. "9:00 AM"
  - Activity title, `--text-body-lg`, 600 weight
  - Category icon (16px) inline before title (sightseeing/food/adventure use distinct outline icons in `--color-accent-active`)
- **Expense chip** (right-aligned): `--text-numeric`, `--radius-full`, `padding: 4px 12px`, background `--color-bg-surface-alt`, `--color-text-primary`. If this single activity pushes the day over its allocated per-day budget, chip background becomes `--color-warning-50` / text `--color-warning-600`; hard over trip budget → `--color-danger-50` / `--color-danger-600`.
- Row actions on hover (desktop): small ghost icon buttons appear right of the expense chip — edit (pencil) and remove (×) — `--space-2` gap, 28px tap target.
- Drag handle (⋮⋮, 16px, `--color-text-tertiary`) appears on the left on hover, to support the PDF's "drag-to-reorder activities" requirement (§10). Reordering updates the connector positions with a `--duration-base` reflow animation.

### 4.5 Component: Budget Summary Panel (right column, sticky)
Satisfies PDF §9 requirements directly:
- **Header:** "Trip Budget" (`--text-display-sm`, Lora) + total figure `"₹42,300 / ₹60,000"` (`--text-numeric`, larger weight for the spent amount, `--color-text-tertiary` for the "/ 60,000" portion).
- **Progress bar:** `8px` height, `--radius-full`, track `--color-bg-sunken`, fill `--color-accent` under 80%, transitions to `--color-warning-400` at 80–100%, `--color-danger-400` if over 100%. This single color transition is the fastest way for a user to judge trip health at a glance — don't bury this signal in a legend.
- **Category breakdown list:** Transport / Stay / Activities / Meals, each row: colored dot (mapped 1:1 to the pie chart below) + label (`--text-body-sm`) + amount (`--text-numeric`, right-aligned).
- **Pie or donut chart:** matches wireframe's admin-panel pie/bar motif carried into user-facing budget context; use a donut (not full pie) so the center can display the total figure again for redundant legibility.
- **Average cost per day:** small stat row, e.g. "Avg/day: ₹8,460".
- **Overbudget alert banner:** only renders conditionally, `--color-warning-50` bg with left `3px` accent border in `--color-warning-400`, warning-triangle icon, text "Day 2 is 15% over your average day budget" — per PDF's explicit "alerts for overbudget days" requirement. Multiple alerts stack with `--space-2` gap, max 3 visible + "View all (N)" link.

### 4.6 States
- **No activities added to a day yet:** the day's timeline area shows a dashed-border empty card, Lora "Nothing planned for Day 2" + "+ Add an activity" primary button — reuses Screen 8's search as a modal/drawer.
- **Budget not set:** panel shows "Set a budget" prompt with an inline editable field, instead of the progress bar.
- **Loading:** skeleton timeline cards + skeleton donut ring (static circle) + skeleton bars for category rows.

### 4.7 Responsive
- **Tablet:** budget panel moves below the timeline (stacks vertically), no longer sticky, full width.
- **Mobile:** day tabs scroll horizontally; timeline cards full width; expense chip moves to a second line under the title rather than being squeezed right; budget panel becomes a collapsed summary bar ("₹42,300 / ₹60,000 · 70% ▾") that expands to the full panel in a bottom sheet on tap.

---

## 5. Screen 10 — Community Tab Screen

### 5.1 Purpose
Public/social layer per PDF's **Shared/Public Itinerary View (§11)**, generalized here into a feed: users browse other travelers' trip write-ups, filtered/sorted/grouped, matching the wireframe's repeated avatar + content-block rows.

### 5.2 Layout (desktop, 1024px+)

```
┌──────────────────────────────────────────────────┬──────────────┐
│ GlobeTrotter                              [●][○]  │              │
├────────────────────────────────────────────────── │  ABOUT PANEL │
│ [ Search bar ..... ][Group▾][Filter▾][Sort by▾]    │  (context/   │
├────────────────────────────────────────────────── │   help card, │
│              Community                              │  matches     │
│  [◯]  ┌──────────────────────────────────────┐    │  wireframe's │
│       │ Trip title · City · 5-day itinerary   │    │  side note)  │
│       │ "Short excerpt of the experience..."  │    │              │
│       │ ♡ 24   💬 6   ↗ Share        [View →] │    │              │
│       └──────────────────────────────────────┘    │              │
│  [◯]  ┌──────────────────────────────────────┐    │              │
│       │ …repeat…                              │    │              │
└────────────────────────────────────────────────── ┴──────────────┘
```
Left content column ≈ 75%, right info/about column ≈ 25% (matches the wireframe's grey side note panel — keep it, since it's exactly what's drawn: an always-visible explainer of how search/group/filter/sort narrows the feed).

### 5.3 Component: Community Post Card (core building block)
- Container: `--color-bg-surface`, `--radius-lg`, `1px solid --color-border-subtle`, `padding: var(--space-4)`, `margin-bottom: var(--space-3)`.
- **Left:** avatar, `40px` circle, `--radius-full`. Falls back to initials on `--color-accent-subtle` bg with `--color-accent-active` text if no photo.
- **Header row:** author name (`--text-body-md`, 600) + relative timestamp (`--text-body-sm`, `--color-text-tertiary`, e.g. "2d ago") right-aligned.
- **Title:** trip/activity name, `--text-display-sm` (Lora, 500) — this is the one place Lora appears inside an otherwise Inter-driven card, giving each post a title-page feel consistent with the travel-editorial tone.
- **Meta line:** `{City} · {N}-day itinerary · {Budget tier}` — `--text-body-sm`, `--color-text-secondary`.
- **Excerpt:** 2-line clamp of the shared itinerary description, `--text-body-md`.
- **Cover image (optional):** `16:9`, `--radius-md`, `margin: var(--space-3) 0`, only if the post has one — never force a placeholder image for text-only posts, since an empty gray box reads as broken.
- **Footer action row:** Like (heart outline → filled `--color-danger-400` on click, with a quick scale-pulse `--duration-fast` micro-interaction), Comment count, Share icon — each `--text-body-sm` with icon, `--space-4` gaps — plus a right-aligned **"View trip →"** secondary button that opens the read-only Shared Itinerary view (reuses Screen 9's timeline in a read-only mode: no Add/Edit/Remove affordances, no drag handles).

### 5.4 About/Context Panel (right column)
- Sticky card, `--color-bg-surface-alt`, `--radius-lg`, `padding: var(--space-4)`.
- Lora subhead "About Community" + Inter body copy explaining search/group/filter/sort narrows results — directly lifted from the wireframe's annotation text, rewritten in the interface's own voice (plain, second person): *"Search, filter, or sort to find trips that match what you're planning."*
- Optionally: trending tags row (pill chips, `--color-accent-subtle` bg) — "Trending: Solo travel, Backpacking, Europe."

### 5.5 States
- **Empty feed / filtered to zero:** same empty-state pattern as §3.5, reworded: "No trips match your filters yet."
- **Loading:** skeleton post cards (avatar circle + 3 gray lines + image block) × 3–4.
- **Post owned by current user:** footer row gains a ghost "⋯" overflow menu (Edit / Delete / Make private) instead of the standard actions — never show the same three-dot menu to a viewer who isn't the owner.

### 5.6 Responsive
- **Tablet:** About panel moves to a collapsible accordion above the feed instead of a side column.
- **Mobile:** avatar shrinks to 32px, cover image edge-to-edge (bleeds to card padding), footer action row keeps icons but drops text labels for Like/Comment/Share to icon+count only.

---

## 6. Cross-Screen Accessibility Checklist

- All interactive elements have a visible focus ring: `--shadow-focus`, never `outline: none` without a replacement.
- Color is never the only signal: budget-state chips and alert banners always pair color with an icon and text label (not fill color alone) — critical for the warning/danger states in Screen 9.
- Minimum tap target `40×40px` on touch, even where the visual element (e.g. a 16px star icon) is smaller — pad the hit area.
- Star ratings, progress bars, and donut charts all need an `aria-label` with the plain-text equivalent (e.g. `aria-label="4.6 out of 5, 212 reviews"`, `aria-label="70 percent of budget used"`).
- Heading order per screen: one `--text-display-md` (h1-equivalent) per screen, `--text-display-sm` for subsections — don't skip levels for style reasons.
- Reduced motion: connector-line reflows, like-button pulse, and skeleton shimmer all check `prefers-reduced-motion` and fall back to instant/static states.

---

## 7. Dev Handoff Notes

- Ship tokens in §1 as a single CSS custom-properties file (`theme-light-blue.css`) scoped to `[data-theme="light-blue"]`, imported once at the app root — never duplicate hex values in component files.
- Load fonts via `<link>` to Google Fonts (`Lora:400,500,600,700` and `Inter:400,500,600,700`) with `font-display: swap`, plus a system-font fallback stack so first paint isn't blocked.
- The Result Row (§3.3), Activity Timeline Row (§4.4), and Community Post Card (§5.3) share the same underlying "entity row" skeleton loader component — build one skeleton primitive, not three.
- Budget math (progress %, per-day average, overbudget threshold) should be computed once in a shared `useBudgetSummary(trip)` hook/selector so Screen 9's panel and any future dashboard widgets stay in sync with a single source of truth.
