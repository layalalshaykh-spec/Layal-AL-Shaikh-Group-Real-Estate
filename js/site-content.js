/* =====================================================
   LAYAL ALSHAIKH — Public site content from Supabase
   Applies admin-managed announcements + contact settings
   to every page. Fails silently / keeps the built-in
   defaults if the backend or tables aren't there yet.
   ===================================================== */
import { supabase } from './supabase.js';

(async function () {
  if (!supabase) return;
  let settings = {}, anns = [];
  try {
    const [s, a] = await Promise.all([
      supabase.from('site_settings').select('*'),
      supabase.from('announcements').select('*').eq('active', true).order('sort', { ascending: true }).order('id', { ascending: false })
    ]);
    if (s.data) s.data.forEach(r => settings[r.key] = r.value);
    if (a.data) anns = a.data;
  } catch (e) { return; }

  const val = k => settings[k] && String(settings[k]).trim();

  // ---- Contact details: update links everywhere + any tagged text ----
  if (val('phone')) {
    const tel = 'tel:' + val('phone').replace(/[^0-9+]/g, '');
    document.querySelectorAll('a[href^="tel:"]').forEach(el => { el.setAttribute('href', tel); if (!el.children.length) el.textContent = val('phone'); });
    document.querySelectorAll('[data-set="phone"]').forEach(el => el.textContent = val('phone'));
  }
  if (val('email')) {
    document.querySelectorAll('a[href^="mailto:"]').forEach(el => { el.setAttribute('href', 'mailto:' + val('email')); if (!el.children.length) el.textContent = val('email'); });
    document.querySelectorAll('[data-set="email"]').forEach(el => el.textContent = val('email'));
  }
  if (val('whatsapp')) {
    const w = val('whatsapp').replace(/[^0-9]/g, '');
    document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp"]').forEach(el => el.setAttribute('href', 'https://wa.me/' + w));
  }
  ['address', 'hours', 'hero_sub'].forEach(k => { if (val(k)) document.querySelectorAll('[data-set="' + k + '"]').forEach(el => el.textContent = val(k)); });
  if (val('instagram')) document.querySelectorAll('[data-set="instagram"]').forEach(el => el.setAttribute('href', val('instagram')));
  if (val('linkedin')) document.querySelectorAll('[data-set="linkedin"]').forEach(el => el.setAttribute('href', val('linkedin')));

  // ---- Announcement banner (dismissible per session) ----
  if (anns.length && !sessionStorage.getItem('la_ann_dismissed_' + anns[0].id)) {
    const a = anns[0];
    const bar = document.createElement('div');
    bar.className = 'site-announce';
    const linkHtml = a.link ? `<a class="sa-link" href="${String(a.link).replace(/"/g, '&quot;')}"></a>` : '';
    bar.innerHTML = `<div class="sa-in"><span class="sa-dot"></span><span class="sa-msg"></span>${linkHtml}</div><button class="sa-close" aria-label="Dismiss">×</button>`;
    bar.querySelector('.sa-msg').textContent = a.message;                       // textContent = XSS-safe
    if (a.link) bar.querySelector('.sa-link').textContent = (a.link_label || 'Learn more') + ' →';
    document.body.prepend(bar);
    document.body.classList.add('has-announce');
    bar.querySelector('.sa-close').addEventListener('click', () => {
      bar.remove(); document.body.classList.remove('has-announce');
      try { sessionStorage.setItem('la_ann_dismissed_' + a.id, '1'); } catch (e) {}
    });
  }
})();
