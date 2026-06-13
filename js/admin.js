/* =====================================================
   LAYAL ALSHAIKH — Admin Portal
   Live content via Supabase (auth + Postgres + Storage).
   Falls back to a localStorage demo if Supabase isn't configured.
   ===================================================== */
import { supabase } from './supabase.js';

(function () {
  const USE_DB = !!supabase;
  const VK = 'la_villas', GK = 'la_gallery', DEMO_PW = 'layal2024';
  const F = id => document.getElementById(id);
  const money = n => 'QAR ' + Number(n || 0).toLocaleString();

  // ---- shape mappers (DB columns <-> UI shape) ----
  const fromVilla = r => ({ id: r.id, name: r.name, type: r.type, loc: r.location, price: r.price, beds: r.beds, baths: r.baths, area: r.area, status: r.status, img: r.image_url });
  const toVilla   = v => ({ name: v.name, type: v.type, location: v.loc, price: v.price, beds: v.beds, baths: v.baths, area: v.area, status: v.status, image_url: v.img });
  const fromGal   = r => ({ id: r.id, url: r.image_url, cat: r.category });
  const toGal     = g => ({ image_url: g.url, category: g.cat });

  const seedVillas = [{ id: 1, name: 'Royal Residence, Porto Arabia', type: 'Villa', loc: 'The Pearl, Qatar', price: 12500000, beds: 6, baths: 7, area: 850, status: 'live', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=70' }];
  const lsLoad = (k, seed) => { try { const v = JSON.parse(localStorage.getItem(k)); return v && v.length ? v : seed; } catch (e) { return seed; } };
  const lsSave = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  let villas = [], gallery = [];

  async function loadData() {
    if (USE_DB) {
      const [v, g] = await Promise.all([
        supabase.from('villas').select('*').order('id', { ascending: false }),
        supabase.from('gallery').select('*').order('id', { ascending: false })
      ]);
      if (v.error) console.warn('villas:', v.error.message);
      if (g.error) console.warn('gallery:', g.error.message);
      villas = (v.data || []).map(fromVilla);
      gallery = (g.data || []).map(fromGal);
    } else {
      villas = lsLoad(VK, seedVillas); gallery = lsLoad(GK, []);
    }
  }

  // ---------- Login ----------
  const loginEl = F('adminLogin'), shell = F('adminShell');
  async function showApp() { loginEl.style.display = 'none'; shell.style.display = 'grid'; await loadData(); renderAll(); }

  (async function initSession() {
    if (USE_DB) { try { const { data } = await supabase.auth.getSession(); if (data && data.session) showApp(); } catch (e) {} }
    else if (sessionStorage.getItem('la_admin') === '1') showApp();
  })();

  F('loginBtn').addEventListener('click', tryLogin);
  F('adminPass').addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
  if (F('adminEmail')) F('adminEmail').addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });

  async function tryLogin() {
    const err = F('loginErr'), pass = F('adminPass').value;
    if (USE_DB) {
      const email = F('adminEmail') ? F('adminEmail').value.trim() : '';
      const btn = F('loginBtn'), t = btn.textContent; btn.textContent = 'Signing in…'; btn.disabled = true;
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      btn.textContent = t; btn.disabled = false;
      if (error) { err.textContent = error.message || 'Sign-in failed.'; err.style.display = 'block'; }
      else { err.style.display = 'none'; showApp(); }
    } else {
      if (pass === DEMO_PW) { sessionStorage.setItem('la_admin', '1'); showApp(); }
      else err.style.display = 'block';
    }
  }
  F('logoutBtn').addEventListener('click', async e => {
    e.preventDefault();
    if (USE_DB) { try { await supabase.auth.signOut(); } catch (_) {} } else sessionStorage.removeItem('la_admin');
    location.reload();
  });

  // ---------- Panel switching ----------
  document.querySelectorAll('.admin-nav a[data-panel]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.admin-nav a').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
    const p = a.dataset.panel;
    document.querySelectorAll('.admin-panel').forEach(s => s.style.display = (s.dataset.panel === p) ? '' : 'none');
    F('adminSide').classList.remove('open');
  }));
  const st = F('sideToggle');
  st.addEventListener('click', () => F('adminSide').classList.toggle('open'));
  const checkMobile = () => st.style.display = window.innerWidth <= 860 ? 'inline-flex' : 'none';
  window.addEventListener('resize', checkMobile); checkMobile();

  // ---------- Render ----------
  const statusPill = s => `<span class="apill ${s === 'live' ? 'live' : 'draft'}">${s}</span>`;
  function renderAll() { renderStats(); renderVillas(); renderGallery(); }
  function renderStats() {
    F('statTotal').textContent = villas.length;
    F('statLive').textContent = villas.filter(v => v.status === 'live').length;
    F('statPhotos').textContent = gallery.length;
    F('statValue').textContent = (villas.reduce((s, v) => s + Number(v.price || 0), 0) / 1e6).toFixed(1) + 'M';
    F('recentBody').innerHTML = villas.slice(0, 4).map(v => `<tr><td><img class="villa-thumb" src="${v.img}" alt=""></td><td>${v.name}</td><td>${v.loc}</td><td>${money(v.price)}</td><td>${statusPill(v.status)}</td></tr>`).join('');
  }
  function renderVillas() {
    F('villaBody').innerHTML = villas.map(v => `
      <tr>
        <td><img class="villa-thumb" src="${v.img}" alt=""></td>
        <td>${v.name}<br><span style="color:var(--w30);font-size:.7rem">${v.type}</span></td>
        <td>${v.loc}</td><td>${v.beds} bd</td><td>${money(v.price)}</td><td>${statusPill(v.status)}</td>
        <td style="white-space:nowrap"><button class="abtn ghost mini" data-edit="${v.id}">Edit</button> <button class="abtn ghost mini danger" data-del="${v.id}">Delete</button></td>
      </tr>`).join('');
    document.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openForm(b.dataset.edit)));
    document.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => delVilla(b.dataset.del)));
  }
  function renderGallery() {
    F('galAdminGrid').innerHTML = gallery.map(g => `
      <div class="gal-item" style="aspect-ratio:1"><img src="${g.url}" alt="">
        <div class="gal-item-overlay" style="opacity:1;align-items:flex-start;justify-content:flex-end"><button class="abtn gold mini" data-delphoto="${g.id}" style="padding:4px 8px">✕</button></div>
      </div>`).join('');
    document.querySelectorAll('[data-delphoto]').forEach(b => b.addEventListener('click', () => delPhoto(b.dataset.delphoto)));
  }

  // ---------- Villa form ----------
  const formCard = F('villaFormCard');
  function openForm(id) {
    formCard.style.display = '';
    formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    const v = id ? villas.find(x => String(x.id) === String(id)) : null;
    if (v) {
      F('villaFormTitle').textContent = 'Edit Villa';
      F('vId').value = v.id; F('vName').value = v.name; F('vType').value = v.type; F('vLoc').value = v.loc;
      F('vPrice').value = v.price; F('vBeds').value = v.beds; F('vBaths').value = v.baths; F('vArea').value = v.area;
      F('vStatus').value = v.status; F('vImg').value = v.img;
    } else {
      F('villaFormTitle').textContent = 'Add New Villa';
      ['vId', 'vName', 'vLoc', 'vPrice', 'vBeds', 'vBaths', 'vArea', 'vImg'].forEach(i => F(i).value = '');
      F('vType').value = 'Villa'; F('vStatus').value = 'live';
    }
    F('vUpload').textContent = 'Click to upload a photo, or paste a URL above';
  }
  F('addVillaBtn').addEventListener('click', () => openForm(0));
  F('cancelVilla').addEventListener('click', () => formCard.style.display = 'none');

  // ---------- Image upload (to Supabase Storage) ----------
  async function uploadTo(file, folder, btnId) {
    const btn = F(btnId), label = btn.textContent;
    const safe = file.name.replace(/[^a-z0-9.\-_]/gi, '_'), path = folder + '/' + Date.now() + '-' + safe;
    if (USE_DB) {
      btn.textContent = 'Uploading…';
      const { error } = await supabase.storage.from('media').upload(path, file, { cacheControl: '3600', upsert: false });
      if (error) { btn.textContent = '⚠ ' + error.message; return null; }
      btn.textContent = label;
      return supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
    }
    return await new Promise(res => { const r = new FileReader(); r.onload = ev => res(ev.target.result); r.readAsDataURL(file); });
  }
  F('vUpload').addEventListener('click', () => F('vFile').click());
  F('vFile').addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    const url = await uploadTo(file, 'villas', 'vUpload');
    if (url) { F('vImg').value = url; F('vUpload').textContent = '✓ ' + file.name + ' uploaded'; }
  });

  // ---------- Villa save / delete ----------
  F('saveVilla').addEventListener('click', async () => {
    const data = {
      name: F('vName').value.trim() || 'Untitled Property', type: F('vType').value,
      loc: F('vLoc').value.trim() || 'Qatar', price: +F('vPrice').value || 0, beds: +F('vBeds').value || 0,
      baths: +F('vBaths').value || 0, area: +F('vArea').value || 0, status: F('vStatus').value,
      img: F('vImg').value.trim() || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=70'
    };
    const id = F('vId').value, btn = F('saveVilla'), t = btn.textContent;
    btn.textContent = 'Saving…'; btn.disabled = true;
    if (USE_DB) {
      const res = id ? await supabase.from('villas').update(toVilla(data)).eq('id', id) : await supabase.from('villas').insert(toVilla(data));
      if (res.error) alert('Save failed: ' + res.error.message);
    } else {
      if (id) villas = villas.map(v => String(v.id) === String(id) ? { ...v, ...data } : v);
      else villas.unshift({ id: villas.reduce((m, x) => Math.max(m, x.id), 0) + 1, ...data });
      lsSave(VK, villas);
    }
    btn.textContent = t; btn.disabled = false; formCard.style.display = 'none';
    await loadData(); renderAll();
  });
  async function delVilla(id) {
    if (!confirm('Delete this property?')) return;
    if (USE_DB) { const { error } = await supabase.from('villas').delete().eq('id', id); if (error) return alert('Delete failed: ' + error.message); }
    else { villas = villas.filter(v => String(v.id) !== String(id)); lsSave(VK, villas); }
    await loadData(); renderAll();
  }

  // ---------- Gallery add / delete ----------
  async function addPhoto(url, cat) {
    if (!url) return;
    if (USE_DB) { const { error } = await supabase.from('gallery').insert(toGal({ url, cat })); if (error) return alert('Add failed: ' + error.message); }
    else { gallery.unshift({ id: gallery.reduce((m, x) => Math.max(m, x.id), 0) + 1, url, cat }); lsSave(GK, gallery); }
    await loadData(); renderGallery(); renderStats();
  }
  async function delPhoto(id) {
    if (USE_DB) { const { error } = await supabase.from('gallery').delete().eq('id', id); if (error) return alert('Delete failed: ' + error.message); }
    else { gallery = gallery.filter(g => String(g.id) !== String(id)); lsSave(GK, gallery); }
    await loadData(); renderGallery(); renderStats();
  }
  F('addPhoto').addEventListener('click', async () => {
    const url = F('gUrl').value.trim(); if (!url) return alert('Please paste an image URL or upload a file.');
    await addPhoto(url, F('gCat').value); F('gUrl').value = '';
  });
  if (F('gUploadBtn')) F('gUploadBtn').addEventListener('click', () => F('gFile').click());
  if (F('gFile')) F('gFile').addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    const url = await uploadTo(file, 'gallery', 'gUploadBtn');
    if (url) await addPhoto(url, F('gCat').value);
  });
})();
