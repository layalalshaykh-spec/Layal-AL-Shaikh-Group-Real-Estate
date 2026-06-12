/* =====================================================
   LAYAL ALSHAIKH — Motion enhancements (motion.dev)
   Purely additive: scroll progress, parallax, stagger.
   Never changes colours / layout / theme.
   ===================================================== */
import { animate, scroll, inView, stagger } from 'https://cdn.jsdelivr.net/npm/motion@12.40.0/+esm';

try {
  /* 1 — Slim gold scroll-progress bar */
  const bar = document.createElement('div');
  bar.className = 'm-progress';
  document.body.appendChild(bar);
  scroll(animate(bar, { scaleX: [0, 1] }, { ease: 'linear' }));

  /* 2 — Parallax drift on the big faint section numbers */
  document.querySelectorAll('.section-num').forEach((el) => {
    scroll(
      animate(el, { y: [70, -70] }, { ease: 'linear' }),
      { target: el, offset: ['start end', 'end start'] }
    );
  });

  /* 3 — Staggered reveal for the Popular Residences carousel cards */
  const cards = document.querySelectorAll('.pr-card:not(.deck-card)');
  if (cards.length) {
    cards.forEach((c) => { c.style.opacity = '0'; });
    inView('.popres-track', () => {
      animate(
        cards,
        { opacity: 1, y: [44, 0] },
        { delay: stagger(0.08), duration: 0.7, ease: [0.16, 1, 0.3, 1] }
      );
    }, { amount: 0.15 });
  }

  /* 4 — Gentle pop-in for the feature/insight/care cards as they enter */
  const pop = document.querySelectorAll('.ins-card, .care-item:not(.deck-card), .af-item');
  pop.forEach((el) => {
    inView(el, () => {
      animate(el, { scale: [0.96, 1], opacity: [0.35, 1] }, { duration: 0.6, ease: [0.16, 1, 0.3, 1] });
    }, { amount: 0.3 });
  });
} catch (e) {
  /* Motion failed to load — page still works with its CSS animations */
}
