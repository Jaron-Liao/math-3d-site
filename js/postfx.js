/* 电影级后期：Bloom + 暗角 + 胶片颗粒 + 边缘色散 */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uVignette: { value: 0.72 },
    uGrain: { value: 0.018 },
    uAberration: { value: 0.0011 },
    uWarm: { value: 1.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform vec2 uRes;
    uniform float uVignette;
    uniform float uGrain;
    uniform float uAberration;
    uniform float uWarm;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      vec2 d = uv - 0.5;
      float r2 = dot(d, d);

      // 边缘色散：越靠边越明显
      float ab = uAberration * (0.45 + r2 * 2.6);
      vec3 col;
      col.r = texture2D(tDiffuse, uv + d * ab).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - d * ab).b;

      // 暗角
      float vig = smoothstep(0.95, 0.16, length(d) * (1.05 + uVignette * 0.55));
      col *= mix(1.0, vig, 0.9);

      // 轻对比 + 暖调
      col = (col - 0.5) * 1.055 + 0.5;
      col *= mix(vec3(1.0), vec3(1.035, 1.0, 0.955), uWarm);

      // 胶片颗粒
      float n = fract(sin(dot(uv * uRes + uTime * 41.0, vec2(12.9898, 78.233))) * 43758.5453);
      col += (n - 0.5) * uGrain;

      gl_FragColor = vec4(max(col, 0.0), 1.0);
    }`,
};

export function createPostFX(renderer, scene, camera, opts = {}) {
  const size = renderer.getSize(new THREE.Vector2());
  const composer = new EffectComposer(renderer);
  composer.setSize(size.x, size.y);

  composer.addPass(new RenderPass(scene, camera));

  const bloom = new UnrealBloomPass(
    new THREE.Vector2(size.x, size.y),
    opts.bloomStrength === undefined ? 0.42 : opts.bloomStrength,
    opts.bloomRadius === undefined ? 0.62 : opts.bloomRadius,
    opts.bloomThreshold === undefined ? 0.86 : opts.bloomThreshold,
  );
  composer.addPass(bloom);

  const grade = new ShaderPass(GradeShader);
  grade.uniforms.uVignette.value = opts.vignette === undefined ? 0.72 : opts.vignette;
  grade.uniforms.uGrain.value = opts.grain === undefined ? 0.018 : opts.grain;
  grade.uniforms.uAberration.value = opts.aberration === undefined ? 0.0011 : opts.aberration;
  composer.addPass(grade);

  composer.addPass(new OutputPass());

  let last = 0;
  return {
    composer,
    bloom,
    grade,
    setSize(w, h) {
      composer.setSize(w, h);
      grade.uniforms.uRes.value.set(w, h);
      bloom.setSize(w, h);
    },
    render(t) {
      const now = t === undefined ? performance.now() / 1000 : t;
      if (now - last > 0.016) {
        grade.uniforms.uTime.value = now;
        last = now;
      }
      composer.render();
    },
  };
}
