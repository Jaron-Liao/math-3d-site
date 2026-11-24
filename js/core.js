/* 共用 3D 舞台：渲染器 / 环境光照 / 模型加载 / 自适应 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/** 生成一张程序化环境贴图（黑金影棚），让金属材质有反射 */
function studioEnv(renderer) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const g = c.getContext('2d');
  const base = g.createLinearGradient(0, 0, 0, 512);
  base.addColorStop(0.00, '#1b1710');
  base.addColorStop(0.42, '#3a3021');
  base.addColorStop(0.52, '#16130d');
  base.addColorStop(1.00, '#080706');
  g.fillStyle = base; g.fillRect(0, 0, 1024, 512);

  const glow = (x, y, r, col, a) => {
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, `rgba(${col},${a})`);
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = rg; g.fillRect(x - r, y - r, r * 2, r * 2);
  };
  glow(250, 120, 260, '255,238,196', 0.95);
  glow(760, 90, 220, '212,175,55', 0.6);
  glow(560, 300, 300, '120,150,190', 0.22);

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createStage(canvas, opts = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: !!opts.alpha,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = opts.exposure === undefined ? 1.05 : opts.exposure;
  if (!opts.alpha) renderer.setClearColor(0x0b0a07, 1);

  const scene = new THREE.Scene();
  if (opts.fog) scene.fog = new THREE.Fog(0x0b0a07, opts.fog[0], opts.fog[1]);
  scene.environment = studioEnv(renderer);

  const camera = new THREE.PerspectiveCamera(opts.fov || 38, 1, 0.05, 300);
  const p = opts.camPos || [0, 1.2, 5.2];
  camera.position.set(p[0], p[1], p[2]);
  if (opts.lookAt) camera.lookAt(new THREE.Vector3(...opts.lookAt));

  const key = new THREE.DirectionalLight(0xffe9bd, opts.keyIntensity || 2.6);
  key.position.set(4, 6, 5);
  const rim = new THREE.DirectionalLight(0x9fc4ff, 1.5);
  rim.position.set(-6, 2, -4);
  const amb = new THREE.HemisphereLight(0xffe3ad, 0x0a0906, 0.55);
  scene.add(key, rim, amb);

  function resize() {
    const host = canvas.parentElement || canvas;
    const w = Math.max(1, host.clientWidth);
    const h = Math.max(1, host.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement || canvas);
  window.addEventListener('resize', resize);

  return { renderer, scene, camera, key, rim, amb, resize, dispose: () => ro.disconnect() };
}

const loader = new GLTFLoader();

/** 加载 GLB，自动居中并缩放至目标尺寸（最长边） */
export async function loadModel(path, targetSize = 2.6) {
  const gltf = await loader.loadAsync(path);
  const root = gltf.scene;
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3(); box.getSize(size);
  const center = new THREE.Vector3(); box.getCenter(center);
  const maxSide = Math.max(size.x, size.y, size.z) || 1;
  const s = targetSize / maxSide;
  root.scale.setScalar(s);
  root.position.sub(center.multiplyScalar(s));
  root.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = false; o.receiveShadow = false;
      if (o.material) {
        o.material.envMapIntensity = 1.25;
        o.material.side = THREE.DoubleSide;
      }
    }
  });
  return root;
}

/** 金色点云背景 */
export function starField(count = 700, radius = 9) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * (0.55 + Math.random() * 0.45);
    const t = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(t);
    pos[i * 3 + 1] = r * Math.cos(ph) * 0.72;
    pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(t);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xd9bd6a, size: 0.022, transparent: true, opacity: 0.55,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
}

export function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}
