/* =====================================================
   LAYAL ALSHAIKH GROUP — Luxury Interactions
   ===================================================== */

// ---- PRELOADER ----
const preloader = document.getElementById('preloader');
const fill = document.getElementById('preloaderFill');
const preloaderText = document.getElementById('preloaderText');
const messages = ['Loading Excellence...', 'Curating Properties...', 'Almost Ready...'];
let prog = 0;
let msgIdx = 0;

document.body.classList.add('loading');

const interval = setInterval(() => {
  prog += Math.random() * 18 + 6;
  if (prog > 100) prog = 100;
  fill.style.width = prog + '%';

  if (prog > 40 && msgIdx === 0) { msgIdx = 1; preloaderText.textContent = messages[1]; }
  if (prog > 75 && msgIdx === 1) { msgIdx = 2; preloaderText.textContent = messages[2]; }

  if (prog >= 100) {
    clearInterval(interval);
    setTimeout(() => {
      preloader.classList.add('done');
      document.body.classList.remove('loading');
      triggerHeroAnimations();
    }, 400);
  }
}, 100);

function triggerHeroAnimations() {
  // hero image scale
  const heroBg = document.querySelector('.hero-img-bg');
  if (heroBg) heroBg.style.transform = 'scale(1)';
  // start counters
  initCounters();
}

// ---- CUSTOM CURSOR ----
const outer = document.getElementById('cursorOuter');
const inner = document.getElementById('cursorInner');
let mx = -100, my = -100, ox = -100, oy = -100;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;
  inner.style.left = mx + 'px';
  inner.style.top  = my + 'px';
});

(function cursorLoop() {
  ox += (mx - ox) * 0.12;
  oy += (my - oy) * 0.12;
  outer.style.left = ox + 'px';
  outer.style.top  = oy + 'px';
  requestAnimationFrame(cursorLoop);
})();

document.querySelectorAll('[data-cursor="btn"], [data-cursor="view"], a, button, select, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    outer.classList.add('hovering');
    inner.classList.add('hovering');
  });
  el.addEventListener('mouseleave', () => {
    outer.classList.remove('hovering');
    inner.classList.remove('hovering');
  });
});

document.addEventListener('mouseleave', () => { outer.style.opacity = '0'; inner.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { outer.style.opacity = '1'; inner.style.opacity = '1'; });

// ---- NAVBAR ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ---- HAMBURGER ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const setMenu = (open) => {
  hamburger.classList.toggle('open', open);
  navLinks.classList.toggle('open', open);
  document.body.classList.toggle('nav-open', open);     // scroll-lock + scrim
};
hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  setMenu(!navLinks.classList.contains('open'));
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', (e) => {                // tap the scrim / outside = close
  if (navLinks.classList.contains('open') && !navbar.contains(e.target)) setMenu(false);
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

// ---- SCROLL REVEAL ----
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // reveal when in view OR already scrolled past (never leave content stuck hidden)
    if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-fade').forEach(el => revealObs.observe(el));

// Safety net: reveal anything scrolled fully past the top edge (covers instant jumps / Ctrl+End)
let _revRaf;
addEventListener('scroll', () => {
  if (_revRaf) return;
  _revRaf = requestAnimationFrame(() => {
    _revRaf = null;
    document.querySelectorAll('.reveal-fade:not(.visible)').forEach(el => {
      if (el.getBoundingClientRect().bottom < 0) el.classList.add('visible');
    });
  });
}, { passive: true });

// Property cards stagger
const pcardObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      pcardObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.pcard').forEach(el => pcardObs.observe(el));

// ---- COUNTER ANIMATION ----
function animCount(el, target, dur = 2200) {
  const start = performance.now();
  const update = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (p < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const cObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const t = parseInt(entry.target.dataset.count, 10);
        animCount(entry.target, t);
        cObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => cObs.observe(el));
}
initCounters();

// ---- MAGNETIC BUTTONS ----
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    setTimeout(() => btn.style.transition = '', 500);
  });
});

// ---- PROPERTY FILTERS ----
document.querySelectorAll('.ptab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.pcard').forEach(card => {
      const type = card.dataset.type;
      const show = filter === 'all' || type === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

// ---- SAVE TOGGLE ----
document.querySelectorAll('.pcard-save').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const saved = btn.dataset.saved === 'true';
    btn.dataset.saved = !saved;
    const svg = btn.querySelector('svg');
    if (!saved) {
      svg.style.fill = '#c0392b';
      svg.style.stroke = '#c0392b';
      btn.style.borderColor = '#c0392b';
    } else {
      svg.style.fill = 'none';
      svg.style.stroke = '';
      btn.style.borderColor = '';
    }
  });
});

// ---- CONTACT FORM ----
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit-form');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<span>✓ Message Received</span>';
      btn.style.background = '#1a6b3a';
      btn.style.color = '#fff';
      form.reset();
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 4000);
    }, 1200);
  });
}

// ---- PARALLAX GLOW ----
window.addEventListener('mousemove', (e) => {
  const glowL = document.querySelector('.hero-glow-l');
  const glowR = document.querySelector('.hero-glow-r');
  if (!glowL || !glowR) return;
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  glowL.style.transform = `translate(${x * 30}px, ${y * 20}px)`;
  glowR.style.transform = `translate(${-x * 24}px, ${-y * 18}px)`;
}, { passive: true });

// ---- HERO SEARCH TABS ----
document.querySelectorAll('.stab').forEach(tab => {
  tab.addEventListener('click', () => {
    tab.closest('.search-tabs').querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ---- BUILDING WINDOW LIVE FLICKER ----
(function buildingFlicker() {
  const rows = document.querySelectorAll('.bw-row, .bbt-row');
  if (!rows.length) return;
  function flick() {
    const r = rows[Math.floor(Math.random() * rows.length)];
    r.classList.toggle('lit');
    setTimeout(flick, 800 + Math.random() * 2400);
  }
  setTimeout(flick, 2000);
})();

// ---- SERVICE ITEMS cursor effect ----
document.querySelectorAll('.svc-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    outer.classList.add('hovering');
    inner.classList.add('hovering');
  });
  item.addEventListener('mouseleave', () => {
    outer.classList.remove('hovering');
    inner.classList.remove('hovering');
  });
});

// ---- ACTIVE NAV ON SCROLL ----
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');
const sObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${entry.target.id}` ? 'rgba(255,255,255,0.9)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => sObs.observe(s));

// ---- HERO CINEMATIC SLIDESHOW ----
(function () {
  const slides = [...document.querySelectorAll('.hero-slide')];
  const dots   = [...document.querySelectorAll('.hdot')];
  const capLoc = document.getElementById('capLoc');
  const capLine = document.getElementById('capLine');
  if (slides.length < 2) return;

  const caps = [
    { loc: 'Porto Arabia · The Pearl',  line: 'Imagine coming home to this.' },
    { loc: 'Marina District · Lusail',  line: 'Wake up to the water, every morning.' },
    { loc: 'Katara Hills · Lusail',     line: 'Room to breathe. Room to belong.' }
  ];

  let idx = 0, timer = null;

  function show(n) {
    n = (n + slides.length) % slides.length;
    if (n === idx) return;
    slides[idx].classList.remove('active');
    if (dots[idx]) dots[idx].classList.remove('active');
    idx = n;
    slides[idx].classList.add('active');
    if (dots[idx]) dots[idx].classList.add('active');
    if (capLine && caps[idx]) {
      capLine.style.opacity = '0';
      setTimeout(() => {
        capLine.textContent = caps[idx].line;
        if (capLoc) capLoc.textContent = caps[idx].loc;
        capLine.style.opacity = '1';
      }, 500);
    }
  }
  function start() { timer = setInterval(() => show(idx + 1), 6000); }
  function reset() { clearInterval(timer); start(); }

  dots.forEach((d, i) => d.addEventListener('click', () => { show(i); reset(); }));
  start();
})();

// ---- HERO SEARCH TABS ----
document.querySelectorAll('.hsg-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    tab.parentElement.querySelectorAll('.hsg-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ---- POPULAR RESIDENCES — now a 3D coverflow deck (handled by js/deck.js) ----

// ---- FAQ accordion (answers stay in the DOM for AEO; smooth height via grid-rows) ----
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const open = item.classList.toggle('open');
    q.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
});

// ---- THEME TOGGLE handled by js/theme.js (sliding pill + reveal transition) ----

// ---- LIGHT-HERO category pill ----
document.querySelectorAll('.hl-cat').forEach(c => c.addEventListener('click', () => {
  document.querySelectorAll('.hl-cat').forEach(x => x.classList.remove('active'));
  c.classList.add('active');
}));

// ---- SIGNATURE RESIDENCE switcher ----
(function () {
  const stage = document.querySelector('.sig-stage');
  if (!stage) return;
  const data = [
    { img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1100&q=82',
      alt: 'Royal Residence, Porto Arabia — waterfront villa at dusk',
      type: 'Luxury Villa', name: 'Royal Residence, Porto Arabia', price: 'QAR 12,500,000',
      loc: 'Porto Arabia · The Pearl',
      desc: 'A six-bedroom waterfront masterpiece with private beach access, an infinity pool and uninterrupted views across the marina.',
      specs: ['6 Beds', '7 Baths', '850 m²', 'Sea View'], tags: ['Freehold', '0% Tax', 'Move-in Ready'] },
    { img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1100&q=82',
      alt: 'Marina Sky Penthouse, Lusail — terrace with skyline view',
      type: 'Sky Penthouse', name: 'Marina Sky Penthouse', price: 'QAR 7,200,000',
      loc: 'Marina District · Lusail',
      desc: 'A full-floor penthouse above Lusail Marina with floor-to-ceiling glass, a private lift and a wraparound terrace.',
      specs: ['4 Beds', '5 Baths', '480 m²', 'Skyline'], tags: ['Freehold', 'Smart Home', 'New'] },
    { img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1100&q=82',
      alt: 'Katara Hills Estate, Lusail — modern villa with garden',
      type: 'Signature Villa', name: 'Katara Hills Estate', price: 'QAR 9,500,000',
      loc: 'Katara Hills · Lusail',
      desc: 'A five-bedroom family estate overlooking the championship golf course, with a private pool and landscaped gardens.',
      specs: ['5 Beds', '6 Baths', '650 m²', 'Golf View'], tags: ['Freehold', 'Private Pool', 'Garden'] }
  ];
  const $ = (id) => document.getElementById(id);
  const photo = $('sigPhoto'), specsEl = $('sigSpecs'), tagsEl = $('sigTags');
  const thumbs = [...document.querySelectorAll('.sig-thumb')];
  // preserve the 4 spec SVG icons (beds/baths/area/view) for re-render
  const icons = [...specsEl.querySelectorAll('svg')].map(s => s.outerHTML);

  function render(i) {
    const d = data[i];
    stage.classList.add('switching');
    setTimeout(() => {
      photo.src = d.img; photo.alt = d.alt;
      $('sigType').textContent = d.type;
      $('sigName').textContent = d.name;
      $('sigPrice').textContent = d.price;
      $('sigLoc').textContent = d.loc;
      $('sigDesc').textContent = d.desc;
      $('sigIndex').textContent = String(i + 1).padStart(2, '0');
      specsEl.innerHTML = d.specs.map((s, k) => `<li>${icons[k] || ''}<span>${s}</span></li>`).join('');
      tagsEl.innerHTML = d.tags.map(t => `<span>${t}</span>`).join('');
      stage.classList.remove('switching');
    }, 300);
    thumbs.forEach((t, k) => { t.classList.toggle('active', k === i); t.setAttribute('aria-selected', k === i); });
  }
  thumbs.forEach(t => t.addEventListener('click', () => render(+t.dataset.i)));
  const tour = $('sigTour');
  if (tour) tour.addEventListener('click', () => { window.location.href = 'gallery.html'; });
})();
