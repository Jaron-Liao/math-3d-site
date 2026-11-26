/* 参数曲面实验室：多函数族 + 17 项可调参数 + 实时重建 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createStage, webglOK, loadModel } from './core.js';

const canvas = document.getElementById('lab-canvas');

const P = {
  a: 1, b: 1.6, c: 1.6, phase: 0, d: 0, scale: 0.55,
  density: 120, size: 6.4,
  metalness: 0.72, roughness: 0.26, opacity: 1, wireOpacity: 0.55, pointSize: 0.022,
  exposure: 1.05, keyLight: 2.6, spinSpeed: 0.55,
};
let mode = 'solid';
let palette = 'gold';
let view = 'perspective';
let spin = true;
let family = 'sincos';
let helpers = { grid: true, axes: false };

const PALETTES = {
  gold: { solid: 0xd4af37, wire: 0xf0d98c, point: 0xa2d2ff },
  ice: { solid: 0x6fb7d9, wire: 0xbfeaff, point: 0xffffff },
  coral: { solid: 0xe07a5f, wire: 0xffc4a8, point: 0xffd9b3 },
  mint: { solid: 0x7fc9a6, wire: 0xc8f0d8, point: 0xe0fff0 },
};

const el = {};
['a','b','c','phase','d','scale','density','size','metalness','roughness','opacity','wireOpacity','pointSize','exposure','keyLight','spinSpeed'].forEach(function (k) {
  el[k] = document.getElementById('p-' + k);
  el['v' + k] = document.getElementById('v-' + k);
});

function surfaceZ(x, y) {
  switch (family) {
    case 'ripple': return P.a * Math.sin(P.b * Math.sqrt(x*x + y*y) + P.phase) * Math.cos(P.c * y) + P.d * x * y;
    case 'saddle': return P.a * (x*x - y*y) * 0.25 * Math.sin(P.b * x + P.phase) + P.d * y;
    case 'wave': return P.a * Math.sin(P.b * x + P.c * y + P.phase) + P.d * Math.cos(P.c * x);
    default: return P.a * Math.sin(P.b * x + P.phase) * Math.cos(P.c * y) + P.d * x * y;
  }
}
function famName() { return { sincos:'a·sin(bx+φ)·cos(cy)+dxy', ripple:'a·sin(b·r+φ)·cos(cy)+dxy', saddle:'a(x²−y²)/4·sin(bx+φ)+dy', wave:'a·sin(bx+cy+φ)+d·cos(cx)' }[family]; }

function buildPositions(geo) {
  const pos = geo.attributes.position;
  const half = P.size / 2;
  for (let i = 0; i < pos.count; i++) {
    const x = (pos.getX(i) / half) * 3;
    const y = (pos.getY(i) / half) * 3;
    pos.setZ(i, surfaceZ(x, y) * P.scale);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

function boot() {
  if (!canvas || !webglOK()) return;
  const stage = createStage(canvas, { fov: 42, camPos: [4.6, 3.2, 5.0], lookAt: [0, 0, 0], exposure: P.exposure });
  const { scene, camera, renderer, key } = stage;

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 3.4;
  controls.maxDistance = 13;
  controls.autoRotate = spin;
  controls.autoRotateSpeed = P.spinSpeed;

  let geo = new THREE.PlaneGeometry(P.size, P.size, P.density, P.density);
  buildPositions(geo);

  const matSolid = new THREE.MeshStandardMaterial({ color: PALETTES[palette].solid, metalness: P.metalness, roughness: P.roughness, side: THREE.DoubleSide, transparent: true, opacity: P.opacity });
  const solid = new THREE.Mesh(geo, matSolid);
  solid.rotation.x = -Math.PI / 2;

  const matWire = new THREE.MeshBasicMaterial({ color: PALETTES[palette].wire, wireframe: true, transparent: true, opacity: P.wireOpacity });
  const wire = new THREE.Mesh(geo, matWire);
  wire.rotation.x = -Math.PI / 2;
  wire.visible = false;

  const matPoint = new THREE.PointsMaterial({ color: PALETTES[palette].point, size: P.pointSize, transparent: true, opacity: 0.85 });
  const points = new THREE.Points(geo, matPoint);
  points.rotation.x = -Math.PI / 2;
  points.visible = false;

  const group = new THREE.Group();
  group.add(solid, wire, points);
  scene.add(group);

  const grid = new THREE.GridHelper(P.size, 16, 0x3a321e, 0x241f16);
  grid.position.y = -1.5;
  scene.add(grid);
  const axes = new THREE.AxesHelper(2.4);
  axes.visible = false;
  scene.add(axes);

  /* ── 模型库载入 ── */
  let modelRoot = null;
  let modelSpin = 0;
  const pick = document.getElementById('model-pick');
  const pickLabel = document.getElementById('v-pick');
  if (pick && window.MODELS) {
    pick.innerHTML = '<option value="">— 参数曲面（实时生成）—</option>'
      + window.MODELS.map(function (m, i) { return '<option value="' + i + '">' + m.cat + ' · ' + m.name + '</option>'; }).join('');
    pick.addEventListener('change', function () {
      const idx = pick.value === '' ? -1 : parseInt(pick.value, 10);
      if (idx < 0) {
        if (modelRoot) { scene.remove(modelRoot); modelRoot = null; }
        group.visible = true;
        grid.visible = helpers.grid;
        if (pickLabel) pickLabel.textContent = '参数曲面';
        return;
      }
      const m = window.MODELS[idx];
      group.visible = false;
      grid.visible = false;
      if (pickLabel) pickLabel.textContent = m.name;
      loadModel(m.file, 2.7).then(function (obj) {
        if (modelRoot) scene.remove(modelRoot);
        modelRoot = obj;
        modelRoot.position.y = 0.1;
        scene.add(modelRoot);
      }).catch(function (e) {
        if (pickLabel) pickLabel.textContent = '加载失败';
        console.warn('[lab] 模型加载失败', e);
      });
    });
  }

  let dirty = false;
  let geoDirty = false;
  function rebuildGeo() {
    const old = geo;
    geo = new THREE.PlaneGeometry(P.size, P.size, P.density, P.density);
    buildPositions(geo);
    solid.geometry = geo; wire.geometry = geo; points.geometry = geo;
    old.dispose();
    grid.geometry.dispose();
    scene.remove(grid);
    const ng = new THREE.GridHelper(P.size, 16, 0x3a321e, 0x241f16);
    ng.position.y = -1.5; ng.visible = helpers.grid;
    grid = ng; scene.add(grid);
  }
  const refresh = function () { if (geoDirty) rebuildGeo(); else buildPositions(geo); dirty = false; geoDirty = false; syncText(); };

  function fmt(k, v) {
    if (k === 'density') return String(Math.round(v));
    if (k === 'size') return v.toFixed(1);
    if (['pointSize'].includes(k)) return v.toFixed(3);
    if (['phase'].includes(k)) return v.toFixed(2) + 'r';
    return v.toFixed(2);
  }
  function syncText() {
    Object.keys(el).forEach(function (k) {
      if (el['v' + k]) el['v' + k].textContent = fmt(k, P[k]);
    });
    const tag = document.getElementById('lab-tag');
    if (tag) tag.textContent = 'z = ' + famName();
    const note = document.getElementById('lab-note');
    if (note) {
      note.innerHTML = '当前函数族 <b>' + famName() + '</b>；相位 φ = ' + P.phase.toFixed(2)
        + '，二次项 d = ' + P.d.toFixed(2) + '。网格 ' + P.density + '×' + P.density
        + '（' + (P.density * P.density).toLocaleString() + ' 顶点），材质金属度 ' + P.metalness.toFixed(2)
        + ' / 粗糙度 ' + P.roughness.toFixed(2) + '。频率越大，极值点越密——这正是数值积分要求步长与频率匹配的原因。';
      if (window.renderMath) window.renderMath(note);
    }
  }

  Object.keys(el).forEach(function (k) {
    if (!el[k]) return;
    el[k].addEventListener('input', function () {
      P[k] = parseFloat(el[k].value);
      if (k === 'exposure') renderer.toneMappingExposure = P.exposure;
      if (k === 'keyLight') key.intensity = P.keyLight;
      if (k === 'spinSpeed') controls.autoRotateSpeed = P.spinSpeed;
      if (k === 'metalness') matSolid.metalness = P.metalness;
      if (k === 'roughness') matSolid.roughness = P.roughness;
      if (k === 'opacity') matSolid.opacity = P.opacity;
      if (k === 'wireOpacity') matWire.opacity = P.wireOpacity;
      if (k === 'pointSize') matPoint.size = P.pointSize;
      if (k === 'density' || k === 'size') geoDirty = true;
      dirty = true;
    });
  });

  function segBind(id, cb) {
    const root = document.getElementById(id);
    if (!root) return;
    root.addEventListener('click', function (e) {
      const b = e.target.closest('button'); if (!b) return;
      root.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
      cb(b);
    });
  }
  segBind('modes', function (b) {
    mode = b.dataset.m;
    solid.visible = (mode === 'solid' || mode === 'hybrid');
    wire.visible = (mode === 'wire' || mode === 'hybrid');
    points.visible = (mode === 'points' || mode === 'hybrid');
  });
  segBind('palettes', function (b) {
    palette = b.dataset.p;
    matSolid.color.setHex(PALETTES[palette].solid);
    matWire.color.setHex(PALETTES[palette].wire);
    matPoint.color.setHex(PALETTES[palette].point);
  });
  segBind('views', function (b) {
    view = b.dataset.v;
    const cp = view === 'top' ? [0, 8.5, 0.01] : view === 'side' ? [8.5, 0.6, 0] : [4.6, 3.2, 5.0];
    camera.position.set(cp[0], cp[1], cp[2]);
    camera.lookAt(0, 0, 0);
  });
  segBind('families', function (b) { family = b.dataset.f; dirty = true; });
  const spinRoot = document.getElementById('spin');
  if (spinRoot) spinRoot.addEventListener('click', function (e) {
    const b = e.target.closest('button'); if (!b) return;
    spin = b.dataset.s === '1'; controls.autoRotate = spin;
    spinRoot.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
  });
  const helpersRoot = document.getElementById('helpers');
  if (helpersRoot) helpersRoot.addEventListener('click', function (e) {
    const b = e.target.closest('button'); if (!b) return;
    const h = b.dataset.h; helpers[h] = !helpers[h];
    b.classList.toggle('on', helpers[h]);
    if (h === 'grid') grid.visible = helpers.grid;
    if (h === 'axes') axes.visible = helpers.axes;
  });

  /* URL 参数持久化：便于分享当前参数组合 */
  try {
    const q = new URLSearchParams(location.search);
    Object.keys(P).forEach(function (k) { if (q.has(k)) { const v = parseFloat(q.get(k)); if (!isNaN(v)) { P[k] = v; if (el[k]) el[k].value = v; } } });
    if (q.has('family') && ['sincos','ripple','saddle','wave'].indexOf(q.get('family')) >= 0) family = q.get('family');
  } catch (e) {}

  syncText();
  stage.renderer.setAnimationLoop(function () {
    if (dirty) refresh();
    if (modelRoot) {
      modelSpin += 0.006;
      modelRoot.rotation.y = modelSpin;
      modelRoot.position.y = 0.1 + Math.sin(modelSpin * 1.6) * 0.05;
    }
    controls.update();
    stage.draw();
  });
}

boot();
