/* =====================================================
   LAYAL ALSHAIKH — Shared Layout (nav + footer)
   Injected on every page so the design stays identical.
   ===================================================== */
(function () {
  // Normalise so it works with or without the .html extension (clean URLs)
  const norm = s => (s || '').toLowerCase().replace(/\.html$/, '') || 'index';
  const page = norm(location.pathname.split('/').pop());

  const links = [
    { href: 'index.html',      label: 'Home' },
    { href: 'properties.html', label: 'Properties' },
    { href: 'gallery.html',    label: 'Gallery' },
    { href: 'about.html',      label: 'About' },
    { href: 'contact.html',    label: 'Contact' }
  ];

  const navLinks = links.map(l => {
    const active = (norm(l.href) === page) ? ' class="active"' : '';
    return `<li><a href="${l.href}"${active}>${l.label}</a></li>`;
  }).join('');

  const NAV = `
  <nav class="navbar" id="navbar">
    <div class="nav-container">
      <a href="index.html" class="nav-logo">
        <div class="logo-mark">LA</div>
        <div class="logo-text-group">
          <span class="logo-main">LAYAL <span class="gold-text">ALSHAIKH</span></span>
          <span class="logo-sub">GROUP · QATAR</span>
        </div>
      </a>
      <ul class="nav-links" id="navLinks">${navLinks}</ul>
      <div class="nav-cta">
        <button class="theme-toggle" id="themeToggle" role="switch" aria-label="Toggle dark and light mode">
          <span class="tt-label tt-dark">Dark</span>
          <span class="tt-label tt-light">Light</span>
          <span class="tt-knob">
            <svg class="ic-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg class="ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4l1.4-1.4M18 6l1.4-1.4"/></svg>
          </span>
        </button>
      </div>
      <button class="hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
    <div class="nav-gold-line"></div>
  </nav>`;

  const FOOTER = `
  <footer class="footer">
    <div class="footer-gold-line"></div>
    <div class="footer-main">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="fb-logo">
              <span class="fb-name">LAYAL <span class="gold-text">ALSHAIKH</span></span>
              <span class="fb-sub">GROUP · QATAR</span>
            </div>
            <p>Qatar's premier one-stop destination for luxury real estate advisory and comprehensive business setup solutions.</p>
            <div class="fb-contact">
              <a href="mailto:info@layalgroup.com">info@layalgroup.com</a>
              <a href="tel:+97412345678">+974 1234 5678</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><a href="properties.html">All Properties</a></li>
              <li><a href="gallery.html">Photo Gallery</a></li>
              <li><a href="about.html">About Us</a></li>
              <li><a href="contact.html">Contact</a></li>
              <li><a href="admin.html">Admin Portal</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Business Setup</h4>
            <ul>
              <li><a href="about.html">Company Registration</a></li>
              <li><a href="about.html">PRO Services</a></li>
              <li><a href="about.html">Visa & Residency</a></li>
              <li><a href="about.html">Legal Structuring</a></li>
              <li><a href="about.html">Tax & Accounting</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Locations</h4>
            <ul>
              <li><a href="properties.html">The Pearl Qatar</a></li>
              <li><a href="properties.html">Lusail City</a></li>
              <li><a href="properties.html">West Bay</a></li>
              <li><a href="properties.html">Msheireb</a></li>
              <li><a href="properties.html">Fox Hills</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>© 2025 Layal Alshaikh Group · Qatar Real Estate Regulatory Authority Licensed · All rights reserved</p>
        <div class="footer-links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a></div>
      </div>
    </div>
  </footer>`;

  const WA = `
  <a href="https://wa.me/97412345678" class="wa-float" aria-label="Chat on WhatsApp" target="_blank" rel="noopener">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
  </a>`;

  // ---- Inject ----
  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');
  if (headerSlot) headerSlot.outerHTML = NAV;
  if (footerSlot) footerSlot.outerHTML = FOOTER + WA;

  // ---- Theme: apply saved on load (toggle handled by js/theme.js) ----
  try { if (localStorage.getItem('theme') === 'light') document.documentElement.classList.add('light'); } catch (e) {}

  // ---- Navbar scroll state ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Mobile menu ----
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navLinks');
  if (hamburger && navMenu) {
    const navbarEl = document.getElementById('navbar') || document.querySelector('.navbar');
    const setMenu = (open) => {
      hamburger.classList.toggle('open', open);
      navMenu.classList.toggle('open', open);
      document.body.classList.toggle('nav-open', open);   // scroll-lock + scrim
    };
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      setMenu(!navMenu.classList.contains('open'));
    });
    navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('click', (e) => {            // tap the scrim / outside = close
      if (navMenu.classList.contains('open') && navbarEl && !navbarEl.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  }

  // ---- Reveal on scroll ----
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add('visible'); revObs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal-fade, .pcard').forEach(el => revObs.observe(el));
  // Safety net: reveal anything scrolled fully past the top edge (instant jumps / Ctrl+End)
  let _rRaf;
  addEventListener('scroll', () => {
    if (_rRaf) return;
    _rRaf = requestAnimationFrame(() => {
      _rRaf = null;
      document.querySelectorAll('.reveal-fade:not(.visible), .pcard:not(.visible)').forEach(el => {
        if (el.getBoundingClientRect().bottom < 0) el.classList.add('visible');
      });
    });
  }, { passive: true });

  // ---- Counters ----
  function animCount(el, target, dur = 2000) {
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 4)) * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step); else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
  }
  const cObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animCount(e.target, parseInt(e.target.dataset.count, 10)); cObs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => cObs.observe(el));
})();
