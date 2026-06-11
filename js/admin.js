/* =====================================================
   LAYAL ALSHAIKH — Admin Portal (front-end demo)
   Persists to localStorage. Replace with a real API in dev phase.
   ===================================================== */
(function () {
  const PASSWORD = 'layal2024';
  const VK = 'la_villas', GK = 'la_gallery';

  // ---------- Seed data ----------
  const seedVillas = [
    { id: 1, name: 'Royal Residence, Porto Arabia', type: 'Villa', loc: 'The Pearl, Qatar', price: 12500000, beds: 6, baths: 7, area: 850, status: 'live', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=70' },
    { id: 2, name: 'Sky Penthouse, Marina', type: 'Penthouse', loc: 'Marina District, Lusail', price: 7200000, beds: 4, baths: 5, area: 480, status: 'live', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=70' },
    { id: 3, name: 'West Bay Tower, Fl. 42', type: 'Apartment', loc: 'West Bay, Doha', price: 3800000, beds: 3, baths: 3, area: 260, status: 'live', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=70' },
    { id: 4, name: 'Katara Hills Estate', type: 'Villa', loc: 'Katara Hills, Lusail', price: 9500000, beds: 5, baths: 6, area: 650, status: 'draft', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=70' }
  ];
  const seedGallery = [
    { id: 1, url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=70', cat: 'exterior' },
    { id: 2, url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=70', cat: 'interior' },
    { id: 3, url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=400&q=70', cat: 'aerial' }
  ];

  const load = (k, seed) => { try { const v = JSON.parse(localStorage.getItem(k)); return v && v.length ? v : seed; } catch (e) { return seed; } };
  const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  let villas = load(VK, seedVillas);
  let gallery = load(GK, seedGallery);
  const money = n => 'QAR ' + Number(n || 0).toLocaleString();
  const nextId = arr => arr.reduce((m, x) => Math.max(m, x.id), 0) + 1;

  // ---------- Login ----------
  const loginEl = document.getElementById('adminLogin');
  const shell = document.getElementById('adminShell');
  function showApp() { loginEl.style.display = 'none'; shell.style.display = 'grid'; renderAll(); }
  if (sessionStorage.getItem('la_admin') === '1') showApp();

  document.getElementById('loginBtn').addEventListener('click', tryLogin);
  document.getElementById('adminPass').addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
  function tryLogin() {
    const v = document.getElementById('adminPass').value;
    if (v === PASSWORD) { sessionStorage.setItem('la_admin', '1'); showApp(); }
    else document.getElementById('loginErr').style.display = 'block';
  }
  document.getElementById('logoutBtn').addEventListener('click', e => { e.preventDefault(); sessionStorage.removeItem('la_admin'); location.reload(); });

  // ---------- Panel switching ----------
  document.querySelectorAll('.admin-nav a[data-panel]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.admin-nav a').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
    const p = a.dataset.panel;
    document.querySelectorAll('.admin-panel').forEach(s => s.style.display = (s.dataset.panel === p) ? '' : 'none');
    document.getElementById('adminSide').classList.remove('open');
  }));
  const st = document.getElementById('sideToggle');
  st.addEventListener('click', () => document.getElementById('adminSide').classList.toggle('open'));
  const checkMobile = () => st.style.display = window.innerWidth <= 860 ? 'inline-flex' : 'none';
  window.addEventListener('resize', checkMobile); checkMobile();

  // ---------- Render ----------
  function statusPill(s) { return `<span class="apill ${s === 'live' ? 'live' : 'draft'}">${s}</span>`; }
  function renderAll() { renderStats(); renderVillas(); renderGallery(); }

  function renderStats() {
    document.getElementById('statTotal').textContent = villas.length;
    document.getElementById('statLive').textContent = villas.filter(v => v.status === 'live').length;
    document.getElementById('statPhotos').textContent = gallery.length;
    const total = villas.reduce((s, v) => s + Number(v.price || 0), 0);
    document.getElementById('statValue').textContent = (total / 1e6).toFixed(1) + 'M';
    document.getElementById('recentBody').innerHTML = villas.slice(0, 4).map(v => `
      <tr><td><img class="villa-thumb" src="${v.img}" alt=""></td><td>${v.name}</td><td>${v.loc}</td><td>${money(v.price)}</td><td>${statusPill(v.status)}</td></tr>`).join('');
  }

  function renderVillas() {
    document.getElementById('villaBody').innerHTML = villas.map(v => `
      <tr>
        <td><img class="villa-thumb" src="${v.img}" alt=""></td>
        <td>${v.name}<br><span style="color:var(--w30);font-size:.7rem">${v.type}</span></td>
        <td>${v.loc}</td>
        <td>${v.beds} bd</td>
        <td>${money(v.price)}</td>
        <td>${statusPill(v.status)}</td>
        <td style="white-space:nowrap">
          <button class="abtn ghost mini" data-edit="${v.id}">Edit</button>
          <button class="abtn ghost mini danger" data-del="${v.id}">Delete</button>
        </td>
      </tr>`).join('');
    document.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openForm(+b.dataset.edit)));
    document.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      if (confirm('Delete this property?')) { villas = villas.filter(v => v.id !== +b.dataset.del); save(VK, villas); renderAll(); }
    }));
  }

  function renderGallery() {
    document.getElementById('galAdminGrid').innerHTML = gallery.map(g => `
      <div class="gal-item" style="aspect-ratio:1">
        <img src="${g.url}" alt="">
        <div class="gal-item-overlay" style="opacity:1;align-items:flex-start;justify-content:flex-end">
          <button class="abtn gold mini" data-delphoto="${g.id}" style="padding:4px 8px">✕</button>
        </div>
      </div>`).join('');
    document.querySelectorAll('[data-delphoto]').forEach(b => b.addEventListener('click', () => {
      gallery = gallery.filter(g => g.id !== +b.dataset.delphoto); save(GK, gallery); renderGallery(); renderStats();
    }));
  }

  // ---------- Villa form ----------
  const formCard = document.getElementById('villaFormCard');
  const F = id => document.getElementById(id);
  function openForm(id) {
    formCard.style.display = '';
    formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (id) {
      const v = villas.find(x => x.id === id);
      F('villaFormTitle').textContent = 'Edit Villa';
      F('vId').value = v.id; F('vName').value = v.name; F('vType').value = v.type; F('vLoc').value = v.loc;
      F('vPrice').value = v.price; F('vBeds').value = v.beds; F('vBaths').value = v.baths; F('vArea').value = v.area;
      F('vStatus').value = v.status; F('vImg').value = v.img;
    } else {
      F('villaFormTitle').textContent = 'Add New Villa';
      ['vId','vName','vLoc','vPrice','vBeds','vBaths','vArea','vImg'].forEach(i => F(i).value = '');
      F('vType').value = 'Villa'; F('vStatus').value = 'live';
    }
  }
  document.getElementById('addVillaBtn').addEventListener('click', () => openForm(0));
  document.getElementById('cancelVilla').addEventListener('click', () => formCard.style.display = 'none');

  // upload → dataURL
  document.getElementById('vUpload').addEventListener('click', () => F('vFile').click());
  F('vFile').addEventListener('change', e => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader(); r.onload = ev => { F('vImg').value = ev.target.result; document.getElementById('vUpload').textContent = '✓ ' + file.name + ' (loaded)'; }; r.readAsDataURL(file);
  });

  document.getElementById('saveVilla').addEventListener('click', () => {
    const data = {
      name: F('vName').value.trim() || 'Untitled Property',
      type: F('vType').value, loc: F('vLoc').value.trim() || 'Qatar',
      price: +F('vPrice').value || 0, beds: +F('vBeds').value || 0, baths: +F('vBaths').value || 0,
      area: +F('vArea').value || 0, status: F('vStatus').value,
      img: F('vImg').value.trim() || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=70'
    };
    const id = +F('vId').value;
    if (id) { villas = villas.map(v => v.id === id ? { ...v, ...data } : v); }
    else { villas.unshift({ id: nextId(villas), ...data }); }
    save(VK, villas); formCard.style.display = 'none'; renderAll();
  });

  // ---------- Gallery add ----------
  document.getElementById('addPhoto').addEventListener('click', () => {
    const url = document.getElementById('gUrl').value.trim(); if (!url) return alert('Please paste an image URL.');
    gallery.unshift({ id: nextId(gallery), url, cat: document.getElementById('gCat').value });
    save(GK, gallery); document.getElementById('gUrl').value = ''; renderGallery(); renderStats();
  });
})();
