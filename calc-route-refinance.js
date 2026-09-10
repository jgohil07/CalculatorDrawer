window.__calcRoute = {
  id: 'refi', cat: 'loans', slug: 'refinance', kind: 'form',
  F: {
    refi: [
      { k: 'p', req: 1, l: 'Outstanding balance', cur: 1, min: 0, max: 20000000, step: 10000, def: 0, u: { min: 0, max: 2000000, step: 5000, def: 0} },
      { k: 'y', l: 'Years remaining', post: 'yr', min: 1, max: 30, step: 1, def: 18 },
      { k: 'oldR', l: 'Current rate', post: '%', min: 1, max: 24, step: 0.05, def: 9.4 },
      { k: 'newR', l: 'New rate', post: '%', min: 1, max: 24, step: 0.05, def: 8.35 },
      { k: 'fee', l: 'Switching cost', cur: 1, min: 0, max: 500000, step: 1000, def: 0, u: { min: 0, max: 20000, step: 100, def: 0} }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'refi') {
      const N = Math.round(v.y * 12);
      const oldEmi = this.emiOf(v.p, v.oldR / 1200, N);
      const newEmi = this.emiOf(v.p, v.newR / 1200, N);
      const saveMo = oldEmi - newEmi;
      const totalSave = saveMo * N - v.fee;
      const be = saveMo > 0 ? Math.ceil(v.fee / saveMo) : null;
      const worth = totalSave > 0 && be !== null && be <= N;
      return {
        hero: {
          l: worth ? 'Net saving from switching' : 'Not worth switching',
          v: worth ? f(totalSave) : f(Math.abs(totalSave)) + ' worse',
          sub: be === null ? 'The new rate is not lower, so there is nothing to recover' : 'Break-even in month ' + be + ' of ' + N + ' remaining'
        },
        split: { pct: saveMo > 0 ? Math.min((v.fee / (saveMo * N)) * 100, 100) : 100, aName: 'Fee', a: 'Switching cost · ' + this.short(v.fee), b: 'Kept saving · ' + this.short(Math.max(totalSave, 0)) },
        rows: [
          { l: 'Current EMI', v: f(oldEmi) },
          { l: 'New EMI', v: f(newEmi) },
          { l: 'Monthly saving', v: f(saveMo) },
          { l: 'Interest saved over term', v: f(saveMo * N) },
          { l: 'Switching cost', v: f(v.fee) },
          { l: 'Break-even', v: be === null ? '—' : be + ' months' }
        ],
        note: 'Assumes you keep the same remaining tenure. Keeping the old EMI on the new rate finishes the loan even sooner.'
      };
    }
    return null;
  }
};
