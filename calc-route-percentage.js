window.__calcRoute = {
  id: 'percent', cat: 'basic', slug: 'percentage', kind: 'form',
  F: {
    percent: function (v) {
      const m = v.mode || 'of';
      const A = m === 'of' ? 'Percentage' : m === 'is' ? 'Part' : 'From value';
      const B = m === 'of' ? 'Of value' : m === 'is' ? 'Whole' : 'To value';
      return [
        { k: 'mode', l: 'Question', type: 'select', def: 'of', options: [{ v: 'of', l: 'X% of Y' }, { v: 'is', l: 'X of Y = ?%' }, { v: 'chg', l: '% change' }] },
        { k: 'a', req: 1, l: A, post: m === 'of' ? '%' : '', min: 0, max: 1000, step: 1, def: 0, noSlider: 1 },
        { k: 'b', req: 1, l: B, min: 0, max: 1000000, step: 1, def: 0, noSlider: 1 }
      ];
    },
  },
  compute: function (id, v, f) {
    if (id === 'percent') {
      const a = v.a, b = v.b, m = v.mode || 'of';
      const d = (x) => this.num(x, 4);
      if (m === 'of') {
        return {
          hero: { l: a + '% of ' + this.num(b, 4), v: d(b * a / 100), sub: 'Also written ' + d(a / 100) + ' × ' + d(b) },
          rows: [
            { l: a + '% of ' + d(b), v: d(b * a / 100) },
            { l: d(b) + ' increased by ' + a + '%', v: d(b * (1 + a / 100)) },
            { l: d(b) + ' decreased by ' + a + '%', v: d(b * (1 - a / 100)) },
            { l: 'Reverse: ' + d(b) + ' is ' + a + '% of', v: a ? d(b * 100 / a) : '—' }
          ]
        };
      }
      if (m === 'is') {
        const pctv = b ? (a / b) * 100 : NaN;
        return {
          hero: { l: d(a) + ' out of ' + d(b), v: isFinite(pctv) ? pctv.toFixed(2) + '%' : '—', sub: 'The remaining share is ' + (isFinite(pctv) ? (100 - pctv).toFixed(2) + '%' : '—') },
          rows: [
            { l: 'As a fraction', v: d(a) + ' / ' + d(b) },
            { l: 'As a decimal', v: b ? d(a / b) : '—' },
            { l: 'Remainder', v: d(b - a) },
            { l: 'Per 1,000', v: b ? d((a / b) * 1000) : '—' }
          ]
        };
      }
      const chg = a ? ((b - a) / a) * 100 : NaN;
      return {
        hero: { l: chg >= 0 ? 'Increase' : 'Decrease', v: isFinite(chg) ? (chg >= 0 ? '+' : '') + chg.toFixed(2) + '%' : '—', sub: d(a) + ' → ' + d(b) + ' is a change of ' + d(b - a) },
        rows: [
          { l: 'Absolute change', v: d(b - a) },
          { l: 'Multiplier', v: a ? d(b / a) + '×' : '—' },
          { l: 'Reverse change back', v: b ? (((a - b) / b) * 100).toFixed(2) + '%' : '—' },
          { l: 'Midpoint', v: d((a + b) / 2) }
        ]
      };
    }
    return null;
  }
};
