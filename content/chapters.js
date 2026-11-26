/* ============================================================
   站点内容数据（单一数据源）
   chapters[].sections[] 里 body 支持 HTML 片段 + $...$ 公式
   status: live = 已完稿；outline = 骨架，待补全
   ============================================================ */
window.SITE = {
  meta: {
    title: '高等数学 · 3D',
    subtitle: '从极限到常微分方程 —— 一条主线、十座模型',
    repo: 'Jaron-Liao/math-3d-site',
  },

  chapters: [
    {
      id: 1, no: '01', name: '极限与连续', en: 'LIMIT & CONTINUITY',
      sub: 'ε-N 语言 · 收敛准则 · 无穷小的阶 · 间断点分类',
      model: 'models/ch_limit_rings.gltf',
      modelCap: 'ε 收敛环带：半径逐级收缩，象征 |aₙ−A| < ε 的任意收紧',
      status: 'live',
      lead: '极限是整个分析学的地基。它不是"越来越接近"的文学描述，而是一个可以被逐项检验的量化命题：任给误差标准，总能找到某个时刻，此后全部落在标准之内。',
      sections: [
        {
          h: '1.1 为什么需要 ε-N 语言',
          html: `<p>数列 <span>$1,\\ \\tfrac12,\\ \\tfrac13,\\ \\dots$</span> 趋近于 0，这句话在直觉上毫无争议。但"趋近"若要成为数学命题，必须回答一个问题：<strong>怎样用有限次检验，断定一个无限过程？</strong></p>
<p>答案是换一个提问方式——不问"第 n 项离 0 多近"，而问"<strong>要多近就能多近，且能保证此后一直这么近</strong>"。于是引入两个角色：</p>
<ul>
<li><strong>ε</strong>：你指定的误差上限，任意小，但一旦给定就不再改变；</li>
<li><strong>N</strong>：我给出的时刻，此后所有项都要达标。</li>
</ul>
<p>这不是"无限接近"的修辞，而是一场博弈：你出 ε，我出 N。我总能赢，才叫收敛。</p>`,
          boxes: [{ type: 'hint', label: '一句话直觉', html: 'ε 是"允许多大的偏差"，N 是"从第几项开始守规矩"。' }],
        },
        {
          h: '1.2 ε-N 定义与三处量化',
          html: `<div class="formula">$\\forall\\,\\varepsilon>0,\\ \\exists\\,N\\in\\mathbb{N},\\ \\forall\\,n>N:\\ |a_n-A|<\\varepsilon$</div>
<p>三处量词各有分工：<strong>∀ε</strong> 表示标准可以任意苛刻；<strong>∃N</strong> 表示存在一个有限的起点；<strong>∀n&gt;N</strong> 表示此后<em>每一项</em>都满足，而不是"有很多项"满足。</p>
<p>顺序不可交换。若写成 <span>$\\exists N,\\ \\forall\\varepsilon>0$</span>，含义就退化成"某一项之后全部精确等于 A"，与收敛完全不同。</p>
<p>几何上：区间 <span>$(A-\\varepsilon,\\,A+\\varepsilon)$</span> 之外，至多只有有限项。这条等价说法是后面几乎所有证明的出发点。</p>`,
          boxes: [{ type: 'warn', label: '最常见的误读', html: '验证了前一万项都离得很近，<strong>不构成证明</strong>。定义要求的是"存在 N 使之后全部成立"，而不是"抽样检查通过"。' }],
        },
        {
          h: '1.3 用定义证明：一个可复用的套路',
          html: `<p>证明 <span>$\\lim\\limits_{n\\to\\infty}\\dfrac{2n+1}{n+1}=2$</span>。</p>
<p>第一步，<strong>先算差距</strong>：<span>$\\left|\\dfrac{2n+1}{n+1}-2\\right|=\\dfrac{1}{n+1}$</span>。</p>
<p>第二步，<strong>放大成好解的形式</strong>：<span>$\\dfrac{1}{n+1}<\\dfrac1n$</span>。放大是为了让不等式更容易被 ε 控制，方向必须朝"更大"。</p>
<p>第三步，<strong>解出 n</strong>：要 <span>$\\tfrac1n<\\varepsilon$</span>，只需 <span>$n>\\tfrac1\\varepsilon$</span>。取 <span>$N=\\left[\\tfrac1\\varepsilon\\right]$</span> 即可。</p>
<p>第四步，<strong>回述结论</strong>：当 <span>$n>N$</span> 时 <span>$\\left|a_n-2\\right|<\\tfrac1n<\\varepsilon$</span>，故极限为 2。∎</p>`,
          boxes: [{ type: 'hint', label: '可复用套路', html: '算差距 → 放大（朝大） → 解出 n → 取整得 N → 回述。四步走完，任何有理式数列的 ε-N 证明都能落地。' }],
        },
        {
          h: '1.4 三条收敛准则',
          html: `<p>用定义证明需要先知道极限值，这在很多场合做不到。三条准则提供"不知道极限也能判定收敛"的路径：</p>
<ul>
<li><strong>夹逼准则</strong>：<span>$b_n\\le a_n\\le c_n$</span> 且两端同趋于 A，则中间也趋于 A。</li>
<li><strong>单调有界准则</strong>：单调递增且有上界（或递减有下界）的数列必收敛。</li>
<li><strong>柯西准则</strong>：<span>$\\forall\\varepsilon>0,\\exists N,\\forall m,n>N:|a_m-a_n|<\\varepsilon$</span>，等价于收敛——这是实数完备性的直接体现。</li>
</ul>
<p>单调有界准则的威力在于"只判存在、不求数值"。例如 <span>$a_1=1,\\ a_{n+1}=\\sqrt{2+a_n}$</span>，先证有上界 2（归纳），再证单调（作差），于是极限存在，设为 A 后解 <span>$A=\\sqrt{2+A}$</span> 得 A=2。</p>`,
        },
        {
          h: '1.5 无穷小的阶与等价替换',
          html: `<p>两个无穷小之比的极限决定了它们的"快慢"：<span>$\\alpha=o(\\beta)$</span> 表示 <span>$\\alpha/\\beta\\to0$</span>，<span>$\\alpha\\sim\\beta$</span> 表示比值趋于 1。</p>
<p>等价替换的合法性来自一条定理：若 <span>$\\alpha\\sim\\alpha'$</span>、<span>$\\beta\\sim\\beta'$</span>，则 <span>$\\lim\\dfrac{\\alpha}{\\beta}=\\lim\\dfrac{\\alpha'}{\\beta'}$</span>。注意<strong>它只保证乘除结构下的替换</strong>。</p>
<p>加减结构中直接替换会丢阶：<span>$\\lim\\limits_{x\\to0}\\dfrac{x-\\sin x}{x^{3}}$</span> 若把 <span>$\\sin x$</span> 换成 <span>$x$</span>，分子变成 0，结论就错了。正确值是 <span>$\\tfrac16$</span>，必须用泰勒展开到三阶。</p>`,
          boxes: [{ type: 'warn', label: '边界条件', html: '等价无穷小替换只对<strong>整体乘除</strong>安全；遇到加减，先合并、通分或展开，再考虑替换。' }],
        },
        {
          h: '1.6 连续、间断与闭区间性质',
          html: `<p>连续的定义只有一句：<span>$\\lim\\limits_{x\\to x_0}f(x)=f(x_0)$</span>，即极限值等于函数值。它同时要求三件事：极限存在、函数在该点有定义、两者相等。</p>
<p>间断点按缺失的方式分类：极限存在但不等（<strong>可去</strong>）、左右极限存在但不相等（<strong>跳跃</strong>）、至少一侧极限不存在（<strong>第二类</strong>，如无穷或振荡）。</p>
<p>闭区间上连续的函数拥有三条"存在性"定理：有界性、最值性、介值性。它们只保证存在，不给出位置，却是零点存在定理与后续一切估计的根基。</p>`,
        },
      ],
      formulas: [
        { tex: '\\forall\\varepsilon>0,\\ \\exists N,\\ \\forall n>N:\\ |a_n-A|<\\varepsilon', note: '数列极限的 ε-N 定义' },
        { tex: '\\lim_{x\\to0}\\frac{\\sin x}{x}=1,\\qquad \\lim_{x\\to0}(1+x)^{1/x}=e', note: '两个重要极限' },
        { tex: '\\sin x\\sim x,\\ \\ \\tan x\\sim x,\\ \\ 1-\\cos x\\sim\\frac{x^{2}}{2},\\ \\ \\ln(1+x)\\sim x', note: '常用等价无穷小（x→0）' },
        { tex: 'f\\in C[a,b]\\ \\Rightarrow\\ \\exists\\xi:\\ f(\\xi)=\\max_{[a,b]}f', note: '最值定理' },
      ],
      example: {
        title: '用 ε-N 定义证明极限',
        stem: '证明 $\\lim\\limits_{n\\to\\infty}\\dfrac{2n+1}{n+1}=2$。',
        steps: [
          '算差距：$\\left|\\dfrac{2n+1}{n+1}-2\\right|=\\dfrac{1}{n+1}$。',
          '放大：$\\dfrac{1}{n+1}<\\dfrac1n$，方向朝大，便于用 ε 控制。',
          '解不等式：$\\dfrac1n<\\varepsilon\\iff n>\\dfrac1\\varepsilon$，取 $N=\\left[\\dfrac1\\varepsilon\\right]$。',
          '回述：当 $n>N$ 时 $\\left|a_n-2\\right|<\\varepsilon$，故极限为 2。∎',
        ],
        concl: '关键不在计算，而在把"任意小"翻译成"存在一个有限的 N"。放大一步决定了证明是否走得通。',
      },
      traps: [
        { h: '把"检验若干项"当成证明', b: '定义要求"存在 N 使此后全部成立"，抽样再多也只是证据，不是证明。' },
        { h: '在加减中直接做等价替换', b: '如 $x-\\sin x$ 中把 $\\sin x$ 换成 $x$ 会丢掉三阶主部，正确做法是泰勒展开。' },
      ],
    },

    {
      id: 2, no: '02', name: '导数与微分', en: 'DERIVATIVE & DIFFERENTIAL',
      sub: '差商极限 · 链式法则 · 隐函数 · 高阶导 · 形式不变性',
      model: 'models/ch_partial_saddle.gltf',
      modelCap: '双曲抛物面：沿不同方向的"斜率"不同，正是偏导数与方向导数的几何来源',
      status: 'live',
      lead: '导数把"变化"压缩成一个数：在一点附近，用一条直线替代曲线。所有求导法则，本质上都是在研究这种线性替代如何复合、如何反演。',
      sections: [
        {
          h: '2.1 导数是差商的极限',
          html: `<div class="formula">$f\'(x_0)=\\lim_{h\\to0}\\frac{f(x_0+h)-f(x_0)}{h}$</div>
<p>这个极限存在，就称 <span>$f$</span> 在 <span>$x_0$</span> 可导。几何上是割线斜率的极限，即切线斜率；物理上是瞬时变化率。</p>
<p>注意它是<strong>双侧</strong>极限：左右导数都存在且相等，才叫可导。因此 <span>$|x|$</span> 在 0 处不可导——左右导数分别是 −1 和 1。</p>`,
        },
        {
          h: '2.2 可导必连续，反之不然',
          html: `<p>由 <span>$f(x)-f(x_0)=\\dfrac{f(x)-f(x_0)}{x-x_0}(x-x_0)\\to f\'(x_0)\\cdot0=0$</span> 立即可得可导蕴含连续。逆命题不成立：<span>$|x|$</span> 在 0 处连续但不可导。</p>
<p>更值得注意的是另一层区别：<strong>"在一点可导"与"导函数在该点连续"是两件事</strong>。<span>$f(x)=x^{2}\\sin(1/x)$</span>（补充 <span>$f(0)=0$</span>）在 0 处可导且 <span>$f\'(0)=0$</span>，但 <span>$x\\ne0$</span> 时 <span>$f\'(x)=2x\\sin(1/x)-\\cos(1/x)$</span> 在 0 附近无极限。</p>`,
          boxes: [{ type: 'warn', label: '高频错误', html: '题目只给"$f$ 在 $x_0$ 可导"时，<strong>不能</strong>先求 $f\'(x)$ 再令 $x\\to x_0$——那一步默认了导函数连续。只能用定义。' }],
        },
        {
          h: '2.3 求导法则与链式法则',
          html: `<p>四则法则：<span>$(u\\pm v)\'=u\'\\pm v\'$</span>，<span>$(uv)\'=u\'v+uv\'$</span>，<span>$\\left(\\dfrac uv\\right)\'=\\dfrac{u\'v-uv\'}{v^{2}}$</span>。</p>
<p>链式法则是复合的枢纽：<span>$\\dfrac{\\mathrm dy}{\\mathrm dx}=f\'(u)\\,g\'(x)$</span>，其中 <span>$u=g(x)$</span>。它的直观含义是"变化率逐层相乘"。</p>
<p>由它立刻得到反函数法则：<span>$g\'(y_0)=\\dfrac{1}{f\'(x_0)}$</span>，前提是 <span>$f\'(x_0)\\ne0$</span>——分母非零这件事，正是"反函数不出现垂直切线"的代数表达。</p>`,
        },
        {
          h: '2.4 隐函数与参数方程',
          html: `<p>隐函数 <span>$F(x,y)=0$</span>：两边对 <span>$x$</span> 求导，把 <span>$y$</span> 看作 <span>$y(x)$</span>，含 <span>$y$</span> 的项先对 <span>$y$</span> 求导再乘 <span>$y\'$</span>，最后解出 <span>$y\'$</span>。</p>
<p>参数方程 <span>$x=\\varphi(t),\\ y=\\psi(t)$</span>：一阶导 <span>$\\dfrac{\\mathrm dy}{\\mathrm dx}=\\dfrac{\\psi\'(t)}{\\varphi\'(t)}$</span>；二阶导必须再对 <span>$t$</span> 求导后除以 <span>$\\varphi\'(t)$</span>：</p>
<div class="formula">$\\frac{\\mathrm d^{2}y}{\\mathrm dx^{2}}=\\frac{1}{\\varphi\'(t)}\\cdot\\frac{\\mathrm d}{\\mathrm dt}\\left(\\frac{\\psi\'(t)}{\\varphi\'(t)}\\right)$</div>
<p>写成 <span>$\\psi\'\'(t)/\\varphi\'\'(t)$</span> 是这类题最高频的失分点。</p>`,
          boxes: [{ type: 'warn', label: '二阶导陷阱', html: '参数方程的二阶导<strong>不是</strong> $\\dfrac{y\'\'_{tt}}{x\'\'_{tt}}$。正确动作：对一阶导再对 $t$ 求导，然后除以 $x\'_t$。' }],
        },
        {
          h: '2.5 高阶导数与微分形式不变性',
          html: `<p>高阶导数按递推定义：<span>$f^{(n)}(x)=\\left(f^{(n-1)}(x)\\right)\'$</span>。乘积的 n 阶导用莱布尼茨公式 <span>$(uv)^{(n)}=\\sum\\binom{n}{k}u^{(k)}v^{(n-k)}$</span>。</p>
<p>微分 <span>$\\mathrm dy=f\'(x)\\mathrm dx$</span> 的<strong>形式不变性</strong>指：即使 <span>$u$</span> 是中间变量，仍有 <span>$\\mathrm dy=f\'(u)\\mathrm du$</span>。这条性质让凑微分（第一类换元）得以成立。</p>
<p>但它只对<strong>一阶</strong>微分成立。二阶微分在中间变量情形会多出一项 <span>$f\'(u)\\mathrm d^{2}u$</span>，因此不能照搬形式不变性。</p>`,
        },
      ],
      formulas: [
        { tex: 'f\'(x_0)=\\lim_{h\\to0}\\frac{f(x_0+h)-f(x_0)}{h}', note: '导数定义（必须用双侧极限）' },
        { tex: '(uv)\'=u\'v+uv\',\\qquad \\left(\\frac uv\\right)\'=\\frac{u\'v-uv\'}{v^{2}}', note: '乘积与商的法则' },
        { tex: '\\frac{\\mathrm dy}{\\mathrm dx}=\\frac{\\psi\'(t)}{\\varphi\'(t)},\\qquad \\frac{\\mathrm d^{2}y}{\\mathrm dx^{2}}=\\frac{1}{\\varphi\'}\\left(\\frac{\\psi\'}{\\varphi\'}\\right)\'_{t}', note: '参数方程的一阶与二阶导' },
        { tex: '\\mathrm dy=f\'(u)\\,\\mathrm du', note: '一阶微分形式不变性' },
      ],
      example: {
        title: '参数方程的二阶导数',
        stem: '设 $x=t-\\sin t,\\ y=1-\\cos t$，求 $\\dfrac{\\mathrm d^{2}y}{\\mathrm dx^{2}}$。',
        steps: [
          '$x\'_t=1-\\cos t$，$y\'_t=\\sin t$，故 $\\dfrac{\\mathrm dy}{\\mathrm dx}=\\dfrac{\\sin t}{1-\\cos t}$。',
          '对 $t$ 求导：$\\left(\\dfrac{\\sin t}{1-\\cos t}\\right)\'_t=\\dfrac{\\cos t(1-\\cos t)-\\sin^{2}t}{(1-\\cos t)^{2}}=\\dfrac{\\cos t-1}{(1-\\cos t)^{2}}$。',
          '再除以 $x\'_t=1-\\cos t$，得 $\\dfrac{\\mathrm d^{2}y}{\\mathrm dx^{2}}=-\\dfrac{1}{(1-\\cos t)^{2}}$。',
        ],
        concl: '二阶导 = （一阶导对 t 求导）÷（x 对 t 求导）。少除一次是最常见的错误。',
      },
      traps: [
        { h: '参数方程二阶导写成 $y\'\'_{tt}/x\'\'_{tt}$', b: '必须对一阶导再对 $t$ 求导后除以 $x\'_t$，量纲才对得上。' },
        { h: '用"先求导再取极限"代替定义', b: '题设只保证一点可导时，$f\'$ 未必连续，必须先回到差商极限。' },
      ],
    },

    {
      id: 3, no: '03', name: '定积分与应用', en: 'DEFINITE INTEGRAL',
      sub: '分割求和 · 基本定理 · 换元分部 · 旋转体与弧长',
      model: 'models/ch_integral_solid.gltf',
      modelCap: '旋转体：曲线绕轴旋转扫出的曲面，体积元 $\\mathrm dV=\\pi f^{2}(x)\\,\\mathrm dx$',
      status: 'live',
      lead: '积分是"无限细分后求和"的极限。它把局部信息累加成整体量——面积、体积、弧长、功，全部是同一套分割—近似—求和—取极限的产物。',
      sections: [
        {
          h: '3.1 从分割到极限',
          html: `<p>把 <span>$[a,b]$</span> 分成 n 段，在第 i 段取点 <span>$\\xi_i$</span>，作和 <span>$\\sum f(\\xi_i)\\Delta x_i$</span>。当最大段长趋于 0 时，若该和趋于同一个数，就称 <span>$f$</span> 在 <span>$[a,b]$</span> 上可积，此数记作 <span>$\\int_a^b f(x)\\,\\mathrm dx$</span>。</p>
<p>连续性是可积的充分条件；有界且只有有限个间断点的函数也可积。可积性只关心"和是否收敛到唯一值"，与函数是否光滑无关。</p>`,
        },
        {
          h: '3.2 微积分基本定理',
          html: `<p>设 <span>$f$</span> 在 <span>$[a,b]$</span> 连续，令 <span>$\\Phi(x)=\\int_a^x f(t)\\,\\mathrm dt$</span>，则 <span>$\\Phi\'(x)=f(x)$</span>。</p>
<p>这条定理把两个看似无关的问题——"求切线"与"求面积"——接了起来：<strong>变上限积分是 f 的一个原函数</strong>。于是</p>
<div class="formula">$\\int_a^b f(x)\\,\\mathrm dx=F(b)-F(a)$</div>
<p>计算积分从此不必每次回到分割求和，只需找原函数。</p>`,
          boxes: [{ type: 'hint', label: '结构理解', html: '前半部分（$\\Phi\'=f$）称第一基本定理，后半部分（牛顿—莱布尼茨公式）称第二基本定理。' }],
        },
        {
          h: '3.3 换元与分部',
          html: `<p><strong>换元</strong>来自链式法则：<span>$\\int f(\\varphi(t))\\varphi\'(t)\\,\\mathrm dt=\\int f(u)\\,\\mathrm du$</span>。定积分换元时<strong>上下限必须同步换</strong>，换完直接算数，不必回代。</p>
<p><strong>分部</strong>来自乘积法则：<span>$\\int_a^b u\\,\\mathrm dv=[uv]_a^b-\\int_a^b v\\,\\mathrm du$</span>。选择 <span>$u$</span> 的经验顺序是"反、对、幂、指、三"——越靠前越适合求导。</p>`,
          boxes: [{ type: 'warn', label: '换元三件事', html: '换被积函数、换微分、换上下限。漏掉第三件，答案必错，且错得很隐蔽。' }],
        },
        {
          h: '3.4 几何应用：体积与弧长',
          html: `<p>旋转体体积（绕 x 轴）：把薄片近似为半径 <span>$f(x)$</span>、厚 <span>$\\mathrm dx$</span> 的圆盘，</p>
<div class="formula">$V=\\pi\\int_a^b f^{2}(x)\\,\\mathrm dx$</div>
<p>弧长：用勾股定理近似小段，<span>$\\mathrm ds=\\sqrt{1+[f\'(x)]^{2}}\\,\\mathrm dx$</span>，于是 <span>$L=\\int_a^b\\sqrt{1+[f\'(x)]^{2}}\\,\\mathrm dx$</span>。</p>
<p>参数方程下 <span>$\\mathrm ds=\\sqrt{\\varphi\'^{2}+\\psi\'^{2}}\\,\\mathrm dt$</span>；极坐标下 <span>$\\mathrm ds=\\sqrt{r^{2}+r\'^{2}}\\,\\mathrm d\\theta$</span>。三者是同一件事在不同坐标下的写法。</p>`,
        },
      ],
      formulas: [
        { tex: '\\Phi(x)=\\int_a^x f(t)\\,\\mathrm dt\\ \\Rightarrow\\ \\Phi\'(x)=f(x)', note: '变上限积分求导' },
        { tex: '\\int_a^b f(x)\\,\\mathrm dx=F(b)-F(a)', note: '牛顿—莱布尼茨公式' },
        { tex: 'V=\\pi\\int_a^b f^{2}(x)\\,\\mathrm dx', note: '绕 x 轴的旋转体体积' },
        { tex: 'L=\\int_a^b\\sqrt{1+[f\'(x)]^{2}}\\,\\mathrm dx', note: '弧长公式' },
      ],
      example: {
        title: '旋转体体积',
        stem: '求 $y=\\sin x$ 在 $[0,\\pi]$ 上绕 $x$ 轴旋转所得立体的体积。',
        steps: [
          '套圆盘公式：$V=\\pi\\int_0^{\\pi}\\sin^{2}x\\,\\mathrm dx$。',
          '降次：$\\sin^{2}x=\\dfrac{1-\\cos 2x}{2}$。',
          '积分：$V=\\pi\\left[\\dfrac x2-\\dfrac{\\sin 2x}{4}\\right]_0^{\\pi}=\\dfrac{\\pi^{2}}{2}$。',
        ],
        concl: '体积公式的关键是"薄片近似为圆盘"，半径就是函数值；一旦函数有正负，面积要用 $|f|$，体积用 $f^{2}$ 天然规避了符号问题。',
      },
      traps: [
        { h: '换元后忘记改上下限', b: '定积分换元必须同时换被积式、微分与上下限；只换前两个会得到完全错误的数值。' },
        { h: '面积直接对 $f$ 积分', b: '函数变号时面积应为 $\\int|f|$，需先求零点分段，否则正负相消。' },
      ],
    },

    {
      id: 4, no: '04', name: '微分中值定理', en: 'MEAN VALUE THEOREMS',
      sub: '罗尔 · 拉格朗日 · 柯西 · 泰勒公式',
      model: 'models/ex_klein_bottle.glb',
      modelCap: '中值定理把"整段的平均"压到"某一点"，就像曲面上的整体弯曲必在某处等于切平面的斜率',
      status: 'live',
      lead: '中值定理是"整体—局部"的翻译器：它把一段区间上的平均变化率，兑换成某个内点处的瞬时变化率。所有不等式证明、根的估计、泰勒展开，都建立在这个兑换上。',
      sections: [
        {
          h: '4.1 罗尔定理：极值点的导数为零',
          html: `<p>若 <span>$f$</span> 在 <span>$[a,b]$</span> 连续、在 <span>$(a,b)$</span> 可导，且 <span>$f(a)=f(b)$</span>，则存在 <span>$\\xi\\in(a,b)$</span> 使 <span>$f'(\\xi)=0$</span>。</p>
<p>证明只有三步：闭区间连续 ⇒ 有最大值与最小值；两端相等 ⇒ 极值要么恒为常数（处处导数为零），要么在内点取到；内点取极值 + 可导 ⇒ 由费马引理导数为零。</p>
<p>三个条件缺一不可：<span>$f(x)=x$</span> 在 <span>$[0,1]$</span> 上缺"两端相等"；<span>$f(x)=|x|$</span> 在 <span>$[-1,1]$</span> 上缺"可导"；开区间上的 <span>$f(x)=x$</span> 缺"闭区间连续"的端点约束。</p>`,
          boxes: [{ type: 'hint', label: '记忆锚点', html: '罗尔定理的本质是<strong>费马引理 + 最值定理</strong>：先保证最值取得到，再保证取到的地方导数为零。' }],
        },
        {
          h: '4.2 拉格朗日：把差商换成导数',
          html: `<div class="formula">$f(b)-f(a)=f'(\\xi)(b-a),\\quad \\xi\\in(a,b)$</div>
<p>构造辅助函数 <span>$\\varphi(x)=f(x)-f(a)-\\dfrac{f(b)-f(a)}{b-a}(x-a)$</span>，它满足 <span>$\\varphi(a)=\\varphi(b)=0$</span>，用罗尔定理即得。</p>
<p>这条公式的三种读法都常用：<strong>增量式</strong> <span>$\\Delta y=f'(\\xi)\\Delta x$</span>；<strong>差商式</strong> <span>$\\dfrac{f(b)-f(a)}{b-a}=f'(\\xi)$</span>；<strong>估计式</strong> <span>$|f(b)-f(a)|\\le M|b-a|$</span>（用于证明一致连续、压缩映射）。</p>`,
        },
        {
          h: '4.3 柯西中值定理与洛必达法则',
          html: `<p>把两个函数放进同一个参数化曲线 <span>$(g(t),f(t))$</span>，就得到柯西中值定理：</p>
<div class="formula">$\\frac{f(b)-f(a)}{g(b)-g(a)}=\\frac{f'(\\xi)}{g'(\\xi)}$</div>
<p>条件是 <span>$g'\\ne0$</span>（保证分母不为零，也保证 <span>$g(b)\\ne g(a)$</span>）。取 <span>$g(x)=x$</span> 就退回拉格朗日。</p>
<p>洛必达法则正是它的推论：对 <span>$\\dfrac{0}{0}$</span> 型，在 <span>$[a,x]$</span> 上用柯西中值定理，把 <span>$\\dfrac{f(x)-f(a)}{g(x)-g(a)}$</span> 换成 <span>$\\dfrac{f'(\\xi)}{g'(\\xi)}$</span>，再让 <span>$x\\to a$</span> 即可。这也解释了它失效的情形：<strong>导数之比的极限不存在时，原极限仍可能存在</strong>。</p>`,
          boxes: [{ type: 'warn', label: '洛必达的三个前提', html: '① 必须是 $\\frac00$ 或 $\\frac{\\infty}{\\infty}$ 型；② 去心邻域内可导且 $g\'\\ne0$；③ 导数之比的极限存在（或为无穷）。三者缺一，结论不成立。' }],
        },
        {
          h: '4.4 泰勒公式：用多项式逼近',
          html: `<p>把"一阶近似"推到 <span>$n$</span> 阶，就得到带皮亚诺余项的泰勒公式：</p>
<div class="formula">$f(x)=\\sum_{k=0}^{n}\\frac{f^{(k)}(x_0)}{k!}(x-x_0)^{k}+o\\bigl((x-x_0)^{n}\\bigr)$</div>
<p>皮亚诺余项只说明"误差是高阶无穷小"，适合求极限；拉格朗日余项 <span>$R_n=\\dfrac{f^{(n+1)}(\\xi)}{(n+1)!}(x-x_0)^{n+1}$</span> 则给出<strong>误差的量级估计</strong>，适合证明不等式与近似计算。</p>
<p>常用展开要背到三阶：<span>$e^{x}$</span>、<span>$\\sin x$</span>、<span>$\\cos x$</span>、<span>$\\ln(1+x)$</span>、<span>$(1+x)^{\\alpha}$</span>。它们是所有"等价无穷小"的来源。</p>`,
        },
        {
          h: '4.5 构造辅助函数的四种套路',
          html: `<p>中值定理的题目，难点几乎全在"造函数"。四类目标对应四种构造：</p>
<ul>
<li>要证 <span>$f'(\\xi)=K$</span>：取 <span>$\\varphi(x)=f(x)-Kx$</span>，由 <span>$\\varphi(a)=\\varphi(b)$</span> 反解 <span>$K$</span>。</li>
<li>要证 <span>$f'(\\xi)+kf(\\xi)=0$</span>：注意 <span>$(e^{kx}f)'=e^{kx}(f'+kf)$</span>，取 <span>$F=e^{kx}f$</span>。</li>
<li>要证 <span>$xf'(\\xi)+kf(\\xi)=0$</span>：取 <span>$F=x^{k}f$</span>。</li>
<li>要证 <span>$g f'-f g'=0$</span>：注意 <span>$\\left(\\dfrac fg\\right)'=\\dfrac{gf'-fg'}{g^{2}}$</span>，取 <span>$F=\\dfrac fg$</span>。</li>
</ul>
<p>识别方法是"把结论里的 <span>$\\xi$</span> 换成 <span>$x$</span>，看它像谁求导的结果"——这一步是纯代数变形，不涉及极限。</p>`,
          boxes: [{ type: 'hint', label: '一句话', html: '目标式里的 <strong>ξ 换成 x</strong>，再倒着问"它是哪个函数的导数"，辅助函数就出来了。' }],
        },
      ],
      formulas: [
        { tex: "f'(\\xi)=0", note: '罗尔定理（端点相等）' },
        { tex: 'f(b)-f(a)=f\'(\\xi)(b-a)', note: '拉格朗日中值定理' },
        { tex: '\\frac{f(b)-f(a)}{g(b)-g(a)}=\\frac{f\'(\\xi)}{g\'(\\xi)}', note: '柯西中值定理（$g\'\\ne0$）' },
        { tex: 'f(x)=\\sum_{k=0}^{n}\\frac{f^{(k)}(x_0)}{k!}(x-x_0)^{k}+R_n', note: '泰勒公式（余项可选皮亚诺/拉格朗日）' },
      ],
      example: {
        title: '构造辅助函数证等式',
        stem: '设 $f$ 在 $[0,1]$ 连续、$(0,1)$ 可导，$f(0)=0,\\ f(1)=1$。证明存在 $\\xi\\in(0,1)$ 使 $f\'(\\xi)=2\\xi$。',
        steps: [
          '把结论改写成 $f\'(\\xi)-2\\xi=0$，即 $(f(x)-x^{2})\'\\big|_{x=\\xi}=0$。',
          '于是取 $\\varphi(x)=f(x)-x^{2}$，它连续可导。',
          '验证端点：$\\varphi(0)=0$，$\\varphi(1)=1-1=0$，满足罗尔条件。',
          '由罗尔定理，存在 $\\xi$ 使 $\\varphi\'(\\xi)=0$，即 $f\'(\\xi)=2\\xi$。∎',
        ],
        concl: '看到"某点导数等于某个表达式"，先把它整理成"某个函数的导数为零"，再检查端点是否相等。',
      },
      traps: [
        { h: '把中值定理当恒等式用', b: '$\\xi$ 只保证存在，不能参与后续计算；需要具体数值时必须另找方法。' },
        { h: '洛必达用在非未定式上', b: '$"\\frac{1}{0}"$ 或 $\\frac{\\infty}{0}$ 不是未定式，套用会得到错误结论。' },
      ],
    },
    {
      id: 5, no: '05', name: '不定积分', en: 'INDEFINITE INTEGRAL',
      sub: '原函数 · 凑微分 · 三角代换 · 分部 · 有理函数',
      model: 'models/ex_archimedean.glb',
      modelCap: '阿基米德螺线：极坐标下的弧长与面积，是最能体现"换元"威力的曲线',
      status: 'live',
      lead: '求原函数没有通用算法，只有一套"识别信号 → 选配方"的策略。真正要练的不是公式量，而是看被积式就知道该用哪一招。',
      sections: [
        {
          h: '5.1 原函数与不定积分',
          html: `<p>若 <span>$F'(x)=f(x)$</span>，称 <span>$F$</span> 是 <span>$f$</span> 的一个原函数。同一函数的任意两个原函数只差常数，因此</p>
<div class="formula">$\\int f(x)\\,\\mathrm{d}x=F(x)+C$</div>
<p>连续函数必有原函数（变上限积分就是一个），但原函数不一定能用初等函数表示——<span>$e^{-x^{2}}$</span>、<span>$\\dfrac{\\sin x}{x}$</span> 都是经典例子。所谓"积不出来"，指的是<strong>不能初等表示</strong>，不是不存在。</p>`,
          boxes: [{ type: 'warn', label: '别漏 +C', html: '不定积分的结果是一个<strong>函数族</strong>；漏写 $+C$ 在考试中直接判错。' }],
        },
        {
          h: '5.2 凑微分：识别"函数与它的导数"',
          html: `<p>第一类换元的本质是链式法则的逆用：若被积式里同时出现 <span>$\\varphi(x)$</span> 与 <span>$\\varphi'(x)$</span>，就把 <span>$\\varphi'(x)\\,\\mathrm{d}x$</span> 收进微分号：</p>
<div class="formula">$\\int f(\\varphi(x))\\varphi'(x)\\,\\mathrm{d}x=\\int f(u)\\,\\mathrm{d}u$</div>
<p>识别信号：<span>$x\\,\\mathrm{d}x$</span> 配 <span>$x^{2}$</span>；<span>$\\dfrac{\\mathrm{d}x}{x}$</span> 配 <span>$\\ln x$</span>；<span>$\\cos x\\,\\mathrm{d}x$</span> 配 <span>$\\sin x$</span>；<span>$\\sec^{2}x\\,\\mathrm{d}x$</span> 配 <span>$\\tan x$</span>。</p>
<p>这类题的关键是<strong>把系数配平</strong>：<span>$\\int \\dfrac{\\mathrm{d}x}{2x+1}=\\dfrac12\\ln|2x+1|+C$</span>，那个 <span>$\\tfrac12$</span> 就是配平 <span>$\\mathrm{d}(2x+1)=2\\,\\mathrm{d}x$</span> 的产物。</p>`,
        },
        {
          h: '5.3 第二类换元：三角代换与倒代换',
          html: `<p>当被积式含 <span>$\\sqrt{a^{2}-x^{2}}$</span>、<span>$\\sqrt{a^{2}+x^{2}}$</span>、<span>$\\sqrt{x^{2}-a^{2}}$</span> 时，用三角代换把根号化为单项：</p>
<ul>
<li><span>$\\sqrt{a^{2}-x^{2}}$</span>：令 <span>$x=a\\sin t$</span>，<span>$t\\in[-\\tfrac\\pi2,\\tfrac\\pi2]$</span>；</li>
<li><span>$\\sqrt{a^{2}+x^{2}}$</span>：令 <span>$x=a\\tan t$</span>，<span>$t\\in(-\\tfrac\\pi2,\\tfrac\\pi2)$</span>；</li>
<li><span>$\\sqrt{x^{2}-a^{2}}$</span>：令 <span>$x=a\\sec t$</span>。</li>
</ul>
<p>代换必须<strong>单调可导</strong>（否则反函数不存在），且要限定范围保证根号开出来是正号——这就是为什么 <span>$t$</span> 的区间要写死。</p>`,
          boxes: [{ type: 'warn', label: '最隐蔽的扣分点', html: '$\\sqrt{\\cos^{2}t}=|\\cos t|$，不是 $\\cos t$。先声明 $t$ 的范围使 $\\cos t\\ge0$，才能直接去掉绝对值。' }],
        },
        {
          h: '5.4 分部积分：LIATE 选 u',
          html: `<div class="formula">$\\int u\\,\\mathrm{d}v=uv-\\int v\\,\\mathrm{d}u$</div>
<p>选择 <span>$u$</span> 的经验顺序是 <strong>LIATE</strong>：对数（Log）→ 反三角（Inverse trig）→ 代数（Algebraic）→ 三角（Trig）→ 指数（Exp）。越靠前越适合求导，越靠后越适合积分。</p>
<p>三类常见形态：<span>$x^{n}e^{x}$</span>（反复分部降次）、<span>$x^{n}\\ln x$</span>（先取对数）、<span>$e^{x}\\sin x$</span>（两次分部后"回到自身"，移项求解）。</p>`,
        },
        {
          h: '5.5 有理函数：部分分式',
          html: `<p>真分式 <span>$\\dfrac{P(x)}{Q(x)}$</span> 总能拆成三类最简分式：</p>
<ul>
<li><span>$\\dfrac{A}{x-a}$</span>（单根）；</li>
<li><span>$\\dfrac{A}{(x-a)^{k}}$</span>（重根）；</li>
<li><span>$\\dfrac{Bx+C}{x^{2}+px+q}$</span>（不可约二次因子，配方后用反正切）。</li>
</ul>
<p>假分式先做多项式除法。这套流程保证<strong>任何有理函数都能积出初等函数</strong>——这是它比其它类型"友好"的原因。</p>
<p>特殊技巧：<span>$\\dfrac{1}{x^{2}-a^{2}}$</span> 可直接拆成 <span>$\\dfrac{1}{2a}\\left(\\dfrac{1}{x-a}-\\dfrac{1}{x+a}\\right)$</span>，不必走通用流程。</p>`,
        },
      ],
      formulas: [
        { tex: "\\int f(\\varphi(x))\\varphi'(x)\\,\\mathrm{d}x=\\int f(u)\\,\\mathrm{d}u", note: '第一类换元（凑微分）' },
        { tex: '\\int u\\,\\mathrm{d}v=uv-\\int v\\,\\mathrm{d}u', note: '分部积分' },
        { tex: '\\int \\frac{\\mathrm{d}x}{x^{2}+a^{2}}=\\frac1a\\arctan\\frac xa+C', note: '配方后的标准型' },
        { tex: '\\int \\frac{\\mathrm{d}x}{\\sqrt{a^{2}-x^{2}}}=\\arcsin\\frac xa+C', note: '三角代换的直接结果' },
      ],
      example: {
        title: '分部积分与循环',
        stem: '求 $\\displaystyle\\int e^{x}\\sin x\\,\\mathrm{d}x$。',
        steps: [
          '取 $u=\\sin x,\\ \\mathrm{d}v=e^{x}\\mathrm{d}x$，得 $I=e^{x}\\sin x-\\int e^{x}\\cos x\\,\\mathrm{d}x$。',
          '对后一项再分部：$u=\\cos x$，得 $\\int e^{x}\\cos x\\,\\mathrm{d}x=e^{x}\\cos x+\\int e^{x}\\sin x\\,\\mathrm{d}x$。',
          '代回：$I=e^{x}\\sin x-e^{x}\\cos x-I$，移项得 $2I=e^{x}(\\sin x-\\cos x)$。',
          '故 $I=\\dfrac{e^{x}}{2}(\\sin x-\\cos x)+C$。',
        ],
        concl: '两次分部后原积分重新出现，说明它满足一个"关于自身的方程"；移项即解。这类题不要硬算第三次。',
      },
      traps: [
        { h: '三角代换忘写 t 的范围', b: '不限定范围，开根号时会丢绝对值，结果差一个符号。' },
        { h: '分部积分选错 u', b: '把指数函数当 u 会越积越高次，越算越复杂；按 LIATE 选。' },
      ],
    },
    {
      id: 6, no: '06', name: '多元函数微分', en: 'MULTIVARIABLE CALCULUS',
      sub: '偏导 · 全微分 · 方向导数 · 极值',
      model: 'models/ex_gradient_terrain.glb',
      modelCap: '梯度地形：每一点的坡度方向就是该处导数向量，最陡上坡即梯度的几何意义',
      status: 'live',
      lead: '多维情形下"可微"强于"偏导存在"，切平面取代切线成为局部线性化的载体。所有概念都在回答一个问题：沿不同方向，函数怎么变？',
      sections: [
        {
          h: '6.1 偏导数：固定其余变量的导数',
          html: `<p>偏导 <span>$\\dfrac{\\partial f}{\\partial x}$</span> 就是把 <span>$y$</span> 冻结后对 <span>$x$</span> 求导——它只反映沿坐标轴方向的变化率。几何上，它是曲面被 <span>$y=y_{0}$</span> 平面截出的曲线的切线斜率。</p>
<div class="formula">$\\dfrac{\\partial f}{\\partial x}=\\lim_{\\Delta x\\to 0}\\dfrac{f(x+\\Delta x,y)-f(x,y)}{\\Delta x}$</div>
<p>高阶混合偏导在<strong>连续</strong>条件下可交换次序（Clairaut 定理）：<span>$f_{xy}=f_{yx}$</span>。不连续时可以不相等——Schwarz 构造过经典反例 <span>$f(x,y)=xy\\dfrac{x^{2}-y^{2}}{x^{2}+y^{2}}$</span>，在原点处 <span>$f_{xy}(0,0)\\ne f_{yx}(0,0)$</span>。</p>`,
        },
        {
          h: '6.2 可微与全微分：强于偏导存在的条件',
          html: `<div class="formula">$\\mathrm{d}z=f_{x}\\,\\mathrm{d}x+f_{y}\\,\\mathrm{d}y,\\quad \\text{其中 } \\Delta z-\\mathrm{d}z=o(\\rho),\\ \\rho=\\sqrt{(\\Delta x)^{2}+(\\Delta y)^{2}}$</div>
<p>逻辑链是本节核心：<strong>偏导连续 ⟹ 可微 ⟹ 偏导存在</strong>，且<strong>可微 ⟹ 连续</strong>。反向全部不成立。最经典反例：</p>
<div class="formula">$f(x,y)=\\dfrac{xy}{x^{2}+y^{2}},\\ f(0,0)=0$</div>
<p>它在原点两个偏导都存在（均为 0），但沿 <span>$y=kx$</span> 趋于原点时极限是 <span>$\\dfrac{k}{1+k^{2}}$</span>，与方向有关——连极限都不存在，当然不可微、不连续。偏导存在只是"沿两条轴探了两根针"，不足以保证整体行为。</p>`,
          boxes: [{ type: 'warn', label: '判别顺序', html: '判断分段函数在分界点可微性：先验证 <strong>连续</strong> → 再算偏导 → 最后用定义验证 <span>$\\Delta z-(f_{x}\\Delta x+f_{y}\\Delta y)=o(\\rho)$</span>。跳步是常见扣分点。' }],
        },
        {
          h: '6.3 链式法则与隐函数求导',
          html: `<p>多元复合的链式法则画成"树"最不易错：变量逐层展开，每条路径贡献一项乘积。<span>$z=f(u,v),\\ u=u(t),\\ v=v(t)$</span> 时</p>
<div class="formula">$\\dfrac{\\mathrm{d}z}{\\mathrm{d}t}=f_{u}\\dfrac{\\mathrm{d}u}{\\mathrm{d}t}+f_{v}\\dfrac{\\mathrm{d}v}{\\mathrm{d}t}$</div>
<p>隐函数求导有两种姿势：直接对方程两边求导后解出；或用隐函数定理的公式。设 <span>$F(x,y,z)=0$</span> 确定隐函数，则</p>
<div class="formula">$\\dfrac{\\partial z}{\\partial x}=-\\dfrac{F_{x}}{F_{z}}$</div>
<p>注意公式里的下标是<strong>把其它自变量冻结</strong>后的偏导——"冻结了谁"不同，同一个记号算出的值可以不同，这是抽象符号最坑人的地方。</p>`,
        },
        {
          h: '6.4 方向导数与梯度',
          html: `<div class="formula">$\\nabla f=\\left(f_{x},f_{y}\\right),\\quad \\dfrac{\\partial f}{\\partial\\boldsymbol{l}}=\\nabla f\\cdot\\boldsymbol{e}_{l}=|\\nabla f|\\cos\\theta$</div>
<p>方向导数是函数沿任意单位方向 <span>$\\boldsymbol{e}_{l}$</span> 的变化率，梯度是它的"系数向量"。三个结论一眼看清：</p>
<ul>
<li>沿梯度方向增长最快，速率恰为 <span>$|\\nabla f|$</span>；</li>
<li>梯度与等值线（面）<strong>正交</strong>；</li>
<li>负梯度方向下降最快——这就是梯度下降法的全部原理。</li>
</ul>
<p>梯度下降在机器学习里每次走一小步 <span>$\\boldsymbol{x}\\leftarrow\\boldsymbol{x}-\\eta\\nabla f(\\boldsymbol{x})$</span>：多维微分的"工业出口"。</p>`,
        },
        {
          h: '6.5 极值：从无条件到拉格朗日',
          html: `<p>无条件极值的两步：解方程组 <span>$f_{x}=f_{y}=0$</span> 得驻点；用 <strong>AC 判别法</strong>分类。记 <span>$A=f_{xx},\\ B=f_{xy},\\ C=f_{yy}$</span>：</p>
<div class="formula">$AC-B^{2}>0\\ (A<0\\ 大值\\ /\\ A>0\\ 小值),\\qquad AC-B^{2}<0\\ \\text{鞍点}$</div>
<p>带约束 <span>$g(x,y)=0$</span> 的极值用<strong>拉格朗日乘数法</strong>：构造 <span>$L=f+\\lambda g$</span>，解 <span>$L_{x}=L_{y}=L_{\\lambda}=0$</span>。几何直觉：极值点处 <span>$f$</span> 的等值线与约束曲线<strong>相切</strong>，两法向量平行，平行系数就是 <span>$\\lambda$</span>。闭区域上求最值 = 内部驻点值 + 边界（用拉格朗日或代入参数化）比较大小。</p>`,
          boxes: [{ type: 'warn', label: '驻点≠极值点', html: '$z=xy$ 在原点处 $f_{x}=f_{y}=0$，但 $AC-B^{2}=-1<0$ 是鞍点——3D 展厅的双曲抛物面就是它。驻点必须再过 AC 检验。' }],
        },
      ],
      formulas: [
        { tex: '\\mathrm{d}z=f_{x}\\,\\mathrm{d}x+f_{y}\\,\\mathrm{d}y', note: '全微分（可微的定义载体）' },
        { tex: '\\frac{\\partial z}{\\partial x}=-\\frac{F_{x}}{F_{z}}', note: '隐函数求导公式' },
        { tex: '\\frac{\\partial f}{\\partial \\boldsymbol{l}}=\\nabla f\\cdot \\boldsymbol{e}_{l}', note: '方向导数 = 梯度投影' },
        { tex: 'AC-B^{2}>0 \\text{ 且 } A>0 \\Rightarrow \\text{极小值}', note: '二元极值判别法' },
      ],
      example: {
        title: '拉格朗日乘数法',
        stem: '求表面积一定的长方体中体积最大者。',
        steps: [
          '目标 $V=xyz$，约束 $2(xy+yz+zx)=a^{2}$。构造 $L=xyz+\\lambda\\left[2(xy+yz+zx)-a^{2}\\right]$。',
          '偏导为零：$yz+2\\lambda(y+z)=xz+2\\lambda(x+z)=xy+2\\lambda(x+y)=0$。',
          '两两相减得 $(y-x)\\left[z+2\\lambda\\right]=0$ 等式。若 $x,y,z$ 不全相等则推出矛盾，故 $x=y=z$。',
          '代入约束得边长 $x=y=z=\\dfrac{a}{\\sqrt{6}}$，为正方体。',
        ],
        concl: '对称问题优先猜想对称解，再用拉格朗日证明唯一性。约束优化中"所有变量地位对称 ⟹ 最优解往往对称"是高频结论。',
      },
      traps: [
        { h: '把"偏导存在"当成"可微"', b: '多元微积分里这是两回事；反例 xy/(x²+y²) 偏导存在但沿不同方向极限不同。' },
        { h: '隐函数求导冻结错变量', b: 'F_x 里的偏导默认"其余变量冻结"，与把 z 当成 x 的函数后求导含义不同，混用必错。' },
      ],
    },
    {
      id: 7, no: '07', name: '重积分', en: 'MULTIPLE INTEGRALS',
      sub: '二重 · 三重 · 极坐标 · 雅可比',
      model: 'models/ch_integral_solid.gltf',
      modelCap: '曲顶柱体：二重积分的几何原型——底面是积分区域，高度是被积函数',
      status: 'live',
      lead: '重积分的全部技巧集中在两件事：选坐标系、定积分限。坐标系选对，积分限自动变简单；选错，一个对称性就能省掉的题会算半页纸。',
      sections: [
        {
          h: '7.1 二重积分：曲顶柱体的体积',
          html: `<div class="formula">$\\iint_{D}f(x,y)\\,\\mathrm{d}\\sigma=\\lim_{\\lambda\\to0}\\sum_{i}f(\\xi_{i},\\eta_{i})\\,\\Delta\\sigma_{i}$</div>
<p>几何意义：<span>$f\\ge 0$</span> 时是区域 <span>$D$</span> 上以 <span>$f$</span> 为顶的曲顶柱体体积；<span>$f\\equiv1$</span> 时退化为区域面积——这常用来反解积分限或验证答案。</p>
<p>化为累次积分的口诀：<strong>先看区域再定序</strong>。X 型区域（上下边界都是 <span>$y$</span> 的函数）先对 <span>$y$</span> 积：</p>
<div class="formula">$\\int_{a}^{b}\\mathrm{d}x\\int_{y_{1}(x)}^{y_{2}(x)}f\\,\\mathrm{d}y$</div>
<p>交换积分次序是必考动作：从给定的累次积分反画出区域 <span>$D$</span>，再按另一个方向写限。图画对，限就对；图画错，一切白算。</p>`,
        },
        {
          h: '7.2 极坐标：什么时候换、怎么换',
          html: `<div class="formula">$\\iint_{D}f(x,y)\\,\\mathrm{d}x\\mathrm{d}y=\\iint f(r\\cos\\theta,r\\sin\\theta)\\,r\\,\\mathrm{d}r\\,\\mathrm{d}\\theta$</div>
<p>换极坐标的三个信号：<strong>区域是圆/环/扇形</strong>；<strong>被积函数含</strong> <span>$x^{2}+y^{2}$</span>；边界曲线用 <span>$r$</span>、<span>$\\theta$</span> 表达更简单。多出来的 <span>$r$</span> 是面积元的雅可比因子——忘乘 <span>$r$</span> 是本节第一大错。</p>
<p>经典结果：<span>$\\displaystyle\\iint_{x^{2}+y^{2}\\le R^{2}}e^{-x^{2}-y^{2}}\\,\\mathrm{d}\\sigma=\\pi\\left(1-e^{-R^{2}}\\right)$</span>。直角坐标下 <span>$e^{-x^{2}}$</span> 没有初等原函数，极坐标下一行积完——这就是"坐标系选对"的威力。著名的概率积分 <span>$\\displaystyle\\int_{-\\infty}^{\\infty}e^{-x^{2}}\\mathrm{d}x=\\sqrt{\\pi}$</span> 正是用它取极限证出的。</p>`,
          boxes: [{ type: 'warn', label: '忘乘雅可比 r', html: '极坐标面积元是 $r\\,\\mathrm{d}r\\,\\mathrm{d}\\theta$。漏写 $r$ 后结果"差一个量纲"，二重积分全错。' }],
        },
        {
          h: '7.3 三重积分：三种坐标各管一段',
          html: `<p>三重积分 <span>$\\iiint_{\\Omega}f\\,\\mathrm{d}V$</span> 的坐标系按区域形状选：</p>
<ul>
<li><strong>直角（投影法 / 截面法）</strong>：一般区域；截面法（先二后一）适合被积函数只含 <span>$z$</span>、截面面积易算的情形；</li>
<li><strong>柱坐标</strong>：区域含旋转对称，<span>$\\mathrm{d}V=r\\,\\mathrm{d}r\\,\\mathrm{d}\\theta\\,\\mathrm{d}z$</span>；</li>
<li><strong>球坐标</strong>：区域是球/锥，<span>$\\mathrm{d}V=r^{2}\\sin\\varphi\\,\\mathrm{d}r\\,\\mathrm{d}\\theta\\,\\mathrm{d}\\varphi$</span>。</li>
</ul>
<p>球坐标的两个角度别弄混：<span>$\\varphi$</span> 是与 <span>$z$</span> 轴的夹角（<span>$0\\le\\varphi\\le\\pi$</span>），<span>$\\theta$</span> 是水平转角。单位球积分验证：<span>$\\iiint \\mathrm{d}V=\\int_0^{2\\pi}\\mathrm{d}\\theta\\int_0^{\\pi}\\sin\\varphi\\,\\mathrm{d}\\varphi\\int_0^{1}r^{2}\\mathrm{d}r=\\tfrac{4\\pi}{3}$</span> ✓</p>`,
        },
        {
          h: '7.4 对称性与几何应用',
          html: `<p>对称性是重积分最快的加速器，规则只有一条要记牢：<strong>区域关于某轴对称 + 被积函数关于对应变量为奇函数 ⟹ 积分为零</strong>；偶函数则等于半区域的两倍。三者必须同时匹配——区域对称但函数不对称，什么结论都没有。</p>
<p>应用三件套：</p>
<ul>
<li>体积：曲顶柱体 <span>$\\iint_D f\\,\\mathrm{d}\\sigma$</span> 或两曲面之差；</li>
<li>质心：<span>$\\bar{x}=\\dfrac{1}{M}\\iint x\\rho\\,\\mathrm{d}\\sigma$</span>，均匀区域质心只由形状决定；</li>
<li>转动惯量与引力：公式形态相同，被积函数换成 <span>$r^{2}$</span> 等。</li>
</ul>`,
        },
        {
          h: '7.5 换元一般理论与雅可比',
          html: `<div class="formula">$\\iint_{D}f\\,\\mathrm{d}x\\mathrm{d}y=\\iint_{D'}f(x(u,v),y(u,v))\\left|\\dfrac{\\partial(x,y)}{\\partial(u,v)}\\right|\\mathrm{d}u\\mathrm{d}v$</div>
<p>极坐标只是 <span>$x=r\\cos\\theta,\\ y=r\\sin\\theta$</span> 这一一般公式的特例（雅可比 = <span>$r$</span>）。广义极坐标 <span>$x=ar\\cos\\theta,\\ y=br\\sin\\theta$</span> 处理椭圆区域，雅可比为 <span>$abr$</span>。</p>
<p>为什么面积元要乘雅可比？因为线性化后，<span>$(u,v)$</span> 平面上的小矩形被映射放大了 <span>$|J|$</span> 倍——这和一元换元中 <span>$\\mathrm{d}x=x'(t)\\,\\mathrm{d}t$</span> 是同一个思想的高维版本：微元要跟着映射"变形"。</p>`,
        },
      ],
      formulas: [
        { tex: '\\iint_{D}f\\,\\mathrm{d}x\\mathrm{d}y=\\int_{a}^{b}\\mathrm{d}x\\int_{y_{1}(x)}^{y_{2}(x)}f\\,\\mathrm{d}y', note: 'X 型区域化为累次积分' },
        { tex: '\\iint_{D}f(x,y)\\,\\mathrm{d}x\\mathrm{d}y=\\iint f(r\\cos\\theta,r\\sin\\theta)\\,r\\,\\mathrm{d}r\\,\\mathrm{d}\\theta', note: '极坐标换元（雅可比为 r）' },
        { tex: '\\mathrm{d}V=r^{2}\\sin\\varphi\\,\\mathrm{d}r\\,\\mathrm{d}\\theta\\,\\mathrm{d}\\varphi', note: '球坐标体积元' },
        { tex: '\\iint f\\left|\\frac{\\partial(x,y)}{\\partial(u,v)}\\right|\\mathrm{d}u\\mathrm{d}v', note: '一般换元的雅可比' },
      ],
      example: {
        title: '概率积分：极坐标的经典胜利',
        stem: '证明 $\\displaystyle\\int_{-\\infty}^{\\infty}e^{-x^{2}}\\,\\mathrm{d}x=\\sqrt{\\pi}$。',
        steps: [
          '设 $I=\\int_{0}^{\\infty}e^{-x^{2}}\\mathrm{d}x$，则 $4I^{2}=\\iint_{\\mathbb{R}^{2}}e^{-x^{2}-y^{2}}\\mathrm{d}x\\mathrm{d}y$（两个一元积分的乘积 = 平方区域上的二重积分）。',
          '换极坐标：被积函数变 $e^{-r^{2}}$，面积元变 $r\\,\\mathrm{d}r\\,\\mathrm{d}\\theta$，整个平面即 $0\\le r<\\infty$，$0\\le\\theta<2\\pi$。',
          '$\\displaystyle\\int_{0}^{2\\pi}\\mathrm{d}\\theta\\int_{0}^{\\infty}e^{-r^{2}}r\\,\\mathrm{d}r=2\\pi\\cdot\\tfrac12=\\pi$。',
          '故 $4I^{2}=\\pi$，$I=\\tfrac{\\sqrt\\pi}{2}$，即 $\\int_{-\\infty}^{\\infty}e^{-x^{2}}\\mathrm{d}x=\\sqrt{\\pi}$。',
        ],
        concl: '一元积不出的函数，升维后换坐标系反而一行搞定。这是"换元改变的是描述方式而不是问题本身"的最佳注脚。',
      },
      traps: [
        { h: '极坐标漏乘 r', b: 'dxdy ≠ drdθ，面积元差一个 r。用"单位圆面积应为 π"自检可立刻发现。' },
        { h: '交换次序只换积分号', b: '必须先由原限反画区域 D，再重写限；直接把内外限互换得到的是另一个区域上的积分。' },
      ],
    },
    {
      id: 8, no: '08', name: '曲线与曲面积分', en: 'LINE & SURFACE INTEGRAL',
      sub: '第一类 · 第二类 · 格林 · 高斯',
      model: 'models/ch_line_helix.gltf',
      modelCap: '螺旋线：第二类曲线积分的载体——路径与方向都写进了定义',
      status: 'live',
      lead: '定向是这类积分的灵魂：换方向变号，闭合路径可化为区域积分。第一类问"积累了多少"，第二类问"沿这个方向做了多少功"。',
      sections: [
        {
          h: '8.1 第一类曲线积分：对弧长积分',
          html: `<div class="formula">$\\int_{L}f(x,y,z)\\,\\mathrm{d}s=\\lim\\sum f\\,\\Delta s_{i}$</div>
<p>物理原型：曲线形细线的质量（<span>$f$</span> 为线密度）。<strong>与方向无关</strong>——弧长没有正负。计算时把曲线参数化，<span>$\\mathrm{d}s=\\sqrt{x'(t)^{2}+y'(t)^{2}+z'(t)^{2}}\\,\\mathrm{d}t$</span>，然后化成一元定积分。</p>
<p>对称性照常可用：曲线关于某平面对称 + 函数为奇 ⟹ 积分为零。参数化的下限必须小于上限（<span>$\\mathrm{d}t\\ge 0$</span>），方向信息不由参数限携带——这是与第二类的关键区别。</p>`,
        },
        {
          h: '8.2 第二类曲线积分：对坐标积分',
          html: `<div class="formula">$\\int_{L}\\boldsymbol{F}\\cdot\\mathrm{d}\\boldsymbol{r}=\\int_{L}P\\,\\mathrm{d}x+Q\\,\\mathrm{d}y$</div>
<p>物理原型：变力沿路径做的功。<strong>强依赖方向</strong>：反向积分变号。参数化时曲线方向要和参数增长方向一致，这是计算的第一步。</p>
<p>两类积分可通过"弧长方向向量"互化：<span>$P\\,\\mathrm{d}x+Q\\,\\mathrm{d}y=(P\\cos\\alpha+Q\\cos\\beta)\\,\\mathrm{d}s$</span>，其中 <span>$(\\cos\\alpha,\\cos\\beta)$</span> 是切向单位向量。</p>`,
          boxes: [{ type: 'warn', label: '方向即符号', html: '第二类曲线积分换方向直接变号。题目若说"沿 L 的负方向"，答案先按正向算再添负号。' }],
        },
        {
          h: '8.3 格林公式：闭合曲线化为二重积分',
          html: `<div class="formula">$\\oint_{L}P\\,\\mathrm{d}x+Q\\,\\mathrm{d}y=\\iint_{D}\\left(\\dfrac{\\partial Q}{\\partial x}-\\dfrac{\\partial P}{\\partial y}\\right)\\mathrm{d}x\\mathrm{d}y$</div>
<p>使用条件三查：<span>$L$</span> <strong>闭合</strong>、<strong>正向</strong>（沿边界走，区域在左手边）、<span>$P,Q$</span> 在<strong>区域内有一阶连续偏导</strong>。条件三最常被忽略：若 <span>$P,Q$</span> 在区域内有奇点（如 <span>$\\dfrac{y}{x^{2}+y^{2}}$</span> 在原点），要"挖洞"——用小圆绕开奇点再套公式。</p>
<p>平面上 <span>$\\dfrac{\\partial Q}{\\partial x}=\\dfrac{\\partial P}{\\partial y}$</span> 在单连通区域内成立 ⟹ 积分与路径无关，可换一条好算的路径（通常换成折线）。</p>`,
        },
        {
          h: '8.4 第一类曲面积分：对面积积分',
          html: `<div class="formula">$\\iint_{\\Sigma}f(x,y,z)\\,\\mathrm{d}S=\\iint_{D}f\\left(x,y,\\sqrt{R^{2}-x^{2}-y^{2}}\\right)\\dfrac{R}{\\sqrt{R^{2}-x^{2}-y^{2}}}\\,\\mathrm{d}x\\mathrm{d}y$</div>
<p>（上式为球面 <span>$x^{2}+y^{2}+z^{2}=R^{2}$</span> 上半球投影到 <span>$xOy$</span> 面的情形，通用公式是 <span>$\\mathrm{d}S=\\sqrt{1+z_{x}^{2}+z_{y}^{2}}\\,\\mathrm{d}x\\mathrm{d}y$</span>。）物理原型：曲面壳的质量。<strong>无方向</strong>，恒正。</p>
<p>计算套路固定三步：把 <span>$z$</span> 用 <span>$x,y$</span> 表示代入被积函数、算偏导拼出 <span>$\\mathrm{d}S$</span>、投影区域上做二重积分。利用曲面对称性先化简，比硬算省一半时间。</p>`,
        },
        {
          h: '8.5 高斯公式与斯托克斯公式',
          html: `<div class="formula">$\\oiint_{\\Sigma}\\boldsymbol{F}\\cdot\\boldsymbol{n}\\,\\mathrm{d}S=\\iiint_{\\Omega}\\nabla\\cdot\\boldsymbol{F}\\,\\mathrm{d}V$</div>
<p>高斯公式把闭合曲面的第二类曲面积分化为内部的三重积分，条件同样是<strong>闭合 + 外侧 + 偏导连续</strong>。散度 <span>$\\nabla\\cdot\\boldsymbol{F}$</span> 是"单位体积向外净流出的通量"——通量守恒的局部化表达。</p>
<p>斯托克斯公式是格林公式的空间版：<span>$\\oint_{L}\\boldsymbol{F}\\cdot\\mathrm{d}\\boldsymbol{r}=\\iint_{\\Sigma}(\\nabla\\times\\boldsymbol{F})\\cdot\\boldsymbol{n}\\,\\mathrm{d}S$</span>，旋度场无旋 ⟹ 环量为零。到此，微积分基本定理完成了它的高维统一：</p>
<div class="formula">$\\int_{\\partial\\Omega}\\boldsymbol{F}\\cdot\\boldsymbol{n}\\,\\mathrm{d}S=\\int_{\\Omega}\\nabla\\cdot\\boldsymbol{F}\\,\\mathrm{d}V$</div>
<p>牛顿–莱布尼茨、格林、高斯、斯托克斯都是"边界上的信息 = 内部导数的积分"这一句话的特例。</p>`,
          boxes: [{ type: 'warn', label: '闭合才能用公式', html: '格林/高斯都要求边界闭合。不闭合就"补线"：补一条简单曲线使回路闭合，最后减掉补线上的积分。' }],
        },
      ],
      formulas: [
        { tex: '\\int_{L}P\\,\\mathrm{d}x+Q\\,\\mathrm{d}y=\\int_{t_{0}}^{t_{1}}\\left[P\\,x^{\\prime}(t)+Q\\,y^{\\prime}(t)\\right]\\mathrm{d}t', note: '第二类曲线积分参数化' },
        { tex: '\\oint_{L}P\\,\\mathrm{d}x+Q\\,\\mathrm{d}y=\\iint_{D}\\left(Q_{x}-P_{y}\\right)\\mathrm{d}x\\mathrm{d}y', note: '格林公式（正向闭合）' },
        { tex: '\\mathrm{d}S=\\sqrt{1+z_{x}^{2}+z_{y}^{2}}\\,\\mathrm{d}x\\mathrm{d}y', note: '曲面向 xy 面投影的面积元' },
        { tex: '\\oiint_{\\Sigma}\\boldsymbol{F}\\cdot\\boldsymbol{n}\\,\\mathrm{d}S=\\iiint_{\\Omega}\\nabla\\cdot\\boldsymbol{F}\\,\\mathrm{d}V', note: '高斯公式（外侧闭合）' },
      ],
      example: {
        title: '格林公式 + 挖洞',
        stem: '计算 $\\displaystyle\\oint_{L}\\dfrac{y\\,\\mathrm{d}x-x\\,\\mathrm{d}y}{x^{2}+y^{2}}$，其中 $L$ 为包含原点的任意正向简单闭曲线。',
        steps: [
          '$P=\\dfrac{y}{x^{2}+y^{2}},\\ Q=\\dfrac{-x}{x^{2}+y^{2}}$ 在原点无定义——奇点在区域内，不能直接套格林公式。',
          '挖洞：取小圆 $l:\\ x^{2}+y^{2}=\\varepsilon^{2}$（正向），在圆环区域上 $Q_{x}-P_{y}=0$，故大环上积分为零，得 $\\oint_{L}=\\oint_{l}$。',
          '小圆上 $x=\\varepsilon\\cos t,\\ y=\\varepsilon\\sin t$：分子 $y\\,\\mathrm{d}x-x\\,\\mathrm{d}y=-\\varepsilon^{2}\\mathrm{d}t$，分母 $\\varepsilon^{2}$。',
          '$\\displaystyle\\oint_{l}\\frac{-\\varepsilon^{2}\\,\\mathrm{d}t}{\\varepsilon^{2}}=\\int_{0}^{2\\pi}-\\mathrm{d}t=-2\\pi$。',
        ],
        concl: '奇点在区域内时先挖洞再套公式，把难算的路径换成规则路径。答案 $-2\\pi$ 只依赖绕原点圈数（绕数），与 $L$ 的具体形状无关——这是"积分与路径无关"的推广：与路径的"绕原点拓扑"有关。',
      },
      traps: [
        { h: '奇点在区域内仍套格林公式', b: 'P,Q 必须在闭区域内处处有连续偏导；有奇点先挖洞，否则结论可能差 2π 的整数倍。' },
        { h: '曲面投影时 dS 漏开根', b: 'dS = √(1+zₓ²+z_y²) dxdy，直接用 dxdy 当 dS 会把面积算小。' },
      ],
    },
    {
      id: 9, no: '09', name: '无穷级数', en: 'INFINITE SERIES',
      sub: '正项级数 · 幂级数 · 傅里叶',
      model: 'models/ex_standing_wave.glb',
      modelCap: '驻波：有限项叠加出波形，无穷项傅里叶级数能把任意周期信号分解为正弦之和',
      status: 'live',
      lead: '级数是"离散的积分"：把加法推到无穷后的收敛理论。两条主线贯穿全章——判别收敛（比较/比值/根值），以及把函数展开成幂级数或傅里叶级数。',
      sections: [
        {
          h: '9.1 收敛的定义：部分和的极限',
          html: `<div class="formula">$\\sum_{n=1}^{\\infty}u_{n}=S \\iff S_{n}=\\sum_{k=1}^{n}u_{k}\\to S$</div>
<p>级数敛散性完全由部分和序列定义。<strong>必要条件</strong>：收敛 ⟹ <span>$u_{n}\\to 0$</span>。反向不成立——调和级数 <span>$\\sum\\dfrac1n$</span> 通项趋于零却发散，它的发散证明（分组放大不等式）是全章最优雅的论证：</p>
<div class="formula">$1+\\tfrac12+\\left(\\tfrac13+\\tfrac14\\right)+\\left(\\tfrac15+\\cdots+\\tfrac18\\right)+\\cdots>1+\\tfrac12+\\tfrac12+\\tfrac12+\\cdots$</div>
<p>每个括号都大于 <span>$\\tfrac12$</span>，部分和必然越过任何界限。几何级数 <span>$\\sum q^{n}$</span> 是另一块基石：<span>$|q|<1$</span> 收敛于 <span>$\\dfrac{a}{1-q}$</span>，<span>$|q|\\ge 1$</span> 发散。</p>`,
        },
        {
          h: '9.2 正项级数：三大判别法',
          html: `<p>正项级数的部分和单调递增，收敛等价于有上界——这给了所有判别法一个共同底座：</p>
<ul>
<li><strong>比较判别法</strong>：与大项比。基准用 <span>$p$</span>-级数 <span>$\\sum\\dfrac{1}{n^{p}}$</span>（<span>$p>1$</span> 收敛，<span>$p\\le1$</span> 发散）与几何级数；</li>
<li><strong>比值（达朗贝尔）</strong>：<span>$\\lim\\dfrac{u_{n+1}}{u_{n}}=\\rho<1$</span> 收敛，<span>$\\rho>1$</span> 发散；含阶乘、指数时首选；</li>
<li><strong>根值（柯西）</strong>：<span>$\\lim\\sqrt[n]{u_{n}}=\\rho$</span>，含 <span>$n$</span> 次幂时首选。</li>
</ul>
<div class="formula">$\\lim_{n\\to\\infty}\\dfrac{u_{n+1}}{u_{n}}=\\rho\\ (<1\\ \\text{收敛},\\ >1\\ \\text{发散},\\ =1\\ \\text{失效})$</div>
<p><span>$\\rho=1$</span> 时判别失效，要退回比较判别法精细估计——比如 <span>$\\sum\\dfrac{1}{n^{2}}$</span> 和 <span>$\\sum\\dfrac1n$</span> 比值极限都是 1，敛散却相反。</p>`,
          boxes: [{ type: 'warn', label: '判别法边界', html: '比值/根值判别法在极限等于 1 时完全失效，此时必须换比较判别法；对交错级数则用莱布尼茨。' }],
        },
        {
          h: '9.3 交错级数与绝对收敛',
          html: `<p>莱布尼茨判别法：交错级数 <span>$\\sum(-1)^{n-1}a_{n}\\ (a_{n}>0)$</span>，若 <span>$a_{n}$</span> 单调递减且趋于零，则收敛，且余项不超过首 discarded 项——<span>$\\left|R_{n}\\right|\\le a_{n+1}$</span>，这使交错级数天然带误差估计。</p>
<p>更强的概念是<strong>绝对收敛</strong>：<span>$\\sum|u_{n}|$</span> 收敛 ⟹ <span>$\\sum u_{n}$</span> 收敛；反之收敛但不绝对收敛的叫<strong>条件收敛</strong>（如 <span>$\\sum\\dfrac{(-1)^{n-1}}{n}$</span>）。交换律在这里分野：绝对收敛级数可任意重排不改变和；条件收敛级数<strong>重排可以改变和</strong>，甚至重排成任何指定的数（Riemann 定理）——"无穷求和"不再天然满足交换律。</p>`,
        },
        {
          h: '9.4 幂级数：收敛半径与函数展开',
          html: `<div class="formula">$\\sum_{n=0}^{\\infty}a_{n}x^{n},\\quad R=\\dfrac{1}{\\lim\\sqrt[n]{|a_{n}|}}\\ \\text{（或比值法同式）}$</div>
<p>幂级数在 <span>$(-R,R)$</span> 内绝对收敛、端点单独讨论。收敛区间内可以逐项求导、逐项积分且收敛半径不变——这是把函数展开成级数的发动机：</p>
<div class="formula">$\\dfrac{1}{1-x}=\\sum_{n=0}^{\\infty}x^{n},\\quad e^{x}=\\sum_{n=0}^{\\infty}\\dfrac{x^{n}}{n!},\\quad \\ln(1+x)=\\sum_{n=1}^{\\infty}\\dfrac{(-1)^{n-1}}{n}x^{n}\\ (x\\in(-1,1])$</div>
<p>展开两步走：用已知展开式 + 换元/逐项运算拼出目标；或者直接算泰勒系数。展开式<strong>唯一</strong>（由各阶导数唯一决定），所以怎么展开结果都一样。应用上，幂级数可以求"积不出来"的积分（如 <span>$\\int e^{-x^{2}}\\mathrm{d}x$</span>）和求微分方程的级数解。</p>`,
        },
        {
          h: '9.5 傅里叶级数：用正弦搭万物',
          html: `<div class="formula">$f(x)\\sim\\dfrac{a_{0}}{2}+\\sum_{n=1}^{\\infty}\\left(a_{n}\\cos nx+b_{n}\\sin nx\\right),\\quad a_{n}=\\dfrac1\\pi\\int_{-\\pi}^{\\pi}f(x)\\cos nx\\,\\mathrm{d}x$</div>
<p>幂级数用多项式逼近，傅里叶级数用三角函数逼近——后者的基函数互相正交，系数由投影直接给出。收敛定理（狄利克雷）比泰勒宽松得多：只要分段单调有界，级数就收敛到 <span>$f$</span> 在间断点的左右极限平均值。</p>
<p>这就是它成为信号处理基石的原因：任何周期信号（方波、锯齿、语音）都可分解为频率 <span>$n$</span> 的正弦叠加，间断点处的 Gibbs 现象（约 9% 的过冲）则揭示了"逐点收敛"与"一致收敛"的差距。展厅里的驻波模型，正是有限个正弦分量叠加出波形的样子。</p>`,
        },
      ],
      formulas: [
        { tex: '\\sum_{n=0}^{\\infty}q^{n}=\\frac{a}{1-q}\\ (|q|<1)', note: '几何级数（收敛基准之一）' },
        { tex: '\\sum\\frac{1}{n^{p}}\\ \\text{收敛} \\iff p>1', note: 'p-级数（比较判别基准）' },
        { tex: 'e^{x}=\\sum_{n=0}^{\\infty}\\frac{x^{n}}{n!}\\ (x\\in\\mathbb{R})', note: '最重要的幂级数展开' },
        { tex: 'a_{n}=\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi}f(x)\\cos nx\\,\\mathrm{d}x', note: '傅里叶系数（正交投影）' },
      ],
      example: {
        title: '条件收敛与重排',
        stem: '判断 $\\sum_{n=1}^{\\infty}\\dfrac{(-1)^{n-1}}{n}$ 的敛散性；并说明为什么它的"和"依赖求和顺序。',
        steps: [
          '取绝对值得 $\\sum\\dfrac1n$，是发散的调和级数 ⟹ 不绝对收敛。',
          '原级数是交错级数：$a_{n}=\\dfrac1n$ 单调递减趋于零，由莱布尼茨判别法收敛——故为<strong>条件收敛</strong>。',
          '条件收敛 ⟹ 正项部分与负项部分各自发散到 $+\\infty$ 与 $-\\infty$。',
          '重排时可以让正项"多攒几个"再放负项：先取 $k$ 个正项再取 1 个负项，部分和被推向 $+\\infty$；按任意指定比例攒放，可收敛到任意实数（Riemann 重排定理）。',
        ],
        concl: '无穷求和不再满足交换律：绝对收敛才能安全重排，条件收敛的和依赖于顺序。这也是"级数收敛"必须用部分和极限定义、不能想当然当作有限和推广的原因。',
      },
      traps: [
        { h: '用通项趋于零判收敛', b: 'uₙ→0 只是必要条件；调和级数 Σ1/n 是标准反例。判敛必须用判别法，不能只看通项。' },
        { h: '幂级数端点不单独讨论', b: '收敛区间端点的敛散与内部无关：Σ xⁿ/n! 全轴收敛，但 Σ xⁿ/n 在 x=1 收敛、x=-1 发散。' },
      ],
    },
    {
      id: 10, no: '10', name: '常微分方程', en: 'ORDINARY DIFFERENTIAL EQUATIONS',
      sub: '一阶方程 · 高阶线性 · 常系数',
      model: 'models/ch_ode_flow.gltf',
      modelCap: '向量场流线：解曲线沿场方向推进，初值决定走哪一条',
      status: 'live',
      lead: '解方程的本质是找一条曲线，使它的每一点切向都等于给定的场。初值在这张"方向场地图"上选一个起点，解就是从那里出发的一条流线。',
      sections: [
        {
          h: '10.1 方程、解与方向场',
          html: `<div class="formula">$y\\'=f(x,y),\\qquad y=y(x)\\ \\text{使恒等式成立}$</div>
<p>一阶方程的解是一族曲线（通解含一个任意常数），初值条件 <span>$y(x_{0})=y_{0}$</span> 从中挑出一条（特解）。存在唯一性定理（Picard）：<span>$f$</span> 与 <span>$f_{y}$</span> 在初值邻域连续 ⟹ 过该点的解存在且唯一。</p>
<p>唯一性一旦被破坏，过同一点可以分叉出多条解——<span>$y\\'=\\sqrt{|y|}$</span> 在 <span>$y=0$</span> 处 <span>$f_{y}$</span> 爆炸，解可以从横轴上任意时刻"起飞"。3D 模型里的流线场，就是"每点切向 = 场向量"这一句话的可视化。</p>`,
        },
        {
          h: '10.2 可分离变量与一阶线性',
          html: `<p>两类可以直接积分的结构。可分离变量：把 <span>$x$</span> 与 <span>$y$</span> 各归一边再积分</p>
<div class="formula">$g(y)\\,\\mathrm{d}y=f(x)\\,\\mathrm{d}x\\ \\Longrightarrow\\ \\int g(y)\\,\\mathrm{d}y=\\int f(x)\\,\\mathrm{d}x$</div>
<p>一阶线性 <span>$y\\'+P(x)y=Q(x)$</span> 用积分因子：<span>$\\mu=e^{\\int P\\mathrm{d}x}$</span>，乘上方程左边恰好是 <span>$(\\mu y)\\'$</span>：</p>
<div class="formula">$y=e^{-\\int P\\mathrm{d}x}\\left(\\int Q\\,e^{\\int P\\mathrm{d}x}\\,\\mathrm{d}x+C\\right)$</div>
<p>公式不必背死，记住思想：<strong>找一个因子使左边变成某个乘积的导数</strong>。齐次方程 <span>$y\\'=\\varphi(y/x)$</span> 换元 <span>$u=y/x$</span> 后化为可分离变量。</p>`,
        },
        {
          h: '10.3 可降阶的高阶方程',
          html: `<p>三类可降阶结构，对应三种"缺什么就换什么"的换元：</p>
<ul>
<li><span>$y^{(n)}=f(x)$</span>：直接连续积分 <span>$n$</span> 次，每积一次添一个常数；</li>
<li>缺 <span>$y$</span>：令 <span>$p=y\\'$</span>，方程降为 <span>$p$</span> 的一阶方程，解出 <span>$p$</span> 再积一次得 <span>$y$</span>；</li>
<li>缺 <span>$x$</span>：令 <span>$p=y\\'$</span> 且把 <span>$p$</span> 视为 <span>$y$</span> 的函数，<span>$y\\'\\'=p\\dfrac{\\mathrm{d}p}{\\mathrm{d}y}$</span>。</li>
</ul>
<p>第三类的链式替换 <span>$y\\'\\'=p\\,p\\'$</span>（对 <span>$y$</span> 求导）最容易写错方向——是把 <span>$x$</span> 从方程里"蒸发"的关键一步。</p>`,
        },
        {
          h: '10.4 二阶常系数线性方程',
          html: `<div class="formula">$y\\'\\'+py\\\'+qy=0\\ \\Longrightarrow\\ r^{2}+pr+q=0,\\quad y=C_{1}e^{r_{1}x}+C_{2}e^{r_{2}x}$</div>
<p>特征方程按判别式三分：两实根、重根（<span>$y=(C_{1}+C_{2}x)e^{rx}$</span>）、共轭复根 <span>$r=\\alpha\\pm\\beta i$</span>（<span>$y=e^{\\alpha x}(C_{1}\\cos\\beta x+C_{2}\\sin\\beta x)$</span>）——最后一种正是弹簧振子"欠阻尼振荡"的数学形态。</p>
<p>非齐次 <span>$y\\'\\'+py\\\'+qy=f(x)$</span>：通解 = 齐次通解 + 一个特解。特解用<strong>待定系数法</strong>按 <span>$f$</span> 的形态设解：</p>
<div class="formula">$f=P_{m}(x)e^{\\lambda x}\\ \\Longrightarrow\\ y^{*}=x^{k}Q_{m}(x)e^{\\lambda x},\\ k=\\lambda\\ \\text{作为特征根的重数}$</div>
<p><span>$k$</span> 是补救因子：设出的解如果撞上齐次解（共振），要乘 <span>$x$</span> 修正。<span>$f$</span> 含三角函数时同样按复指数框架处理。</p>`,
          boxes: [{ type: 'warn', label: '共振要乘 x', html: '自由项的 λ 恰好是特征根时（如 y\'\'+y=cos x），按常规设的特解是齐次解、代进去恒等于零，必须乘 x 后重设。' }],
        },
        {
          h: '10.5 线性方程组与定性分析',
          html: `<div class="formula">$\\dot{\\boldsymbol{x}}=A\\boldsymbol{x},\\quad \\boldsymbol{x}(t)=e^{At}\\boldsymbol{x}_{0},\\quad e^{At}\\ \\text{由 } A\\ \\text{的特征结构决定}$</div>
<p>把一元理论推向向量：解由矩阵指数生成，特征值决定每个模态是衰减（负实部）、增长（正实部）还是振荡（复数）。二维相图按特征值分类：稳定结点、鞍点、中心、螺旋点——3D 模型的流线正是这些形态的直观呈现。</p>
<p>这就是全课程的"工业出口"：弹簧振子、RLC 电路、人口模型、控制系统，都归结为常系数线性方程（组）。特征值不仅给解，还给出定性结论——稳定性完全由特征值实部的符号决定，这与后续控制理论、机器学习的谱方法一脉相承。</p>`,
        },
      ],
      formulas: [
        { tex: 'y=e^{-\\int P\\mathrm{d}x}\\left(\\int Q e^{\\int P\\mathrm{d}x}\\,\\mathrm{d}x+C\\right)', note: '一阶线性方程通解（积分因子法）' },
        { tex: 'r^{2}+pr+q=0 \\Rightarrow y=C_{1}e^{r_{1}x}+C_{2}e^{r_{2}x}', note: '常系数齐次方程的特征根法' },
        { tex: 'y=e^{\\alpha x}(C_{1}\\cos\\beta x+C_{2}\\sin\\beta x)', note: '共轭复根情形（欠阻尼振荡）' },
        { tex: 'y^{*}=x^{k}Q_{m}(x)e^{\\lambda x}', note: '非齐次特解的待定形式（k 为共振修正）' },
      ],
      example: {
        title: '欠阻尼弹簧振子',
        stem: '求解 $y^{\\prime\\prime}+2y^{\\prime}+5y=0$，$y(0)=1$，$y^{\\prime}(0)=0$，并解释解的物理形态。',
        steps: [
          '特征方程 $r^{2}+2r+5=0$，判别式 $4-20<0$，得共轭复根 $r=-1\\pm2i$。',
          '通解 $y=e^{-x}(C_{1}\\cos 2x+C_{2}\\sin 2x)$。',
          '代初值：$y(0)=C_{1}=1$；求导后 $y^{\\prime}(0)=-C_{1}+2C_{2}=0 \\Rightarrow C_{2}=\\tfrac12$。',
          '特解 $y=e^{-x}\\left(\\cos 2x+\\tfrac12\\sin 2x\\right)=\\dfrac{\\sqrt5}{2}e^{-x}\\cos(2x-\\arctan\\tfrac12)$。',
        ],
        concl: '解是"指数衰减包络 × 等幅振荡"：振幅按 e⁻ˣ 衰减，频率由虚部 2 决定。阻尼小于临界值时系统振荡着回到平衡——欠阻尼。合写成一个余弦的步骤（辅助角公式）在写运动方程时常用。',
      },
      traps: [
        { h: '共振情形忘乘 x', b: '自由项形态与齐次解重合时，常规待定解代入恒为零；必须乘 x（重数决定乘几次）。' },
        { h: '缺 x 型方程用 y\'\'=p\' 而不是 p·dp/dy', b: '把 p 看成 y 的函数时 y\'\' = dp/dx = (dp/dy)·y\' = p·dp/dy，漏掉链式因子直接降阶失败。' },
      ],
    },
  ],

  insights: [
    { value: '100', unit: '万台', label: '2030 年全球人形机器人销量预期', src: '光大证券 · 人形机器人金属材料深度报告' },
    { value: '286.6', unit: '亿美元', label: '2032 年全球人形机器人市场规模', src: 'Precedence Research（光大证券引用）' },
    { value: '33', unit: '%', label: '2022–2032 年市场规模复合增速', src: 'Precedence Research（光大证券引用）' },
  ],
};
