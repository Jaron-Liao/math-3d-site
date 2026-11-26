/* 章节页：内容渲染 + 该章 3D 模型 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createStage, loadModel, webglOK } from './core.js';

const S = window.SITE;
const params = new URLSearchParams(location.search);
const id = Number(params.get('c')) || 1;
const ch = S.chapters.find((c) => c.id === id) || S.chapters[0];

document.title = ch.name + ' · 高等数学 3D';
document.getElementById('c-kicker').textContent = 'CHAPTER ' + ch.no + ' · ' + ch.en;
document.getElementById('c-title').textContent = ch.name;
document.getElementById('c-lead').textContent = ch.lead || '';

/* ── 正文 ── */
const body = document.getElementById('c-body');
const parts = [];

if (ch.status !== 'live' || !ch.sections.length) {
  const topics = (ch.sub || '').split('·').map((s) => s.trim()).filter(Boolean);
  parts.push(`<div class="box hint"><div class="lab">本章状态</div>
    <p>正文正在补全。已确定的主题如下，可先到 <a href="gallery.html">3D 展厅</a> 查看本章模型。</p>
    <ul>${topics.map((t) => `<li>${t}</li>`).join('')}</ul></div>`);
} else {
  ch.sections.forEach((s) => {
    parts.push(`<h2>${s.h}</h2>`);
    if (s.html) parts.push(s.html);
    (s.boxes || []).forEach((b) => {
      parts.push(`<div class="box ${b.type || ''}"><div class="lab">${b.label}</div>${b.html}</div>`);
    });
  });
}

if (ch.formulas && ch.formulas.length) {
  parts.push('<h2>公式速查</h2>');
  ch.formulas.forEach((f) => {
    parts.push(`<div class="formula">$${f.tex}$</div>`);
    if (f.note) parts.push(`<p style="text-align:center;color:var(--text-3);font-size:12.5px;margin-top:-8px">${f.note}</p>`);
  });
}

if (ch.example) {
  const e = ch.example;
  parts.push('<h2>典型例题</h2>');
  parts.push(`<h3>${e.title}</h3>`);
  parts.push(`<div class="box"><div class="lab">题目</div><p>${e.stem}</p></div>`);
  parts.push(`<ol>${e.steps.map((s) => `<li>${s}</li>`).join('')}</ol>`);
  parts.push(`<div class="box hint"><div class="lab">结论</div><p>${e.concl}</p></div>`);
}

if (ch.traps && ch.traps.length) {
  parts.push('<h2>易错点</h2>');
  ch.traps.forEach((t) => {
    parts.push(`<div class="box warn"><div class="lab">${t.h}</div><p>${t.b}</p></div>`);
  });
}

/* ── 外部教学资源（源数据 data/resources.json → 构建产物 js/resources.js） ── */
const resMap = (window.SITE_RESOURCES || {})[String(ch.id)];
if (resMap && Array.isArray(resMap.items) && resMap.items.length) {
  parts.push('<h2>外部教学资源</h2>');
  parts.push(`<div class="box hint"><div class="lab">来源说明</div>
    <p>以下 ${resMap.items.length} 条公开课程链接由 <code>data/resources.json</code> 按本章知识点自动挂载，不复制任何版权内容；正文未补全时可先据此学习。</p></div>`);
  resMap.items.forEach((r) => {
    const covers = (r.covers || []).slice(0, 6).join(' · ');
    parts.push(`<div class="box"><div class="lab">${(r.platform || 'link').toUpperCase()}${r.author ? ' · ' + r.author : ''}</div>
      <p><a href="${r.url}" target="_blank" rel="noopener noreferrer">${r.title}</a></p>
      ${covers ? `<p style="color:var(--text-3);font-size:12.5px;margin:2px 0 0">覆盖：${covers}</p>` : ''}
      ${r.note ? `<p style="color:var(--text-3);font-size:12.5px;margin:2px 0 0">${r.note}</p>` : ''}
    </div>`);
  });
}

body.innerHTML = parts.join('');
window.renderMath(body);

/* ── 侧栏 ── */
document.getElementById('side-list').innerHTML = S.chapters.map((c) => {
  const t = c.status === 'live' ? '' : ' <span style="color:var(--text-3);font-size:11px">·待补</span>';
  return `<a href="chapter.html?c=${c.id}" class="${c.id === ch.id ? 'on' : ''}">${c.no}　${c.name}${t}</a>`;
}).join('');

/* ── 翻页 ── */
const idx = S.chapters.findIndex((c) => c.id === ch.id);
const prev = S.chapters[idx - 1];
const next = S.chapters[idx + 1];
document.getElementById('c-pager').innerHTML = [
  prev ? `<a href="chapter.html?c=${prev.id}">← 上一章 · ${prev.name}</a>` : '<span></span>',
  next ? `<a href="chapter.html?c=${next.id}">${next.name} · 下一章 →</a>` : '<a href="index.html#notes">返回目录 →</a>',
].join('');

/* ── 3D ── */
const canvas = document.getElementById('c-canvas');
const capTitle = document.getElementById('c-model-title');
const capText = document.getElementById('c-model-cap');

async function boot3D() {
  if (!ch.model || !webglOK()) {
    capTitle.textContent = '3D 模型';
    capText.textContent = '本章模型正在制作中，完成后会在此处可直接旋转查看。';
    if (canvas) canvas.style.display = 'none';
    return;
  }
  capTitle.textContent = '本章 3D 模型';
  capText.innerHTML = ch.modelCap || '拖动旋转 · 滚轮缩放';
  window.renderMath(capText);

  const stage = createStage(canvas, { fov: 34, camPos: [0, 1.25, 5.1], lookAt: [0, 0, 0], exposure: 1.08 });
  const { scene, camera, renderer } = stage;

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 2.2;
  controls.maxDistance = 7;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.85;

  try {
    const m = await loadModel(ch.model, 1.6);
    if (ch.model.indexOf('rings') >= 0) m.rotation.y = Math.PI / 2;
    scene.add(m);
  } catch (e) {
    console.warn('[chapter] 模型加载失败', e);
    capText.textContent = '模型加载失败，请检查网络后刷新。';
  }

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const t = clock.getElapsedTime();
    controls.autoRotateSpeed = 0.85 + Math.sin(t * 0.3) * 0.15;
    controls.update();
    renderer.render(scene, camera);
  });
}
boot3D();
