/* =====================================================
   LAYAL ALSHAIKH — Theme switch
   Sliding sun/moon toggle + circular "lights on / day
   break" reveal using the View Transitions API.
   Shared across every page.
   ===================================================== */
(function () {
  const root = document.documentElement;

  // apply saved theme early (head script usually does this; this is a safety net)
  try { if (localStorage.getItem('theme') === 'light') root.classList.add('light'); } catch (e) {}

  function setTheme(toLight) {
    root.classList.toggle('light', toLight);
    try { localStorage.setItem('theme', toLight ? 'light' : 'dark'); } catch (e) {}
  }

  function onToggle(e) {
    const toLight = !root.classList.contains('light');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // No View Transitions support (or reduced motion) -> instant switch
    if (!document.startViewTransition || reduce) { setTheme(toLight); return; }

    // origin of the reveal = centre of the toggle
    const btn = e.currentTarget;
    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const endR = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const vt = document.startViewTransition(() => setTheme(toLight));
    vt.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endR}px at ${x}px ${y}px)`] },
        { duration: 680, easing: 'cubic-bezier(.4,0,.2,1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  }

  function bind() {
    const btn = document.getElementById('themeToggle');
    if (btn && !btn.__themeBound) { btn.__themeBound = true; btn.addEventListener('click', onToggle); return true; }
    return false;
  }

  // bind now; if the nav is injected later (layout.js), retry on next tick
  if (!bind()) { setTimeout(bind, 0); window.addEventListener('DOMContentLoaded', bind); }
})();
