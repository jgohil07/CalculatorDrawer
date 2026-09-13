/* Warm every calculator's route chunk once the page is idle.

   Each calculator is its own document, so the first visit to one costs its HTML
   plus a 1-3 KB route chunk that is only discovered after the HTML parses. The
   whole set is 62 KB, small enough to fetch once and never pay for again — so
   the fifth calculator you open is as quick as the second.

   Skipped on save-data and slow connections. Prefetch is idle priority, so this
   never competes with the page you are actually looking at. */
(function () {
  var c = navigator.connection;
  if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) return;

  var ROUTES = [
    'calc-route-bmi.js',
    'calc-route-cagr.js',
    'calc-route-capital-gains.js',
    'calc-route-car-loan.js',
    'calc-route-card-payoff.js',
    'calc-route-compound-interest.js',
    'calc-route-date-age.js',
    'calc-route-fd-rd.js',
    'calc-route-fire.js',
    'calc-route-fuel-cost.js',
    'calc-route-goal-sip.js',
    'calc-route-gst.js',
    'calc-route-income-tax.js',
    'calc-route-investment.js',
    'calc-route-loan-emi.js',
    'calc-route-lumpsum-vs-sip.js',
    'calc-route-mortgage.js',
    'calc-route-percentage.js',
    'calc-route-prepayment-impact.js',
    'calc-route-programmer.js',
    'calc-route-real-return.js',
    'calc-route-refinance.js',
    'calc-route-regime-compare.js',
    'calc-route-retirement.js',
    'calc-route-scientific.js',
    'calc-route-simple-interest.js',
    'calc-route-simple.js',
    'calc-route-sip.js',
    'calc-route-statistical.js',
    'calc-route-swp.js',
    'calc-route-take-home-pay.js',
    'calc-route-unit-converter.js'
  ];

  function warm() {
    var head = document.head, here = location.pathname;
    for (var i = 0; i < ROUTES.length; i++) {
      if (here.indexOf(ROUTES[i]) >= 0) continue;          /* this page loads it anyway */
      var l = document.createElement('link');
      l.rel = 'prefetch';
      l.as = 'script';
      l.href = ROUTES[i];
      head.appendChild(l);
    }
  }

  function schedule() {
    if (window.requestIdleCallback) requestIdleCallback(warm, { timeout: 3000 });
    else setTimeout(warm, 1500);
  }
  if (document.readyState === 'complete') schedule();
  else addEventListener('load', schedule);
})();
