window.__calcRoute = {
  id: 'fire', cat: 'plan', slug: 'fire', kind: 'form',
  F: {
    fire: [
      { k: 'spend', req: 1, l: 'Monthly spending', cur: 1, min: 0, max: 1000000, step: 5000, def: 0, u: { min: 0, max: 50000, step: 250, def: 0} },
      { k: 'swr', l: 'Withdrawal rate', post: '%', min: 2, max: 8, step: 0.25, def: 4 },
      { k: 'corpus', l: 'Invested today', cur: 1, min: 0, max: 200000000, step: 100000, def: 0, u: { min: 0, max: 10000000, step: 5000, def: 0} },
      { k: 'save', l: 'Monthly saving', cur: 1, min: 0, max: 1000000, step: 5000, def: 0, u: { min: 0, max: 50000, step: 250, def: 0} },
      { k: 'r', l: 'Expected return', post: '%', min: 1, max: 20, step: 0.5, def: 11 }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'fire') {
      const annual = v.spend * 12;
      const target = annual * 100 / Math.max(v.swr, 0.01);
      const i = v.r / 1200;
      let bal = v.corpus, months = 0;
      const rows = [];
      while (bal < target && months < 720) {
        bal = (bal + v.save) * (1 + i); months++;
        if (months % 12 === 0) rows.push({ label: 'Yr ' + months / 12, a: v.corpus + v.save * months, b: Math.max(bal - v.corpus - v.save * months, 0), bal: bal });
      }
      const reached = bal >= target;
      const yrs = Math.floor(months / 12), mos = months % 12;
      return {
        hero: {
          l: reached ? 'Financially independent in' : 'Not reachable in 60 yr',
          v: reached ? (months === 0 ? 'already there' : yrs + ' yr ' + mos + ' mo') : '—',
          sub: 'Target corpus ' + this.short(target) + ' at a ' + v.swr + '% withdrawal rate'
        },
        split: { pct: target ? Math.min((v.corpus / target) * 100, 100) : 0, aName: 'Funded', a: 'Invested today · ' + this.short(v.corpus), b: 'Still to build · ' + this.short(Math.max(target - v.corpus, 0)) },
        rows: [
          { l: 'Annual spending', v: f(annual) },
          { l: 'Corpus needed', v: f(target) },
          { l: 'That is a multiple of', v: (100 / Math.max(v.swr, 0.01)).toFixed(0) + '× annual spend' },
          { l: 'Already invested', v: f(v.corpus) },
          { l: 'Monthly saving', v: f(v.save) },
          { l: 'Time to target', v: reached ? yrs + ' yr ' + mos + ' mo' : 'over 60 yr' },
          { l: 'Savings rate', v: this.pctStr(v.save, v.save + v.spend, 0) }
        ],
        chart: { title: 'Corpus build-up', hint: 'contributions vs growth', rows: this.chart(rows, (r) => this.short(r.bal)) },
        note: 'The withdrawal rate is the whole assumption: 4% is the classic US-market figure, and a more cautious 3–3.5% raises the target substantially.'
      };
    }
    return null;
  }
};
