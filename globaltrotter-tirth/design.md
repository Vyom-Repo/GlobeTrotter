# GlobeTrotter — Design Specification
### Screen 04 · Create a New Trip &nbsp;|&nbsp; Screen 05 · Build Itinerary
**Stack:** React + Tailwind CSS &nbsp;·&nbsp; **Theme:** `light-blue` &nbsp;·&nbsp; **Typeface:** Lora &nbsp;·&nbsp; **Style:** Neomorphism (Soft UI)

---

## 0. Design Philosophy

GlobeTrotter's job on these two screens is to turn a blank intention ("I want to go somewhere") into a structured, budgeted plan — without it ever feeling like filling out a form. Two ideas anchor every decision below:

1. **Physical travel documents as the metaphor.** Boarding passes, passport stamps, luggage tags and ticket stubs are tactile, soft-edged, slightly embossed objects you hold. Neomorphism — soft, low-contrast, light-emitting surfaces — is a natural fit for this, *if* it's disciplined. We lean into it specifically for cards, inputs and buttons that represent "a piece of your trip," and we pull back to flat, high-contrast UI for anything data-dense (budgets, numbers, alerts) where soft shadows would hurt legibility.
2. **One signature motif: the Stub Card.** Every "unit" of a trip — a suggested destination, an itinerary stop — is rendered as a card with a perforated divider, echoing a torn ticket stub. This is the single recognizable visual idea that carries across both screens (and scales to the rest of the app later).

Everything else is intentionally quiet: a restrained blue accent, generous whitespace, and a type system that pairs an editorial serif (Lora) for anything you'd want to look like a page in a travel journal, against a plain, numeric-friendly sans for the working parts of the UI (fields, dates, currency).

---

## 1. Foundations

### 1.1 Color System

The brief's `light-blue` token set is the **accent** ramp — it drives interactive states, focus, links and emphasis. It is *not* used as the neomorphic surface color directly (a pure accent-50 background makes shadows muddy and text low-contrast). Instead we derive a dedicated **surface** ramp from the same hue family, and a separate **ink** ramp for text, so contrast stays accessible no matter how soft the shadows get.

**Accent (from brief — interactive / brand)**

| Token | Hex | Usage |
|---|---|---|
| `accent-50` | `#e8f4ff` | Rare — tint fills behind icons only |
| `accent-100` | `#c0deff` | Selected chip background, hover tint |
| `accent-200` | `#8ac2ff` | Progress bar track (filled portion, low state) |
| `accent-300` | `#55a6ff` | Secondary icons, links on dark surfaces |
| `accent-400` | `#2090ff` | **Primary interactive color** — default button fill, active tab, focus accent |
| `accent-500` | `#0073e6` | Button hover |
| `accent-600` | `#005bcc` | Button active / pressed |
| `accent-700` | `#0044a3` | Text links on light surfaces (AA-safe) |
| `accent-800` | `#002e7a` | High-emphasis text-on-accent, icon strokes |
| `accent-900` | `#001852` | Reserved for dark-mode inversion (not used in v1) |

**Surface (neomorphic canvas — derived, not from brief)**

| Token | Hex | Usage |
|---|---|---|
| `surface-canvas` | `#EAF2FB` | App background |
| `surface-raised` | `#EEF5FC` | Default card / input fill (near-canvas, so shadows do the work) |
| `surface-sunken` | `#E3ECF7` | Pressed / inset fields, "well" areas |
| `shadow-light` | `#FFFFFF` @ 90% | Top-left highlight shadow |
| `shadow-dark` | `#A9C0DE` @ 55% | Bottom-right ambient shadow |
| `shadow-dark-strong` | `#8FAAD1` @ 65% | Pressed / inset shadow, drag-elevation |

**Ink (text — derived, kept independent of accent for AA/AAA contrast)**

| Token | Hex | Usage |
|---|---|---|
| `ink-900` | `#0B1E3D` | Headings, primary body text |
| `ink-700` | `#3A4C6B` | Secondary text, descriptions |
| `ink-500` | `#6B7C99` | Placeholder text, helper copy |
| `ink-300` | `#A7B5CC` | Disabled text, dividers |

**Semantic**

| Token | Hex | Usage |
|---|---|---|
| `success` | `#1E9E6D` | Under-budget indicator, saved confirmation |
| `warning` | `#D98C2B` | Approaching budget limit |
| `danger` | `#D64545` | Over budget, validation errors, delete confirm |

> **Why not pure accent-400 for body text?** At 4.5:1 contrast requirements against a `#EEF5FC` neomorphic surface, `accent-400` fails AA for normal-size text. Accent stays reserved for things you *act on*; `ink` tokens carry everything you *read*.

### 1.2 Typography

**Display / Editorial — Lora** (serif, weights 400/500/600/700, has true italics)
Used anywhere the product should feel like a travel journal: page titles, the trip name once entered, section/stop titles, empty-state headlines, inspirational captions.

**Functional / UI — Inter** (companion sans, chosen for x-height, tabular numerals, and legibility at small sizes on low-contrast soft surfaces)
Used for form labels, input values, buttons, dates, currency figures, navigation, badges, helper text — anything dense or numeric.

| Role | Face | Size / Line-height | Weight | Tracking |
|---|---|---|---|---|
| Display (page title) | Lora | 32px / 40px | 600 | 0 |
| H1 (screen title, e.g. "Plan a new trip") | Lora | 26px / 34px | 600 | 0 |
| H2 (section title, "Suggested for you") | Lora | 20px / 28px | 500 | 0 |
| H3 (card / stop title) | Lora | 18px / 26px | 500 Italic for placeholders | 0 |
| Body | Inter | 15px / 22px | 400 | 0 |
| Body small / helper | Inter | 13px / 18px | 400 | 0 |
| Label / Overline | Inter | 12px / 16px | 600 | 0.06em, uppercase |
| Numeric (budget, dates) | Inter | 15–20px / 24–28px | 600, tabular-nums | 0 |
| Button label | Inter | 14px / 20px | 600 | 0.01em |

### 1.3 Spacing & Grid

- Base unit: **4px**. Scale: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96.
- Desktop content grid: 12 columns, 1280px max container, 24px gutters, 64px outer margin.
- Card internal padding: 24px (desktop), 16px (mobile).
- Section vertical rhythm: 48px between major sections, 16px between a heading and its content.

### 1.4 Neomorphism — Shadow & Elevation System

Neomorphism is expressed as **paired shadows** on the *same* surface color, not as a generic drop shadow. Four elevation states cover every component on these two screens:

| Elevation | Used for | Light shadow | Dark shadow | Radius/blur |
|---|---|---|---|---|
| **Flat** | Canvas, static text zones | none | none | — |
| **Raised** (default) | Cards, buttons, inputs at rest | `-6px -6px 14px shadow-light` | `6px 6px 14px shadow-dark` | 14px blur |
| **Pressed / Inset** | Active buttons, focused text inputs, "well" fields (search bar, textarea) | inset `-4px -4px 8px shadow-light` | inset `4px 4px 8px shadow-dark-strong` | 8px blur |
| **Floating** | Dragged itinerary stop, open date-picker popover, modal | `-8px -8px 20px shadow-light` | `10px 10px 24px shadow-dark-strong` | 24px blur, +2px scale |

**Interaction rule:** on press, a Raised element's shadow *inverts* to Pressed over 120ms and the element scales to 0.98 — simulating a physical push, which doubles as the primary "this is clickable" affordance in a low-contrast system.

### 1.5 Corner Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 10px | Chips, badges, small icon buttons |
| `radius-md` | 14px | Inputs, buttons |
| `radius-lg` | 20px | Cards, stop/section cards |
| `radius-xl` | 28px | Hero panels, modals, cover photo frame |
| `radius-full` | 999px | Pills, avatars, progress rails |

### 1.6 Accessibility Guardrails (non-negotiable, because neomorphism fights contrast by default)

- Never rely on shadow alone to communicate an interactive element — every actionable component also gets a 1px `accent-200` hairline border at rest and a 2px `accent-400` focus ring on keyboard focus (`:focus-visible`), since soft shadows are invisible to some low-vision users and to all screen-reader users.
- Body and label text always resolve from the `ink` ramp, never `accent` or raw shadow tones — this guarantees ≥4.5:1 contrast regardless of how the surface shadow renders.
- Minimum hit target: 44×44px for every button, chip-remove icon, and drag handle.
- All budget/status color coding (success/warning/danger) is paired with an icon or text label, never color alone.
- Respect `prefers-reduced-motion`: press-scale and drag-elevation animations drop to opacity-only transitions.

### 1.7 Motion

- Standard easing: `cubic-bezier(0.4, 0, 0.2, 1)`, 150–220ms.
- Button/card press: 120ms shadow inversion + scale to 0.98.
- Section expand/collapse: height auto-animate, 220ms ease-out, chevron rotates 180°.
- Drag reorder: dragged card jumps to Floating elevation, rotates 1.5°, others animate into place over 180ms.
- Page-level transition between Screen 4 → Screen 5: 220ms cross-fade + 12px upward slide (reinforces forward progress through the flow).

### 1.8 Iconography & Imagery

- Icon set: single-weight line icons, 1.5px stroke, 20–24px grid (e.g. Lucide-style) — never filled, to stay visually quiet against soft shadows.
- Destination/cover photography: warm, editorial travel photography, always with a subtle `ink-900 @ 20%` gradient overlay at the bottom edge when text sits on top (for contrast).
- Empty-state illustrations: simple line-art in `accent-300`, matching icon stroke weight — no stock illustration packs.

---

## 2. Screen 04 — Create a New Trip

### 2.1 Purpose & User Goal

The user has decided to plan a trip and needs to capture just enough to move forward: what to call it, where, and when — plus a moment of inspiration so the blank page doesn't feel like paperwork. This screen should feel like opening the first page of a travel journal, not filing a request form.

**Primary goal:** get to a valid Trip Name + at least one Destination + Start/End Date as fast as possible.
**Secondary goal:** spark ideas via destination/activity suggestions, without blocking progress if the user skips them.

### 2.2 Layout — Desktop (≥1024px)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  GlobeTrotter        Dashboard   My Trips   Explore          ⚙  🔔  👤   │  App shell (persistent)
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   Plan a new trip                                     Draft saved 09:41  │  H1 + autosave status
│   Give it a name, a date range, and we'll help with the rest.            │  Body/helper
│                                                                            │
│  ┌───────────────────────┐   ┌───────────────────────────────────────┐  │
│  │                        │   │  Trip name                            │  │
│  │   COVER PHOTO          │   │  ┌───────────────────────────────┐    │  │
│  │   (drag & drop /       │   │  │ e.g. "Kyoto in cherry blossom"│    │  │
│  │    tap to upload)      │   │  └───────────────────────────────┘    │  │
│  │   [ image icon ]       │   │  Destination(s)                       │  │
│  │   Optional              │   │  ┌───────────────────────────────┐    │  │
│  │                        │   │  │ ⚲ Search a city or region...  │    │  │
│  └───────────────────────┘   │  └───────────────────────────────┘    │  │
│    280 × 280                 │  Start date          End date          │  │
│                               │  ┌──────────┐        ┌──────────┐     │  │
│                               │  │ 📅 Select│        │ 📅 Select│     │  │
│                               │  └──────────┘        └──────────┘     │  │
│                               │  Trip description (optional)          │  │
│                               │  ┌───────────────────────────────┐    │  │
│                               │  │                                │    │  │
│                               │  └───────────────────────────────┘    │  │
│                               └───────────────────────────────────────┘  │
│                                                                            │
│  ── Suggested for you ─────────────────────────────────────────────────  │  H2, hidden until place/dates set
│     Based on the dates and destination you picked                        │
│                                                                            │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐      │  Stub Cards, horizontally
│  │ photo  │ │ photo  │ │ photo  │ │ photo  │ │ photo  │ │ photo  │      │  scrollable row on desktop
│  │┄┄┄┄┄┄┄┄│ │┄┄┄┄┄┄┄┄│ │┄┄┄┄┄┄┄┄│ │┄┄┄┄┄┄┄┄│ │┄┄┄┄┄┄┄┄│ │┄┄┄┄┄┄┄┄│      │
│  │Place · $│ │Place · $│ │Place · $│ │Place · $│ │Place · $│ │Place · $│      │
│  │ + Add  │ │ + Add  │ │ + Add  │ │ + Add  │ │ + Add  │ │ + Add  │      │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘      │
│                                                                            │
├──────────────────────────────────────────────────────────────────────────┤
│                                          [ Discard ]   [ Continue → ]     │  Sticky footer action bar
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Component Breakdown

**A. Screen header block**
- H1 "Plan a new trip" (Lora 26/600) + body helper line (Inter 15/400, `ink-700`).
- Autosave status, right-aligned, small Inter caption in `ink-500`, updates live ("Saving…" → "Draft saved HH:MM").

**B. Cover Photo Uploader** (`raised`, `radius-xl`, 280×280 on desktop, full-width 16:9 on mobile)
- Empty state: centered image icon (`accent-300`), label "Add a cover photo", caption "Optional — helps you recognize this trip later."
- Drag-over state: border becomes 2px dashed `accent-400`, surface shifts to `sunken` elevation.
- Filled state: photo fills frame, `radius-xl` clip, small circular "raised" icon-button (pencil) top-right to replace, and an "×" to remove.
- Upload progress: thin `accent-400` bar along the bottom edge of the frame.

**C. Trip Details Form Card** (`raised`, `radius-lg`, right column, 2/3 width on desktop)
- **Trip name** — single-line text input, Inter 15, placeholder in italic Lora ("e.g. Kyoto in cherry blossom season") to nod at the journal metaphor while keeping the entered value in plain Inter for legibility.
- **Destination(s)** — search input with a leading search icon; typing opens a floating (`Floating` elevation) autocomplete list of cities/regions with country sub-label; selected destinations render as removable pills (`accent-100` fill, `accent-800` text) below the field, so multi-city trips are supported from the start.
- **Start date / End date** — two `Pressed`-elevation fields side by side, each opens a `Floating` calendar popover on click (single connected range-picker: selecting a start date auto-focuses end date; the range is highlighted in `accent-100` inside the calendar, endpoints in solid `accent-400`).
- **Trip description** — multi-line `Pressed` textarea, 3 rows default, auto-grows to 6, placeholder "What's this trip about? (optional)".
- Every field label: Inter 12/600 uppercase, `ink-500`, 0.06em tracking — sits 6px above its field.

**D. Suggested for you** (H2, appears only once at least a destination is chosen — before that, this whole section is hidden, not empty-stated, to avoid noise)
- Horizontally scrollable row of **Stub Cards** (desktop: 5–6 visible, edge-fade + arrow nav; mobile: swipeable carousel, 1.2 cards visible to hint more).
- Each Stub Card: photo (top, `radius-lg` top corners only), perforated dashed divider, place/activity name (Lora 16/500), estimated cost tag (Inter 13/600, `ink-700`), "+ Add" pill button (`accent-400` fill, white text) bottom-right that becomes a filled "Added ✓" (`success`) state on tap without navigating away.

**E. Sticky footer action bar**
- Full-width `raised` surface pinned to viewport bottom, 1px top hairline in `accent-200`.
- **Discard** — ghost/text button, `ink-700`, opens a confirm dialog if any field has content.
- **Continue →** — primary button (`accent-400` fill → `accent-600` pressed), disabled (`ink-300` fill, no shadow — flattens to `Flat` elevation to visually read as inert) until Trip name + Destination + both dates are valid; tooltip on hover-while-disabled explains what's missing.

### 2.4 States & Validation

| State | Behavior |
|---|---|
| Empty (first visit) | All fields empty, Suggested section hidden, Continue disabled |
| Partial | Continue stays disabled; each unmet required field gets a subtle `danger`-colored 1px underline **only after the user has blurred it once** (no premature red) |
| Invalid date range | If end date < start date, End date field shows inline helper text in `danger`: "End date can't be before the start date," field ring turns `danger` |
| Destination not found | Autocomplete shows "No places match — try a broader search" with a muted line-art icon |
| Loading suggestions | Stub Card row shows 4 skeleton cards with a soft shimmer (opacity pulse 0.6↔1, respects reduced-motion by freezing at 0.8) |
| Autosave | Every field change debounced 800ms → PATCH draft; status label updates; no blocking spinners |
| Success (Continue) | Button shows brief checkmark micro-animation, then page-transition to Screen 05 |

### 2.5 Microcopy

| Element | Copy |
|---|---|
| H1 | "Plan a new trip" |
| Subhead | "Give it a name, a date range, and we'll help with the rest." |
| Trip name placeholder | *"e.g. Kyoto in cherry blossom season"* |
| Destination placeholder | "Search a city or region…" |
| Description placeholder | "What's this trip about? (optional)" |
| Suggested section heading | "Suggested for you" |
| Suggested section subhead | "Based on the dates and destination you picked" |
| Empty suggestions (destination chosen, none found) | "We don't have suggestions for this destination yet — you can still add your own stops next." |
| Continue disabled tooltip | "Add a trip name, destination and dates to continue" |
| Discard confirm dialog | "Discard this trip? Anything you've entered will be lost." / [Keep editing] [Discard] |

### 2.6 Responsive Behavior

- **≥1024px:** two-column layout as wireframed (photo left, form right); suggestions in a horizontal scroll row.
- **768–1023px:** photo uploader moves above the form, full width, 16:9; form single column; suggestions row stays horizontal-scroll.
- **<768px:** everything single column, 16px side padding; date fields stack vertically instead of side-by-side; footer action bar becomes two full-width stacked buttons (Continue on top); suggestion cards become a snap-scroll carousel showing 1.15 cards at a time with dot pagination.

---

## 3. Screen 05 — Build Itinerary

### 3.1 Purpose & User Goal

The user now breaks the trip into stops (cities, or thematic legs like "Hotel," "Activities," "Transport" for a single-city trip) and assigns each a date range and budget. This is the working core of the app — it needs to feel editable, reorderable, and always show the user where their money stands, without becoming a spreadsheet.

**Primary goal:** add/edit/reorder sections, each with a date range and a budget, and see a running total against the overall trip budget.
**Secondary goal:** keep the "Stub Card" motif so this reads as an extension of Screen 04, not a different product.

### 3.2 Layout — Desktop (≥1024px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  GlobeTrotter    ← Back to trip          Kyoto in cherry blossom season     │  App shell + trip context
├──────────────────────────────────────────────────┬─────────────────────────┤
│  Build itinerary                                  │  TRIP SUMMARY  (sticky) │
│  Break your trip into stops. Add dates, budget    │  ┌───────────────────┐ │
│  and activities to each one.                      │  │ 8 days · 2 stops  │ │
│                                                    │  │ ▓▓▓▓▓▓▓░░░  68%  │ │
│  ┌──────────────────────────────────────────────┐│  │ ¥ 42,500 / 62,000│ │
│  │ ⣿ STOP 01                     ⌄   ⧉   🗑     ││  └───────────────────┘ │
│  │ ┌──────────────────────────────┐              ││  Budget by category    │
│  │ │ Tokyo, Japan                 │              ││  Stay        ▓▓▓▓ 40% │
│  │ └──────────────────────────────┘              ││  Food        ▓▓   20% │
│  │ 📅 Sep 12 → Sep 16     ¥ Budget: 24,000        ││  Activities  ▓     15%│
│  │ ┄ ┄ ┄ ┄ ┄ ┄ ┄  perforated divider  ┄ ┄ ┄ ┄ ┄  ││  Transport   ▓▓    25%│
│  │ Notes                                          ││                        │
│  │ ┌──────────────────────────────┐              ││  ⚠ Stop 01 is 8% over │
│  │ │ First time in Tokyo, want... │              ││    its budget          │
│  │ └──────────────────────────────┘              ││                        │
│  │ Activities                                     ││  [ Preview itinerary ] │
│  │  • Senso-ji Temple visit         ¥1,200   ✕   ││                        │
│  │  • teamLab Planets                ¥3,800   ✕   ││                        │
│  │  + Add activity                                ││                        │
│  └──────────────────────────────────────────────┘│                        │
│                                                    │                        │
│  ┌──────────────────────────────────────────────┐│                        │
│  │ ⣿ STOP 02  (collapsed)         ⌄   ⧉   🗑     ││                        │
│  │ Kyoto, Japan · Sep 16 → Sep 20 · ¥18,500      ││                        │
│  └──────────────────────────────────────────────┘│                        │
│                                                    │                        │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐│                        │
│    ✚  Add another section                        ││                        │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘│                        │
│                                                    │                        │
├────────────────────────────────────────────────────┴─────────────────────────┤
│                                              [ Save & exit ]   [ Continue → ] │
└────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Component Breakdown

**A. Context header**
- Breadcrumb "← Back to trip" (Inter 14/500, `ink-700`, hover `accent-600`) + trip name in Lora 16/500 as a quiet reminder of what you're building.
- H1 "Build itinerary" + one-line helper, same treatment as Screen 04 for continuity.

**B. Section / Stop Card — the Stub Card, itinerary variant** (`raised`, `radius-lg`)
This is the signature component of the screen. Structure, top to bottom:
1. **Header row:** drag handle (⣿, 6-dot grip, `ink-300`, cursor-grab), "STOP 0N" overline label (Inter 12/600 uppercase, `ink-500`), then right-aligned icon-button cluster: collapse/expand chevron, duplicate, delete (delete opens a confirm dialog, never fires instantly).
2. **Title field:** the stop's place/name, editable inline text styled as Lora 18/500 — looks like a heading, behaves like an input (click to edit, `Pressed` elevation appears only while focused).
3. **Meta row:** a compact date-range field (`Pressed`, opens the same connected calendar popover as Screen 04) and a budget field (`Pressed`, currency-prefixed, numeric keyboard on mobile) sit side by side.
4. **Perforated divider:** a horizontal dashed rule with two small circular cut-outs at each end (rendered as `surface-canvas`-colored circles overlapping the card edge) — the literal "ticket stub" tear line, separating identity/logistics (above) from content (below).
5. **Notes:** optional `Pressed` textarea, collapsed to 2 lines with "Show more" if longer.
6. **Activities list:** each activity is a single row — name (Inter 15), cost (Inter 15/600 tabular-nums, right-aligned), and a small "✕" remove icon that only appears on row hover/focus. Below the list, a dashed "+ Add activity" row (not a full button — visually lighter, since this is a frequent micro-action) opens an inline input, not a modal.
7. **Card footer (only when expanded and activities exist):** a thin per-stop budget bar comparing planned activity costs to the stop's budget field, using `success`/`warning`/`danger` fill.

**Collapsed state** of a Stub Card compresses to a single row: drag handle, title, a `·`-separated summary line (dates · budget), and the same action icon cluster — so a long trip with many stops stays scannable.

**C. "Add another section" button**
- Full-width, `radius-lg`, **dashed** `accent-300` border on `surface-canvas` (not `raised` — it's deliberately the one non-embossed interactive element on the screen, so it never competes visually with real content, but its dashed line echoes the stub-card divider motif). On hover, border solidifies to `accent-400` and fill tints to `accent-50`.
- Clicking appends a new Stub Card in its default (expanded, empty) state directly above the button, scrolled into view, title field auto-focused.

**D. Trip Summary panel** (desktop only, sticky right rail, `raised`, `radius-lg`, 320px wide)
- Top stat row: "N days · N stops" (Inter 13, `ink-500`).
- Overall budget progress bar: horizontal pill (`radius-full`), track in `surface-sunken`, fill in `accent-400` transitioning to `warning` at 85% and `danger` past 100%, with the ¥-value pair right-aligned above it in Inter 20/600 tabular-nums.
- Budget-by-category mini bar chart: 4 horizontal bars (Stay/Food/Activities/Transport), each a thin `radius-full` track, labeled left, percentage right — flat, no shadows, since this is a data-reading moment, not a tactile one (per §1.6, we deliberately break neomorphism here for clarity).
- Contextual alert banner (`warning`/`danger` tinted background at 10% opacity, colored left border, icon + one line) — appears only when a stop or the total is over budget; otherwise this space is empty (not a fabricated "all good!" success banner — silence communicates fine).
- **Preview itinerary** — secondary button, opens Screen 06 (Itinerary View) in this design's forward flow.

**E. Sticky footer action bar**
- **Save & exit** — ghost button, returns to Trip List (Screen 04/06 context) preserving all sections as a draft.
- **Continue →** — primary button; unlike Screen 04, this is **never fully disabled** (a user can always proceed with an incomplete itinerary), but shows a small `warning` dot badge if any section is missing a date range.

### 3.4 Interaction & State Specs

| Interaction | Spec |
|---|---|
| Reorder sections | Drag handle only (not the whole card, to avoid accidental drags while editing text) — press-hold 150ms threshold, card lifts to `Floating` elevation + 1.5° rotate, drop targets show a `accent-100` insertion line between cards |
| Add activity | Click "+ Add activity" → row morphs into an inline `Pressed` input pair (name, cost) with a small check/✕ to confirm/cancel — no modal, keeps flow inline |
| Delete a section | Trash icon opens a lightweight confirm popover anchored to the icon (not a full modal): "Remove this stop? Its activities go with it." [Cancel] [Remove] |
| Over-budget stop | That Stop Card's meta-row budget field ring turns `danger`; the per-stop footer bar fills past 100% in `danger` and the bar itself gets a subtle diagonal hatch texture (so it's not color-only, per accessibility guardrail) |
| Collapse/expand | Chevron rotates 180° over 200ms; card height animates; collapsing a card with unsaved inline activity input auto-confirms that entry if valid, discards if empty |
| Empty state (no sections yet) | The whole content column shows one centered line-art illustration (a single stamped ticket, `accent-300` strokes) + "No stops yet — add your first one to start building the itinerary." + a solid (not dashed) primary "Add a section" button in place of the usual dashed one, since this is the primary CTA when nothing exists yet |
| Mobile: Trip Summary panel | Collapses into a floating pill fixed above the footer bar: "Trip summary · 68%" — tapping opens it as a bottom sheet (`Floating` elevation, `radius-xl` top corners) with the same content, dismissible by swipe-down or scrim tap |

### 3.5 Microcopy

| Element | Copy |
|---|---|
| H1 | "Build itinerary" |
| Subhead | "Break your trip into stops. Add dates, budget and activities to each one." |
| Section overline | "STOP 01", "STOP 02"… (auto-numbered, re-numbers on reorder) |
| Section title placeholder | "Name this stop — a city, a hotel, an activity block…" |
| Add-section button | "Add another section" |
| Add-activity affordance | "+ Add activity" |
| Delete confirm | "Remove this stop? Its activities go with it." |
| Empty state | "No stops yet — add your first one to start building the itinerary." |
| Over-budget alert | "Stop 01 is 8% over its budget" |
| Overall alert (trip-level) | "Your trip is 68% through its budget" *(shown only past 85%, tone shifts to danger past 100%: "Your trip is 6% over budget")* |
| Continue badge tooltip | "Some stops are missing dates" |

### 3.6 Responsive Behavior

- **≥1024px:** two-column as wireframed — content column ~66%, sticky summary rail ~34%.
- **768–1023px:** single column; Trip Summary panel moves inline, directly below the header, as a non-sticky `raised` card (not a sidebar) — still visible without scrolling past it.
- **<768px:** single column, 16px padding; Stop Card meta row (date + budget) stacks vertically; Trip Summary becomes the floating pill + bottom sheet described above; footer bar becomes two stacked full-width buttons; drag-reorder switches from mouse-drag to explicit ↑/↓ reorder icon buttons in the card header (touch drag reserved for a later iteration, to avoid conflicting with vertical scroll).

---

## 4. Shared Component Library

| Component | Elevation | Radius | Notes |
|---|---|---|---|
| Primary button | Raised → Pressed on click | `md` | `accent-400` fill, white Inter 14/600 label, disabled = `Flat` + `ink-300` |
| Secondary/ghost button | Flat, hairline `accent-200` border | `md` | `ink-700` text, fills `accent-50` on hover |
| Dashed action button | Flat, dashed `accent-300` border | `lg` | Reserved for "add another" actions only |
| Text input | Pressed (always inset) | `md` | 1px `ink-300` hairline at rest, `accent-400` ring on focus |
| Textarea | Pressed | `md` | Auto-grow, min 3 rows |
| Date field / picker trigger | Pressed → Floating popover | `md` / `xl` | Connected range picker shared across both screens |
| Search/autocomplete | Pressed → Floating list | `md` / `lg` | Debounced 250ms |
| Pill / chip | Flat, `accent-100` fill | `full` | Used for selected destinations, status badges |
| Stub Card (destination) | Raised | `lg` | Perforated divider between image and metadata |
| Stub Card (itinerary stop) | Raised | `lg` | Perforated divider between meta and content; collapsible |
| Progress bar | Flat (deliberately) | `full` | Data legibility over tactility, per §1.6 |
| Alert banner | Flat, tinted 10% fill | `md` | Icon + text, never color-only |
| Modal / confirm dialog | Floating | `xl` | Scrim `ink-900 @ 40%` |

---

## 5. Tailwind Token Mapping (config reference — values only, no implementation)

**Colors** (extend `theme.colors`): `accent.50…900` from §1.1, `surface.canvas / raised / sunken`, `ink.300/500/700/900`, `success/warning/danger`.

**Font families** (extend `theme.fontFamily`): `display` → Lora (with `400/500/600/700` + italic), `sans` → Inter (with tabular-nums numeric variant enabled via `font-feature-settings`).

**Border radius** (extend `theme.borderRadius`): `sm 10px · md 14px · lg 20px · xl 28px`.

**Box shadow** (extend `theme.boxShadow`, values per §1.4): `neo-raised`, `neo-pressed` (inset), `neo-floating` — each defined as the dual light/dark pair listed in the elevation table, so components reference `shadow-neo-raised` etc. rather than re-declaring shadow values inline.

**Spacing:** default Tailwind 4px scale already matches §1.3 — no override needed, just consistent use of `4/8/12/16/24/32/48/64/96`.

---

## 6. Handoff Notes for React Implementation (structure only — no code)

Suggested component tree, so both screens share primitives:

- `AppShell` (nav, used by both screens)
  - `TripFormScreen` *(Screen 04)*
    - `CoverPhotoUploader`
    - `TripDetailsCard` → `TextField`, `DestinationSearchField`, `DateRangeField`, `TextArea`
    - `SuggestedDestinationsRow` → `StubCard.Destination` (repeated)
    - `ScreenFooterBar` (shared primitive, used on both screens)
  - `ItineraryBuilderScreen` *(Screen 05)*
    - `TripContextHeader`
    - `SectionList` → `StubCard.ItineraryStop` (repeated, draggable)
      - `SectionHeader` (drag handle, title field, action icons)
      - `SectionMetaRow` → `DateRangeField` (shared), `BudgetField`
      - `PerforatedDivider` (shared, purely presentational)
      - `NotesField` → `TextArea` (shared)
      - `ActivityList` → `ActivityRow` (repeated), `AddActivityInlineForm`
    - `AddSectionButton`
    - `TripSummaryPanel` → `BudgetProgressBar`, `CategoryBreakdownBars`, `AlertBanner`
    - `ScreenFooterBar` (shared)

Shared primitives to build once and reuse across both screens: `TextField`, `TextArea`, `DateRangeField` (+ its `Floating` calendar popover), `Button` (primary/secondary/dashed variants), `Pill`, `StubCard` (base, with `.Destination` and `.ItineraryStop` variants), `ScreenFooterBar`, `AlertBanner`, `ProgressBar`.
