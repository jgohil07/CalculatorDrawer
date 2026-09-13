/* one-time cleanup: the v1 key was superseded when zero-start defaults landed */
try { localStorage.removeItem('calcstudio.v1'); } catch (e) {}
/* Calculator Drawer — shared core chunk. Cached once, reused by all 32 pages.
   Per-route field defs + compute live in calc-route-<slug>.js (~1-3 KB each). */
window.CalcCore = { base: function (DCLogic) {
  const Component = class extends DCLogic {
  static KEY = 'calcstudio.v2';
  static CATS = [
    { id: 'basic', n: 'Everyday' },
    { id: 'loans', n: 'Loans & Credit' },
    { id: 'invest', n: 'Investing' },
    { id: 'plan', n: 'Planning & Tax' }
  ];
  static CALCS = [
    { id: 'simple', cat: 'basic', name: 'Simple', desc: 'Four functions, fast', kind: 'pad', title: 'Simple Calculator', sub: 'Arithmetic with a running history that persists in this browser.' },
    { id: 'scientific', cat: 'basic', name: 'Scientific', desc: 'Trig, logs, powers', kind: 'pad', title: 'Scientific Calculator', sub: 'Expression entry with trigonometry, logarithms, roots and factorials.' },
    { id: 'percent', cat: 'basic', name: 'Percentage', desc: 'Of, share, change', title: 'Percentage Calculator', sub: 'The three percentage questions people actually ask, in one place.' },
    { id: 'unit', cat: 'basic', name: 'Unit Converter', desc: 'Length, mass, more', title: 'Unit Converter', sub: 'Convert between units and see the same quantity in every other unit at once.' },
    { id: 'age', cat: 'basic', name: 'Date & Age', desc: 'Between two dates', title: 'Date & Age Calculator', sub: 'Exact age or the distance between two dates, down to the day.' },
    { id: 'bmi', cat: 'basic', name: 'BMI', desc: 'Body mass index', title: 'BMI Calculator', sub: 'Body mass index with the healthy weight range for your height.' },
    { id: 'fuel', cat: 'basic', name: 'Fuel Cost', desc: 'Trip and monthly', title: 'Fuel Cost Calculator', sub: 'What a trip costs to drive, and what it adds up to over a month.' },
    { id: 'programmer', cat: 'basic', name: 'Programmer', desc: 'Bases, bits, bitwise', kind: 'prog', title: 'Programmer Calculator', sub: 'Convert between bases, flip individual bits and run bitwise operations on 32-bit integers.' },
    { id: 'statistical', cat: 'basic', name: 'Statistical', desc: 'Mean, median, σ', kind: 'stats', title: 'Statistical Calculator', sub: 'Paste or type a series — every descriptive statistic updates as you go.' },
    { id: 'emi', cat: 'loans', name: 'Loan EMI', desc: 'Equal monthly instalment', title: 'Loan EMI Calculator', sub: 'Monthly instalment, total interest and a year-by-year amortisation of any reducing-balance loan.' },
    { id: 'mortgage', cat: 'loans', name: 'Mortgage', desc: 'Home loan with escrow', title: 'Mortgage Calculator', sub: 'Principal, interest, property tax, insurance and HOA rolled into one monthly number.' },
    { id: 'carloan', cat: 'loans', name: 'Car Loan', desc: 'On-road to EMI', title: 'Car Loan Calculator', sub: 'On-road price, down payment and trade-in worked through to a monthly payment.' },
    { id: 'refi', cat: 'loans', name: 'Refinance', desc: 'Break-even month', title: 'Refinance Break-Even', sub: 'Whether a lower rate is worth the switching fee, and when it pays for itself.' },
    { id: 'simpleint', cat: 'loans', name: 'Simple Interest', desc: 'Flat, non-compounding', title: 'Simple Interest Calculator', sub: 'Flat interest on a principal, and how it compares with compounding.' },
    { id: 'prepay', cat: 'loans', name: 'Prepayment Impact', desc: 'Extra EMI savings', title: 'Loan Prepayment Calculator', sub: 'What an extra monthly amount or a one-off lumpsum does to your tenure and interest.' },
    { id: 'ccpayoff', cat: 'loans', name: 'Card Payoff', desc: 'Months to clear', title: 'Credit Card Payoff Calculator', sub: 'How long a balance takes to clear at a fixed monthly payment — and what it costs.' },
    { id: 'ci', cat: 'loans', name: 'Compound Interest', desc: 'Any compounding period', title: 'Compound Interest Calculator', sub: 'Growth of a deposit at any compounding frequency, with the effective annual yield.' },
    { id: 'investment', cat: 'invest', name: 'Investment', desc: 'Lumpsum + monthly', title: 'Investment Calculator', sub: 'Compound a starting balance together with recurring contributions.' },
    { id: 'sip', cat: 'invest', name: 'SIP', desc: 'Systematic investment', title: 'SIP Calculator', sub: 'What a monthly investment becomes, with optional annual step-up.' },
    { id: 'swp', cat: 'invest', name: 'SWP', desc: 'Systematic withdrawal', title: 'SWP Calculator', sub: 'How long a corpus survives a fixed monthly withdrawal.' },
    { id: 'fdrd', cat: 'invest', name: 'FD & RD', desc: 'Deposit maturity', title: 'FD & RD Calculator', sub: 'Maturity value of a fixed deposit or a recurring one, with quarterly compounding.' },
    { id: 'cagr', cat: 'invest', name: 'CAGR', desc: 'Annualised growth', title: 'CAGR Calculator', sub: 'The compound annual growth rate between any two values.' },
    { id: 'realreturn', cat: 'invest', name: 'Real Return', desc: 'After inflation & tax', title: 'Real Return Calculator', sub: 'What a nominal return is actually worth once inflation and tax are taken out.' },
    { id: 'goalsip', cat: 'invest', name: 'Goal SIP', desc: 'Reverse-solve monthly', title: 'Goal SIP Calculator', sub: 'The monthly investment a target corpus needs, counting what you have already saved.' },
    { id: 'lumpvssip', cat: 'invest', name: 'Lumpsum vs SIP', desc: 'Same money, two ways', title: 'Lumpsum vs SIP', sub: 'The same total invested at once, or spread monthly — side by side.' },
    { id: 'retirement', cat: 'plan', name: 'Retirement', desc: 'Corpus vs. need', title: 'Retirement Calculator', sub: 'Compare the corpus you are on track for against the one your lifestyle needs.' },
    { id: 'ctc', cat: 'plan', name: 'Take-Home Pay', desc: 'CTC to in-hand', title: 'Take-Home Salary Calculator', sub: 'CTC broken into PF, gratuity, tax and the amount that actually reaches your account.' },
    { id: 'capgains', cat: 'plan', name: 'Capital Gains', desc: 'Short vs long term', title: 'Capital Gains Calculator', sub: 'Tax on equity or property gains, split by holding period.' },
    { id: 'gst', cat: 'plan', name: 'GST', desc: 'Add or remove tax', title: 'GST Calculator', sub: 'Add GST to a base price or strip it out of an inclusive one.' },
    { id: 'fire', cat: 'plan', name: 'FIRE', desc: 'Financial independence', title: 'FIRE Calculator', sub: 'The corpus that covers your spending forever, and how many years away it is.' },
    { id: 'taxcompare', cat: 'plan', name: 'Regime Compare', desc: 'Old vs new, side by side', title: 'Old vs New Regime', sub: 'The same income run through both Indian regimes, with the break-even on deductions.' },
    { id: 'tax', cat: 'plan', name: 'Income Tax', desc: 'New vs old regime', title: 'Income Tax Calculator', sub: 'Slab-wise tax for FY 2025-26 (AY 2026-27) under either Indian regime — always shown in ₹, since the slabs are statutory.' }
  ];
  static get UNITS() { return (window.__calcRoute && window.__calcRoute.UNITS) || {}; }
  static get F() { return (window.__calcRoute && window.__calcRoute.F) || {}; }

  static CURRENCIES = [{ v: '$', l: '$' }, { v: '₹', l: '₹' }, { v: '€', l: '€' }, { v: '£', l: '£' }];
  static EURO = ['DE','FR','ES','IT','NL','IE','PT','AT','BE','FI','GR','SK','SI','LT','LV','EE','LU','MT','CY','HR'];
  static detectCurrency() {
    try {
      const tag = (navigator.languages && navigator.languages[0]) || navigator.language || '';
      const region = (tag.split('-')[1] || '').toUpperCase();
      if (region === 'IN') return '₹';
      if (region === 'GB') return '£';
      if (Component.EURO.indexOf(region) >= 0) return '€';
      return '$';
    } catch (e) { return '$'; }
  }
  state = { theme: null, cat: (window.__calcRoute || {}).cat || 'basic', calc: (window.__calcRoute || {}).id || 'emi', currency: null, vals: {}, history: [], pad: { expr: '', out: '0', deg: true, fresh: true }, prog: { base: 10, a: '0', b: '0', op: 'AND' }, stats: { raw: '' } };

  get embedded() { return true; }
  __calcSnapshot() { return { theme: this.state.theme, currency: this.state.currency, locked: !!this._curOv }; }
  __notify() {
    if (!this._subs) return;
    const s = this.__calcSnapshot();
    this._subs.forEach((fn) => { try { fn(s); } catch (e) { /* noop */ } });
  }
  componentDidMount() {
    const seen = {};
    Component.CALCS.forEach((c) => {
      if (seen[c.id]) console.warn('Duplicate calculator id: ' + c.id);
      seen[c.id] = 1;
    });
    let s = {};
    try { s = JSON.parse(localStorage.getItem(Component.KEY) || '{}'); } catch (e) { s = {}; }
    const theme = s.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    const pinned = window.__calcRoute ? Component.bySlug(window.__calcRoute.slug) : null;
    const linked = pinned || this.fromHash();
    this.setState({
      theme: theme,
      cat: linked ? linked.cat : (s.cat || 'basic'),
      calc: linked ? linked.id : (s.calc || 'emi'),
      currency: s.currency || this.props.currency || Component.detectCurrency(),
      lastByCat: s.lastByCat || {},
      vals: s.vals || {},
      history: s.history || [],
      pad: Object.assign({ expr: '', out: '0', deg: true, fresh: true }, s.pad || {}),
      prog: Object.assign({ base: 10, a: '0', b: '0', op: 'AND' }, s.prog || {}),
      stats: Object.assign({ raw: '' }, s.stats || {})
    }, () => this.save({}));
    this.applyAccent();
    const first = linked;
    this.syncMeta(first);
    this._key = (e) => this.keyDown(e);
    window.addEventListener('keydown', this._key);
    if (document.prerendering) {
      document.addEventListener('prerenderingchange', () => {
        if (this._pendingSave != null) {
          try { localStorage.setItem(Component.KEY, this._pendingSave); } catch (err) { /* storage unavailable */ }
          this._pendingSave = null;
        }
      }, { once: true });
    }
    window.__calcDrawer = {
      setCurrency: (v) => this.save({ currency: v }),
      setTheme: (t) => { document.documentElement.dataset.theme = t; this.save({ theme: t }); },
      toggleTheme: () => {
        const t = this.state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = t;
        this.save({ theme: t });
      },
      snapshot: () => ({ theme: this.state.theme, currency: this.state.currency, locked: !!this._curOv }),
      subscribe: (fn) => {
        this._subs = this._subs || [];
        this._subs.push(fn);
        fn(this.__calcSnapshot());
      }
    };
    if (window.__calcDrawerReady) { try { window.__calcDrawerReady(); } catch (err) { /* noop */ } }
    this._pd = (e) => {
      const t = e.target;
      this._engaged = !!(t && t.closest && t.closest('[data-r="shell-root"]'));
    };
    document.addEventListener('pointerdown', this._pd, true);
    document.addEventListener('mousedown', this._pd, true);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this._key);
    if (this._pd) {
      document.removeEventListener('pointerdown', this._pd, true);
      document.removeEventListener('mousedown', this._pd, true);
    }
    if (this._mo) this._mo.disconnect();
    if (this._ro) this._ro.disconnect();
    if (this._post) window.removeEventListener('resize', this._post);
  }
  componentDidUpdate(prev, prevState) {
    if (prev.accent !== this.props.accent) this.applyAccent();
    if (prevState && prevState.calc !== this.state.calc) this.syncMeta();
  }
  keyDown() {}
  applyAccent() {
    const a = this.props.accent;
    const el = document.documentElement;
    if (a && a !== '#4f57c9' && a !== '#5e6ad2') el.style.setProperty('--accent', a);
    else el.style.removeProperty('--accent');
  }

  save(patch) {
    if (patch && patch.history && patch.history.length > 50) patch = Object.assign({}, patch, { history: patch.history.slice(0, 50) });
    const changesCalc = patch && patch.calc;
    this.setState(patch, () => {
      const s = this.state;
      if (changesCalc) { this.syncMeta(); if (this._post) setTimeout(this._post, 40); }
      this.__notify();
      try {
        const lastByCat = Object.assign({}, s.lastByCat || {});
        const activeObj = Component.CALCS.find((x) => x.id === s.calc);
        if (activeObj) lastByCat[s.cat] = Component.slugOf(activeObj);
        const payload = JSON.stringify({ theme: s.theme, cat: s.cat, calc: s.calc, currency: s.currency, lastByCat: lastByCat, vals: s.vals, history: s.history, pad: s.pad, prog: s.prog, stats: s.stats });
        /* A prerendered page must not touch storage. Without this, merely hovering
           a calculator link would rewrite which calculator you last used, because
           the prerender mounts the component and mounting saves. Hold the write
           back and flush it if and when the page is actually activated. */
        if (document.prerendering) this._pendingSave = payload;
        else localStorage.setItem(Component.KEY, payload);
      } catch (e) { /* storage unavailable */ }
    });
  }

  cur() { return this._curOv || this.state.currency || this.props.currency || '$'; }
  fd(f) { return this.cur() !== '₹' && f.u ? Object.assign({}, f, f.u) : f; }
  fmt(n, dec) {
    if (!isFinite(n)) return '—';
    const c = this.cur();
    const loc = c === '₹' ? 'en-IN' : 'en-US';
    const d = dec == null ? 0 : dec;
    return c + new Intl.NumberFormat(loc, { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
  }
  num(n, d) {
    if (!isFinite(n)) return '—';
    return new Intl.NumberFormat(this.cur() === '₹' ? 'en-IN' : 'en-US', { maximumFractionDigits: d == null ? 0 : d }).format(n);
  }
  short(n) {
    const c = this.cur();
    const a = Math.abs(n);
    if (c === '₹') {
      if (a >= 1e7) return c + (n / 1e7).toFixed(2) + ' Cr';
      if (a >= 1e5) return c + (n / 1e5).toFixed(2) + ' L';
      return this.fmt(n);
    }
    if (a >= 1e9) return c + (n / 1e9).toFixed(2) + 'B';
    if (a >= 1e6) return c + (n / 1e6).toFixed(2) + 'M';
    if (a >= 1e3) return c + (n / 1e3).toFixed(1) + 'K';
    return this.fmt(n);
  }

  defs(id, v) {
    const d = Component.F[id];
    if (!d) return [];
    return typeof d === 'function' ? d.call(this, v || {}) : d;
  }
  vals(id) {
    const stored = (this.state.vals || {})[id] || {};
    const seed = {};
    this.defs(id, {}).forEach((f) => { seed[f.k] = this.fd(f).def; });
    const merged = Object.assign(seed, stored);
    const out = {};
    this.defs(id, merged).forEach((f) => { out[f.k] = this.fd(f).def; });
    return Object.assign(out, stored);
  }
  emiOf(P, i, N) {
    if (!(N > 0) || !(P > 0)) return 0;
    return i === 0 ? P / N : (P * i * Math.pow(1 + i, N)) / (Math.pow(1 + i, N) - 1);
  }

  amort(P, annual, years) {
    const i = annual / 1200, N = Math.round(years * 12), emi = this.emiOf(P, i, N);
    if (!(emi > 0)) return { emi: 0, N: N, rows: [] };
    let bal = P; const rows = [];
    const yrs = Math.min(Math.ceil(years), 40);
    for (let y = 0; y < yrs; y++) {
      let pr = 0, it = 0;
      for (let m = 0; m < 12; m++) {
        if (bal <= 0) break;
        const int = bal * i; const prin = Math.min(emi - int, bal);
        pr += prin; it += int; bal -= prin;
      }
      rows.push({ label: 'Yr ' + (y + 1), a: pr, b: it, bal: Math.max(bal, 0) });
    }
    return { emi: emi, N: N, rows: rows };
  }
  chart(rows, rightFn) {
    const max = rows.reduce((m, r) => Math.max(m, r.a + r.b), 0) || 1;
    return rows.map((r) => ({
      label: r.label,
      aPct: (r.a / max) * 100,
      bPct: (r.b / max) * 100,
      right: rightFn(r)
    }));
  }
  slabTax(taxable, slabs) {
    let t = 0;
    for (let i = 0; i < slabs.length; i++) {
      const lo = slabs[i][0], hi = slabs[i][1], rate = slabs[i][2];
      if (taxable > lo) t += (Math.min(taxable, hi) - lo) * rate;
    }
    return t;
  }

  static PAGES = {
    'simple': 'index.html', 'scientific': 'scientific-calculator.html',
    'percentage': 'percentage-calculator.html', 'unit-converter': 'unit-converter.html',
    'date-age': 'age-calculator.html', 'bmi': 'bmi-calculator.html',
    'fuel-cost': 'fuel-cost-calculator.html', 'programmer': 'programmer-calculator.html',
    'statistical': 'statistics-calculator.html', 'loan-emi': 'loan-emi-calculator.html',
    'mortgage': 'mortgage-calculator.html', 'car-loan': 'car-loan-calculator.html',
    'refinance': 'refinance-calculator.html', 'prepayment-impact': 'loan-prepayment-calculator.html',
    'card-payoff': 'credit-card-payoff-calculator.html', 'simple-interest': 'simple-interest-calculator.html',
    'compound-interest': 'compound-interest-calculator.html', 'sip': 'sip-calculator.html',
    'swp': 'swp-calculator.html', 'investment': 'investment-calculator.html',
    'goal-sip': 'goal-sip-calculator.html', 'lumpsum-vs-sip': 'lumpsum-vs-sip-calculator.html',
    'fd-rd': 'fd-rd-calculator.html', 'cagr': 'cagr-calculator.html',
    'real-return': 'real-return-calculator.html', 'retirement': 'retirement-calculator.html',
    'fire': 'fire-calculator.html', 'income-tax': 'income-tax-calculator.html',
    'regime-compare': 'old-vs-new-tax-regime-calculator.html', 'take-home-pay': 'take-home-salary-calculator.html',
    'capital-gains': 'capital-gains-tax-calculator.html', 'gst': 'gst-calculator.html'
  };
  hrefFor(c) {
    const slug = Component.slugOf(c);
    return this.embedded ? (Component.PAGES[slug] || ('#' + slug)) : '#' + slug;
  }
  static slugOf(c) { return c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  static bySlug(slug) { return Component.CALCS.find((c) => Component.slugOf(c) === slug); }
  syncMeta() {}
  fromHash() { return null; }
  static RESEED = { unit: { cat: ['from', 'to'] }, percent: { mode: ['a', 'b'] }, capgains: { asset: ['months'] } };
  static reseed(calcId, key, vals) {
    const drop = (Component.RESEED[calcId] || {})[key];
    if (drop) drop.forEach((k) => { delete vals[k]; });
  }
  pct(a, b) { const r = (a / b) * 100; return b > 0 && isFinite(r) ? r : 0; }
  pctStr(a, b, d) { const r = (a / b) * 100; return b > 0 && isFinite(r) ? r.toFixed(d == null ? 1 : d) + '%' : '—'; }
  static SLABS_NEW = [[0, 400000, 0], [400000, 800000, 0.05], [800000, 1200000, 0.1], [1200000, 1600000, 0.15], [1600000, 2000000, 0.2], [2000000, 2400000, 0.25], [2400000, Infinity, 0.3]];
  static SLABS_OLD = [[0, 250000, 0], [250000, 500000, 0.05], [500000, 1000000, 0.2], [1000000, Infinity, 0.3]];
  /* Surcharge thresholds are on total income; the new regime caps at 25%. */
  static SUR_NEW = [[0, 0], [5000000, 0.1], [10000000, 0.15], [20000000, 0.25]];
  static SUR_OLD = [[0, 0], [5000000, 0.1], [10000000, 0.15], [20000000, 0.25], [50000000, 0.37]];
  taxOf(income, isNew, ded) {
    const std = isNew ? 75000 : 50000;
    const taxable = Math.max(income - std - (isNew ? 0 : ded), 0);
    const slabs = isNew ? Component.SLABS_NEW : Component.SLABS_OLD;
    const slabAt = (t) => this.slabTax(t, slabs);
    let base = slabAt(taxable);
    const rebateCap = isNew ? 1200000 : 500000;
    let rebated = false;
    if (taxable <= rebateCap) { base = 0; rebated = true; }
    else if (isNew && base > taxable - rebateCap) {
      /* §87A marginal relief: tax cannot exceed the income earned above the rebate ceiling. */
      base = taxable - rebateCap;
      rebated = true;
    }
    /* Surcharge, with marginal relief so crossing a threshold cannot cost more than the extra income. */
    const bands = isNew ? Component.SUR_NEW : Component.SUR_OLD;
    let idx = 0;
    bands.forEach((b, k) => { if (taxable > b[0]) idx = k; });
    let surcharge = base * bands[idx][1];
    if (idx > 0) {
      const threshold = bands[idx][0];
      const atThreshold = slabAt(threshold) * (1 + bands[idx - 1][1]);
      const cap = atThreshold + (taxable - threshold);
      if (base + surcharge > cap) surcharge = Math.max(cap - base, 0);
    }
    const cess = (base + surcharge) * 0.04;
    return { std: std, taxable: taxable, base: base, surcharge: surcharge, cess: cess, total: base + surcharge + cess, rebated: rebated, surRate: bands[idx][1] };
  }
  needsInput(id, v) {
    const fs = this.defs(id, v).map((f) => this.fd(f)).filter((f) => !f.type);
    if (!fs.length) return false;
    if (fs.some((f) => f.req && !Number(v[f.k]))) return true;
    const amounts = fs.filter((f) => f.cur || f.amount);
    return amounts.length ? amounts.every((f) => !Number(v[f.k])) : false;
  }
  compute(id) {
    const r = window.__calcRoute;
    if (!r || !r.compute) return null;
    const v = this.vals(id), f = (n, d) => this.fmt(n, d);
    return r.compute.call(this, id, v, f);
  }



  renderVals() {
    const s = this.state;
    const active = Component.CALCS.find((c) => c.id === s.calc) || Component.CALCS.find((c) => c.id === (window.__calcRoute || {}).id) || Component.CALCS[0];
    this._curOv = ['tax', 'taxcompare', 'ctc', 'capgains', 'gst'].indexOf(active.id) >= 0 ? '₹' : null;
    const cat = active.cat;
    const kind = active.kind || 'form';
    const isPad = kind === 'pad';
    const isForm = kind === 'form';
    const v = isForm ? this.vals(active.id) : {};
    const computed = isForm ? this.compute(active.id) : null;
    const blank = !!(computed && this.needsInput(active.id, v));
    const res = !computed ? null : (blank ? {
      hero: { l: computed.hero.l, v: '—', sub: 'Enter an amount to see the result.' },
      rows: [], note: computed.note
    } : computed);
    const accentBg = 'var(--panel)';

    const cats = Component.CATS.map((c) => {
      const first = Component.CALCS.find((x) => x.cat === c.id);
      return {
        id: c.id, n: c.n,
        href: first ? this.hrefFor(first) : '#',
        bg: c.id === cat ? 'var(--panel)' : 'transparent',
        fg: c.id === cat ? 'var(--text)' : 'var(--muted)'
      };
    });
    const calcs = Component.CALCS.filter((c) => c.cat === cat).map((c) => ({
      id: c.id, name: c.name, desc: c.desc, href: this.hrefFor(c),
      bg: c.id === active.id ? 'var(--panel)' : 'transparent',
      fg: c.id === active.id ? 'var(--text)' : 'var(--muted)',
      ring: c.id === active.id ? 'inset 0 0 0 1px var(--line)' : 'none'
    }));

    const fields = !res ? [] : this.defs(active.id, v).filter((f) => {
      if (active.id === 'tax' && f.k === 'ded' && v.regime === 'new') return false;
      if (active.id === 'swp' && f.k === 'infl' && !v.inflOn) return false;
      if (active.id === 'ctc' && f.k === 'nps' && v.regime === 'old') return false;
      return true;
    }).map((raw) => this.fd(raw)).map((f) => ({
      k: f.k, l: f.l, min: f.min, max: f.max, step: f.step,
      pre: f.cur ? this.cur() : '', post: f.post || '',
      value: v[f.k],
      isNum: !f.type,
      hasSlider: !f.type && !f.noSlider,
      isSelect: f.type === 'select',
      isMenu: f.type === 'menu',
      isDate: f.type === 'date',
      dateHint: f.today && !v[f.k] ? 'today' : '',
      isToggle: f.type === 'toggle',
      toggleBg: v[f.k] ? 'var(--accent)' : 'var(--track)',
      knobX: v[f.k] ? 16 : 2,
      options: (f.options || []).map((o) => ({
        v: o.v, l: o.l,
        bg: v[f.k] === o.v ? 'var(--panel)' : 'transparent',
        fg: v[f.k] === o.v ? 'var(--text)' : 'var(--muted)'
      }))
    }));

    const split = res && res.split;
    const rawPct = split ? Number(split.pct) : 0;
    const pct = isFinite(rawPct) ? Math.max(0, Math.min(100, rawPct)) : 0;

    return {
      brandName: this.props.brandName || 'Calculator Drawer',
      homeHash: '#' + Component.slugOf(Component.CALCS.find((c) => c.id === 'emi')),
      githubUrl: this.props.githubUrl || 'https://github.com/jgohil07/CalculatorDrawer',
      blogUrl: this.props.blogUrl || 'https://jgohil07.github.io/CalculatorDrawer/calculators.html',
      storageNote: 'Saved in this browser · ' + (s.history || []).length + ' results kept',
      cats: cats, calcs: calcs, catName: (Component.CATS.find((c) => c.id === cat) || {}).n,
      standalone: !this.embedded,
      embedded: this.embedded,
      homeHref: this.embedded ? 'index.html' : '#' + Component.slugOf(Component.CALCS.find((c) => c.id === 'emi')),
      navDisplay: this.embedded ? 'none' : 'flex',
      headerDisplay: this.embedded ? 'none' : 'flex',
      mainPad: this.embedded ? '18px 20px 26px' : '32px 36px 64px',
      asidePad: this.embedded ? '14px 12px' : '18px 12px',
      footerDisplay: this.embedded ? 'none' : 'flex',
      shellMinHeight: this.embedded ? 'auto' : '100vh',
      headerPos: this.embedded ? 'static' : 'sticky',
      title: active.title, subtitle: active.sub,
      stamp: isPad ? (s.calc === 'scientific' ? 'expression mode' : 'basic mode') : (kind === 'prog' ? '32-bit signed' : 'live · updates as you type'),
      prog: kind === 'prog' ? this.progData() : null,
      stats: kind === 'stats' ? this.statsData() : null,
      statsHasBars: kind === 'stats' ? !this.statsData().empty : false,
      onProgBase: (e) => {
        const next = Number(e.currentTarget.dataset.base), old = s.prog.base;
        const re = (raw) => {
          const n = this.parseIn(raw, old);
          if (n === null) return raw;
          const neg = n < 0;
          const body = Math.abs(n).toString(next).toUpperCase();
          return (neg ? '-' : '') + body;
        };
        this.save({ prog: Object.assign({}, s.prog, { base: next, a: re(s.prog.a), b: re(s.prog.b) }) });
      },
      onProgA: (e) => this.save({ prog: Object.assign({}, s.prog, { a: e.target.value }) }),
      onProgB: (e) => this.save({ prog: Object.assign({}, s.prog, { b: e.target.value }) }),
      onProgOp: (e) => this.save({ prog: Object.assign({}, s.prog, { op: e.currentTarget.dataset.op }) }),
      onBit: (e) => {
        const i = Number(e.currentTarget.dataset.bit);
        const cur = this.parseIn(s.prog.a, s.prog.base);
        if (cur === null) return;
        const next = ((cur | 0) ^ (1 << i)) >>> 0;
        const base = s.prog.base;
        this.save({ prog: Object.assign({}, s.prog, { a: base === 10 ? String(next | 0) : (next).toString(base).toUpperCase() }) });
      },
      onStats: (e) => this.save({ stats: Object.assign({}, s.stats, { raw: e.target.value }) }),
      onToggle: (e) => {
        const k = e.currentTarget.dataset.key;
        const all = Object.assign({}, s.vals);
        const cur = this.vals(active.id);
        all[active.id] = Object.assign({}, cur, { [k]: !cur[k] });
        this.save({ vals: all });
      },
      isDark: s.theme === 'dark', isLight: s.theme !== 'dark',
      themeLabel: s.theme === 'dark' ? 'Dark' : 'Light',
      currencies: Component.CURRENCIES.map((c) => ({
        v: c.v, l: c.l,
        bg: c.v === this.cur() ? 'var(--panel)' : 'transparent',
        fg: c.v === this.cur() ? 'var(--text)' : 'var(--muted)'
      })),
      onCurrency: (e) => this.save({ currency: e.currentTarget.dataset.cur }),
      isForm: isForm, isPad: isPad, isProg: kind === 'prog', isStats: kind === 'stats', isSci: active.id === 'scientific',
      fields: fields,
      heroLabel: res ? res.hero.l : '', heroValue: res ? res.hero.v : '', heroSub: res ? res.hero.sub : '',
      hasResult: !!(isForm && computed && !blank),
      hasSplit: !!split,
      donut: split ? 'conic-gradient(var(--accent) 0 ' + pct + '%, var(--accent-2) ' + pct + '% 100%)' : accentBg,
      splitPctText: split ? Math.round(pct) + '%' : '',
      splitAName: split ? split.aName : '',
      splitALabel: split ? split.a : '', splitBLabel: split ? split.b : '',
      rows: res ? res.rows : [],
      note: res && res.note ? res.note : '',
      hasChart: !!(res && res.chart), chartTitle: res && res.chart ? res.chart.title : '',
      chartHint: res && res.chart ? res.chart.hint : '', chartRows: res && res.chart ? res.chart.rows : [],
      padExpr: s.pad.expr || 'Type an expression',
      padOut: s.pad.out,
      degLabel: s.pad.deg ? 'DEG' : 'RAD',
      padKeys: this.constructor.PAD, sciKeys: this.constructor.SCI,
      history: (s.history || []).slice(0, 12),
      hasHistory: (s.history || []).length > 0,
      noHistory: (s.history || []).length === 0,
      onCat: this.embedded ? undefined : (e) => {
        const id = e.currentTarget.dataset.cat;
        const first = Component.CALCS.find((c) => c.cat === id);
        this.save({ cat: id, calc: first.id });
      },
      onCalc: this.embedded ? undefined : (e) => this.save({ calc: e.currentTarget.dataset.calc }),
      onTheme: () => {
        const t = s.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = t;
        this.save({ theme: t });
      },
      onField: (e) => {
        const k = e.target.dataset.key;
        const raw = e.target.value;
        let n = raw === '' ? 0 : Number(raw);
        if (!isFinite(n)) return;
        const spec = this.defs(active.id, v).map((x) => this.fd(x)).find((x) => x.k === k);
        const floor = spec && spec.min < 0 ? spec.min : 0;
        if (n < floor) n = floor;
        if (spec && e.target.type === 'range' && spec.max != null && n > spec.max) n = spec.max;
        const all = Object.assign({}, s.vals);
        all[active.id] = Object.assign({}, this.vals(active.id), { [k]: n });
        this.save({ vals: all });
      },
      onPick: (e) => {
        const d = e.currentTarget.dataset;
        const all = Object.assign({}, s.vals);
        const next = Object.assign({}, this.vals(active.id), { [d.key]: d.val });
        Component.reseed(active.id, d.key, next);
        all[active.id] = next;
        this.save({ vals: all });
      },
      onMenu: (e) => {
        const k = e.target.dataset.key, val = e.target.value;
        const all = Object.assign({}, s.vals);
        const next = Object.assign({}, this.vals(active.id), { [k]: val });
        Component.reseed(active.id, k, next);
        all[active.id] = next;
        this.save({ vals: all });
      },
      onText: (e) => {
        const k = e.target.dataset.key;
        const all = Object.assign({}, s.vals);
        all[active.id] = Object.assign({}, this.vals(active.id), { [k]: e.target.value });
        this.save({ vals: all });
      },
      onReset: () => {
        const all = Object.assign({}, s.vals);
        delete all[active.id];
        this.save({ vals: all });
      },
      onPad: (e) => this.press(e.currentTarget.dataset.k),
      onDeg: () => this.save({ pad: Object.assign({}, s.pad, { deg: !s.pad.deg }) }),
      onRecall: (e) => this.save({ pad: Object.assign({}, s.pad, { expr: e.currentTarget.dataset.val, out: e.currentTarget.dataset.val, fresh: true }) }),
      onClearHistory: () => this.save({ history: [] }),
      onWipe: () => {
        this.save({
          vals: {}, history: [],
          pad: { expr: '', out: '0', deg: true, fresh: true },
          prog: { base: 10, a: '0', b: '0', op: 'AND' },
          stats: { raw: '' }
        });
      }
    };
  }
};
  return Component;
} };
