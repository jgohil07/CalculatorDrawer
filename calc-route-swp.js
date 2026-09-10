window.__calcRoute = {
  id: 'swp', cat: 'invest', slug: 'swp', kind: 'form',
  F: {
    swp: [
      { k: 'corpus', req: 1, l: 'Starting corpus', cur: 1, min: 0, max: 100000000, step: 100000, def: 0, u: { min: 0, max: 10000000, step: 10000, def: 0} },
      { k: 'w', req: 1, l: 'Monthly withdrawal', cur: 1, min: 0, max: 1000000, step: 1000, def: 0, u: { min: 0, max: 50000, step: 100, def: 0} },
      { k: 'r', l: 'Expected return', post: '%', min: 0, max: 20, step: 0.5, def: 8 },
      { k: 'y', l: 'Horizon', post: 'yr', min: 1, max: 40, step: 1, def: 20 },
      { k: 'inflOn', l: 'Index withdrawals to inflation', type: 'toggle', def: true },
      { k: 'infl', l: 'Inflation', post: '%', min: 0, max: 12, step: 0.5, def: 5 }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'swp') {
      const i = v.r / 1200; let bal = v.corpus, withdrawn = 0, earned = 0, months = 0;
      const infl = v.inflOn ? (v.infl || 0) : 0;
      let w = v.w; const rows = [];
      for (let y = 0; y < v.y && y < 40; y++) {
        if (y > 0) w = w * (1 + infl / 100);
        let yw = 0;
        for (let m = 0; m < 12; m++) {
          if (bal <= 0) break;
          const int = bal * i; earned += int; bal += int;
          const take = Math.min(w, bal);
          bal -= take; withdrawn += take; yw += take; months++;
        }
        rows.push({ label: 'Yr ' + (y + 1), a: Math.max(bal, 0), b: 0, bal: bal, yw: yw });
      }
      const lasted = bal > 0 ? null : months;
      const realRate = infl ? ((1 + v.r / 100) / (1 + infl / 100) - 1) * 100 : v.r;
      return {
        hero: {
          l: bal > 0 ? 'Corpus left after ' + v.y + ' yr' : 'Corpus runs out in',
          v: bal > 0 ? f(bal) : Math.floor(lasted / 12) + ' yr ' + (lasted % 12) + ' mo',
          sub: bal > 0 ? 'Withdrawals are covered for the full horizon' : 'Withdrawal outpaces returns — trim it or grow the corpus'
        },
        split: { pct: (withdrawn / Math.max(withdrawn + Math.max(bal, 0), 1)) * 100, aName: 'Withdrawn', a: 'Withdrawn · ' + this.short(withdrawn), b: 'Still invested · ' + this.short(Math.max(bal, 0)) },
        rows: [
          { l: 'Total withdrawn', v: f(withdrawn) },
          { l: 'Returns earned', v: f(earned) },
          { l: 'Closing balance', v: f(Math.max(bal, 0)) },
          { l: infl ? 'Last monthly withdrawal' : 'Monthly withdrawal', v: f(w) },
          { l: 'Withdrawal rate (yr 1)', v: this.pctStr(v.w * 12, v.corpus, 2) },
          { l: 'Real return after inflation', v: realRate.toFixed(2) + '%' }
        ],
        chart: { title: 'Balance by year', hint: 'remaining corpus', rows: this.chart(rows, (r) => this.short(Math.max(r.bal, 0))) },
        note: infl ? 'Withdrawals step up ' + infl + '% a year so your spending power stays flat; returns are the nominal ' + v.r + '%.' : 'Withdrawals are held flat in nominal terms — switch inflation indexing on to preserve spending power.'
      };
    }
    return null;
  }
};
