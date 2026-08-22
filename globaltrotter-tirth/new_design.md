# GlobeTrotter — Design Spec Update
### Changes to apply to `design.md` — Glassmorphism + Bento Grid revision

Apply each block below under its matching heading in the original file. Where marked **REPLACE**, swap the entire old section/paragraph/table for the new one.

---

### REPLACE — top metadata line

**Stack:** React + Tailwind CSS &nbsp;·&nbsp; **Typeface:** Lora &nbsp;·&nbsp; **Style:** Glassmorphism + Bento Grid &nbsp;·&nbsp; **Currency:** ₹ (INR)

*(Removed the literal "Theme: light-blue" text — the accent ramp is used as color values only, never displayed as a label anywhere in the UI.)*

---

### REPLACE — Section 0, closing paragraph (swap "neomorphism" reasoning for glass)

Neomorphism was tested and dropped — it flattens contrast exactly where a budget-and-dates product needs it most. Instead we use **glassmorphism**: frosted panels floating over a soft gradient canvas, so real destination photography (not shadows) carries the atmosphere. Content is organized in a **bento grid** — blocks of deliberately varied size, so a standout suggestion or the trip's budget health can visually claim more weight than a routine one. Financial and form-heavy zones (budgets, dates, itinerary line items) drop the glass and use flat, high-contrast cards — that's a place for instant legibility, not atmosphere.

---

### REPLACE — Section 1.1 Color System table additions (append after the Ink table)

**Canvas gradient (new — replaces flat neomorphic surface)**

| Token | Value | Usage |
|---|---|---|
| `canvas-gradient` | `linear-gradient(160deg, #EAF4FF 0%, #C9E3FF 45%, #8AC2FF 100%)` | Full-page background, sky/ocean mood, sits behind every glass panel |
| `canvas-gradient-soft` | `linear-gradient(160deg, #F4FAFF 0%, #E8F4FF 100%)` | Lighter variant behind dense form zones, so glass stays readable |

**Glass surface tokens**

| Token | Value | Usage |
|---|---|---|
| `glass-fill` | `rgba(255,255,255,0.16)` | Panel fill over the vivid canvas-gradient (hero, suggestion cards) |
| `glass-fill-strong` | `rgba(255,255,255,0.55)` | Panel fill over lighter zones (nav bar, footer bar) — needs less blur to read text clearly |
| `glass-border` | `rgba(255,255,255,0.4)` | 1px inner border on every glass panel — this is what makes the "edge of glass" read, since shadows alone won't on a light theme |
| `glass-blur` | `18px` backdrop-blur | Standard blur radius |
| `glass-shadow` | `0 8px 32px rgba(0,46,122,0.14)` | Single soft shadow under glass panels (not paired neomorphic shadows) |

**Flat data-card tokens (used for forms, budgets, itinerary line items)**

| Token | Value | Usage |
|---|---|---|
| `card-flat` | `#FFFFFF` | Solid fill, no transparency — used wherever numbers/dates/inputs live |
| `card-flat-border` | `accent-100` | 1px border at rest |
| `card-flat-shadow` | `0 2px 10px rgba(0,46,122,0.06)` | Single soft shadow, not embossed |

---

### REPLACE — Section 1.4 heading and content (was "Neomorphism — Shadow & Elevation System")

### 1.4 Elevation System (Glass + Flat)

Two surface families, used deliberately, never mixed on the same component:

| Surface | Used for | Spec |
|---|---|---|
| **Glass** | Nav bar, hero/photo areas, destination suggestion cards, trip summary panel background, modals | `glass-fill` + `backdrop-blur(18px)` + `glass-border` 1px + `glass-shadow` |
| **Glass — strong** | Any glass panel sitting over a *light* zone rather than the vivid gradient (footer bar, nav on scroll) | `glass-fill-strong`, blur reduced to `12px` so underlying content doesn't ghost through illegibly |
| **Flat card** | Every input, every budget figure, every itinerary stop's data (dates, ₹ amount, activity rows) | `card-flat` fill, `card-flat-border`, `card-flat-shadow`. No blur, no transparency — this is the "read me precisely" surface |
| **Floating (modals/popovers)** | Calendar popover, confirm dialogs, dropdown menus | Glass spec + shadow bumped to `0 16px 48px rgba(0,46,122,0.2)`, `scale(1.0)` entrance from `0.97` |

**Interaction rule:** glass panels get a subtle `translateY(-2px)` + shadow deepen on hover (150ms) — the lift *is* the affordance, since blur alone doesn't read as "clickable." Flat cards keep a simple border-color shift to `accent-400` on focus/hover instead — no lift, since these are data zones, not decorative ones.

---

### REPLACE — Section 1.6 heading (rename, keep content but adjust first two bullets)

### 1.6 Accessibility Guardrails (glass has its own failure mode: text-over-photo contrast)

- Every glass panel that sits directly over photography gets a bottom-to-top gradient scrim (`ink-900 @ 0%→45%`) behind any text, guaranteed minimum 4.5:1 contrast for card titles and prices.
- Body/label text inside glass panels always uses `ink-900` on a light scrim, never white-on-glass without a scrim underneath.
- Never rely on blur/transparency alone to signal "clickable" — every actionable glass element also gets the `glass-border` outline at rest and a 2px `accent-400` focus ring on keyboard focus.
- Minimum hit target: 44×44px for every button, chip-remove icon, and drag handle.
- All budget/status color coding (success/warning/danger) is paired with an icon or text label, never color alone.
- Respect `prefers-reduced-motion`: hover-lift and blur transitions drop to opacity-only.

---

### REPLACE — Section 2.2, Screen 04 wireframe top nav line

```
┌──────────────────────────────────────────────────────────────────────────┐
│  GlobeTrotter          Plan a Trip   Build Itinerary            ⚙  👤    │  Nav — glass-fill-strong, sticky
├──────────────────────────────────────────────────────────────────────────┤
```

*(Nav now only holds the two in-scope flows as plain functional labels — "Plan a Trip" and "Build Itinerary" — no "Screen 04/05" text, no theme-name text anywhere. Active link gets a 2px `accent-400` underline; inactive links are `ink-700`.)*

---

### REPLACE — new subsection inserted right after "2.2 Layout" and before "2.3 Component Breakdown"

### 2.2a Nav Bar Spec

- **Logo:** "GlobeTrotter" wordmark, Lora 18/600, `ink-900` — no tagline, no theme label.
- **Primary links (only two, since only two flows exist in this build):** "Plan a Trip" · "Build Itinerary" — Inter 14/600. Active state: `accent-400` text + 2px underline. Inactive: `ink-700`, hover → `accent-600`.
- **Right cluster:** settings icon, profile avatar (circular, 32px). No notification bell unless a real notification system exists elsewhere in scope — don't add chrome that doesn't do anything yet.
- **Surface:** `glass-fill-strong`, `blur(12px)`, sticky top, 1px bottom border `glass-border`, height 64px.

---

### REPLACE — Section 2.3, item **D. Suggested for you** (full replacement — this is the "proper logic" section)

**D. Suggested for you — logic and layout**

*Visibility rule:* hidden entirely until the user has selected at least one destination. Not shown as an empty state before that — an empty bento grid reads as broken, not "coming soon."

*Ranking logic (in priority order):*
1. **Season/date match** — if the user has picked travel dates, suggestions tagged with a matching seasonal window (e.g. cherry blossom, monsoon trekking, winter festivals) rank first. This is the single highest-value personalization for a travel app and costs nothing extra to compute if activities are pre-tagged with date ranges.
2. **Destination match** — filtered to the selected city/region(s); if multiple destinations are chosen, interleave results so no single city dominates the row.
3. **Category diversity** — never show 6 cards from the same category. Enforce a mix: at least one each of Sightseeing, Food, Nature/Outdoor, Culture, where available, before repeating a category.
4. **Popularity / rating** — within a tied category+season match, higher-rated or more-bookmarked items surface first.
5. **Fallback** — if the destination has fewer than 3 tagged suggestions, don't show a half-empty row; instead show a labeled fallback set: "Popular across India" (or the region), clearly sub-labeled so the user understands why these appeared.

*Bento layout (replaces the plain horizontal scroll row):*
- Desktop: a 2-row bento grid, not a uniform row. Slot 1 (top-left) is a **2×1 featured tile** for the single highest-ranked suggestion — larger photo, category chip, short one-line "why" (e.g. "Best in cherry blossom season"). Remaining 4–5 slots are standard 1×1 tiles.
- Mobile: featured tile becomes the first full-width card in a snap-scroll carousel; standard tiles follow at 1.15-visible width.
- Each tile: photo (glass panel with scrim), category chip (top-left, `accent-100` glass pill), place/activity name (Lora 16/500), ₹ estimated cost (Inter 13/600), "+ Add" button.

*Functional tie-in (not just decorative):* tapping "+ Add" does two things — (1) the card flips to an "Added ✓" state in place, and (2) it creates a pre-filled draft Section on Screen 05 (title = suggestion name, category carried over as a tag) so the two screens are actually connected, not cosmetically similar.

*Refresh:* a small "Shuffle" icon-button top-right of the section re-runs the ranking with the next-best 6 candidates, for users who want more options without leaving the page.

---

### REPLACE — currency everywhere in Screen 04 & 05 text/wireframes

Find/replace across the whole document:
- `"$"` → `"₹"`
- `"¥"` → `"₹"`

Numeric formatting note to add wherever budget figures appear:
> All currency values use ₹ with Indian digit grouping (e.g. ₹1,20,000, not ₹120,000), Inter tabular numerals, no decimal places unless the amount is under ₹100.

---

### REPLACE — Section 3 in full (Screen 05 — Build Itinerary)

## 3. Screen 05 — Build Itinerary

### 3.1 Purpose & User Goal

The user breaks the trip into stops (cities, or legs like "Hotel," "Activities," "Transport" for a single-city trip) and assigns each a date range and a ₹ budget. This is the working core of the app: it must feel editable and reorderable, and must always show budget health at a glance. Glass is used only for the page chrome and photo-bearing headers — every field the user actually reads numbers from is a flat card.

**Primary goal:** add / edit / reorder sections, each with a date range and a ₹ budget, and see a running total against the overall trip budget.
**Secondary goal:** keep momentum from Screen 04 — suggestions added there should already appear here as draft sections.

### 3.2 Layout — Desktop (≥1024px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  GlobeTrotter        Plan a Trip   Build Itinerary            ⚙  👤        │  Nav, glass-fill-strong
├────────────────────────────────────────────────────────────────────────────┤
│  ← Back to trip            Kyoto in cherry blossom season                  │  Breadcrumb + trip name, glass strip
├──────────────────────────────────────────────────┬─────────────────────────┤
│  Build itinerary                                  │  TRIP SUMMARY (bento,   │
│  Break your trip into stops. Add dates, a ₹       │  sticky glass panel)    │
│  budget and activities to each one.               │  ┌───────────────────┐ │
│                                                    │  │ 8 days · 2 stops  │ │
│  ┌──────────────────────────────────────────────┐│  │ ▓▓▓▓▓▓▓░░░  68%  │ │  flat progress bar
│  │ ⣿ STOP 01                     ⌄   ⧉   🗑     ││  │ ₹42,500 / ₹62,000│ │  flat card, always
│  │ ┌──────────────────────────────┐              ││  └───────────────────┘ │
│  │ │ Tokyo, Japan                 │  flat card    ││  Budget by category    │
│  │ └──────────────────────────────┘              ││  Stay        ▓▓▓▓ 40% │
│  │ 📅 Sep 12 → Sep 16   ₹ Budget: 24,000          ││  Food        ▓▓   20% │
│  │ ┄ ┄ ┄ ┄ ┄ ┄  perforated divider  ┄ ┄ ┄ ┄ ┄ ┄  ││  Activities  ▓     15%│
│  │ Notes                                          ││  Transport   ▓▓    25%│
│  │ ┌──────────────────────────────┐              ││                        │
│  │ │ First time in Tokyo, want... │              ││  ⚠ Stop 01 is 8% over │
│  │ └──────────────────────────────┘              ││    its ₹ budget        │
│  │ Activities                                     ││                        │
│  │  • Senso-ji Temple visit      ₹1,200    ✕     ││  [ Preview itinerary ] │
│  │  • teamLab Planets            ₹3,800    ✕     ││                        │
│  │  + Add activity                                ││                        │
│  └──────────────────────────────────────────────┘│                        │
│                                                    │                        │
│  ┌──────────────────────────────────────────────┐│                        │
│  │ ⣿ STOP 02  (collapsed)         ⌄   ⧉   🗑     ││                        │
│  │ Kyoto, Japan · Sep 16 → Sep 20 · ₹18,500      ││                        │
│  └──────────────────────────────────────────────┘│                        │
│                                                    │                        │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐│                        │
│    ✚  Add another section                        ││                        │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘│                        │
├────────────────────────────────────────────────────┴─────────────────────────┤
│                                              [ Save & exit ]   [ Continue → ] │  glass-fill-strong footer
└────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Component Breakdown

**A. Context header** — glass strip (`glass-fill-strong`), breadcrumb "← Back to trip" (Inter 14/500, `ink-700`, hover `accent-600`) + trip name (Lora 16/500). Sits directly under the nav, not sticky (only the summary panel and footer stay sticky, to avoid stacking three fixed bars).

**B. Section / Stop Card** — flat card (`card-flat`, `radius-lg`), since every value inside it is something the user must read precisely:
1. **Header row:** drag handle (⣿, `ink-300`), "STOP 0N" overline (Inter 12/600 uppercase, `ink-500`), right-aligned: collapse chevron, duplicate, delete (confirm popover, never instant).
2. **Title field:** editable inline, Lora 18/500 at rest, switches to a bordered input on focus.
3. **Meta row:** date-range field (opens the shared calendar popover) + **₹ budget field** — currency prefix is a static `₹` glyph inside the input, Indian digit grouping applied as the user types, numeric keyboard triggered on mobile.
4. **Perforated divider** — dashed rule with two cut-out circles, the one motif carried over from the ticket-stub idea; purely decorative, keeps continuity with Screen 04's suggestion cards.
5. **Notes** — optional textarea, 2 lines collapsed, "Show more" if longer.
6. **Activities list** — each row: name (Inter 15), **₹ cost** (Inter 15/600 tabular-nums, right-aligned), remove icon on hover/focus. "+ Add activity" opens an inline name+₹cost input pair, confirm/cancel icons, no modal.
7. **Per-stop budget bar** (only when expanded, activities exist) — flat progress bar comparing summed activity costs to the stop's ₹ budget field; `success`/`warning`/`danger` fill, diagonal hatch texture added past 100% so it isn't color-only.

**Collapsed state:** single row — drag handle, title, `·`-separated summary ("Kyoto, Japan · Sep 16 → Sep 20 · ₹18,500"), same action-icon cluster.

**C. "Add another section" button** — dashed `accent-300` border on `canvas-gradient-soft`, the one non-solid, non-glass interactive element on the screen so it never competes with real content. Solidifies to `accent-400` border + `accent-50` fill on hover.

**D. Trip Summary panel** — the one genuinely glass element on this screen (sticky right rail, `glass-fill`, `radius-lg`, 320px):
- Stat row: "N days · N stops" (Inter 13, `ink-500`).
- Overall ₹ budget progress bar — **flat**, not glass, even inside this glass panel (nested card, `card-flat`): track `surface-sunken`-equivalent, fill `accent-400`→`warning` at 85%→`danger` past 100%; ₹ value pair above it, Inter 20/600 tabular-nums, Indian digit grouping.
- Budget-by-category mini bars: Stay/Food/Activities/Transport, flat, labeled left, % right.
- Alert banner: `warning`/`danger` tint at 10%, colored left border, icon + one line, appears only when relevant — no fabricated "all good" state.
- **Preview itinerary** — secondary button, forward to Screen 06.

**E. Footer action bar** — `glass-fill-strong`, sticky. **Save & exit** (ghost) / **Continue →** (primary, never fully disabled — shows a small `warning` badge dot if any section is missing dates).

### 3.4 Interaction & State Specs

| Interaction | Spec |
|---|---|
| Reorder sections | Drag handle only, 150ms press-hold threshold, card lifts (shadow deepens, 1.5° rotate), `accent-100` insertion line shows drop target |
| Add activity | Inline morph to name + ₹cost input pair, no modal |
| Delete a section | Confirm popover anchored to trash icon: "Remove this stop? Its activities go with it." |
| Over-budget stop | Budget field border → `danger`; per-stop bar fills past 100% in `danger` with hatch texture |
| Collapse/expand | Chevron rotates 180°, height auto-animates 200ms |
| Empty state (no sections) | Centered line-art (single stamped ticket, `accent-300` strokes) + "No stops yet — add your first one to start building the itinerary." + solid (not dashed) primary "Add a section" CTA |
| Draft sections from Screen 04 | Any suggestion "Added" on Screen 04 arrives here pre-filled (title + category tag); user still must set its dates and ₹ budget — a `warning` badge on that card until they do |
| Mobile: Trip Summary | Collapses to a floating glass pill above the footer: "Trip summary · 68%" — tap opens a bottom sheet with identical content |

### 3.5 Microcopy

| Element | Copy |
|---|---|
| H1 | "Build itinerary" |
| Subhead | "Break your trip into stops. Add dates, a ₹ budget and activities to each one." |
| Section overline | "STOP 01", "STOP 02"… (re-numbers on reorder) |
| Title placeholder | "Name this stop — a city, a hotel, an activity block…" |
| Add-section button | "Add another section" |
| Add-activity affordance | "+ Add activity" |
| Delete confirm | "Remove this stop? Its activities go with it." |
| Empty state | "No stops yet — add your first one to start building the itinerary." |
| Pre-filled from suggestion badge | "Needs dates & budget" |
| Over-budget alert | "Stop 01 is 8% over its ₹ budget" |
| Overall alert | "Your trip is 68% through its ₹ budget" *(shifts to danger tone past 100%: "Your trip is 6% over budget")* |
| Continue badge tooltip | "Some stops are missing dates" |

### 3.6 Responsive Behavior

- **≥1024px:** two-column, content ~66% / summary rail ~34%.
- **768–1023px:** single column; Trip Summary becomes an inline flat/glass card directly under the header, not a sidebar.
- **<768px:** single column, 16px padding; meta row (date + ₹ budget) stacks vertically; Trip Summary → floating pill + bottom sheet; footer → two stacked full-width buttons; reorder switches to ↑/↓ icon buttons instead of drag, to avoid fighting scroll gestures.

---

### REPLACE — Section 4, first two rows of the table (elevation column values)

| Component | Surface | Radius | Notes |
|---|---|---|---|
| Primary button | Flat, `accent-400` fill | `md` | White Inter 14/600 label, disabled = `ink-300` fill |
| Secondary/ghost button | Flat, hairline `accent-200` border | `md` | `ink-700` text, `accent-50` fill on hover |
| Dashed action button | Flat, dashed `accent-300` border | `lg` | Reserved for "add another" actions only |
| Text/₹ input | Flat card | `md` | `ink-300` hairline at rest, `accent-400` ring on focus |
| Stub Card (destination, bento) | Glass | `lg` | Perforated divider between image and metadata |
| Stub Card (itinerary stop) | **Flat card** (data-heavy) | `lg` | Perforated divider between meta and content |
| Nav bar | Glass — strong | — | Sticky, 64px |
| Trip Summary panel shell | Glass | `lg` | Contains only flat/nested cards for the actual numbers |
| Modal / confirm dialog | Glass, floating | `xl` | Scrim `ink-900 @ 40%` |
