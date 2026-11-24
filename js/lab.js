/* 参数曲面实验室：z = a·sin(bx)·cos(cy)，实时重建 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createStage, webglOK } from './core.js';

const canvas = document.getElementById('lab-canvas');
const N = 120;          // 每边分段
const SIZE = 6.4;       // 平面边长

const P = { a: 1, b: 1.6, c: 1.6 };
let mode = 'solid';
let spin = true;

const el = {
  a: document.getElementById('p-a'),
  b: document.getElementById('p-b'),
  c: document.getElementById('p-c'),
  va: document.getElementById('v-a'),
  vb: document.getElementById('v-b'),
  vc: document.getElementById('v-c'),
  note: document.getElementById('lab-note'),
};

function surfaceZ(x, y) {
  return P.a * Math.sin(P.b * x) * Math.cos(P.c * y);
}

function buildPositions(geo) {
  const pos = geo.attributes.position;
  const half = SIZE / 2;
  for (let i = 0; i < pos.count; i++) {
    const x = (pos.getX(i) / half) * 3;
    const y = (pos.getY(i) / half) * 3;
    pos.setZ(i, surfaceZ(x, y) * 0.55);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

function boot() {
  if (!canvas || !webglOK()) return;
  const stage = createStage(canvas, { fov: 42, camPos: [4.6, 3.2, 5.0], lookAt: [0, 0, 0], exposure: 1.05 });
  const { scene, camera, renderer } = stage;

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 3.4;
  controls.maxDistance = 13;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.55;

  const geo = new THREE.PlaneGeometry(SIZE, SIZE, N, N);
  buildPositions(geo);

  const solid = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color: 0xd4af37, metalness: 0.72, roughness: 0.26, side: THREE.DoubleSide,
    flatShading: false,
  }));
  solid.rotation.x = -Math.PI / 2;

  const wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
    color: 0xf0d98c, wireframe: true, transparent: true, opacity: 0.55,
  }));
  wire.rotation.x = -Math.PI / 2;
  wire.visible = false;

  const points = new THREE.Points(geo, new THREE.PointsMaterial({
    color: 0xa2d2ff, size: 0.022, transparent: true, opacity: 0.8,
  }));
  points.rotation.x = -Math.PI / 2;
  points.visible = false;

  const group = new THREE.Group();
  group.add(solid, wire, points);
  scene.add(group);

  /* 参考平面 */
  const grid = new THREE.GridHelper(SIZE, 16, 0x3a321e, 0x241f16);
  grid.position.y = -1.5;
  scene.add(grid);

  let dirty = true;
  const refresh = () => { buildPositions(geo); dirty = false; syncText(); };

  function syncText() {
    el.va.textContent = P.a.toFixed(2);
    el.vb.textContent = P.b.toFixed(1);
    el.vc.textContent = P.c.toFixed(1);
    document.getElementById('lab-tag').textContent =
      `z = ${P.a.toFixed(2)}·sin(${P.b.toFixed(1)}x)·cos(${P.c.toFixed(1)}y)`;
    const gx = P.a * P.b, gy = P.a * P.c;
    el.note.innerHTML = `在原点附近 <span>$z\\approx ${gx.toFixed(2)}x-${(P.a * P.c * 0).toFixed(0)}y$</span>；
      沿 x 方向的斜率上界为 <span>$|a b|=${Math.abs(gx).toFixed(2)}$</span>，
      沿 y 方向为 <span>$|a c|=${Math.abs(gy).toFixed(2)}$</span>。
      频率越大，极值点越密，网格需要越密才能分辨——这正是数值积分要求步长与频率匹配的原因。`;
    window.renderMath(el.note);
  }

  const bind = (input, key) => {
    input.addEventListener('input', () => {
      P[key] = parseFloat(input.value);
      dirty = true;
    });
  };
  bind(el.a, 'a'); bind(el.b, 'b'); bind(el.c, 'c');

  document.querySelectorAll('#modes button').forEach((btn) => {
    btn.addEventListener('click', () => {
      mode = btn.dataset.m;
      document.querySelectorAll('#modes button').forEach((b) => b.classList.toggle('on', b === btn));
      solid.visible = mode === 'solid';
      wire.visible = mode === 'wire';
      points.visible = mode === 'points';
    });
  });

  document.querySelectorAll('#spin button').forEach((btn) => {
    btn.addEventListener('click', () => {
      spin = btn.dataset.s === '1';
      controls.autoRotate = spin;
      document.querySelectorAll('#spin button').forEach((b) => b.classList.toggle('on', b === btn));
    });
  });

  syncText();

  renderer.setAnimationLoop(() => {
    if (dirty) refresh();
    controls.update();
    renderer.render(scene, camera);
  });
}

boot();
