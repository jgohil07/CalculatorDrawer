window.__calcRoute = {
  id: 'lumpvssip', cat: 'invest', slug: 'lumpsum-vs-sip', kind: 'form',
  F: {
    lumpvssip: [
      { k: 'total', req: 1, l: 'Total to invest', cur: 1, min: 0, max: 50000000, step: 50000, def: 0, u: { min: 0, max: 2000000, step: 1000, def: 0} },
      { k: 'r', l: 'Expected return', post: '%', min: 1, max: 24, step: 0.5, def: 12 },
      { k: 'y', l: 'Spread over / horizon', post: 'yr', min: 1, max: 30, step: 1, def: 5 }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'lumpvssip') {
      const y = v.y, N = y * 12, i = v.r / 1200;
      const lump = v.total * Math.pow(1 + v.r / 100, y);
      const monthly = v.total / N;
      const sip = i === 0 ? v.total : monthly * ((Math.pow(1 + i, N) - 1) / i) * (1 + i);
      const diff = lump - sip;
      const rows = [];
      for (let k = 1; k <= y && k <= 40; k++) {
        const l = v.total * Math.pow(1 + v.r / 100, k);
        const sN = k * 12;
        const sv = i === 0 ? monthly * sN : monthly * ((Math.pow(1 + i, sN) - 1) / i) * (1 + i);
        rows.push({ label: 'Yr ' + k, a: sv, b: Math.max(l - sv, 0), bal: l });
      }
      return {
        hero: { l: 'Lumpsum ends ahead by', v: f(Math.abs(diff)), sub: 'Lumpsum ' + this.short(lump) + ' vs SIP ' + this.short(sip) + ' on the same ' + this.short(v.total) },
        split: { pct: lump ? (sip / lump) * 100 : 0, aName: 'SIP / lump', a: 'SIP outcome · ' + this.short(sip), b: 'Lumpsum advantage · ' + this.short(Math.max(diff, 0)) },
        rows: [
          { l: 'Invested either way', v: f(v.total) },
          { l: 'Lumpsum value', v: f(lump) },
          { l: 'SIP value (' + f(monthly) + '/mo)', v: f(sip) },
          { l: 'Difference', v: f(diff) },
          { l: 'Lumpsum edge', v: sip ? ((diff / sip) * 100).toFixed(1) + '%' : '—' }
        ],
        chart: { title: 'SIP vs lumpsum by year', hint: 'SIP value and lumpsum lead', rows: this.chart(rows, (r) => this.short(r.bal)) },
        note: 'Lumpsum wins on paper because the whole sum compounds from day one — it also carries the full timing risk, which is the trade the SIP buys away.'
      };
    }
    return null;
  }
};
