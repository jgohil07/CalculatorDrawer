window.__calcRoute = {
  id: 'emi', cat: 'loans', slug: 'loan-emi', kind: 'form',
  F: {
    emi: [
      { k: 'p', req: 1, l: 'Loan amount', cur: 1, min: 0, max: 20000000, step: 10000, def: 0, u: { min: 0, max: 2000000, step: 5000, def: 0} },
      { k: 'r', l: 'Interest rate', post: '%', min: 1, max: 24, step: 0.05, def: 9.5 },
      { k: 'y', l: 'Tenure', post: 'yr', min: 1, max: 30, step: 1, def: 5 }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'emi') {
      const a = this.amort(v.p, v.r, v.y), total = a.emi * a.N, interest = total - v.p;
      return {
        hero: { l: 'Monthly instalment', v: f(a.emi), sub: a.N + ' payments · ' + this.short(total) + ' repaid in total' },
        split: { pct: this.pct(v.p, total), aName: 'Principal', a: 'Principal · ' + this.short(v.p), b: 'Interest · ' + this.short(interest) },
        rows: [
          { l: 'Principal', v: f(v.p) },
          { l: 'Total interest', v: f(interest) },
          { l: 'Total payable', v: f(total) },
          { l: 'Interest as % of principal', v: this.pctStr(interest, v.p) }
        ],
        chart: { title: 'Amortisation by year', hint: 'principal vs interest paid', rows: this.chart(a.rows, (r) => 'bal ' + this.short(r.bal)) }
      };
    }
    return null;
  }
};
