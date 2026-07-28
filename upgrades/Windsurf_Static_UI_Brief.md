# The Terrace — Windsurf Static UI/UX Brief (Phase A)

**Scope: presentational layer only.** No `useState`, `useEffect`, no context providers, no routing libraries, no API calls, no business logic. Every file is a standalone functional component with a default export, running on hardcoded mock data. Logic wiring is a separate, later phase — not this one.

**Status: v0 output received and audited.** All 10 routes already exist. Token fidelity is correct (colors, fonts, no shadows/glass, correct press states). Two confirmed issues to fix before this goes further — see Task 0 below. Mock data (`data.js` / `mock.js`) will be updated separately in VS Code — not part of this phase.

## Task 0 — Fix before anything else

1. **Rename files to match the existing repo** (v0 used slightly different names):

   | v0 filename | Rename to |
   |---|---|
   | `Login.jsx` | `LoginPage.jsx` |
   | `Signup.jsx` | `CreateAccount.jsx` |
   | `HomeFeed.jsx` | `Home.jsx` |
   | `Profile.jsx` | `UserProfile.jsx` |
   | `Admin.jsx` | `AdminDashboard.jsx` |
   | `Feed.jsx`, `Categories.jsx`, `ArticleDetail.jsx`, `PostArticle.jsx`, `ResetPassword.jsx` | unchanged |

2. **Discard `App.jsx` from the v0 zip entirely.** It's a preview-only harness — hash-based routing with a route-switcher toolbar, built so v0 could demo itself in isolation. It is not production code and must not be merged into the real app shell. Use the project's actual React Router setup instead.

3. **Add responsive breakpoints — currently zero exist.** Every route and component file (17 total) has no `sm:`/`md:`/`lg:` classes anywhere; the whole UI is mobile-width only. Specific gaps to fix:
   - `BottomNav.jsx` is a mobile tab bar with no desktop equivalent — needs a `lg:` sidebar or top-nav variant, hidden/shown appropriately per breakpoint.
   - Auth pages (`LoginPage.jsx`, `CreateAccount.jsx`, `ResetPassword.jsx`) hard-cap their card at `max-w-[400px]` with no surrounding layout — fine on mobile, but leaves a tiny centered box on a wide screen. Needs a `lg:` treatment (e.g. centered card with more breathing room, or a split layout).
   - `ArticleDetail.jsx` should become the two-column layout (article | widget sidebar) at `lg:` and above, single column below that — check it's not already single-column-only.
   - Feed/grid layouts (`Home`, `Categories`, `Feed`) should move from single column to multi-column grids at `md:`/`lg:`.
   
4. **Replace the current `App.jsx` shell with real routing.** The existing shell only toggles between Login/Signup/Home via `useState` — no React Router, no URL paths, and 7 of the 10 required routes aren't wired in at all. Windsurf needs to:
   - Install/use React Router, with real paths matching the PRD route list exactly: `/`, `/login`, `/signup`, `/reset-password`, `/articles/:id`, `/categories`, `/feed`, `/profile/:id`, `/admin`, `/post-article`
   - Import route components from wherever Task 0's renamed files end up (recommend keeping v0's `src/routes/` folder rather than `src/components/`, since a router setup reads more clearly with routes separated from shared components — confirm this with the team before Windsurf moves anything)
   - Fix the canvas color: `bg-[#1e140f]` → `bg-night-pitch` (this is leftover from the old rejected draft, not the locked token)
   - Preserve the existing auth-state logic pattern (`activeUser` gating access) but express it as real protected-route guards per the PRD, not a manual conditional render
   - Wire the provided `mockData.js` (already schema-correct — `category_id`, `author_id`, `article_id`, `user_id`, `reaction_type` all match the real data model) into the static components in place of whatever placeholder data currently exists in v0's `data.js`

   Do not change the visual language while doing any of this — same colors, type, spacing tokens, just routing structure and layout fixes.

## Source of truth for design

Do not invent or reference any color/type values outside of what v0 already generated. v0's output — built from `The_Terrace_Design_Tokens.md` and `tailwind.config.js` — is the design system now. If a file needs a color, font, spacing, or radius value, copy it from the v0 output or the tailwind config, never from memory or a new guess.

Quick reference (from `tailwind.config.js`):
- `bg-floodlight` / `dark:bg-night-pitch` — canvas
- `border-terracing` — hairlines, never `shadow-*`
- `text-amber-live` — reserved for live states only, nowhere else
- `font-display` (condensed caps) for headlines/scores, `font-body` for text, `font-mono` for numbers/timestamps

If any existing file uses `bg-amber-50`, `bg-white`, warm brown hex values, or `text-stone-*` — that's leftover from an earlier, rejected draft. Replace it with the tokens above.

## Task 1 — Fold in the two files not covered by v0

`MatchPredictor.jsx` and `CommentSection.jsx` weren't part of the v0 output — they're your existing widgets. Restyle them to match v0's design language exactly (same borders, spacing, type, color tokens — no shadows, no gradients), then embed them into `ArticleDetail.jsx`'s sidebar column as originally planned.

## Content rules (unchanged from original brief — still correct)

- Football-only, all mock data and copy (Premier League, La Liga, Champions League, real club names as flavor text — no real logos/photos of real players)
- Imagery rule still applies: photography for match reports, illustration for fan reactions
- Amber only on live states — if a mock "LIVE" badge appears, that's the only place amber shows up in that file

## Explicitly out of scope for this phase

- No hooks, no state, no routing, no API/fetch calls
- No restyling or "improving" on v0's design — if something looks off, flag it, don't change it
- No new colors, fonts, or effects beyond what's in the tailwind config
