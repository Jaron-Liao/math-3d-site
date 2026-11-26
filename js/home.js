/* 主页动态栏引擎：10 类 3D 原型 × 10 组参数 = 100 个变体，每 60 秒换一版且不重复 */
import * as THREE from 'three';
import { createStage, loadModel, starField, webglOK } from './core.js';

const canvas = document.getElementById('hero-canvas');
const hud = document.getElementById('hero-hud');
const fade = document.getElementById('hero-fade');
const qs = new URLSearchParams(location.search);
const ROTATE_SEC = Math.max(5, Number(qs.get('rotate')) || 60);
/* 移动端 / 小屏降级：减少粒子量、关闭后期特效，保证帧率 */
const LOW_END = window.matchMedia('(max-width: 760px)').matches
  || (navigator.hardwareConcurrency || 8) <= 4;

function col(hex, mul) {
  const c = new THREE.Color(hex);
  if (mul) c.multiplyScalar(mul);
  return c;
}

/* ── 原型 1：产品转台（GLB） ── */
async function buildGLB(v) {
  const g = new THREE.Group();
  const M = window.MODELS || [];
  // 首页只挑"型体紧凑、适合做 hero"的模型，避免大平面在近景产生眩光
  const CURATED = ['hero_mobius', 'ch_limit_rings', 'ex_torus_knot', 'ex_supershape',
    'ex_rose_surface', 'ex_klein_bottle', 'ex_harmonic', 'ex_gyroid', 'ex_lissajous', 'ex_catenoid'];
  const pick = CURATED[v.seed % CURATED.length];
  const m = M.find((x) => x.id === pick) || M[v.seed % Math.max(1, M.length)];
  let obj = null;
  if (m) {
    try { obj = await loadModel(m.file, 2.55); } catch (e) { obj = null; }
  }
  if (!obj) {
    const geo = new THREE.TorusKnotGeometry(0.8, 0.22, 160, 24, 2, 3);
    obj = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: col(v.pal.a), metalness: 1, roughness: 0.22 }));
  }
  obj.traverse((o) => {
    if (o.isMesh && o.material) {
      const ms = Array.isArray(o.material) ? o.material : [o.material];
      ms.forEach((mm) => {
        if (mm.metalness !== undefined && mm.metalness > 0.6) {
          mm.metalness = 0.62;
          mm.roughness = Math.max(0.22, mm.roughness || 0.3);
        }
        if (mm.color) mm.color.lerp(col(v.pal.a), 0.45);
        mm.envMapIntensity = 1.7;
        mm.needsUpdate = true;
      });
    }
  });
  obj.position.set(1.35, -0.05, 0);
  obj.rotation.set(0.62, -0.48, 0.16);
  g.add(obj);
  return {
    group: g,
    tick(t) {
      obj.rotation.y = -0.48 + t * 0.18 * v.speed;
      obj.rotation.x = 0.62 + Math.sin(t * 0.42) * 0.08;
      obj.position.y = Math.sin(t * 0.55) * 0.07;
    },
  };
}

/* ── 原型 2：粒子云（球 ↔ 环 ↔ 螺旋 形变） ── */
function buildCloud(v) {
  const N = LOW_END ? 2800 : 6200;
  const g = new THREE.Group();
  const pos = new Float32Array(N * 3);
  const sph = [], tor = [], hel = [];
  for (let i = 0; i < N; i++) {
    const u = Math.random(), w = Math.random();
    const th = u * Math.PI * 2, ph = Math.acos(2 * w - 1);
    const r = 0.9 + Math.random() * 0.25;
    sph.push([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)]);
    const a = Math.random() * Math.PI * 2, R = 1.15, rr = 0.34 * Math.sqrt(Math.random());
    tor.push([(R + rr * Math.cos(a * 6)) * Math.cos(a), rr * Math.sin(a * 6), (R + rr * Math.cos(a * 6)) * Math.sin(a)]);
    const t2 = i / N * Math.PI * 6;
    hel.push([0.75 * Math.cos(t2), (i / N - 0.5) * 2.2, 0.75 * Math.sin(t2)]);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: col(v.pal.b), size: 0.032, transparent: true, opacity: 1,
    depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const pts = new THREE.Points(geo, mat);
  pts.position.set(1.35, 0, 0);
  g.add(pts);
  return {
    group: g,
    tick(t) {
      const k = (Math.sin(t * 0.35 * v.speed) + 1) / 2;
      const k2 = (Math.sin(t * 0.21 * v.speed + 1.7) + 1) / 2;
      for (let i = 0; i < N; i++) {
        const a = sph[i], b = tor[i], c = hel[i];
        const x = a[0] * (1 - k) + b[0] * k;
        const y = a[1] * (1 - k) + b[1] * k;
        const z = a[2] * (1 - k) + b[2] * k;
        pos[i * 3] = x * (1 - k2 * 0.5) + c[0] * k2 * 0.5;
        pos[i * 3 + 1] = y * (1 - k2 * 0.5) + c[1] * k2 * 0.5;
        pos[i * 3 + 2] = z * (1 - k2 * 0.5) + c[2] * k2 * 0.5;
      }
      geo.attributes.position.needsUpdate = true;
      pts.rotation.y = t * 0.12 * v.speed;
    },
  };
}

/* ── 原型 3：线框地形 ── */
function buildWave(v) {
  const g = new THREE.Group();
  const geo = new THREE.PlaneGeometry(7.2, 7.2, 96, 96);
  const base = geo.attributes.position.array.slice();
  const mat = new THREE.MeshStandardMaterial({
    color: col(v.pal.a), wireframe: true, metalness: 0.8, roughness: 0.35,
    transparent: true, opacity: 0.85,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.x = 1.1;
  g.add(mesh);
  return {
    group: g,
    tick(t) {
      const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = base[i * 3], y = base[i * 3 + 1];
        const d = Math.sqrt(x * x + y * y);
        p.array[i * 3 + 2] = Math.sin(d * 1.9 * v.freq - t * 1.4 * v.speed) * 0.28 * v.amp
          + Math.cos(x * 1.3 * v.freq + t * 0.7) * 0.12;
      }
      p.needsUpdate = true;
      geo.computeVertexNormals();
      mesh.rotation.z = t * 0.04 * v.speed;
    },
  };
}

/* ── 原型 4：环面纽结 ── */
function buildKnot(v) {
  const g = new THREE.Group();
  const geo = new THREE.TorusKnotGeometry(0.88, 0.26, 240, 32, 2 + (v.seed % 3), 3);
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color: col(v.pal.a), metalness: 0.72, roughness: 0.24, envMapIntensity: 1.5,
    emissive: col(v.pal.c), emissiveIntensity: 0.18,
  }));
  mesh.position.x = 1.2;
  g.add(mesh);
  return {
    group: g,
    tick(t) {
      mesh.rotation.x = 0.5 + t * 0.22 * v.speed;
      mesh.rotation.y = t * 0.3 * v.speed;
      mesh.scale.setScalar(1 + Math.sin(t * 0.8) * 0.03);
    },
  };
}

/* ── 原型 5：碎片轨道 ── */
function buildShards(v) {
  const g = new THREE.Group();
  const count = 260;
  const geo = new THREE.TetrahedronGeometry(0.12, 0);
  const mat = new THREE.MeshStandardMaterial({
    color: col(v.pal.a), metalness: 0.7, roughness: 0.28, envMapIntensity: 1.6, emissive: col(v.pal.c), emissiveIntensity: 0.34,
  });
  const inst = new THREE.InstancedMesh(geo, mat, count);
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      r: 0.75 + Math.random() * 1.15,
      a: Math.random() * Math.PI * 2,
      y: (Math.random() - 0.5) * 1.5,
      s: 0.4 + Math.random() * 0.9,
      sp: (0.25 + Math.random() * 0.7) * (Math.random() > 0.5 ? 1 : -1),
    });
  }
  inst.position.x = 1.2;
  g.add(inst);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const sc = new THREE.Vector3();
  const p = new THREE.Vector3();
  return {
    group: g,
    tick(t) {
      for (let i = 0; i < count; i++) {
        const d = data[i];
        const a = d.a + t * 0.22 * d.sp * v.speed;
        p.set(Math.cos(a) * d.r, d.y + Math.sin(t * 0.7 + i) * 0.08, Math.sin(a) * d.r);
        e.set(t * 0.6 * d.sp, t * 0.5 * d.sp, a);
        q.setFromEuler(e);
        sc.setScalar(d.s);
        m4.compose(p, q, sc);
        inst.setMatrixAt(i, m4);
      }
      inst.instanceMatrix.needsUpdate = true;
      g.rotation.y = t * 0.05 * v.speed;
    },
  };
}

/* ── 原型 6：扭转带 ── */
function buildRibbon(v) {
  const g = new THREE.Group();
  const NU = 96, NV = 8;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array((NU + 1) * (NV + 1) * 3);
  const idx = [];
  for (let i = 0; i <= NU; i++) {
    for (let j = 0; j <= NV; j++) {
      const k = (i * (NV + 1) + j) * 3;
      pos[k] = (i / NU - 0.5) * 5.2;
      pos[k + 1] = (j / NV - 0.5) * 0.9;
      pos[k + 2] = 0;
    }
  }
  for (let i = 0; i < NU; i++) {
    for (let j = 0; j < NV; j++) {
      const a = i * (NV + 1) + j, b = a + 1, c = a + NV + 1, d = c + 1;
      idx.push(a, b, d, a, d, c);
    }
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setIndex(idx);
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color: col(v.pal.a), metalness: 0.72, roughness: 0.22, side: THREE.DoubleSide, envMapIntensity: 1.4, emissive: col(v.pal.c), emissiveIntensity: 0.2,
  }));
  mesh.position.x = 1.15;
  mesh.rotation.set(0.35, 1.05, 0);
  mesh.scale.setScalar(0.95);
  g.add(mesh);
  return {
    group: g,
    tick(t) {
      const p = geo.attributes.position;
      for (let i = 0; i <= NU; i++) {
        const u = i / NU;
        const tw = Math.sin(u * Math.PI * 2 + t * 0.8 * v.speed) * v.twist;
        for (let j = 0; j <= NV; j++) {
          const k = (i * (NV + 1) + j) * 3;
          const s = (j / NV - 0.5) * 0.9;
          p.array[k + 1] = Math.sin(tw) * s;
          p.array[k + 2] = Math.cos(tw) * s;
        }
      }
      p.needsUpdate = true;
      geo.computeVertexNormals();
      mesh.rotation.z = Math.sin(t * 0.3) * 0.25;
    },
  };
}

/* ── 原型 7：同心环阵 ── */
function buildRings(v) {
  const g = new THREE.Group();
  const count = 26;
  const geo = new THREE.TorusGeometry(1, 0.0075, 6, 150);
  const mat = new THREE.MeshStandardMaterial({ color: col(v.pal.a), metalness: 0.8, roughness: 0.22, emissive: col(v.pal.c), emissiveIntensity: 0.25 });
  const inst = new THREE.InstancedMesh(geo, mat, count);
  inst.position.x = 1.15;
  g.add(inst);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
  return {
    group: g,
    tick(t) {
      for (let i = 0; i < count; i++) {
        const k = i / count;
        const r = 0.28 + k * 1.05;
        p.set(0, (k - 0.5) * 0.75, 0);
        e.set(Math.PI / 2 + Math.sin(t * 0.4 + k * 3) * 0.45, t * 0.25 * v.speed + k, 0);
        q.setFromEuler(e);
        s.setScalar(r);
        m4.compose(p, q, s);
        inst.setMatrixAt(i, m4);
      }
      inst.instanceMatrix.needsUpdate = true;
      g.rotation.y = Math.sin(t * 0.2) * 0.3;
    },
  };
}

/* ── 原型 8：流场 ── */
function buildField(v) {
  const g = new THREE.Group();
  const N = LOW_END ? 420 : 900;
  const pos = new Float32Array(N * 6);
  const seeds = [];
  for (let i = 0; i < N; i++) {
    seeds.push({
      x: (Math.random() - 0.5) * 3.4,
      y: (Math.random() - 0.5) * 1.9,
      z: (Math.random() - 0.5) * 3.4,
      ph: Math.random() * Math.PI * 2,
    });
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.LineBasicMaterial({
    color: col(v.pal.b).lerp(new THREE.Color('#ffffff'), 0.25), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending,
  });
  const lines = new THREE.LineSegments(geo, mat);
  lines.position.x = 1.15;
  g.add(lines);
  const len = 0.24 + v.amp * 0.14;
  return {
    group: g,
    tick(t) {
      for (let i = 0; i < N; i++) {
        const s = seeds[i];
        const dx = Math.sin(s.y * 1.6 + t * 0.5 * v.speed + s.ph) * 0.5;
        const dy = Math.cos(s.x * 1.4 + t * 0.4 * v.speed) * 0.5;
        const dz = Math.sin((s.x + s.y) * 1.2 + t * 0.3) * 0.5;
        const x = s.x + Math.sin(t * 0.2 + s.ph) * 0.15;
        const y = s.y + Math.cos(t * 0.17 + s.ph) * 0.1;
        const z = s.z + Math.sin(t * 0.13 + s.ph) * 0.15;
        pos[i * 6] = x; pos[i * 6 + 1] = y; pos[i * 6 + 2] = z;
        pos[i * 6 + 3] = x + dx * len;
        pos[i * 6 + 4] = y + dy * len;
        pos[i * 6 + 5] = z + dz * len;
      }
      geo.attributes.position.needsUpdate = true;
      lines.rotation.y = t * 0.06 * v.speed;
    },
  };
}

/* ── 原型 9：有机形变 ── */
function buildBlob(v) {
  const g = new THREE.Group();
  const geo = new THREE.IcosahedronGeometry(1.05, 5);
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color: col(v.pal.a), metalness: 0.68, roughness: 0.2, envMapIntensity: 1.5,
    emissive: col(v.pal.c), emissiveIntensity: 0.16,
  }));
  mesh.position.x = 1.2;
  g.add(mesh);
  const base = geo.attributes.position.array.slice();
  return {
    group: g,
    tick(t) {
      const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = base[i * 3], y = base[i * 3 + 1], z = base[i * 3 + 2];
        const n = Math.sin(x * 2.2 * v.freq + t * 1.1) * Math.cos(y * 2.0 * v.freq - t * 0.9)
          * Math.sin(z * 1.8 * v.freq + t * 0.7);
        const k = 1 + n * 0.16 * v.amp;
        p.array[i * 3] = x * k;
        p.array[i * 3 + 1] = y * k;
        p.array[i * 3 + 2] = z * k;
      }
      p.needsUpdate = true;
      geo.computeVertexNormals();
      mesh.rotation.y = t * 0.2 * v.speed;
      mesh.rotation.x = Math.sin(t * 0.3) * 0.2;
    },
  };
}

/* ── 原型 10：空间网格（纵深） ── */
function buildGrid(v) {
  const g = new THREE.Group();
  const size = 26;
  const grid = new THREE.GridHelper(size, 52, col(v.pal.b).getHex(), col(v.pal.c).multiplyScalar(1.6).getHex());
  grid.position.set(1.1, -1.6, 0);
  g.add(grid);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshStandardMaterial({ color: col(v.pal.c).multiplyScalar(1.4), metalness: 0.5, roughness: 0.45, emissive: col(v.pal.c), emissiveIntensity: 0.22 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(1.1, -1.62, 0);
  g.add(floor);

  const pillars = new THREE.Group();
  for (let i = 0; i < 14; i++) {
    const h = 0.6 + Math.random() * 2.2;
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, h, 0.18),
      new THREE.MeshStandardMaterial({ color: col(v.pal.a), metalness: 0.9, roughness: 0.3 }),
    );
    box.position.set(1.1 + (Math.random() - 0.5) * 8, -1.6 + h / 2, (Math.random() - 0.5) * 9);
    pillars.add(box);
  }
  g.add(pillars);

  return {
    group: g,
    tick(t) {
      grid.position.z = (t * 0.35 * v.speed) % 0.5;
      pillars.position.z = (t * 0.35 * v.speed) % 0.5;
      g.rotation.y = Math.sin(t * 0.12) * 0.12;
    },
  };
}

const BUILDERS = {
  glb: buildGLB, cloud: buildCloud, wave: buildWave, knot: buildKnot, shards: buildShards,
  ribbon: buildRibbon, rings: buildRings, field: buildField, blob: buildBlob, grid: buildGrid,
};

function boot() {
  if (!canvas || !webglOK() || !window.HERO) {
    document.body.classList.add('no-webgl');
    if (hud) hud.textContent = '当前浏览器不支持 WebGL';
    return;
  }

  const stage = createStage(canvas, {
    alpha: true, fov: 34, camPos: [2.5, 0.95, 5.9], lookAt: [1.25, 0, 0], exposure: 1.1,
    postfx: LOW_END ? false : { bloomStrength: 0.30, bloomThreshold: 0.94 },
  });
  const { scene, camera } = stage;
  scene.add(starField(760, 11));

  let group = null;
  let tick = null;
  let busy = false;

  function clear() {
    if (!group) return;
    scene.remove(group);
    group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const ms = Array.isArray(o.material) ? o.material : [o.material];
        ms.forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
      }
    });
    group = null; tick = null;
  }

  async function apply(v) {
    busy = true;
    stage.renderer.toneMappingExposure = v.arch === 'glb' ? 0.86 : 0.98;
    if (stage.key) stage.key.intensity = v.arch === 'glb' ? 1.7 : 2.3;
    if (fade) fade.classList.add('on');
    await new Promise((r) => setTimeout(r, 260));
    clear();
    try {
      const built = await BUILDERS[v.arch](v);
      group = built.group;
      tick = built.tick;
      scene.add(group);
    } catch (e) {
      console.warn('[hero] 变体构建失败', v, e);
    }
    if (hud) {
      hud.innerHTML = '<b>变体 ' + String(v.id + 1).padStart(3, '0') + ' / 100</b><span>' + v.name + '</span>';
    }
    if (fade) {
      await new Promise((r) => setTimeout(r, 120));
      fade.classList.remove('on');
    }
    busy = false;
  }

  function nextVariant() {
    if (busy) return;
    apply(window.HERO.next().variant);
  }

  const clock = new THREE.Clock();
  stage.renderer.setAnimationLoop(() => {
    const t = clock.getElapsedTime();
    if (tick) {
      try { tick(t); } catch (e) { /* 单帧异常不打断播放 */ }
    }
    camera.position.x = 2.5 + Math.sin(t * 0.12) * 0.14;
    camera.lookAt(1.25, 0, 0);
    stage.draw(t);
  });

  const fixed = qs.get('v');
  if (fixed !== null) {
    const v = window.HERO.variants[Number(fixed) % window.HERO.total];
    apply(v);
  } else {
    nextVariant();
    setInterval(nextVariant, ROTATE_SEC * 1000);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'n' || e.key === 'N') nextVariant();
  });
  const btn = document.getElementById('hero-next');
  if (btn) btn.addEventListener('click', nextVariant);
}

boot();
