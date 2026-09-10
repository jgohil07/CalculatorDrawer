window.__calcRoute = {
  id: 'bmi', cat: 'basic', slug: 'bmi', kind: 'form',
  F: {
    bmi: function (v) {
      const imp = v.sys === 'imp';
      return [
        { k: 'sys', l: 'Units', type: 'select', def: 'met', options: [{ v: 'met', l: 'Metric' }, { v: 'imp', l: 'Imperial' }] },
        imp ? { k: 'hIn', l: 'Height', post: 'in', min: 48, max: 84, step: 0.5, def: 68 } : { k: 'hCm', l: 'Height', post: 'cm', min: 120, max: 215, step: 1, def: 172 },
        imp ? { k: 'wLb', req: 1, l: 'Weight', post: 'lb', min: 0, max: 400, step: 1, def: 0} : { k: 'wKg', req: 1, l: 'Weight', post: 'kg', min: 0, max: 200, step: 0.5, def: 0}
      ];
    },
  },
  compute: function (id, v, f) {
    if (id === 'bmi') {
      const imp = v.sys === 'imp';
      const hM = imp ? v.hIn * 0.0254 : v.hCm / 100;
      const kg = imp ? v.wLb * 0.45359237 : v.wKg;
      const bmi = kg / (hM * hM);
      const band = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy weight' : bmi < 30 ? 'Overweight' : 'Obese';
      const lo = 18.5 * hM * hM, hi = 24.9 * hM * hM;
      const w = (x) => imp ? this.num(x / 0.45359237, 1) + ' lb' : this.num(x, 1) + ' kg';
      const pct = Math.max(0, Math.min(100, ((bmi - 15) / 25) * 100));
      return {
        hero: { l: 'Body mass index', v: isFinite(bmi) ? bmi.toFixed(1) : '—', sub: band + ' · healthy range for this height is ' + w(lo) + ' to ' + w(hi) },
        split: { pct: pct, aName: 'Of scale', a: 'BMI 15–40 scale position', b: 'Remaining' },
        rows: [
          { l: 'Category', v: band },
          { l: 'Healthy weight range', v: w(lo) + ' – ' + w(hi) },
          { l: 'Distance from range', v: kg < lo ? '−' + w(lo - kg) : kg > hi ? '+' + w(kg - hi) : 'within range' },
          { l: 'BMI prime', v: isFinite(bmi) ? (bmi / 25).toFixed(2) : '—' }
        ],
        note: 'BMI ignores build, muscle mass and age — useful as a population screen, not a diagnosis.'
      };
    }
    return null;
  }
};
