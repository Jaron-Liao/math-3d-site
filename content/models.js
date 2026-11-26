/* 模型库：20 座 Blender 生成的数学模型（单一数据源） */
window.MODELS = [
  { id: 'mobius', name: '莫比乌斯带', en: 'Möbius Strip', cat: '拓扑', file: 'models/hero_mobius.gltf',
    desc: '只有一条边、一个面的曲面：沿中线走一圈会回到起点的背面。', tags: ['单侧曲面', '不可定向'] },

  { id: 'limit-rings', name: 'ε 收敛环带', en: 'ε-Convergence Rings', cat: '极限', file: 'models/ch_limit_rings.gltf', ch: 1,
    desc: '半径 1.05→0.34 逐级收缩，正是 |aₙ − A| < ε 里 ε 被任意压小的过程。', tags: ['ε-N', '极限定义'] },

  { id: 'saddle', name: '双曲抛物面', en: 'Hyperbolic Paraboloid', cat: '微分', file: 'models/ch_partial_saddle.gltf', ch: 2,
    desc: '鞍点处沿 x 上升、沿 y 下降：偏导数符号相反，是"可微"与"偏导存在"分离的经典反例。', tags: ['鞍点', '偏导数'] },

  { id: 'integral-solid', name: '旋转体', en: 'Solid of Revolution', cat: '积分', file: 'models/ch_integral_solid.gltf', ch: 3,
    desc: '曲线绕轴旋转扫出的曲面，体积元 dV = πf²(x)dx 的几何来源。', tags: ['圆盘法', '体积'] },

  { id: 'helix', name: '螺旋管', en: 'Helical Tube', cat: '曲线积分', file: 'models/ch_line_helix.gltf', ch: 8,
    desc: '空间曲线的等截面管：曲线积分的路径与定向，换方向即变号。', tags: ['定向', 'ds'] },

  { id: 'flow', name: '向量场流线', en: 'Vector Field Flow', cat: '微分方程', file: 'models/ch_ode_flow.glb', ch: 10,
    desc: '解曲线处处与向量场相切：微分方程的解就是流线。', tags: ['流线', '相图'] },

  { id: 'archimedean', name: '阿基米德螺线', en: 'Archimedean Spiral', cat: '曲线', file: 'models/ex_archimedean.glb',
    desc: 'r = a + bθ，等速旋转与等速外移的叠加，极坐标下最朴素的一族曲线。', tags: ['极坐标', 'r=θ'] },

  { id: 'exp-funnel', name: '指数漏斗', en: 'Exponential Funnel', cat: '曲面', file: 'models/ex_exponential_funnel.glb',
    desc: 'r = e^{−z} 的回转面：越往下越急骤张开，是反常积分收敛性的直观参照。', tags: ['回转面', '指数'] },

  { id: 'terrain', name: '梯度地形', en: 'Gradient Terrain', cat: '曲面', file: 'models/ex_gradient_terrain.glb',
    desc: '多峰曲面：等高线密集处梯度大，最速上升方向垂直于等高线。', tags: ['梯度', '等高线'] },

  { id: 'hyperboloid', name: '单叶双曲面', en: 'Hyperboloid', cat: '曲面', file: 'models/ex_hyperboloid.glb',
    desc: 'x²+y²−z²=1：直纹曲面，可由两族直线织成，冷却塔的几何原型。', tags: ['直纹面', '二次曲面'] },

  { id: 'klein', name: '克莱因瓶', en: 'Klein Bottle', cat: '拓扑', file: 'models/ex_klein_bottle.glb',
    desc: '无边界的闭曲面，在三维中必须自交才能嵌入——不可定向的招牌例子。', tags: ['不可定向', '闭曲面'] },

  { id: 'lissajous', name: '李萨如曲线', en: 'Lissajous Curve', cat: '曲线', file: 'models/ex_lissajous.glb',
    desc: '两个方向不同频率的简谐振动合成，参数方程最直观的展示。', tags: ['参数方程', '振动合成'] },

  { id: 'log-spiral', name: '对数螺线', en: 'Logarithmic Spiral', cat: '曲线', file: 'models/ex_log_spiral.glb',
    desc: 'r = ae^{bθ}：自相似，放大后形状不变，自然界最常见的生长曲线。', tags: ['自相似', '等角螺线'] },

  { id: 'rose', name: '玫瑰曲面', en: 'Rose Surface', cat: '曲面', file: 'models/ex_rose_surface.glb',
    desc: '以玫瑰线为母线的回转面，花瓣数与频率比决定瓣形。', tags: ['极坐标', '花瓣'] },

  { id: 'standing', name: '驻波曲面', en: 'Standing Wave', cat: '曲面', file: 'models/ex_standing_wave.glb',
    desc: '两列反向行波叠加：波节固定不动，能量不传播。', tags: ['叠加', '波节'] },

  { id: 'torus-knot', name: '环面纽结', en: 'Torus Knot', cat: '拓扑', file: 'models/ex_torus_knot.glb',
    desc: '(p,q) 纽结：绕环面两周、穿孔三周，是最容易看懂的非平凡纽结。', tags: ['纽结', '环绕数'] },

  { id: 'harmonic', name: '球谐曲面', en: 'Spherical Harmonic', cat: '曲面', file: 'models/ex_harmonic.glb',
    desc: 'r = 1 + Y₄³(θ,φ)：球面上按球谐函数起伏，量子化学与球面信号处理的基函数。', tags: ['球谐', '正交基'] },

  { id: 'catenoid', name: '悬链面', en: 'Catenoid', cat: '极小曲面', file: 'models/ex_catenoid.glb',
    desc: '两圆环之间肥皂膜的形状：平均曲率为零，面积在给定边界下最小。', tags: ['极小曲面', '变分'] },

  { id: 'gyroid', name: '陀螺面', en: 'Gyroid', cat: '极小曲面', file: 'models/ex_gyroid.glb',
    desc: '三周期极小曲面，处处零平均曲率，3D 打印晶格结构的常用拓扑。', tags: ['三周期', '零曲率'] },

  { id: 'supershape', name: '超公式曲面', en: 'Supershape', cat: '参数曲面', file: 'models/ex_supershape.glb',
    desc: 'Gielis 超公式：六个参数连续变形出星形、花瓣与多边形之间的所有过渡。', tags: ['超公式', '参数族'] },
];

/* 分类 -> 模型 */
window.MODEL_CATS = (function () {
  const m = {};
  window.MODELS.forEach(function (x) { (m[x.cat] = m[x.cat] || []).push(x); });
  return m;
})();
