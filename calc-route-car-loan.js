window.__calcRoute = {
  id: 'carloan', cat: 'loans', slug: 'car-loan', kind: 'form',
  F: {
    carloan: [
      { k: 'price', req: 1, l: 'On-road price', cur: 1, min: 0, max: 10000000, step: 25000, def: 0, u: { min: 0, max: 200000, step: 500, def: 0} },
      { k: 'down', l: 'Down payment', post: '%', min: 0, max: 80, step: 1, def: 20 },
      { k: 'trade', l: 'Trade-in value', cur: 1, min: 0, max: 5000000, step: 10000, def: 0, u: { min: 0, max: 100000, step: 500, def: 0} },
      { k: 'r', l: 'Interest rate', post: '%', min: 1, max: 24, step: 0.05, def: 9.25 },
      { k: 'y', l: 'Term', post: 'yr', min: 1, max: 8, step: 1, def: 5 }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'carloan') {
      const loan = Math.max(v.price * (1 - v.down / 100) - v.trade, 0);
      const a = this.amort(loan, v.r, v.y), total = a.emi * a.N, interest = total - loan;
      return {
        hero: { l: 'Monthly payment', v: f(a.emi), sub: 'Financing ' + this.short(loan) + ' of a ' + this.short(v.price) + ' vehicle over ' + v.y + ' yr' },
        split: { pct: total ? (loan / total) * 100 : 0, aName: 'Principal', a: 'Principal · ' + this.short(loan), b: 'Interest · ' + this.short(interest) },
        rows: [
          { l: 'Down payment', v: f(v.price * v.down / 100) },
          { l: 'Trade-in applied', v: f(v.trade) },
          { l: 'Amount financed', v: f(loan) },
          { l: 'Total interest', v: f(interest) },
          { l: 'Total cost of the car', v: f(v.price * v.down / 100 + total) }
        ],
        chart: { title: 'Payoff by year', hint: 'principal vs interest', rows: this.chart(a.rows, (r) => 'bal ' + this.short(r.bal)) },
        note: 'A car loses value while the loan runs — a shorter term costs more per month but far less overall.'
      };
    }
    return null;
  }
};
