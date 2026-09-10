window.__calcRoute = {
  id: 'realreturn', cat: 'invest', slug: 'real-return', kind: 'form',
  F: {
    realreturn: [
      { k: 'nominal', l: 'Nominal return', post: '%', min: 0, max: 30, step: 0.25, def: 12 },
      { k: 'infl', l: 'Inflation', post: '%', min: 0, max: 15, step: 0.25, def: 6 },
      { k: 'tax', l: 'Tax on gains', post: '%', min: 0, max: 42, step: 1, def: 12.5 },
      { k: 'amount', req: 1, l: 'Amount invested', cur: 1, min: 0, max: 50000000, step: 50000, def: 0, u: { min: 0, max: 2000000, step: 500, def: 0} },
      { k: 'y', l: 'Horizon', post: 'yr', min: 1, max: 40, step: 1, def: 10 }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'realreturn') {
      const postTax = v.nominal * (1 - v.tax / 100);
      const real = ((1 + postTax / 100) / (1 + v.infl / 100) - 1) * 100;
      const nomEnd = v.amount * Math.pow(1 + v.nominal / 100, v.y);
      const realEnd = v.amount * Math.pow(1 + real / 100, v.y);
      const rows = [];
      for (let y = 1; y <= v.y && y <= 40; y++) {
        rows.push({ label: 'Yr ' + y, a: v.amount * Math.pow(1 + real / 100, y), b: 0, bal: v.amount * Math.pow(1 + real / 100, y) });
      }
      return {
        hero: { l: 'Real return', v: real.toFixed(2) + '%', sub: 'Nominal ' + v.nominal + '% becomes ' + postTax.toFixed(2) + '% after tax, then ' + real.toFixed(2) + '% after ' + v.infl + '% inflation' },
        split: { pct: v.nominal ? Math.max(0, Math.min(100, (real / v.nominal) * 100)) : 0, aName: 'Kept', a: 'Real return kept · ' + real.toFixed(2) + '%', b: 'Lost to tax & inflation · ' + (v.nominal - real).toFixed(2) + '%' },
        rows: [
          { l: 'Nominal return', v: v.nominal.toFixed(2) + '%' },
          { l: 'After tax', v: postTax.toFixed(2) + '%' },
          { l: 'After inflation (real)', v: real.toFixed(2) + '%' },
          { l: 'Nominal value in ' + v.y + ' yr', v: f(nomEnd) },
          { l: 'Value in today\'s money', v: f(realEnd) },
          { l: 'Lost to tax and inflation', v: f(nomEnd - realEnd) }
        ],
        chart: { title: 'Real value by year', hint: "in today's money", rows: this.chart(rows, (r) => this.short(r.bal)) },
        note: 'Uses the exact Fisher relation rather than simply subtracting inflation, which overstates real returns at higher rates.'
      };
    }
    return null;
  }
};
