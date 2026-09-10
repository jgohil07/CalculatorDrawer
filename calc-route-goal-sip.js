window.__calcRoute = {
  id: 'goalsip', cat: 'invest', slug: 'goal-sip', kind: 'form',
  F: {
    goalsip: [
      { k: 'target', req: 1, l: 'Target corpus', cur: 1, min: 0, max: 200000000, step: 100000, def: 0, u: { min: 0, max: 10000000, step: 5000, def: 0} },
      { k: 'have', l: 'Already saved', cur: 1, min: 0, max: 100000000, step: 50000, def: 0, u: { min: 0, max: 5000000, step: 1000, def: 0} },
      { k: 'r', l: 'Expected return', post: '%', min: 1, max: 24, step: 0.5, def: 12 },
      { k: 'y', l: 'Years to goal', post: 'yr', min: 1, max: 40, step: 1, def: 12 }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'goalsip') {
      const i = v.r / 1200, N = Math.round(v.y * 12);
      const grown = v.have * Math.pow(1 + i, N);
      const gap = Math.max(v.target - grown, 0);
      const monthly = i === 0 ? gap / N : gap * (i / (Math.pow(1 + i, N) - 1)) / (1 + i);
      const invested = monthly * N;
      return {
        hero: { l: 'Monthly investment needed', v: f(monthly), sub: gap === 0 ? 'Your existing savings already reach the goal' : 'To turn ' + this.short(v.have) + ' into ' + this.short(v.target) + ' in ' + v.y + ' yr' },
        split: { pct: v.target ? (Math.min(grown, v.target) / v.target) * 100 : 0, aName: 'Covered', a: 'From existing savings · ' + this.short(Math.min(grown, v.target)), b: 'From new SIP · ' + this.short(gap) },
        rows: [
          { l: 'Existing savings grow to', v: f(grown) },
          { l: 'Gap to fund', v: f(gap) },
          { l: 'Monthly investment', v: f(monthly) },
          { l: 'You will invest', v: f(invested) },
          { l: 'Returns on the SIP', v: f(Math.max(gap - invested, 0)) }
        ],
        note: 'A step-up SIP reaches the same goal with a lower starting amount — try the SIP calculator with a step-up.'
      };
    }
    return null;
  }
};
