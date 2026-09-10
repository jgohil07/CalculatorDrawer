window.__calcRoute = {
  id: 'cagr', cat: 'invest', slug: 'cagr', kind: 'form',
  F: {
    cagr: [
      { k: 'start', req: 1, l: 'Starting value', cur: 1, min: 0, max: 50000000, step: 10000, def: 0, u: { min: 0, max: 2000000, step: 100, def: 0} },
      { k: 'end', req: 1, l: 'Ending value', cur: 1, min: 0, max: 200000000, step: 10000, def: 0, u: { min: 0, max: 5000000, step: 100, def: 0} },
      { k: 'y', l: 'Years held', post: 'yr', min: 0.5, max: 40, step: 0.5, def: 6 }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'cagr') {
      const ratio = v.end / Math.max(v.start, 1);
      const cagr = (Math.pow(ratio, 1 / Math.max(v.y, 0.01)) - 1) * 100;
      const abs = ((v.end - v.start) / Math.max(v.start, 1)) * 100;
      const rows = [];
      for (let y = 1; y <= Math.ceil(v.y) && y <= 40; y++) {
        const b = v.start * Math.pow(1 + cagr / 100, Math.min(y, v.y));
        rows.push({ label: 'Yr ' + y, a: v.start, b: Math.max(b - v.start, 0), bal: b });
      }
      const dbl = cagr > 0 ? Math.log(2) / Math.log(1 + cagr / 100) : null;
      return {
        hero: { l: 'CAGR', v: (isFinite(cagr) ? cagr.toFixed(2) : '—') + '%', sub: this.short(v.start) + ' → ' + this.short(v.end) + ' over ' + v.y + ' yr' },
        split: { pct: v.end ? (v.start / v.end) * 100 : 0, aName: 'Invested', a: 'Starting value · ' + this.short(v.start), b: 'Gain · ' + this.short(v.end - v.start) },
        rows: [
          { l: 'Absolute return', v: abs.toFixed(2) + '%' },
          { l: 'CAGR', v: (isFinite(cagr) ? cagr.toFixed(2) : '—') + '%' },
          { l: 'Total gain', v: f(v.end - v.start) },
          { l: 'Multiple', v: ratio.toFixed(2) + '×' },
          { l: 'Doubling time at this rate', v: dbl && isFinite(dbl) ? dbl.toFixed(1) + ' yr' : '—' }
        ],
        chart: { title: 'Implied path', hint: 'smoothed at the CAGR', rows: this.chart(rows, (r) => this.short(r.bal)) },
        note: 'CAGR smooths the journey into one flat rate — it says nothing about the volatility along the way.'
      };
    }
    return null;
  }
};
