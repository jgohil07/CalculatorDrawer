window.__calcRoute = {
  id: 'mortgage', cat: 'loans', slug: 'mortgage', kind: 'form',
  F: {
    mortgage: [
      { k: 'price', req: 1, l: 'Home price', cur: 1, min: 0, max: 50000000, step: 100000, def: 0, u: { min: 0, max: 5000000, step: 10000, def: 0} },
      { k: 'down', l: 'Down payment', post: '%', min: 0, max: 60, step: 1, def: 20 },
      { k: 'r', l: 'Interest rate', post: '%', min: 1, max: 15, step: 0.05, def: 8.5 },
      { k: 'y', l: 'Term', post: 'yr', min: 5, max: 30, step: 1, def: 20 },
      { k: 'tax', l: 'Property tax / yr', cur: 1, min: 0, max: 500000, step: 1000, def: 0, u: { min: 0, max: 40000, step: 100, def: 0} },
      { k: 'ins', l: 'Insurance / yr', cur: 1, min: 0, max: 200000, step: 1000, def: 0, u: { min: 0, max: 20000, step: 100, def: 0} },
      { k: 'hoa', l: 'Maintenance / mo', cur: 1, min: 0, max: 50000, step: 500, def: 0, u: { min: 0, max: 3000, step: 25, def: 0} }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'mortgage') {
      const loan = v.price * (1 - v.down / 100), a = this.amort(loan, v.r, v.y);
      const escrow = v.tax / 12 + v.ins / 12 + v.hoa, monthly = a.emi + escrow;
      const interest = a.emi * a.N - loan;
      return {
        hero: { l: 'Monthly payment', v: f(monthly), sub: 'Loan of ' + this.short(loan) + ' after ' + this.short(v.price * v.down / 100) + ' down' },
        split: { pct: (a.emi / monthly) * 100, aName: 'P & I', a: 'Principal + interest · ' + f(a.emi), b: 'Tax, insurance, upkeep · ' + f(escrow) },
        rows: [
          { l: 'Principal & interest', v: f(a.emi) },
          { l: 'Property tax', v: f(v.tax / 12) },
          { l: 'Insurance', v: f(v.ins / 12) },
          { l: 'Maintenance / HOA', v: f(v.hoa) },
          { l: 'Total interest over term', v: f(interest) }
        ],
        chart: { title: 'Loan payoff by year', hint: 'principal vs interest paid', rows: this.chart(a.rows, (r) => 'bal ' + this.short(r.bal)) }
      };
    }
    return null;
  }
};
