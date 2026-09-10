window.__calcRoute = {
  id: 'investment', cat: 'invest', slug: 'investment', kind: 'form',
  F: {
    investment: [
      { k: 'init', l: 'Initial amount', cur: 1, min: 0, max: 20000000, step: 50000, def: 0, u: { min: 0, max: 2000000, step: 1000, def: 0} },
      { k: 'monthly', l: 'Monthly addition', cur: 1, min: 0, max: 500000, step: 1000, def: 0, u: { min: 0, max: 20000, step: 50, def: 0} },
      { k: 'r', l: 'Expected return', post: '%', min: 1, max: 24, step: 0.5, def: 12 },
      { k: 'y', l: 'Duration', post: 'yr', min: 1, max: 40, step: 1, def: 10 }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'investment' || id === 'sip') {
      const i = v.r / 1200, years = v.y;
      let bal = id === 'investment' ? v.init : 0, invested = id === 'investment' ? v.init : 0;
      let monthly = v.monthly;
      const rows = [];
      for (let y = 0; y < years && y < 40; y++) {
        if (id === 'sip' && y > 0) monthly = monthly * (1 + (v.step || 0) / 100);
        for (let m = 0; m < 12; m++) { bal = (bal + monthly) * (1 + i); invested += monthly; }
        rows.push({ label: 'Yr ' + (y + 1), a: invested, b: Math.max(bal - invested, 0), bal: bal });
      }
      const gain = bal - invested;
      return {
        hero: { l: id === 'sip' ? 'Value at maturity' : 'Future value', v: f(bal), sub: this.short(gain) + ' of that is growth (' + ((gain / Math.max(invested, 1)) * 100).toFixed(0) + '% on invested)' },
        split: { pct: this.pct(invested, bal), aName: 'Invested', a: 'Invested · ' + this.short(invested), b: 'Returns · ' + this.short(gain) },
        rows: [
          { l: 'Total invested', v: f(invested) },
          { l: 'Estimated returns', v: f(gain) },
          { l: 'Final corpus', v: f(bal) },
          { l: id === 'sip' ? 'Last monthly instalment' : 'Monthly addition', v: f(monthly) }
        ],
        chart: { title: 'Growth by year', hint: 'invested vs returns', rows: this.chart(rows, (r) => this.short(r.bal)) }
      };
    }
    return null;
  }
};
