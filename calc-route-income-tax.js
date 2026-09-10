window.__calcRoute = {
  id: 'tax', cat: 'plan', slug: 'income-tax', kind: 'form',
  F: {
    tax: [
      { k: 'regime', l: 'Regime', type: 'select', def: 'new', options: [{ v: 'new', l: 'New' }, { v: 'old', l: 'Old' }] },
      { k: 'income', req: 1, l: 'Gross annual income', cur: 1, min: 0, max: 50000000, step: 50000, def: 0},
      { k: 'ded', l: 'Deductions claimed', cur: 1, min: 0, max: 500000, step: 10000, def: 0}
    ]
  },
  compute: function (id, v, f) {
    const isNew = v.regime === 'new';
    const t = this.taxOf(v.income, isNew, v.ded);
    const std = t.std, taxable = t.taxable, base = t.base, cess = t.cess, total = t.total;
    const rebated = t.rebated;
    const takeHome = v.income - total;
    const rows = [
      { l: 'Standard deduction', v: f(std) },
      { l: 'Other deductions', v: isNew ? 'None under new regime' : f(v.ded) },
      { l: 'Taxable income', v: f(taxable) },
      { l: 'Tax on slabs', v: f(base) }
    ];
    if (t.surcharge > 0) rows.push({ l: 'Surcharge (' + (t.surRate * 100).toFixed(0) + '%)', v: f(t.surcharge) });
    rows.push({ l: 'Health & education cess (4%)', v: f(cess) });
    rows.push({ l: 'Monthly take home', v: f(takeHome / 12) });
    return {
      hero: { l: 'Tax payable', v: f(total), sub: rebated ? 'Reduced to nil or capped by the §87A rebate' : 'Effective rate ' + ((total / Math.max(v.income, 1)) * 100).toFixed(1) + '% of gross income' },
      split: { pct: (takeHome / Math.max(v.income, 1)) * 100, aName: 'Take home', a: 'Take home · ' + this.short(takeHome), b: 'Tax · ' + this.short(total) },
      rows: rows,
      note: 'Indicative only: slabs for FY 2025-26 (AY 2026-27), including the §87A marginal relief just above ₹12 L and surcharge with marginal relief above ₹50 L. Excludes state professional tax. The new regime ignores most deductions by design.'
    };
  }
};
