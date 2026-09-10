window.__calcRoute = {
  id: 'unit', cat: 'basic', slug: 'unit-converter', kind: 'form',
  UNITS: {
    Length: { base: 'm', u: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 } },
    Mass: { base: 'kg', u: { kg: 1, g: 0.001, mg: 1e-6, t: 1000, lb: 0.45359237, oz: 0.028349523125 } },
    Volume: { base: 'L', u: { L: 1, mL: 0.001, 'm³': 1000, gal: 3.785411784, qt: 0.946352946, cup: 0.2365882365, 'fl oz': 0.0295735295625 } },
    Area: { base: 'm²', u: { 'm²': 1, 'km²': 1e6, 'ft²': 0.09290304, 'yd²': 0.83612736, acre: 4046.8564224, ha: 10000 } },
    Speed: { base: 'm/s', u: { 'm/s': 1, 'km/h': 0.2777777778, mph: 0.44704, kn: 0.5144444444 } },
    Data: { base: 'MB', u: { B: 1e-6, KB: 0.001, MB: 1, GB: 1000, TB: 1e6 } },
    Temperature: { base: '°C', u: { '°C': 1, '°F': 1, K: 1 } }
  },
  F: {
    unit: function (v) {
      const cat = this.constructor.UNITS[v.cat] ? v.cat : 'Length';
      const names = Object.keys(this.constructor.UNITS[cat].u);
      const isTemp = cat === 'Temperature';
      const opts = names.map((n) => ({ v: n, l: n }));
      return [
        { k: 'cat', l: 'Quantity', type: 'menu', def: 'Length', options: Object.keys(this.constructor.UNITS).map((n) => ({ v: n, l: n })) },
        { k: 'value', l: 'Value', min: isTemp ? -459.67 : 0, max: 1000000, step: 1, def: 0, noSlider: 1 },
        { k: 'from', l: 'From', type: 'menu', def: names[0], options: opts },
        { k: 'to', l: 'To', type: 'menu', def: names[1] || names[0], options: opts }
      ];
    },
  },
  compute: function (id, v, f) {
    if (id === 'unit') {
      const cat = this.constructor.UNITS[v.cat] ? v.cat : 'Length';
      const set = this.constructor.UNITS[cat], names = Object.keys(set.u);
      const from = names.indexOf(v.from) >= 0 ? v.from : names[0];
      const to = names.indexOf(v.to) >= 0 ? v.to : (names[1] || names[0]);
      const temp = cat === 'Temperature';
      const toC = (x, u) => u === '°C' ? x : u === '°F' ? (x - 32) * 5 / 9 : x - 273.15;
      const fromC = (c, u) => u === '°C' ? c : u === '°F' ? c * 9 / 5 + 32 : c + 273.15;
      const conv = (x, a, b) => temp ? fromC(toC(x, a), b) : (x * set.u[a]) / set.u[b];
      const out = conv(v.value, from, to);
      const d = (x) => this.num(x, 6);
      return {
        hero: { l: this.num(v.value, 6) + ' ' + from + ' equals', v: d(out) + ' ' + to, sub: '1 ' + from + ' = ' + d(conv(1, from, to)) + ' ' + to + (temp ? '' : ' · 1 ' + to + ' = ' + d(conv(1, to, from)) + ' ' + from) },
        rows: names.map((n) => ({ l: n, v: d(conv(v.value, from, n)) })),
        note: temp
          ? 'Temperature scales are offset, not proportional, so ratios between them are not meaningful.'
          : 'All conversions run through the ' + set.base + ' base unit.' + (cat === 'Data' ? ' Data units are decimal (SI): 1 GB = 1,000 MB, not 1,024.' : '')
      };
    }
    return null;
  }
};
