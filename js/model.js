/* 模型详情页：单模型旋转预览（复用 core.js 的成熟舞台） */
import * as THREE from 'three';
import { createStage, loadModel, starField, webglOK } from './core.js';

var idx = window.M_IDX || 0;
var cur = (window.M_MODELS || [])[idx];
var canvas = document.getElementById('m-canvas');
var diag = document.getElementById('m-diag');

function say(s) { window.M_3D_STATE = s; if (diag) diag.textContent = '3D:' + s; }

try {
  if (!cur || !cur.file) throw new Error('no model');
  if (!webglOK()) throw new Error('WebGL unavailable');
  var stage = createStage(canvas, { fov: 40, camPos: [0, 1.1, 9.0], lookAt: [0, 0, 0], fog: [10, 34], exposure: 0.95, postfx: { bloomStrength: 0.34, bloomThreshold: 0.9 } });
  stage.scene.add(starField(1100, 15));
  var holder = new THREE.Group();
  stage.scene.add(holder);
  say('loading');
  loadModel(cur.file, 2.6).then(function (m) {
    holder.add(m);
    say('loaded');
  }).catch(function (e) {
    say('fail:' + e.message);
    var cap = document.getElementById('m-cap');
    if (cap) cap.textContent = '模型加载失败：' + e.message;
  });
  var clock = new THREE.Clock();
  stage.renderer.setAnimationLoop(function () {
    var t = clock.getElapsedTime();
    holder.rotation.y = t * 0.18;
    holder.rotation.x = Math.sin(t * 0.4) * 0.06;
    stage.draw(t);
  });
} catch (e) {
  say('error:' + e.message);
  var cap2 = document.getElementById('m-cap');
  if (cap2) cap2.textContent = '3D 初始化失败：' + e.message;
}
