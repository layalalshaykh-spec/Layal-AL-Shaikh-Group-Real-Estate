/* =====================================================
   LAYAL ALSHAIKH — Realistic 3D villa (Our Promise)
   Three.js (browser 3D, no Blender file). Theme-aware:
   night = warm glowing windows + porch light; day = sun-lit.
   Brightens on hover. Pauses when off-screen.
   ===================================================== */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

(function () {
  const canvas = document.getElementById('promiseHouse');
  if (!canvas) return;

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); }
  catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

  // ---- lights (kept for theme switching) ----
  const hemi = new THREE.HemisphereLight(0x9fb4d6, 0x14110a, 0.2);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0d6, 0);
  sun.position.set(7, 11, 6); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0004;
  Object.assign(sun.shadow.camera, { near: 1, far: 46, left: -11, right: 11, top: 11, bottom: -11 });
  sun.shadow.camera.updateProjectionMatrix();
  scene.add(sun);
  const moon = new THREE.DirectionalLight(0x9cb4dc, 0.5);
  moon.position.set(-7, 9, 5); scene.add(moon);
  const key = new THREE.DirectionalLight(0xffcf95, 0);   // warm front fill (night, so the villa reads)
  key.position.set(4, 6, 8); scene.add(key);

  const interior = [];
  const innerLight = (x, y, z) => { const p = new THREE.PointLight(0xffb869, 0, 7, 2); p.position.set(x, y, z); scene.add(p); interior.push(p); return p; };
  innerLight(0, 1.0, 0.4); innerLight(-1.4, 1.0, 0.7); innerLight(0.4, 2.7, -0.3);
  const porch = new THREE.PointLight(0xffc377, 0, 5, 2); porch.position.set(0.55, 0.9, 2.5); scene.add(porch);

  // ---- materials ----
  const M = (o) => new THREE.MeshStandardMaterial(o);
  const matWall  = M({ color: 0xe7ded0, roughness: 0.78, metalness: 0.02 });
  const matWall2 = M({ color: 0xcdc2ab, roughness: 0.85 });
  const matWood  = M({ color: 0x6f5031, roughness: 0.55, metalness: 0.05 });
  const matStone = M({ color: 0x9a9286, roughness: 0.92 });
  const matRoof  = M({ color: 0x29241d, roughness: 0.6, metalness: 0.12 });
  const matMull  = M({ color: 0x211d18, roughness: 0.5, metalness: 0.3 });
  const matGold  = M({ color: 0xc9a84c, roughness: 0.3, metalness: 0.85 });
  const matGlass = M({ color: 0x0e1217, roughness: 0.08, metalness: 0.0, emissive: 0xf4c873, emissiveIntensity: 0, envMapIntensity: 1.5 });
  const matLawn  = M({ color: 0x42502f, roughness: 1.0 });
  const matHedge = M({ color: 0x3a5230, roughness: 0.95 });
  const matTrunk = M({ color: 0x4a3826, roughness: 0.9 });
  const matLeaf  = M({ color: 0x49633a, roughness: 0.9 });
  const matWater = M({ color: 0x4f7ba0, roughness: 0.1, metalness: 0.25, envMapIntensity: 1.6 });
  const matPath  = M({ color: 0xb6ae9d, roughness: 0.95 });

  const villa = new THREE.Group();
  const box = (w, h, d, m) => { const me = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); me.castShadow = true; me.receiveShadow = true; return me; };
  const add = (mesh, x, y, z) => { mesh.position.set(x, y, z); villa.add(mesh); return mesh; };

  // grounds
  const lawn = box(15, 0.2, 12, matLawn); lawn.receiveShadow = true; lawn.castShadow = false; lawn.position.y = -0.1; villa.add(lawn);
  add(box(6.6, 0.3, 4.5, matStone), 0, 0.05, 0);
  add(box(1.5, 0.06, 3.4, matPath), 0.3, 0.21, 3.1);

  // volumes
  add(box(5.4, 1.9, 3.5, matWall), 0, 1.15, 0);
  add(box(1.05, 2.0, 3.55, matWood), 2.1, 1.2, 0.02);
  add(box(3.9, 1.8, 2.5, matWall), -0.4, 3.0, -0.5);
  add(box(1.15, 1.8, 2.52, matStone), 1.1, 3.0, -0.5);

  // roofs
  add(box(5.9, 0.16, 4.1, matRoof), 0, 2.16, 0);
  add(box(4.4, 0.16, 3.0, matRoof), -0.4, 4.0, -0.5);
  add(box(4.4, 0.05, 3.0, matGold), -0.4, 4.1, -0.5);

  // glazing
  const glassPanels = [];
  const glass = (w, h, x, y, z) => { const g = box(w, h, 0.06, matGlass); g.castShadow = false; add(g, x, y, z); glassPanels.push(g); };
  const mullion = (w, h, x, y, z) => {
    const n = Math.max(2, Math.round(w / 0.62));
    for (let i = 0; i <= n; i++) add(box(0.05, h + 0.06, 0.1, matMull), x - w / 2 + (w * i) / n, y, z + 0.001);
    add(box(w + 0.06, 0.05, 0.1, matMull), x, y + h / 2, z + 0.001);
    add(box(w + 0.06, 0.05, 0.1, matMull), x, y - h / 2, z + 0.001);
  };
  glass(3.6, 1.5, -0.7, 1.0, 1.77); mullion(3.6, 1.5, -0.7, 1.0, 1.77);
  const sideG = box(0.06, 1.4, 2.1, matGlass); sideG.castShadow = false; add(sideG, -2.71, 1.05, 0.1); glassPanels.push(sideG);
  glass(3.1, 1.2, -0.4, 3.1, 0.76); mullion(3.1, 1.2, -0.4, 3.1, 0.76);

  // entrance
  add(box(1.05, 1.6, 0.1, matWood), 0.3, 0.9, 1.76);
  const dglass = box(0.55, 1.4, 0.06, matGlass); dglass.castShadow = false; add(dglass, 0.3, 0.85, 1.79); glassPanels.push(dglass);
  add(box(0.6, 1.5, 0.04, matGold), 0.3, 0.85, 1.82);
  add(box(1.7, 0.12, 1.1, matRoof), 0.3, 1.78, 2.05);
  add(box(0.1, 1.65, 0.1, matMull), 1.1, 0.85, 2.05);
  add(box(2.1, 0.12, 0.4, matStone), 0.3, 0.2, 2.15);
  add(box(2.5, 0.12, 0.4, matStone), 0.3, 0.1, 2.5);

  // upper terrace railing
  add(box(3.5, 0.06, 0.06, matGold), -0.4, 2.55, 0.82);
  for (let i = 0; i <= 11; i++) add(box(0.03, 0.55, 0.03, matMull), -2.05 + i * 0.37, 2.28, 0.82);

  // pool
  const pool = box(2.6, 0.08, 1.5, matWater); pool.castShadow = false; add(pool, -2.7, 0.22, 2.1);
  add(box(3.0, 0.16, 1.9, matStone), -2.7, 0.12, 2.1);

  // landscaping
  const tree = (x, z, s) => {
    const g = new THREE.Group();
    const tr = box(0.12, 0.8, 0.12, matTrunk); tr.position.y = 0.4; tr.castShadow = true; g.add(tr);
    const a = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6 * s, 0), matLeaf); a.position.y = 1.1 * s; a.castShadow = true; g.add(a);
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42 * s, 0), matLeaf); b.position.set(0.3, 0.8 * s, 0.1); b.castShadow = true; g.add(b);
    g.position.set(x, 0.2, z); villa.add(g);
  };
  tree(3.6, 2.3, 1.15); tree(-3.8, -1.7, 1.35); tree(3.7, -2.1, 0.95);
  add(box(3.4, 0.5, 0.42, matHedge), 0.3, 0.45, 3.5);
  add(box(0.42, 0.5, 2.4, matHedge), -3.3, 0.45, 1.7);

  scene.add(villa);
  villa.rotation.y = -0.5;

  // ---- environment (IBL) ----
  import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js')
    .then(({ RoomEnvironment }) => {
      try { const p = new THREE.PMREMGenerator(renderer); scene.environment = p.fromScene(new RoomEnvironment(), 0.04).texture; } catch (e) {}
    }).catch(() => {});

  // ---- framing ----
  const TARGET = new THREE.Vector3(0, 1.9, 0);
  const DIR = new THREE.Vector3(0.5, 0.34, 0.7).normalize();
  function frame() {
    const a = camera.aspect || 1;
    const vFov = (camera.fov * Math.PI) / 180;
    const halfH = 2.9, halfW = 3.9;
    const dist = Math.max(halfH / Math.tan(vFov / 2), halfW / (Math.tan(vFov / 2) * a)) * 1.04;
    camera.position.copy(DIR).multiplyScalar(dist).add(TARGET);
    camera.lookAt(TARGET);
  }
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; frame(); camera.updateProjectionMatrix();
  }
  resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);

  // ---- interaction ----
  let tmx = 0, tmy = 0, mx = 0, my = 0;
  window.addEventListener('mousemove', (e) => { tmx = e.clientX / window.innerWidth - 0.5; tmy = e.clientY / window.innerHeight - 0.5; }, { passive: true });
  let hoverT = 0, hover = 0;
  const section = document.getElementById('promise');
  if (section) {
    section.addEventListener('mouseenter', () => { hoverT = 1; });
    section.addEventListener('mouseleave', () => { hoverT = 0; });
  }
  let visible = true;
  if (section && window.IntersectionObserver) new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(section);

  const isLight = () => document.documentElement.classList.contains('light');

  let t = 0;
  function loop() {
    requestAnimationFrame(loop);
    if (!visible || !canvas.clientWidth) return;
    t += 0.0035; hover += (hoverT - hover) * 0.08;

    if (isLight()) {
      sun.intensity = 2.3; moon.intensity = 0; key.intensity = 0; hemi.intensity = 0.7;
      hemi.color.setHex(0xfff1d8); hemi.groundColor.setHex(0x8a7858);
      matGlass.emissiveIntensity = 0.14;
      interior.forEach(p => p.intensity = 0); porch.intensity = 0;
      renderer.toneMappingExposure = 1.18;
    } else {
      sun.intensity = 0; moon.intensity = 1.2; key.intensity = 1.15; hemi.intensity = 0.42;
      hemi.color.setHex(0xb4c8e6); hemi.groundColor.setHex(0x1b1610);
      const lit = 0.85 + hover * 0.9;
      matGlass.emissiveIntensity = lit;
      interior.forEach(p => p.intensity = lit * 1.7); porch.intensity = (0.7 + hover) * 1.4;
      renderer.toneMappingExposure = 1.12;
    }

    mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
    villa.rotation.y = -0.5 + mx * 0.16;
    villa.rotation.x = my * 0.05;
    renderer.render(scene, camera);
  }
  loop();
})();
