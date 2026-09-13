/* Hidden splash. Fires on "21 + 26 =" in the Simple Calculator, or five taps
   on the header mark within 3s. Auto-fades after 3s; click or Esc closes early. */
(function () {
  var CSS = '#calc-egg{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:var(--bg,#fcfcfd);animation:eggIn .22s ease-out both}'
    + '#calc-egg.out{animation:eggOut .45s ease-in both}'
    + '#calc-egg .stage{display:flex;flex-direction:column;align-items:center;gap:26px}'
    + '#calc-egg .key{width:128px;height:128px;border-radius:26px;background:var(--accent,#4f57c9);color:var(--accent-ink,#fff);display:grid;place-items:center;font-family:"JetBrains Mono",ui-monospace,monospace;font-size:52px;font-weight:500;line-height:1;box-shadow:0 1px 0 rgba(255,255,255,.18) inset,0 10px 26px -12px rgba(0,0,0,.35);animation:eggPress .5s cubic-bezier(.2,.9,.2,1) both}'
    + '#calc-egg .meta{display:flex;flex-direction:column;align-items:center;gap:7px;animation:eggFade .6s .2s both}'
    + '#calc-egg .name{margin:0;font-size:17px;font-weight:600;letter-spacing:-.02em;color:var(--text,#14161a)}'
    + '#calc-egg .sub{margin:0;display:flex;align-items:center;gap:7px;font-family:"JetBrains Mono",ui-monospace,monospace;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted,#676b74)}'
    + '#calc-egg .heart{display:block;fill:var(--accent,#4f57c9)}'
    + '@keyframes eggIn{from{opacity:0}to{opacity:1}}@keyframes eggOut{from{opacity:1}to{opacity:0}}'
    + '@keyframes eggPress{0%{opacity:0;transform:scale(.88) translateY(8px)}55%{transform:scale(1.015) translateY(0)}100%{opacity:1;transform:none}}'
    + '@keyframes eggFade{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}'
    + '@media (prefers-reduced-motion:reduce){#calc-egg,#calc-egg .key,#calc-egg .meta{animation:none}}';
  var live = null;
  function close() {
    if (!live) return;
    var el = live; live = null;
    el.classList.add('out');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 460);
  }
  function show() {
    if (live) return;
    /* a previous splash may still be mid-fade — drop it at once so the two never stack */
    var stale = document.getElementById('calc-egg');
    if (stale && stale.parentNode) stale.parentNode.removeChild(stale);
    if (!document.getElementById('calc-egg-css')) {
      var st = document.createElement('style');
      st.id = 'calc-egg-css';
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    var el = document.createElement('div');
    el.id = 'calc-egg';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Built by Jay');
    el.innerHTML = '<div class="stage"><div class="key">\u2211</div>'
      + '<div class="meta"><p class="name">Jay</p><p class="sub"><svg class="heart" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.7c-.38 0-.75-.14-1.04-.4C6.45 16.3 3.2 13.4 3.2 9.75 3.2 7.1 5.3 5 7.85 5c1.66 0 3.2.88 4.15 2.28C12.95 5.88 14.5 5 16.15 5 18.7 5 20.8 7.1 20.8 9.75c0 3.65-3.25 6.55-7.76 10.55-.29.26-.66.4-1.04.4z"/></svg>indie dev</p></div></div>';
    el.addEventListener('click', close);
    document.body.appendChild(el);
    live = el;
    setTimeout(close, 3000);
  }
  window.__calcEgg = show;
  var KEY = 'calcdrawer.taps', navTimer = null;
  function readTaps() {
    try { return JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }
  function writeTaps(a) {
    try { a.length ? sessionStorage.setItem(KEY, JSON.stringify(a)) : sessionStorage.removeItem(KEY); } catch (e) {}
  }
  /* a run whose fifth tap coincided with the navigation it triggered */
  (function () {
    var now = Date.now();
    var taps = readTaps().filter(function (x) { return now - x <= 3000; });
    if (taps.length >= 5) { writeTaps([]); show(); }
    else writeTaps(taps);
  })();
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  /* five taps on the header mark, within three seconds */
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var mark = t.closest('.mark');
    if (!mark) return;
    /* leave modified and non-primary clicks alone so open-in-new-tab still works */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button != null && e.button !== 0)) return;
    /* A lone click must still go home, but navigating on tap 1 would stop taps ever
       accumulating — so hold navigation briefly and cancel it if more taps arrive. */
    e.preventDefault();
    var link = mark.closest('a');
    var href = link && link.getAttribute('href');
    var now = Date.now();
    var taps = readTaps().filter(function (x) { return now - x <= 3000; });
    taps.push(now);
    if (navTimer) { clearTimeout(navTimer); navTimer = null; }
    if (taps.length >= 5) { writeTaps([]); show(); return; }
    writeTaps(taps);
    if (href) navTimer = setTimeout(function () { navTimer = null; location.href = href; }, 400);
  });
})();
