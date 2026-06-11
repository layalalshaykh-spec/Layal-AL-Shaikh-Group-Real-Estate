/* =====================================================
   LAYAL ALSHAIKH — House cursor
   A little house follows the pointer with a warm glow
   "spotlight" that highlights interactive areas and
   reacts when you click. Desktop / fine-pointer only.
   ===================================================== */
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const root = document.documentElement;
  root.classList.add('cursor-on');

  // ---- elements ----
  const glow = document.createElement('div');
  glow.className = 'hcursor-glow';
  const house = document.createElement('div');
  house.className = 'hcursor-house';
  house.innerHTML =
    '<svg viewBox="0 0 32 32" aria-hidden="true">' +
      '<path class="hc-body" d="M4.8 14.6 16 4.3 27.2 14.6 27.2 27.4 4.8 27.4 Z"/>' +
      '<rect class="hc-door" x="13" y="20" width="6" height="7.4" rx="0.5"/>' +
      '<rect class="hc-win" x="8.4" y="16" width="3.1" height="3.1" rx="0.3"/>' +
      '<rect class="hc-win" x="20.5" y="16" width="3.1" height="3.1" rx="0.3"/>' +
    '</svg>';
  document.body.append(glow, house);

  // ---- state ----
  let mx = -100, my = -100, gx = -100, gy = -100;
  let hs = 0, gs = 0;          // current scales (start small, grow in)
  let hsT = 1, gsT = 1;        // target scales
  let shown = false;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (!shown) { shown = true; glow.style.opacity = '1'; house.style.opacity = '1'; }
  }, { passive: true });

  // elements that should "highlight"
  const INTERACTIVE = [
    'a', 'button', 'input', 'select', 'textarea', 'label', '[role="button"]', '[data-cursor]',
    '.hdot', '.stab', '.ptab', '.hsg-tab', '.hl-cat', '.hl-explore', '.hl-scroll',
    '.popres-arrow', '.gal-item', '.gal-filter', '.pcard', '.pr-card', '.ptype-card',
    '.hood-card', '.theme-toggle', '.hamburger', '.abtn'
  ].join(',');

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest && e.target.closest(INTERACTIVE)) {
      root.classList.add('cursor-hover'); hsT = 1.3; gsT = 1.85;
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest && e.target.closest(INTERACTIVE)) {
      root.classList.remove('cursor-hover'); hsT = 1; gsT = 1;
    }
  });
  document.addEventListener('mousedown', () => root.classList.add('cursor-down'));
  document.addEventListener('mouseup', () => root.classList.remove('cursor-down'));
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; house.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { if (shown) { glow.style.opacity = '1'; house.style.opacity = '1'; } });

  // ---- render loop ----
  (function loop() {
    gx += (mx - gx) * 0.2; gy += (my - gy) * 0.2;
    const down = root.classList.contains('cursor-down');
    const hT = down ? hsT * 0.78 : hsT;     // press = squash the house
    const gT = down ? gsT * 1.25 : gsT;     // press = flare the glow
    hs += (hT - hs) * 0.22;
    gs += (gT - gs) * 0.22;
    house.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -52%) scale(${hs})`;
    glow.style.transform  = `translate(${gx}px, ${gy}px) translate(-50%, -50%) scale(${gs})`;
    requestAnimationFrame(loop);
  })();
})();
