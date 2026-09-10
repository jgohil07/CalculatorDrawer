window.__calcRoute = {
  id: 'fuel', cat: 'basic', slug: 'fuel-cost', kind: 'form',
  F: {
    fuel: [
      { k: 'dist', req: 1, l: 'Distance one way', post: 'km', min: 0, max: 2000, step: 1, def: 0},
      { k: 'eff', l: 'Efficiency', post: 'km/L', min: 2, max: 40, step: 0.5, def: 15 },
      { k: 'price', l: 'Fuel price / L', cur: 1, min: 10, max: 400, step: 1, def: 105, u: { min: 0.5, max: 12, step: 0.05, def: 3.4 } },
      { k: 'trips', l: 'Round trips / month', min: 0, max: 60, step: 1, def: 22 }
    ],
  },
  compute: function (id, v, f) {
    if (id === 'fuel') {
      const perTrip = (v.dist * 2 / Math.max(v.eff, 0.1)) * v.price;
      const perKm = v.price / Math.max(v.eff, 0.1);
      const monthly = perTrip * v.trips;
      return {
        hero: { l: 'Monthly fuel cost', v: f(monthly), sub: f(perTrip) + ' per round trip of ' + this.num(v.dist * 2) + ' km' },
        rows: [
          { l: 'Cost per km', v: f(perKm, 2) },
          { l: 'Cost per round trip', v: f(perTrip) },
          { l: 'Fuel per round trip', v: this.num(v.dist * 2 / Math.max(v.eff, 0.1), 2) + ' L' },
          { l: 'Monthly fuel used', v: this.num((v.dist * 2 / Math.max(v.eff, 0.1)) * v.trips, 1) + ' L' },
          { l: 'Annual cost', v: f(monthly * 12) }
        ]
      };
    }
    return null;
  }
};
