window.__calcRoute = {
  id: 'prepay', cat: 'loans', slug: 'prepayment-impact', kind: 'form',
  F: {
    prepay: [
      { k: 'p', req: 1, l: 'Outstanding balance', cur: 1, min: 0, max: 20000000, step: 10000, def: 0, u: { min: 0, max: 2000000, step: 5000, def: 0} },
      { k: 'r', l: 'Interest rate', post: '%', min: 1, max: 24, step: 0.05, def: 9 },
      { k: 'y', l: 'Years remaining', post: 'yr', min: 1, max: 30, step: 1, def: 18 },
      { k: 'extra', l: 'Extra each month', cur: 1, min: 0, max: 200000, step: 1000, def: 0, u: { min: 0, max: 5000, step: 50, def: 0} },
      { k: 'lump', l: 'One-off prepayment now', cur: 1, min: 0, max: 10000000, step: 25000, def: 0, u: { min: 0, max: 500000, step: 1000, def: 0} }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'prepay') {
      const i = v.r / 1200, N = Math.round(v.y * 12), base = this.emiOf(v.p, i, N);
      const baseInterest = base * N - v.p;
      let bal = Math.max(v.p - v.lump, 0), months = 0, paid = 0;
      const pay = base + v.extra;
      const rows = [];
      let yearInt = 0, yearPrin = 0;
      while (bal > 0 && months < N) {
        const int = bal * i; const prin = Math.min(pay - int, bal);
        if (prin <= 0) break;
        bal -= prin; paid += int; months++; yearInt += int; yearPrin += prin;
        if (months % 12 === 0 || bal <= 0) {
          rows.push({ label: 'Yr ' + Math.ceil(months / 12), a: yearPrin, b: yearInt, bal: Math.max(bal, 0) });
          yearInt = 0; yearPrin = 0;
        }
      }
      const saved = baseInterest - paid;
      const cut = N - months;
      return {
        hero: { l: 'Interest saved', v: f(Math.max(saved, 0)), sub: 'Tenure shortens by ' + Math.floor(cut / 12) + ' yr ' + (cut % 12) + ' mo — ' + months + ' payments instead of ' + N },
        split: { pct: baseInterest ? (Math.max(saved, 0) / baseInterest) * 100 : 0, aName: 'Saved', a: 'Interest saved · ' + this.short(Math.max(saved, 0)), b: 'Interest still paid · ' + this.short(paid) },
        rows: [
          { l: 'Current EMI', v: f(base) },
          { l: 'EMI with extra', v: f(pay) },
          { l: 'Interest without prepaying', v: f(baseInterest) },
          { l: 'Interest after prepaying', v: f(paid) },
          { l: 'New tenure', v: Math.floor(months / 12) + ' yr ' + (months % 12) + ' mo' }
        ],
        chart: { title: 'Accelerated payoff', hint: 'principal vs interest paid', rows: this.chart(rows, (r) => 'bal ' + this.short(r.bal)) },
        note: 'Assumes the extra amount is paid every month and the lender applies it to principal without a fee.'
      };
    }
    return null;
  }
};
