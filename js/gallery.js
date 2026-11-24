/* 3D 展厅：封面流式排列（中间放大、两侧后退），拖拽/滚轮切换，点击进入章节 */
import * as THREE from 'three';
import { createStage, loadModel, starField, webglOK } from './core.js';

const S = window.SITE;
const n = S.chapters.length;
const canvas = document.getElementById('stage-canvas');

const ui = {
  kicker: document.getElementById('s-kicker'),
  name: document.getElementById('s-name'),
  sub: document.getElementById('s-sub'),
  dots: document.getElementById('dots'),
};

let cur = 0;          // 连续索引（拖动时为小数）
let target = 0;       // 吸附目标
let dragging = false;

/* 最短环形距离：-n/2 .. n/2 */
function offsetOf(i) {
  let d = (i - cur) % n;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

function buildDots() {
  ui.dots.innerHTML = S.chapters.map((c, i) => `<i data-i="${i}" class="${i === 0 ? 'on' : ''}"></i>`).join('');
  ui.dots.querySelectorAll('i').forEach((d) => {
    d.addEventListener('click', () => go(Number(d.dataset.i)));
  });
}

function syncUI(i) {
  const idx = ((i % n) + n) % n;
  const c = S.chapters[idx];
  ui.kicker.textContent = 'CHAPTER ' + c.no;
  ui.name.textContent = c.name;
  ui.sub.textContent = c.sub;
  ui.dots.querySelectorAll('i').forEach((d, k) => d.classList.toggle('on', k === idx));
  document.title = c.name + ' · 3D 展厅';
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
  if (!canvas || !webglOK()) {
    ui.name.textContent = '当前浏览器不支持 WebGL';
    return;
  }
  const stage = createStage(canvas, { fov: 40, camPos: [0, 1.1, 9.0], lookAt: [0, 0, 0], fog: [10, 34], exposure: 1.02 });
  const { scene, camera, renderer } = stage;

  scene.add(starField(1100, 15));

  const group = new THREE.Group();
  scene.add(group);

  const slots = [];
  S.chapters.forEach((c, i) => {
    const holder = new THREE.Group();
    holder.userData.chapterId = c.id;
    group.add(holder);
    slots.push({ holder });

    if (c.model) {
      loadModel(c.model, 2.35).then((m) => {
        m.userData.chapterId = c.id;
        holder.add(m);
      }).catch((e) => {
        console.warn('[gallery] 加载失败', c.model, e);
        holder.add(placeholder(0xd4af37));
      });
    } else {
      holder.add(placeholder(0x8a7226));
    }
  });

  buildDots();
  syncUI(0);

  /* 首帧摆位，避免全部堆在原点 */
  slots.forEach((s, i) => {
    const d = offsetOf(i);
    s.holder.position.set(d * 2.55, 0, -Math.abs(d) * 1.5);
    s.holder.rotation.y = -d * 0.26;
  });

  document.getElementById('s-prev').addEventListener('click', () => go(Math.round(target) - 1));
  document.getElementById('s-next').addEventListener('click', () => go(Math.round(target) + 1));
  document.getElementById('s-open').addEventListener('click', () => {
    const idx = ((Math.round(target) % n) + n) % n;
    location.href = 'chapter.html?c=' + S.chapters[idx].id;
  });

  let wheelLock = 0;
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const now = performance.now();
    if (now - wheelLock < 380) return;
    wheelLock = now;
    go(Math.round(target) + (e.deltaY > 0 ? 1 : -1));
  }, { passive: false });

  /* 拖拽与点击 */
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
        while (o && !o.userData.chapterId) o = o.parent;
        if (o && o.userData.chapterId) { location.href = 'chapter.html?c=' + o.userData.chapterId; return; }
      }
    } else {
      target = Math.round(cur);
      syncUI(Math.round(cur));
    }
  });

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
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

      const sc = ad < 0.5 ? 1 : Math.max(0.52, 1 - (ad - 0.5) * 0.34);
      s.holder.scale.setScalar(sc);
      s.holder.visible = ad <= 2.6;
    });

    camera.position.x = Math.sin(t * 0.18) * 0.35;
    camera.position.y = 1.1 + Math.sin(t * 0.24) * 0.05;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  });
}

boot();
