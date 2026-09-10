window.__calcRoute = {
  id: 'capgains', cat: 'plan', slug: 'capital-gains', kind: 'form',
  F: {
    capgains: function (v) {
      const eq = v.asset !== 'other';
      return [
        { k: 'asset', l: 'Asset', type: 'select', def: 'equity', options: [{ v: 'equity', l: 'Listed equity' }, { v: 'other', l: 'Property / gold' }] },
        { k: 'buy', req: 1, l: 'Purchase price', cur: 1, min: 0, max: 100000000, step: 25000, def: 0},
        { k: 'sell', req: 1, l: 'Sale price', cur: 1, min: 0, max: 200000000, step: 25000, def: 0},
        { k: 'months', l: 'Held for', post: 'mo', min: 1, max: 240, step: 1, def: eq ? 30 : 40 }
      ];
    },
  },
  compute: function (id, v, f) {
    if (id === 'capgains') {
      const eq = v.asset !== 'other';
      const gain = v.sell - v.buy;
      const longTerm = v.months >= (eq ? 12 : 24);
      const exempt = eq && longTerm ? 125000 : 0;
      const taxable = Math.max(gain - exempt, 0);
      const rate = longTerm ? 12.5 : (eq ? 20 : 30);
      const slabRated = !longTerm && !eq;
      const preCess = gain > 0 ? taxable * rate / 100 : 0;
      const cess = preCess * 0.04;
      const tax = preCess + cess;
      const holdLabel = longTerm ? 'Long term' : 'Short term';
      const need = eq ? 12 : 24;
      return {
        hero: { l: holdLabel + ' capital gains tax', v: f(tax), sub: gain > 0 ? 'On a gain of ' + this.short(gain) + ' taxed at ' + rate + '%' : 'A loss of ' + this.short(-gain) + ' — carry it forward against future gains' },
        split: gain > 0 ? { pct: gain ? ((gain - tax) / gain) * 100 : 0, aName: 'Kept', a: 'Net gain · ' + this.short(gain - tax), b: 'Tax · ' + this.short(tax) } : undefined,
        rows: [
          { l: 'Gain', v: f(gain) },
          { l: 'Holding period', v: v.months + ' months (' + holdLabel.toLowerCase() + ')' },
          { l: 'Long-term threshold', v: need + ' months' },
          { l: 'Exemption applied', v: exempt ? f(exempt) : 'none' },
          { l: 'Tax rate', v: rate + '%' + (slabRated ? ' (top slab assumed)' : '') },
          { l: 'Tax before cess', v: f(preCess) },
          { l: 'Health & education cess (4%)', v: f(cess) },
          { l: 'Tax payable', v: f(tax) },
          { l: 'Net proceeds', v: f(v.sell - tax) }
        ],
        note: eq
          ? 'Listed equity: 20% STCG under 12 months, 12.5% LTCG beyond it with ₹1.25 L exempt each year. Excludes surcharge and cess.'
          : 'Property and gold turn long-term at 24 months, then 12.5% without indexation. Short-term gains are taxed at your slab rate — the top 30% slab is assumed here. Excludes surcharge and any §54 reinvestment relief.'
      };
    }
    return null;
  }
};
