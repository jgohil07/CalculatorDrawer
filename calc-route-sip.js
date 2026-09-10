window.__calcRoute = {
  id: 'sip', cat: 'invest', slug: 'sip', kind: 'form',
  F: {
    sip: [
      { k: 'monthly', req: 1, l: 'Monthly investment', cur: 1, min: 0, max: 500000, step: 500, def: 0, u: { min: 0, max: 20000, step: 50, def: 0} },
      { k: 'r', l: 'Expected return', post: '%', min: 1, max: 24, step: 0.5, def: 12 },
      { k: 'y', l: 'Duration', post: 'yr', min: 1, max: 40, step: 1, def: 15 },
      { k: 'step', l: 'Annual step-up', post: '%', min: 0, max: 25, step: 1, def: 0 }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'investment' || id === 'sip') {
      const i = v.r / 1200, years = v.y;
      let bal = id === 'investment' ? v.init : 0, invested = id === 'investment' ? v.init : 0;
      let monthly = id === 'investment' ? v.monthly : v.monthly;
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
