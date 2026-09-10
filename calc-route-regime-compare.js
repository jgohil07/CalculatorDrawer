window.__calcRoute = {
  id: 'taxcompare', cat: 'plan', slug: 'regime-compare', kind: 'form',
  F: {
    taxcompare: [
      { k: 'income', req: 1, l: 'Gross annual income', cur: 1, min: 0, max: 50000000, step: 50000, def: 0},
      { k: 'ded', l: 'Deductions (old regime)', cur: 1, min: 0, max: 500000, step: 10000, def: 0}
    ],
  },
  compute: function (id, v, f) {
    if (id === 'taxcompare') {
      const a = this.taxOf(v.income, true, 0), b = this.taxOf(v.income, false, v.ded);
      const better = a.total <= b.total ? 'New' : 'Old';
      const diff = Math.abs(a.total - b.total);
      let be = null;
      for (let d = 0; d <= 1500000; d += 5000) {
        if (this.taxOf(v.income, false, d).total <= a.total) { be = d; break; }
      }
      return {
        hero: { l: better + ' regime saves you', v: f(diff), sub: 'New regime ' + this.short(a.total) + ' vs old regime ' + this.short(b.total) + ' on ' + this.short(v.income) },
        split: { pct: (a.total + b.total) ? (a.total / (a.total + b.total)) * 100 : 50, aName: 'New', a: 'New regime tax · ' + this.short(a.total), b: 'Old regime tax · ' + this.short(b.total) },
        rows: [
          { l: 'New regime — taxable income', v: f(a.taxable) },
          { l: 'New regime — total tax', v: f(a.total) },
          { l: 'Old regime — taxable income', v: f(b.taxable) },
          { l: 'Old regime — total tax', v: f(b.total) },
          { l: 'Deductions to break even', v: be === null ? 'not reachable' : f(be) },
          { l: 'Effective rate (better option)', v: ((Math.min(a.total, b.total) / Math.max(v.income, 1)) * 100).toFixed(1) + '%' }
        ],
        note: 'The old regime only wins once deductions (80C, 80D, HRA, home-loan interest) exceed ' + (be === null ? 'any realistic amount' : this.short(be)) + '. Both figures include 4% cess, the §87A rebate with marginal relief, and surcharge where it applies.'
      };
    }
    return null;
  }
};
