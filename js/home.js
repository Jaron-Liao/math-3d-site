/* 首页 Hero：莫比乌斯带 + 金色星场，随鼠标视差 / 滚动旋转 */
import * as THREE from 'three';
import { createStage, loadModel, starField, webglOK } from './core.js';

const canvas = document.getElementById('hero-canvas');

async function boot() {
  if (!canvas) return;
  if (!webglOK()) {
    canvas.style.display = 'none';
    document.body.classList.add('no-webgl');
    return;
  }

  const stage = createStage(canvas, {
    alpha: true, fov: 34, camPos: [2.5, 0.95, 5.9], lookAt: [1.15, 0, 0], exposure: 1.12,
  });
  const { scene, camera, renderer } = stage;

  scene.add(starField(900, 11));

  let model = null;
  try {
    model = await loadModel('models/hero_mobius.gltf', 2.62);
    model.position.x = 1.42;
    model.rotation.set(0.62, -0.48, 0.16);
    scene.add(model);
  } catch (e) {
    console.warn('[hero] 模型加载失败', e);
  }

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('pointermove', (e) => {
    pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  const clock = new THREE.Clock();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  renderer.setAnimationLoop(() => {
    const t = clock.getElapsedTime();
    pointer.x += (pointer.tx - pointer.x) * 0.045;
    pointer.y += (pointer.ty - pointer.y) * 0.045;

    if (model) {
      model.rotation.y = -0.48 + t * (reduce ? 0.02 : 0.16) + pointer.x * 0.35;
      model.rotation.x = 0.62 + Math.sin(t * 0.42) * 0.07 - pointer.y * 0.22;
      model.position.y = Math.sin(t * 0.55) * 0.07;
      model.position.z = -Math.min(scrollY / window.innerHeight, 1.2) * 1.1;
    }
    const k = Math.min(scrollY / window.innerHeight, 1);
    camera.position.x = 2.5 + k * 0.8 + pointer.x * 0.18;
    camera.position.y = 0.95 - k * 0.25 - pointer.y * 0.16;
    camera.lookAt(1.25 + k * 0.4, 0, 0);

    renderer.render(scene, camera);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) renderer.setAnimationLoop(null);
  });
}

boot();
