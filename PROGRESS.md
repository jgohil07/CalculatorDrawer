# Calculator Drawer — build progress

Resumable checkpoint. Read this first in a new session.

**Target:** production-grade static calculator site, deployed to GitHub Pages at
`https://jgohil07.github.io/CalculatorDrawer/` (repo `jgohil07/CalculatorDrawer`, branch `main`).

## Locked decisions

- Landing page = Simple Calculator at `/` (calculator-only, no category nav on landing)
- Drawer = `calculators.html`, reachable from the header grid link on every page
- `simple-calculator.html` = noindex redirect stub → `/`
- Site name stays **Calculator Drawer**; footer signature is **"Build by Jay"**
- Currency: auto-detect ₹/$/€/£ from browser locale, fallback `$`, tax pages locked to ₹
- Zero-start: amounts 0, rates/tenures keep 2026-sensible defaults, result panel hints until an amount is entered
- Homepage SEO prose lives in closed `<details>` blocks
- Audit findings: fix everything, report after
- Canonical base URL baked in absolutely; no custom domain

## Status

- [x] **Step 1 — landing page + routing** (index.html, calculators.html with search, redirect stub,
      canonicals + og:url on all 33 pages, sitemap.xml, robots.txt, .nojekyll, footer signature)
- [x] **Step 1b — UI refinement pass**: sticky result bar on phones, `inputmode=decimal`, aria-labels on
      every slider/field, 22px slider thumbs on touch, visible focus rings. Shared-CSS refactor
      deliberately NOT done — inlined critical CSS is faster on first paint, which is the priority.
- [x] **Step 2 — audit + fixes** (see "Defects fixed" below)
- [x] **Step 3 — footer signature** ("Build by Jay" on all 33 pages)
- [x] **Step 4 — design reviewed with user across several rounds of fixes**
- [ ] **Step 5 — push to GitHub + enable Pages** (BLOCKED: the GitHub integration here is read-only;
      needs user to push, or a download hand-off. See "Publishing" below.)

## Defects fixed in Step 2

Engine (calc-core.js)
1. §87A **marginal relief** was missing — new-regime tax just above ₹12 L was overstated by ~6× at
   ₹12.1 L taxable. Now capped at the income above the ceiling.
2. **Surcharge was entirely absent** (10/15/25%, plus 37% old regime above ₹5 Cr) despite inputs
   reaching ₹5 Cr. Added with per-threshold marginal relief. Verified monotonic ₹3 L → ₹6 Cr.
3. `emiOf`/`amort` divided by zero at 0 principal or 0 tenure → Infinity leaking into results.
4. Fractional tenures truncated amortisation rows (`y < years`).
5. Stored history could grow unbounded in localStorage; now capped at 50.
6. A `hashchange` handler was created but never attached, and then removed on unmount.
7. Number fields accepted negatives on inputs whose declared minimum was 0.
8. Currency defaulted to `$` for everyone; now detected from browser locale (₹/£/€, else $),
   and a manual pick always wins afterwards.
9. Placeholder third-party footer links (a Cloudflare blog URL) replaced with project links.

Calculators
10. **Take-home pay**: 80C deduction was hard-coded to the full ₹1.5 L for everyone
    (`Math.min(pfEmp + 150000, 150000)`); now only the employee PF counts. The **bonus field was
    read but never used**; the monthly figure now excludes it and shows it as a separate net line.
    Professional tax (₹2,400/yr) added.
11. **Capital gains**: 4% cess was missing entirely; non-equity short-term gains were shown as a flat
    "30%" rate when they are slab-rated — now labelled as the top-slab assumption.
12. **FD & RD**: post-tax effective rate treated a recurring deposit as a lumpsum, badly understating
    it. Now solved as an IRR by bisection for RD, CAGR for FD.
13. **Credit card payoff**: a payment barely above the interest charge ran past the 600-month cap and
    then reported a bogus "debt-free in 50 yr" date. Now reported as never clearing.
14. **Unit converter**: below-zero temperatures were unreachable (field floor was 0 for all
    quantities) — −40 °F was clamped to 0. Also disclosed that data units are decimal SI.
15. **Date & age**: an empty start date silently measured today-to-today and reported "0 days".
16. **Scientific**: `1/x` appended the literal text `1/`, so 5 → `51/`. Now wraps the expression.
17. **CAGR**: doubling time used the rule of 72; now exact.
18. **FIRE**: a row that answered nothing ("raise saving or trim spend") replaced with the savings rate.
19. **Retirement**: life expectancy at or below retirement age silently modelled one year; now flagged.
20. **Real return**: "purchasing power lost" also included tax; relabelled.
21. **Regime compare**: note claimed surcharge was excluded, which the engine change made false.
22. Dead code: unused ternary in Investment, unreachable `return null` in Income Tax.

Zero-start
- Every currency amount now starts at 0 with a slider floor of 0 (previously e.g. a ₹15 L loan was
  pre-filled). Rates, tenures, inflation, efficiency and fuel price keep 2026-appropriate defaults —
  a 0% rate or 0-year tenure makes a result meaningless rather than empty.
- Primary inputs are flagged `req`, so the result panel reads "Enter an amount to see the result"
  until the user types one, instead of showing a screen of zeroes.
- Programmer calculator now starts at 0/0 (was 2026/255) and the statistics series starts empty
  (was a demo series).
- Date & age no longer ships a stranger's birthday as the default start date.

Privacy scan: no emails, keys, tokens, analytics, external beacons or personal data anywhere in the
tree. All state is localStorage under one key (`calcstudio.v2`); the only network requests are Google
Fonts.

## Category strip / empty-bar saga (resolved)

The "empty bar" under the calculator was the category strip, and it took several wrong turns:
hiding its scrollbar, auto-centering the active item, and an absolutely-positioned pane — all
reverted. Root cause was that the strip overflowed and wrapped, leaving a filled band of dead space.

Final state (all four shells, <=960px):
- strip wraps (`flex-wrap:wrap`), does NOT scroll — no `overflow-x`, no hidden scrollbars, no fade
- per-item descriptions hidden (`[data-calc] > span:nth-child(2)`) so only names show
- chips at natural width, `padding:6px 10px` — all categories now fit ONE row at >=900px
- strip background transparent so it cannot read as a filled band
- >=961px: `[data-r=aside]{align-self:flex-start}` so the pane no longer stretches the card

Verified by screenshot on Everyday (9 items), Loans & Credit (8), Planning & Tax (7, longest names).

### Forced card height (final fix)

`.tool{min-height:calc(100dvh - 138px)}` was the real source of the "empty bar in full height".
On desktop it forced a ~900px card around ~300px of calculator, so the category pane ended
mid-card and the rest was empty panel. Now `.tool{min-height:0}` on all 32 tool pages — the card
sizes to its content (measured 900px -> 504px, empty space under the pane 390px -> 1px).

The header control is therefore a DENSITY toggle, labelled "Comfortable" / "Compact" (not
"Full height") so it describes what it does. Compact tightens main padding, grid gap, card padding,
pane padding and hero size, and hides the pane item descriptions: 653px -> 572px on Loan EMI.

## Easter egg (new work)

- [x] Footer signature removed from all 33 pages (README still credits Jay).
- [x] Splash: user picked **C, the keycap** (`easter-egg-c.html` kept as the design reference;
      a/b/d deleted). Wording "Jay / 21 + 26 · indie dev".
- [x] Implemented as `calc-egg.js`, loaded on all 33 pages, dormant until triggered:
      - `21 + 26 =` on the Simple Calculator only. Matched as `p.expr === '21+26'` at the `=`
        branch — an EXACT expression match. (A rolling key-tail match was tried first and fired on
        any n…21 + 26, e.g. 121+26 and 521+26, covering a legitimate result. Instance state was
        tried before that and never fired at all: the DC logic instance does not survive re-render.)
        The sum still returns 47 and still logs to history; the splash rides on top.
      - the header ∑ mark sits inside the brand link. Navigation is DEFERRED 400ms and cancelled
        if another tap arrives, AND the tap run is kept in `sessionStorage.calcdrawer.taps` so it
        survives any navigation that does happen. A lone click still goes home; rapid taps never
        navigate at all; slow taps navigate but keep counting on the next page.
        Three wrong turns before this: blocking the default outright killed the logo's home link
        on all 32 inner pages; blocking only after tap 1 made the trigger unreachable (tap 1
        navigated away); and the sessionStorage helpers were declared with `var` AFTER the boot
        check that called them, so `KEY` was undefined and boot read `sessionStorage[undefined]`.
      - the caption is a heart glyph + "INDIE DEV" (the 21 + 26 hint was removed at user request).
      - five taps on the header ∑ mark within 3s, any page (the currency picker keeps its own job)
      - full-screen over the page, auto-fades after 3s, click or Esc closes early, repeatable
        with no limit, honours prefers-reduced-motion
- [x] Verified live: both triggers fire, answer 47 still shows, auto-fade at 3s, Esc/click closes.
- [ ] Re-push to GitHub (see Publishing below).

## Publishing (Step 5 constraint)

The GitHub tools available in this environment can read a repo but cannot commit or create one.
Deployment therefore needs one of:

1. User pushes the project zip contents to `jgohil07/CalculatorDrawer` (`main`), then
   Settings → Pages → Source: "Deploy from a branch" → `main` / `/ (root)`.
2. `.nojekyll` is already present so underscore/dot paths are served as-is.

Files that must be at repo root: all `*.html`, `calc-core.js`, `calc-route-*.js`,
`calc-shell-*.dc.html`, `support.js`, `sitemap.xml`, `robots.txt`, `.nojekyll`.
`Calculator Drawer.dc.html` is optional (dev-only full-screen view).

## Notes for the next session

- Route chunks execute inside an IIFE receiving `Component`; shells define their own statics (PAD, SCI).
- `Component.PAGES.simple` is now `'index.html'` — inline `PAGES` maps in each page's footer script match.
- Every page's inline script wires currency/theme via `window.__calcDrawer`.
