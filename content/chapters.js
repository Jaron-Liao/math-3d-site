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
    { id: 6, no: '06', name: '多元函数微分', en: 'MULTIVARIABLE CALCULUS', sub: '偏导 · 全微分 · 方向导数 · 极值', model: 'models/ch_partial_saddle.gltf', modelCap: '双曲抛物面：鞍点处沿不同方向单调性相反', status: 'outline', lead: '多维情形下"可微"强于"偏导存在"，切平面取代切线成为局部线性化的载体。', sections: [], formulas: [], example: null, traps: [] },
    { id: 7, no: '07', name: '重积分', en: 'MULTIPLE INTEGRALS', sub: '二重 · 三重 · 极坐标 · 雅可比', model: null, modelCap: '', status: 'outline', lead: '重积分的全部技巧集中在两件事：选坐标系、定积分限。', sections: [], formulas: [], example: null, traps: [] },
    { id: 8, no: '08', name: '曲线与曲面积分', en: 'LINE & SURFACE INTEGRAL', sub: '第一类 · 第二类 · 格林 · 高斯', model: 'models/ch_line_helix.gltf', modelCap: '螺旋线：曲线积分的路径与定向', status: 'outline', lead: '定向是这类积分的灵魂：换方向变号，闭合路径可化为区域积分。', sections: [], formulas: [], example: null, traps: [] },
    { id: 9, no: '09', name: '无穷级数', en: 'SERIES', sub: '正项级数 · 幂级数 · 傅里叶', model: null, modelCap: '', status: 'outline', lead: '级数是"离散的积分"，收敛判别与展开半径是两条主线。', sections: [], formulas: [], example: null, traps: [] },
    { id: 10, no: '10', name: '常微分方程', en: 'ORDINARY DIFFERENTIAL EQUATIONS', sub: '一阶方程 · 高阶线性 · 常系数', model: 'models/ch_ode_flow.gltf', modelCap: '向量场流线：解曲线沿场方向推进', status: 'outline', lead: '解方程的本质是找一条曲线，使它的每一点切向都等于给定的场。', sections: [], formulas: [], example: null, traps: [] },
  ],

  insights: [
    { value: '100', unit: '万台', label: '2030 年全球人形机器人销量预期', src: '光大证券 · 人形机器人金属材料深度报告' },
    { value: '286.6', unit: '亿美元', label: '2032 年全球人形机器人市场规模', src: 'Precedence Research（光大证券引用）' },
    { value: '33', unit: '%', label: '2022–2032 年市场规模复合增速', src: 'Precedence Research（光大证券引用）' },
  ],
};
