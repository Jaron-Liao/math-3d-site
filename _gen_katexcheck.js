/* 全书公式 KaTeX 服务端校验：chapters.js 内所有公式 + 正文 $...$ */
const katex = require('./assets/katex/katex.min.js');
globalThis.window = globalThis;
globalThis.window.katex = katex;
eval(require('fs').readFileSync('content/chapters.js', 'utf8'));
let fail = 0, total = 0;
function check(tex, tag) {
  total++;
  try {
    katex.renderToString(tex, { throwOnError: true, displayMode: false });
  } catch (e) {
    fail++;
    console.log('FAIL', tag, '::', tex.slice(0, 90), '::', e.message.slice(0, 140));
  }
}
window.SITE.chapters.forEach((c) => {
  (c.formulas || []).forEach((f) => check(f.tex, 'ch' + c.id + '-formula'));
  (c.sections || []).forEach((s, i) => {
    const texs = s.html.match(/\$\$[^$]+\$\$|\$[^$]+\$/g) || [];
    texs.forEach((t) => check(t.replace(/^\$+|\$+$/g, ''), 'ch' + c.id + '-sec' + (i + 1)));
  });
  if (c.example) {
    [c.example.stem, ...(c.example.steps || []), c.example.concl || '']
      .join(' ').match(/\$\$[^$]+\$\$|\$[^$]+\$/g)?.forEach((t) => check(t.replace(/^\$+|\$+$/g, ''), 'ch' + c.id + '-example'));
  }
  ((c.traps || []).map((t) => t.b + ' ' + t.h).join(' ').match(/\$\$[^$]+\$\$|\$[^$]+\$/g) || [])
    .forEach((t) => check(t.replace(/^\$+|\$+$/g, ''), 'ch' + c.id + '-trap'));
});
console.log('checked:', total, 'failed:', fail);
