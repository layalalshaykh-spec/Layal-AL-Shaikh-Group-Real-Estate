/* =====================================================
   LAYAL ALSHAIKH — Reusable 3D coverflow "deck" carousel
   A center card sits in focus; neighbours recede in 3D.
   Arrows, dots, drag/swipe, keyboard, gentle autoplay.

   Markup:
     <div class="deck" data-deck="NAME" data-autoplay="5600">
       <div class="deck-stage">
         <el class="deck-card">…</el> …
       </div>
       <div class="deck-dots" data-deck-dots="NAME"></div>   (optional)
     </div>
   Arrows may live anywhere on the page:
     <button data-deck-prev="NAME">   <button data-deck-next="NAME">
   ===================================================== */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const init = () => document.querySelectorAll('[data-deck]').forEach(build);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  function build(deck) {
    const name = deck.getAttribute('data-deck');
    const stage = deck.querySelector('.deck-stage');
    if (!stage) return;
    const cards = Array.from(stage.querySelectorAll('.deck-card'));
    const n = cards.length;
    if (n < 2) return;
    let active = 0;

    // ---- dots ----
    const dotsWrap = deck.querySelector('.deck-dots') ||
                     document.querySelector('[data-deck-dots="' + name + '"]');
    const dots = [];
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      cards.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'deck-dot';
        b.setAttribute('aria-label', 'Show item ' + (i + 1));
        b.addEventListener('click', () => go(i, true));
        dotsWrap.appendChild(b); dots.push(b);
      });
    }

    // ---- arrows (referenced by name, may sit outside the deck) ----
    document.querySelectorAll('[data-deck-prev="' + name + '"]').forEach(b =>
      b.addEventListener('click', () => go(active - 1, true)));
    document.querySelectorAll('[data-deck-next="' + name + '"]').forEach(b =>
      b.addEventListener('click', () => go(active + 1, true)));

    // ---- click a side card to bring it to the front ----
    cards.forEach((card, i) => {
      card.addEventListener('click', (e) => {
        if (i !== active) { e.preventDefault(); go(i, true); }
      });
    });

    // ---- keyboard ----
    if (!deck.hasAttribute('tabindex')) deck.tabIndex = 0;
    deck.setAttribute('role', 'group');
    deck.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1, true); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1, true); }
    });

    // ---- drag / swipe ----
    let downX = null, moved = false;
    stage.addEventListener('pointerdown', (e) => { downX = e.clientX; moved = false; pause(); });
    window.addEventListener('pointermove', (e) => {
      if (downX !== null && Math.abs(e.clientX - downX) > 8) moved = true;
    }, { passive: true });
    window.addEventListener('pointerup', (e) => {
      if (downX === null) return;
      const dx = e.clientX - downX; downX = null;
      if (Math.abs(dx) > 42) go(active + (dx < 0 ? 1 : -1), true);
      resume();
    });
    window.addEventListener('pointercancel', () => { downX = null; resume(); });
    // swallow the click that follows a real drag so links don't fire
    stage.addEventListener('click', (e) => {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);

    const mod = (i) => ((i % n) + n) % n;
    function go(i, user) { active = mod(i); render(); paintDots(); if (user) resume(); }
    function paintDots() { dots.forEach((d, i) => d.classList.toggle('active', i === active)); }

    function render() {
      for (let i = 0; i < n; i++) {
        const card = cards[i];
        let off = i - active;
        if (off > n / 2) off -= n; else if (off < -n / 2) off += n;
        const ax = Math.abs(off), dir = Math.sign(off);
        card.classList.toggle('is-active', off === 0);
        card.setAttribute('aria-hidden', off === 0 ? 'false' : 'true');
        if (ax > 2) {                                   // parked far off-stage
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          card.style.zIndex = '0';
          card.style.transform = 'translateX(calc(-50% + ' + (dir * 160) + '%)) scale(.55)';
        } else {
          card.style.opacity = ax === 0 ? '1' : (ax === 1 ? '0.62' : '0.26');
          card.style.pointerEvents = 'auto';
          card.style.zIndex = String(30 - ax * 10);
          const tx = off * 58, sc = 1 - ax * 0.16, ry = -dir * 16, tz = -ax * 150;
          card.style.transform =
            'translateX(calc(-50% + ' + tx + '%)) translateZ(' + tz + 'px) rotateY(' + ry + 'deg) scale(' + sc + ')';
        }
      }
    }

    // ---- gentle autoplay (pauses on hover / focus / drag / off-screen) ----
    const ms = parseInt(deck.getAttribute('data-autoplay') || '0', 10);
    let timer = null;
    const start = () => { if (ms && !reduce && !timer) timer = setInterval(() => go(active + 1, false), ms); };
    const pause = () => { if (timer) { clearInterval(timer); timer = null; } };
    const resume = () => { pause(); start(); };
    deck.addEventListener('mouseenter', pause);
    deck.addEventListener('mouseleave', resume);
    deck.addEventListener('focusin', pause);
    deck.addEventListener('focusout', resume);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((ents) => {
        ents.forEach(en => en.isIntersecting ? resume() : pause());
      }, { threshold: 0.2 }).observe(deck);
    }

    render(); paintDots(); start();
  }
})();
