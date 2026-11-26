/* 首页实验室预览：鞍面缓慢自转，可拖拽 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createStage, loadModel, webglOK } from './core.js';

const canvas = document.getElementById('lab-preview');

async function boot() {
  if (!canvas || !webglOK()) return;
  const stage = createStage(canvas, { fov: 40, camPos: [3.6, 2.4, 4.4], lookAt: [0, 0, 0], exposure: 0.92, postfx: { bloomStrength: 0.30, bloomThreshold: 0.92 } });
  const { scene, camera, renderer } = stage;

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.minDistance = 3.2;
  controls.maxDistance = 9;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.7;

  try {
    const m = await loadModel('models/ch_partial_saddle.gltf', 3.4);
    m.rotation.x = -0.18;
    scene.add(m);
  } catch (e) { console.warn('[preview] 模型加载失败', e); }

  renderer.setAnimationLoop(() => {
    controls.update();
    stage.draw();
  });
}
boot();
