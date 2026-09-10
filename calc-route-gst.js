window.__calcRoute = {
  id: 'gst', cat: 'plan', slug: 'gst', kind: 'form',
  F: {
    gst: [
      { k: 'mode', l: 'Direction', type: 'select', def: 'add', options: [{ v: 'add', l: 'Add GST' }, { v: 'remove', l: 'Remove GST' }] },
      { k: 'amount', req: 1, l: 'Amount', cur: 1, min: 0, max: 10000000, step: 100, def: 0, noSlider: 1 },
      { k: 'rate', l: 'GST rate', type: 'select', def: '18', options: [{ v: '5', l: '5%' }, { v: '12', l: '12%' }, { v: '18', l: '18%' }, { v: '28', l: '28%' }] }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'gst') {
      const rate = Number(v.rate) || 18;
      const add = v.mode !== 'remove';
      const base = add ? v.amount : v.amount / (1 + rate / 100);
      const tax = add ? v.amount * rate / 100 : v.amount - base;
      const total = base + tax;
      return {
        hero: { l: add ? 'Price including GST' : 'Price before GST', v: f(add ? total : base, 2), sub: rate + '% GST on a base of ' + f(base, 2) + ' is ' + f(tax, 2) },
        split: { pct: total ? (base / total) * 100 : 0, aName: 'Base', a: 'Base price · ' + f(base, 2), b: 'GST · ' + f(tax, 2) },
        rows: [
          { l: 'Base price', v: f(base, 2) },
          { l: 'CGST (' + (rate / 2) + '%)', v: f(tax / 2, 2) },
          { l: 'SGST (' + (rate / 2) + '%)', v: f(tax / 2, 2) },
          { l: 'Total GST', v: f(tax, 2) },
          { l: 'Invoice total', v: f(total, 2) }
        ],
        note: 'Intra-state supply splits GST equally into CGST and SGST; an inter-state invoice shows the same total as a single IGST line.'
      };
    }
    return null;
  }
};
