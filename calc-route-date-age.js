window.__calcRoute = {
  id: 'age', cat: 'basic', slug: 'date-age', kind: 'form',
  F: {
    age: [
      { k: 'from', l: 'From date', type: 'date', def: '' },
      { k: 'to', l: 'To date', type: 'date', def: '', today: 1 }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'age') {
      if (!v.from) {
        return {
          hero: { l: 'Elapsed', v: '—', sub: 'Pick a start date to measure from.' },
          rows: [],
          note: 'Leave the second date empty to measure up to today.'
        };
      }
      const midnight = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
      const parse = (x) => { const dd = x ? new Date(x + 'T00:00:00') : midnight(); return isNaN(dd) ? midnight() : dd; };
      let a = parse(v.from), b = parse(v.to);
      const swapped = b < a;
      if (swapped) { const t = a; a = b; b = t; }
      let yy = b.getFullYear() - a.getFullYear();
      let mm = b.getMonth() - a.getMonth();
      let dd = b.getDate() - a.getDate();
      if (dd < 0) { mm--; dd += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); }
      if (mm < 0) { yy--; mm += 12; }
      const days = Math.round((b - a) / 86400000);
      const next = new Date(b.getFullYear(), a.getMonth(), a.getDate());
      if (next < b) next.setFullYear(b.getFullYear() + 1);
      const toNext = Math.round((next - b) / 86400000);
      const wd = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][a.getDay()];
      return {
        hero: { l: 'Elapsed', v: yy + ' yr ' + mm + ' mo ' + dd + ' d', sub: this.num(days) + ' days between ' + a.toDateString().slice(4) + ' and ' + b.toDateString().slice(4) },
        rows: [
          { l: 'Total months', v: this.num(yy * 12 + mm) },
          { l: 'Total weeks', v: this.num(Math.floor(days / 7)) },
          { l: 'Total days', v: this.num(days) },
          { l: 'Total hours', v: this.num(days * 24) },
          { l: 'Start day of week', v: wd },
          { l: 'Next anniversary', v: toNext === 0 ? 'today' : 'in ' + this.num(toNext) + ' days' }
        ],
        note: v.to ? '' : 'Leave the second date empty to measure up to today.'
      };
    }
    return null;
  }
};
