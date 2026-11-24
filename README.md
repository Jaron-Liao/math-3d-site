# 高等数学 · 3D Edition

可交互的高等数学讲义：十座由 **Blender 参数曲面脚本**生成的 3D 模型，配合 **Three.js** 实时布光渲染与 **KaTeX** 公式排版，部署在 GitHub Pages。

- 站点：https://jaron-liao.github.io/math-3d-site/
- 首页：全屏 3D 主视觉（莫比乌斯带）+ 章节网格 + 实验室预览 + 数据洞察
- 章节页：正文（定义 / 证明思路 / 易错点 / 公式速查 / 例题）+ 本章模型可旋转
- 实验室：`z = a·sin(bx)·cos(cy)` 实时参数曲面，滑块调参、三种显示模式
- 展厅：封面流式 3D 空间导航，拖拽 / 滚轮切换，点击模型进入章节

## 结构

```
index.html            首页（hero / 章节 / 实验室预览 / 数据 / 关于）
chapter.html?c=1..10  章节阅读页（侧栏目录 + 正文 + 3D 面板）
lab.html              参数曲面实验室
gallery.html          3D 展厅
content/chapters.js   内容单一数据源（正文、公式、例题、易错点、模型映射）
css/site.css          设计系统（深黑金）
js/core.js            共用 3D 舞台（渲染器 / 程序化环境光 / GLB 加载 / 自适应）
js/home.js            Hero 场景
js/chapter.js         章节渲染 + 本章模型
js/lab.js             参数曲面
js/gallery.js         封面流展厅
assets/               本地依赖（Three.js 0.160 精简版、KaTeX 内联字体版、GLTFLoader / OrbitControls）
models/*.gltf         Blender 导出并转为内嵌 base64 的纯文本 glTF
_blender/             建模脚本（参数曲面 -> GLB -> 内嵌 glTF）
```

## 本地预览

```bash
python -m http.server 8799
# 打开 http://127.0.0.1:8799/
```

## 重新生成 3D 模型

需要 Blender 5.x：

```bash
blender -b --factory-startup --python _blender/build_assets.py
python _blender/glb2gltf.py        # GLB -> 内嵌 base64 的 .gltf（纯文本）
```

模型参数与章节内容一一对应，例如第 1 章的 ε 环带半径序列 `1.05 → 0.82 → 0.62 → 0.46 → 0.34`
即 `|aₙ − A| < ε` 的逐级收紧。

## 技术说明

- **无构建步骤**：原生 ES Modules + importmap，Three.js / KaTeX 全部本地托管，不依赖 CDN。
- **KaTeX 字体内联**：`assets/katex/katex-inline.css` 把 20 个 woff2 以 data URI 内嵌，离线也能正确排版。
- **模型为纯文本 glTF**：Blender 5 取消了 `GLTF_EMBEDDED`，因此先导出 GLB，再由脚本把 BIN chunk
  转为 base64 内嵌进 `.gltf`，仓库里不出现二进制文件。
- **部署**：`.github/workflows/pages.yml` 在 push 到 `main` 时构建并发布到 GitHub Pages。

## 内容进度

第 1、2、3 章正文已完稿；第 4–10 章为结构化骨架，逐章补全中。
