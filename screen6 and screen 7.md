# GlobeTrotter — Design Specification
### Screen 06 · My Trips (Trip Listing) &nbsp;|&nbsp; Screen 07 · User Profile & Settings
**Stack:** React + Tailwind CSS &nbsp;·&nbsp; **Typeface:** Lora + Inter &nbsp;·&nbsp; **Style:** Glassmorphism + Bento Grid (no neomorphism) &nbsp;·&nbsp; **Currency:** ₹ (INR)

---

## 0. Design Philosophy for This Pair

Screens 04–05 are about *building* a trip. Screens 06–07 are about *living with* the trips you've already built, and about the person behind them. The job here shifts from "capture input fast" to "let me survey my travel life at a glance, and trust this app with my identity." Two consequences follow:

1. **Trip cards are the atom of Screen 06** — the same visual grammar (glass, cover photo, scrim, category/status chip) established for the Screen 04 suggestion tiles is reused here, so a trip card in "My Trips" is visually the same *object* the user saw themselves add earlier. Consistency here isn't decoration — it's what makes the product feel like one coherent system rather than four separate screens.
2. **Screen 07 is where glass steps back.** A profile/settings screen is fundamentally a form the user must trust — email, phone, delete-account. Glass stays only for the identity header (avatar + cover); every editable field and every account-management action sits on a flat, high-contrast card, per the same rule established for budgets and dates in Screen 05.

No neomorphism appears anywhere in this document — every elevation reference below is either **Glass** or **Flat**, as defined in the shared foundations.

---

## 1. Foundations Recap (shared with Screens 04–05 — reproduced here for a self-contained spec)

### 1.1 Color

**Accent (interactive / brand — from brief)**

| Token | Hex | Usage |
|---|---|---|
| `accent-50` | `#e8f4ff` | Rare tint fills behind icons |
| `accent-100` | `#c0deff` | Selected chip background, hover tint |
| `accent-200` | `#8ac2ff` | Progress track (low state) |
| `accent-300` | `#55a6ff` | Secondary icons, dashed borders |
| `accent-400` | `#2090ff` | **Primary interactive color** — buttons, active tab, focus |
| `accent-500` | `#0073e6` | Button hover |
| `accent-600` | `#005bcc` | Button active/pressed |
| `accent-700` | `#0044a3` | Text links on light surfaces (AA-safe) |
| `accent-800` | `#002e7a` | High-emphasis text-on-accent |
| `accent-900` | `#001852` | Reserved for dark-mode inversion |

**Ink (text)**

| Token | Hex | Usage |
|---|---|---|
| `ink-900` | `#0B1E3D` | Headings, primary text |
| `ink-700` | `#3A4C6B` | Secondary text |
| `ink-500` | `#6B7C99` | Placeholder, helper copy |
| `ink-300` | `#A7B5CC` | Disabled text, dividers |

**Canvas & Glass**

| Token | Value | Usage |
|---|---|---|
| `canvas-gradient` | `linear-gradient(160deg, #EAF4FF 0%, #C9E3FF 45%, #8AC2FF 100%)` | Full-page background behind glass zones |
| `canvas-gradient-soft` | `linear-gradient(160deg, #F4FAFF 0%, #E8F4FF 100%)` | Background behind form-dense zones |
| `glass-fill` | `rgba(255,255,255,0.16)` | Panels over vivid canvas (trip cards, profile header) |
| `glass-fill-strong` | `rgba(255,255,255,0.55)` | Panels over light zones (nav, footer, filter bar) |
| `glass-border` | `rgba(255,255,255,0.4)` | 1px inner border on every glass panel |
| `glass-blur` | `18px` | Standard backdrop blur |
| `glass-shadow` | `0 8px 32px rgba(0,46,122,0.14)` | Single soft shadow under glass |

**Flat data-card**

| Token | Value | Usage |
|---|---|---|
| `card-flat` | `#FFFFFF` | Forms, settings rows, account fields |
| `card-flat-border` | `accent-100` | 1px border at rest |
| `card-flat-shadow` | `0 2px 10px rgba(0,46,122,0.06)` | Single soft shadow |

**Semantic**

| Token | Hex | Usage |
|---|---|---|
| `success` | `#1E9E6D` | Confirmations, "Completed" status |
| `warning` | `#D98C2B` | "Upcoming — soon" countdown, pending states |
| `danger` | `#D64545` | Delete actions, errors, destructive confirms |
| `info` | `accent-400` | "Ongoing" status badge |

### 1.2 Typography

- **Lora** (400/500/600/700 + italic) — page titles, trip names, empty-state headlines, section headers.
- **Inter** — labels, form values, dates, ₹ figures (tabular numerals), buttons, navigation, body copy.

| Role | Face | Size/Line-height | Weight |
|---|---|---|---|
| Display | Lora | 32/40 | 600 |
| H1 | Lora | 26/34 | 600 |
| H2 | Lora | 20/28 | 500 |
| H3 (card title) | Lora | 17/24 | 500 |
| Body | Inter | 15/22 | 400 |
| Body small | Inter | 13/18 | 400 |
| Label/Overline | Inter | 12/16 | 600, uppercase, 0.06em |
| Numeric (₹, dates) | Inter | 14–20 | 600, tabular-nums |
| Button | Inter | 14/20 | 600 |

### 1.3 Spacing, Radius, Elevation

- Spacing scale: 4·8·12·16·24·32·48·64·96.
- Radius: `sm 10px · md 14px · lg 20px · xl 28px · full 999px`.
- **Elevation — two families only, never mixed on one component:**

| Surface | Spec | Used for |
|---|---|---|
| **Glass** | `glass-fill` + `blur(18px)` + `glass-border` + `glass-shadow`, `translateY(-2px)` + deeper shadow on hover | Photo-bearing cards, nav, headers, modals |
| **Glass — strong** | `glass-fill-strong`, `blur(12px)` | Nav/footer/filter bars over light zones |
| **Flat card** | `card-flat` + `card-flat-border` + `card-flat-shadow`, border → `accent-400` on focus/hover (no lift) | Every form field, settings row, account action |

### 1.4 Accessibility Guardrails

- Every glass panel over photography gets a bottom-up scrim (`ink-900 @ 0%→45%`) behind text — guaranteed ≥4.5:1 contrast.
- No color-only status communication: status badges (Ongoing/Upcoming/Completed) always pair color with a text label and an icon.
- Every actionable glass element keeps its `glass-border` outline at rest plus a 2px `accent-400` focus ring on keyboard focus.
- Minimum hit target 44×44px for all icon buttons (edit/delete/view, avatar upload, toggle switches).
- Destructive actions (delete trip, delete account) never fire on a single click — always a confirm step, and never styled identically to a neutral action.
- Respect `prefers-reduced-motion`: hover-lift and blur transitions drop to opacity-only.

### 1.5 Motion

- Standard easing `cubic-bezier(0.4,0,0.2,1)`, 150–220ms.
- Card hover: lift 2px + shadow deepen, 150ms.
- Tab/segmented-control switch: 180ms cross-fade of list content, active pill slides via `transform`, not layout reflow.
- Toggle switches (Screen 07): 150ms thumb slide + track color fade.
- Destructive confirm dialogs: 180ms scale-in from 0.97, scrim fades in over 150ms.

### 1.6 Nav Bar — Updated for Full Flow

With Screens 06–07 in scope, the nav now covers the whole loop: survey trips → plan a new one → build it out → manage yourself.

- **Logo:** "GlobeTrotter" wordmark, Lora 18/600, `ink-900`.
- **Primary links, in this order:** "My Trips" · "Plan a Trip" · "Build Itinerary" — Inter 14/600. Active: `accent-400` text + 2px underline. Inactive: `ink-700`, hover → `accent-600`.
- **Right cluster:** avatar only (32px circular, real photo or initials on `accent-100` fill) — clicking it opens **Profile & Settings (Screen 07)**. The separate gear icon from earlier drafts is removed: Screen 07 *is* settings now, so a second entry point would be redundant.
- **Surface:** `glass-fill-strong`, `blur(12px)`, sticky top, 1px bottom border `glass-border`, height 64px.

---

## 2. Screen 06 — My Trips

### 2.1 Purpose & User Goal

This is the user's travel home base — every trip they've ever planned, organized by where it sits in time (Ongoing, Upcoming, Completed), scannable in seconds, with a clear single path into any of them and an unmissable way to start a new one.

**Primary goal:** find a specific trip fast, or start a new one.
**Secondary goal:** get an at-a-glance sense of travel history/plans — this screen doubles as a small personal travel journal when browsed passively.

### 2.2 Layout — Desktop (≥1024px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  GlobeTrotter    My Trips   Plan a Trip   Build Itinerary            👤    │  Nav, glass-fill-strong
├────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   My Trips                                              [ + Plan a trip ]  │  H1 + primary CTA
│   Every journey, past and upcoming, in one place.                          │
│                                                                              │
│  ┌────────────────────────────────────┐  [All] Ongoing Upcoming Completed  │  Search (flat) + segmented tabs (glass)
│  │ ⚲ Search your trips...             │  Group by ▾   Filter ▾   Sort ▾    │
│  └────────────────────────────────────┘                                    │
│                                                                              │
│  Ongoing — 1 trip ───────────────────────────────────────────────────────  │  Section label, Lora H2
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  photo                                                                 │ │  Featured wide glass card
│  │  ┄┄┄┄┄┄┄┄  ●Ongoing                                                    │ │  (2× width — currently live trip
│  │  Kyoto in cherry blossom season          📍 2 cities  📅 Sep 12–20    │ │   gets visual priority)
│  │  ₹42,500 / ₹62,000 spent          [View] [Edit] [⋯]                   │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  Upcoming — 3 trips ──────────────────────────────────────────────────────  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                           │  Bento grid, 3-up
│  │ photo      │  │ photo      │  │ photo      │                           │
│  │ ●Upcoming  │  │ ●Upcoming  │  │ ●Upcoming  │                           │
│  │ Goa Getaway│  │ Manali Trek│  │ Singapore  │                           │
│  │ in 12 days │  │ in 34 days │  │ in 61 days │                           │
│  │ [View][⋯]  │  │ [View][⋯]  │  │ [View][⋯]  │                           │
│  └────────────┘  └────────────┘  └────────────┘                           │
│                                                                              │
│  Completed — 5 trips ─────────────────────────────────────────────────────  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  →  Show all (5)          │  Row caps at 3, rest via link
│  │ photo       │  │ photo       │  │ photo       │                          │
│  │ ✓Completed │  │ ✓Completed │  │ ✓Completed │                           │
│  │ Jaipur Trip│  │ Kerala Backw│  │ Ladakh Ride│                           │
│  │ [View][⋯]  │  │ [View][⋯]  │  │ [View][⋯]  │                           │
│  └────────────┘  └────────────┘  └────────────┘                           │
│                                                                              │
└────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Component Breakdown

**A. Page header**
- H1 "My Trips" (Lora 26/600) + subhead (Inter 15, `ink-700`) "Every journey, past and upcoming, in one place."
- **Primary CTA** "+ Plan a trip" — solid `accent-400` button, top-right, always visible (not just in an empty state) since starting a new trip is a first-class action at any time, not a fallback.

**B. Search & Control Bar** — flat card row (`card-flat`, `radius-md`), sits directly under the header:
- **Search field** (flat, `Pressed`-style focus border in `accent-400`) — searches trip name and destination city, debounced 250ms, live-filters all sections below.
- **Segmented status tabs** — glass pill group: `All` (default) · `Ongoing` · `Upcoming` · `Completed`. Selecting a status collapses the page from three sectioned rows into one continuous filtered grid (no more section labels needed — the tab itself communicates the filter).
- **Group by ▾** — Destination, Status (default), Month.
- **Filter ▾** — date range, budget range, number of destinations.
- **Sort by ▾** — Departure date (soonest first, default for Upcoming), Recently edited, Budget (high→low), Alphabetical.

**C. Trip Card** — the core reusable unit, glass surface (same grammar as Screen 04's suggestion tiles):
- **Cover photo** top, `radius-lg` top corners, bottom gradient scrim for text contrast.
- **Status badge**, top-left over photo: glass pill, icon + label — `●Ongoing` (`info` dot), `●Upcoming` (`warning` dot) with a live countdown ("in 12 days"), `✓Completed` (`success` check).
- **Trip name** — Lora 17/500, sits on the scrim, white text (scrim guarantees contrast).
- **Meta row** — 📍 destination count/city names, 📅 date range — Inter 13, `ink-700` on the card's lower (non-photo) glass zone.
- **Budget snapshot** (Ongoing/Upcoming cards only) — small **flat nested chip**, not glass, since it's a number: "₹42,500 / ₹62,000 spent" with a hairline progress underline in `accent-400`→`warning`/`danger` as appropriate. Completed trips show final total spend instead, no progress bar.
- **Actions** — `View` (primary text link, `accent-600`), `Edit` (icon), `⋯` overflow menu (Duplicate, Share, Delete) — actions row fades in on hover (desktop) / always visible (mobile/touch, since there's no hover state to reveal them).
- **Featured variant:** the single most time-relevant card (the active Ongoing trip, or the soonest Upcoming one if none is Ongoing) renders as a **2× width bento tile** at the top of its section — larger photo, budget bar always visible, no need to click through to sense trip health.

**D. Section labels** — H2 (Lora 20/500) + trip count, e.g. "Upcoming — 3 trips." Sections only render if they contain at least one trip; an entirely-empty section is omitted rather than shown empty (a user with zero completed trips shouldn't see a hollow "Completed" heading).

**E. "Show all" overflow** — each section grid caps at 3 cards (desktop) / 1 row; if more exist, a trailing link-style tile ("→ Show all (5)") expands the section in place rather than navigating away.

### 2.4 States

| State | Behavior |
|---|---|
| First-ever visit, zero trips anywhere | Full-page empty state replaces the grid: centered line-art (a single suitcase/ticket, `accent-300` strokes), H2 "No trips yet," body "Your next journey starts with a single tap," solid primary "+ Plan a trip" CTA — search/filter bar is hidden entirely (nothing to search) |
| A status tab has zero results | Small inline empty row within that view: "No upcoming trips — [+ Plan one]" (text link inline, not a full illustration — reserve the big empty state for true zero-trips only) |
| Search with no matches | "No trips match '{query}'" + a "Clear search" link |
| Loading | Skeleton bento cards (photo block + 2 text lines shimmer, opacity 0.6↔1, frozen at 0.8 under reduced-motion) |
| Delete trip | `⋯ → Delete` opens a glass confirm dialog: "Delete '{trip name}'? This can't be undone." [Cancel] [Delete] (danger-styled) |
| Duplicate trip | Instant action, toast confirmation "Trip duplicated — find it under Upcoming," no dialog needed (non-destructive) |

### 2.5 Microcopy

| Element | Copy |
|---|---|
| H1 | "My Trips" |
| Subhead | "Every journey, past and upcoming, in one place." |
| CTA | "+ Plan a trip" |
| Search placeholder | "Search your trips..." |
| Status tabs | "All" · "Ongoing" · "Upcoming" · "Completed" |
| Upcoming countdown | "in {n} days" (switches to "Tomorrow" / "Today" at the edge) |
| Empty (zero trips) | "No trips yet" / "Your next journey starts with a single tap." |
| Empty (filtered) | "No upcoming trips — [+ Plan one]" |
| Delete confirm | "Delete '{trip name}'? This can't be undone." |
| Duplicate toast | "Trip duplicated — find it under Upcoming." |

### 2.6 Responsive Behavior

- **≥1024px:** bento grid 3-up per section, featured card spans 2 columns.
- **768–1023px:** 2-up grid, featured card spans full width instead of 2-of-3.
- **<768px:** single column; each section becomes a horizontal snap-scroll row (consistent with Screen 04's suggestion carousel) rather than a stacked grid, to keep the page scannable without excessive vertical scroll; search/filter bar controls collapse into a single "Filters" glass icon-button that opens a bottom sheet.

---

## 3. Screen 07 — User Profile & Settings

### 3.1 Purpose & User Goal

Two jobs live on one screen: **manage who you are** (name, photo, contact info, preferences, account deletion) and **revisit your trips from a personal angle** (preplanned trips you're excited about, previous trips as a travel history). The identity half is a glass "cover" moment; everything actionable underneath is flat and unambiguous, because this is the one screen where a mistake (wrong email, accidental account deletion) is costly.

**Primary goal:** view/edit personal details confidently; find account-level actions without hunting.
**Secondary goal:** browse Preplanned and Previous trips as a lighter-weight, personal-feeling echo of Screen 06.

### 3.2 Layout — Desktop (≥1024px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  GlobeTrotter    My Trips   Plan a Trip   Build Itinerary            👤    │
├────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  [ cover gradient photo band ]                                       │ │  Glass identity header
│  │        ⬤                                                             │ │
│  │      (avatar,                Neel Patel                              │ │
│  │       upload on              neelpatel0179@email.com                 │ │
│  │       hover)                 📍 Ahmedabad, India        [Edit profile]│ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌───────────────────────┐   ┌──────────────────────────────────────────┐│
│  │ ACCOUNT DETAILS        │   │  Preplanned Trips — 2 ─────────────────  ││  flat card (left col)
│  │ First name  [_______]  │   │  ┌─────────┐ ┌─────────┐               ││  + bento (right col)
│  │ Last name   [_______]  │   │  │ photo   │ │ photo   │               ││
│  │ Email       [_______]  │   │  │ Bali    │ │ Leh     │               ││
│  │ Phone       [_______]  │   │  │[View]   │ │[View]   │               ││
│  │ City        [_______]  │   │  └─────────┘ └─────────┘               ││
│  │ Country     [_______]  │   │                                          ││
│  │       [ Save changes ] │   │  Previous Trips — 5 ────────  Show all  ││
│  ├───────────────────────┤   │  ┌─────────┐ ┌─────────┐ ┌─────────┐    ││
│  │ PREFERENCES             │   │  │ photo   │ │ photo   │ │ photo   │    ││
│  │ Language    [English ▾] │   │  │ Jaipur  │ │ Kerala  │ │ Ladakh  │    ││
│  │ Currency    ₹ INR       │   │  │[View]   │ │[View]   │ │[View]   │    ││
│  │ (fixed — not editable)  │   │  └─────────┘ └─────────┘ └─────────┘    ││
│  ├───────────────────────┤   │                                          ││
│  │ SAVED DESTINATIONS      │   │                                          ││
│  │  Goa ✕   Manali ✕       │   │                                          ││
│  │  Singapore ✕            │   │                                          ││
│  ├───────────────────────┤   │                                          ││
│  │ ⚠ DANGER ZONE           │   │                                          ││
│  │ [ Delete my account ]   │   │                                          ││
│  └───────────────────────┘   └──────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Component Breakdown

**A. Identity Header** — the one glass moment on this screen (`glass-fill`, `radius-xl`, full-width):
- Cover band: soft `canvas-gradient` (or a user-uploaded cover photo if that feature exists), 160px tall.
- **Avatar** — 96px circle, overlaps the cover/content boundary by half its height (classic profile-header composition), `glass-border` ring; hovering reveals a camera-icon overlay for upload, click opens the OS file picker directly (no modal needed for something this simple).
- **Name** — Lora 22/600, `ink-900`.
- **Email** — Inter 14, `ink-700`, directly under name.
- **Location** — 📍 city, country — Inter 13, `ink-500`.
- **"Edit profile"** — secondary button, top-right of the header; clicking scrolls to and focuses the Account Details card rather than opening a separate modal, keeping editing in one place.

**B. Account Details card** — flat (`card-flat`, `radius-lg`), left column:
- Fields: First name, Last name, Email, Phone, City, Country — each a labeled flat text input (Inter 12/600 uppercase label, `ink-500`, 6px above field), matching the exact field set from the original Registration screen for consistency across the product.
- Inline validation: email format checked on blur; if the user changes email, show a helper note "We'll send a confirmation link to your new address" rather than switching it silently.
- **Save changes** — primary button, right-aligned under the fields, disabled until at least one field is dirty; shows a brief inline "Saved ✓" (success, Inter 13) next to the button for 2s after a successful save rather than a toast, since the user's eyes are already right there.

**C. Preferences card** — flat, directly below Account Details, same column, visually grouped as one continuous card with a hairline divider between subsections (not two separate floating cards — reduces visual clutter in a settings-dense column):
- **Language** — flat select dropdown.
- **Currency** — displayed as a fixed, non-editable row: "₹ INR" with a small (i) tooltip "GlobeTrotter currently supports INR only" — shown as a disabled-style row, not a functioning dropdown, so the constraint reads as intentional rather than broken.

**D. Saved Destinations** — same card, next subsection: destinations the user has bookmarked (from City Search / Screen 04 suggestions) render as removable chips (`accent-100` fill, `accent-800` text, `radius-full`), wrapping across the card width; empty state: "Bookmark a place while planning a trip and it'll show up here."

**E. Danger Zone** — visually separated (extra top margin + a `danger`-tinted 1px top border, not just another subsection) so it can never be mistaken for a routine setting:
- **Delete my account** — outlined button in `danger` (not filled — filled-red would visually compete for attention with the primary Save button above it; an outline is enough weight for something gated behind a confirm flow anyway).
- Clicking opens a two-step confirm: Step 1 explains consequences ("This permanently deletes your account, all trips, and saved data. This can't be undone."); Step 2 requires typing the word **DELETE** into a flat input before the final button un-disables — deliberately high-friction, appropriate for the only truly irreversible action in the product.

**F. Preplanned Trips** (right column, top) — bento row reusing the **Trip Card** component from Screen 06 (glass, photo, name, `[View]`), filtered to trips with status Upcoming that the user has marked as favorites/preplanned; caps at 2–3 visible with a "Show all" link into Screen 06 pre-filtered to Upcoming.

**G. Previous Trips** (right column, below) — same Trip Card component, filtered to Completed status; this is intentionally the *same* component as Screen 06's Completed section — Screen 07 is a personalized lens onto data that already exists, not a parallel data model.

### 3.4 States

| State | Behavior |
|---|---|
| No preplanned/previous trips yet | That section shows a single inline line: "Nothing here yet — [Plan a trip]" instead of an empty bento grid |
| Avatar upload | Circular upload progress ring around the avatar during upload; on failure, avatar reverts with an inline error: "Couldn't upload photo — try a smaller file" |
| Unsaved account changes + navigation away | Native-style confirm: "You have unsaved changes — leave anyway?" |
| Delete-account flow | Step 1 → Step 2 (type-to-confirm) → on success, sign-out redirect to a plain confirmation page, not back into the app |
| Saved destination removed | Chip fades out in place (150ms), no confirm needed (non-destructive, easily re-added) |

### 3.5 Microcopy

| Element | Copy |
|---|---|
| Edit profile button | "Edit profile" |
| Save button | "Save changes" |
| Save success | "Saved ✓" |
| Email change helper | "We'll send a confirmation link to your new address" |
| Currency tooltip | "GlobeTrotter currently supports INR only" |
| Saved destinations empty | "Bookmark a place while planning a trip and it'll show up here." |
| Danger zone heading | "Danger zone" |
| Delete account button | "Delete my account" |
| Delete step 1 | "This permanently deletes your account, all trips, and saved data. This can't be undone." |
| Delete step 2 | "Type DELETE to confirm." |
| Preplanned empty | "Nothing here yet — [Plan a trip]" |
| Previous trips empty | "No trips completed yet — your travel history will show up here." |

### 3.6 Responsive Behavior

- **≥1024px:** two-column as wireframed — settings column ~38%, trips column ~62%.
- **768–1023px:** single column, order: Identity header → Preplanned Trips → Previous Trips → Account Details → Preferences → Saved Destinations → Danger Zone (trips surface earlier since they're the more frequent reason to visit; settings drop below, still fully reachable by scroll).
- **<768px:** same order as tablet; Trip Card bento rows become horizontal snap-scroll (consistent with Screens 04/06); Account Details fields stack full-width; Danger Zone keeps its separated border treatment and sits as the final scroll item, never accidentally adjacent to a primary action.

---

## 4. Shared Component Additions (new since Screens 04–05)

| Component | Surface | Radius | Notes |
|---|---|---|---|
| Trip Card | Glass | `lg` | Shared by Screens 04 (as destination variant), 06, and 07 — one component, three data variants |
| Status badge (Ongoing/Upcoming/Completed) | Glass pill, `info`/`warning`/`success` dot | `full` | Icon + label always paired, never color-only |
| Segmented tab control | Glass | `full` (pill group) | Used for status filtering on Screen 06 |
| Budget snapshot chip | Flat, nested inside a glass Trip Card | `sm` | The one flat element allowed inside an otherwise-glass card, because it's a number |
| Settings field row | Flat | `md` | Label above, input below, consistent across Registration, Screen 05 budget fields, and Screen 07 |
| Toggle switch | Flat track, `accent-400` fill when on | `full` | For any future boolean preference |
| Removable chip | Flat, `accent-100` fill | `full` | Saved destinations, selected destination pills (shared with Screen 04) |
| Danger action button | Flat, `danger` outline (not filled) | `md` | Reserved for irreversible actions only |
| Two-step confirm dialog | Glass, floating | `xl` | Delete account; type-to-confirm pattern |

---

## 5. Tailwind Token Mapping (reference only — no implementation code)

No new tokens are required beyond those already defined for Screens 04–05 (`accent.*`, `ink.*`, `canvas-gradient*`, `glass-*`, `card-flat*`, `success/warning/danger/info`, `fontFamily.display/sans`, `borderRadius.sm/md/lg/xl/full`). Screens 06–07 reuse the system exactly, which is itself a signal of a well-formed design system: two new screens, zero new primitives needed beyond a handful of composite components (§4).

---

## 6. Handoff Notes for React Implementation (structure only — no code)

- `AppShell` (nav, shared) — updated to include `NavLink: My Trips`, `NavLink: Plan a Trip`, `NavLink: Build Itinerary`, `AvatarMenu → Profile`
  - `MyTripsScreen` *(Screen 06)*
    - `TripSearchFilterBar` → `SearchField`, `SegmentedTabs`, `GroupByMenu`, `FilterMenu`, `SortByMenu`
    - `TripSection` (repeated: Ongoing/Upcoming/Completed) → `TripCard` (repeated, `featured` variant flag)
    - `EmptyTripsState`
  - `ProfileSettingsScreen` *(Screen 07)*
    - `IdentityHeader` → `AvatarUploader`
    - `AccountDetailsCard` → `SettingsFieldRow` (repeated)
    - `PreferencesCard` → `LanguageSelect`, `CurrencyDisplay` (read-only)
    - `SavedDestinationsCard` → `RemovableChip` (repeated)
    - `DangerZoneCard` → `TwoStepConfirmDialog`
    - `PreplannedTripsSection` → `TripCard` (shared with Screen 06)
    - `PreviousTripsSection` → `TripCard` (shared with Screen 06)

Shared primitives newly reused (not rebuilt) from Screens 04–05: `Button` (primary/secondary/danger-outline variants), `TextField`, `Pill`/`RemovableChip`, `ScreenFooterBar` (not used on Screen 07, since settings save inline rather than via a footer bar — noted here so it's not implemented redundantly).
