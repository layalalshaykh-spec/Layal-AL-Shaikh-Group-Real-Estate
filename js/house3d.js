/* =====================================================
   LAYAL ALSHAIKH — Realistic 3D villa (light-mode hero)
   Procedural Three.js (no Blender file).
   Idle = black & white, lights off.
   Hover = full colour, warm interior lights ON.
   ===================================================== */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

(function () {
  const canvas = document.getElementById('house3d');
  if (!canvas) return;

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); }
  catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(6.7, 4.1, 7.5);
  camera.lookAt(0, 1.55, 0);

  // ---- Lighting ----
  const hemi = new THREE.HemisphereLight(0xeaf0ff, 0x6b5a3f, 0.55);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0d6, 2.1);
  sun.position.set(7, 11, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0004;
  Object.assign(sun.shadow.camera, { near: 1, far: 45, left: -10, right: 10, top: 10, bottom: -10 });
  sun.shadow.camera.updateProjectionMatrix();
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xbfd0e0, 0.4);
  fill.position.set(-8, 4, -4);
  scene.add(fill);

  // Interior warm lights (animate with hover)
  const innerLights = [];
  function inner(x, y, z) {
    const p = new THREE.PointLight(0xffbf72, 0, 6, 2);
    p.position.set(x, y, z); scene.add(p); innerLights.push(p); return p;
  }
  inner(0, 1.0, 0.2); inner(-1.2, 1.0, 0.4); inner(0.4, 2.7, -0.3);

  // ---- Materials ----
  const M = (o) => new THREE.MeshStandardMaterial(o);
  const matWall   = M({ color: 0xe6ddcb, roughness: 0.72, metalness: 0.02 });
  const matWall2  = M({ color: 0xcfc4ad, roughness: 0.8 });
  const matWood   = M({ color: 0x6e4f2f, roughness: 0.55, metalness: 0.05 });
  const matStone  = M({ color: 0x9b9486, roughness: 0.92 });
  const matRoof   = M({ color: 0x2b2620, roughness: 0.6, metalness: 0.1 });
  const matMull   = M({ color: 0x211d18, roughness: 0.5, metalness: 0.3 });
  const matGold   = M({ color: 0xc9a84c, roughness: 0.3, metalness: 0.85 });
  const matGlass  = M({ color: 0x10141a, roughness: 0.06, metalness: 0.0, emissive: 0xf4c878, emissiveIntensity: 0, envMapIntensity: 1.4 });
  const matLawn   = M({ color: 0x5e7044, roughness: 1.0 });
  const matHedge  = M({ color: 0x46613a, roughness: 0.95 });
  const matTrunk  = M({ color: 0x4a3826, roughness: 0.9 });
  const matLeaf   = M({ color: 0x53713f, roughness: 0.9 });
  const matWater  = M({ color: 0x5f88a6, roughness: 0.08, metalness: 0.2, envMapIntensity: 1.6 });
  const matPath   = M({ color: 0xb9b1a0, roughness: 0.95 });

  const villa = new THREE.Group();
  const add = (mesh, x, y, z) => { mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; villa.add(mesh); return mesh; };
  const box = (w, h, d, m) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);

  // Ground / lawn
  const lawn = box(8, 0.2, 6.5, matLawn); lawn.receiveShadow = true; lawn.castShadow = false; villa.add(lawn); lawn.position.y = -0.1;
  // stone plinth
  add(box(6.4, 0.3, 4.4, matStone), 0, 0.05, 0);
  // walkway
  add(box(1.4, 0.06, 3.2, matPath), 0.2, 0.21, 3.0);

  // Ground floor
  add(box(5.2, 1.8, 3.4, matWall), 0, 1.1, 0);
  // wood-clad accent column on the right
  add(box(1.0, 1.9, 3.5, matWood), 2.0, 1.15, 0.02);
  // first floor (set back -> terrace in front)
  add(box(3.8, 1.7, 2.4, matWall), -0.4, 2.85, -0.5);
  // stone accent on upper
  add(box(1.1, 1.7, 2.42, matStone), 1.05, 2.85, -0.5);

  // Roof slabs (overhanging, flat)
  add(box(5.7, 0.16, 3.9, matRoof), 0, 2.05, 0);
  add(box(4.3, 0.16, 2.9, matRoof), -0.4, 3.78, -0.5);
  // thin roof parapet line (gold)
  add(box(4.3, 0.05, 2.9, matGold), -0.4, 3.88, -0.5);

  // ---- Glazing (lit windows) ----
  const glassPanels = [];
  function glass(w, h, x, y, z, frame) {
    const g = box(w, h, 0.06, matGlass); add(g, x, y, z); g.castShadow = false; glassPanels.push(g);
    if (frame !== false) {
      // mullions
      const n = Math.max(2, Math.round(w / 0.62));
      for (let i = 0; i <= n; i++) {
        const mx = x - w / 2 + (w * i) / n;
        add(box(0.05, h + 0.05, 0.09, matMull), mx, y, z + 0.001);
      }
      add(box(w + 0.05, 0.05, 0.09, matMull), x, y + h / 2, z + 0.001);
      add(box(w + 0.05, 0.05, 0.09, matMull), x, y - h / 2, z + 0.001);
    }
  }
  // ground-floor floor-to-ceiling glass (front, z = +1.72)
  glass(3.4, 1.4, -0.7, 0.95, 1.72);
  // ground-floor side glass (left, x=-2.61)
  const sideG = box(0.06, 1.3, 2.0, matGlass); add(sideG, -2.61, 1.0, 0.1); sideG.castShadow = false; glassPanels.push(sideG);
  // upper-floor glass (front of upper, z = -0.5+1.2 = 0.7)
  glass(3.0, 1.1, -0.4, 2.95, 0.72);

  // ---- Entrance ----
  add(box(1.0, 1.5, 0.1, matWood), 0.2, 0.85, 1.71);     // door panel recess
  add(box(0.5, 1.3, 0.06, matGold), 0.2, 0.78, 1.74);    // gold door
  add(box(1.6, 0.12, 1.0, matRoof), 0.2, 1.7, 2.0);      // entrance canopy
  add(box(0.1, 1.55, 0.1, matMull), 1.0, 0.8, 2.0);      // canopy post
  // steps
  add(box(2.0, 0.12, 0.4, matStone), 0.2, 0.2, 2.05);
  add(box(2.4, 0.12, 0.4, matStone), 0.2, 0.1, 2.4);

  // ---- Terrace railing on upper floor (front edge z ~ 0.72) ----
  const railY = 2.2;
  add(box(3.4, 0.06, 0.06, matGold), -0.4, railY + 0.55, 0.78); // top rail
  for (let i = 0; i <= 10; i++) {
    add(box(0.03, 0.55, 0.03, matMull), -2.0 + i * 0.36, railY + 0.28, 0.78);
  }

  // ---- Pool ----
  const pool = box(2.4, 0.08, 1.4, matWater); add(pool, -2.6, 0.22, 2.0); pool.castShadow = false;
  add(box(2.8, 0.16, 1.8, matStone), -2.6, 0.12, 2.0); // pool deck

  // ---- Landscaping ----
  function tree(x, z, s) {
    const g = new THREE.Group();
    const tr = box(0.12, 0.7, 0.12, matTrunk); tr.position.y = 0.35; tr.castShadow = true; g.add(tr);
    const c1 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55 * s, 0), matLeaf);
    c1.position.y = 1.0 * s; c1.castShadow = true; g.add(c1);
    const c2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4 * s, 0), matLeaf);
    c2.position.set(0.25, 0.7 * s, 0.1); c2.castShadow = true; g.add(c2);
    g.position.set(x, 0.2, z); villa.add(g);
  }
  tree(3.4, 2.2, 1.1); tree(-3.6, -1.6, 1.3); tree(3.6, -2.0, 0.95);
  // hedges
  add(box(3.2, 0.45, 0.4, matHedge), 0.2, 0.42, 3.4);
  add(box(0.4, 0.45, 2.2, matHedge), -3.1, 0.42, 1.6);

  scene.add(villa);
  villa.rotation.y = -0.42; // fixed attractive 3/4 angle

  // ---- Image-based lighting (optional, async) ----
  import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js')
    .then(({ RoomEnvironment }) => {
      try {
        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      } catch (e) {}
    }).catch(() => {});

  // ---- Sizing + auto-framing (keeps the villa big at any panel shape) ----
  const TARGET = new THREE.Vector3(0, 1.2, 0);
  const VIEWDIR = new THREE.Vector3(0.58, 0.4, 0.7).normalize();
  function frame() {
    const a = camera.aspect || 1;
    const vFov = (camera.fov * Math.PI) / 180;
    const halfH = 2.55, halfW = 3.9;                 // approx villa half-extents
    const dH = halfH / Math.tan(vFov / 2);
    const dW = halfW / (Math.tan(vFov / 2) * a);
    const dist = Math.max(dH, dW) * 1.16;            // 16% margin
    camera.position.copy(VIEWDIR).multiplyScalar(dist).add(TARGET);
    camera.lookAt(TARGET);
  }
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    frame();
    camera.updateProjectionMatrix();
  }
  resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
  window.addEventListener('resize', resize);

  // ---- Hover = lights on + colour; idle = B&W + lights off ----
  const hint = document.getElementById('hl3dHint');
  const canHover = window.matchMedia('(hover: hover)').matches;
  let targetLit = canHover ? 0 : 1, lit = targetLit;
  if (!canHover) { canvas.classList.add('lit'); if (hint) hint.style.opacity = '0'; }
  canvas.addEventListener('pointerenter', () => {
    targetLit = 1; canvas.classList.add('lit'); if (hint) hint.style.opacity = '0';
  });
  canvas.addEventListener('pointerleave', () => {
    if (canHover) { targetLit = 0; canvas.classList.remove('lit'); if (hint) hint.style.opacity = ''; }
  });

  // ---- Mouse parallax ----
  let tmx = 0, tmy = 0, mx = 0, my = 0;
  window.addEventListener('mousemove', (e) => {
    tmx = e.clientX / window.innerWidth - 0.5;
    tmy = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  let t = 0, sized = false;
  function loop() {
    requestAnimationFrame(loop);
    if (!document.documentElement.classList.contains('light')) return;
    if (!canvas.clientWidth) return;
    if (!sized) { resize(); sized = true; }
    t += 0.0045;
    lit += (targetLit - lit) * 0.08;

    // apply lights
    matGlass.emissiveIntensity = lit * 2.1;
    for (const p of innerLights) p.intensity = lit * 2.8;
    hemi.intensity = 0.55 - lit * 0.18;       // dim ambient when "night" lit for contrast
    renderer.toneMappingExposure = 1.05 + lit * 0.12;

    // gentle idle motion + parallax
    mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
    villa.rotation.y = -0.42 + mx * 0.28;
    villa.rotation.x = my * 0.1;
    villa.position.y = Math.sin(t * 1.4) * 0.06;
    renderer.render(scene, camera);
  }
  loop();
})();
