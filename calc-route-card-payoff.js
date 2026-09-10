window.__calcRoute = {
  id: 'ccpayoff', cat: 'loans', slug: 'card-payoff', kind: 'form',
  F: {
    ccpayoff: [
      { k: 'bal', req: 1, l: 'Card balance', cur: 1, min: 0, max: 2000000, step: 5000, def: 0, u: { min: 0, max: 100000, step: 100, def: 0} },
      { k: 'apr', l: 'APR', post: '%', min: 6, max: 48, step: 0.25, def: 36 },
      { k: 'pay', req: 1, l: 'Monthly payment', cur: 1, min: 0, max: 500000, step: 500, def: 0, u: { min: 0, max: 20000, step: 25, def: 0} }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'ccpayoff') {
      const i = v.apr / 1200, minInt = v.bal * i;
      let bal = v.bal, months = 0, interest = 0;
      const rows = [];
      let yearInt = 0, yearPrin = 0;
      while (bal > 0 && months < 600) {
        const int = bal * i; const prin = Math.min(v.pay - int, bal);
        if (prin <= 0) break;
        bal -= prin; interest += int; months++; yearInt += int; yearPrin += prin;
        if (months % 12 === 0 || bal <= 0) { rows.push({ label: 'Yr ' + Math.ceil(months / 12), a: yearPrin, b: yearInt, bal: Math.max(bal, 0) }); yearInt = 0; yearPrin = 0; }
      }
      const never = v.pay <= minInt || bal > 0;
      return {
        hero: {
          l: never ? 'Balance never clears' : 'Debt-free in',
          v: never ? f(minInt) + ' / mo is just interest' : Math.floor(months / 12) + ' yr ' + (months % 12) + ' mo',
          sub: never ? 'Your payment does not cover the monthly interest — raise it above this figure' : f(interest) + ' of interest on top of the ' + this.short(v.bal) + ' borrowed'
        },
        split: never ? undefined : { pct: this.pct(v.bal, v.bal + interest), aName: 'Principal', a: 'Principal · ' + this.short(v.bal), b: 'Interest · ' + this.short(interest) },
        rows: [
          { l: 'First month interest', v: f(minInt) },
          { l: 'Total interest', v: never ? '∞' : f(interest) },
          { l: 'Total repaid', v: never ? '—' : f(v.bal + interest) },
          { l: 'Payments needed', v: never ? '—' : this.num(months) },
          { l: 'Interest as % of balance', v: never ? '—' : this.pctStr(interest, v.bal) }
        ],
        chart: never ? undefined : { title: 'Payoff by year', hint: 'principal vs interest', rows: this.chart(rows, (r) => 'bal ' + this.short(r.bal)) }
      };
    }
    return null;
  }
};
