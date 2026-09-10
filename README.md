# Calculator Drawer

32 free financial and everyday calculators that run entirely in the browser. No sign-up, no tracking,
no server — every figure you type stays on your own device in `localStorage`.

**Live site:** https://jgohil07.github.io/CalculatorDrawer/

## What's in the drawer

**Everyday** — Calculator · Scientific · Percentage · Unit Converter · Date & Age · BMI · Fuel Cost ·
Programmer · Statistical

**Loans & Credit** — Loan EMI · Mortgage · Car Loan · Refinance Break-Even · Loan Prepayment ·
Credit Card Payoff · Simple Interest · Compound Interest

**Investing** — SIP · SWP · Investment · Goal SIP · Lumpsum vs SIP · FD & RD · CAGR · Real Return

**Planning & Tax** — Retirement · FIRE · Income Tax (FY 2025-26) · Old vs New Regime ·
Take-Home Salary · Capital Gains · GST

## Why it's different

Most calculators give you one number. These show the working: how a loan's principal-to-interest
split shifts year by year, what a withdrawal plan looks like once inflation is indexed in, and what a
nominal return is worth after tax and inflation rather than before.

The Indian tax calculators implement the FY 2025-26 (AY 2026-27) slabs including the §87A rebate with
marginal relief and surcharge with per-threshold marginal relief — the two things most online
calculators quietly skip.

## Technical notes

- Static HTML. No build step, no framework runtime to install, no dependencies to audit.
- One shared engine (`calc-core.js`) is cached once and reused by all 33 pages; each calculator loads
  a route chunk of roughly 1–3 KB. Navigating between calculators re-uses the cached core.
- Critical CSS is inlined per page so the first paint needs no extra round trip.
- Currency is detected from the browser locale (₹ / $ / € / £) and remembered once you pick one.
  The Indian tax calculators are locked to ₹ because their slabs are statutory.
- Light and dark themes follow the system preference and can be toggled.
- Every input is autosaved locally and can be wiped from the footer.

## Running locally

Any static file server works — the pages fetch component files, so `file://` will not do:

```
python3 -m http.server 8000
```

Then open http://localhost:8000/

## Deploying to GitHub Pages

1. Push the contents of this repository to `main` (all files at the repository root).
2. Settings → Pages → Source: **Deploy from a branch** → Branch: `main`, folder: `/ (root)`.
3. Wait for the first build, then open https://jgohil07.github.io/CalculatorDrawer/

`.nojekyll` is committed so Jekyll does not touch the file tree. `sitemap.xml` and `robots.txt` are
already pointed at the Pages URL — submit the sitemap in Google Search Console once the site is live.

## Disclaimer

Figures are indicative and for general guidance only. Nothing here is financial, investment or tax
advice. Tax logic excludes state professional tax variations and case-specific reliefs.

---

Build by Jay
