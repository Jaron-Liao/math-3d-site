/* 主页动态栏：100 个变体（10 类原型 × 10 组参数），随机抽取且不重复
   参考原型来自对 Awwwards 类站点 hero 的归纳：
   产品转台 / 粒子云 / 线框地形 / 环面纽结 / 碎片轨道 / 扭转带 / 同心环阵 / 流场 / 有机形变 / 空间网格
*/
(function () {
  const ARCHS = ['glb', 'cloud', 'wave', 'knot', 'shards', 'ribbon', 'rings', 'field', 'blob', 'grid'];

  const PALETTES = [
    { name: '金', a: '#d4af37', b: '#f0d98c', c: '#6b5312' },
    { name: '铜', a: '#c0774a', b: '#f2b98c', c: '#5c3520' },
    { name: '冰', a: '#7fb6d9', b: '#d6ecff', c: '#28455c' },
    { name: '薄荷', a: '#6fbf9b', b: '#cbf2dd', c: '#22463a' },
    { name: '玫瑰', a: '#c96a78', b: '#ffc6cc', c: '#552730' },
    { name: '铂', a: '#b8b2a3', b: '#f1ebda', c: '#464238' },
  ];

  /* 确定性随机，保证每次生成的 100 版完全一致 */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  const variants = [];
  for (let i = 0; i < 100; i++) {
    const rnd = mulberry32(i * 7919 + 13);
    const arch = ARCHS[i % ARCHS.length];
    const pal = PALETTES[i % PALETTES.length];
    variants.push({
      id: i,
      arch,
      pal,
      seed: Math.floor(rnd() * 1e6),
      speed: 0.55 + Math.floor(i / 10) * 0.09,
      amp: 0.6 + rnd() * 0.9,
      freq: 0.8 + rnd() * 1.6,
      twist: 0.4 + rnd() * 1.8,
      density: 0.6 + rnd() * 0.8,
      name: {
        glb: '产品转台', cloud: '粒子云', wave: '线框地形', knot: '环面纽结', shards: '碎片轨道',
        ribbon: '扭转带', rings: '同心环阵', field: '流场', blob: '有机形变', grid: '空间网格',
      }[arch] + ' · ' + pal.name,
    });
  }

  const KEY = 'hero_bag_v1';
  const CUR = 'hero_cur_v1';

  function loadBag() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length) return arr;
      }
    } catch (e) {}
    return null;
  }

  function saveBag(arr) {
    try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) {}
  }

  function refill() {
    const arr = variants.map((v) => v.id);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* 抽一个：优先不重复当前；袋空则重洗（避免连续重复同一版） */
  function next() {
    let bag = loadBag() || refill();
    const curId = Number(localStorage.getItem(CUR));
    let id = bag.pop();
    while (bag.length && id === curId) {
      bag.unshift(id);
      id = bag.pop();
    }
    if (!bag.length) {
      bag = refill();
      if (id !== undefined) {
        const at = bag.indexOf(id);
        if (at >= 0) bag.splice(at, 1);
      }
    }
    saveBag(bag);
    try { localStorage.setItem(CUR, String(id)); } catch (e) {}
    return { variant: variants[id], remaining: bag.length };
  }

  window.HERO = { variants, next, total: variants.length };
})();
