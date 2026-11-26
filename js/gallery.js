/* 3D 展厅：20 座模型封面流，拖拽/滚轮切换，点击进入章节或模型详情 */
import * as THREE from 'three';
import { createStage, loadModel, starField, webglOK } from './core.js';

const M = window.MODELS || [];
const n = M.length;
const canvas = document.getElementById('stage-canvas');

const ui = {
  kicker: document.getElementById('s-kicker'),
  name: document.getElementById('s-name'),
  sub: document.getElementById('s-sub'),
  dots: document.getElementById('dots'),
};

let cur = 0;
let target = 0;
let dragging = false;

function offsetOf(i) {
  let d = (i - cur) % n;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

function buildDots() {
  ui.dots.innerHTML = M.map((m, i) => `<i data-i="${i}" class="${i === 0 ? 'on' : ''}" title="${m.name}"></i>`).join('');
  ui.dots.querySelectorAll('i').forEach((d) => {
    d.addEventListener('click', () => go(Number(d.dataset.i)));
  });
}

function syncUI(i) {
  const idx = ((i % n) + n) % n;
  const m = M[idx];
  ui.kicker.textContent = m.cat + ' · ' + m.en;
  ui.name.textContent = m.name;
  ui.sub.textContent = m.desc;
  ui.dots.querySelectorAll('i').forEach((d, k) => d.classList.toggle('on', k === idx));
  document.title = m.name + ' · 3D 展厅';
}

function go(i) {
  target = i;
  syncUI(i);
}

function placeholder(color) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.55, 1),
    new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.5 }),
  ));
  return g;
}

async function boot() {
  if (!canvas || !webglOK() || !n) {
    if (ui.name) ui.name.textContent = '当前浏览器不支持 WebGL';
    return;
  }
  const stage = createStage(canvas, {
    fov: 40, camPos: [0, 1.1, 9.0], lookAt: [0, 0, 0], fog: [10, 34], exposure: 1.02,
    postfx: { bloomStrength: 0.78, bloomThreshold: 0.7 },
  });
  const { scene, camera } = stage;

  scene.add(starField(1100, 15));

  const group = new THREE.Group();
  scene.add(group);

  const slots = [];
  M.forEach((m, i) => {
    const holder = new THREE.Group();
    holder.userData.href = m.ch ? 'chapter.html?c=' + m.ch : 'model.html?id=' + m.id;
    group.add(holder);
    slots.push({ holder });

    loadModel(m.file, 1.6).then((obj) => {
      obj.userData.href = holder.userData.href;
      holder.add(obj);
    }).catch((e) => {
      console.warn('[gallery] 加载失败', m.file, e);
      holder.add(placeholder(0xd4af37));
    });
  });

  buildDots();
  syncUI(0);

  slots.forEach((s, i) => {
    const d = offsetOf(i);
    s.holder.position.set(d * 2.55, 0, -Math.abs(d) * 1.5);
    s.holder.rotation.y = -d * 0.26;
  });

  document.getElementById('s-prev').addEventListener('click', () => go(Math.round(target) - 1));
  document.getElementById('s-next').addEventListener('click', () => go(Math.round(target) + 1));
  document.getElementById('s-open').addEventListener('click', () => {
    const idx = ((Math.round(target) % n) + n) % n;
    const m = M[idx];
    location.href = m.ch ? 'chapter.html?c=' + m.ch : 'model.html?id=' + m.id;
  });

  let wheelLock = 0;
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const now = performance.now();
    if (now - wheelLock < 420) return;
    wheelLock = now;
    go(Math.round(target) + (e.deltaY > 0 ? 1 : -1));
  }, { passive: false });

  /* 键盘导航：←→ 切换展品，回车/空格 进入详情 */
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { go(Math.round(target) + 1); }
    else if (e.key === 'ArrowLeft') { go(Math.round(target) - 1); }
    else if (e.key === 'Enter' || e.key === ' ') {
      const idx = ((Math.round(target) % n) + n) % n;
      const m = M[idx];
      location.href = m.ch ? 'chapter.html?c=' + m.ch : 'model.html?id=' + m.id;
    }
  });

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let startX = 0, startCur = 0, moved = 0;

  canvas.addEventListener('pointerdown', (e) => {
    dragging = true; startX = e.clientX; startCur = cur; moved = 0;
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    moved += Math.abs(dx);
    cur = startCur - dx / 150;
  });
  window.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    if (moved < 8) {
      const rect = canvas.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects(group.children, true);
      for (const h of hits) {
        let o = h.object;
        while (o && !o.userData.href) o = o.parent;
        if (o && o.userData.href) { location.href = o.userData.href; return; }
      }
    } else {
      target = Math.round(cur);
      syncUI(Math.round(cur));
    }
  });

  const clock = new THREE.Clock();
  stage.renderer.setAnimationLoop(() => {
    const t = clock.getElapsedTime();

    if (!dragging) cur += (target - cur) * 0.09;
    if (Math.abs(target - cur) < 0.001) cur = target;

    slots.forEach((s, i) => {
      const d = offsetOf(i);
      const ad = Math.abs(d);
      const tx = d * 2.55;
      const tz = -ad * 1.5;
      const ty = (ad < 0.01 ? 0.06 : 0) + Math.sin(t * 0.7 + i) * 0.03;

      s.holder.position.x += (tx - s.holder.position.x) * 0.14;
      s.holder.position.y += (ty - s.holder.position.y) * 0.14;
      s.holder.position.z += (tz - s.holder.position.z) * 0.14;
      s.holder.rotation.y = -d * 0.26;

      const sc = ad < 0.5 ? 1 : Math.max(0.5, 1 - (ad - 0.5) * 0.34);
      s.holder.scale.setScalar(sc);
      s.holder.visible = ad <= 2.8;
    });

    camera.position.x = Math.sin(t * 0.18) * 0.35;
    camera.position.y = 1.1 + Math.sin(t * 0.24) * 0.05;
    camera.lookAt(0, 0, 0);
    stage.draw(t);
  });
}

boot();
