window.__calcRoute = {
  id: 'retirement', cat: 'plan', slug: 'retirement', kind: 'form',
  F: {
    retirement: [
      { k: 'age', l: 'Current age', post: 'yr', min: 18, max: 65, step: 1, def: 30 },
      { k: 'retire', l: 'Retirement age', post: 'yr', min: 40, max: 75, step: 1, def: 60 },
      { k: 'life', l: 'Life expectancy', post: 'yr', min: 65, max: 100, step: 1, def: 85 },
      { k: 'spend', req: 1, l: 'Monthly spend today', cur: 1, min: 0, max: 1000000, step: 5000, def: 0, u: { min: 0, max: 50000, step: 250, def: 0} },
      { k: 'infl', l: 'Inflation', post: '%', min: 0, max: 12, step: 0.5, def: 6 },
      { k: 'corpus', l: 'Saved so far', cur: 1, min: 0, max: 100000000, step: 100000, def: 0, u: { min: 0, max: 10000000, step: 5000, def: 0} },
      { k: 'save', l: 'Monthly saving', cur: 1, min: 0, max: 1000000, step: 1000, def: 0, u: { min: 0, max: 50000, step: 100, def: 0} },
      { k: 'pre', l: 'Return before retiring', post: '%', min: 1, max: 20, step: 0.5, def: 12 },
      { k: 'post', l: 'Return after retiring', post: '%', min: 1, max: 15, step: 0.5, def: 7 }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'retirement') {
      const yearsTo = Math.max(v.retire - v.age, 0), yearsIn = Math.max(v.life - v.retire, 1);
      const i = v.pre / 1200, N = yearsTo * 12;
      let bal = v.corpus; const rows = [];
      for (let y = 0; y < yearsTo && y < 60; y++) {
        for (let m = 0; m < 12; m++) bal = (bal + v.save) * (1 + i);
        rows.push({ label: 'Age ' + (v.age + y + 1), a: v.corpus + v.save * 12 * (y + 1), b: Math.max(bal - v.corpus - v.save * 12 * (y + 1), 0), bal: bal });
      }
      const spendAtRet = v.spend * Math.pow(1 + v.infl / 100, yearsTo);
      const real = (1 + v.post / 100) / (1 + v.infl / 100) - 1;
      const need = Math.abs(real) < 0.0005
        ? spendAtRet * 12 * yearsIn
        : spendAtRet * 12 * (1 - Math.pow(1 + real, -yearsIn)) / real * (1 + real);
      const gap = bal - need;
      return {
        hero: {
          l: gap >= 0 ? 'Projected surplus' : 'Projected shortfall',
          v: f(Math.abs(gap)),
          sub: 'On track for ' + this.short(bal) + ' against a need of ' + this.short(need) + ' at age ' + v.retire
        },
        split: { pct: Math.min((bal / Math.max(need, 1)) * 100, 100), aName: 'Funded', a: 'Projected corpus · ' + this.short(bal), b: 'Still needed · ' + this.short(Math.max(need - bal, 0)) },
        rows: [
          { l: 'Years to retirement', v: yearsTo + ' yr' },
          { l: 'Monthly spend at retirement', v: f(spendAtRet) },
          { l: 'Corpus required', v: f(need) },
          { l: 'Corpus projected', v: f(bal) },
          { l: 'Extra monthly saving to close gap', v: gap >= 0 ? '—' : f(Math.max(0, (need - bal) * (i / (Math.pow(1 + i, N) - 1)) / (1 + i))) }
        ],
        chart: { title: 'Corpus build-up', hint: 'contributions vs growth', rows: this.chart(rows, (r) => this.short(r.bal)) },
        note: (v.life <= v.retire ? 'Life expectancy is at or below your retirement age, so only one year of retirement is modelled — raise it for a realistic figure. ' : '') + 'Post-retirement withdrawals are inflated at ' + v.infl + '% and discounted at a real return of ' + (real * 100).toFixed(1) + '%.'
      };
    }
    return null;
  }
};
