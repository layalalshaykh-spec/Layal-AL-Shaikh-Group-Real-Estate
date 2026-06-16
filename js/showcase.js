/* =====================================================
   LAYAL ALSHAIKH — Featured Showcase
   Big image + title overlay; click a thumbnail to switch
   (crossfade dip + gentle autoplay). Reusable on any page.
   Markup:
   <div data-showcase data-autoplay="5200">
     <div class="showcase-stage">
       <div class="sc-bg"></div><div class="sc-veil"></div>
       <div class="sc-info"><span class="sc-tag"></span><h3 class="sc-name"></h3>
         <p class="sc-desc"></p><div class="sc-meta"></div><a class="sc-cta"></a></div>
     </div>
     <div class="showcase-rail">
       <button class="sc-thumb" data-img data-name data-tag data-desc data-meta [data-link]></button> …
     </div>
   </div>
   ===================================================== */
(function () {
  const init = () => document.querySelectorAll('[data-showcase]').forEach(build);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  function build(sc) {
    const thumbs = Array.from(sc.querySelectorAll('.sc-thumb'));
    if (thumbs.length < 2) return;
    const stage = sc.querySelector('.showcase-stage');
    const bg = sc.querySelector('.sc-bg');
    const tag = sc.querySelector('.sc-tag'), name = sc.querySelector('.sc-name');
    const desc = sc.querySelector('.sc-desc'), meta = sc.querySelector('.sc-meta'), cta = sc.querySelector('.sc-cta');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // preload the large stage images so switches are instant
    thumbs.forEach(t => { if (t.dataset.img) { const im = new Image(); im.src = t.dataset.img; } });

    let active = -1, timer = null, first = true;

    function apply(t) {
      if (bg && t.dataset.img) bg.style.backgroundImage = "url('" + t.dataset.img + "')";
      if (tag) { tag.textContent = t.dataset.tag || ''; tag.style.display = t.dataset.tag ? '' : 'none'; }
      if (name) name.textContent = t.dataset.name || '';
      if (desc) desc.textContent = t.dataset.desc || '';
      if (meta) meta.textContent = t.dataset.meta || '';
      if (cta && t.dataset.link) cta.href = t.dataset.link;
    }
    function show(i) {
      i = ((i % thumbs.length) + thumbs.length) % thumbs.length;
      if (i === active) return;
      active = i;
      const t = thumbs[i];
      thumbs.forEach(x => { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
      t.classList.add('active'); t.setAttribute('aria-selected', 'true');
      if (first || reduce) { first = false; apply(t); return; }
      stage.classList.add('switching');
      setTimeout(() => { apply(t); requestAnimationFrame(() => stage.classList.remove('switching')); }, 300);
    }

    thumbs.forEach((t, i) => t.addEventListener('click', () => { show(i); restart(); }));
    if (!sc.hasAttribute('tabindex')) sc.tabIndex = 0;
    sc.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(active - 1); restart(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); show(active + 1); restart(); }
    });

    const ms = parseInt(sc.getAttribute('data-autoplay') || '0', 10);
    const start = () => { if (ms && !reduce && !timer) timer = setInterval(() => show(active + 1), ms); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const restart = () => { stop(); start(); };
    sc.addEventListener('mouseenter', stop);
    sc.addEventListener('mouseleave', start);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => es[0].isIntersecting ? start() : stop(), { threshold: 0.25 }).observe(sc);
    }

    show(0);
    start();
  }
})();
