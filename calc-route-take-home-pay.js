window.__calcRoute = {
  id: 'ctc', cat: 'plan', slug: 'take-home-pay', kind: 'form',
  F: {
    ctc: [
      { k: 'ctc', req: 1, l: 'Annual CTC', cur: 1, min: 0, max: 20000000, step: 50000, def: 0},
      { k: 'basicPct', l: 'Basic as % of CTC', post: '%', min: 30, max: 60, step: 1, def: 40 },
      { k: 'bonus', l: 'Variable / bonus', cur: 1, min: 0, max: 5000000, step: 25000, def: 0},
      { k: 'nps', l: 'Employer NPS', post: '%', min: 0, max: 14, step: 1, def: 0 },
      { k: 'regime', l: 'Regime', type: 'select', def: 'new', options: [{ v: 'new', l: 'New' }, { v: 'old', l: 'Old' }] }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'ctc') {
      const fixedPay = Math.max(v.ctc - (v.bonus || 0), 0);
      const basic = fixedPay * v.basicPct / 100;
      const pfEmp = Math.min(basic, 1800000) * 0.12;
      const gratuity = basic * 0.0481;
      const nps = basic * (v.nps || 0) / 100;
      const gross = v.ctc - pfEmp - gratuity - nps;
      const t = this.taxOf(gross, v.regime === 'new', v.regime === 'new' ? 0 : Math.min(pfEmp, 150000));
      const ptax = v.ctc > 0 ? 2400 : 0;
      const inHand = gross - t.total - pfEmp - ptax;
      const effRate = gross > 0 ? t.total / gross : 0;
      const bonusNet = (v.bonus || 0) * (1 - effRate);
      const monthlyInHand = Math.max(inHand - bonusNet, 0) / 12;
      return {
        hero: { l: 'Monthly take-home', v: f(monthlyInHand), sub: this.short(inHand) + ' a year in hand from a ' + this.short(v.ctc) + ' CTC, bonus paid separately' },
        split: { pct: v.ctc ? (inHand / v.ctc) * 100 : 0, aName: 'In hand', a: 'Take home · ' + this.short(inHand), b: 'Tax, PF, gratuity · ' + this.short(v.ctc - inHand) },
        rows: [
          { l: 'Fixed pay (CTC less bonus)', v: f(fixedPay) },
          { l: 'Basic salary', v: f(basic) },
          { l: 'Employer PF + gratuity', v: f(pfEmp + gratuity + nps) },
          { l: 'Gross taxable', v: f(gross) },
          { l: 'Income tax', v: f(t.total) },
          { l: 'Your PF contribution', v: f(pfEmp) },
          { l: 'Professional tax', v: f(ptax) },
          { l: 'Annual bonus, after tax', v: f(bonusNet) },
          { l: 'Annual take-home', v: f(inHand) },
          { l: 'Take-home as % of CTC', v: v.ctc ? ((inHand / v.ctc) * 100).toFixed(1) + '%' : '—' }
        ],
        note: 'Indicative structure: basic at ' + v.basicPct + '% of fixed pay, PF at 12% of basic from both sides, gratuity at 4.81%, professional tax at ₹2,400 a year. The headline monthly figure excludes the ' + this.short(v.bonus) + ' bonus, which is taxed with your salary but paid separately. Your offer letter\'s split will differ.'
      };
    }
    return null;
  }
};
