window.__calcRoute = {
  id: 'simpleint', cat: 'loans', slug: 'simple-interest', kind: 'form',
  F: {
    simpleint: [
      { k: 'p', req: 1, l: 'Principal', cur: 1, min: 0, max: 20000000, step: 10000, def: 0, u: { min: 0, max: 2000000, step: 500, def: 0} },
      { k: 'r', l: 'Interest rate', post: '%', min: 0.5, max: 36, step: 0.25, def: 8 },
      { k: 'y', l: 'Duration', post: 'yr', min: 1, max: 30, step: 1, def: 5 }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'simpleint') {
      const si = v.p * v.r * v.y / 100;
      const comp = v.p * Math.pow(1 + v.r / 100, v.y) - v.p;
      const rows = [];
      for (let y = 1; y <= v.y && y <= 40; y++) rows.push({ label: 'Yr ' + y, a: v.p, b: v.p * v.r * y / 100, bal: v.p + v.p * v.r * y / 100 });
      return {
        hero: { l: 'Total interest', v: f(si), sub: 'Maturity value ' + this.short(v.p + si) + ' after ' + v.y + ' yr at ' + v.r + '% flat' },
        split: { pct: this.pct(v.p, v.p + si), aName: 'Principal', a: 'Principal · ' + this.short(v.p), b: 'Interest · ' + this.short(si) },
        rows: [
          { l: 'Interest per year', v: f(v.p * v.r / 100) },
          { l: 'Interest per month', v: f(v.p * v.r / 1200) },
          { l: 'Total interest', v: f(si) },
          { l: 'Maturity value', v: f(v.p + si) },
          { l: 'Same rate compounded yearly', v: f(comp) },
          { l: 'Compounding costs extra', v: f(comp - si) }
        ],
        chart: { title: 'Growth by year', hint: 'principal vs interest', rows: this.chart(rows, (r) => this.short(r.bal)) }
      };
    }
    return null;
  }
};
