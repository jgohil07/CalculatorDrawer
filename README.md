# Calculator Drawer

32 free financial and everyday calculators that run entirely in the browser. No sign-up, no tracking,
no server — every figure you type stays on your own device in `localStorage`.

**Live site:** https://jgohil07.github.io/CalculatorDrawer/

## What's in the drawer

**Everyday** — [Calculator](https://jgohil07.github.io/CalculatorDrawer/) · [Scientific](https://jgohil07.github.io/CalculatorDrawer/scientific-calculator.html) · [Percentage](https://jgohil07.github.io/CalculatorDrawer/percentage-calculator.html) · [Unit Converter](https://jgohil07.github.io/CalculatorDrawer/unit-converter.html) · [Date & Age](https://jgohil07.github.io/CalculatorDrawer/age-calculator.html) · [BMI](https://jgohil07.github.io/CalculatorDrawer/bmi-calculator.html) · [Fuel Cost](https://jgohil07.github.io/CalculatorDrawer/fuel-cost-calculator.html) · [Programmer](https://jgohil07.github.io/CalculatorDrawer/programmer-calculator.html) · [Statistical](https://jgohil07.github.io/CalculatorDrawer/statistics-calculator.html)

**Loans & Credit** — [Loan EMI](https://jgohil07.github.io/CalculatorDrawer/loan-emi-calculator.html) · [Mortgage](https://jgohil07.github.io/CalculatorDrawer/mortgage-calculator.html) · [Car Loan](https://jgohil07.github.io/CalculatorDrawer/car-loan-calculator.html) · [Refinance Break-Even](https://jgohil07.github.io/CalculatorDrawer/refinance-calculator.html) · [Loan Prepayment](https://jgohil07.github.io/CalculatorDrawer/loan-prepayment-calculator.html) · [Credit Card Payoff](https://jgohil07.github.io/CalculatorDrawer/credit-card-payoff-calculator.html) · [Simple Interest](https://jgohil07.github.io/CalculatorDrawer/simple-interest-calculator.html) · [Compound Interest](https://jgohil07.github.io/CalculatorDrawer/compound-interest-calculator.html)

**Investing** — [SIP](https://jgohil07.github.io/CalculatorDrawer/sip-calculator.html) · [SWP](https://jgohil07.github.io/CalculatorDrawer/swp-calculator.html) · [Investment](https://jgohil07.github.io/CalculatorDrawer/investment-calculator.html) · [Goal SIP](https://jgohil07.github.io/CalculatorDrawer/goal-sip-calculator.html) · [Lumpsum vs SIP](https://jgohil07.github.io/CalculatorDrawer/lumpsum-vs-sip-calculator.html) · [FD & RD](https://jgohil07.github.io/CalculatorDrawer/fd-rd-calculator.html) · [CAGR](https://jgohil07.github.io/CalculatorDrawer/cagr-calculator.html) · [Real Return](https://jgohil07.github.io/CalculatorDrawer/real-return-calculator.html)

**Planning & Tax** — [Retirement](https://jgohil07.github.io/CalculatorDrawer/retirement-calculator.html) · [FIRE](https://jgohil07.github.io/CalculatorDrawer/fire-calculator.html) · [Income Tax (FY 2025-26)](https://jgohil07.github.io/CalculatorDrawer/income-tax-calculator.html) · [Old vs New Regime](https://jgohil07.github.io/CalculatorDrawer/old-vs-new-tax-regime-calculator.html) · [Take-Home Salary](https://jgohil07.github.io/CalculatorDrawer/take-home-salary-calculator.html) · [Capital Gains](https://jgohil07.github.io/CalculatorDrawer/capital-gains-tax-calculator.html) · [GST](https://jgohil07.github.io/CalculatorDrawer/gst-calculator.html)

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


## About

Calculator Drawer is built and maintained by **Jay**, an indie developer making small, fast web
tools that work without an account and keep your data on your own machine.

- **Live site** — <https://jgohil07.github.io/CalculatorDrawer/>
- **All 32 calculators** — <https://jgohil07.github.io/CalculatorDrawer/calculators.html>
- **Source** — <https://github.com/jgohil07/CalculatorDrawer>
- **Also by me** — [Sudoku Zen](https://jgohil07.github.io/SudokuZen/), a minimalist Sudoku game

No accounts, no analytics and no third-party scripts beyond the web font. Everything you type stays
in your browser's local storage.

## Disclaimer

Figures are indicative and for general guidance only. Nothing here is financial, investment or tax
advice. Tax logic excludes state professional tax variations and case-specific reliefs.

---

From indie dev Jay
