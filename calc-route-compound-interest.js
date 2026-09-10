window.__calcRoute = {
  id: 'ci', cat: 'loans', slug: 'compound-interest', kind: 'form',
  F: {
    ci: [
      { k: 'p', req: 1, l: 'Principal', cur: 1, min: 0, max: 20000000, step: 10000, def: 0, u: { min: 0, max: 2000000, step: 500, def: 0} },
      { k: 'r', l: 'Interest rate', post: '%', min: 0.5, max: 24, step: 0.05, def: 7.5 },
      { k: 'y', l: 'Duration', post: 'yr', min: 1, max: 40, step: 1, def: 10 },
      { k: 'n', l: 'Compounded', type: 'select', def: '12', options: [{ v: '1', l: 'Yearly' }, { v: '2', l: 'Half-yearly' }, { v: '4', l: 'Quarterly' }, { v: '12', l: 'Monthly' }, { v: '365', l: 'Daily' }] }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'ci') {
      const n = Number(v.n) || 1, i = v.r / 100 / n, rows = [];
      const bal = v.p * Math.pow(1 + i, n * v.y), interest = bal - v.p;
      const eay = (Math.pow(1 + i, n) - 1) * 100;
      const label = { 1: 'yearly', 2: 'half-yearly', 4: 'quarterly', 12: 'monthly', 365: 'daily' }[n] || 'yearly';
      for (let y = 1; y <= v.y && y <= 40; y++) {
        const b = v.p * Math.pow(1 + i, n * y);
        rows.push({ label: 'Yr ' + y, a: v.p, b: b - v.p, bal: b });
      }
      return {
        hero: { l: 'Maturity value', v: f(bal), sub: 'Compounded ' + label + ' for ' + v.y + ' yr — ' + this.short(interest) + ' of interest' },
        split: { pct: this.pct(v.p, bal), aName: 'Principal', a: 'Principal · ' + this.short(v.p), b: 'Interest · ' + this.short(interest) },
        rows: [
          { l: 'Principal', v: f(v.p) },
          { l: 'Total interest', v: f(interest) },
          { l: 'Maturity value', v: f(bal) },
          { l: 'Effective annual yield', v: eay.toFixed(3) + '%' },
          { l: 'Compounding periods', v: this.num(n * v.y) }
        ],
        chart: { title: 'Balance by year', hint: 'principal vs interest', rows: this.chart(rows, (r) => this.short(r.bal)) },
        note: 'Nominal rate ' + v.r + '% compounded ' + label + ' behaves like ' + eay.toFixed(3) + '% simple annual growth.'
      };
    }
    return null;
  }
};
