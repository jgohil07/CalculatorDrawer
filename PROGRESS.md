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
- [ ] **Step 4 — design confirmation with user**
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
- `Component.PAGES.simple` is now `'./'` — inline `PAGES` maps in each page's footer script match.
- Every page's inline script wires currency/theme via `window.__calcDrawer`.
