window.__calcRoute = {
  id: 'fdrd', cat: 'invest', slug: 'fd-rd', kind: 'form',
  F: {
    fdrd: function (v) {
      const rd = v.kind === 'rd';
      return [
        { k: 'kind', l: 'Deposit type', type: 'select', def: 'fd', options: [{ v: 'fd', l: 'Fixed' }, { v: 'rd', l: 'Recurring' }] },
        rd
          ? { k: 'monthly', l: 'Monthly deposit', cur: 1, min: 0, max: 500000, step: 500, def: 0, u: { min: 0, max: 20000, step: 25, def: 0} }
          : { k: 'p', l: 'Deposit amount', cur: 1, min: 0, max: 20000000, step: 10000, def: 0, u: { min: 0, max: 2000000, step: 500, def: 0} },
        { k: 'r', l: 'Interest rate', post: '%', min: 1, max: 15, step: 0.05, def: 7.1 },
        { k: 'y', l: 'Tenure', post: 'yr', min: 1, max: 20, step: 1, def: 5 },
        { k: 'slab', l: 'Your tax slab', post: '%', min: 0, max: 42, step: 5, def: 30 }
      ];
    },
  },
  compute: function (id, v, f) {
    if (id === 'fdrd') {
      const rd = v.kind === 'rd', n = 4, i = v.r / 100 / n, q = n * v.y;
      let bal, invested;
      const rows = [];
      if (rd) {
        const mi = Math.pow(1 + i, 1 / 3) - 1;
        bal = 0; invested = 0;
        for (let y = 1; y <= v.y && y <= 40; y++) {
          for (let m = 0; m < 12; m++) { bal = (bal + v.monthly) * (1 + mi); invested += v.monthly; }
          rows.push({ label: 'Yr ' + y, a: invested, b: Math.max(bal - invested, 0), bal: bal });
        }
      } else {
        invested = v.p;
        bal = v.p * Math.pow(1 + i, q);
        for (let y = 1; y <= v.y && y <= 40; y++) {
          const b = v.p * Math.pow(1 + i, n * y);
          rows.push({ label: 'Yr ' + y, a: v.p, b: b - v.p, bal: b });
        }
      }
      const interest = bal - invested;
      const tax = interest * v.slab / 100;
      const net = bal - tax;
      /* An RD is a stream, not a lumpsum, so its effective rate is an IRR rather than a CAGR. */
      let postRate = 0;
      if (invested > 0 && v.y > 0) {
        if (rd) {
          const fvAt = (annual) => {
            const mi = Math.pow(1 + annual / 100, 1 / 12) - 1;
            let b = 0;
            for (let k = 0; k < 12 * v.y; k++) b = (b + v.monthly) * (1 + mi);
            return b;
          };
          let lo = 0, hi = 40;
          for (let k = 0; k < 48; k++) { const mid = (lo + hi) / 2; if (fvAt(mid) < net) lo = mid; else hi = mid; }
          postRate = (lo + hi) / 2;
        } else {
          postRate = (Math.pow(net / invested, 1 / v.y) - 1) * 100;
        }
        if (!isFinite(postRate)) postRate = 0;
      }
      return {
        hero: { l: 'Maturity value', v: f(bal), sub: (rd ? 'Recurring deposit' : 'Fixed deposit') + ' compounded quarterly — ' + this.short(interest) + ' of interest' },
        split: { pct: bal ? (invested / bal) * 100 : 0, aName: 'Deposited', a: 'Deposited · ' + this.short(invested), b: 'Interest · ' + this.short(interest) },
        rows: [
          { l: 'Total deposited', v: f(invested) },
          { l: 'Interest earned', v: f(interest) },
          { l: 'Maturity value', v: f(bal) },
          { l: 'Tax at ' + v.slab + '% slab', v: f(tax) },
          { l: 'Post-tax maturity', v: f(bal - tax) },
          { l: 'Post-tax effective rate', v: postRate.toFixed(2) + '%' }
        ],
        chart: { title: 'Balance by year', hint: 'deposits vs interest', rows: this.chart(rows, (r) => this.short(r.bal)) },
        note: 'Deposit interest is taxed at your slab every year, which is why the post-tax rate is well below the headline one.'
      };
    }
    return null;
  }
};
