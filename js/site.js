/* 站点通用：导航、滚动显现、KaTeX 渲染、章节卡片 */
(function () {
  const S = window.SITE;

  /* 公式渲染（内容动态插入后调用） */
  window.renderMath = function (root) {
    if (!window.renderMathInElement) return;
    window.renderMathInElement(root || document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
      throwOnError: false,
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    });
  };

  /* 顶栏滚动实心 */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('solid', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 滚动显现 */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* 章节卡片 */
  const THUMB = {
    1: 'ch_limit_rings', 2: 'ch_partial_saddle', 3: 'ch_integral_solid',
    4: 'ex_catenoid', 5: 'ex_archimedean', 6: 'ex_gyroid',
    7: 'ex_hyperboloid', 8: 'ch_line_helix', 9: 'ex_standing_wave', 10: 'ch_ode_flow',
  };
  const grid = document.getElementById('ch-grid');
  if (grid && S) {
    grid.innerHTML = S.chapters.map((c) => {
      const live = c.status === 'live';
      const th = THUMB[c.id] || 'hero_mobius';
      return `<a class="ch-card reveal" href="chapter.html?id=${c.id}">
        <div class="ch-thumb"><img src="assets/thumbs/${th}.png" alt="${c.name}" loading="lazy"></div>
        <div class="ch-body">
          <div class="ch-no">CHAPTER ${c.no}</div>
          <div class="ch-name">${c.name}</div>
          <div class="ch-sub">${c.sub}</div>
          <div class="ch-foot">
            <span class="ch-status ${live ? 'live' : ''}">${live ? '● 已上线' : '○ 待补全'}</span>
            <span class="ch-arrow">→</span>
          </div>
        </div>
      </a>`;
    }).join('');
    grid.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }

  /* 仓库链接 */
  const gh = document.querySelectorAll('[data-repo]');
  if (S && S.meta.repo) gh.forEach((a) => { a.href = 'https://github.com/' + S.meta.repo; });

  /* 年份 */
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* 首页 KaTeX */
  window.renderMath(document.body);
})();
